// src/app/api/sync/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool, PoolClient } from 'pg';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('FATAL: JWT_SECRET environment variable is missing in production.');
}
const effectiveSecret = JWT_SECRET || 'your-super-secure-jwt-secret-key';

const globalForPg = global as unknown as { syncPgPool?: Pool };
const pool =
  globalForPg.syncPgPool ||
  new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: true },
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPg.syncPgPool = pool;
}

interface AuthJwtPayload {
  userId?: string;
  id?: string;
  email: string;
  role: string;
}

function verifyCoordinatorRequest(
  request: NextRequest
): { userId: string; email: string; role: string } | null {
  const cookieToken = request.cookies.get('examvia_token')?.value;
  const authHeader = request.headers.get('authorization');
  const bearerToken = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
  const token = cookieToken || bearerToken;

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, effectiveSecret) as AuthJwtPayload;
    const resolvedUserId = decoded.userId || decoded.id;
    if (!resolvedUserId || !['coordinator', 'admin'].includes(decoded.role)) {
      return null;
    }
    return { userId: resolvedUserId, email: decoded.email, role: decoded.role };
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  const authUser = verifyCoordinatorRequest(request);
  console.log("Auth-User:",authUser)
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid coordinator session required.' },
      { status: 401 }
    );
  }

  let client: PoolClient | null = null;
  try {
    const { searchParams } = new URL(request.url);
    const examId = searchParams.get('examId');

    client = await pool.connect();

    // Fetch only exams owned by the authenticated userId
    const examsResult = examId
      ? await client.query(
          'SELECT * FROM exams WHERE id = $1 AND user_id = $2',
          [examId, authUser.userId]
        )
      : await client.query(
          'SELECT * FROM exams WHERE user_id = $1 ORDER BY created_at DESC',
          [authUser.userId]
        );

    // Fetch only student records belonging to exams owned by authUser.userId
    const studentsResult = examId
      ? await client.query(
          `SELECT sr.*
           FROM student_records sr
           INNER JOIN exams e ON sr.exam_id = e.id
           WHERE sr.exam_id = $1 AND e.user_id = $2`,
          [examId, authUser.userId]
        )
      : await client.query(
          `SELECT sr.*
           FROM student_records sr
           INNER JOIN exams e ON sr.exam_id = e.id
           WHERE e.user_id = $1`,
          [authUser.userId]
        );

    const exams = examsResult.rows.map((row) => ({
      id: row.id,
      examTitle: row.exam_title,
      examMode: row.exam_mode,
      durationMinutes: row.duration_minutes,
      totalQuestions: row.total_questions,
      passingMarks: row.passing_marks,
      enableNegativeMarking: row.enable_negative_marking,
      negativeMarkValue: Number(row.negative_mark_value ?? 0),
      enableSets: row.enable_sets,
      enableSectionalCutoff: row.enable_sectional_cutoff ?? false,
      instructions: row.instructions ?? undefined,
      subjects: row.subjects ?? [],
      questionPaper: row.question_paper ?? [],
      answerKey: row.answer_key ?? {},
      createdAt: row.created_at ?? new Date().toISOString(),
      syncStatus: 'synced' as const,
    }));

    const studentRecords = studentsResult.rows.map((row) => {
      const normalizedAttendance: 'present' | 'absent' =
        row.attendance === 'present' || row.checked_in ? 'present' : 'absent';

      return {
        id: row.id,
        examId: row.exam_id,
        name: row.name,
        rollNo: row.roll_no,
        attendance: normalizedAttendance,
        checkedIn: Boolean(row.checked_in ?? normalizedAttendance === 'present'),
        checkInTime: row.check_in_time ?? undefined,
        bookletSet: row.booklet_set ?? undefined,
        submittedAt: row.submitted_at ?? undefined,
        omrScanned: row.omr_scanned,
        omrImageUrl: row.omr_image_url ?? undefined,
        marksScored: row.marks_scored ?? undefined,
        maxMarks: row.max_marks ?? undefined,
        passed: row.passed ?? undefined,
        syncStatus: 'synced' as const,
      };
    });

    return NextResponse.json({ success: true, exams, studentRecords });
  } catch (error: any) {
    console.error('PostgreSQL Examvia pull failed:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch remote records.' },
      { status: 500 }
    );
  } finally {
    if (client) client.release();
  }
}

export async function POST(request: NextRequest) {
  const authUser = verifyCoordinatorRequest(request);
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized: Valid coordinator session required.' },
      { status: 401 }
    );
  }

  let client: PoolClient | null = null;
  try {
    client = await pool.connect();
    const { exams, studentRecords } = await request.json();

    await client.query('BEGIN');

    let processedCount = 0;

    if (Array.isArray(exams) && exams.length > 0) {
      for (const exam of exams) {
        // Stamp user_id from verified JWT and block overwriting another user's exam ID
        const query = `
          INSERT INTO exams (
            id, user_id, exam_title, exam_mode, duration_minutes, total_questions,
            passing_marks, enable_negative_marking, negative_mark_value, enable_sets,
            instructions, subjects, question_paper, answer_key
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            exam_title = EXCLUDED.exam_title,
            exam_mode = EXCLUDED.exam_mode,
            duration_minutes = EXCLUDED.duration_minutes,
            total_questions = EXCLUDED.total_questions,
            passing_marks = EXCLUDED.passing_marks,
            enable_negative_marking = EXCLUDED.enable_negative_marking,
            negative_mark_value = EXCLUDED.negative_mark_value,
            enable_sets = EXCLUDED.enable_sets,
            instructions = EXCLUDED.instructions,
            subjects = EXCLUDED.subjects,
            question_paper = EXCLUDED.question_paper,
            answer_key = EXCLUDED.answer_key
          WHERE exams.user_id = EXCLUDED.user_id;
        `;
        const res = await client.query(query, [
          exam.id,
          authUser.userId,
          exam.examTitle,
          exam.examMode,
          exam.durationMinutes,
          exam.totalQuestions,
          exam.passingMarks,
          exam.enableNegativeMarking || false,
          exam.negativeMarkValue || 0,
          exam.enableSets || false,
          exam.instructions,
          JSON.stringify(exam.subjects || []),
          JSON.stringify(exam.questionPaper || []),
          JSON.stringify(exam.answerKey || {}),
        ]);

        if (res.rowCount === 0) {
          throw new Error(`Forbidden: Exam ID "${exam.id}" belongs to another coordinator.`);
        }
        processedCount++;
      }
    }

    if (Array.isArray(studentRecords) && studentRecords.length > 0) {
      for (const student of studentRecords) {
        // Verify parent exam belongs to authUser.userId before upserting student record
        const ownershipCheck = await client.query(
          'SELECT 1 FROM exams WHERE id = $1 AND user_id = $2 LIMIT 1',
          [student.examId, authUser.userId]
        );

        if (ownershipCheck.rows.length === 0) {
          throw new Error(
            `Forbidden: Cannot attach student record to unowned exam "${student.examId}".`
          );
        }
// Inside POST(request) -> studentRecords upsert:
        const resolvedAttendance =
          student.attendance === 'present' || student.checkedIn ? 'present' : 'absent';

        const query = `
          INSERT INTO student_records (
            id, exam_id, name, roll_no, attendance, checked_in, check_in_time,
            booklet_set, submitted_at, omr_scanned, omr_image_url, marks_scored, max_marks, passed
          )
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO UPDATE SET
            exam_id = EXCLUDED.exam_id,
            name = EXCLUDED.name,
            roll_no = EXCLUDED.roll_no,
            attendance = EXCLUDED.attendance,
            checked_in = EXCLUDED.checked_in,
            check_in_time = EXCLUDED.check_in_time,
            booklet_set = EXCLUDED.booklet_set,
            submitted_at = EXCLUDED.submitted_at,
            omr_scanned = EXCLUDED.omr_scanned,
            omr_image_url = EXCLUDED.omr_image_url,
            marks_scored = EXCLUDED.marks_scored,
            max_marks = EXCLUDED.max_marks,
            passed = EXCLUDED.passed;
        `;
        await client.query(query, [
          student.id,
          student.examId,
          student.name,
          student.rollNo,
          resolvedAttendance,
          resolvedAttendance === 'present' || Boolean(student.checkedIn),
          student.checkInTime ?? null,
          student.bookletSet ?? null,
          student.submittedAt ?? null,
          student.omrScanned || false,
          student.omrImageUrl ?? null,
          student.marksScored ?? null,
          student.maxMarks ?? null,
          student.passed ?? null,
        ]);
        processedCount++;
      }
    }

    await client.query('COMMIT');

    return NextResponse.json({
      success: true,
      counts: { total: processedCount },
    });
  } catch (error: any) {
    if (client) await client.query('ROLLBACK');
    console.error('PostgreSQL Examvia bulk sync transaction failed details:', {
      message: error.message,
      detail: error.detail,
      constraint: error.constraint,
    });
    const status = error.message?.startsWith('Forbidden:') ? 403 : 500;
    return NextResponse.json(
      { success: false, error: error.message || 'Database transaction rolled back.' },
      { status }
    );
  } finally {
    if (client) client.release();
  }
}