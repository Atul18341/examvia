// components/omr-scanner/ResultMappingSection.tsx
'use client';

import React from 'react';
import type { CalculatedOMRResult, PresentStudentOption } from './types';

interface ResultMappingSectionProps {
  bottomResultRef: React.RefObject<HTMLDivElement | null>;
  calculatedResult: CalculatedOMRResult | null;
  presentStudents: PresentStudentOption[];
  unmappedPresentCount: number;
  selectedStudent: PresentStudentOption | null;
  selectedStudentId: string;
  allowRemapExisting: boolean;
  omrSerialNo: string;
  isMappingResult: boolean;
  mapNotice: { type: 'success' | 'error'; message: string } | null;
  onCalculateResult: () => void;
  onChangeAllowRemap: (checked: boolean) => void;
  onSelectStudentId: (id: string) => void;
  onChangeOmrSerialNo: (val: string) => void;
  onMapResultToStudent: () => void;
  onNextScan: () => void;
}

export default function ResultMappingSection({
  bottomResultRef,
  calculatedResult,
  presentStudents,
  unmappedPresentCount,
  selectedStudent,
  selectedStudentId,
  allowRemapExisting,
  omrSerialNo,
  isMappingResult,
  mapNotice,
  onCalculateResult,
  onChangeAllowRemap,
  onSelectStudentId,
  onChangeOmrSerialNo,
  onMapResultToStudent,
  onNextScan,
}: ResultMappingSectionProps) {
  const isMapDisabled =
    !selectedStudent ||
    isMappingResult ||
    (Boolean(selectedStudent.omrScanned) && !allowRemapExisting);

  return (
    <div ref={bottomResultRef} style={styles.bottomResultSection}>
      <div style={styles.bottomActionBar}>
        <button type="button" onClick={onCalculateResult} style={styles.calculateBtn}>
          🧮 Calculate Result
        </button>
      </div>

      {calculatedResult && (
        <>
          <div
            style={{
              ...styles.scorecardBanner,
              borderColor: calculatedResult.passed ? '#10b981' : '#ef4444',
              backgroundColor: calculatedResult.passed ? '#f0fdf4' : '#fef2f2',
            }}
          >
            <div style={styles.scorecardTop}>
              <div>
                <span style={styles.scorecardEyebrow}>
                  FINAL CALCULATED RESULT
                  {selectedStudent ? ` • ROLL ${selectedStudent.rollNo} (${selectedStudent.name})` : ''}
                </span>
                <h3 style={styles.scorecardMarks}>
                  {calculatedResult.totalScore}{' '}
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>
                    / {calculatedResult.maxMarks} Marks
                  </span>
                </h3>
              </div>

              <div style={{ textAlign: 'right' }}>
                <span
                  style={{
                    ...styles.passFailPill,
                    backgroundColor: calculatedResult.passed ? '#16a34a' : '#dc2626',
                  }}
                >
                  {calculatedResult.passed ? 'PASSED' : 'FAILED'} ({calculatedResult.percentage}%)
                </span>
                <p style={{ fontSize: '11px', color: '#475569', marginTop: '4px', marginBottom: 0 }}>
                  Booklet Set: <strong>{calculatedResult.bookletSet}</strong> • Cutoff:{' '}
                  {calculatedResult.passingMarks}
                </p>
              </div>
            </div>

            <div style={styles.scorecardMetricsRow}>
              <div style={styles.scoreMetricItem}>
                <span style={{ color: '#16a34a', fontWeight: 800, fontSize: '16px' }}>
                  {calculatedResult.correct}
                </span>
                <span style={styles.scoreMetricLbl}>
                  Correct (+{(calculatedResult.correct * calculatedResult.marksPerCorrect).toFixed(2)})
                </span>
              </div>
              <div style={styles.scoreMetricItem}>
                <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '16px' }}>
                  {calculatedResult.wrong}
                </span>
                <span style={styles.scoreMetricLbl}>
                  Wrong (-{(calculatedResult.wrong * calculatedResult.negativeMarks).toFixed(2)})
                </span>
              </div>
              <div style={styles.scoreMetricItem}>
                <span style={{ color: '#64748b', fontWeight: 800, fontSize: '16px' }}>
                  {calculatedResult.blank}
                </span>
                <span style={styles.scoreMetricLbl}>Unattempted</span>
              </div>
              <div style={styles.scoreMetricItem}>
                <span style={{ color: '#d97706', fontWeight: 800, fontSize: '16px' }}>
                  {calculatedResult.multiple}
                </span>
                <span style={styles.scoreMetricLbl}>Multiple</span>
              </div>
            </div>
          </div>

          <div style={styles.studentMapBox}>
            <div style={styles.studentMapTopMeta}>
              <span style={styles.studentMapHeaderNote}>
                Unmapped Present Students: <strong>{unmappedPresentCount}</strong> /{' '}
                {presentStudents.length}
              </span>
              <label style={styles.remapToggleLabel}>
                <input
                  type="checkbox"
                  checked={allowRemapExisting}
                  onChange={(e) => onChangeAllowRemap(e.target.checked)}
                />
                <span>Allow Re-map</span>
              </label>
            </div>

            <div style={styles.studentMapRow}>
              <div style={styles.studentSelectGroup}>
                <label htmlFor="present-student-select" style={styles.studentMapLabel}>
                  Present Student:
                </label>
                <select
                  id="present-student-select"
                  value={selectedStudentId}
                  onChange={(e) => onSelectStudentId(e.target.value)}
                  style={styles.studentSelect}
                >
                  <option value="">-- Select Present Student --</option>
                  {presentStudents.map((st) => {
                    const isMapped = Boolean(st.omrScanned);
                    const isOptionDisabled = isMapped && !allowRemapExisting;
                    return (
                      <option
                        key={st.id}
                        value={st.id}
                        disabled={isOptionDisabled}
                        style={{
                          color: isOptionDisabled ? '#94a3b8' : '#0f172a',
                          backgroundColor: isOptionDisabled ? '#f1f5f9' : '#ffffff',
                        }}
                      >
                        Roll {st.rollNo} — {st.name}
                        {isMapped ? ` [Mapped • ${st.marksScored ?? 0}/${st.maxMarks ?? 0}]` : ''}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div style={styles.serialFieldGroup}>
                <label htmlFor="omr-serial-input" style={styles.studentMapLabel}>
                  OMR Serial No:
                </label>
                <input
                  id="omr-serial-input"
                  type="text"
                  value={omrSerialNo}
                  onChange={(e) => onChangeOmrSerialNo(e.target.value)}
                  placeholder="e.g. OMR-001"
                  style={styles.serialInputField}
                />
              </div>
            </div>

            <div style={styles.bottomActionBar}>
              <button
                type="button"
                onClick={onMapResultToStudent}
                disabled={isMapDisabled}
                style={{
                  ...styles.mapResultBtn,
                  opacity: isMapDisabled ? 0.55 : 1,
                  cursor: isMapDisabled ? 'not-allowed' : 'pointer',
                }}
              >
                {isMappingResult
                  ? 'Mapping...'
                  : selectedStudent
                  ? `✓ Map Result to Roll ${selectedStudent.rollNo}`
                  : '✓ Map Result to Student'}
              </button>

              <button type="button" onClick={onNextScan} style={styles.nextScanBtn}>
                ➡️ Next Scan
              </button>
            </div>

            {mapNotice && (
              <p
                style={{
                  ...styles.mapNoticeText,
                  backgroundColor: mapNotice.type === 'success' ? '#dcfce7' : '#fee2e2',
                  color: mapNotice.type === 'success' ? '#166534' : '#991b1b',
                  borderColor: mapNotice.type === 'success' ? '#86efac' : '#fca5a5',
                }}
              >
                {mapNotice.message}
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bottomResultSection: {
    marginTop: '24px',
    paddingTop: '20px',
    borderTop: '1px solid #e2e8f0',
  },
  bottomActionBar: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '12px',
  },
  calculateBtn: {
    backgroundColor: '#059669',
    color: '#ffffff',
    padding: '13px 24px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(5, 150, 105, 0.3)',
  },
  mapResultBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '13px 24px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 800,
    fontSize: '14px',
    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.28)',
  },
  nextScanBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '13px 24px',
    borderRadius: '10px',
    border: 'none',
    fontWeight: 800,
    fontSize: '14px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(15, 23, 42, 0.22)',
  },
  scorecardBanner: {
    border: '2px solid',
    borderRadius: '12px',
    padding: '16px 20px',
    textAlign: 'left',
  },
  scorecardTop: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
    paddingBottom: '12px',
    borderBottom: '1px solid rgba(15, 23, 42, 0.1)',
  },
  scorecardEyebrow: {
    fontSize: '10px',
    fontWeight: 800,
    letterSpacing: '0.08em',
    color: '#475569',
    display: 'block',
  },
  scorecardMarks: {
    fontSize: '26px',
    fontWeight: 900,
    color: '#0f172a',
    margin: '2px 0 0 0',
  },
  passFailPill: {
    display: 'inline-block',
    color: '#ffffff',
    padding: '5px 14px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 800,
    letterSpacing: '0.04em',
  },
  scorecardMetricsRow: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(110px, 1fr))',
    gap: '10px',
    paddingTop: '12px',
  },
  scoreMetricItem: {
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: '8px',
    padding: '8px 10px',
    display: 'flex',
    flexDirection: 'column',
  },
  scoreMetricLbl: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#475569',
    marginTop: '2px',
  },
  studentMapBox: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '12px',
    padding: '16px',
    marginTop: '16px',
    textAlign: 'left',
  },
  studentMapTopMeta: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '12px',
    paddingBottom: '8px',
    borderBottom: '1px solid #e2e8f0',
  },
  studentMapHeaderNote: {
    fontSize: '12px',
    color: '#334155',
  },
  remapToggleLabel: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#475569',
    cursor: 'pointer',
  },
  studentMapRow: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: '14px',
  },
  studentSelectGroup: {
    flex: '1 1 320px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  serialFieldGroup: {
    flex: '0 1 180px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  },
  studentMapLabel: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#1e293b',
  },
  studentSelect: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #94a3b8',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  serialInputField: {
    width: '100%',
    padding: '10px 12px',
    borderRadius: '8px',
    border: '1px solid #94a3b8',
    backgroundColor: '#ffffff',
    color: '#0f172a',
    fontSize: '13px',
    fontFamily: 'monospace',
    fontWeight: 700,
    boxSizing: 'border-box',
  },
  mapNoticeText: {
    marginTop: '12px',
    marginBottom: 0,
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid',
    fontSize: '12px',
    fontWeight: 700,
  },
};