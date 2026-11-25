// src/app/dashboard/page.tsx
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  FileText,
  PlusCircle,
  Layers,
  Laptop,
  FileSpreadsheet,
  CheckCircle,
  CloudSync,
  AlertCircle,
  RefreshCw,
  Sparkles,
  ArrowUpRight,
  FolderKanban,
  ChevronDown,
} from 'lucide-react';
import { db, LocalExam, StudentRecord as DbStudentRecord } from '@/lib/db';
import { examviaSyncEngine } from '@/lib/syncEngine';
import LogOutButton from '@/components/LogOutButton';

export default function DashboardPage() {
  const router = useRouter();
  const [exams, setExams] = useState<LocalExam[]>([]);
  const [allStudents, setAllStudents] = useState<DbStudentRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Sync Status States
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncError, setSyncError] = useState<string | null>(null);

  // Exam Selector Dropdown State
  const [isExamMenuOpen, setIsExamMenuOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const refreshFromLocalDb = useCallback(async () => {
    const [localExams, localStudents] = await Promise.all([
      db.exams.toArray(),
      db.studentRecords.toArray(),
    ]);
    setExams(localExams);
    setAllStudents(localStudents);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadAndSync() {
      try {
        await refreshFromLocalDb();
      } catch (error) {
        console.error('Failed to fetch local dashboard data:', error);
      } finally {
        if (isMounted) setLoading(false);
      }

      examviaSyncEngine.init();

      if (typeof navigator !== 'undefined' && navigator.onLine) {
        try {
          if (isMounted) setIsSyncing(true);
          const result = await examviaSyncEngine.syncPendingData();
          if (!isMounted) return;

          if (result.success) {
            await refreshFromLocalDb();
            setSyncError(null);
          } else if (result.error && !result.error.includes('already in progress')) {
            setSyncError(result.error);
          }
        } catch (err: any) {
          if (isMounted) {
            setSyncError(err?.message || 'Initial background sync failed.');
          }
        } finally {
          if (isMounted) setIsSyncing(false);
        }
      }
    }

    const handleOnlineReconnect = async () => {
      if (!isMounted) return;
      setIsSyncing(true);
      const result = await examviaSyncEngine.syncPendingData();
      if (!isMounted) return;
      if (result.success) {
        await refreshFromLocalDb();
        setSyncError(null);
      }
      setIsSyncing(false);
    };

    const handleOutsideClick = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsExamMenuOpen(false);
      }
    };

    loadAndSync();
    window.addEventListener('online', handleOnlineReconnect);
    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      isMounted = false;
      window.removeEventListener('online', handleOnlineReconnect);
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [refreshFromLocalDb]);

  const pendingItemsCount =
    exams.filter((e) => e.syncStatus !== 'synced').length +
    allStudents.filter((s) => s.syncStatus !== 'synced').length;

  const handleBulkSync = useCallback(async () => {
    if (isSyncing) return;
    setIsSyncing(true);
    setSyncError(null);

    try {
      const result = await examviaSyncEngine.syncPendingData();
      if (result.success) {
        await refreshFromLocalDb();
      } else {
        setSyncError(result.error || 'Synchronization failed.');
      }
    } catch (err: any) {
      setSyncError(err?.message || 'Network error during sync.');
    } finally {
      setIsSyncing(false);
    }
  }, [isSyncing, refreshFromLocalDb]);

  const getExamRosterStats = (examId?: string) => {
    const examStudents = allStudents.filter((s) => s.examId === examId);
    const scannedOrSubmitted = examStudents.filter(
      (s) => s.omrScanned || Boolean(s.submittedAt)
    ).length;
    const evaluated = examStudents.filter((s) => s.passed !== undefined);
    const passed = evaluated.filter((s) => s.passed).length;
    const passPct =
      evaluated.length > 0 ? `${((passed / evaluated.length) * 100).toFixed(1)}%` : '—';

    return { total: examStudents.length, scannedOrSubmitted, passPct };
  };

  const getSyncButtonStyle = () => {
    if (isSyncing) return 'bg-blue-50 text-blue-600 border-blue-200 cursor-not-allowed';
    if (syncError) return 'bg-rose-50 text-rose-600 border-rose-200 hover:bg-rose-100';
    if (pendingItemsCount > 0)
      return 'bg-amber-50 text-amber-700 border-amber-200 animate-pulse hover:bg-amber-100';
    return 'bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100';
  };

  const handleSelectExam = (examId?: string) => {
    if (!examId) return;
    setIsExamMenuOpen(false);
    router.push(`/dashboard/${encodeURIComponent(examId)}`);
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 md:px-8 py-4 sm:py-6 md:py-8 space-y-6 sm:space-y-8 bg-gradient-to-br from-slate-50 via-slate-100/50 to-indigo-50/20 min-h-screen font-sans overflow-x-hidden">
      {/* Top Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white/90 backdrop-blur-md p-4 sm:p-5 lg:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200/80 gap-4 relative z-30">
        <div className="space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-widest bg-gradient-to-r from-indigo-500 to-violet-600 text-white shadow-sm shadow-indigo-500/20">
            <Sparkles size={11} /> Examvia Assessment Hub
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Evaluation & Dashboard
          </h1>
          <p className="text-xs font-medium text-slate-500">
            Select any exam blueprint below to manage rosters, scan OMR sheets, or view results.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-start lg:justify-end">
          {/* Sync Button */}
          <button
            type="button"
            onClick={handleBulkSync}
            disabled={isSyncing}
            className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-black uppercase tracking-wider transition-all shadow-2xs cursor-pointer shrink-0 ${getSyncButtonStyle()}`}
            title={
              syncError ||
              (pendingItemsCount > 0 ? `${pendingItemsCount} pending records` : 'All synced')
            }
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
            ) : pendingItemsCount > 0 ? (
              <>
                <AlertCircle size={13} />
                <span>Sync ({pendingItemsCount})</span>
              </>
            ) : (
              <>
                <CheckCircle size={13} />
                <span>Synced</span>
              </>
            )}
          </button>

          {/* Create Blueprint CTA */}
          <Link
            href="/exams/create"
            className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-3.5 py-2 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all shadow-2xs"
          >
            <PlusCircle size={13} /> Create New Exam
          </Link>

          {/* Exam Selector Dropdown -> Redirects to /dashboard/[examId] */}
          <div ref={dropdownRef} className="relative w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsExamMenuOpen((prev) => !prev)}
              className="flex items-center justify-between gap-2.5 bg-slate-50 hover:bg-slate-100 text-slate-900 px-3.5 py-2 rounded-xl font-bold transition-all cursor-pointer text-xs border border-slate-200/80 shadow-2xs w-full sm:min-w-[205px]"
            >
              <div className="flex items-center gap-2 truncate">
                <div className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                  <FolderKanban size={13} />
                </div>
                <span className="truncate font-black text-xs">Select Exam...</span>
              </div>
              <ChevronDown
                size={13}
                className={`text-slate-400 transition-transform duration-200 shrink-0 ${
                  isExamMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isExamMenuOpen && (
              <div className="absolute right-0 mt-2 w-full sm:w-72 bg-white/95 backdrop-blur-xl rounded-2xl shadow-xl border border-slate-200/80 z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
                <div className="p-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase tracking-wider text-slate-400">
                    Open Exam Dashboard
                  </span>
                  <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                    {exams.length} Total
                  </span>
                </div>

                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100/60 p-1">
                  {exams.length === 0 ? (
                    <div className="px-3 py-4 text-center text-xs text-slate-400 font-semibold">
                      No exams  available
                    </div>
                  ) : (
                    exams.map((ex) => (
                      <button
                        key={ex.id}
                        type="button"
                        onClick={() => handleSelectExam(ex.id)}
                        className="w-full text-left px-3 py-2.5 rounded-xl transition flex items-center justify-between text-slate-700 hover:bg-indigo-50 hover:text-indigo-900 cursor-pointer group"
                      >
                        <div className="truncate pr-2">
                          <p className="text-xs truncate font-bold">{ex.examTitle}</p>
                          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">
                            {ex.id} • {ex.examMode} • {ex.totalQuestions} Qs
                          </p>
                        </div>
                        <ArrowUpRight
                          size={14}
                          className="text-slate-300 group-hover:text-indigo-600 shrink-0 transition-colors"
                        />
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          <LogOutButton />
        </div>
      </div>

      {/* Global Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Exams
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{exams.length}</h3>
            <span className="inline-block text-[11px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
              Active assessments
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileText size={24} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Offline (OMR)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {exams.filter((e) => e.examMode === 'offline').length}
            </h3>
            <span className="inline-block text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-100">
              Secure local mode
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center shrink-0">
            <FileSpreadsheet size={24} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Online (CBT)
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {exams.filter((e) => e.examMode === 'online').length}
            </h3>
            <span className="inline-block text-[11px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-lg border border-blue-100">
              Cloud connected
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
            <Laptop size={24} />
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Total Questions
            </p>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-900">
              {exams.reduce((acc, curr) => acc + (curr.totalQuestions || 0), 0)}
            </h3>
            <span className="inline-block text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-100">
              Across all banks
            </span>
          </div>
          <div className="w-12 h-12 sm:w-14 sm:h-14 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center shrink-0">
            <Layers size={24} />
          </div>
        </div>
      </div>

      {/* All Exams Registry */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-200/80 overflow-hidden">
        <div className="p-4 sm:p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div>
            <h2 className="text-lg sm:text-xl font-black text-slate-900">All Exams Registry</h2>
            <p className="text-xs font-medium text-slate-500 mt-1">
              Click any exam to open its dedicated workspace, attendance matrix, and OMR tools.
            </p>
          </div>
          <span className="text-[11px] font-mono font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200/80">
            {exams.length} Blueprints
          </span>
        </div>

        {loading ? (
          <div className="p-16 text-center text-slate-400 font-bold text-sm flex flex-col items-center justify-center gap-3">
            <RefreshCw size={24} className="animate-spin text-indigo-600" />
            <span>Loading exam blueprints...</span>
          </div>
        ) : exams.length === 0 ? (
          <div className="p-12 text-center space-y-4">
            <p className="text-slate-500 text-xs font-bold">
              No exam blueprints found in local storage yet.
            </p>
            <Link
              href="/exams/create"
              className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider"
            >
              <PlusCircle size={14} /> Create First Exam Blueprint
            </Link>
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="block md:hidden divide-y divide-slate-100">
              {exams.map((exam) => {
                const stats = getExamRosterStats(exam.id);
                return (
                  <Link
                    key={exam.id}
                    href={`/dashboard/${exam.id}`}
                    className="block p-4 space-y-3 bg-white hover:bg-indigo-50/30 transition"
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg font-black text-[10px] uppercase tracking-wider ${
                          exam.examMode === 'offline'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-blue-50 text-blue-700 border border-blue-200'
                        }`}
                      >
                        {exam.examMode === 'offline' ? (
                          <FileSpreadsheet size={12} />
                        ) : (
                          <Laptop size={12} />
                        )}
                        {exam.examMode}
                      </span>
                      <span className="inline-flex items-center gap-1 text-indigo-600 font-black text-[11px]">
                        Open Workspace <ArrowUpRight size={13} />
                      </span>
                    </div>
                    <div>
                      <h4 className="font-black text-slate-900 text-sm">{exam.examTitle}</h4>
                      <span className="font-mono text-[10px] text-slate-400 font-bold block mt-0.5">
                        ID: {exam.id}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Candidates
                        </span>
                        <span className="font-mono font-black text-slate-700 mt-0.5 block">
                          {stats.total} Registered
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                        <span className="text-[10px] text-slate-400 uppercase font-black block">
                          Passing Ratio
                        </span>
                        <span className="font-mono font-black text-indigo-600 mt-0.5 block">
                          {stats.passPct}
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto w-full">
              <table className="w-full text-left border-collapse text-xs">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-400 uppercase font-black tracking-wider border-b border-slate-200 text-[10px]">
                    <th className="p-4 sm:p-5">Exam Title & ID</th>
                    <th className="p-4 sm:p-5">Mode</th>
                    <th className="p-4 sm:p-5">Sync Status</th>
                    <th className="p-4 sm:p-5">Candidates</th>
                    <th className="p-4 sm:p-5">Evaluation</th>
                    <th className="p-4 sm:p-5">Passing Ratio</th>
                    <th className="p-4 sm:p-5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                  {exams.map((exam) => {
                    const stats = getExamRosterStats(exam.id);
                    return (
                      <tr
                        key={exam.id}
                        className="hover:bg-slate-50/80 transition-colors duration-150"
                      >
                        <td className="p-4 sm:p-5">
                          <Link
                            href={`/dashboard/${exam.id}`}
                            className="font-black text-slate-900 hover:text-indigo-600 block text-sm transition"
                          >
                            {exam.examTitle}
                          </Link>
                          <span className="font-mono text-[10px] text-slate-400 font-bold mt-0.5 block">
                            {exam.id}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-wider ${
                              exam.examMode === 'offline'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}
                          >
                            {exam.examMode === 'offline' ? (
                              <FileSpreadsheet size={13} />
                            ) : (
                              <Laptop size={13} />
                            )}
                            {exam.examMode}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-xl font-black text-[10px] uppercase tracking-wider ${
                              exam.syncStatus === 'synced'
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {exam.syncStatus === 'synced' ? 'Synchronized' : 'Pending Sync'}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-mono font-black text-slate-700">
                          {stats.total} Candidates
                        </td>
                        <td className="p-4 sm:p-5">
                          <span className="inline-block bg-slate-100 text-slate-700 px-3 py-1 rounded-xl font-mono text-[10px] font-black border border-slate-200">
                            {exam.examMode === 'offline'
                              ? `${stats.scannedOrSubmitted} OMR Scanned`
                              : `${stats.scannedOrSubmitted} Submissions`}
                          </span>
                        </td>
                        <td className="p-4 sm:p-5 font-mono font-black text-indigo-600 text-sm">
                          {stats.passPct}
                        </td>
                        <td className="p-4 sm:p-5 text-right">
                          <Link
                            href={`/dashboard/${exam.id}`}
                            className="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 px-3.5 py-2 rounded-xl font-black text-xs transition"
                          >
                            Open <ArrowUpRight size={14} />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}