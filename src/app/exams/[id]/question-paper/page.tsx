// app/exams/create-paper/[id]/page.tsx
'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db, LocalExam } from '@/lib/db';
import {
  Loader2,
  Trash2,
  Save,
  ArrowLeft,
  FileText,
  Download,
  Eye,
  Sparkles,
  Layers,
  Upload,
  KeyRound,
  FileSpreadsheet,
} from 'lucide-react';
import { Document, Page, Text, View, StyleSheet, pdf, PDFViewer, Font, Image } from '@react-pdf/renderer';
import mammoth from 'mammoth';
import QRCode from 'qrcode';

interface QuestionItem {
  id: number;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
  correctAnswer: 'Select Correct Option' | 'A' | 'B' | 'C' | 'D' | null;
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

// Register Noto Sans font for proper Hindi & multilingual support
Font.register({
  family: 'NotoSans',
  fonts: [
    { src: '/fonts/NotoSansDevanagari-Regular.ttf', fontWeight: 400 },
    { src: '/fonts/NotoSansDevanagari-Bold.ttf', fontWeight: 700 },
  ],
});

// Styles for @react-pdf/renderer mirroring the professional OMR Sheet header layout
const pdfStyles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#ffffff',
    paddingTop: 30,
    paddingLeft: 30,
    paddingRight: 30,
    paddingBottom: 50,
    fontFamily: 'NotoSans',
  },
  // Professional Header Container matching OMR sheet
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1.5,
    borderBottomColor: '#0f172a',
    paddingBottom: 6,
    marginBottom: 10,
  },
  logoBox: {
    borderWidth: 1,
    borderColor: '#0f172a',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    width: 80,
    height: 60,
  },
  logoImage: {
    width: 72,
    height: 56,
  },
  logoFallbackText: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#475569',
    textAlign: 'center',
  },
  headerCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 6,
  },
  organizerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 2,
    letterSpacing: 0.5,
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  examTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#334155',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  qrBadgeBox: {
    borderWidth: 1,
    borderColor: '#0f172a',
    padding: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    width: 55,
  },
  qrImage: {
    width: 48,
    height: 48,
  },
  secureCodeSubText: {
    fontSize: 6,
    color: '#475569',
    textAlign: 'center',
    marginTop: 0.5,
  },
  topMetaTable: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#000000',
    marginBottom: 14,
  },
  metaLeftColumn: {
    flex: 1,
    padding: 6,
    borderRightWidth: 1,
    borderRightColor: '#000000',
    justifyContent: 'center',
  },
  metaRightColumn: {
    width: 90,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 6,
    backgroundColor: '#f8fafc',
  },
  rollNoRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rollNoLabel: {
    fontSize: 8.5,
    fontWeight: 'bold',
    color: '#000000',
    marginRight: 6,
  },
  rollNoBoxesRow: {
    flexDirection: 'row',
  },
  rollNoBoxCell: {
    width: 16,
    height: 18,
    borderWidth: 1,
    borderColor: '#000000',
    marginRight: 2,
    backgroundColor: '#ffffff',
  },
  setLabelTop: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#64748b',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  setTextValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  instructionsContainer: {
    borderWidth: 1,
    borderColor: '#000000',
    borderRadius: 2,
    padding: 8,
    marginBottom: 16,
    backgroundColor: '#ffffff',
  },
  instructionsTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#000000',
    textTransform: 'uppercase',
    marginBottom: 6,
    borderBottomWidth: 0.5,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 2,
  },
  instructionRow: {
    marginBottom: 6,
  },
  instructionEnglish: {
    fontSize: 10,
    color: '#1e293b',
    lineHeight: 1.5,
    textAlign: 'justify',
  },
  instructionHindi: {
    fontSize: 10,
    color: '#334155',
    lineHeight: 1.5,
    marginTop: 1,
    textAlign: 'justify',
  },
  subjectHeader: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    padding: 6,
    marginBottom: 12,
    borderRadius: 2,
  },
  subjectHeaderText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#0f172a',
    textTransform: 'uppercase',
  },
  questionWrapper: {
    marginBottom: 10,
    breakInside: 'avoid',
  },
  questionContainer: {
    flexDirection: 'column',
  },
  questionText: {
    fontSize: 9.5,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
    lineHeight: 1.3,
  },
  optionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingLeft: 12,
  },
  optionItem: {
    width: '50%',
    fontSize: 9,
    color: '#334155',
    marginBottom: 3,
    lineHeight: 1.25,
  },
  roughWorkHeading: {
    fontSize: 13,
    fontWeight: 'bold',
    textAlign: 'center',
    textTransform: 'uppercase',
    color: '#000000',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#000000',
    paddingBottom: 6,
  },
  roughWorkBox: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#94a3b8',
    borderRadius: 2,
    backgroundColor: '#ffffff',
  },
  footer: {
    position: 'absolute',
    bottom: 15,
    left: 30,
    right: 30,
    borderTopWidth: 0.5,
    borderTopColor: '#cbd5e1',
    paddingTop: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerText: {
    fontSize: 8,
    color: '#64748b',
  },
});

const RoughWorkPage = ({ examTitle, examSet }: { examTitle: string; examSet: string }) => (
  <Page size="A4" style={pdfStyles.page}>
    <Text style={pdfStyles.roughWorkHeading}>Area for Rough Work / रफ कार्य के लिए स्थान</Text>
    <View style={pdfStyles.roughWorkBox} />

    <View style={pdfStyles.footer} fixed>
      <Text style={pdfStyles.footerText}>{examTitle} — ({examSet || 'SET-A'})</Text>
      <Text style={pdfStyles.footerText} render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`} />
    </View>
  </Page>
);

interface ExamPaperPDFProps {
  exam: LocalExam;
  instructions: string;
  questions: QuestionItem[];
  examSet: string;
  orgProfile: { organizerName: string; logoDataUri: string };
  qrDataUrl: string;
}

const ExamPaperPDF = ({ exam, instructions, questions, examSet, orgProfile, qrDataUrl }: ExamPaperPDFProps) => {
  const subjects =
    exam.subjects && exam.subjects.length > 0
      ? exam.subjects
      : [{ name: 'General', questionsCount: questions.length }];

  let currentIndex = 0;
  const subjectGroupedQuestions = subjects
    .map((sub) => {
      const count = sub.questionsCount || 0;
      const subQuestions = questions.slice(currentIndex, currentIndex + count);
      currentIndex += count;
      return {
        subjectName: sub.name,
        questions: subQuestions,
      };
    })
    .filter((group) => group.questions.length > 0);

  if (currentIndex < questions.length) {
    subjectGroupedQuestions.push({
      subjectName: 'General Questions',
      questions: questions.slice(currentIndex),
    });
  }

  const baseContentPages = 1 + subjectGroupedQuestions.length;
  const totalPagesWithOneRough = baseContentPages + 1;
  const roughPagesCount = totalPagesWithOneRough % 2 == 0 ? 2 : 1;

  const bilingualInstructions = [
    {
      en: '1. Candidates must write their Roll Number clearly in the boxes provided above.',
      hi: 'परीक्षार्थी ऊपर दिए गए बॉक्स में अपना रोल नंबर स्पष्ट रूप से लिखें।',
    },
    {
      en: '2. Read all instructions carefully. All questions are compulsory.',
      hi: 'सभी निर्देशों को ध्यानपूर्वक पढ़ें। सभी प्रश्न अनिवार्य हैं।',
    },
    {
      en: '3. Use only Blue or Black Ballpoint Pen to darken bubbles on OMR sheet.',
      hi: 'ओएमआर शीट पर गोले भरने के लिए केवल नीले या काले बॉलपॉइंट पेन का उपयोग करें।',
    },
    {
      en: '4. Rough work must be done only in the space provided at the end of this booklet.',
      hi: 'रफ कार्य इस पुस्तिका के अंत में दिए गए स्थान पर ही किया जाना चाहिए।',
    },
    {
      en: `5. This booklet contains ${questions.length} questions. Check the booklet immediately upon receiving it to ensure it contains all printed questions and pages as specified on the cover, without any missing pages.`,
      hi: `इस पुस्तिका में ${questions.length} प्रश्न हैं। पुस्तिका प्राप्त होते ही जांच लें कि इसमें कवर पर बताए गए सभी मुद्रित प्रश्न और पेज मौजूद हैं, कोई पेज छूटा नहीं है।`,
    },
    {
      en: '6. There is negative marking for incorrect answers. Each incorrect response will incur a deduction of 1/3 mark.',
      hi: 'गलत उत्तरों के लिए नकारात्मक अंकन (नेगेटिव मार्किंग) किया जाएगा। प्रत्येक गलत उत्तर पर 1/3 अंक की कटौती की जाएगी ।',
    },
    {
      en: '7. Electronic devices, calculators, smartwatches, and mobile phones are strictly prohibited inside the examination hall.',
      hi: 'परीक्षा हॉल के अंदर इलेक्ट्रॉनिक उपकरण, कैलकुलेटर, स्मार्टवॉच और मोबाइल फोन का उपयोग पूर्णतः वर्जित है।',
    },
    {
      en: '8. Candidates must hand over both the OMR answer sheet and this question booklet to the invigilator before leaving the examination hall.',
      hi: 'परीक्षार्थियों को परीक्षा हॉल छोड़ने से पहले ओएमआर उत्तर पत्रक और यह प्रश्न पुस्तिका दोनों कक्ष निरीक्षक को सौंपनी होगी।',
    },
  ];

  return (
    <Document>
      <Page size="A4" style={pdfStyles.page}>
        {/* Professional Header matching OMR Template (Logo, Organizing Body, Exam Name, QR Code) */}
        <View style={pdfStyles.headerContainer}>
          <View style={pdfStyles.logoBox}>
            {orgProfile.logoDataUri ? (
              <Image src={orgProfile.logoDataUri} style={pdfStyles.logoImage} />
            ) : (
              <Text style={pdfStyles.logoFallbackText}>EXAMVIA</Text>
            )}
          </View>

          <View style={pdfStyles.headerCenter}>
            <Text style={pdfStyles.organizerTitle}>
              {orgProfile.organizerName || "LET'S INSPIRE BIHAR MADHUBANI CHAPTER"}
            </Text>
            <Text style={pdfStyles.examTitle}>{exam.examTitle}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 4 }}>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#475569' }}>
                Duration: {exam.durationMinutes} Mins
              </Text>
              <Text style={{ fontSize: 10, fontWeight: 'bold', color: '#475569' }}>
                | Max Marks: {questions.length * 4}
              </Text>
            </View>
          </View>

          <View style={pdfStyles.qrBadgeBox}>
            {qrDataUrl && <Image src={qrDataUrl} style={pdfStyles.qrImage} />}
            <Text style={pdfStyles.secureCodeSubText}>{exam.id || 'EXAM'}</Text>
          </View>
        </View>

        <View style={pdfStyles.topMetaTable}>
          <View style={pdfStyles.metaLeftColumn}>
            <View style={pdfStyles.rollNoRow}>
              <Text style={pdfStyles.rollNoLabel}>Roll Number / रोल नंबर:</Text>
              <View style={pdfStyles.rollNoBoxesRow}>
                {[...Array(7)].map((_, i) => (
                  <View key={i} style={pdfStyles.rollNoBoxCell} />
                ))}
              </View>
            </View>
          </View>
          <View style={pdfStyles.metaRightColumn}>
            <Text style={pdfStyles.setLabelTop}>Question Booklet</Text>
            <Text style={pdfStyles.setTextValue}>{examSet || 'SET-A'}</Text>
          </View>
        </View>

        <View style={pdfStyles.instructionsContainer}>
          <Text style={pdfStyles.instructionsTitle}>Instructions / महत्वपूर्ण निर्देश:</Text>
          {bilingualInstructions.map((item, idx) => (
            <View key={idx} style={pdfStyles.instructionRow}>
              <Text style={pdfStyles.instructionEnglish}>{item.en}</Text>
              <Text style={pdfStyles.instructionHindi}>{item.hi}</Text>
            </View>
          ))}
        </View>

        <View style={pdfStyles.footer} fixed>
          <Text style={pdfStyles.footerText}>
            {exam.examTitle} — ({examSet || 'SET-A'})
          </Text>
          <Text
            style={pdfStyles.footerText}
            render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
          />
        </View>
      </Page>

      {subjectGroupedQuestions.map((group, groupIdx) => (
        <Page key={groupIdx} size="A4" style={pdfStyles.page}>
          <View style={pdfStyles.subjectHeader}>
            <Text style={pdfStyles.subjectHeaderText}>
              SECTION {String.fromCharCode(65 + groupIdx)}: {group.subjectName.toUpperCase()}
            </Text>
          </View>
          {group.questions.map((q) => (
            <View key={q.id} style={pdfStyles.questionWrapper}>
              <View style={pdfStyles.questionContainer}>
                <Text style={pdfStyles.questionText}>
                  {q.id}. {q.questionText || '[Type your question here...]'}
                </Text>
                <View style={pdfStyles.optionsGrid}>
                  {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                    <Text key={optKey} style={pdfStyles.optionItem}>
                      ({optKey}) {q.options[optKey] || `Option ${optKey}...`}
                    </Text>
                  ))}
                </View>
              </View>
            </View>
          ))}

          <View style={pdfStyles.footer} fixed>
            <Text style={pdfStyles.footerText}>
              {exam.examTitle} — ({examSet || 'SET-A'})
            </Text>
            <Text
              style={pdfStyles.footerText}
              render={({ pageNumber, totalPages }) => `Page ${pageNumber} of ${totalPages}`}
            />
          </View>
        </Page>
      ))}

      {[...Array(roughPagesCount)].map((_, i) => (
        <RoughWorkPage key={i} examTitle={exam.examTitle} examSet={examSet} />
      ))}
    </Document>
  );
};

export default function CreateQuestionPaperPage() {
  const params = useParams();
  const examId = (params?.id as string) || '';
  const router = useRouter();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const answerKeyInputRef = useRef<HTMLInputElement>(null);

  const [exam, setExam] = useState<LocalExam | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);

  // Organization branding & QR state
  const [orgProfile, setOrgProfile] = useState({
    organizerName: "LET'S INSPIRE BIHAR MADHUBANI CHAPTER",
    logoDataUri: '',
  });
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  // Multi-set state management & setting flag
  const [multiSetEnabled, setMultiSetEnabled] = useState<boolean>(true);
  const [activeSet, setActiveSet] = useState<string>('SET_A');
  const [allSetsQuestions, setAllSetsQuestions] = useState<Record<string, QuestionItem[]>>({
    SET_A: [],
    SET_B: [],
    SET_C: [],
    SET_D: [],
  });

  const [instructions, setInstructions] = useState<string>(
    '1. Candidates must write their Roll Number clearly in the boxes provided above.\n2. Read all instructions carefully. All questions are compulsory.\n3. Use only Blue or Black Ballpoint Pen to darken bubbles on OMR sheet.\n4. Rough work must be done only in the space provided at the end of this booklet.'
  );

  // Deterministic Shuffling Utility for Sets B, C, D (maintaining continuous global question IDs)
  const generateShuffledVariant = (
    masterQuestions: QuestionItem[],
    seedOffset: number
  ): QuestionItem[] => {
    const cloned = masterQuestions.map((q) => ({
      ...q,
      options: { ...q.options },
    }));

    for (let i = cloned.length - 1; i > 0; i--) {
      const j = (i * 31 + seedOffset) % (i + 1);
      [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }

    return cloned.map((q, idx) => ({
      ...q,
      id: idx + 1,
    }));
  };

  useEffect(() => {
    async function loadData() {
      try {
        // Load organization branding profile from LocalStorage/DB
        const savedProfile = localStorage.getItem('examvia_org_profile');
        if (savedProfile) {
          const parsed = JSON.parse(savedProfile);
          setOrgProfile({
            organizerName: parsed.organizerName || "LET'S INSPIRE BIHAR MADHUBANI CHAPTER",
            logoDataUri: parsed.logoDataUri || '',
          });
        }

        // Generate QR code data URL for verification
        const qrPayload = JSON.stringify({
          examId: examId,
          platform: 'Examvia-LYSS',
        });
        const dataUrl = await QRCode.toDataURL(qrPayload, {
          width: 200,
          margin: 1,
          color: { dark: '#0f172a', light: '#ffffff' },
        });
        setQrDataUrl(dataUrl);

        // Load exam record
        const record = await db.exams.get(examId);
        if (record) {
          setExam(record);
          if (record.instructions) {
            setInstructions(record.instructions);
          }

          const isMultiSet = record.enableSets !== undefined ? record.enableSets : true;
          setMultiSetEnabled(isMultiSet);

          const loadedAnswerKey = record.answerKey || {};
          let baseQuestions: QuestionItem[] = [];

          if (record.questionPaper && record.questionPaper.length > 0) {
            baseQuestions = record.questionPaper.map((q: any, idx: number): QuestionItem => {
              const val = q.correctAnswer || loadedAnswerKey[q.id || idx + 1];
              const validAnswer: QuestionItem['correctAnswer'] =
                val === 'A' || val === 'B' || val === 'C' || val === 'D'
                  ? val
                  : 'Select Correct Option';
              return {
                ...q,
                id: idx + 1,
                correctAnswer: validAnswer,
              };
            });
          } else {
            const total = record.totalQuestions || 0;
            baseQuestions = Array.from({ length: total }, (_, i) => {
              const val = loadedAnswerKey[i + 1];
              const validAnswer: QuestionItem['correctAnswer'] =
                val === 'A' || val === 'B' || val === 'C' || val === 'D'
                  ? val
                  : 'Select Correct Option';
              return {
                id: i + 1,
                questionText: '',
                options: { A: '', B: '', C: '', D: '' },
                correctAnswer: validAnswer,
              };
            });
          }

          const setVariants = {
            SET_A: baseQuestions,
            SET_B:
              (record as any).allSetsQuestions?.SET_B ||
              generateShuffledVariant(baseQuestions, 13),
            SET_C:
              (record as any).allSetsQuestions?.SET_C ||
              generateShuffledVariant(baseQuestions, 29),
            SET_D:
              (record as any).allSetsQuestions?.SET_D ||
              generateShuffledVariant(baseQuestions, 47),
          };

          setAllSetsQuestions(setVariants);
          setQuestions(setVariants['SET_A']);
        }
      } catch (error) {
        console.error('Failed to load exam blueprint:', error);
      } finally {
        setLoading(false);
      }
    }

    if (examId) {
      loadData();
    }
  }, [examId]);

  // Download Answer Key CSV Template
  const handleDownloadAnswerKeyTemplate = () => {
    if (!exam) return;
    const headers = multiSetEnabled
      ? ['Question No', 'Set A', 'Set B', 'Set C', 'Set D']
      : ['Question No', 'Answer'];

    const currentSets = {
      ...allSetsQuestions,
      [activeSet]: questions,
    };

    const total = Math.max(questions.length, exam.totalQuestions || 0);
    const rows: string[][] = [];

    for (let i = 1; i <= total; i++) {
      const getAns = (setKey: string) => {
        const found = currentSets[setKey]?.find((q) => q.id === i);
        return found?.correctAnswer && found.correctAnswer !== 'Select Correct Option'
          ? found.correctAnswer
          : '';
      };

      if (multiSetEnabled) {
        rows.push([String(i), getAns('SET_A'), getAns('SET_B'), getAns('SET_C'), getAns('SET_D')]);
      } else {
        rows.push([String(i), getAns(activeSet)]);
      }
    }

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${exam.examTitle.replace(/\s+/g, '_')}_AnswerKey_Template.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  // Handle Answer Key CSV Upload and Save Immediately to IndexedDB
  const handleAnswerKeyUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !exam) return;

    try {
      const rawText = (await file.text()).replace(/^\uFEFF/, '');
      const lines = rawText
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter(Boolean);

      if (lines.length < 2) {
        alert('Answer key CSV must contain a header row and at least one question row.');
        return;
      }

      const headers = parseCsvLine(lines[0]).map((h) => h.toLowerCase());
      const qCol = headers.findIndex(
        (h) => h.includes('q') || h.includes('no') || h.includes('num')
      );
      const setACol = headers.findIndex(
        (h) => h === 'set a' || h === 'set_a' || h === 'a' || h.includes('answer')
      );
      const setBCol = headers.findIndex((h) => h === 'set b' || h === 'set_b' || h === 'b');
      const setCCol = headers.findIndex((h) => h === 'set c' || h === 'set_c' || h === 'c');
      const setDCol = headers.findIndex((h) => h === 'set d' || h === 'set_d' || h === 'd');

      if (qCol === -1 || setACol === -1) {
        alert(
          'Invalid CSV headers. Use "Question No, Answer" or "Question No, Set A, Set B, Set C, Set D".'
        );
        return;
      }

      const validOpts = new Set(['A', 'B', 'C', 'D']);
      const parsedMap: Record<string, Record<number, 'A' | 'B' | 'C' | 'D'>> = {
        SET_A: {},
        SET_B: {},
        SET_C: {},
        SET_D: {},
      };

      let maxQNum = questions.length;
      let importedCount = 0;

      for (let i = 1; i < lines.length; i++) {
        const cols = parseCsvLine(lines[i]);
        const qNum = parseInt(cols[qCol], 10);
        if (isNaN(qNum) || qNum <= 0) continue;
        if (qNum > maxQNum) maxQNum = qNum;

        const ansA = (cols[setACol] || '').trim().toUpperCase();
        const ansB = setBCol !== -1 ? (cols[setBCol] || '').trim().toUpperCase() : '';
        const ansC = setCCol !== -1 ? (cols[setCCol] || '').trim().toUpperCase() : '';
        const ansD = setDCol !== -1 ? (cols[setDCol] || '').trim().toUpperCase() : '';

        if (validOpts.has(ansA)) {
          parsedMap.SET_A[qNum] = ansA as 'A' | 'B' | 'C' | 'D';
          importedCount++;
        }
        if (validOpts.has(ansB)) parsedMap.SET_B[qNum] = ansB as 'A' | 'B' | 'C' | 'D';
        if (validOpts.has(ansC)) parsedMap.SET_C[qNum] = ansC as 'A' | 'B' | 'C' | 'D';
        if (validOpts.has(ansD)) parsedMap.SET_D[qNum] = ansD as 'A' | 'B' | 'C' | 'D';
      }

      if (importedCount === 0 && Object.keys(parsedMap.SET_B).length === 0) {
        alert('No valid A/B/C/D answers found in the uploaded CSV.');
        return;
      }

      const hasMultiSetColumns =
        Object.keys(parsedMap.SET_B).length > 0 ||
        Object.keys(parsedMap.SET_C).length > 0 ||
        Object.keys(parsedMap.SET_D).length > 0;

      const currentSets = {
        ...allSetsQuestions,
        [activeSet]: questions,
      };

      const ensureLength = (arr: QuestionItem[]): QuestionItem[] => {
        const list = [...arr];
        for (let idx = list.length; idx < maxQNum; idx++) {
          list.push({
            id: idx + 1,
            questionText: '',
            options: { A: '', B: '', C: '', D: '' },
            correctAnswer: 'Select Correct Option',
          });
        }
        return list;
      };

      const applyAnswersToSet = (
        arr: QuestionItem[],
        ansRecord: Record<number, 'A' | 'B' | 'C' | 'D'>
      ): QuestionItem[] =>
        ensureLength(arr).map((q) => ({
          ...q,
          correctAnswer: ansRecord[q.id] ?? q.correctAnswer ?? 'Select Correct Option',
        }));

      const updatedSets: Record<string, QuestionItem[]> = {
        SET_A: applyAnswersToSet(currentSets.SET_A, parsedMap.SET_A),
        SET_B: applyAnswersToSet(
          currentSets.SET_B,
          hasMultiSetColumns ? parsedMap.SET_B : activeSet === 'SET_B' ? parsedMap.SET_A : {}
        ),
        SET_C: applyAnswersToSet(
          currentSets.SET_C,
          hasMultiSetColumns ? parsedMap.SET_C : activeSet === 'SET_C' ? parsedMap.SET_A : {}
        ),
        SET_D: applyAnswersToSet(
          currentSets.SET_D,
          hasMultiSetColumns ? parsedMap.SET_D : activeSet === 'SET_D' ? parsedMap.SET_A : {}
        ),
      };

      const multiSetAnswerKeys: Record<string, Record<number, string>> = {
        SET_A: {},
        SET_B: {},
        SET_C: {},
        SET_D: {},
      };

      Object.entries(updatedSets).forEach(([setKey, setQs]) => {
        setQs.forEach((q) => {
          if (q.correctAnswer && q.correctAnswer !== 'Select Correct Option') {
            multiSetAnswerKeys[setKey][q.id] = q.correctAnswer;
          }
        });
      });

      const resolvedEnableSets = hasMultiSetColumns ? true : multiSetEnabled;
      const updatedExam: LocalExam = {
        ...exam,
        enableSets: resolvedEnableSets,
        totalQuestions: updatedSets.SET_A.length,
        questionPaper: updatedSets.SET_A,
        answerKey: hasMultiSetColumns
          ? {
              ...multiSetAnswerKeys.SET_A,
              A: multiSetAnswerKeys.SET_A,
              B: multiSetAnswerKeys.SET_B,
              C: multiSetAnswerKeys.SET_C,
              D: multiSetAnswerKeys.SET_D,
            }
          : multiSetAnswerKeys.SET_A,
        answerKeys: multiSetAnswerKeys,
        allSetsQuestions: updatedSets,
        instructions,
        examSet: activeSet,
        syncStatus: 'pending',
      } as LocalExam;

      await db.exams.put(updatedExam);

      setExam(updatedExam);
      setMultiSetEnabled(resolvedEnableSets);
      setAllSetsQuestions(updatedSets);
      setQuestions(updatedSets[activeSet] || updatedSets.SET_A);

      alert(
        `Answer key uploaded (${importedCount} answers${
          hasMultiSetColumns ? ', Sets A–D' : ''
        }) and saved to local database!`
      );
    } catch (err) {
      console.error('Failed to import answer key CSV:', err);
      alert('Error reading or saving the uploaded answer key CSV file.');
    } finally {
      if (answerKeyInputRef.current) answerKeyInputRef.current.value = '';
    }
  };

  // Handle Document Upload & Parsing using Robust State-Aware Fuzzy Parser (Immune to Decimal Collisions)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    let textContent = '';

    try {
      if (file.name.endsWith('.docx')) {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        textContent = result.value;
      } else if (file.name.endsWith('.csv')) {
        const rawText = await file.text();
        const lines = rawText.split('\n').map((l) => l.trim()).filter(Boolean);
        const startIndex = lines[0]?.toLowerCase().includes('question') ? 1 : 0;

        const convertedLines: string[] = [];
        for (let i = startIndex; i < lines.length; i++) {
          const cols = lines[i].split(',').map((c) => c.trim().replace(/^["']|["']$/g, ''));
          if (cols.length >= 5) {
            convertedLines.push(`${i - startIndex + 1}. ${cols[0]}`);
            convertedLines.push(`A) ${cols[1]}`);
            convertedLines.push(`B) ${cols[2]}`);
            convertedLines.push(`C) ${cols[3]}`);
            convertedLines.push(`D) ${cols[4]}`);
            if (cols[5]) convertedLines.push(`Ans: ${cols[5]}`);
          }
        }
        textContent = convertedLines.join('\n');
      } else {
        textContent = await file.text();
      }

      if (!textContent) return;

      const lines = textContent.split('\n').map((l) => l.trim()).filter(Boolean);
      const parsedQuestions: QuestionItem[] = [];

      let currentQ: Partial<QuestionItem> | null = null;
      let currentOptions = { A: '', B: '', C: '', D: '' };
      let currentAns: QuestionItem['correctAnswer'] = 'Select Correct Option';
      let expectingQuestion = true;

      const saveCurrentQuestion = () => {
        if (currentQ && currentQ.questionText) {
          parsedQuestions.push({
            id: parsedQuestions.length + 1,
            questionText: currentQ.questionText.trim(),
            options: { ...currentOptions },
            correctAnswer: currentAns,
          });
        }
      };

      lines.forEach((line) => {
        const qMatch =
          line.match(/^(?:question\s*)?(Q\d+)[\.\)]\s+(.*)/i) ||
          (expectingQuestion ? line.match(/^(\d+)[\.\)]\s+(.*)/) : null);

        const optMatch = line.match(/^[\(\[]?([A-Da-d])[\.\)\]]\s+(.*)/);
        const ansMatch = line.match(/^(?:ans(?:wer)?[:\-\s]*)(?:[\(\[]?([A-Da-d])[\.\)\]]?)?/i);

        if (qMatch) {
          saveCurrentQuestion();
          currentQ = { questionText: qMatch[2] };
          currentOptions = { A: '', B: '', C: '', D: '' };
          currentAns = 'Select Correct Option';
          expectingQuestion = false;
        } else if (optMatch) {
          const optKey = optMatch[1].toUpperCase() as 'A' | 'B' | 'C' | 'D';
          currentOptions[optKey] = optMatch[2];
        } else if (ansMatch && ansMatch[1]) {
          currentAns = ansMatch[1].toUpperCase() as any;
          expectingQuestion = true;
        } else if (currentQ && qMatch === null && optMatch === null && !ansMatch) {
          if (!expectingQuestion || Object.values(currentOptions).some((v) => v !== '')) {
            const activeOptKey = (['D', 'C', 'B', 'A'] as const).find(
              (k) => currentOptions[k] !== ''
            );
            if (!activeOptKey || expectingQuestion) {
              currentQ.questionText = (currentQ.questionText || '') + ' ' + line;
            }
          } else {
            currentQ.questionText = (currentQ.questionText || '') + ' ' + line;
          }
        }
      });

      saveCurrentQuestion();

      const indexedQuestions = parsedQuestions.map((q, idx) => ({
        ...q,
        id: idx + 1,
      }));

      if (indexedQuestions.length > 0) {
        const newSetB = generateShuffledVariant(indexedQuestions, 13);
        const newSetC = generateShuffledVariant(indexedQuestions, 29);
        const newSetD = generateShuffledVariant(indexedQuestions, 47);

        const updatedVariants = {
          SET_A: indexedQuestions,
          SET_B: newSetB,
          SET_C: newSetC,
          SET_D: newSetD,
        };

        setAllSetsQuestions(updatedVariants);
        setQuestions(indexedQuestions);
        setActiveSet('SET_A');
        alert(
          `Successfully imported ${indexedQuestions.length} questions with continuous numbering (1 to ${indexedQuestions.length})!`
        );
      } else {
        alert(
          'Could not parse questions automatically. Please ensure format uses numbered questions (e.g. "1. Question") and options labeled A, B, C, D.'
        );
      }
    } catch (err) {
      console.error('Failed to parse document:', err);
      alert('Error reading uploaded document file.');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSetActiveSet = (setKey: string) => {
    setAllSetsQuestions((prev) => ({
      ...prev,
      [activeSet]: questions,
    }));
    setActiveSet(setKey);
    setQuestions(allSetsQuestions[setKey] || questions);
  };

  const handleDeleteQuestion = (id: number) => {
    const updated = questions.filter((q) => q.id !== id).map((q, idx) => ({ ...q, id: idx + 1 }));
    setQuestions(updated);
    setAllSetsQuestions((prev) => ({ ...prev, [activeSet]: updated }));
  };

  const handleQuestionChange = (id: number, text: string) => {
    const updated = questions.map((q) => (q.id === id ? { ...q, questionText: text } : q));
    setQuestions(updated);
    setAllSetsQuestions((prev) => ({ ...prev, [activeSet]: updated }));
  };

  const handleOptionChange = (id: number, optionKey: 'A' | 'B' | 'C' | 'D', text: string) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, options: { ...q.options, [optionKey]: text } } : q
    );
    setQuestions(updated);
    setAllSetsQuestions((prev) => ({ ...prev, [activeSet]: updated }));
  };

  const handleCorrectAnswerChange = (id: number, answer: QuestionItem['correctAnswer']) => {
    const updated = questions.map((q) =>
      q.id === id ? { ...q, correctAnswer: answer || 'Select Correct Option' } : q
    );
    setQuestions(updated);
    setAllSetsQuestions((prev) => ({ ...prev, [activeSet]: updated }));
  };

  const handleSaveQuestionPaper = async () => {
    if (!exam) return;
    setSaving(true);

    try {
      const currentSets = {
        ...allSetsQuestions,
        [activeSet]: questions,
      };

      const multiSetAnswerKeys: Record<string, Record<number, string>> = {
        SET_A: {},
        SET_B: {},
        SET_C: {},
        SET_D: {},
      };

      Object.entries(currentSets).forEach(([setKey, setQs]) => {
        setQs.forEach((q) => {
          if (q.correctAnswer && q.correctAnswer !== 'Select Correct Option') {
            multiSetAnswerKeys[setKey][q.id] = q.correctAnswer;
          }
        });
      });

      const updatedExam: LocalExam = {
        ...exam,
        totalQuestions: questions.length,
        questionPaper: questions,
        answerKey: multiSetEnabled
          ? {
              ...multiSetAnswerKeys['SET_A'],
              A: multiSetAnswerKeys['SET_A'],
              B: multiSetAnswerKeys['SET_B'],
              C: multiSetAnswerKeys['SET_C'],
              D: multiSetAnswerKeys['SET_D'],
            }
          : multiSetAnswerKeys['SET_A'],
        answerKeys: multiSetAnswerKeys,
        allSetsQuestions: currentSets,
        instructions: instructions,
        examSet: activeSet,
        syncStatus: 'pending',
      } as LocalExam;

      await db.exams.put(updatedExam);
      alert('Question papers and answer keys saved successfully to IndexedDB!');
      router.push(`/exams/${examId}`);
    } catch (error) {
      console.error('Failed to save question paper:', error);
      alert('Error saving question paper to local storage.');
    } finally {
      setSaving(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!exam) return;
    setDownloading(true);
    try {
      const blob = await pdf(
        <ExamPaperPDF
          exam={exam}
          instructions={instructions}
          questions={questions}
          examSet={multiSetEnabled ? activeSet.replace('_', ' ') : 'SET-A'}
          orgProfile={orgProfile}
          qrDataUrl={qrDataUrl}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${exam.examTitle.replace(/\s+/g, '_')}_${
        multiSetEnabled ? activeSet : 'SingleSet'
      }_QuestionPaper.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      alert('Error generating PDF file.');
    } finally {
      setDownloading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center w-screen h-screen bg-slate-50 text-slate-600 gap-3">
        <Loader2 className="animate-spin text-indigo-600" size={32} />
        <span className="text-sm font-bold tracking-wide">Loading Exam Blueprint...</span>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="flex flex-col justify-center items-center w-screen h-screen bg-slate-50 text-slate-900 gap-4">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-inner">
          <FileText size={32} />
        </div>
        <h1 className="text-xl font-black">Exam Not Found</h1>
        <p className="text-sm font-medium text-slate-500">
          No exam record found matching ID: {examId}
        </p>
        <button
          onClick={() => router.push('/dashboard')}
          className="mt-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-md shadow-slate-900/20 cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6 bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/20 font-sans">
      {/* Hidden file inputs for Question Doc (.docx, .csv, .txt, .md) and Answer Key (.csv) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".txt,.md,.csv,.docx"
        className="hidden"
      />
      <input
        type="file"
        ref={answerKeyInputRef}
        onChange={handleAnswerKeyUpload}
        accept=".csv,text/csv"
        className="hidden"
      />

      {/* Top Header Bar */}
      <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 gap-4">
        <div className="flex items-center gap-3.5">
          <button
            onClick={() => router.back()}
            className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition cursor-pointer shadow-2xs shrink-0"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 mb-1 border border-indigo-100">
              <Sparkles size={11} />{' '}
              {multiSetEnabled ? 'Multi-Set Question Creator' : 'Single-Set Question Creator'}
            </div>
            <h1 className="text-lg sm:text-2xl font-black text-slate-900 tracking-tight">
              {exam.examTitle}
            </h1>
            <p className="text-xs font-medium text-slate-500 mt-0.5">
              Configure questions, upload question docs or answer keys, and preview print-ready
              booklets.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end flex-wrap">
          {/* Upload Question Document Button */}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-3 rounded-2xl font-black uppercase tracking-wider text-xs shadow-md shadow-emerald-600/25 transition-all cursor-pointer"
          >
            <Upload size={15} />
            <span>Upload Doc</span>
          </button>

          {/* Download Answer Key CSV Template Button */}
          <button
            type="button"
            onClick={handleDownloadAnswerKeyTemplate}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-200 px-3.5 py-3 rounded-2xl font-black uppercase tracking-wider text-xs transition-all cursor-pointer"
            title="Download Answer Key CSV Template"
          >
            <FileSpreadsheet size={15} className="text-amber-600" />
            <span>Key Template</span>
          </button>

          {/* Upload Answer Key CSV Button */}
          <button
            type="button"
            onClick={() => answerKeyInputRef.current?.click()}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-2xl font-black uppercase tracking-wider text-xs shadow-md shadow-amber-500/25 transition-all cursor-pointer"
          >
            <KeyRound size={15} />
            <span>Upload Answer Key</span>
          </button>

          <button
            type="button"
            onClick={handleDownloadPDF}
            disabled={downloading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 text-white px-4 py-3 rounded-2xl font-black uppercase tracking-wider text-xs shadow-md shadow-sky-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {downloading ? <Loader2 className="animate-spin" size={15} /> : <Download size={15} />}
            <span>
              {downloading
                ? 'Generating...'
                : `Download ${multiSetEnabled ? activeSet.replace('_', ' ') : 'PDF'}`}
            </span>
          </button>

          <button
            type="button"
            onClick={handleSaveQuestionPaper}
            disabled={saving}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-3 rounded-2xl font-black uppercase tracking-wider text-xs shadow-md shadow-indigo-600/25 transition-all cursor-pointer disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={15} /> : <Save size={15} />}
            <span>{saving ? 'Saving...' : 'Save Paper'}</span>
          </button>
        </div>
      </div>

      {/* Multi-Set Tabs Bar (Rendered ONLY if multiSetEnabled is true) */}
      {multiSetEnabled && (
        <div className="w-full bg-white/95 backdrop-blur-md p-3 rounded-3xl shadow-lg shadow-slate-200/30 border border-slate-200/80 flex items-center gap-2 overflow-x-auto">
          <div className="flex items-center gap-2 px-3 text-slate-400 font-black text-xs uppercase tracking-widest shrink-0">
            <Layers size={15} className="text-indigo-600" /> Booklet Sets:
          </div>
          {['SET_A', 'SET_B', 'SET_C', 'SET_D'].map((setKey) => (
            <button
              key={setKey}
              onClick={() => handleSetActiveSet(setKey)}
              className={`px-5 py-2.5 rounded-2xl font-black text-xs tracking-wider transition-all cursor-pointer shrink-0 ${
                activeSet === setKey
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
              }`}
            >
              {setKey.replace('_', ' ')} {setKey === 'SET_A' ? '(Master)' : '(Shuffled)'}
            </button>
          ))}
        </div>
      )}

      {/* Main Split Layout: Form on Left, Live PDF Previewer with Conditional Dropdown on Right */}
      <div className="w-full grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
        {/* Left Side: Exam Set Input, Instructions Card & Question Fields List */}
        <div className="w-full xl:col-span-7 flex flex-col gap-5">
          <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <FileText size={15} className="text-indigo-600" />
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Question Paper Instructions (Bilingual)
                </label>
              </div>
              <textarea
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Enter instructions in English and Hindi..."
                rows={4}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs leading-relaxed shadow-2xs"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-800">
              Question Fields Matrix {multiSetEnabled ? `for ${activeSet.replace('_', ' ')}` : ''}{' '}
              ({questions.length})
            </h2>
          </div>

          {questions.length === 0 ? (
            <div className="w-full bg-white/95 backdrop-blur-md p-12 rounded-3xl border border-dashed border-slate-300 text-center text-slate-400 font-bold text-xs shadow-sm">
              <p>
                No question fields configured for this exam set. Click &quot;Upload Doc&quot; or
                &quot;Upload Answer Key&quot; above to populate questions.
              </p>
            </div>
          ) : (
            <div className="w-full flex flex-col gap-4">
              {questions.map((q) => (
                <div
                  key={q.id}
                  className="w-full bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 space-y-4 group hover:border-indigo-200 transition-all"
                >
                  <div className="flex justify-between items-center border-b border-slate-100 pb-3">
                    <span className="font-mono font-black text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                      Question #{q.id}
                    </span>
                    <button
                      onClick={() => handleDeleteQuestion(q.id)}
                      className="p-2 text-rose-500 hover:text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition shadow-2xs cursor-pointer"
                      title="Remove Field"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Question Text
                    </label>
                    <textarea
                      value={q.questionText}
                      onChange={(e) => handleQuestionChange(q.id, e.target.value)}
                      placeholder="Type your question here..."
                      rows={2}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs shadow-2xs"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {(['A', 'B', 'C', 'D'] as const).map((optKey) => (
                      <div key={optKey}>
                        <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">
                          Option {optKey}
                        </label>
                        <input
                          type="text"
                          value={q.options[optKey]}
                          onChange={(e) => handleOptionChange(q.id, optKey, e.target.value)}
                          placeholder={`Type option ${optKey} here...`}
                          className={`w-full px-3.5 py-2.5 bg-slate-50 border rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 text-xs shadow-2xs ${
                            q.correctAnswer === optKey
                              ? 'border-emerald-500 ring-1 ring-emerald-500 bg-emerald-50/20'
                              : 'border-slate-200'
                          }`}
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1.5">
                      Correct Answer
                    </label>
                    <select
                      value={q.correctAnswer || 'Select Correct Option'}
                      onChange={(e) =>
                        handleCorrectAnswerChange(
                          q.id,
                          e.target.value as QuestionItem['correctAnswer']
                        )
                      }
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-600 text-xs shadow-2xs cursor-pointer"
                    >
                      <option value="Select Correct Option">Select Correct Option</option>
                      <option value="A">Option A</option>
                      <option value="B">Option B</option>
                      <option value="C">Option C</option>
                      <option value="D">Option D</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Live Interactive PDF Preview Panel with Conditional Set Dropdown */}
        <div className="w-full xl:col-span-5 flex flex-col gap-4 sticky top-6">
          <div className="flex items-center justify-between px-1 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border border-slate-200/80">
            <div className="flex items-center gap-2">
              <Eye size={16} className="text-indigo-600" />
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-800">
                {multiSetEnabled ? 'Preview Booklet Set:' : 'Live PDF Preview'}
              </h2>
            </div>

            {multiSetEnabled && (
              <select
                value={activeSet}
                onChange={(e) => handleSetActiveSet(e.target.value)}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-xl text-slate-900 font-black text-xs uppercase focus:outline-none focus:ring-2 focus:ring-indigo-600 cursor-pointer shadow-2xs transition"
              >
                <option value="SET_A">Set A (Master)</option>
                <option value="SET_B">Set B (Shuffled)</option>
                <option value="SET_C">Set C (Shuffled)</option>
                <option value="SET_D">Set D (Shuffled)</option>
              </select>
            )}
          </div>

          <div className="w-full bg-white/95 backdrop-blur-md h-[780px] rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 overflow-hidden flex flex-col">
            {qrDataUrl && (
              <PDFViewer className="w-full h-full border-none">
                <ExamPaperPDF
                  exam={exam}
                  instructions={instructions}
                  questions={questions}
                  examSet={multiSetEnabled ? activeSet.replace('_', ' ') : 'SET-A'}
                  orgProfile={orgProfile}
                  qrDataUrl={qrDataUrl}
                />
              </PDFViewer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}