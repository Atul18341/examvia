// src/app/dashboard/[examId]/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft,
  FileText,
  Trash2,
  ScanLine,
  X,
  Edit3,
  Save,
  Users,
  UserCheck,
  CheckCircle,
  Percent,
  Clock,
  BookOpen,
  Timer,
  Printer,
  CheckCircle2,
  XCircle,
  Eye,
  Award,
  CloudSync,
  AlertCircle,
  RefreshCw,
  Download,
  Upload,
} from 'lucide-react';
import { db, LocalExam, StudentRecord as DbStudentRecord } from '@/lib/db';
import { examviaSyncEngine } from '@/lib/syncEngine';
import LogOutButton from '@/components/LogOutButton';

interface DashboardStudentRecord extends DbStudentRecord {
  checkedIn: boolean;
  checkInTime?: string;
  bookletSet?: 'A' | 'B' | 'C' | 'D';
}

function parseCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (ch === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += ch;
    }
  }
  result.push(current.trim());
  return result;
}

export default function ExamDashboardPage() {
  const params = useParams<{ examId: string }>();
  const router = useRouter();
  const examId = decodeURIComponent(params.examId || '');

  const [exam, setExam] = useState<LocalExam | null>(null);
  const [students, setStudents] = useState<DashboardStudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync States
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Modals
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingExam, setEditingExam] = useState<LocalExam | null>(null);
  const [isViewOmrOpen, setIsViewOmrOpen] = useState(false);
  const [selectedStudentOmr, setSelectedStudentOmr] =
    useState<DashboardStudentRecord | null>(null);

  // CSV Upload Feedback
  const csvFileInputRef = useRef<HTMLInputElement | null>(null);
  const [attendanceNotice, setAttendanceNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const loadExamData = useCallback(async () => {
    if (!examId) return;
    const [foundExam, rawRecords] = await Promise.all([
      db.exams.get(examId),
      db.studentRecords.where('examId').equals(examId).toArray(),
    ]);

    setExam(foundExam || null);
    setStudents(
      rawRecords.map((item) => {
        const extended = item as DashboardStudentRecord;
        const resolvedOmrUrl =
          item.omrImageUrl ||
          (item.omrBlob instanceof Blob ? URL.createObjectURL(item.omrBlob) : undefined);

        return {
          ...item,
          checkedIn:
            extended.checkedIn !== undefined
              ? Boolean(extended.checkedIn)
              : Boolean(item.omrScanned || item.submittedAt),
          checkInTime: extended.checkInTime,
          
          bookletSet: extended.bookletSet,
          omrImageUrl: resolvedOmrUrl,
          
        };
      })
    );
  }, [examId]);

  useEffect(() => {
    let isMounted = true;

    async function initWorkspace() {
      try {
        await loadExamData();
      } catch (err) {
        console.error('Failed to load exam workspace:', err);
      } finally {
        if (isMounted) setLoading(false);
      }

      examviaSyncEngine.init();

      if (typeof navigator !== 'undefined' && navigator.onLine && examId) {
        try {
          if (isMounted) setIsSyncing(true);
          const result = await examviaSyncEngine.syncPendingData({ examId });
          if (!isMounted) return;
          if (result.success) {
            await loadExamData();
            setSyncError(null);
          } else if (result.error && !result.error.includes('already in progress')) {
            setSyncError(result.error);
          }
        } catch (err: any) {
          if (isMounted) setSyncError(err?.message || 'Sync failed.');
        } finally {
          if (isMounted) setIsSyncing(false);
        }
      }
    }

    initWorkspace();
    return () => {
      isMounted = false;
    };
  }, [examId, loadExamData]);

  const pendingCount =
    (exam && exam.syncStatus !== 'synced' ? 1 : 0) +
    students.filter((s) => s.syncStatus !== 'synced').length;

  const handleScopedSync = useCallback(async () => {
    if (isSyncing || !examId) return;
    setIsSyncing(true);
    setSyncError(null);

    try {
      const result = await examviaSyncEngine.syncPendingData({ examId });
      if (result.success) {
        await loadExamData();
      } else {
        setSyncError(result.error || 'Synchronization failed.');
      }
    } catch (err: any) {
      setSyncError(err?.message || 'Network error during sync.');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, examId, loadExamData]);

  const handleDeleteExam = async () => {
    if (!exam?.id) return;
    if (confirm('Are you sure you want to delete this exam blueprint?')) {
      await db.exams.delete(exam.id);
      router.replace('/dashboard');
    }
  };

  const handleSaveEditedExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExam?.id) return;

    const examToSave = { ...editingExam, syncStatus: 'pending' as const };
    await db.exams.put(examToSave);
    setExam(examToSave);
    setIsEditModalOpen(false);
    setEditingExam(null);

    if (navigator.onLine) {
      handleScopedSync();
    }
  };

  const isOfflineMode = exam?.examMode === 'offline';
  const isOnlineMode = exam?.examMode === 'online';

  // Download Attendance CSV Template
  const handleDownloadAttendanceTemplate = () => {
    const headers = isOnlineMode
      ? ['Roll No', 'Candidate Name', 'Checked In (Yes/No)', 'Check-In Time', 'Submitted At']
      : ['Roll No', 'Candidate Name', 'Attendance (Present/Absent)'];

    const rows =
      students.length > 0
        ? students.map((s) =>
            isOnlineMode
              ? [
                  s.rollNo,
                  `"${s.name.replace(/"/g, '""')}"`,
                  s.checkedIn ? 'Yes' : 'No',
                  s.checkInTime || '',
                  s.submittedAt || '',
                ]
              : [
                  s.rollNo,
                  `"${s.name.replace(/"/g, '""')}"`,
                  s.checkedIn ? 'Present' : 'Absent',
                ]
          )
        : isOnlineMode
        ? [
            ['202601', '"Aarav Kumar"', 'Yes', '09:15 AM', '10:12 AM'],
            ['202602', '"Priya Sharma"', 'No', '', ''],
          ]
        : [
            ['202601', '"Aarav Kumar"', 'Present'],
            ['202602', '"Priya Sharma"', 'Absent'],
          ];

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Examvia_Attendance_${examId}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Upload Attendance CSV
  const handleUploadAttendanceCsv = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !examId) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const cleanedText = ((event.target?.result as string) || '').replace(/^\uFEFF/, '');
        const lines = cleanedText
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0);

        if (lines.length < 2) {
          setAttendanceNotice({
            type: 'error',
            message: 'CSV file must contain a header row and at least one candidate row.',
          });
          return;
        }

        const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
        const findCol = (keywords: string[]) =>
          headers.findIndex((h) => keywords.some((kw) => h.includes(kw)));

        const rollIdx = findCol(['roll']);
        const nameIdx = findCol(['name', 'candidate', 'student']);
        const statusIdx = findCol(['attendance', 'checked', 'present', 'status']);
        const checkInTimeIdx = findCol(['check-in time', 'checkin time', 'time']);
        const submittedIdx = findCol(['submitted']);

        if (rollIdx === -1 || nameIdx === -1) {
          setAttendanceNotice({
            type: 'error',
            message: 'Invalid CSV columns. Required headers: "Roll No" and "Candidate Name".',
          });
          return;
        }

        let updatedCount = 0;
        let addedCount = 0;

        const byRoll = new Map<string, DashboardStudentRecord>();
        students.forEach((s) => byRoll.set(s.rollNo.trim(), { ...s }));

        const upsertedRecords: DashboardStudentRecord[] = [];

        for (let i = 1; i < lines.length; i++) {
          const cols = parseCsvLine(lines[i]);
          const rollNo = cols[rollIdx]?.trim();
          const name = cols[nameIdx]?.trim();
          if (!rollNo || !name) continue;

          const existing = byRoll.get(rollNo);
          const rawStatus = statusIdx !== -1 ? (cols[statusIdx] || '').toLowerCase() : '';
          const checkedIn =
            statusIdx !== -1
              ? ['yes', 'true', '1', 'present', 'checked in', 'active', 'p'].includes(rawStatus)
              : existing?.checkedIn ?? false;

          if (existing) updatedCount++;
          else addedCount++;

          const record: DashboardStudentRecord = {
            id: existing?.id || `${examId}-${rollNo}`,
            examId,
            rollNo,
            name,
            checkedIn,
            checkInTime:
              isOnlineMode && checkInTimeIdx !== -1 && cols[checkInTimeIdx]
                ? cols[checkInTimeIdx]
                : existing?.checkInTime,
            submittedAt:
              isOnlineMode && submittedIdx !== -1 && cols[submittedIdx]
                ? cols[submittedIdx]
                : existing?.submittedAt,
            attendance: checkedIn ? 'present' : 'absent',
            bookletSet: existing?.bookletSet,
            omrScanned: existing?.omrScanned ?? false,
            omrImageUrl: existing?.omrImageUrl,
            omrBlob: existing?.omrBlob,
            marksScored: existing?.marksScored,
            maxMarks: existing?.maxMarks,
            passed: existing?.passed,
            syncStatus: 'pending',
          };

          upsertedRecords.push(record);
        }

        if (upsertedRecords.length > 0) {
          await db.studentRecords.bulkPut(upsertedRecords);
          await loadExamData();
        }

        setAttendanceNotice({
          type: 'success',
          message: `Attendance CSV saved: ${updatedCount} updated, ${addedCount} added.`,
        });
      } catch (err) {
        console.error('CSV import error:', err);
        setAttendanceNotice({
          type: 'error',
          message: 'Failed to import CSV into local database.',
        });
      } finally {
        if (csvFileInputRef.current) csvFileInputRef.current.value = '';
      }
    };
    reader.readAsText(file);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500 font-bold text-sm gap-3">
        <RefreshCw size={20} className="animate-spin text-indigo-600" />
        <span>Loading exam workspace...</span>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center space-y-4">
        <h2 className="text-xl font-black text-slate-900">Exam Blueprint Not Found</h2>
        <p className="text-xs text-slate-500 max-w-md">
          No blueprint with ID <span className="font-mono font-bold">{examId}</span> exists in local storage.
        </p>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-1.5 bg-slate-900 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
        >
          <ArrowLeft size={14} /> Back to Dashboard
        </Link>
      </div>
    );
  }

  const appearedCount = students.filter((s) => s.checkedIn).length;
  const turnoutPct = students.length > 0 ? Math.round((appearedCount / students.length) * 100) : 0;
  const evaluatedStudents = students.filter((s) => s.passed !== undefined);
  const passedStudents = evaluatedStudents.filter((s) => s.passed).length;
  const passRatioPct =
    evaluatedStudents.length > 0
      ? `${((passedStudents / evaluatedStudents.length) * 100).toFixed(1)}%`
      : '—';

  const getSyncButtonStyle = () => {
    if (isSyncing) return 'bg-blue-50 text-blue-600 border-blue-200 cursor-not-allowed';
    if (syncError) return 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100';
    if (pendingCount > 0)
      return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse hover:bg-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/20 min-h-screen font-sans overflow-x-hidden">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/90 backdrop-blur-md p-4 sm:p-5 lg:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 gap-4">
        <div className="space-y-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider text-indigo-600 hover:text-indigo-800"
          >
            <ArrowLeft size={13} /> All Exams Registry
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            {exam.examTitle}
          </h1>
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
              ID: {exam.id}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-lg font-black uppercase tracking-wider text-[10px] ${
                isOfflineMode
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
              }`}
            >
              Mode: {exam.examMode}
            </span>
            <span className="text-slate-600 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
              <Timer size={12} className="text-indigo-600" /> {exam.durationMinutes}m
            </span>
            <span className="text-slate-600 font-medium flex items-center gap-1 bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-200 text-[11px]">
              <BookOpen size={12} className="text-indigo-600" /> {exam.totalQuestions} Qs
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 w-full lg:w-auto justify-start lg:justify-end">
          <button
            type="button"
            onClick={handleScopedSync}
            disabled={isSyncing}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all shadow-2xs cursor-pointer ${getSyncButtonStyle()}`}
          >
            {isSyncing ? (
              <>
                <RefreshCw size={13} className="animate-spin" />
                <span>Syncing</span>
              </>
            ) : syncError ? (
              <>
                <CloudSync size={13} />
                <span>Retry</span>
              </>
            ) : pendingCount > 0 ? (
              <>
                <AlertCircle size={13} />
                <span>Sync ({pendingCount})</span>
              </>
            ) : (
              <>
                <CheckCircle size={13} />
                <span>Synced</span>
              </>
            )}
          </button>

          <Link
            href={`/exams/${exam.id}/question-paper`}
            className="flex items-center justify-center gap-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-xl font-black uppercase tracking-wider shadow-2xs text-[11px]"
          >
            <BookOpen size={11} /> Question Paper
          </Link>

          {isOfflineMode && (
            <>
              <Link
                href={`/exams/${exam.id}/omr-scanner`}
                className="flex items-center justify-center gap-1 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white px-3 py-2 rounded-xl font-black uppercase tracking-wider shadow-2xs text-[11px]"
              >
                <ScanLine size={11} /> OMR Scanner
              </Link>
              <Link
                href={`/exams/${exam.id}/template`}
                className="flex items-center justify-center gap-1 bg-slate-900 hover:bg-slate-800 text-white px-3 py-2 rounded-xl font-black uppercase tracking-wider shadow-2xs text-[11px]"
              >
                <Printer size={11} /> Print OMR
              </Link>
            </>
          )}

          <button
            onClick={() => {
              setEditingExam({ ...exam });
              setIsEditModalOpen(true);
            }}
            className="flex items-center justify-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200/80 px-2.5 py-2 rounded-xl font-black uppercase tracking-wider cursor-pointer text-[11px]"
            title="Edit Exam"
          >
            <Edit3 size={13} />
          </button>

          <button
            onClick={handleDeleteExam}
            className="flex items-center justify-center gap-1 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/80 px-2.5 py-2 rounded-xl font-black uppercase tracking-wider cursor-pointer text-[11px]"
            title="Delete Exam"
          >
            <Trash2 size={13} />
          </button>

          <LogOutButton />
        </div>
      </div>

      {/* Exam-Specific Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white/90 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Students Registered
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{students.length}</h3>
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
              Exam roster
            </span>
          </div>
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
        </div>

        <div className="bg-white/90 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isOfflineMode ? 'Students Present' : 'Students Appeared'}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{appearedCount}</h3>
            <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              {turnoutPct}% Turnout
            </span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center">
            <UserCheck size={24} />
          </div>
        </div>

        <div className="bg-white/90 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              {isOfflineMode ? 'OMR Scanned' : 'Allotted Duration'}
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {isOfflineMode
                ? students.filter((s) => s.omrScanned).length
                : `${exam.durationMinutes || 0} mins`}
            </h3>
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
              {isOfflineMode ? 'Evaluated sheets' : 'CBT window'}
            </span>
          </div>
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            {isOfflineMode ? <CheckCircle size={24} /> : <Clock size={24} />}
          </div>
        </div>

        <div className="bg-white/90 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Passing Ratio
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{passRatioPct}</h3>
            <span className="inline-block text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              Cutoff: {exam.passingMarks} marks
            </span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Percent size={24} />
          </div>
        </div>
      </div>

      {/* Student Roster & Evaluation Matrix */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 border-b border-slate-100 flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">
              Candidate Roster & Evaluation Matrix
            </h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Manage attendance, OMR scanning results, and evaluation status for {exam.examTitle}.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadAttendanceTemplate}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 text-slate-800 px-3.5 py-2 rounded-xl border border-slate-200/80 text-[11px] font-black uppercase tracking-wider cursor-pointer"
            >
              <Download size={13} className="text-indigo-600" />
              <span>Attendance Template</span>
            </button>

            <label className="flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3.5 py-2 rounded-xl border border-indigo-200/80 text-[11px] font-black uppercase tracking-wider cursor-pointer">
              <Upload size={13} />
              <span>Upload Attendance CSV</span>
              <input
                ref={csvFileInputRef}
                type="file"
                accept=".csv,text/csv"
                onChange={handleUploadAttendanceCsv}
                className="hidden"
              />
            </label>

            <div className="flex items-center gap-2 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200/80 text-[11px] font-mono font-bold text-slate-700">
              <FileText size={13} className="text-indigo-600" /> {students.length} Roster
            </div>
          </div>
        </div>

        {attendanceNotice && (
          <div
            className={`px-4 sm:px-6 py-3 border-b flex items-center justify-between gap-3 text-xs font-bold ${
              attendanceNotice.type === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-rose-50 text-rose-800 border-rose-200'
            }`}
          >
            <span>{attendanceNotice.message}</span>
            <button
              type="button"
              onClick={() => setAttendanceNotice(null)}
              className="p-1 rounded-lg hover:bg-black/5 cursor-pointer"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {students.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs font-bold">
            No student records found for this exam. Upload an Attendance CSV to populate the roster.
          </div>
        ) : (
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 text-[10px]">
                  <th className="p-4 sm:p-5">Roll No</th>
                  <th className="p-4 sm:p-5">Candidate Name</th>
                  <th className="p-4 sm:p-5">
                    {isOfflineMode ? 'Attendance' : 'Checked In & Time'}
                  </th>
                  <th className="p-4 sm:p-5">
                    {isOfflineMode ? 'Booklet / Scan' : 'Submitted At'}
                  </th>
                  <th className="p-4 sm:p-5">Marks Scored</th>
                  <th className="p-4 sm:p-5">Status</th>
                  <th className="p-4 sm:p-5 text-right">OMR Preview</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {students.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="p-4 sm:p-5 font-mono font-black text-slate-900">
                      {student.rollNo}
                    </td>
                    <td className="p-4 sm:p-5 font-bold text-slate-900">{student.name}</td>
                    <td className="p-4 sm:p-5">
                      {student.checkedIn ? (
                        <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-black text-[10px]">
                          <CheckCircle2 size={13} />{' '}
                          {isOfflineMode
                            ? 'Present'
                            : `Active${student.checkInTime ? ` (${student.checkInTime})` : ''}`}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl font-black text-[10px]">
                          <XCircle size={13} /> {isOfflineMode ? 'Absent' : 'Inactive'}
                        </span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 font-mono text-xs">
                      {isOfflineMode ? (
                        <div className="flex items-center gap-2">
                          {student.bookletSet && (
                            <span className="bg-indigo-50 text-indigo-700 border border-indigo-200 px-2 py-0.5 rounded-lg font-black text-[10px]">
                              Set {student.bookletSet}
                            </span>
                          )}
                          <span
                            className={`font-black text-[10px] ${
                              student.omrScanned ? 'text-emerald-600' : 'text-amber-600'
                            }`}
                          >
                            {student.omrScanned ? 'Scanned' : 'Pending'}
                          </span>
                        </div>
                      ) : (
                        student.submittedAt || '—'
                      )}
                    </td>
                    <td className="p-4 sm:p-5 font-mono font-black text-slate-900 text-sm">
                      {student.marksScored !== undefined
                        ? `${student.marksScored} / ${student.maxMarks}`
                        : '—'}
                    </td>
                    <td className="p-4 sm:p-5">
                      {student.passed !== undefined ? (
                        student.passed ? (
                          <span className="inline-flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-xl font-black text-[10px]">
                            <Award size={13} /> Passed
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-rose-700 bg-rose-50 border border-rose-200 px-3 py-1 rounded-xl font-black text-[10px]">
                            Failed
                          </span>
                        )
                      ) : (
                        <span className="text-slate-400">—</span>
                      )}
                    </td>
                    <td className="p-4 sm:p-5 text-right">
                      {student.omrImageUrl ? (
                        <button
                          onClick={() => {
                            setSelectedStudentOmr(student);
                            setIsViewOmrOpen(true);
                          }}
                          className="inline-flex items-center gap-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-2 rounded-xl font-black text-xs cursor-pointer"
                        >
                          <Eye size={14} /> View OMR
                        </button>
                      ) : (
                        <span className="text-slate-400 italic text-xs">Not Available</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* View OMR Modal */}
      {isViewOmrOpen && selectedStudentOmr && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <div>
                <h3 className="font-black text-slate-900 text-base">OMR Sheet Preview</h3>
                <p className="text-xs text-slate-500">
                  {selectedStudentOmr.name} (Roll No: {selectedStudentOmr.rollNo})
                </p>
              </div>
              <button
                onClick={() => setIsViewOmrOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-2xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <img
                src={selectedStudentOmr.omrImageUrl}
                alt="OMR Sheet Scan"
                className="w-full h-80 object-cover rounded-2xl border border-slate-200"
              />
              <button
                onClick={() => setIsViewOmrOpen(false)}
                className="w-full py-3 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Exam Modal */}
      {isEditModalOpen && editingExam && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden">
            <div className="flex justify-between items-center p-5 border-b border-slate-100 bg-slate-50">
              <h3 className="font-black text-slate-900 text-base">Edit Exam Blueprint</h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 bg-white border border-slate-200 rounded-2xl cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSaveEditedExam} className="p-6 space-y-4 text-xs">
              <div>
                <label className="block font-black text-slate-700 uppercase mb-1.5">
                  Exam Title
                </label>
                <input
                  type="text"
                  value={editingExam.examTitle}
                  onChange={(e) =>
                    setEditingExam({ ...editingExam, examTitle: e.target.value })
                  }
                  required
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1.5">
                    Duration (Minutes)
                  </label>
                  <input
                    type="number"
                    value={editingExam.durationMinutes}
                    onChange={(e) =>
                      setEditingExam({
                        ...editingExam,
                        durationMinutes: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1.5">
                    Total Questions
                  </label>
                  <input
                    type="number"
                    value={editingExam.totalQuestions}
                    onChange={(e) =>
                      setEditingExam({
                        ...editingExam,
                        totalQuestions: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl font-mono font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1.5">
                    Passing Marks
                  </label>
                  <input
                    type="number"
                    value={editingExam.passingMarks}
                    onChange={(e) =>
                      setEditingExam({
                        ...editingExam,
                        passingMarks: Number(e.target.value),
                      })
                    }
                    required
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl font-mono font-bold"
                  />
                </div>
                <div>
                  <label className="block font-black text-slate-700 uppercase mb-1.5">
                    Exam Mode
                  </label>
                  <select
                    value={editingExam.examMode}
                    onChange={(e) =>
                      setEditingExam({
                        ...editingExam,
                        examMode: e.target.value as 'offline' | 'online',
                      })
                    }
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-300/80 rounded-2xl font-bold"
                  >
                    <option value="offline">Offline (OMR)</option>
                    <option value="online">Online (CBT)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-5 py-3 bg-slate-100 text-slate-700 font-bold uppercase rounded-2xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black uppercase rounded-2xl cursor-pointer"
                >
                  <Save size={15} /> Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}