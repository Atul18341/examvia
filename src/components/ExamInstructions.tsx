// components/ExamInstructions.tsx
'use client';

import React, { useState } from 'react';
import { ShieldCheck, ShieldAlert, AlertTriangle, Globe, CheckCircle2 } from 'lucide-react';

interface ExamInstructionsProps {
  examTitle: string;
  durationMinutes: number;
  totalQuestions: number;
  onStartExam: () => void;
}

export default function ExamInstructions({
  examTitle,
  durationMinutes,
  totalQuestions,
  onStartExam,
}: ExamInstructionsProps) {
  const [lang, setLang] = useState<'en' | 'hi'>('en');
  const [agreed, setAgreed] = useState(false);

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4 sm:p-6 font-sans">
      <div className="bg-white max-w-2xl w-full p-6 sm:p-8 rounded-3xl shadow-2xl space-y-6">
        
        {/* Header & Language Toggle */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center shadow-inner">
              <ShieldCheck size={24} />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md border border-indigo-100">
                {lang === 'en' ? 'Secure CBT Gateway' : 'सुरक्षित सीबीटी गेटवे'}
              </span>
              <h2 className="text-base sm:text-lg font-black text-slate-900 mt-0.5">{examTitle}</h2>
            </div>
          </div>

          <button
            onClick={() => setLang(lang === 'en' ? 'hi' : 'en')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-700 bg-slate-50 hover:bg-slate-100 transition cursor-pointer"
          >
            <Globe size={14} />
            <span>{lang === 'en' ? 'हिंदी (Hindi)' : 'English'}</span>
          </button>
        </div>

        {/* Quick Meta Info */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {lang === 'en' ? 'Duration / अवधि' : 'अवधि / Duration'}
            </span>
            <span className="font-black text-slate-900 text-sm">{durationMinutes} {lang === 'en' ? 'Minutes' : 'मिनट'}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200/60">
            <span className="text-slate-400 font-bold block uppercase text-[10px]">
              {lang === 'en' ? 'Questions / प्रश्न' : 'प्रश्न / Questions'}
            </span>
            <span className="font-black text-slate-900 text-sm">{totalQuestions} {lang === 'en' ? 'MCQ Items' : 'बहुविकल्पीय प्रश्न'}</span>
          </div>
        </div>

        {/* Instructions Body */}
        <div className="space-y-4 max-h-[320px] overflow-y-auto pr-2">
          
          {/* General Guidelines */}
          <div className="space-y-2">
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">
              {lang === 'en' ? '1. General Guidelines' : '1. सामान्य निर्देश'}
            </h3>
            <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4 leading-relaxed">
              {lang === 'en' ? (
                <>
                  <li>The clock has been set at the server and countdown timer at the top right will display remaining time.</li>
                  <li>You can navigate between questions using the question palette on the side.</li>
                  <li>Ensure stable internet connectivity; your responses are synced locally and securely.</li>
                </>
              ) : (
                <>
                  <li>सर्वर पर घड़ी सेट कर दी गई है और ऊपर दाईं ओर का काउंटडाउनタイम शेष समय दिखाएगा।</li>
                  <li>आप साइड में दिए गए प्रश्न पैलेट का उपयोग करके प्रश्नों के बीच नेविगेट कर सकते हैं।</li>
                  <li>स्थिर इंटरनेट कनेक्टिविटी सुनिश्चित करें; आपके उत्तर स्थानीय रूप से सुरक्षित रूप से सिंक किए जाते हैं।</li>
                </>
              )}
            </ul>
          </div>

          {/* Infraction & Integrity Rules */}
          <div className="bg-rose-50/50 rounded-2xl p-4 border border-rose-100 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-rose-900 flex items-center gap-1.5">
                <ShieldAlert size={15} className="text-rose-600" /> 
                {lang === 'en' ? 'AI Integrity Monitoring Policy' : 'एआई इंटीग्रिटी मॉनिटरिंग नीति'}
              </span>
              <span className="text-[10px] font-bold font-mono bg-rose-100 text-rose-800 px-2 py-0.5 rounded-md">
                100% Start Score
              </span>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              {lang === 'en' 
                ? 'Strict behavioral monitoring is active. Each violation deducts points and requires full-screen restoration:'
                : 'सख्त व्यवहार निगरानी सक्रिय है। प्रत्येक उल्लंघन पर अंक काटे जाते हैं और पूर्ण-स्क्रीन बहाली की आवश्यकता होती है:'}
            </p>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-rose-200/60 shadow-2xs">
                <span className="text-slate-700 font-medium">{lang === 'en' ? 'Exiting Full-Screen Mode' : 'फुल-स्क्रीन मोड से बाहर निकलना'}</span>
                <span className="font-mono font-bold text-rose-600">-15%</span>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-rose-200/60 shadow-2xs">
                <span className="text-slate-700 font-medium">{lang === 'en' ? 'Tab Switch / Window Minimization' : 'टैब बदलना / विंडो मिनिमाइज करना'}</span>
                <span className="font-mono font-bold text-rose-600">-15%</span>
              </div>
              <div className="flex items-center justify-between bg-white px-3 py-2 rounded-xl border border-rose-200/60 shadow-2xs">
                <span className="text-slate-700 font-medium">{lang === 'en' ? 'Unauthorized Copy / Paste' : 'अनधिकृत कॉपी / पेस्ट'}</span>
                <span className="font-mono font-bold text-rose-600">-15%</span>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-xl p-2.5 text-[11px] font-medium text-amber-800 flex items-start gap-2">
              <AlertTriangle size={15} className="shrink-0 mt-0.5 text-amber-600" />
              <span>
                {lang === 'en' 
                  ? 'Critical Rule: If your integrity score drops to 0%, your exam will be automatically submitted immediately.'
                  : 'महत्वपूर्ण नियम: यदि आपका इंटीग्रिटी स्कोर 0% तक गिर जाता है, तो आपकी परीक्षा तुरंत स्वतः सबमिट हो जाएगी।'}
              </span>
            </div>
          </div>

        </div>

        {/* Agreement Checkbox & Action Button */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <label className="flex items-start gap-3 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer"
            />
            <span className="text-xs font-bold text-slate-700 leading-snug">
              {lang === 'en' 
                ? 'I have read and understood all instructions. I agree to abide by the AI proctoring and full-screen rules.'
                : 'मैंने सभी निर्देशों को पढ़ और समझ लिया है। मैं एआई प्रॉक्टरिंग और फुल-स्क्रीन नियमों का पालन करने के लिए सहमत हूँ।'}
            </span>
          </label>

          <button
            onClick={onStartExam}
            disabled={!agreed}
            className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 disabled:opacity-40 text-white rounded-2xl text-xs font-black uppercase tracking-wider shadow-lg shadow-indigo-600/30 transition cursor-pointer flex items-center justify-center gap-2"
          >
            <CheckCircle2 size={16} />
            {lang === 'en' ? 'Launch Secure Exam & Enter Full-Screen' : 'सुरक्षित परीक्षा शुरू करें और फुल-स्क्रीन दर्ज करें'}
          </button>
        </div>

      </div>
    </div>
  );
}