// app/omr-scanner/page.tsx
'use client';

import React from 'react';
import OMRScanner from '@/components/OMRScanner';

export default function OMRScannerPage() {
  return (
    <main style={pageStyles.main}>
      <OMRScanner />
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