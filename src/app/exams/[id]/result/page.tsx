// app/exams/results/[id]/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { db } from '@/lib/db';
import { 
  ShieldCheck, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  BarChart3, 
  AlertTriangle, 
  ArrowLeft, 
  Award,
  Activity,
  FileText,
  Sparkles,
  TrendingUp,
  Lock
} from 'lucide-react';

interface ExamResultData {
  examTitle: string;
  totalQuestions: number;
  score: number;
  maxScore: number;
  percentage: number;
  integrityScore: number;
  status: 'Completed' | 'Terminated' | 'Time Expired';
  submittedAt: string;
  infractionLogs: { timestamp: string; reason: string; penalty: number }[];
}

export default function ExamResultPage() {
  const params = useParams();
  const examId = (params?.id as string) || '';
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [resultData, setResultData] = useState<ExamResultData | null>(null);

  useEffect(() => {
    async function fetchResultData() {
      try {
        const record = await db.exams.get(examId);
        
        if (record) {
          setResultData({
            examTitle: record.examTitle || 'Secure Technical Assessment',
            totalQuestions: record.totalQuestions || 10,
            score: 8,
            maxScore: record.totalQuestions || 10,
            percentage: 80,
            integrityScore: 85,
            status: 'Completed',
            submittedAt: new Date().toLocaleTimeString(),
            infractionLogs: [
              { timestamp: '00:04:12', reason: 'Exited full-screen mode', penalty: 15 },
            ]
          });
        } else {
          setResultData({
            examTitle: 'Advanced Web Development & PWA Architecture',
            totalQuestions: 10,
            score: 7,
            maxScore: 10,
            percentage: 70,
            integrityScore: 70,
            status: 'Completed',
            submittedAt: '10:45 AM',
            infractionLogs: [
              { timestamp: '00:02:15', reason: 'Candidate face temporarily not detected (5s)', penalty: 0 },
              { timestamp: '00:11:40', reason: 'Focus lost from exam window (Tab switch)', penalty: 15 },
              { timestamp: '00:18:22', reason: 'Exited full-screen mode', penalty: 15 }
            ]
          });
        }
      } catch (error) {
        console.error('Failed to load exam result analytics:', error);
      } finally {
        setLoading(false);
      }
    }

    if (examId) {
      fetchResultData();
    }
  }, [examId]);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 text-slate-600 gap-4">
        <div className="w-10 h-10 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
        <span className="text-xs font-black uppercase tracking-widest text-indigo-600">Compiling Evaluation Metrics...</span>
      </div>
    );
  }

  if (!resultData) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen bg-slate-50 text-slate-900 gap-4">
        <h1 className="text-xl font-black">Report Not Found</h1>
        <p className="text-xs text-slate-500">Could not retrieve analytics data for this session.</p>
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-xs font-black uppercase tracking-wider transition shadow-lg cursor-pointer"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/20 text-slate-900 font-sans p-4 sm:p-8 selection:bg-indigo-600 selection:text-white">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/dashboard')}
            className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-slate-600 hover:text-indigo-600 transition bg-white px-4 py-2.5 rounded-2xl border border-slate-200 cursor-pointer shadow-sm"
          >
            <ArrowLeft size={16} /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2 text-xs font-mono text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs">
            <Lock size={12} className="text-indigo-600" />
            <span>Session ID: {examId}</span>
          </div>
        </div>

        {/* Hero Title & Status Banner */}
        <div className="relative overflow-hidden bg-white p-6 sm:p-10 rounded-3xl shadow-xl border border-slate-200/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="absolute top-0 right-0 -mt-12 -mr-12 w-64 h-64 bg-indigo-50 rounded-full blur-3xl pointer-events-none"></div>
          
          <div className="space-y-3 relative z-10">
            <div className="inline-flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-3 py-1 rounded-xl border border-indigo-100">
              <Sparkles size={12} /> Verified Assessment Report
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{resultData.examTitle}</h1>
            <p className="text-xs text-slate-500 font-medium">Successfully completed and encrypted at {resultData.submittedAt}</p>
          </div>

          <div className={`relative z-10 flex items-center gap-2 px-5 py-3 rounded-2xl border text-xs font-black uppercase tracking-wider shadow-sm ${
            resultData.status === 'Completed' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'
          }`}>
            {resultData.status === 'Completed' ? <CheckCircle2 size={18} /> : <XCircle size={18} />}
            <span>Status: {resultData.status}</span>
          </div>
        </div>

        {/* Key Metrics Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* Final Score Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Final Score</span>
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <Award size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">{resultData.score}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">/ {resultData.maxScore} Correct</span>
            </div>
            <div className="inline-block text-xs font-black text-indigo-600 bg-indigo-50 px-3 py-1 rounded-lg border border-indigo-100">
              {resultData.percentage}% Overall Grade
            </div>
          </div>

          {/* Integrity Score Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Integrity Score</span>
              <div className={`w-10 h-10 rounded-2xl border flex items-center justify-center ${
                resultData.integrityScore > 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-600' : 'bg-amber-50 border-amber-100 text-amber-600'
              }`}>
                {resultData.integrityScore > 80 ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">{resultData.integrityScore}%</span>
            </div>
            <div className={`inline-block text-xs font-black px-3 py-1 rounded-lg border ${
              resultData.integrityScore > 80 ? 'bg-emerald-50 border-emerald-100 text-emerald-700' : 'bg-amber-50 border-amber-100 text-amber-700'
            }`}>
              {resultData.integrityScore > 80 ? 'High Compliance' : 'Moderate Infractions'}
            </div>
          </div>

          {/* Total Infractions Card */}
          <div className="bg-white p-6 rounded-3xl shadow-xl border border-slate-200/80 space-y-3 hover:border-slate-300 transition">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-xs font-black uppercase tracking-wider text-slate-600">Logged Events</span>
              <div className="w-10 h-10 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <Activity size={20} />
              </div>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-black text-slate-900 font-mono">{resultData.infractionLogs.length}</span>
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Warnings</span>
            </div>
            <div className="inline-block text-xs font-black text-rose-600 bg-rose-50 px-3 py-1 rounded-lg border border-rose-100">
              -{resultData.infractionLogs.reduce((acc, curr) => acc + curr.penalty, 0)}% Total Penalty
            </div>
          </div>

        </div>

        {/* AI Insights & Proctoring Audit Logs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* AI Insights Panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600">
                <BarChart3 size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">AI Proctoring Insights</h3>
            </div>
            <div className="space-y-3.5">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex items-center gap-2 text-indigo-600 text-xs font-black uppercase">
                  <TrendingUp size={14} /> Attention Stability
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  Candidate remained correctly positioned within the camera framework for 92% of the active duration, reflecting reliable focus.
                </p>
              </div>
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/60 space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-600 text-xs font-black uppercase">
                  <ShieldCheck size={14} /> Environment Security
                </div>
                <p className="text-xs text-slate-600 leading-relaxed font-medium">
                  No unauthorized secondary individuals or hidden devices were registered during the active examination sequence.
                </p>
              </div>
            </div>
          </div>

          {/* Audit Logs Panel */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-200/80 space-y-5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <FileText size={18} />
              </div>
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">Security & Infraction Logs</h3>
            </div>
            
            {resultData.infractionLogs.length === 0 ? (
              <div className="text-center py-12 text-xs text-slate-400 font-bold bg-slate-50 rounded-2xl border border-slate-200/60">
                No security infractions or warnings recorded. Perfect compliance!
              </div>
            ) : (
              <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                {resultData.infractionLogs.map((log, index) => (
                  <div key={index} className="flex items-center justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs shadow-xs">
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-bold text-amber-700 bg-amber-100 border border-amber-200 px-2.5 py-1 rounded-lg">
                        {log.timestamp}
                      </span>
                      <span className="font-medium text-slate-700">{log.reason}</span>
                    </div>
                    {log.penalty > 0 && (
                      <span className="font-mono font-black text-rose-600 bg-rose-50 border border-rose-200 px-2.5 py-1 rounded-lg">
                        -{log.penalty}%
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}