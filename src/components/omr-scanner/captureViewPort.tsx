// components/omr-scanner/CaptureViewport.tsx
'use client';

import React from 'react';
import type { CornerKey, DetectedCorners } from './types';

interface CaptureViewportProps {
  videoRef: React.RefObject<HTMLVideoElement | null>;
  captureCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  overlayCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  capturedImage: string | null;
  uploadedFileName: string | null;
  isDraggingFile: boolean;
  streamActive: boolean;
  cameraError: string | null;
  isProcessing: boolean;
  detectedCorners: DetectedCorners | null;
  activeDragCorner: CornerKey | null;
  onDragOverChange: (dragging: boolean) => void;
  onDropFile: (file: File) => void;
  onFileSelected: (file: File) => void;
  onPointerDown: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerMove: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onPointerUp: (e: React.PointerEvent<HTMLCanvasElement>) => void;
  onCapturePhoto: () => void;
  onSwitchCamera: () => void;
  onRetake: () => void;
  onReDetectAuto: () => void;
  onSetManualCorners: () => void;
}

export default function CaptureViewport({
  videoRef,
  captureCanvasRef,
  overlayCanvasRef,
  fileInputRef,
  capturedImage,
  uploadedFileName,
  isDraggingFile,
  streamActive,
  cameraError,
  isProcessing,
  detectedCorners,
  activeDragCorner,
  onDragOverChange,
  onDropFile,
  onFileSelected,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onCapturePhoto,
  onSwitchCamera,
  onRetake,
  onReDetectAuto,
  onSetManualCorners,
}: CaptureViewportProps) {
  return (
    <>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          onDragOverChange(true);
        }}
        onDragLeave={() => onDragOverChange(false)}
        onDrop={(e) => {
          e.preventDefault();
          onDragOverChange(false);
          const file = e.dataTransfer.files?.[0];
          if (file) onDropFile(file);
        }}
        style={{
          ...styles.viewport,
          outline: isDraggingFile ? '3px dashed #38bdf8' : 'none',
        }}
      >
        {!capturedImage ? (
          <>
            <video ref={videoRef} playsInline muted style={styles.mediaElement} />
            <div style={styles.guideOverlay}>
              <div style={{ ...styles.guideBracket, top: 16, left: 16, borderRight: 'none', borderBottom: 'none' }} />
              <div style={{ ...styles.guideBracket, top: 16, right: 16, borderLeft: 'none', borderBottom: 'none' }} />
              <div style={{ ...styles.guideBracket, bottom: 16, left: 16, borderRight: 'none', borderTop: 'none' }} />
              <div style={{ ...styles.guideBracket, bottom: 16, right: 16, borderLeft: 'none', borderTop: 'none' }} />
            </div>
            {!streamActive && (
              <div style={styles.fallbackDropHint}>
                <p style={{ fontWeight: 700, marginBottom: '6px' }}>Drop OMR Sheet Image Here</p>
                <p style={{ fontSize: '12px', opacity: 0.85 }}>or click &ldquo;Upload OMR Image&rdquo; below</p>
              </div>
            )}
          </>
        ) : (
          <div style={styles.capturedWrapper}>
            <img src={capturedImage} alt="Captured OMR" style={styles.mediaElement} />
            <canvas
              ref={overlayCanvasRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{
                ...styles.overlayCanvas,
                cursor: activeDragCorner ? 'grabbing' : detectedCorners ? 'grab' : 'default',
              }}
            />
          </div>
        )}

        <canvas ref={captureCanvasRef} style={{ display: 'none' }} />
      </div>

      {uploadedFileName && <p style={styles.fileBadge}>Loaded File: {uploadedFileName}</p>}
      {cameraError && <p style={styles.errorText}>{cameraError}</p>}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onFileSelected(file);
          e.target.value = '';
        }}
        style={{ display: 'none' }}
      />

      <div style={styles.controlsRow}>
        {!capturedImage ? (
          <>
            <button
              type="button"
              onClick={onCapturePhoto}
              disabled={!streamActive || isProcessing}
              style={styles.primaryBtn}
            >
              📸 Click OMR Photo
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessing}
              style={styles.uploadBtn}
            >
              🖼️ Upload OMR Image
            </button>

            <button type="button" onClick={onSwitchCamera} style={styles.secondaryBtn}>
              🔄 Switch Camera
            </button>
          </>
        ) : (
          <>
            <button type="button" onClick={onRetake} style={styles.secondaryBtn}>
              ↺ Back to Camera
            </button>

            <button type="button" onClick={() => fileInputRef.current?.click()} style={styles.uploadBtn}>
              🖼️ Upload Another Image
            </button>

            <button type="button" onClick={onReDetectAuto} style={styles.secondaryBtn}>
              🎯 Re-Detect Auto
            </button>

            {!detectedCorners && (
              <button type="button" onClick={onSetManualCorners} style={styles.secondaryBtn}>
                ✏️ Set Corners Manually
              </button>
            )}
          </>
        )}
      </div>
    </>
  );
}

const styles: Record<string, React.CSSProperties> = {
  viewport: {
    position: 'relative',
    width: '100%',
    maxWidth: '520px',
    margin: '0 auto 12px auto',
    backgroundColor: '#0f172a',
    borderRadius: '10px',
    overflow: 'hidden',
    aspectRatio: '3 / 4',
    userSelect: 'none',
  },
  fallbackDropHint: {
    position: 'absolute',
    inset: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#e2e8f0',
    pointerEvents: 'none',
    padding: '20px',
  },
  capturedWrapper: {
    position: 'relative',
    width: '100%',
    height: '100%',
  },
  mediaElement: {
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    display: 'block',
    pointerEvents: 'none',
  },
  overlayCanvas: {
    position: 'absolute',
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'contain',
    pointerEvents: 'auto',
    touchAction: 'none',
  },
  guideOverlay: {
    position: 'absolute',
    inset: 0,
    pointerEvents: 'none',
  },
  guideBracket: {
    position: 'absolute',
    width: '36px',
    height: '36px',
    border: '3px solid rgba(56, 189, 248, 0.85)',
    borderRadius: '4px',
  },
  fileBadge: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#0369a1',
    backgroundColor: '#e0f2fe',
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '9999px',
    marginBottom: '12px',
  },
  errorText: {
    color: '#dc2626',
    fontSize: '13px',
    marginBottom: '12px',
  },
  controlsRow: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '16px',
  },
  primaryBtn: {
    backgroundColor: '#0f172a',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  uploadBtn: {
    backgroundColor: '#4f46e5',
    color: '#ffffff',
    padding: '12px 20px',
    borderRadius: '8px',
    border: 'none',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  secondaryBtn: {
    backgroundColor: '#f8fafc',
    color: '#0f172a',
    padding: '12px 18px',
    borderRadius: '8px',
    border: '1px solid #cbd5e1',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
  },
};