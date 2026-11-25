// app/omr-simulator/[id]/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'next/navigation';
import { db, LocalExam } from '@/lib/db';
import OMRSimulator from '@/components/OMRSimulator';

export default function OMRSimulatorRoutePage() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();

  const examId = params?.id || 'EXAM-3530';
  const serialNumber = searchParams.get('serialNumber') || `${examId}-0001`;

  const [exam, setExam] = useState<LocalExam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function loadExam() {
      setLoading(true);
      try {
        const record = await db.exams.get(examId);
        if (active) {
          setExam(record ?? null);
        }
      } catch (error) {
        console.error('Failed to load exam from IndexedDB:', error);
        if (active) {
          setExam(null);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    loadExam();

    return () => {
      active = false;
    };
  }, [examId]);

  if (loading) {
    return (
      <main style={routeStyles.centered}>
        <p style={routeStyles.statusText}>Loading exam blueprint from local database...</p>
      </main>
    );
  }

  if (!exam) {
    return (
      <main style={routeStyles.centered}>
        <h1 style={routeStyles.title}>Exam Not Found</h1>
        <p style={routeStyles.muted}>
          No local exam record found for ID: <strong>{examId}</strong>
        </p>
      </main>
    );
  }

  return <OMRSimulator exam={exam} examId={examId} serialNumber={serialNumber} />;
}

const routeStyles: Record<string, React.CSSProperties> = {
  centered: {
    minHeight: '60vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    textAlign: 'center'
  },
  statusText: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#475569'
  },
  title: {
    fontSize: '20px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '6px'
  },
  muted: {
    fontSize: '14px',
    color: '#64748b'
  }
};