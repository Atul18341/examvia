// lib/db.ts
import Dexie, { Table } from 'dexie';

export interface QuestionItem {
  id: number;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'A' | 'B' | 'C' | 'D';
}

export interface LocalExam {
  id?: string;
  examTitle: string;
  examMode: 'offline' | 'online';
  durationMinutes: number;
  passingMarks: number;
  enableNegativeMarking: boolean;
  negativeMarkValue: number;
  enableSets: boolean;
  enableSectionalCutoff: boolean;
  subjects: { name: string; questionsCount: number; cutoff: number }[];
  totalQuestions: number;
  questionPaper?: QuestionItem[];
  answerKey?: Record<number, string>;
  instructions?: string;
  createdAt: string;
  syncStatus?: 'pending' | 'synced';
}

export interface StudentRecord {
  id: string;
  examId: string;
  name: string;
  rollNo: string;
  attendance?: 'present' | 'absent';
  checkedIn: boolean;
  checkInTime?: string;
  bookletSet?: 'A' | 'B' | 'C' | 'D';
  submittedAt?: string;
  omrScanned: boolean;
  omrImageUrl?: string;
  omrBlob?: Blob;
  marksScored?: number;
  maxMarks?: number;
  passed?: boolean;
  syncStatus?: 'pending' | 'synced';
}

export interface PendingScan {
  id?: number;
  examId: string;
  studentRoll: string;
  answers: Record<string, string>;
  confidenceScore: number;
  timestamp: number;
  syncStatus?: 'pending' | 'synced';
  synced: boolean;
}

export interface ExamKey {
  examId: string;
  correctAnswers: Record<string, string>;
  syncStatus?: 'pending' | 'synced';
}

export class ExamViaDatabase extends Dexie {
  scans!: Table<PendingScan, number>;
  keys!: Table<ExamKey, string>;
  exams!: Table<LocalExam, string>;
  studentRecords!: Table<StudentRecord, string>;

  constructor() {
    super('ExamViaLocalDB');
    this.version(3).stores({
      scans: '++id, examId, studentRoll, syncStatus, synced',
      keys: 'examId, syncStatus',
      exams: 'id, examTitle, examMode, createdAt, syncStatus',
      studentRecords: 'id, examId, rollNo, syncStatus'
    });
  }
}

export const db = new ExamViaDatabase();