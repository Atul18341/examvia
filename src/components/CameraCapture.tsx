// components/CameraCapture.tsx
'use client';
import { useState, useRef, useEffect } from 'react';
import { db } from '@/lib/db';
import { Camera, CheckCircle2, AlertTriangle, Edit3, Save, RotateCcw, X } from 'lucide-react';
import { processOmrImage, QuestionAnalysis } from '../lib/omrScanner';

export default function CameraCapture({ examId, onClose }: { examId: string; onClose?: () => void }) {
  const [loading, setLoading] = useState(false);
  const [reviewData, setReviewData] = useState<{
    studentRoll: string;
    analysis: QuestionAnalysis[];
    overallConfidence: number;
  } | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editableAnswers, setEditableAnswers] = useState<Record<number, string>>({});
  const [studentRollInput, setStudentRollInput] = useState('');
  const [savedSuccess, setSavedSuccess] = useState(false);
  
  const [isStreaming, setIsStreaming] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Automatically start the live camera stream on component mount
  useEffect(() => {
    startCameraStream();
    return () => {
      stopCameraStream();
    };
  }, []);

  const stopCameraStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsStreaming(false);
  };

  const startCameraStream = async () => {
    setReviewData(null);
    setSavedSuccess(false);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsStreaming(true);
    } catch (err) {
      console.error("Failed to access live camera stream:", err);
      alert("Camera permission denied or unavailable.");
    }
  };

  const handleImageSourceProcessing = async (source: HTMLImageElement | HTMLVideoElement, width: number, height: number) => {
    setLoading(true);
    setSavedSuccess(false);
    try {
      const result = await processOmrImage(source, width, height);
      setStudentRollInput(result.studentRoll);
      setEditableAnswers(result.editableAnswers);
      setReviewData({
        studentRoll: result.studentRoll,
        analysis: result.analysis,
        overallConfidence: result.overallConfidence
      });
      stopCameraStream(); // Pause or stop stream during review
    } catch (err) {
      console.error("CV Processing error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveSnap = async () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    await handleImageSourceProcessing(video, video.videoWidth, video.videoHeight);
  };

  const handleAnswerChange = (qNum: number, option: string) => {
    setEditableAnswers(prev => ({ ...prev, [qNum]: option }));
  };

  const handleSaveToDatabase = async () => {
    if (!reviewData) return;

    try {
      const finalAnswersMap: Record<string, string> = {};
      Object.entries(editableAnswers).forEach(([q, ans]) => {
        finalAnswersMap[q] = ans;
      });

      await db.scans.add({
        examId,
        studentRoll: studentRollInput,
        answers: finalAnswersMap,
        confidenceScore: reviewData.overallConfidence,
        timestamp: Date.now(),
        synced: false
      });

      setSavedSuccess(true);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to commit scan record to IndexedDB:", error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950 flex flex-col text-slate-100 overflow-hidden">
      
      {/* FULL-SCREEN TOP HEADER BAR */}
      <div className="absolute top-0 left-0 right-0 p-4 bg-gradient-to-b from-black/80 to-transparent flex justify-between items-center z-20">
        <div>
          <h2 className="text-sm font-bold tracking-tight">OMR Full-Screen Scanner</h2>
          <p className="text-[10px] text-slate-300 font-mono">Exam ID: {examId}</p>
        </div>
        {onClose && (
          <button 
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition text-white"
            aria-label="Close Scanner"
          >
            <X size={20} />
          </button>
        )}
      </div>

      {/* FULL-SCREEN VIEWPORT OR REVIEW MODAL */}
      <div className="flex-1 relative flex items-center justify-center w-full h-full">
        {!reviewData ? (
          <div className="absolute inset-0 w-full h-full bg-black flex items-center justify-center">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            
            {!isStreaming && (
              <button
                onClick={startCameraStream}
                className="absolute px-6 py-3 bg-indigo-600 text-white rounded-xl font-medium text-xs flex items-center gap-2 shadow-lg"
              >
                <Camera size={18} /> Tap to Restart Camera
              </button>
            )}

            {/* FLOATING CAPTURE TRIGGER BUTTON AT BOTTOM */}
            {isStreaming && !loading && (
              <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center z-10">
                <button
                  onClick={handleLiveSnap}
                  className="w-16 h-16 rounded-full bg-white border-4 border-slate-300 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition cursor-pointer"
                  aria-label="Capture Frame"
                >
                  <div className="w-12 h-12 rounded-full bg-indigo-600 flex items-center justify-center text-white">
                    <Camera size={24} />
                  </div>
                </button>
              </div>
            )}
          </div>
        ) : (
          /* FULL-SCREEN REVIEW & AUDIT OVERLAY */
          <div className="absolute inset-0 bg-slate-900 p-4 sm:p-8 flex flex-col justify-center items-center overflow-y-auto">
            <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-6 shadow-2xl my-auto">
              
              <div className="flex justify-between items-center border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">Identified Roll</span>
                  <input 
                    type="text" 
                    value={studentRollInput} 
                    onChange={(e) => setStudentRollInput(e.target.value)}
                    disabled={!isEditing}
                    className="font-mono font-bold text-white text-lg bg-transparent border-b border-transparent focus:border-indigo-500 focus:outline-none"
                  />
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block">CV Confidence</span>
                  <span className="text-sm font-mono font-bold text-emerald-400">{reviewData.overallConfidence}%</span>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-300">Question-by-Question Breakdown</span>
                <button
                  onClick={() => setIsEditing(!isEditing)}
                  className="flex items-center gap-1 text-xs font-bold text-indigo-400 hover:underline cursor-pointer"
                >
                  <Edit3 size={13} /> {isEditing ? 'Lock Changes' : 'Override / Edit'}
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
                {reviewData.analysis.map((item) => {
                  const currentVal = editableAnswers[item.questionNumber] || item.detectedAnswer;
                  const matchesKey = currentVal === item.correctAnswer;

                  return (
                    <div key={item.questionNumber} className="flex items-center justify-between bg-slate-800/60 p-3 rounded-xl border border-slate-700/50 text-xs">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono font-bold text-slate-400 w-8">Q{item.questionNumber}</span>
                        {matchesKey ? (
                          <CheckCircle2 size={16} className="text-emerald-400" />
                        ) : (
                          <AlertTriangle size={16} className="text-amber-400" />
                        )}
                      </div>

                      <div className="flex items-center gap-4">
                        <span className="text-[10px] text-slate-400 font-mono">Conf: {item.confidence}%</span>
                        {isEditing ? (
                          <div className="flex gap-1.5">
                            {['A', 'B', 'C', 'D'].map(opt => (
                              <button
                                key={opt}
                                onClick={() => handleAnswerChange(item.questionNumber, opt)}
                                className={`w-7 h-7 rounded-lg font-bold text-xs transition ${
                                  currentVal === opt ? 'bg-indigo-600 text-white' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                                }`}
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs ${
                            matchesKey ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                          }`}>
                            {currentVal}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {savedSuccess ? (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl text-center text-emerald-400 font-medium text-xs flex items-center justify-center gap-2">
                  <CheckCircle2 size={16} /> Verified Scan Saved to Local Database!
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button
                    onClick={() => { setReviewData(null); startCameraStream(); }}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium rounded-xl transition text-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <RotateCcw size={14} /> Scan Another
                  </button>
                  <button
                    onClick={handleSaveToDatabase}
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition text-xs flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                  >
                    <Save size={14} /> Confirm & Save
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center space-y-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-indigo-400 font-medium text-xs tracking-wider uppercase">Running pixel grid threshold analysis...</p>
          </div>
        )}
      </div>

    </div>
  );
}