// app/omr-scanner/page.tsx
'use client';

import React from 'react';
import OMRScanner from '@/components/OMRScanner';
import { useParams, useRouter } from 'next/navigation';
export default function OMRScannerPage() {
  const params = useParams();
    const examId = (params?.id as string) || '';
    const router = useRouter();
  return (
    <main style={pageStyles.main}>
      <OMRScanner examId={examId}/>
    </main>
  );
}

const pageStyles: Record<string, React.CSSProperties> = {
  main: {
    minHeight: '100vh',
    backgroundColor: '#f8fafc',
    paddingTop: '16px',
    paddingBottom: '40px'
  }
};