// components/omr-scanner/ScannerConfigBar.tsx
'use client';

import React from 'react';

interface ScannerConfigBarProps {
  examTitle?: string;
  totalQuestions: number;
  marksPerCorrect: number;
  negativeMarks: number;
  passingMarks: number;
  keySourceLabel: string;
  keyEntriesCount: number;
}

export default function ScannerConfigBar({
  examTitle,
  totalQuestions,
  marksPerCorrect,
  negativeMarks,
  passingMarks,
  keySourceLabel,
  keyEntriesCount,
}: ScannerConfigBarProps) {
  return (
    <div style={styles.configBar}>
      {examTitle && (
        <div style={styles.configBadge}>
          <span style={styles.configLabel}>Exam:</span>
          <strong style={styles.configValue}>{examTitle}</strong>
        </div>
      )}

      <div style={styles.configBadge}>
        <span style={styles.configLabel}>Questions:</span>
        <strong style={styles.configValue}>{totalQuestions}</strong>
      </div>

      <div style={styles.configBadge}>
        <span style={styles.configLabel}>+Marks:</span>
        <strong style={styles.configValue}>{marksPerCorrect}</strong>
      </div>

      <div style={styles.configBadge}>
        <span style={styles.configLabel}>-Negative:</span>
        <strong style={styles.configValue}>{negativeMarks}</strong>
      </div>

      <div style={styles.configBadge}>
        <span style={styles.configLabel}>Pass Marks:</span>
        <strong style={styles.configValue}>{passingMarks}</strong>
      </div>

      <div style={styles.keyStatusPill}>
        🔑 {keySourceLabel} ({keyEntriesCount}/{totalQuestions})
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  configBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    backgroundColor: '#f8fafc',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginBottom: '14px',
  },
  configBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    backgroundColor: '#ffffff',
    padding: '5px 10px',
    borderRadius: '6px',
    border: '1px solid #e2e8f0',
  },
  configLabel: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
  },
  configValue: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0f172a',
  },
  keyStatusPill: {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 12px',
    borderRadius: '9999px',
    border: '1px solid #c7d2fe',
    backgroundColor: '#eef2ff',
    color: '#3730a3',
    fontSize: '12px',
    fontWeight: 700,
  },
};