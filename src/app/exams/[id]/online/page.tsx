// app/exams/take/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import ExamInstructions from '@/components/ExamInstructions';
import { useProctoring } from '@/hooks/useProctoring';
import { shuffleExamData } from '@/utils/examShuffle';
import { 
  Clock, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight, 
  Send, 
  ShieldAlert, 
  CheckCircle2, 
  ShieldCheck,
  EyeOff,
  Camera
} from 'lucide-react';

interface QuestionItem {
  id: number;
  questionText: string;
  options: { A: string; B: string; C: string; D: string };
}

export default function TakeExamPage() {
  const params = useParams();
  const examId = (params?.id as string) || '';
  const router = useRouter();

  const [exam, setExam] = useState<any | null>(null);
  const [questions, setQuestions] = useState<QuestionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [hasStarted, setHasStarted] = useState(false);
  const [showFullScreenWarning, setShowFullScreenWarning] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [visited, setVisited] = useState<Record<number, boolean>>({});

  const [timeLeft, setTimeLeft] = useState<number>(15 * 60);
  const [showWarningModal, setShowWarningModal] = useState(false);
  const [timeUpModal, setTimeUpModal] = useState(false);
  const [isTerminated, setIsTerminated] = useState(false);
  const [terminationReason, setTerminationReason] = useState<'absence' | 'integrity' | null>(null);

  const handleTermination = (reason: 'absence' | 'integrity') => {
    setIsTerminated(true);
    setTerminationReason(reason);

    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
    }

    setTimeout(() => {
      router.push('/dashboard');
    }, 4000);
  };

  const {
    integrityScore,
    infractionMessage,
    faceMissing,
    multipleFaces,
    mediaStream,
    webcamActive,
    startWebcam,
    hiddenVideoRef,
    mobileVideoRef,
    desktopVideoRef,
    recordInfraction
  } = useProctoring({
    hasStarted,
    onTerminate: handleTermination
  });

  // Load exam and apply shuffling utilities on mount
  useEffect(() => {
    async function fetchExamData() {
      try {
        const record = await db.exams.get(examId);
        if (record) {
          setExam(record);
          setTimeLeft((record.durationMinutes || 30) * 60);

          let rawQuestions: QuestionItem[] = [];
          if (record.questionPaper && record.questionPaper.length > 0) {
            rawQuestions = record.questionPaper;
          } else {
            const total = record.totalQuestions || 10;
            rawQuestions = Array.from({ length: total }, (_, i) => ({
              id: i + 1,
              questionText: `Sample Question #${i + 1}: What is the primary architectural advantage of offline-first progressive web applications?`,
              options: {
                A: 'Enhanced client-side caching and local storage synchronization',
                B: 'Constant reliance on high-speed cellular coverage',
                C: 'Elimination of all relational database requirements',
                D: 'Restricted multi-device compatibility'
              }
            }));
          }

          const processedQuestions = shuffleExamData(rawQuestions);
          setQuestions(processedQuestions);
          if (processedQuestions.length > 0) {
            setVisited({ [processedQuestions[0].id]: true });
          }
        }
      } catch (error) {
        console.error('Failed to load exam for taking:', error);
      } finally {
        setLoading(false);
      }
    }

    if (examId) fetchExamData();
  }, [examId]);

  const startSecureExam = async () => {
    try {
      if (document.documentElement.requestFullscreen) {
        await document.documentElement.requestFullscreen();
      }
      await startWebcam();
      setHasStarted(true);
      setShowFullScreenWarning(false);
    } catch (err) {
      alert('Full-screen and webcam permissions are required to start this secure exam.');
    }
  };

  // Monitor full-screen exits and behavioral proctoring infractions
  useEffect(() => {
    if (!hasStarted || loading || !exam || isTerminated) return;

    const handleFullScreenChange = () => {
      if (!document.fullscreenElement) {
        recordInfraction('Exited full-screen mode.');
        setShowFullScreenWarning(true);
      }
    };
    const handleVisibilityChange = () => {
      if (document.hidden) recordInfraction('Tab switch or window minimization detected.');
    };
    const handleWindowBlur = () => recordInfraction('Focus lost from exam window.');
    const handleCopyPaste = (e: ClipboardEvent) => { e.preventDefault(); recordInfraction('Attempted unauthorized copy/paste action.'); };
    const handleContextMenu = (e: MouseEvent) => { e.preventDefault(); recordInfraction('Attempted unauthorized right-click action.'); };

    document.addEventListener('fullscreenchange', handleFullScreenChange);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);
    document.addEventListener('copy', handleCopyPaste);
    document.addEventListener('paste', handleCopyPaste);
    document.addEventListener('contextmenu', handleContextMenu);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullScreenChange);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
      document.removeEventListener('copy', handleCopyPaste);
      document.removeEventListener('paste', handleCopyPaste);
      document.removeEventListener('contextmenu', handleContextMenu);
    };
  }, [hasStarted, loading, exam, isTerminated]);

  const handleSubmitExam = async (isAutoSubmit = false) => {
    if (submitting || isTerminated) return;
    setSubmitting(true);
    if (mediaStream) mediaStream.getTracks().forEach(track => track.stop());

    if (isAutoSubmit) {
      setTimeUpModal(true);
    } else {
      alert(`Exam submitted successfully! Integrity Score: ${integrityScore}%`);
      router.push('/dashboard');
    }
    setSubmitting(false);
  };

  // Countdown Timer Logic
  useEffect(() => {
    if (loading || !exam || !hasStarted || timeUpModal || showFullScreenWarning || isTerminated) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitExam(true);
          return 0;
        }
        if (prev === 11) setShowWarningModal(true);
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, exam, hasStarted, timeUpModal, showFullScreenWarning, answers, integrityScore, isTerminated]);

  const formatTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-slate-50 text-slate-600 gap-3">
        <div className="w-8 h-8 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        <span className="text-sm font-bold tracking-wide">Initializing Secure AI Proctoring Environment...</span>
      </div>
    );
  }

  if (!exam || questions.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 text-slate-900 gap-4">
        <h1 className="text-xl font-black">Assessment Not Found</h1>
        <p className="text-sm text-slate-500">The requested exam session is unavailable.</p>
        <button onClick={() => router.push('/dashboard')} className="px-5 py-2.5 bg-slate-900 text-white rounded-2xl text-xs font-black uppercase tracking-wider cursor-pointer">
          Return to Dashboard
        </button>
      </div>
    );
  }

  if (!hasStarted) {
    return (
      <ExamInstructions
        examTitle={exam.examTitle}
        durationMinutes={exam.durationMinutes || 30}
        totalQuestions={exam.totalQuestions || questions.length}
        onStartExam={startSecureExam}
      />
    );
  }

  const currentQ = questions[currentIndex];
  const answeredCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/20 font-sans flex flex-col select-none">
      <video ref={hiddenVideoRef} className="hidden" muted playsInline />

      <header className="bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-4 sticky top-0 z-30 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-100 flex items-center gap-1.5 w-fit">
              <Camera size={12} /> MediaPipe AI Proctored Mode
            </span>
            <h1 className="text-base sm:text-xl font-black text-slate-900 tracking-tight mt-1">{exam.examTitle}</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <div className={`flex items-center gap-1.5 px-3 py-2 rounded-2xl border text-xs font-black uppercase tracking-wider ${
            integrityScore > 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : integrityScore > 50 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {integrityScore > 80 ? <ShieldCheck size={15} /> : <ShieldAlert size={15} />}
            <span>Integrity: {integrityScore}%</span>
          </div>

          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl border shadow-2xs font-mono font-black text-sm sm:text-base ${
            timeLeft <= 60 ? 'bg-rose-50 text-rose-600 border-rose-200 animate-pulse' : 'bg-slate-900 text-white border-slate-900'
          }`}>
            <Clock size={16} />
            <span>{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* Persistent AI Infraction Warning Banners */}
      {faceMissing && !isTerminated && (
        <div className="bg-rose-600 text-white text-xs font-bold px-4 py-3 text-center sticky top-[73px] z-40 flex items-center justify-center gap-2 shadow-md animate-pulse">
          <EyeOff size={16} />
          <span>WARNING: Face not detected! Please return to the camera view within 15 seconds to avoid automatic termination.</span>
        </div>
      )}

      {multipleFaces && !isTerminated && (
        <div className="bg-rose-600 text-white text-xs font-bold px-4 py-3 text-center sticky top-[73px] z-40 flex items-center justify-center gap-2 shadow-md animate-pulse">
          <ShieldAlert size={16} />
          <span>WARNING: Multiple people detected in camera view! Unauthorized assistance is prohibited.</span>
        </div>
      )}

      {infractionMessage && !faceMissing && !multipleFaces && !isTerminated && (
        <div className="bg-amber-600 text-white text-xs font-bold px-4 py-3 text-center sticky top-[73px] z-40 flex items-center justify-center gap-2 shadow-md">
          <AlertTriangle size={16} />
          <span>{infractionMessage}</span>
        </div>
      )}

      {/* Sticky Mobile Proctoring Window */}
      <div className="lg:hidden sticky top-[74px] z-20 bg-white/95 backdrop-blur-md px-4 py-3 border-b border-slate-200 shadow-sm flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
          <span className="text-xs font-black text-slate-900 uppercase tracking-wider">AI Vision Active</span>
        </div>
        <div className="w-28 h-20 bg-slate-900 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center shadow-inner">
          <video 
            ref={mobileVideoRef}
            className="w-full h-full object-cover -scale-x-100" 
            muted 
            playsInline 
          />
        </div>
      </div>

      <div className="max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6 items-start flex-1">
        <div className="flex-1 w-full bg-white/90 backdrop-blur-md p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-6 flex flex-col justify-between">
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <span className="font-mono font-black text-xs text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
                Question #{currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="text-sm sm:text-base font-bold text-slate-900 leading-relaxed">
              {currentQ.questionText}
            </div>

            <div className="space-y-3 pt-2">
              {(['A', 'B', 'C', 'D'] as const).map((optKey) => {
                const isSelected = answers[currentQ.id] === optKey;
                return (
                  <button
                    key={optKey}
                    onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: optKey }))}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-center gap-4 cursor-pointer text-xs sm:text-sm font-medium ${
                      isSelected ? 'bg-indigo-50/80 border-indigo-600 text-indigo-900 shadow-sm ring-1 ring-indigo-600' : 'bg-slate-50/50 hover:bg-slate-50 border-slate-200 text-slate-700'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-mono font-black text-xs flex items-center justify-center shrink-0 border ${
                      isSelected ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-slate-600 border-slate-200'
                    }`}>
                      {optKey}
                    </span>
                    <span className="flex-1">{currentQ.options[optKey]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-between pt-6 border-t border-slate-100 gap-3">
            <button
              onClick={() => setCurrentIndex(prev => prev - 1)}
              disabled={currentIndex === 0}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-black uppercase tracking-wider text-slate-700 bg-slate-50 hover:bg-slate-100 disabled:opacity-40 transition cursor-pointer flex items-center gap-1.5"
            >
              <ChevronLeft size={15} /> Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(prev => prev + 1)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black uppercase tracking-wider shadow-md transition cursor-pointer flex items-center gap-1.5"
              >
                Next <ChevronRight size={15} />
              </button>
            ) : (
              <button
                onClick={() => handleSubmitExam(false)}
                disabled={submitting}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-xs font-black uppercase tracking-wider shadow-md transition cursor-pointer flex items-center gap-2"
              >
                <Send size={15} /> Finish & Submit
              </button>
            )}
          </div>
        </div>

        {/* Right Side: Desktop Webcam Preview & Palette */}
        <div className="hidden lg:flex flex-col w-80 gap-6 sticky top-24">
          <div className="bg-white/90 backdrop-blur-md p-4 rounded-3xl shadow-xl border border-slate-200/80 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                <Camera size={14} className="text-indigo-600" /> Proctor View
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </div>
            <div className="relative w-full h-44 bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 flex items-center justify-center">
              <video ref={desktopVideoRef} className="w-full h-full object-cover -scale-x-100" muted playsInline />
            </div>
          </div>
        </div>
      </div>

      {/* --- ASSESSMENT TERMINATED OVERLAY WITH DYNAMIC REASON --- */}
      {isTerminated && (
        <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-md w-full p-8 text-center space-y-5">
            <ShieldAlert size={32} className="mx-auto text-rose-600" />
            <h3 className="text-xl font-black text-slate-900">Assessment Terminated</h3>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              {terminationReason === 'absence'
                ? 'You were absent from the camera view continuously for over 15 seconds.'
                : 'Your integrity score dropped to 0% due to multiple security infractions.'}
            </p>
            <div className="pt-2 text-[11px] font-bold text-indigo-600 tracking-wide uppercase animate-pulse">
              Redirecting to Dashboard...
            </div>
          </div>
        </div>
      )}
    </div>
  );
}