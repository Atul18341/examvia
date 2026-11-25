// components/OMRScanner.tsx
'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/db';

export interface Point {
  x: number;
  y: number;
}

export interface DetectedCorners {
  topLeft: Point;
  topRight: Point;
  bottomRight: Point;
  bottomLeft: Point;
}

export interface NormalizedRect {
  x: number; // 0..1 relative to warped canvas width
  y: number; // 0..1 relative to warped canvas height
  w: number; // 0..1
  h: number; // 0..1
}

export type OptionLetter = 'A' | 'B' | 'C' | 'D';
export type BookletSetCode = OptionLetter | 'BLANK' | 'MULTIPLE';
export type QuestionStatus = OptionLetter | 'BLANK' | 'MULTIPLE';

export interface BookletDetectionResult {
  detectedSet: BookletSetCode;
  fillRatios: Record<OptionLetter, number>;
  confidence: number;
}

export interface QuestionResponseResult {
  questionNumber: number;
  selectedOption: QuestionStatus;
  fillRatios: Record<OptionLetter, number>;
  isCorrect?: boolean;
  correctOption?: OptionLetter;
}

export interface OMRScanPayload {
  examId?: string;
  bookletSet: BookletSetCode;
  totalQuestions: number;
  responses: QuestionResponseResult[];
  summary: {
    attempted: number;
    blank: number;
    multiple: number;
    correct: number;
    wrong: number;
  };
}

type CornerKey = keyof DetectedCorners;

interface BlobCandidate {
  cx: number;
  cy: number;
  area: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  aspectRatio: number;
  rectangularity: number;
}

interface OMRScannerProps {
  examId?: string;
  defaultTotalQuestions?: number;
  answerKey?: Record<number, OptionLetter>;
  onScanComplete?: (payload: OMRScanPayload, warpedCanvas: HTMLCanvasElement) => void;
}

const CORNER_ORDER: { key: CornerKey; label: string }[] = [
  { key: 'topLeft', label: 'TL' },
  { key: 'topRight', label: 'TR' },
  { key: 'bottomRight', label: 'BR' },
  { key: 'bottomLeft', label: 'BL' },
];

const OPTIONS: OptionLetter[] = ['A', 'B', 'C', 'D'];

// Exact normalized coordinates derived from OMRTemplate_2.tsx A4 layout
// `seriesBox`: flex 1/(2.3+2.1+1) on right side of topSection, below headerContainer
const DEFAULT_BOOKLET_ROI: NormalizedRect = {
  x: 0.818,
  y: 0.112,
  w: 0.178,
  h: 0.105,
};

// `responseGridBox`: height 515pt, padding 4pt -> 507pt inner SVG height ending ~16pt above bottom corner centers
const DEFAULT_RESPONSE_GRID_ROI: NormalizedRect = {
  x: 0.005,
  y: 0.252,
  w: 0.990,
  h: 0.722,
};

export default function OMRScanner({
  examId,
  defaultTotalQuestions = 100,
  answerKey,
  onScanComplete,
}: OMRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpedOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [detectedCorners, setDetectedCorners] = useState<DetectedCorners | null>(null);
  const [activeDragCorner, setActiveDragCorner] = useState<CornerKey | null>(null);

  // Exam blueprint question count (synced with IndexedDB if examId is provided)
  const [totalQuestions, setTotalQuestions] = useState<number>(defaultTotalQuestions);

  // Booklet set & Response Grid ROI calibration states
  const [bookletRoi, setBookletRoi] = useState<NormalizedRect>(DEFAULT_BOOKLET_ROI);
  const [gridRoi, setGridRoi] = useState<NormalizedRect>(DEFAULT_RESPONSE_GRID_ROI);
  const [isDraggingBookletRoi, setIsDraggingBookletRoi] = useState(false);
  const dragRoiOffsetRef = useRef<Point>({ x: 0, y: 0 });
  const [bookletResult, setBookletResult] = useState<BookletDetectionResult | null>(null);
  const [manualBookletOverride, setManualBookletOverride] = useState<OptionLetter | null>(null);

  // Question response detection state
  const [questionResponses, setQuestionResponses] = useState<QuestionResponseResult[]>([]);
  const [showBubbleOverlay, setShowBubbleOverlay] = useState<boolean>(true);

  const [statusMessage, setStatusMessage] = useState<string>('Align all 4 black corner squares or upload an OMR image.');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load totalQuestions from IndexedDB if examId is passed
  useEffect(() => {
    if (!examId) return;
    db.exams
      .get(examId)
      .then((record) => {
        if (record?.totalQuestions) {
          setTotalQuestions(record.totalQuestions);
        }
      })
      .catch((err) => console.error('Failed to read exam totalQuestions from IndexedDB:', err));
  }, [examId]);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (videoRef.current?.srcObject) {
      const existingStream = videoRef.current.srcObject as MediaStream;
      existingStream.getTracks().forEach((track) => track.stop());
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: {
          facingMode: { ideal: mode },
          width: { ideal: 1920 },
          height: { ideal: 1080 },
        },
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
        setStreamActive(true);
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      setCameraError('Camera unavailable. Use the "Upload Image" button below to select an OMR photo from your device.');
      setStreamActive(false);
    }
  }, []);

  useEffect(() => {
    if (!capturedImage) {
      startCamera(facingMode);
    }
    return () => {
      if (videoRef.current?.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, capturedImage, startCamera]);

  /**
   * 1. Convert ImageData to grayscale & compute Otsu's global threshold
   */
  const binarizeImage = (imageData: ImageData, bias = 0.85): Uint8Array => {
    const { width, height, data } = imageData;
    const totalPixels = width * height;
    const gray = new Uint8Array(totalPixels);
    const histogram = new Int32Array(256);

    for (let i = 0, p = 0; i < data.length; i += 4, p++) {
      const lum = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8;
      gray[p] = lum;
      histogram[lum]++;
    }

    let sum = 0;
    for (let t = 0; t < 256; t++) sum += t * histogram[t];

    let sumB = 0;
    let wB = 0;
    let maxVariance = 0;
    let threshold = 110;

    for (let t = 0; t < 256; t++) {
      wB += histogram[t];
      if (wB === 0) continue;
      const wF = totalPixels - wB;
      if (wF === 0) break;

      sumB += t * histogram[t];
      const mB = sumB / wB;
      const mF = (sum - sumB) / wF;
      const variance = wB * wF * (mB - mF) * (mB - mF);

      if (variance > maxVariance) {
        maxVariance = variance;
        threshold = t;
      }
    }

    const adjustedThreshold = Math.max(40, Math.min(185, threshold * bias));
    const binary = new Uint8Array(totalPixels);
    for (let p = 0; p < totalPixels; p++) {
      binary[p] = gray[p] < adjustedThreshold ? 1 : 0;
    }
    return binary;
  };

  /**
   * 2. Connected-Component Labeling (BFS) to locate the 4 16x16pt corner boxes
   */
  const findCornerMarkers = (
    binary: Uint8Array,
    width: number,
    height: number
  ): DetectedCorners | null => {
    const visited = new Uint8Array(width * height);
    const queue = new Int32Array(width * height);
    const candidates: BlobCandidate[] = [];

    const minDim = Math.min(width, height);
    const minSide = Math.max(8, Math.floor(minDim * 0.012));
    const maxSide = Math.floor(minDim * 0.08);
    const minArea = minSide * minSide * 0.65;
    const maxArea = maxSide * maxSide;

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        const idx = y * width + x;
        if (binary[idx] === 1 && visited[idx] === 0) {
          let head = 0;
          let tail = 0;
          queue[tail++] = idx;
          visited[idx] = 1;

          let area = 0;
          let sumX = 0;
          let sumY = 0;
          let minX = x;
          let maxX = x;
          let minY = y;
          let maxY = y;

          while (head < tail) {
            const curr = queue[head++];
            const cx = curr % width;
            const cy = (curr / width) | 0;

            area++;
            sumX += cx;
            sumY += cy;
            if (cx < minX) minX = cx;
            if (cx > maxX) maxX = cx;
            if (cy < minY) minY = cy;
            if (cy > maxY) maxY = cy;

            const neighbors = [curr - 1, curr + 1, curr - width, curr + width];
            for (let n = 0; n < 4; n++) {
              const nIdx = neighbors[n];
              if (nIdx >= 0 && nIdx < binary.length && binary[nIdx] === 1 && visited[nIdx] === 0) {
                visited[nIdx] = 1;
                queue[tail++] = nIdx;
              }
            }
          }

          if (area >= minArea && area <= maxArea) {
            const bw = maxX - minX + 1;
            const bh = maxY - minY + 1;
            const aspectRatio = bw / bh;
            const rectangularity = area / (bw * bh);

            if (aspectRatio >= 0.68 && aspectRatio <= 1.45 && rectangularity >= 0.72) {
              candidates.push({
                cx: sumX / area,
                cy: sumY / area,
                area,
                minX,
                minY,
                maxX,
                maxY,
                width: bw,
                height: bh,
                aspectRatio,
                rectangularity,
              });
            }
          }
        }
      }
    }

    if (candidates.length < 4) return null;

    const midX = width / 2;
    const midY = height / 2;

    const pickBestInQuadrant = (
      filterFn: (c: BlobCandidate) => boolean,
      cornerRef: Point
    ): BlobCandidate | null => {
      const qCandidates = candidates.filter(filterFn);
      if (qCandidates.length === 0) return null;

      qCandidates.sort((a, b) => {
        const distA = Math.hypot(a.cx - cornerRef.x, a.cy - cornerRef.y);
        const distB = Math.hypot(b.cx - cornerRef.x, b.cy - cornerRef.y);
        const squareScoreA = a.rectangularity * (1 - Math.abs(1 - a.aspectRatio));
        const squareScoreB = b.rectangularity * (1 - Math.abs(1 - b.aspectRatio));
        return distA / (squareScoreA + 0.1) - distB / (squareScoreB + 0.1);
      });

      return qCandidates[0];
    };

    const tl = pickBestInQuadrant((c) => c.cx < midX && c.cy < midY, { x: 0, y: 0 });
    const tr = pickBestInQuadrant((c) => c.cx >= midX && c.cy < midY, { x: width, y: 0 });
    const br = pickBestInQuadrant((c) => c.cx >= midX && c.cy >= midY, { x: width, y: height });
    const bl = pickBestInQuadrant((c) => c.cx < midX && c.cy >= midY, { x: 0, y: height });

    if (!tl || !tr || !br || !bl) return null;

    const topWidth = Math.hypot(tr.cx - tl.cx, tr.cy - tl.cy);
    const bottomWidth = Math.hypot(br.cx - bl.cx, br.cy - bl.cy);
    const leftHeight = Math.hypot(bl.cx - tl.cx, bl.cy - tl.cy);
    const rightHeight = Math.hypot(br.cx - tr.cx, br.cy - tr.cy);

    if (
      topWidth < width * 0.25 ||
      bottomWidth < width * 0.25 ||
      leftHeight < height * 0.25 ||
      rightHeight < height * 0.25
    ) {
      return null;
    }

    return {
      topLeft: { x: tl.cx, y: tl.cy },
      topRight: { x: tr.cx, y: tr.cy },
      bottomRight: { x: br.cx, y: br.cy },
      bottomLeft: { x: bl.cx, y: bl.cy },
    };
  };

  /**
   * 3. Compute 3x3 Homography Matrix & Perspective-Warp OMR Region
   */
  const computeHomography = (src: Point[], dst: Point[]): number[] | null => {
    const A: number[][] = [];
    const B: number[] = [];

    for (let i = 0; i < 4; i++) {
      const { x, y } = src[i];
      const { x: u, y: v } = dst[i];
      A.push([x, y, 1, 0, 0, 0, -u * x, -u * y]);
      B.push(u);
      A.push([0, 0, 0, x, y, 1, -v * x, -v * y]);
      B.push(v);
    }

    const n = 8;
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) {
        if (Math.abs(A[k][i]) > Math.abs(A[maxRow][i])) maxRow = k;
      }
      [A[i], A[maxRow]] = [A[maxRow], A[i]];
      [B[i], B[maxRow]] = [B[maxRow], B[i]];

      if (Math.abs(A[i][i]) < 1e-10) return null;

      for (let k = i + 1; k < n; k++) {
        const factor = A[k][i] / A[i][i];
        B[k] -= factor * B[i];
        for (let j = i; j < n; j++) {
          A[k][j] -= factor * A[i][j];
        }
      }
    }

    const h = new Array(9).fill(0);
    h[8] = 1;
    for (let i = n - 1; i >= 0; i--) {
      let sum = B[i];
      for (let j = i + 1; j < n; j++) {
        sum -= A[i][j] * h[j];
      }
      h[i] = sum / A[i][i];
    }
    return h;
  };

  const warpPerspective = useCallback(
    (srcCanvas: HTMLCanvasElement, dstCanvas: HTMLCanvasElement, corners: DetectedCorners) => {
      // Exact aspect ratio between the 4 corner centers in OMRTemplate_2.tsx: 559pt x 712pt -> 1000 x 1274
      const outW = 1000;
      const outH = 1274;
      dstCanvas.width = outW;
      dstCanvas.height = outH;

      const srcPts = [
        corners.topLeft,
        corners.topRight,
        corners.bottomRight,
        corners.bottomLeft,
      ];
      const dstPts = [
        { x: 0, y: 0 },
        { x: outW, y: 0 },
        { x: outW, y: outH },
        { x: 0, y: outH },
      ];

      const H = computeHomography(dstPts, srcPts);
      if (!H) return;

      const srcCtx = srcCanvas.getContext('2d')!;
      const dstCtx = dstCanvas.getContext('2d')!;
      const srcData = srcCtx.getImageData(0, 0, srcCanvas.width, srcCanvas.height);
      const dstData = dstCtx.createImageData(outW, outH);

      const sW = srcCanvas.width;
      const sH = srcCanvas.height;
      const sBuf = srcData.data;
      const dBuf = dstData.data;

      for (let y = 0; y < outH; y++) {
        for (let x = 0; x < outW; x++) {
          const denom = H[6] * x + H[7] * y + H[8];
          const sx = (H[0] * x + H[1] * y + H[2]) / denom;
          const sy = (H[3] * x + H[4] * y + H[5]) / denom;

          const ix = sx | 0;
          const iy = sy | 0;

          if (ix >= 0 && ix < sW - 1 && iy >= 0 && iy < sH - 1) {
            const fx = sx - ix;
            const fy = sy - iy;
            const w00 = (1 - fx) * (1 - fy);
            const w10 = fx * (1 - fy);
            const w01 = (1 - fx) * fy;
            const w11 = fx * fy;

            const p00 = (iy * sW + ix) * 4;
            const p10 = p00 + 4;
            const p01 = p00 + sW * 4;
            const p11 = p01 + 4;

            const dIdx = (y * outW + x) * 4;
            dBuf[dIdx] = sBuf[p00] * w00 + sBuf[p10] * w10 + sBuf[p01] * w01 + sBuf[p11] * w11;
            dBuf[dIdx + 1] = sBuf[p00 + 1] * w00 + sBuf[p10 + 1] * w10 + sBuf[p01 + 1] * w01 + sBuf[p11 + 1] * w11;
            dBuf[dIdx + 2] = sBuf[p00 + 2] * w00 + sBuf[p10 + 2] * w10 + sBuf[p01 + 2] * w01 + sBuf[p11 + 2] * w11;
            dBuf[dIdx + 3] = 255;
          }
        }
      }

      dstCtx.putImageData(dstData, 0, 0);
    },
    []
  );

  /**
   * 4. Detect Booklet Series Code (A / B / C / D) inside `seriesBox` of OMRTemplate_2.tsx
   * Uses local paper-background luminance contrast so both printed PDFs and simulator images score accurately.
   */
  const detectBookletSet = useCallback(
    (warpedCanvas: HTMLCanvasElement, roi: NormalizedRect): BookletDetectionResult => {
      const ctx = warpedCanvas.getContext('2d')!;
      const W = warpedCanvas.width;
      const H = warpedCanvas.height;

      const rx = Math.max(0, Math.round(roi.x * W));
      const ry = Math.max(0, Math.round(roi.y * H));
      const rw = Math.min(W - rx, Math.round(roi.w * W));
      const rh = Math.min(H - ry, Math.round(roi.h * H));

      const roiData = ctx.getImageData(rx, ry, rw, rh);
      const data = roiData.data;
      const gray = new Uint8Array(rw * rh);
      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        gray[p] = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8;
      }

      // `seriesCircle` sits below `seriesBoxTitleContainer` (~42% down `seriesBox`)
      const bubbleCenterY = Math.round(rh * 0.44);
      // `seriesCircle` is 13x13pt inside ~100pt box width -> radius ~6.5pt -> ~0.062 * rw
      const bubbleRadius = Math.max(6, Math.round(rw * 0.062));

      // Sample paper luminance along the row just below the booklet bubbles
      let bgSum = 0;
      let bgCount = 0;
      const sampleBgY = Math.min(rh - 1, bubbleCenterY + bubbleRadius + 4);
      for (let px = 4; px < rw - 4; px++) {
        const lum = gray[sampleBgY * rw + px];
        if (lum > 140) {
          bgSum += lum;
          bgCount++;
        }
      }
      const localPaperLum = bgCount > 0 ? bgSum / bgCount : 235;
      const inkCutoff = localPaperLum * 0.68;

      const fillRatios: Record<OptionLetter, number> = { A: 0, B: 0, C: 0, D: 0 };

      OPTIONS.forEach((opt, idx) => {
        // `justifyContent: 'space-around'` places centers at (2*idx + 1) / 8 of box width
        const cx = Math.round(((2 * idx + 1) / 8) * rw);
        let darkPixels = 0;
        let totalPixels = 0;

        for (let dy = -bubbleRadius; dy <= bubbleRadius; dy++) {
          for (let dx = -bubbleRadius; dx <= bubbleRadius; dx++) {
            if (dx * dx + dy * dy <= bubbleRadius * bubbleRadius) {
              const px = cx + dx;
              const py = bubbleCenterY + dy;
              if (px >= 0 && px < rw && py >= 0 && py < rh) {
                totalPixels++;
                if (gray[py * rw + px] < inkCutoff) {
                  darkPixels++;
                }
              }
            }
          }
        }

        fillRatios[opt] = totalPixels > 0 ? darkPixels / totalPixels : 0;
      });

      const FILL_THRESHOLD = 0.38;
      const REL_MARGIN = 0.11;
      const sorted = [...OPTIONS].sort((a, b) => fillRatios[b] - fillRatios[a]);
      const topOpt = sorted[0];
      const secondOpt = sorted[1];
      const topFill = fillRatios[topOpt];
      const secondFill = fillRatios[secondOpt];

      let detectedSet: BookletSetCode = 'BLANK';
      let confidence = 0;

      if (topFill >= FILL_THRESHOLD && secondFill >= FILL_THRESHOLD && topFill - secondFill < REL_MARGIN) {
        detectedSet = 'MULTIPLE';
        confidence = 0.5;
      } else if (topFill >= FILL_THRESHOLD && topFill - secondFill >= REL_MARGIN) {
        detectedSet = topOpt;
        confidence = Math.min(1, (topFill - secondFill) / 0.45);
      } else {
        detectedSet = 'BLANK';
        confidence = Math.max(0, 1 - topFill / FILL_THRESHOLD);
      }

      return { detectedSet, fillRatios, confidence };
    },
    []
  );

  /**
   * 5. Compute Exact Normalized Coordinates for Every Question Bubble in `OMRTemplate_2.tsx`
   */
  const getQuestionBubbleGeometry = useCallback(
    (qCount: number, canvasW: number, canvasH: number, activeGridRoi: NormalizedRect) => {
      const columnsCount = qCount > 120 ? 5 : qCount > 75 ? 4 : qCount > 30 ? 3 : 2;
      const questionsPerColumn = Math.ceil(qCount / columnsCount);

      const svgColHeight = 507;
      const svgColWidth = Math.floor((565 - columnsCount * 4) / columnsCount);
      const rowStep = svgColHeight / Math.max(1, questionsPerColumn);

      const maxRadiusByRow = (rowStep - 2.2) / 2;
      const maxRadiusByWidth = (svgColWidth - 28) / 10;
      const baseRadius = qCount > 120 ? 4.8 : qCount > 75 ? 5.5 : 6.5;
      const bubbleRadius = Math.max(3.2, Math.min(baseRadius, maxRadiusByRow, maxRadiusByWidth));

      const bubbleGap = Math.max(2.5, Math.min(4.5, (svgColWidth - 24 - bubbleRadius * 8) / 4));
      const labelX = 16;
      const firstBubbleX = labelX + 8 + bubbleRadius;

      const gridX = activeGridRoi.x * canvasW;
      const gridY = activeGridRoi.y * canvasH;
      const gridW = activeGridRoi.w * canvasW;
      const gridH = activeGridRoi.h * canvasH;

      // Each column View in `responseGridBox` has `marginHorizontal: 2` inside ~567pt inner width
      const colSlotW = gridW / columnsCount;
      const colMarginPx = (2 / 567) * gridW;
      const innerColW = colSlotW - colMarginPx * 2;

      const scaleX = innerColW / svgColWidth;
      const scaleY = gridH / svgColHeight;
      const sampleRadiusPx = Math.max(4, Math.round(bubbleRadius * Math.min(scaleX, scaleY) * 0.84));

      const bubbles: {
        questionNumber: number;
        option: OptionLetter;
        cx: number;
        cy: number;
        r: number;
      }[] = [];

      for (let colIdx = 0; colIdx < columnsCount; colIdx++) {
        const startQ = colIdx * questionsPerColumn + 1;
        const endQ = Math.min((colIdx + 1) * questionsPerColumn, qCount);
        const rowCount = endQ - startQ + 1;
        const colLeftPx = gridX + colIdx * colSlotW + colMarginPx;

        for (let rowIdx = 0; rowIdx < rowCount; rowIdx++) {
          const qNum = startQ + rowIdx;
          const svgCy = rowIdx * rowStep + rowStep / 2;
          const cy = gridY + svgCy * scaleY;

          OPTIONS.forEach((opt, optIdx) => {
            const svgCx = firstBubbleX + optIdx * (bubbleRadius * 2 + bubbleGap);
            const cx = colLeftPx + svgCx * scaleX;
            bubbles.push({
              questionNumber: qNum,
              option: opt,
              cx,
              cy,
              r: sampleRadiusPx,
            });
          });
        }
      }

      return bubbles;
    },
    []
  );

  /**
   * 6. Detect Student Responses Across ALL Question Bubbles via Per-Row Local Contrast
   */
  const detectQuestionResponses = useCallback(
    (
      warpedCanvas: HTMLCanvasElement,
      qCount: number,
      activeGridRoi: NormalizedRect,
      key?: Record<number, OptionLetter>
    ): QuestionResponseResult[] => {
      const ctx = warpedCanvas.getContext('2d')!;
      const W = warpedCanvas.width;
      const H = warpedCanvas.height;

      const fullImgData = ctx.getImageData(0, 0, W, H);
      const data = fullImgData.data;

      const gray = new Uint8Array(W * H);
      for (let i = 0, p = 0; i < data.length; i += 4, p++) {
        gray[p] = (data[i] * 77 + data[i + 1] * 150 + data[i + 2] * 29) >> 8;
      }

      const allBubbles = getQuestionBubbleGeometry(qCount, W, H, activeGridRoi);
      const byQuestion = new Map<
        number,
        { opt: OptionLetter; cx: number; cy: number; r: number }[]
      >();

      for (const b of allBubbles) {
        if (!byQuestion.has(b.questionNumber)) {
          byQuestion.set(b.questionNumber, []);
        }
        byQuestion.get(b.questionNumber)!.push({
          opt: b.option,
          cx: b.cx,
          cy: b.cy,
          r: b.r,
        });
      }

      const results: QuestionResponseResult[] = [];

      for (let q = 1; q <= qCount; q++) {
        const qBubbles = byQuestion.get(q) || [];
        const ratios: Record<OptionLetter, number> = { A: 0, B: 0, C: 0, D: 0 };

        if (qBubbles.length === 4) {
          // Sample paper luminance along the row gap just above the 4 bubbles
          let bgSum = 0;
          let bgCount = 0;
          const r = qBubbles[0].r;
          const sampleY = Math.max(0, Math.round(qBubbles[0].cy - r - 2));

          const minRowX = Math.max(0, Math.round(qBubbles[0].cx - r));
          const maxRowX = Math.min(W - 1, Math.round(qBubbles[3].cx + r));
          for (let px = minRowX; px <= maxRowX; px++) {
            const lum = gray[sampleY * W + px];
            if (lum > 140) {
              bgSum += lum;
              bgCount++;
            }
          }
          const localPaperLum = bgCount > 0 ? bgSum / bgCount : 235;
          const inkCutoff = localPaperLum * 0.68;

          for (const b of qBubbles) {
            let darkPixels = 0;
            let totalPixels = 0;
            const rSq = b.r * b.r;
            const centerX = Math.round(b.cx);
            const centerY = Math.round(b.cy);

            for (let dy = -b.r; dy <= b.r; dy++) {
              for (let dx = -b.r; dx <= b.r; dx++) {
                if (dx * dx + dy * dy <= rSq) {
                  const px = centerX + dx;
                  const py = centerY + dy;
                  if (px >= 0 && px < W && py >= 0 && py < H) {
                    totalPixels++;
                    if (gray[py * W + px] < inkCutoff) {
                      darkPixels++;
                    }
                  }
                }
              }
            }

            ratios[b.opt] = totalPixels > 0 ? darkPixels / totalPixels : 0;
          }
        }

        const sorted = [...OPTIONS].sort((a, b) => ratios[b] - ratios[a]);
        const topOpt = sorted[0];
        const secondOpt = sorted[1];
        const topFill = ratios[topOpt];
        const secondFill = ratios[secondOpt];

        const ABS_FILL_THRESHOLD = 0.36;
        const REL_MARGIN_THRESHOLD = 0.11;

        let selectedOption: QuestionStatus = 'BLANK';
        if (
          topFill >= ABS_FILL_THRESHOLD &&
          secondFill >= ABS_FILL_THRESHOLD &&
          topFill - secondFill < REL_MARGIN_THRESHOLD
        ) {
          selectedOption = 'MULTIPLE';
        } else if (
          topFill >= ABS_FILL_THRESHOLD &&
          topFill - secondFill >= REL_MARGIN_THRESHOLD
        ) {
          selectedOption = topOpt;
        }

        const correctOption = key?.[q];
        const isCorrect =
          correctOption &&
          (selectedOption === 'A' ||
            selectedOption === 'B' ||
            selectedOption === 'C' ||
            selectedOption === 'D')
            ? selectedOption === correctOption
            : undefined;

        results.push({
          questionNumber: q,
          selectedOption,
          fillRatios: ratios,
          correctOption,
          isCorrect,
        });
      }

      return results;
    },
    [getQuestionBubbleGeometry]
  );

  /**
   * Draw Booklet Set ROI + Question Response Bubble Detections on Warped Preview
   */
  const drawWarpedAnnotations = useCallback(
    (
      canvas: HTMLCanvasElement,
      width: number,
      height: number,
      roi: NormalizedRect,
      activeGridRoi: NormalizedRect,
      bResult: BookletDetectionResult | null,
      bOverride: OptionLetter | null,
      responses: QuestionResponseResult[],
      qCount: number,
      renderBubbles: boolean
    ) => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, width, height);

      // 1. Booklet ROI Box
      const rx = roi.x * width;
      const ry = roi.y * height;
      const rw = roi.w * width;
      const rh = roi.h * height;

      ctx.strokeStyle = '#0284c7';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 4]);
      ctx.strokeRect(rx, ry, rw, rh);
      ctx.setLineDash([]);
      ctx.fillStyle = 'rgba(2, 132, 199, 0.08)';
      ctx.fillRect(rx, ry, rw, rh);

      ctx.fillStyle = '#0284c7';
      ctx.fillRect(rx, ry - 22, rw, 22);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const activeSet = bOverride ?? bResult?.detectedSet ?? '?';
      ctx.fillText(`BOOKLET [${activeSet}]`, rx + rw / 2, ry - 11);

      const bubbleCenterY = ry + rh * 0.44;
      const bubbleRadius = Math.max(6, rw * 0.062);

      OPTIONS.forEach((opt, idx) => {
        const cx = rx + ((2 * idx + 1) / 8) * rw;
        const isSelected = activeSet === opt;

        ctx.beginPath();
        ctx.arc(cx, bubbleCenterY, bubbleRadius + 2, 0, Math.PI * 2);
        ctx.strokeStyle = isSelected ? '#10b981' : '#f59e0b';
        ctx.lineWidth = isSelected ? 3.5 : 2;
        ctx.stroke();

        if (isSelected) {
          ctx.fillStyle = 'rgba(16, 185, 129, 0.28)';
          ctx.fill();
        }
      });

      // 2. Question Response Grid Overlay
      if (renderBubbles && responses.length > 0) {
        const responseMap = new Map<number, QuestionResponseResult>();
        responses.forEach((r) => responseMap.set(r.questionNumber, r));

        const bubbles = getQuestionBubbleGeometry(qCount, width, height, activeGridRoi);
        for (const b of bubbles) {
          const res = responseMap.get(b.questionNumber);
          if (!res) continue;

          const isMarkedOption = res.selectedOption === b.option;
          const isMultipleBubble = res.selectedOption === 'MULTIPLE' && res.fillRatios[b.option] >= 0.36;
          const isCorrectHint = res.correctOption === b.option && res.isCorrect === false;

          if (isMarkedOption) {
            const strokeColor = res.isCorrect === false ? '#ef4444' : '#10b981';
            const fillColor = res.isCorrect === false ? 'rgba(239, 68, 68, 0.32)' : 'rgba(16, 185, 129, 0.32)';
            ctx.beginPath();
            ctx.arc(b.cx, b.cy, b.r + 2, 0, Math.PI * 2);
            ctx.fillStyle = fillColor;
            ctx.fill();
            ctx.strokeStyle = strokeColor;
            ctx.lineWidth = 2.5;
            ctx.stroke();
          } else if (isMultipleBubble) {
            ctx.beginPath();
            ctx.arc(b.cx, b.cy, b.r + 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#f59e0b';
            ctx.lineWidth = 2.5;
            ctx.stroke();
          } else if (isCorrectHint) {
            ctx.beginPath();
            ctx.arc(b.cx, b.cy, b.r + 2, 0, Math.PI * 2);
            ctx.strokeStyle = '#0284c7';
            ctx.lineWidth = 2;
            ctx.stroke();
          } else {
            ctx.beginPath();
            ctx.arc(b.cx, b.cy, b.r, 0, Math.PI * 2);
            ctx.strokeStyle = 'rgba(148, 163, 184, 0.35)';
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }
    },
    [getQuestionBubbleGeometry]
  );

  /**
   * Draw interactive green bounding polygon & draggable corner handles
   */
  const drawDetectionOverlay = useCallback(
    (
      canvas: HTMLCanvasElement,
      width: number,
      height: number,
      corners: DetectedCorners | null,
      draggingKey: CornerKey | null = null
    ) => {
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.clearRect(0, 0, width, height);

      if (!corners) return;

      const pts = CORNER_ORDER.map((c) => corners[c.key]);

      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.closePath();
      ctx.strokeStyle = '#10b981';
      ctx.lineWidth = Math.max(3, width * 0.004);
      ctx.stroke();
      ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
      ctx.fill();

      CORNER_ORDER.forEach(({ key, label }) => {
        const pt = corners[key];
        const isDragging = draggingKey === key;
        const baseR = Math.max(16, width * 0.02);
        const r = isDragging ? baseR * 1.35 : baseR;

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r + 5, 0, Math.PI * 2);
        ctx.fillStyle = isDragging ? 'rgba(245, 158, 11, 0.35)' : 'rgba(16, 185, 129, 0.28)';
        ctx.fill();

        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = isDragging ? '#f59e0b' : '#10b981';
        ctx.fill();
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2.5;
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = `bold ${Math.max(11, baseR * 0.78)}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(label, pt.x, pt.y);
      });
    },
    []
  );

  // Sync overlay, warped canvas, booklet set, and question responses whenever inputs change
  useEffect(() => {
    const srcCanvas = captureCanvasRef.current;
    const overlayCanvas = overlayCanvasRef.current;
    const warpedCanvas = warpedCanvasRef.current;
    const warpedOverlay = warpedOverlayRef.current;
    if (!srcCanvas || !overlayCanvas || !capturedImage) return;

    drawDetectionOverlay(
      overlayCanvas,
      srcCanvas.width,
      srcCanvas.height,
      detectedCorners,
      activeDragCorner
    );

    if (detectedCorners && warpedCanvas) {
      warpPerspective(srcCanvas, warpedCanvas, detectedCorners);
      const bResult = detectBookletSet(warpedCanvas, bookletRoi);
      setBookletResult(bResult);

      const qResults = detectQuestionResponses(warpedCanvas, totalQuestions, gridRoi, answerKey);
      setQuestionResponses(qResults);

      if (warpedOverlay) {
        drawWarpedAnnotations(
          warpedOverlay,
          warpedCanvas.width,
          warpedCanvas.height,
          bookletRoi,
          gridRoi,
          bResult,
          manualBookletOverride,
          qResults,
          totalQuestions,
          showBubbleOverlay
        );
      }

      const activeSet: BookletSetCode = manualBookletOverride ?? bResult.detectedSet;
      let attempted = 0;
      let blank = 0;
      let multiple = 0;
      let correct = 0;
      let wrong = 0;

      for (const r of qResults) {
        if (r.selectedOption === 'BLANK') {
          blank++;
        } else if (r.selectedOption === 'MULTIPLE') {
          multiple++;
        } else {
          attempted++;
          if (r.isCorrect === true) correct++;
          else if (r.isCorrect === false) wrong++;
        }
      }

      onScanComplete?.(
        {
          examId,
          bookletSet: activeSet,
          totalQuestions,
          responses: qResults,
          summary: { attempted, blank, multiple, correct, wrong },
        },
        warpedCanvas
      );
    }
  }, [
    detectedCorners,
    activeDragCorner,
    capturedImage,
    bookletRoi,
    gridRoi,
    manualBookletOverride,
    totalQuestions,
    answerKey,
    showBubbleOverlay,
    examId,
    drawDetectionOverlay,
    warpPerspective,
    detectBookletSet,
    detectQuestionResponses,
    drawWarpedAnnotations,
    onScanComplete,
  ]);

  const screenToCanvasCoords = (
    canvas: HTMLCanvasElement | null,
    clientX: number,
    clientY: number
  ): Point | null => {
    if (!canvas || canvas.width === 0 || canvas.height === 0) return null;

    const rect = canvas.getBoundingClientRect();
    const imgAspect = canvas.width / canvas.height;
    const boxAspect = rect.width / rect.height;

    let renderedW = rect.width;
    let renderedH = rect.height;
    let offsetX = 0;
    let offsetY = 0;

    if (imgAspect > boxAspect) {
      renderedH = rect.width / imgAspect;
      offsetY = (rect.height - renderedH) / 2;
    } else {
      renderedW = rect.height * imgAspect;
      offsetX = (rect.width - renderedW) / 2;
    }

    const relX = (clientX - rect.left - offsetX) / renderedW;
    const relY = (clientY - rect.top - offsetY) / renderedH;

    return {
      x: Math.max(0, Math.min(canvas.width, relX * canvas.width)),
      y: Math.max(0, Math.min(canvas.height, relY * canvas.height)),
    };
  };

  /**
   * Pointer Handlers for Dragging Green Corner Handles
   */
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!detectedCorners || !overlayCanvasRef.current) return;
    const pt = screenToCanvasCoords(overlayCanvasRef.current, e.clientX, e.clientY);
    if (!pt) return;

    const hitRadius = Math.max(36, overlayCanvasRef.current.width * 0.06);
    let closestKey: CornerKey | null = null;
    let minDistance = hitRadius;

    for (const { key } of CORNER_ORDER) {
      const corner = detectedCorners[key];
      const dist = Math.hypot(pt.x - corner.x, pt.y - corner.y);
      if (dist <= minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }

    if (closestKey) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setActiveDragCorner(closestKey);
      setManualBookletOverride(null);
      setStatusMessage(`Adjusting ${closestKey.replace(/([A-Z])/g, ' $1').toUpperCase()} corner...`);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragCorner || !detectedCorners) return;
    const pt = screenToCanvasCoords(overlayCanvasRef.current, e.clientX, e.clientY);
    if (!pt) return;

    setDetectedCorners((prev) =>
      prev
        ? {
            ...prev,
            [activeDragCorner]: pt,
          }
        : null
    );
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragCorner) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setActiveDragCorner(null);
    setStatusMessage('Corner updated! Booklet set & all responses re-evaluated.');
  };

  /**
   * Pointer Handlers for Dragging the Booklet ROI Box on Warped Preview
   */
  const handleBookletRoiPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = warpedOverlayRef.current;
    if (!canvas) return;
    const pt = screenToCanvasCoords(canvas, e.clientX, e.clientY);
    if (!pt) return;

    const nx = pt.x / canvas.width;
    const ny = pt.y / canvas.height;

    const pad = 0.03;
    if (
      nx >= bookletRoi.x - pad &&
      nx <= bookletRoi.x + bookletRoi.w + pad &&
      ny >= bookletRoi.y - pad &&
      ny <= bookletRoi.y + bookletRoi.h + pad
    ) {
      e.currentTarget.setPointerCapture(e.pointerId);
      dragRoiOffsetRef.current = { x: nx - bookletRoi.x, y: ny - bookletRoi.y };
      setIsDraggingBookletRoi(true);
      setManualBookletOverride(null);
    }
  };

  const handleBookletRoiPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingBookletRoi) return;
    const canvas = warpedOverlayRef.current;
    if (!canvas) return;
    const pt = screenToCanvasCoords(canvas, e.clientX, e.clientY);
    if (!pt) return;

    const nx = pt.x / canvas.width - dragRoiOffsetRef.current.x;
    const ny = pt.y / canvas.height - dragRoiOffsetRef.current.y;

    setBookletRoi((prev) => ({
      ...prev,
      x: Math.max(0, Math.min(1 - prev.w, nx)),
      y: Math.max(0, Math.min(1 - prev.h, ny)),
    }));
  };

  const handleBookletRoiPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDraggingBookletRoi) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setIsDraggingBookletRoi(false);
  };

  const handleManualResponseChange = (qNum: number, newOption: QuestionStatus) => {
    setQuestionResponses((prev) =>
      prev.map((item) => {
        if (item.questionNumber !== qNum) return item;
        const isCorrect =
          item.correctOption && (newOption === 'A' || newOption === 'B' || newOption === 'C' || newOption === 'D')
            ? newOption === item.correctOption
            : undefined;
        return { ...item, selectedOption: newOption, isCorrect };
      })
    );
  };

  const handleSetManualCorners = () => {
    const srcCanvas = captureCanvasRef.current;
    if (!srcCanvas) return;
    const w = srcCanvas.width;
    const h = srcCanvas.height;

    setManualBookletOverride(null);
    setDetectedCorners({
      topLeft: { x: w * 0.04, y: h * 0.025 },
      topRight: { x: w * 0.96, y: h * 0.025 },
      bottomRight: { x: w * 0.96, y: h * 0.875 },
      bottomLeft: { x: w * 0.04, y: h * 0.875 },
    });
    setStatusMessage('Drag the 4 green corner circles onto the centers of the black squares.');
  };

  const processCapturedFrame = (srcCanvas: HTMLCanvasElement) => {
    setIsProcessing(true);
    setManualBookletOverride(null);
    setStatusMessage('Detecting 4 corner boxes, Booklet Set, & Question Responses...');

    requestAnimationFrame(() => {
      const w = srcCanvas.width;
      const h = srcCanvas.height;
      const ctx = srcCanvas.getContext('2d')!;
      const imgData = ctx.getImageData(0, 0, w, h);

      const binary = binarizeImage(imgData, 0.85);
      const corners = findCornerMarkers(binary, w, h);

      if (corners) {
        setDetectedCorners(corners);
        setStatusMessage('Sheet locked & graded! Drag green corner handles if alignment needs fine-tuning.');
      } else {
        setDetectedCorners(null);
        setBookletResult(null);
        setQuestionResponses([]);
        if (overlayCanvasRef.current) {
          drawDetectionOverlay(overlayCanvasRef.current, w, h, null);
        }
        setStatusMessage('Auto-detection missed a corner. Click "Set Corners Manually" or upload/retake another image.');
      }

      setIsProcessing(false);
    });
  };

  const handleCapturePhoto = () => {
    const video = videoRef.current;
    const canvas = captureCanvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d')!;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

    setUploadedFileName(null);
    setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
    processCapturedFrame(canvas);
  };

  const loadImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setStatusMessage('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    setUploadedFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        const canvas = captureCanvasRef.current;
        if (!canvas) return;
        const scale = Math.min(1, 2000 / Math.max(img.width, img.height));
        canvas.width = Math.round(img.width * scale);
        canvas.height = Math.round(img.height * scale);

        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
        processCapturedFrame(canvas);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      loadImageFile(file);
    }
    e.target.value = '';
  };

  const handleDropImage = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      loadImageFile(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadedFileName(null);
    setDetectedCorners(null);
    setBookletResult(null);
    setQuestionResponses([]);
    setManualBookletOverride(null);
    setActiveDragCorner(null);
    setBookletRoi(DEFAULT_BOOKLET_ROI);
    setGridRoi(DEFAULT_RESPONSE_GRID_ROI);
    setStatusMessage('Align all 4 black corner squares or upload an OMR image.');
    if (overlayCanvasRef.current) {
      const ctx = overlayCanvasRef.current.getContext('2d');
      ctx?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
  };

  const activeBookletSet: BookletSetCode =
    manualBookletOverride ?? bookletResult?.detectedSet ?? 'BLANK';

  const attemptedCount = questionResponses.filter((r) => OPTIONS.includes(r.selectedOption as OptionLetter)).length;
  const blankCount = questionResponses.filter((r) => r.selectedOption === 'BLANK').length;
  const multipleCount = questionResponses.filter((r) => r.selectedOption === 'MULTIPLE').length;
  const correctCount = questionResponses.filter((r) => r.isCorrect === true).length;
  const wrongCount = questionResponses.filter((r) => r.isCorrect === false).length;

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Examvia OMR Optical Scanner &amp; Grader</h2>
        <p style={styles.subtitle}>{statusMessage}</p>

        {/* Question Count Configuration Bar */}
        <div style={styles.configBar}>
          <label htmlFor="scanner-q-count" style={styles.configLabel}>
            Template Total Questions:
          </label>
          <input
            id="scanner-q-count"
            type="number"
            min={1}
            max={200}
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(Math.max(1, Math.min(200, parseInt(e.target.value) || 1)))}
            style={styles.configInput}
          />
          <div style={styles.presetPills}>
            {[30, 50, 100, 150].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setTotalQuestions(preset)}
                style={{
                  ...styles.presetPill,
                  backgroundColor: totalQuestions === preset ? '#0f172a' : '#f1f5f9',
                  color: totalQuestions === preset ? '#ffffff' : '#334155',
                }}
              >
                {preset} Qs
              </button>
            ))}
          </div>
        </div>

        {/* Camera / Captured / Dropzone Viewport */}
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDraggingFile(true);
          }}
          onDragLeave={() => setIsDraggingFile(false)}
          onDrop={handleDropImage}
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
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{
                  ...styles.overlayCanvas,
                  cursor: activeDragCorner ? 'grabbing' : detectedCorners ? 'grab' : 'default',
                }}
              />
            </div>
          )}

          <canvas ref={captureCanvasRef} style={{ display: 'none' }} />
        </div>

        {uploadedFileName && (
          <p style={styles.fileBadge}>Loaded File: {uploadedFileName}</p>
        )}

        {cameraError && <p style={styles.errorText}>{cameraError}</p>}

        {/* Hidden Gallery / File Picker Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp,image/*"
          onChange={handleFileUpload}
          style={{ display: 'none' }}
        />

        {/* Controls */}
        <div style={styles.controlsRow}>
          {!capturedImage ? (
            <>
              <button
                type="button"
                onClick={handleCapturePhoto}
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

              <button
                type="button"
                onClick={() => setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))}
                style={styles.secondaryBtn}
              >
                🔄 Switch Camera
              </button>
            </>
          ) : (
            <>
              <button type="button" onClick={handleRetake} style={styles.primaryBtn}>
                ↺ Back to Camera
              </button>

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                style={styles.uploadBtn}
              >
                🖼️ Upload Another Image
              </button>

              <button
                type="button"
                onClick={() => captureCanvasRef.current && processCapturedFrame(captureCanvasRef.current)}
                style={styles.secondaryBtn}
              >
                🎯 Re-Detect Auto
              </button>

              {!detectedCorners && (
                <button type="button" onClick={handleSetManualCorners} style={styles.secondaryBtn}>
                  ✏️ Set Corners Manually
                </button>
              )}
            </>
          )}
        </div>

        {/* Booklet Set, Grading Summary, Warped Preview & Response Sheet */}
        {detectedCorners && (
          <div style={styles.resultsSection}>
            {/* Booklet Series Card */}
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
                    const fillPct = bookletResult
                      ? Math.round(bookletResult.fillRatios[opt] * 100)
                      : 0;
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => setManualBookletOverride(opt)}
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

            {/* Grading & Response Summary Strip */}
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
              {answerKey && (
                <>
                  <div style={styles.summaryCard}>
                    <span style={{ ...styles.summaryValue, color: '#16a34a' }}>{correctCount}</span>
                    <span style={styles.summaryLabel}>Correct</span>
                  </div>
                  <div style={styles.summaryCard}>
                    <span style={{ ...styles.summaryValue, color: '#dc2626' }}>{wrongCount}</span>
                    <span style={styles.summaryLabel}>Wrong</span>
                  </div>
                </>
              )}
            </div>

            {/* Split View: Warped OMR Overlay + Detected Student Responses Grid */}
            <div style={styles.splitWorkspace}>
              {/* Left: Perspective-Corrected Sheet with Bubble Overlay */}
              <div style={styles.warpedBox}>
                <div style={styles.warpedHeaderRow}>
                  <p style={styles.warpedLabel}>Detected Bubble Overlay</p>
                  <div style={{ display: 'flex', gap: '6px' }}>
                    <button
                      type="button"
                      onClick={() =>
                        setGridRoi((prev) => ({
                          ...prev,
                          y: Math.max(0.20, +(prev.y - 0.004).toFixed(4)),
                        }))
                      }
                      style={styles.toggleOverlayBtn}
                      title="Nudge Bubble Grid Up"
                    >
                      ↑ Grid
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setGridRoi((prev) => ({
                          ...prev,
                          y: Math.min(0.29, +(prev.y + 0.004).toFixed(4)),
                        }))
                      }
                      style={styles.toggleOverlayBtn}
                      title="Nudge Bubble Grid Down"
                    >
                      ↓ Grid
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowBubbleOverlay((prev) => !prev)}
                      style={styles.toggleOverlayBtn}
                    >
                      {showBubbleOverlay ? 'Hide Rings' : 'Show Rings'}
                    </button>
                  </div>
                </div>
                <div style={styles.warpedCanvasWrapper}>
                  <canvas ref={warpedCanvasRef} style={styles.warpedCanvas} />
                  <canvas
                    ref={warpedOverlayRef}
                    onPointerDown={handleBookletRoiPointerDown}
                    onPointerMove={handleBookletRoiPointerMove}
                    onPointerUp={handleBookletRoiPointerUp}
                    onPointerCancel={handleBookletRoiPointerUp}
                    style={{
                      ...styles.warpedOverlayCanvas,
                      cursor: isDraggingBookletRoi ? 'grabbing' : 'move',
                    }}
                  />
                </div>
              </div>

              {/* Right: Interactive Student Response Verification List */}
              <div style={styles.responsesPanel}>
                <p style={styles.warpedLabel}>
                  Student Responses ({totalQuestions} Qs — Click to Correct)
                </p>
                <div style={styles.responsesScrollArea}>
                  {questionResponses.map((item) => {
                    const rowBg =
                      item.isCorrect === true
                        ? '#f0fdf4'
                        : item.isCorrect === false
                        ? '#fef2f2'
                        : item.selectedOption === 'MULTIPLE'
                        ? '#fffbeb'
                        : '#ffffff';

                    return (
                      <div key={item.questionNumber} style={{ ...styles.responseRow, backgroundColor: rowBg }}>
                        <span style={styles.qNumBadge}>
                          Q{String(item.questionNumber).padStart(2, '0')}
                        </span>

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
                                  handleManualResponseChange(
                                    item.questionNumber,
                                    isSelected ? 'BLANK' : opt
                                  )
                                }
                                title={`Fill density: ${pct}%`}
                                style={{
                                  ...styles.optCircleBtn,
                                  backgroundColor: isSelected
                                    ? item.isCorrect === false
                                      ? '#dc2626'
                                      : '#0f172a'
                                    : isMultiple
                                    ? '#f59e0b'
                                    : '#f8fafc',
                                  color: isSelected || isMultiple ? '#ffffff' : '#334155',
                                  borderColor:
                                    item.correctOption === opt && item.isCorrect === false
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
                            ? '—'
                            : item.selectedOption === 'MULTIPLE'
                            ? 'MULTI'
                            : item.selectedOption}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    maxWidth: '1040px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  title: {
    fontSize: '22px',
    fontWeight: 700,
    color: '#0f172a',
    marginBottom: '6px',
  },
  subtitle: {
    fontSize: '14px',
    color: '#475569',
    marginBottom: '14px',
  },
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
    marginBottom: '16px',
  },
  configLabel: {
    fontSize: '13px',
    fontWeight: 600,
    color: '#334155',
  },
  configInput: {
    width: '72px',
    padding: '5px 8px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '14px',
    fontWeight: 700,
    textAlign: 'center',
  },
  presetPills: {
    display: 'flex',
    gap: '6px',
  },
  presetPill: {
    padding: '5px 10px',
    borderRadius: '6px',
    border: '1px solid #cbd5e1',
    fontSize: '12px',
    fontWeight: 600,
    cursor: 'pointer',
  },
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
  errorText: {
    color: '#dc2626',
    fontSize: '13px',
    marginBottom: '12px',
  },
  resultsSection: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
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
    width: '46px',
    textAlign: 'right',
  },
};