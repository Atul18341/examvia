'use client';
import { useState } from 'react';
import { FileText, PlusCircle, Settings2, Laptop, FileSpreadsheet, Trash2, Clock, Percent } from 'lucide-react';
import { db, LocalExam } from '@/lib/db';

interface SubjectSection {
  name: string;
  questionsCount: number;
  cutoff: number;
}

export default function CreateExamForm() {
  const [formData, setFormData] = useState({
    examTitle: '',
    examMode: 'offline' as 'offline' | 'online',
    durationMinutes: 120,
    passingMarks: 33,
    enableNegativeMarking: false,
    negativeMarkValue: 0.25,
    enableSets: false,
    enableSectionalCutoff: false,
  });

  const [subjects, setSubjects] = useState<SubjectSection[]>([
    { name: 'General Aptitude', questionsCount: 25, cutoff: 10 },
    { name: 'Science & Mathematics', questionsCount: 25, cutoff: 10 },
  ]);

  const [loading, setLoading] = useState(false);

  const totalQuestions = subjects.reduce((sum, subj) => sum + Number(subj.questionsCount || 0), 0);

  const handleAddSubject = () => {
    setSubjects([...subjects, { name: '', questionsCount: 10, cutoff: 5 }]);
  };

  const handleRemoveSubject = (index: number) => {
    if (subjects.length === 1) return;
    const updated = subjects.filter((_, i) => i !== index);
    setSubjects(updated);
  };

  const handleSubjectChange = (index: number, field: keyof SubjectSection, value: string | number) => {
    const updated = [...subjects];
    updated[index] = { ...updated[index], [field]: value };
    setSubjects(updated);
  };

  // --- Store Data into IndexedDB via Dexie with syncStatus set to pending ---
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
function generateExamId(): string {
  const now = new Date();
  const yy = String(now.getFullYear()).slice(-2);
  const mm = String(now.getMonth() + 1).padStart(2, '0');
  const chars = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'; // Excludes 0, O, 1, I
  const bytes = new Uint8Array(4);
  crypto.getRandomValues(bytes);
  const suffix = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  return `EXAM-${yy}${mm}-${suffix}`; // e.g., EXAM-2611-K9P4
}
    try {
      const examId = generateExamId();
      
      const newExamRecord: LocalExam = {
        id: examId,
        ...formData,
        subjects,
        totalQuestions,
        createdAt: new Date().toISOString(),
        syncStatus: 'pending', // Explicitly marked as pending for bulk synchronization engine
      };

      // Save locally to IndexedDB
      await db.exams.add(newExamRecord);

      alert(`Exam successfully saved offline to IndexedDB! ID: ${examId}`);
      
      window.location.href = `/dashboard`;
    } catch (error) {
      console.error('Failed to save exam locally:', error);
      alert('Error saving exam to local storage.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-bold">
          <FileText size={22} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Create New Exam</h2>
          <p className="text-sm text-slate-500">Configure parameters and save locally via IndexedDB</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Exam Name / Title
          </label>
          <input
            type="text"
            required
            placeholder="e.g. Pratibha Khoj Scholarship Test 2026"
            value={formData.examTitle}
            onChange={(e) => setFormData({ ...formData, examTitle: e.target.value })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Exam Mode
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, examMode: 'offline' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition ${
                  formData.examMode === 'offline'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <FileSpreadsheet size={15} /> Offline (OMR)
              </button>
              <button
                type="button"
                onClick={() => setFormData({ ...formData, examMode: 'online' })}
                className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg border text-xs font-bold transition ${
                  formData.examMode === 'online'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                    : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                }`}
              >
                <Laptop size={15} /> Online (CBT)
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5 flex items-center gap-1.5">
              <Clock size={14} /> Allotted Time (Minutes)
            </label>
            <input
              type="number"
              min="5"
              required
              value={formData.durationMinutes}
              onChange={(e) => setFormData({ ...formData, durationMinutes: Number(e.target.value) })}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-mono"
            />
          </div>
        </div>

        {/* --- DYNAMIC SUBJECTS / CATEGORIES SECTION WITH EMBEDDED CUTOFF TOGGLE --- */}
        <div className="space-y-3 bg-slate-50/70 p-4 rounded-xl border border-slate-200">
          <div className="flex justify-between items-center pb-2 border-b border-slate-200">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-800">
                Subjects & Sections
              </label>
              <span className="text-[11px] text-slate-500">Manage categories, question allocation, and section rules.</span>
            </div>
            <button
              type="button"
              onClick={handleAddSubject}
              className="text-xs bg-indigo-50 text-indigo-600 hover:bg-indigo-100 font-bold px-3 py-1.5 rounded-lg border border-indigo-200 transition"
            >
              + Add Subject
            </button>
          </div>

          <div className="flex items-center justify-between bg-white p-3 rounded-lg border border-slate-200">
            <div>
              <span className="block text-xs font-bold text-slate-800">Enable Sectional Cut-off</span>
              <span className="block text-[10px] text-slate-500">Require individual passing marks per subject</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableSectionalCutoff}
                onChange={(e) => setFormData({ ...formData, enableSectionalCutoff: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-9 h-5 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          <div className="space-y-2 pt-1">
            {subjects.map((subject, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  required
                  placeholder={`Subject ${index + 1} Name`}
                  value={subject.name}
                  onChange={(e) => handleSubjectChange(index, 'name', e.target.value)}
                  className="flex-1 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                <input
                  type="number"
                  min="1"
                  required
                  placeholder="Qns"
                  value={subject.questionsCount}
                  onChange={(e) => handleSubjectChange(index, 'questionsCount', Number(e.target.value))}
                  className="w-20 px-3 py-2 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600"
                />
                {formData.enableSectionalCutoff && (
                  <input
                    type="number"
                    min="0"
                    required
                    placeholder="Cut-off"
                    value={subject.cutoff}
                    onChange={(e) => handleSubjectChange(index, 'cutoff', Number(e.target.value))}
                    className="w-20 px-3 py-2 bg-amber-50 border border-amber-300 rounded-lg text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                )}
                {subjects.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveSubject(index)}
                    className="p-2 text-slate-400 hover:text-rose-600 transition"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-slate-200 text-xs font-semibold text-slate-700">
            <span>Total Calculated Questions:</span>
            <span className="font-mono text-indigo-600 font-bold text-sm">{totalQuestions} Questions</span>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
            Overall Passing Marks
          </label>
          <input
            type="number"
            min="1"
            required
            value={formData.passingMarks}
            onChange={(e) => setFormData({ ...formData, passingMarks: Number(e.target.value) })}
            className="w-full px-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-600 text-sm font-mono"
          />
        </div>

        <div className="bg-slate-50/70 p-4 rounded-xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Percent className="text-slate-500" size={20} />
              <div>
                <span className="block text-sm font-bold text-slate-800">Negative Marking Allowed</span>
                <span className="block text-xs text-slate-500">Deduct marks for incorrect answers</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableNegativeMarking}
                onChange={(e) => setFormData({ ...formData, enableNegativeMarking: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>

          {formData.enableNegativeMarking && (
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-700">Deduction per incorrect answer:</span>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-rose-600">-</span>
                <input
                  type="number"
                  step="0.05"
                  min="0.05"
                  max="2"
                  required
                  value={formData.negativeMarkValue}
                  onChange={(e) => setFormData({ ...formData, negativeMarkValue: Number(e.target.value) })}
                  className="w-24 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-900 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-600 text-center"
                />
                <span className="text-xs text-slate-500">marks</span>
              </div>
            </div>
          )}
        </div>

        {formData.examMode === 'offline' && (
          <div className="flex items-center justify-between bg-slate-50/70 p-4 rounded-xl border border-slate-200">
            <div className="flex items-center gap-3">
              <Settings2 className="text-slate-500" size={20} />
              <div>
                <span className="block text-sm font-bold text-slate-800">Enable Multi-Set Shuffling</span>
                <span className="block text-xs text-slate-500">Optional: Generate Set A, B, C variants for strict halls</span>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={formData.enableSets}
                onChange={(e) => setFormData({ ...formData, enableSets: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
            </label>
          </div>
        )}

        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition shadow-sm flex items-center justify-center gap-2 cursor-pointer"
          >
            <PlusCircle size={18} />
            {loading ? 'Saving Locally...' : `Save & Initialize ${formData.examMode.toUpperCase()} Exam`}
          </button>
        </div>
      </form>
    </div>
  );
}