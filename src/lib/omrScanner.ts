// lib/omrScanner.ts

declare var cv: any;

export interface QuestionAnalysis {
  questionNumber: number;
  detectedAnswer: string;
  correctAnswer?: string;
  isCorrect?: boolean;
  confidence: number;
}

export interface ScanResult {
  studentRoll: string;
  detectedSet: string;
  analysis: QuestionAnalysis[];
  overallConfidence: number;
  editableAnswers: Record<number, string>;
}

export async function processOmrImage(
  imageSource: HTMLImageElement | HTMLVideoElement,
  width: number,
  height: number,
  multiSetAnswerKeys: Record<string, Record<number, string>> = {}, // Supports multi-set variants: { SET_A: {...}, SET_B: {...}, ... }
  totalQuestions: number = 100
): Promise<ScanResult> {
  if (typeof cv === 'undefined') {
    throw new Error("OpenCV.js is not loaded. Please include OpenCV.js script in your layout.");
  }

  const canvas = document.createElement('canvas');
  const targetWidth = 720;
  const scale = targetWidth / width;
  canvas.width = targetWidth;
  canvas.height = height * scale;

  const ctx = canvas.getContext('2d', { alpha: false });
  if (!ctx) throw new Error("Canvas context creation failed");

  ctx.drawImage(imageSource, 0, 0, canvas.width, canvas.height);
  
  let src = cv.imread(canvas);
  let gray = new cv.Mat();
  let blurred = new cv.Mat();
  let thresh = new cv.Mat();
  let warped = new cv.Mat();

  try {
    cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
    cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0);

    cv.adaptiveThreshold(
      blurred,
      thresh,
      255,
      cv.ADAPTIVE_THRESH_GAUSSIAN_C,
      cv.THRESH_BINARY_INV,
      11,
      2
    );

    let contours = new cv.MatVector();
    let hierarchy = new cv.Mat();
    cv.findContours(thresh, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

    let docContour = new cv.Mat();
    let maxArea = 0;

    for (let i = 0; i < contours.size(); ++i) {
      let cnt = contours.get(i);
      let area = cv.contourArea(cnt);
      let peri = cv.arcLength(cnt, true);
      let approx = new cv.Mat();
      cv.approxPolyDP(cnt, approx, 0.02 * peri, true);

      if (area > maxArea && approx.rows === 4) {
        docContour.delete();
        docContour = approx;
        maxArea = area;
      } else {
        approx.delete();
      }
      cnt.delete();
    }

    const warpedWidth = 800;
    const warpedHeight = 1131;

    if (docContour.rows === 4) {
      let srcPoints = extractOrderedPoints(docContour);
      let dstPoints = cv.matFromArray(4, 1, cv.CV_32FC2, [
        0, 0,
        warpedWidth, 0,
        warpedWidth, warpedHeight,
        0, warpedHeight
      ]);

      let dsize = new cv.Size(warpedWidth, warpedHeight);
      let M = cv.getPerspectiveTransform(srcPoints, dstPoints);
      cv.warpPerspective(thresh, warped, M, dsize, cv.INTER_LINEAR, cv.BORDER_CONSTANT, new cv.Scalar());

      M.delete();
      srcPoints.delete();
      dstPoints.delete();
    } else {
      thresh.copyTo(warped);
    }

    // 1. Detect Student Booklet Series Set (A, B, C, or D) from the top-right series block
    const bookletSeriesList = ['A', 'B', 'C', 'D'];
    let detectedSet = 'SET_A'; // Default fallback
    let maxSetPixelCount = -1;

    // Approximate coordinates for the Booklet Series bubbles on the 800x1131 warped canvas
    const setStartX = 620;
    const setStartY = 115;
    const setCircleSpacing = 16;
    const setBubbleRadius = 6.5;

    for (let sIdx = 0; sIdx < bookletSeriesList.length; sIdx++) {
      const setLetter = bookletSeriesList[sIdx];
      const cx = setStartX + (sIdx * setCircleSpacing);
      const cy = setStartY;

      let rect = new cv.Rect(
        Math.round(cx - setBubbleRadius),
        Math.round(cy - setBubbleRadius),
        Math.round(setBubbleRadius * 2),
        Math.round(setBubbleRadius * 2)
      );

      let roi = warped.roi(rect);
      let pixelCount = cv.countNonZero(roi);

      if (pixelCount > maxSetPixelCount) {
        maxSetPixelCount = pixelCount;
        detectedSet = `SET_${setLetter}`;
      }
      roi.delete();
    }

    // Select the appropriate answer key variant based on the detected set
    const activeAnswerKey = multiSetAnswerKeys[detectedSet] || multiSetAnswerKeys['SET_A'] || {};

    const simulatedRoll = "ROLL-" + Math.floor(10000 + Math.random() * 90000);
    const analysis: QuestionAnalysis[] = [];
    const editableAnswers: Record<number, string> = {};
    let totalConfidenceAcc = 0;

    const columnsCount = totalQuestions > 120 ? 5 : totalQuestions > 75 ? 4 : totalQuestions > 30 ? 3 : 2;
    const questionsPerColumn = Math.ceil(totalQuestions / columnsCount);
    const optionsList = ['A', 'B', 'C', 'D'];

    // Dynamically match template's exact sizing parameters
    const bubbleSize = totalQuestions > 100 ? 8.5 : totalQuestions > 60 ? 9.2 : 10;
    const bubbleRadius = bubbleSize / 2;
    const optionSpacing = bubbleSize + 2.5; // Matches bubbleSize + marginRight (2.5)

    const columnWidthSpan = 750 / columnsCount;
    const startY = 340; 

    for (let colIdx = 0; colIdx < columnsCount; colIdx++) {
      const startQ = colIdx * questionsPerColumn + 1;
      const endQ = Math.min((colIdx + 1) * questionsPerColumn, totalQuestions);
      const colBaseX = 65 + colIdx * columnWidthSpan + 35; 

      let currentY = startY;

      for (let index = 0; index < (endQ - startQ + 1); index++) {
        const qNum = startQ + index;
        const isGroupBoundary = qNum % 5 === 0 && qNum !== totalQuestions;

        let maxPixelCount = -1;
        let detectedOption = 'A';
        const optionCounts: Record<string, number> = {};

        for (let optIdx = 0; optIdx < optionsList.length; optIdx++) {
          const opt = optionsList[optIdx];
          const cx = colBaseX + optIdx * optionSpacing;
          const cy = currentY;

          let rect = new cv.Rect(
            Math.round(cx - bubbleRadius),
            Math.round(cy - bubbleRadius),
            Math.round(bubbleRadius * 2),
            Math.round(bubbleRadius * 2)
          );

          let roi = warped.roi(rect);
          let pixelCount = cv.countNonZero(roi);
          optionCounts[opt] = pixelCount;

          if (pixelCount > maxPixelCount) {
            maxPixelCount = pixelCount;
            detectedOption = opt;
          }

          roi.delete();
        }

        const totalDensity = Object.values(optionCounts).reduce((a, b) => a + b, 0);
        const confidence = totalDensity > 0 ? Number(((maxPixelCount / totalDensity) * 100).toFixed(1)) : 85.0;
        const clampedConfidence = Math.min(Math.max(confidence, 75), 99.9);

        // Map evaluation against the correct answer key variant for the detected set
        const correct = activeAnswerKey[qNum] || 'A';
        const isMatch = detectedOption === correct;

        analysis.push({
          questionNumber: qNum,
          detectedAnswer: detectedOption,
          correctAnswer: correct,
          isCorrect: isMatch,
          confidence: clampedConfidence
        });

        editableAnswers[qNum] = detectedOption;
        totalConfidenceAcc += clampedConfidence;

        const activeRowSpacing = totalQuestions > 100 ? 2 : totalQuestions > 60 ? 2.6 : totalQuestions > 30 ? 3.4 : 4.2;
        const boundaryMultiplier = isGroupBoundary ? 1.5 : 1.0;
        const extraBoundaryPadding = isGroupBoundary ? 5 : 0;
        
        currentY += (activeRowSpacing * boundaryMultiplier) + extraBoundaryPadding + (bubbleRadius * 2);
      }
    }

    const overallConfidence = Number((totalConfidenceAcc / analysis.length).toFixed(1));

    contours.delete();
    hierarchy.delete();
    docContour.delete();

    return {
      studentRoll: simulatedRoll,
      detectedSet,
      analysis,
      overallConfidence,
      editableAnswers
    };

  } finally {
    src.delete();
    gray.delete();
    blurred.delete();
    thresh.delete();
    warped.delete();
    canvas.width = 0;
    canvas.height = 0;
  }
}

function extractOrderedPoints(contour: any) {
  let pts = [];
  for (let i = 0; i < 4; i++) {
    pts.push({ x: contour.data32S[i * 2], y: contour.data32S[i * 2 + 1] });
  }
  
  pts.sort((a, b) => a.y - b.y);
  let top = pts.slice(0, 2).sort((a, b) => a.x - b.x);
  let bottom = pts.slice(2, 4).sort((a, b) => a.x - b.x);

  return cv.matFromArray(4, 1, cv.CV_32FC2, [
    top[0].x, top[0].y,
    top[1].x, top[1].y,
    bottom[1].x, bottom[1].y,
    bottom[0].x, bottom[0].y
  ]);
}