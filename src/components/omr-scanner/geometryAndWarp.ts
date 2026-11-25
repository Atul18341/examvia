// components/omr-scanner/geometryAndWarp.ts
import {
  OPTIONS,
  type BookletDetectionResult,
  type BookletSetCode,
  type DetectedCorners,
  type NormalizedRect,
  type OptionLetter,
  type Point,
} from './types';

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

export function binarizeImage(imageData: ImageData, bias = 0.85): Uint8Array {
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
}

export function findCornerMarkers(
  binary: Uint8Array,
  width: number,
  height: number
): DetectedCorners | null {
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
}

function computeHomography(src: Point[], dst: Point[]): number[] | null {
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
}

export function warpPerspective(
  srcCanvas: HTMLCanvasElement,
  dstCanvas: HTMLCanvasElement,
  corners: DetectedCorners
) {
  const outW = 1000;
  const outH = 1274;
  dstCanvas.width = outW;
  dstCanvas.height = outH;

  const srcPts = [corners.topLeft, corners.topRight, corners.bottomRight, corners.bottomLeft];
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
        dBuf[dIdx + 1] =
          sBuf[p00 + 1] * w00 + sBuf[p10 + 1] * w10 + sBuf[p01 + 1] * w01 + sBuf[p11 + 1] * w11;
        dBuf[dIdx + 2] =
          sBuf[p00 + 2] * w00 + sBuf[p10 + 2] * w10 + sBuf[p01 + 2] * w01 + sBuf[p11 + 2] * w11;
        dBuf[dIdx + 3] = 255;
      }
    }
  }

  dstCtx.putImageData(dstData, 0, 0);
}

export function detectBookletSet(
  warpedCanvas: HTMLCanvasElement,
  roi: NormalizedRect
): BookletDetectionResult {
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

  const bubbleCenterY = Math.round(rh * 0.44);
  const bubbleRadius = Math.max(6, Math.round(rw * 0.062));

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

  if (
    topFill >= FILL_THRESHOLD &&
    secondFill >= FILL_THRESHOLD &&
    topFill - secondFill < REL_MARGIN
  ) {
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
}

export function getQuestionBubbleGeometry(
  qCount: number,
  canvasW: number,
  canvasH: number,
  activeGridRoi: NormalizedRect
) {
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
}

export function screenToCanvasCoords(
  canvas: HTMLCanvasElement | null,
  clientX: number,
  clientY: number
): Point | null {
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
}