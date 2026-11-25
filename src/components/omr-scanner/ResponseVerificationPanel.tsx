// components/omr-scanner/ResponseVerificationPanel.tsx
'use client';

import React from 'react';
import {
  OPTIONS,
  type BookletDetectionResult,
  type BookletSetCode,
  type OptionLetter,
  type QuestionResponseResult,
  type QuestionStatus,
} from './types';

interface ResponseVerificationPanelProps {
  warpedCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  warpedOverlayRef: React.RefObject<HTMLCanvasElement | null>;
  activeBookletSet: BookletSetCode;
  bookletResult: BookletDetectionResult | null;
  totalQuestions: number;
  questionResponses: QuestionResponseResult[];
  keySourceLabel: string;
  keyEntriesCount: number;
  showBubbleOverlay: boolean;
  isResultRevealed: boolean;
  isDraggingBookletRoi: boolean;
  onSelectBookletOverride: (opt: OptionLetter) => void;
  onNudgeGridY: (delta: number) => void;
  onToggleBubbleOverlay: () => void;
  onBookletRoiPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onBookletRoiPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onBookletRoiPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onManualResponseChange: (qNum: number, nextOpt: QuestionStatus) => void;
}

export default function ResponseVerificationPanel({
  warpedCanvasRef,
  warpedOverlayRef,
  activeBookletSet,
  bookletResult,
  totalQuestions,
  questionResponses,
  keySourceLabel,
  keyEntriesCount,
  showBubbleOverlay,
  isResultRevealed,
  isDraggingBookletRoi,
  onSelectBookletOverride,
  onNudgeGridY,
  onToggleBubbleOverlay,
  onBookletRoiPointerDown,
  onBookletRoiPointerMove,
  onBookletRoiPointerUp,
  onManualResponseChange,
}: ResponseVerificationPanelProps) {
  const attemptedCount = questionResponses.filter((r) =>
    OPTIONS.includes(r.selectedOption as OptionLetter)
  ).length;
  const blankCount = questionResponses.filter((r) => r.selectedOption === 'BLANK').length;
  const multipleCount = questionResponses.filter((r) => r.selectedOption === 'MULTIPLE').length;

  return (
    <>
      <div style={styles.bookletCard}>
        <div style={styles.bookletHeader}>
          <div>
            <span style={styles.bookletTitle}>Booklet Series / पुस्तिका सेट:</span>
            <span
              style={{
                ...styles.bookletBadge,
                backgroundColor:
                  activeBookletSet === 'BLANK' || activeBookletSet === 'MULTIPLE'
                    ? '#fef3c7'
                    : '#dcfce7',
                color:
                  activeBookletSet === 'BLANK' || activeBookletSet === 'MULTIPLE'
                    ? '#92400e'
                    : '#166534',
                borderColor:
                  activeBookletSet === 'BLANK' || activeBookletSet === 'MULTIPLE'
                    ? '#f59e0b'
                    : '#10b981',
              }}
            >
              SET {activeBookletSet}
            </span>
          </div>

          <div style={styles.setSelectorGroup}>
            {OPTIONS.map((opt) => {
              const isSelected = activeBookletSet === opt;
              const fillPct = bookletResult ? Math.round(bookletResult.fillRatios[opt] * 100) : 0;
              return (
                <button
                  key={opt}
                  type="button"
                  onClick={() => onSelectBookletOverride(opt)}
                  style={{
                    ...styles.setPill,
                    backgroundColor: isSelected ? '#0f172a' : '#ffffff',
                    color: isSelected ? '#ffffff' : '#0f172a',
                    borderColor: isSelected ? '#0f172a' : '#cbd5e1',
                  }}
                >
                  {opt} <span style={{ fontSize: '10px', opacity: 0.8 }}>({fillPct}%)</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div style={styles.summaryGrid}>
        <div style={styles.summaryCard}>
          <span style={styles.summaryValue}>{attemptedCount}</span>
          <span style={styles.summaryLabel}>Attempted</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryValue, color: '#64748b' }}>{blankCount}</span>
          <span style={styles.summaryLabel}>Unattempted</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryValue, color: '#d97706' }}>{multipleCount}</span>
          <span style={styles.summaryLabel}>Multiple Marked</span>
        </div>
        <div style={styles.summaryCard}>
          <span style={{ ...styles.summaryValue, color: '#4f46e5' }}>{keyEntriesCount}</span>
          <span style={styles.summaryLabel}>{keySourceLabel}</span>
        </div>
      </div>

      <div style={styles.splitWorkspace}>
        <div style={styles.warpedBox}>
          <div style={styles.warpedHeaderRow}>
            <p style={styles.warpedLabel}>Detected Bubble Overlay</p>
            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                onClick={() => onNudgeGridY(-0.004)}
                style={styles.toggleOverlayBtn}
                title="Nudge Bubble Grid Up"
              >
                ↑ Grid
              </button>
              <button
                type="button"
                onClick={() => onNudgeGridY(0.004)}
                style={styles.toggleOverlayBtn}
                title="Nudge Bubble Grid Down"
              >
                ↓ Grid
              </button>
              <button type="button" onClick={onToggleBubbleOverlay} style={styles.toggleOverlayBtn}>
                {showBubbleOverlay ? 'Hide Rings' : 'Show Rings'}
              </button>
            </div>
          </div>
          <div style={styles.warpedCanvasWrapper}>
            <canvas ref={warpedCanvasRef} style={styles.warpedCanvas} />
            <canvas
              ref={warpedOverlayRef}
              onPointerDown={onBookletRoiPointerDown}
              onPointerMove={onBookletRoiPointerMove}
              onPointerUp={onBookletRoiPointerUp}
              onPointerCancel={onBookletRoiPointerUp}
              style={{
                ...styles.warpedOverlayCanvas,
                cursor: isDraggingBookletRoi ? 'grabbing' : 'move',
              }}
            />
          </div>
        </div>

        <div style={styles.responsesPanel}>
          <div style={styles.warpedHeaderRow}>
            <p style={styles.warpedLabel}>Student Responses ({totalQuestions} Qs — Click to Edit)</p>
          </div>
          <div style={styles.responsesScrollArea}>
            {questionResponses.map((item) => {
              const rowBg = !isResultRevealed
                ? item.selectedOption === 'MULTIPLE'
                  ? '#fffbeb'
                  : '#ffffff'
                : item.isCorrect === true
                ? '#f0fdf4'
                : item.isCorrect === false
                ? '#fef2f2'
                : item.selectedOption === 'MULTIPLE'
                ? '#fffbeb'
                : '#ffffff';

              return (
                <div key={item.questionNumber} style={{ ...styles.responseRow, backgroundColor: rowBg }}>
                  <span style={styles.qNumBadge}>Q{String(item.questionNumber).padStart(2, '0')}</span>

                  <div style={styles.optionBtnGroup}>
                    {OPTIONS.map((opt) => {
                      const isSelected = item.selectedOption === opt;
                      const isMultiple =
                        item.selectedOption === 'MULTIPLE' && item.fillRatios[opt] >= 0.36;
                      const pct = Math.round(item.fillRatios[opt] * 100);

                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            onManualResponseChange(item.questionNumber, isSelected ? 'BLANK' : opt)
                          }
                          title={`Fill density: ${pct}%`}
                          style={{
                            ...styles.optCircleBtn,
                            backgroundColor: isSelected
                              ? isResultRevealed && item.isCorrect === false
                                ? '#dc2626'
                                : '#0f172a'
                              : isMultiple
                              ? '#f59e0b'
                              : '#f8fafc',
                            color: isSelected || isMultiple ? '#ffffff' : '#334155',
                            borderColor:
                              isResultRevealed &&
                              item.correctOption === opt &&
                              item.isCorrect === false
                                ? '#16a34a'
                                : isSelected
                                ? '#0f172a'
                                : '#cbd5e1',
                          }}
                        >
                          {opt}
                        </button>
                      );
                    })}
                  </div>

                  <span style={styles.statusTag}>
                    {item.selectedOption === 'BLANK'
                      ? isResultRevealed && item.correctOption
                        ? `— (${item.correctOption})`
                        : '—'
                      : item.selectedOption === 'MULTIPLE'
                      ? 'MULTI'
                      : !isResultRevealed
                      ? item.selectedOption
                      : item.isCorrect === true
                      ? `${item.selectedOption} ✓`
                      : item.isCorrect === false
                      ? `${item.selectedOption} ✗ (${item.correctOption})`
                      : item.selectedOption}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  bookletCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #cbd5e1',
    borderRadius: '10px',
    padding: '12px 16px',
    marginBottom: '14px',
    textAlign: 'left',
  },
  bookletHeader: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '12px',
  },
  bookletTitle: {
    fontSize: '14px',
    fontWeight: 700,
    color: '#0f172a',
    marginRight: '10px',
  },
  bookletBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    fontSize: '13px',
    fontWeight: 800,
    border: '1.5px solid',
  },
  setSelectorGroup: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '6px',
    alignItems: 'center',
  },
  setPill: {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid',
    fontSize: '13px',
    fontWeight: 700,
    cursor: 'pointer',
  },
  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))',
    gap: '10px',
    marginBottom: '18px',
  },
  summaryCard: {
    backgroundColor: '#f8fafc',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '10px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: '20px',
    fontWeight: 800,
    color: '#0f172a',
  },
  summaryLabel: {
    fontSize: '11px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    marginTop: '2px',
  },
  splitWorkspace: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '20px',
    alignItems: 'start',
  },
  warpedBox: {
    width: '100%',
  },
  warpedHeaderRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  warpedLabel: {
    fontSize: '13px',
    fontWeight: 700,
    color: '#0f172a',
    margin: 0,
    textAlign: 'left',
  },
  toggleOverlayBtn: {
    padding: '4px 10px',
    fontSize: '12px',
    fontWeight: 600,
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    backgroundColor: '#f8fafc',
    cursor: 'pointer',
  },
  warpedCanvasWrapper: {
    position: 'relative',
    width: '100%',
    aspectRatio: '1000 / 1274',
    border: '1px solid #94a3b8',
    borderRadius: '8px',
    overflow: 'hidden',
    userSelect: 'none',
  },
  warpedCanvas: {
    width: '100%',
    height: '100%',
    display: 'block',
  },
  warpedOverlayCanvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    touchAction: 'none',
  },
  responsesPanel: {
    width: '100%',
  },
  responsesScrollArea: {
    marginTop: '8px',
    maxHeight: '540px',
    overflowY: 'auto',
    border: '1px solid #cbd5e1',
    borderRadius: '8px',
    backgroundColor: '#ffffff',
  },
  responseRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '6px 12px',
    borderBottom: '1px solid #f1f5f9',
  },
  qNumBadge: {
    fontSize: '12px',
    fontWeight: 700,
    color: '#334155',
    width: '40px',
    textAlign: 'left',
  },
  optionBtnGroup: {
    display: 'flex',
    gap: '8px',
  },
  optCircleBtn: {
    width: '28px',
    height: '28px',
    borderRadius: '9999px',
    border: '1.5px solid',
    fontSize: '12px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusTag: {
    fontSize: '11px',
    fontWeight: 700,
    color: '#475569',
    width: '62px',
    textAlign: 'right',
  },
};