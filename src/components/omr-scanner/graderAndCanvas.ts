// components/omr-scanner/graderAndCanvas.ts
import { getQuestionBubbleGeometry } from './geometryAndWarp';
import {
  OPTIONS,
  type BookletDetectionResult,
  type BookletSetCode,
  type CalculatedOMRResult,
  type CornerKey,
  type DetectedCorners,
  type NormalizedRect,
  type OptionLetter,
  type QuestionResponseResult,
  type QuestionStatus,
} from './types';

export function detectQuestionResponses(
  warpedCanvas: HTMLCanvasElement,
  qCount: number,
  activeGridRoi: NormalizedRect,
  key?: Record<number, OptionLetter>
): QuestionResponseResult[] {
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
    } else if (topFill >= ABS_FILL_THRESHOLD && topFill - secondFill >= REL_MARGIN_THRESHOLD) {
      selectedOption = topOpt;
    }

    const correctOption = key?.[q];
    let isCorrect: boolean | undefined = undefined;
    if (correctOption) {
      if (selectedOption === 'MULTIPLE') {
        isCorrect = false;
      } else if (
        selectedOption === 'A' ||
        selectedOption === 'B' ||
        selectedOption === 'C' ||
        selectedOption === 'D'
      ) {
        isCorrect = selectedOption === correctOption;
      }
    }

    results.push({
      questionNumber: q,
      selectedOption,
      fillRatios: ratios,
      correctOption,
      isCorrect,
    });
  }

  return results;
}

export function evaluateOMRResult(params: {
  examId?: string;
  bookletSet: BookletSetCode;
  totalQuestions: number;
  marksPerCorrect: number;
  negativeMarks: number;
  passingMarks: number;
  responses: QuestionResponseResult[];
  answerKey: Record<number, OptionLetter>;
}): { evaluatedResponses: QuestionResponseResult[]; result: CalculatedOMRResult } {
  const {
    examId,
    bookletSet,
    totalQuestions,
    marksPerCorrect,
    negativeMarks,
    passingMarks,
    responses,
    answerKey,
  } = params;

  let attempted = 0;
  let blank = 0;
  let multiple = 0;
  let correct = 0;
  let wrong = 0;

  const evaluatedResponses: QuestionResponseResult[] = responses.map((item) => {
    const correctOption = answerKey[item.questionNumber];
    let isCorrect: boolean | undefined = undefined;

    if (item.selectedOption === 'BLANK') {
      blank++;
    } else if (item.selectedOption === 'MULTIPLE') {
      multiple++;
      if (correctOption) {
        wrong++;
        isCorrect = false;
      }
    } else {
      attempted++;
      if (correctOption) {
        isCorrect = item.selectedOption === correctOption;
        if (isCorrect) correct++;
        else wrong++;
      }
    }

    return {
      ...item,
      correctOption,
      isCorrect,
    };
  });

  const hasKey = Object.keys(answerKey).length > 0;
  const rawScore = hasKey
    ? correct * marksPerCorrect - wrong * negativeMarks
    : attempted * marksPerCorrect;
  const totalScore = Number(rawScore.toFixed(2));
  const maxMarks = Number((totalQuestions * marksPerCorrect).toFixed(2));
  const percentage = maxMarks > 0 ? Number(((totalScore / maxMarks) * 100).toFixed(2)) : 0;
  const passed = totalScore >= passingMarks;

  return {
    evaluatedResponses,
    result: {
      examId,
      bookletSet,
      totalQuestions,
      attempted,
      blank,
      multiple,
      correct,
      wrong,
      marksPerCorrect,
      negativeMarks,
      totalScore,
      maxMarks,
      percentage,
      passingMarks,
      passed,
      responses: evaluatedResponses,
      calculatedAt: new Date().toISOString(),
    },
  };
}

export function drawDetectionOverlay(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  corners: DetectedCorners | null,
  draggingKey: CornerKey | null,
  cornerOrder: { key: CornerKey; label: string }[]
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

  if (!corners) return;

  const pts = cornerOrder.map((c) => corners[c.key]);

  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  for (let i = 1; i < 4; i++) ctx.lineTo(pts[i].x, pts[i].y);
  ctx.closePath();
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = Math.max(3, width * 0.004);
  ctx.stroke();
  ctx.fillStyle = 'rgba(16, 185, 129, 0.14)';
  ctx.fill();

  cornerOrder.forEach(({ key, label }) => {
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
}

export function drawWarpedAnnotations(
  canvas: HTMLCanvasElement,
  width: number,
  height: number,
  roi: NormalizedRect,
  activeGridRoi: NormalizedRect,
  bResult: BookletDetectionResult | null,
  bOverride: OptionLetter | null,
  responses: QuestionResponseResult[],
  qCount: number,
  renderBubbles: boolean,
  revealGrading: boolean
) {
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.clearRect(0, 0, width, height);

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

  if (renderBubbles && responses.length > 0) {
    const responseMap = new Map<number, QuestionResponseResult>();
    responses.forEach((r) => responseMap.set(r.questionNumber, r));

    const bubbles = getQuestionBubbleGeometry(qCount, width, height, activeGridRoi);
    for (const b of bubbles) {
      const res = responseMap.get(b.questionNumber);
      if (!res) continue;

      const isMarkedOption = res.selectedOption === b.option;
      const isMultipleBubble =
        res.selectedOption === 'MULTIPLE' && res.fillRatios[b.option] >= 0.36;
      const isCorrectHint =
        revealGrading && res.correctOption === b.option && res.isCorrect === false;

      if (isMarkedOption) {
        const strokeColor = !revealGrading
          ? '#4f46e5'
          : res.isCorrect === false
          ? '#ef4444'
          : '#10b981';
        const fillColor = !revealGrading
          ? 'rgba(79, 70, 229, 0.28)'
          : res.isCorrect === false
          ? 'rgba(239, 68, 68, 0.32)'
          : 'rgba(16, 185, 129, 0.32)';
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
}