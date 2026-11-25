// lib/syncEngine.ts
import { db, LocalExam, StudentRecord } from './db';

// Converts local Blob/File objects into Base64 strings for server transmission
const convertBlobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error);
    reader.onload = () => resolve(reader.result as string);
    reader.readAsDataURL(blob);
  });
};

let isSyncMutexLocked = false;

export interface SyncResult {
  success: boolean;
  counts?: {
    total: number;
    pushed?: number;
    pulled?: number;
  };
  error?: string;
}

export class ExamviaSyncEngine {
  private isSyncing = false;
  private onlineListenerAttached = false;

  public init() {
    if (typeof window === 'undefined' || this.onlineListenerAttached) return;

    window.addEventListener('online', () => {
      console.log('Network restored. Triggering Examvia background push & pull sync...');
      this.syncPendingData();
    });

    this.onlineListenerAttached = true;

    if (navigator.onLine) {
      this.syncPendingData();
    }
  }

  // Pulls remote exams & studentRecords from PostgreSQL and merges safely into Dexie
  public async pullRemoteData(examId?: string): Promise<{
    success: boolean;
    pulledCount: number;
    error?: string;
  }> {
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      return { success: false, pulledCount: 0, error: 'Device is offline.' };
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (!db.isOpen()) await db.open();

      const url = examId
        ? `/api/sync?examId=${encodeURIComponent(examId)}`
        : '/api/sync';

      const response = await fetch(url, {
        method: 'GET',
        headers: { Accept: 'application/json' },
        signal: controller.signal,
      });

      if (!response.ok) {
        let serverErrorMsg = 'Server rejected Examvia pull request.';
        try {
          const errData = await response.json();
          if (errData.error) serverErrorMsg = `Pull Error: ${errData.error}`;
        } catch {}
        throw new Error(serverErrorMsg);
      }

      const data = await response.json();
      if (!data.success) {
        return {
          success: false,
          pulledCount: 0,
          error: data.error || 'Unknown pull failure.',
        };
      }

      const remoteExams: LocalExam[] = Array.isArray(data.exams) ? data.exams : [];
      const remoteStudents: StudentRecord[] = Array.isArray(data.studentRecords)
        ? data.studentRecords
        : [];

      let pulledCount = 0;

      await db.transaction('rw', [db.exams, db.studentRecords], async () => {
        const localExams = await db.exams.toArray();
        const localExamMap = new Map(localExams.map((e) => [e.id, e]));

        const examsToUpsert: LocalExam[] = [];
        for (const remoteExam of remoteExams) {
          if (!remoteExam.id) continue;
          const existingLocal = localExamMap.get(remoteExam.id);

          // Do not overwrite unpushed local offline edits
          if (existingLocal && existingLocal.syncStatus !== 'synced') {
            continue;
          }

          examsToUpsert.push({
            ...remoteExam,
            syncStatus: 'synced',
          });
        }

        if (examsToUpsert.length > 0) {
          await db.exams.bulkPut(examsToUpsert);
          pulledCount += examsToUpsert.length;
        }

        const localStudents = await db.studentRecords.toArray();
        const localStudentMap = new Map(localStudents.map((s) => [s.id, s]));

        const studentsToUpsert: StudentRecord[] = [];
        for (const remoteStudent of remoteStudents) {
          if (!remoteStudent.id) continue;
          const existingLocal = localStudentMap.get(remoteStudent.id);

          // Do not overwrite unpushed local offline edits
          if (existingLocal && existingLocal.syncStatus !== 'synced') {
            continue;
          }

          studentsToUpsert.push({
            ...remoteStudent,
            omrBlob: existingLocal?.omrBlob,
            syncStatus: 'synced',
          });
        }

        if (studentsToUpsert.length > 0) {
          await db.studentRecords.bulkPut(studentsToUpsert);
          pulledCount += studentsToUpsert.length;
        }
      });

      return { success: true, pulledCount };
    } catch (err: any) {
      console.error('Examvia pull failed:', err);
      if (err.name === 'AbortError') {
        return { success: false, pulledCount: 0, error: 'Pull Timeout: Network too slow.' };
      }
      return {
        success: false,
        pulledCount: 0,
        error: err.message || 'Network error during pull.',
      };
    } finally {
      clearTimeout(timeoutId);
    }
  }

  // Core synchronization method: pushes pending local mutations, then pulls remote updates
  public async syncPendingData(options?: {
    pullAfterPush?: boolean;
    examId?: string;
  }): Promise<SyncResult> {
    const pullAfterPush = options?.pullAfterPush ?? true;

    if (this.isSyncing || isSyncMutexLocked || (typeof navigator !== 'undefined' && !navigator.onLine)) {
      return { success: false, error: 'Sync already in progress or device is offline.' };
    }

    this.isSyncing = true;
    isSyncMutexLocked = true;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
      if (!db.isOpen()) await db.open();

      // Catch both 'pending' and records where syncStatus was omitted (undefined)
      const allExams = await db.exams.toArray();
      const pendingExams = allExams.filter((e) => e.syncStatus !== 'synced');

      const allStudents = await db.studentRecords.toArray();
      const pendingStudents = allStudents.filter((s) => s.syncStatus !== 'synced');

      const totalPendingCount = pendingExams.length + pendingStudents.length;
      let pushedCount = 0;

      if (totalPendingCount > 0) {
        console.log(`Examvia Sync: Found ${totalPendingCount} pending mutations. Preparing bulk payload...`);

        const sanitizedExams = pendingExams.map((exam) => ({
          ...exam,
          examSet: exam.enableSets ? 'default' : null,
          clientTimestamp: exam.createdAt || Date.now(),
        }));

        const sanitizedStudents = [];
        for (const student of pendingStudents) {
          let omrImageBase64: string | null = null;
          if (student.omrBlob instanceof Blob) {
            try {
              omrImageBase64 = await convertBlobToBase64(student.omrBlob);
            } catch (e) {
              console.error(`Failed to convert OMR blob for student: ${student.id}`, e);
            }
          }

          const { omrBlob, ...serializableStudent } = student;
          sanitizedStudents.push({
            ...serializableStudent,
            omrImageUrl: omrImageBase64 || student.omrImageUrl || null,
            clientTimestamp: Date.now(),
          });
        }

        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          signal: controller.signal,
          body: JSON.stringify({
            exams: sanitizedExams,
            studentRecords: sanitizedStudents,
          }),
        });

        if (!response.ok) {
          let serverErrorMsg = 'Server rejected Examvia batch synchronization payload.';
          try {
            const errData = await response.json();
            if (errData.error) serverErrorMsg = `Sync Error: ${errData.error}`;
          } catch {}
          throw new Error(serverErrorMsg);
        }

        const result = await response.json();

        if (!result.success) {
          return { success: false, error: result.error || 'Unknown push synchronization failure.' };
        }

        await db.transaction('rw', [db.exams, db.studentRecords], async () => {
          for (const exam of pendingExams) {
            if (exam.id) await db.exams.update(exam.id, { syncStatus: 'synced' });
          }
          for (const student of pendingStudents) {
            if (student.id) await db.studentRecords.update(student.id, { syncStatus: 'synced' });
          }
        });

        pushedCount = result.counts?.total ?? totalPendingCount;
        console.log(`Examvia Sync: Successfully pushed ${pushedCount} rows to PostgreSQL.`);
      }

      let pulledCount = 0;
      if (pullAfterPush) {
        const pullResult = await this.pullRemoteData(options?.examId);
        if (!pullResult.success) {
          return {
            success: false,
            counts: { total: pushedCount, pushed: pushedCount, pulled: 0 },
            error: pullResult.error,
          };
        }
        pulledCount = pullResult.pulledCount;
      }

      return {
        success: true,
        counts: {
          total: pushedCount + pulledCount,
          pushed: pushedCount,
          pulled: pulledCount,
        },
      };
    } catch (err: any) {
      console.error('Examvia bulk sync flush failed:', err);
      if (err.name === 'AbortError') {
        return { success: false, error: 'Sync Timeout: Network connection too slow.' };
      }
      return { success: false, error: err.message || 'Network link error during sync.' };
    } finally {
      clearTimeout(timeoutId);
      this.isSyncing = false;
      isSyncMutexLocked = false;
    }
  }
}

export const examviaSyncEngine = new ExamviaSyncEngine();