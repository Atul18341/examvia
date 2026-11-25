// src/app/page.tsx
"use client";

import React, { useState } from "react";
import Link from "next/link";

const FAQS = [
  {
    q: "Do we need special paper or an expensive OMR scanner machine?",
    a: "No. You can print OMR sheets on regular A4 office paper using any normal printer, and check them using your phone camera, webcam, or scanned photos. Examvia automatically straightens tilted photos before checking answers.",
  },
  {
    q: "What happens if the internet goes down during an exam or while scanning?",
    a: "Nothing is lost. Examvia saves your exam setup, student attendance, scanned OMR sheets, and marks directly on your computer or phone first, and uploads them automatically once your internet comes back.",
  },
  {
    q: "What details are printed on the OMR answer sheets?",
    a: "Every A4 sheet comes ready with your exam name, a unique serial number, Roll Number and Center Code boxes, instructions in both English and Hindi, Booklet Set bubbles (A, B, C, D), and space for up to 200 questions.",
  },
  {
    q: "How fast can we print OMR sheets and check student papers?",
    a: "You can download a ready-to-print PDF of up to 2,000 numbered OMR sheets in just a few seconds. When checking papers, Examvia highlights detected answers on screen so you can review or fix any unclear mark with one tap.",
  },
  {
    q: "Can we use Examvia for a one-time scholarship test or entrance exam?",
    a: "Yes. Click the Single-Day Exam Quote button in the pricing section to see an instant price estimate for 500 to 25,000+ students without paying for a monthly plan.",
  },
];

export default function ExamviaLanding() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [billingAnnual, setBillingAnnual] = useState(true);

  // Quick-Quote Modal State
  const [quoteModalOpen, setQuoteModalOpen] = useState(false);
  const [candidateCount, setCandidateCount] = useState<number>(1500);
  const [examMode, setExamMode] = useState<"omr" | "online" | "hybrid">("omr");
  const [instituteName, setInstituteName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [examDate, setExamDate] = useState("");
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);

  // Dynamic per-candidate rate calculation for single-day events
  const getRatePerCandidate = (count: number, mode: "omr" | "online" | "hybrid") => {
    const baseRate = mode === "omr" ? 3 : mode === "online" ? 5 : 6;
    if (count >= 10000) return Math.max(1.5, baseRate - 1.5);
    if (count >= 3000) return Math.max(2, baseRate - 1);
    return baseRate;
  };

  const estimatedTotal = Math.round(
    candidateCount * getRatePerCandidate(candidateCount, examMode)
  );

  const handleQuoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  const resetQuoteModal = () => {
    setQuoteSubmitted(false);
    setQuoteModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased selection:bg-indigo-600 selection:text-white">
      {/* 1. NAVIGATION BAR */}
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white font-bold shadow-sm">
              E
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Examvia
              </span>
              <span className="ml-2 hidden rounded bg-slate-100 px-1.5 py-0.5 text-[11px] font-medium text-slate-500 sm:inline-block">
                by LYSS Technology
              </span>
            </div>
          </div>

          <nav className="hidden items-center gap-8 text-sm font-medium text-slate-600 md:flex">
            <a href="#problem-solution" className="hover:text-indigo-600 transition">
              Why Examvia
            </a>
            <a href="#how-it-works" className="hover:text-indigo-600 transition">
              How It Works
            </a>
            <a href="#features" className="hover:text-indigo-600 transition">
              Features
            </a>
            <a href="#pricing" className="hover:text-indigo-600 transition">
              Pricing
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="hidden text-sm font-semibold text-slate-700 hover:text-indigo-600 sm:inline-block"
            >
              Sign In
            </Link>
            <Link
              href="/signup"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-700 transition"
            >
              Start Free Exam
            </Link>
          </div>
        </div>
      </header>

      {/* 2. ABOVE-THE-FOLD HERO */}
      <section className="relative overflow-hidden bg-white pt-14 pb-20 sm:pt-20 sm:pb-28">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid items-center gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-indigo-200 bg-indigo-50 px-3.5 py-1 text-xs font-bold tracking-wide text-indigo-700 uppercase">
                <span className="h-2 w-2 rounded-full bg-indigo-600 animate-pulse" />
                Easy Offline OMR & Online Exam Platform
              </div>

              <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-[3.35rem] lg:leading-[1.12]">
                Print OMR Sheets, Scan With Your Phone & Publish Results—
                <span className="text-indigo-600">Even Without Internet.</span>
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-slate-600">
                Run weekly coaching tests, school exams, and scholarship drives without buying
                costly OMR machines. Print bilingual A4 answer sheets, scan responses with your
                camera, and calculate marks automatically.
              </p>

              <div className="mt-8 flex flex-col gap-3.5 sm:flex-row sm:items-center">
                <Link
                  href="/signup"
                  className="inline-flex items-center justify-center rounded-xl bg-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-md hover:bg-indigo-700 transition"
                >
                  Create Your First Exam Free
                  <svg
                    className="ml-2 h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                <button
                  type="button"
                  onClick={() => setQuoteModalOpen(true)}
                  className="inline-flex items-center justify-center rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-base font-semibold text-slate-700 hover:bg-slate-50 transition"
                >
                  Get Single-Day Exam Quote
                </button>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs font-medium text-slate-500">
                <span className="flex items-center gap-1.5">
                  <CheckIcon /> No OMR scanner machine needed
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon /> Works smoothly even when Wi-Fi drops
                </span>
                <span className="flex items-center gap-1.5">
                  <CheckIcon /> Easy Excel/CSV student attendance upload
                </span>
              </div>
            </div>

            {/* Right Interactive Product Preview Mockup */}
            <div className="lg:col-span-5">
              <div className="relative rounded-2xl border border-slate-200 bg-slate-900 p-4 shadow-2xl">
                <div className="mb-3 flex items-center justify-between border-b border-slate-800 pb-2.5">
                  <div className="flex items-center gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
                    <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
                    <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                  </div>
                  <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-[11px] font-semibold text-emerald-400">
                    ● Saved & Backed Up
                  </span>
                </div>

                <div className="rounded-xl bg-slate-800/90 p-4 border border-slate-700">
                  <div className="flex items-center justify-between text-xs text-slate-300 mb-3">
                    <span className="font-semibold text-white">OMR Sheet Scanner • Set B</span>
                    <span className="rounded bg-emerald-500/20 px-2 py-0.5 text-emerald-300 font-mono">
                      Sheet Aligned
                    </span>
                  </div>

                  <div className="grid grid-cols-5 gap-2 text-center text-[11px] font-mono">
                    {[
                      { q: "Q01", ans: "B", ok: true },
                      { q: "Q02", ans: "D", ok: true },
                      { q: "Q03", ans: "A", ok: true },
                      { q: "Q04", ans: "—", ok: false },
                      { q: "Q05", ans: "B", ok: true },
                    ].map((item) => (
                      <div
                        key={item.q}
                        className="rounded-lg border border-slate-700 bg-slate-900/80 p-2"
                      >
                        <div className="text-slate-400">{item.q}</div>
                        <div
                          className={`mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full font-bold ${
                            item.ok
                              ? "bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500"
                              : "bg-amber-500/20 text-amber-300 ring-1 ring-amber-500"
                          }`}
                        >
                          {item.ans}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-slate-800/90 p-4 border border-slate-700">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold text-white">
                        Roll #202601 • Aarav Kumar
                      </p>
                      <p className="text-[11px] text-slate-400">
                        Present • Set B • Sheet #LIB20260001
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-lg font-extrabold text-emerald-400">84 / 100</span>
                      <p className="text-[10px] uppercase tracking-wider text-emerald-300">
                        Passed
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-700">
                    <div className="h-full w-[84%] rounded-full bg-emerald-500" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. IMMEDIATE SOCIAL PROOF & METRICS BAR */}
      <section className="border-y border-slate-200 bg-slate-100/80 py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
            <div>
              <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">Up to 2,000 OMRs</p>
              <p className="mt-1 text-sm text-slate-600">
                Download numbered A4 answer sheets in one PDF
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">Sets A / B / C / D</p>
              <p className="mt-1 text-sm text-slate-600">
                Automatic question set detection with easy manual edit
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">Offline + Online</p>
              <p className="mt-1 text-sm text-slate-600">
                Manage pen-and-paper OMR and computer tests together
              </p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-indigo-600 sm:text-3xl">Zero Data Loss</p>
              <p className="mt-1 text-sm text-slate-600">
                Saves safely on your device and backs up automatically
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROBLEM VS. SOLUTION */}
      <section id="problem-solution" className="py-20 sm:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Stop Wasting Hours Checking Papers by Hand or Fighting Bad Wi-Fi
            </h2>
            <p className="mt-4 text-lg text-slate-600">
              Running weekly tests shouldn’t require expensive hardware or late-night manual
              checking. Examvia handles printing, scanning, and grading in one place.
            </p>
          </div>

          <div className="mt-14 grid gap-8 lg:grid-cols-2">
            <div className="rounded-2xl border border-rose-200/80 bg-rose-50/40 p-8">
              <div className="inline-flex items-center rounded-md bg-rose-100 px-3 py-1 text-xs font-bold uppercase tracking-wide text-rose-700">
                The Old Way
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Traditional Exam Hassles</h3>
              <ul className="mt-6 space-y-4 text-slate-700">
                {[
                  "Spending ₹50,000+ on bulky OMR scanner machines and special thick sheets.",
                  "Online test portals stopping mid-exam whenever center internet disconnects.",
                  "Spending hours matching Set A, B, C, and D answer keys and calculating negative marks.",
                  "Unnumbered OMR sheets that make it hard to trace a student's physical paper later.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-200 text-xs font-bold text-rose-700">
                      ✕
                    </span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border-2 border-indigo-600 bg-indigo-50/30 p-8 shadow-sm">
              <div className="inline-flex items-center rounded-md bg-indigo-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                The Examvia Way
              </div>
              <h3 className="mt-4 text-xl font-bold text-slate-900">Built for Stress-Free Exam Days</h3>
              <ul className="mt-6 space-y-4 text-slate-800">
                {[
                  "Print English & Hindi A4 OMR sheets on regular paper and scan them using any phone or webcam.",
                  "Works without internet—saves attendance, scans, and scores locally and backs up when online.",
                  "Automatically reads booklet sets and up to 200 answers, with simple tap-to-edit controls.",
                  "Search present students by Roll Number, link their OMR serial number, and see Pass/Fail results instantly.",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                      ✓
                    </span>
                    <span className="font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. HOW IT WORKS */}
      <section id="how-it-works" className="border-t border-slate-200 bg-slate-50 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Simple 3-Step Workflow
            </span>
            <h2 className="mt-2 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              From Exam Setup to Final Results in Minutes
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                step: "01",
                title: "Create Exam & Print OMRs",
                desc: "Enter your exam title, total questions, passing marks, negative marking, and answer key—then download ready-to-print A4 OMR sheets.",
              },
              {
                step: "02",
                title: "Mark Attendance & Run Exam",
                desc: "Upload your student attendance list (Present/Absent) from Excel/CSV and conduct your offline OMR or online computer test.",
              },
              {
                step: "03",
                title: "Scan Sheets & Save Marks",
                desc: "Click a photo or upload scanned OMR sheets, check the highlighted answers on screen, pick the student's Roll Number, and save their score.",
              },
            ].map((card) => (
              <div
                key={card.step}
                className="relative rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-base font-extrabold text-white">
                  {card.step}
                </span>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{card.title}</h3>
                <p className="mt-3 leading-relaxed text-slate-600">{card.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CORE FEATURES (Z-PATTERN ROWS) */}
      <section id="features" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl space-y-24 px-4 sm:px-6 lg:px-8">
          {/* Feature 1 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1 rounded-2xl border border-slate-200 bg-slate-900 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 text-xs">
                <span className="font-semibold text-emerald-400">STUDENT RESULT SUMMARY</span>
                <span className="text-slate-400">Passing: 40 • -0.25 Wrong</span>
              </div>
              <div className="mt-4 space-y-2.5 text-sm">
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3.5 py-2.5">
                  <span>Roll #202601 • Set A • Present</span>
                  <span className="font-bold text-emerald-400">84 / 100 • Passed</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3.5 py-2.5">
                  <span>Roll #202602 • Set C • Present</span>
                  <span className="font-bold text-emerald-400">68.5 / 100 • Passed</span>
                </div>
                <div className="flex items-center justify-between rounded-lg bg-slate-800 px-3.5 py-2.5">
                  <span>Roll #202603 • Absent</span>
                  <span className="font-semibold text-rose-400">Not Appeared</span>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Fast Camera & Photo OMR Checking
              </span>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                Checks Answers Automatically—With Easy One-Tap Editing
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Take a photo with your phone or upload scanned images. Examvia automatically
                straightens the sheet, detects the Booklet Set (A, B, C, or D) and filled bubbles,
                and highlights any blank or double-marked questions so you can review them quickly.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Automatic straightening even if the photo is taken at an angle
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Filter blank or double-marked questions and fix them in one tap
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Instant marks and Pass/Fail calculation with negative marking
                </li>
              </ul>
            </div>
          </div>

          {/* Feature 2 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Works Without Internet
              </span>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                Never Worry About Power Cuts or Slow Broadband on Exam Day
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Even if your center loses internet connection, you can keep creating exams,
                importing attendance, and scanning OMR sheets without interruption. Everything stays
                saved on your device and syncs automatically once internet returns.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Zero lost scans or student marks during Wi-Fi outages
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Generate up to 2,000 numbered OMR sheets in one PDF offline
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Works cleanly on both office computers and mobile phones
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-900">Device Storage & Backup</span>
                  <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-semibold text-amber-800">
                    Offline Mode Active
                  </span>
                </div>
                <p className="mt-2 text-xs text-slate-500">
                  48 checked OMR sheets saved safely on this device. Waiting for internet.
                </p>
                <div className="mt-4 rounded-lg bg-emerald-50 border border-emerald-200 p-3 text-xs font-medium text-emerald-800">
                  ✓ Internet Back — All 48 student records backed up to your account
                </div>
              </div>
            </div>
          </div>

          {/* Feature 3 */}
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div className="order-2 lg:order-1 rounded-2xl border border-slate-200 bg-slate-50 p-6 shadow-sm">
              <div className="rounded-xl border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <span className="text-sm font-bold text-slate-900">Attendance & Sheet Tracking</span>
                  <span className="rounded bg-indigo-50 px-2 py-0.5 text-xs font-bold text-indigo-700">
                    Present Students Only
                  </span>
                </div>
                <div className="mt-4 space-y-2 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Student Attendance List:</span>
                    <span className="font-semibold text-emerald-600">Present / Absent Marked</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Roll Number Search:</span>
                    <span className="font-semibold text-emerald-600">Shows Only Present Students</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duplicate Sheet Protection:</span>
                    <span className="font-semibold text-slate-900">Warns If Serial Repeated</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 lg:order-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                Clean Attendance & Sheet Records
              </span>
              <h3 className="mt-2 text-3xl font-extrabold text-slate-900">
                Link Every Checked OMR Sheet to the Right Student & Serial Number
              </h3>
              <p className="mt-4 text-base leading-relaxed text-slate-600">
                Download a simple attendance sheet template, fill in Present/Absent in Excel, and
                upload it in one click. After scanning each OMR sheet, search the student's Roll
                Number, record their OMR serial number, and view their saved sheet image anytime.
              </p>
              <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Ready-made Excel/CSV attendance template download & upload
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> Prevents accidentally assigning a sheet to an absent student
                </li>
                <li className="flex items-center gap-2.5">
                  <CheckIcon /> View any student’s scanned OMR sheet photo right from their result row
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 7. BUILT FOR / USE CASES */}
      <section className="border-t border-slate-200 bg-slate-50 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-center text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Built for Every Institute & Exam Center
          </h2>
          <div className="mt-12 grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Coaching Institutes & Test Series",
                desc: "Run weekly mock tests for BPSC, SSC, JEE, and NEET batches with multi-set OMR checking, negative marking, and instant pass/fail results.",
              },
              {
                title: "Schools & Colleges",
                desc: "Manage term exams, attendance sheets, and both Offline OMR and Online computer tests without buying costly scanner machines.",
              },
              {
                title: "Skill Centers & Scholarship Exams",
                desc: "Conduct large exams smoothly even in low-internet areas with numbered OMR sheets and safe offline backup.",
              },
            ].map((uc) => (
              <div key={uc.title} className="rounded-2xl border border-slate-200 bg-white p-7 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900">{uc.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{uc.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. PRICING SECTION WITH FOUNDER'S LAUNCH OFFER & QUICK-QUOTE BANNER */}
      <section id="pricing" className="bg-white py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-300 bg-amber-50 px-4 py-1.5 text-xs font-bold text-amber-900 shadow-xs">
              <span>🚀 FOUNDER&apos;S LAUNCH OFFER:</span>
              <span className="font-normal">
                Lock in 48% off lifetime Institute pricing for the first 25 institutes
              </span>
            </div>

            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
              Simple Pricing That Grows With Your Institute
            </h2>
            <p className="mt-3 text-slate-600">
              Start free with A4 OMR printing and scanning, upgrade for unlimited batch tests, or
              get an instant quote for a one-day scholarship or entrance exam.
            </p>

            {/* Billing Toggle */}
            <div className="mt-6 inline-flex items-center rounded-xl bg-slate-100 p-1">
              <button
                type="button"
                onClick={() => setBillingAnnual(false)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  !billingAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                Monthly
              </button>
              <button
                type="button"
                onClick={() => setBillingAnnual(true)}
                className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition ${
                  billingAnnual ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                }`}
              >
                Annual (Save 20%)
              </button>
            </div>
          </div>

          {/* 3-Tier Pricing Grid */}
          <div className="mt-12 grid gap-8 lg:grid-cols-3">
            {/* Tier 1: Starter */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Starter</h3>
                <p className="mt-1 text-sm text-slate-500">For individual teachers & small trial batches</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">₹0</span>
                  <span className="text-sm text-slate-500">/ forever</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckIcon /> Up to 100 OMR scans / month</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Bilingual A4 OMR PDF generator</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Excel/CSV attendance upload</li>
                </ul>
              </div>
              <Link
                href="/signup"
                className="mt-8 block w-full rounded-xl border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Start Free Today
              </Link>
            </div>

            {/* Tier 2: Institute */}
            <div className="relative flex flex-col justify-between rounded-2xl border-2 border-indigo-600 bg-white p-8 shadow-xl">
              <div className="absolute -top-3.5 left-6 right-6 flex items-center justify-between">
                <span className="rounded-full bg-amber-400 px-3 py-0.5 text-[11px] font-extrabold uppercase tracking-wide text-slate-950 shadow-xs">
                  ★ Founder&apos;s Launch Offer
                </span>
                <span className="rounded-full bg-indigo-600 px-3 py-0.5 text-[11px] font-bold text-white">
                  14 Slots Left
                </span>
              </div>

              <div>
                <h3 className="mt-2 text-lg font-bold text-slate-900">Institute</h3>
                <p className="mt-1 text-sm text-slate-500">For coaching centers & schools</p>

                <div className="mt-5 flex items-baseline gap-2.5">
                  <span className="text-lg font-semibold text-slate-400 line-through">
                    {billingAnnual ? "₹2,499" : "₹2,999"}
                  </span>
                  <span className="text-4xl font-extrabold text-slate-900">
                    {billingAnnual ? "₹1,299" : "₹1,599"}
                  </span>
                  <span className="text-sm text-slate-500">/ month</span>
                </div>
                <p className="mt-1 text-xs font-medium text-emerald-700">
                  Locked-in early-adopter rate • No price hikes
                </p>

                <ul className="mt-6 space-y-3 text-sm font-medium text-slate-700">
                  <li className="flex items-center gap-2"><CheckIcon /> Unlimited OMR scans & batch PDF downloads</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Multi-set exams (Sets A, B, C, D) & negative marking</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Both Offline OMR & Online computer exam modes</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Offline backup & OMR serial number tracking</li>
                </ul>
              </div>

              <Link
                href="/signup?plan=institute-founder"
                className="mt-8 block w-full rounded-xl bg-indigo-600 py-3 text-center text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
              >
                Claim Founder&apos;s Offer (14-Day Free Trial)
              </Link>
            </div>

            {/* Tier 3: Campus / Board */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-8">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Campus & Board</h3>
                <p className="mt-1 text-sm text-slate-500">For universities & multi-branch institutes</p>
                <div className="mt-5 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-slate-900">Custom</span>
                </div>
                <ul className="mt-6 space-y-3 text-sm text-slate-600">
                  <li className="flex items-center gap-2"><CheckIcon /> Separate logins for multiple exam coordinators</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Large OMR sheets (up to 200 questions)</li>
                  <li className="flex items-center gap-2"><CheckIcon /> Dedicated setup & priority support</li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => setQuoteModalOpen(true)}
                className="mt-8 block w-full rounded-xl border border-slate-300 py-2.5 text-center text-sm font-semibold text-slate-800 hover:bg-slate-50 transition"
              >
                Contact LYSS Sales
              </button>
            </div>
          </div>

          {/* Single-Day Mega Exam Callout Strip */}
          <div className="mt-10 flex flex-col items-start justify-between gap-6 rounded-2xl border border-indigo-200 bg-indigo-50/70 p-6 sm:flex-row sm:items-center sm:p-8">
            <div>
              <span className="inline-block rounded bg-indigo-600 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-white">
                Pay-Per-Event Option
              </span>
              <h3 className="mt-2 text-xl font-bold text-slate-900">
                Conducting a Single-Day Scholarship Test or Entrance Exam?
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                No monthly subscription needed. Calculate your instant per-student cost for 500 to
                25,000+ candidates in seconds.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setQuoteModalOpen(true)}
              className="shrink-0 rounded-xl bg-slate-900 px-6 py-3 text-sm font-bold text-white shadow-sm hover:bg-slate-800 transition"
            >
              Calculate Event Quote →
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="mx-auto mt-20 max-w-3xl">
            <h3 className="text-center text-2xl font-extrabold text-slate-900">
              Frequently Asked Questions
            </h3>
            <div className="mt-8 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50/50">
              {FAQS.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={faq.q} className="p-5">
                    <button
                      type="button"
                      onClick={() => setOpenFaq(isOpen ? null : idx)}
                      className="flex w-full items-center justify-between text-left text-base font-semibold text-slate-900"
                    >
                      <span>{faq.q}</span>
                      <span className="ml-4 text-xl font-bold text-indigo-600">
                        {isOpen ? "−" : "+"}
                      </span>
                    </button>
                    {isOpen && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-600">{faq.a}</p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 9. FINAL CONVERSION CTA & FOOTER */}
      <section className="bg-slate-900 py-16 sm:py-20 text-white">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6 lg:px-8">
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Ready to Make Your Next Exam Day Easier?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-base text-slate-300">
            Print your first batch of numbered A4 OMR sheets or start an online test in under 5
            minutes.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3.5 sm:flex-row">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center rounded-xl bg-indigo-500 px-8 py-4 text-base font-bold text-white shadow-lg hover:bg-indigo-400 transition"
            >
              Get Started Free — No Credit Card Required
            </Link>
          </div>
        </div>
      </section>

      <footer className="border-t border-slate-800 bg-slate-950 py-10 text-sm text-slate-400">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
          <div>
            <span className="font-bold text-white">Examvia</span> — Easy Offline OMR & Online
            Exam Platform
          </div>
          <div>
            A Product by{" "}
            <span className="font-semibold text-slate-200">LYSS Technology Pvt. Ltd.</span>
          </div>
        </div>
      </footer>

      {/* INTERACTIVE QUICK-QUOTE MODAL FOR SINGLE-DAY LARGE EXAMS */}
      {quoteModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-labelledby="quote-modal-title"
        >
          <div className="relative w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={resetQuoteModal}
              aria-label="Close modal"
              className="absolute top-4 right-4 rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
            >
              ✕
            </button>

            {!quoteSubmitted ? (
              <>
                <span className="inline-block rounded bg-indigo-50 px-2.5 py-0.5 text-xs font-bold text-indigo-700">
                  Instant Event Calculator
                </span>
                <h3 id="quote-modal-title" className="mt-2 text-2xl font-extrabold text-slate-900">
                  Single-Day Large Exam Quote
                </h3>
                <p className="mt-1 text-sm text-slate-600">
                  Check your one-time event price and request a quick callback from the LYSS
                  Technology team.
                </p>

                <form onSubmit={handleQuoteSubmit} className="mt-6 space-y-5">
                  {/* Exam Mode Selector */}
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
                      1. Choose Exam Type
                    </label>
                    <div className="mt-2 grid grid-cols-3 gap-2">
                      {[
                        { id: "omr", label: "Offline OMR", sub: "₹1.5–₹3 / student" },
                        { id: "online", label: "Online Test", sub: "₹3.5–₹5 / student" },
                        { id: "hybrid", label: "Both Modes", sub: "₹4.5–₹6 / student" },
                      ].map((opt) => (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => setExamMode(opt.id as "omr" | "online" | "hybrid")}
                          className={`rounded-xl border p-2.5 text-left transition ${
                            examMode === opt.id
                              ? "border-indigo-600 bg-indigo-50/70 ring-1 ring-indigo-600"
                              : "border-slate-200 hover:border-slate-300"
                          }`}
                        >
                          <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                          <div className="mt-0.5 text-[10px] text-slate-500">{opt.sub}</div>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Candidate Slider */}
                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="candidate-range"
                        className="text-xs font-bold uppercase tracking-wider text-slate-700"
                      >
                        2. Number of Students
                      </label>
                      <span className="rounded bg-slate-100 px-2.5 py-0.5 font-mono text-sm font-bold text-indigo-600">
                        {candidateCount.toLocaleString("en-IN")} students
                      </span>
                    </div>
                    <input
                      id="candidate-range"
                      type="range"
                      min={500}
                      max={25000}
                      step={500}
                      value={candidateCount}
                      onChange={(e) => setCandidateCount(Number(e.target.value))}
                      className="mt-2.5 h-2 w-full cursor-pointer appearance-none rounded-lg bg-slate-200 accent-indigo-600"
                    />
                    <div className="mt-1 flex justify-between text-[11px] text-slate-400">
                      <span>500</span>
                      <span>10,000</span>
                      <span>25,000+</span>
                    </div>
                  </div>

                  {/* Live Cost Summary Box */}
                  <div className="flex items-center justify-between rounded-xl border border-emerald-200 bg-emerald-50/70 p-4">
                    <div>
                      <p className="text-xs font-semibold text-emerald-900">
                        Estimated One-Time Event Total
                      </p>
                      <p className="text-[11px] text-emerald-700">
                        Includes numbered A4 OMR PDFs, multi-set keys & student results
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="text-2xl font-extrabold text-emerald-900">
                        ₹{estimatedTotal.toLocaleString("en-IN")}
                      </span>
                      <p className="text-[10px] text-emerald-700">
                        (₹{getRatePerCandidate(candidateCount, examMode)} / student)
                      </p>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        Coaching / School Name *
                      </label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Mithila Talent Search"
                        value={instituteName}
                        onChange={(e) => setInstituteName(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-700">
                        WhatsApp / Phone Number *
                      </label>
                      <input
                        type="tel"
                        required
                        placeholder="+91 98XXX XXXXX"
                        value={contactPhone}
                        onChange={(e) => setContactPhone(e.target.value)}
                        className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700">
                      Expected Exam Date (Optional)
                    </label>
                    <input
                      type="date"
                      value={examDate}
                      onChange={(e) => setExamDate(e.target.value)}
                      className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-indigo-600 focus:outline-none"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full rounded-xl bg-indigo-600 py-3 text-sm font-bold text-white shadow-md hover:bg-indigo-700 transition"
                  >
                    Lock In Quote & Request Callback
                  </button>
                </form>
              </>
            ) : (
              <div className="py-6 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-2xl text-emerald-600">
                  ✓
                </div>
                <h3 className="mt-4 text-2xl font-extrabold text-slate-900">
                  Quote Saved for {instituteName}!
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  Your estimated event package of{" "}
                  <span className="font-bold text-slate-900">
                    ₹{estimatedTotal.toLocaleString("en-IN")}
                  </span>{" "}
                  for <span className="font-bold">{candidateCount.toLocaleString("en-IN")}</span>{" "}
                  students has been recorded. Our team at LYSS Technology will call or message you
                  on <span className="font-semibold text-slate-900">{contactPhone}</span> shortly.
                </p>
                <button
                  type="button"
                  onClick={resetQuoteModal}
                  className="mt-6 rounded-xl bg-slate-900 px-6 py-2.5 text-sm font-semibold text-white hover:bg-slate-800 transition"
                >
                  Back to Examvia
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function CheckIcon() {
  return (
    <svg
      className="h-4 w-4 shrink-0 text-emerald-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}