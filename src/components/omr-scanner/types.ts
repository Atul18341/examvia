// components/omr-scanner/types.ts
import type { StudentRecord as DbStudentRecord } from '@/lib/db';

export interface Point {
  x: number;
  y: number;
}

export interface DetectedCorners {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export interface NormalizedRect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D';
export type BookletSetCode = OptionLetter | 'BLANK' | 'MULTIPLE';
export type QuestionStatus = OptionLetter | 'BLANK' | 'MULTIPLE';
export type AnswerKeyMap = Record<number, OptionLetter>;
export type CornerKey = keyof DetectedCorners;

export interface BookletDetectionResult {
  detectedSet: BookletSetCode;
  fillRatios: Record<OptionLetter, number>;
  confidence: number;
}

export interface QuestionResponseResult {
  questionNumber: number;
  selectedOption: QuestionStatus;
  fillRatios: Record<OptionLetter, number>;
  isCorrect?: boolean;
  correctOption?: OptionLetter;
}

export interface CalculatedOMRResult {
  examId?: string;
  bookletSet: BookletSetCode;
  totalQuestions: number;
  attempted: number;
  blank: number;
  multiple: number;
  correct: number;
  wrong: number;
  marksPerCorrect: number;
  negativeMarks: number;
  totalScore: number;
  maxMarks: number;
  percentage: number;
  passingMarks: number;
  passed: boolean;
  responses: QuestionResponseResult[];
  calculatedAt: string;
}

export interface OMRScanPayload {
  examId?: string;
  bookletSet: BookletSetCode;
  totalQuestions: number;
  responses: QuestionResponseResult[];
  summary: {
    attempted: number;
    blank: number;
    multiple: number;
    correct: number;
    wrong: number;
  };
}

export interface PresentStudentOption
  extends Omit<DbStudentRecord, 'checkedIn' | 'bookletSet'> {
  attendance?: 'present' | 'absent';
  checkedIn: boolean;
  bookletSet?: OptionLetter;
  omrSerialNo?: string;
}

export interface OMRScannerProps {
  examId?: string;
  defaultTotalQuestions?: number;
  answerKey?: Record<number, OptionLetter>;
  students?: PresentStudentOption[];
  onScanComplete?: (payload: OMRScanPayload, warpedCanvas: HTMLCanvasElement) => void;
  onResultCalculated?: (result: CalculatedOMRResult, warpedCanvas: HTMLCanvasElement | null) => void;
  onStudentMapped?: (
    student: PresentStudentOption,
    result: CalculatedOMRResult | null,
    warpedCanvas: HTMLCanvasElement | null
  ) => void;
}

export const CORNER_ORDER: { key: CornerKey; label: string }[] = [
  { key: 'topLeft', label: 'TL' },
  { key: 'topRight', label: 'TR' },
  { key: 'bottomRight', label: 'BR' },
  { key: 'bottomLeft', label: 'BL' },
];

export const OPTIONS: OptionLetter[] = ['A', 'B', 'C', 'D'];

export const DEFAULT_BOOKLET_ROI: NormalizedRect = {
  x: 0.818,
  y: 0.112,
  w: 0.178,
  h: 0.105,
};

export const DEFAULT_RESPONSE_GRID_ROI: NormalizedRect = {
  x: 0.005,
  y: 0.252,
  w: 0.990,
  h: 0.722,
};