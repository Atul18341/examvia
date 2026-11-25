// components/OMRScanner.tsx
'use client';

import React, { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { db, type StudentRecord as DbStudentRecord } from '@/lib/db';
import {
  CORNER_ORDER,
  DEFAULT_BOOKLET_ROI,
  DEFAULT_RESPONSE_GRID_ROI,
  type AnswerKeyMap,
  type BookletDetectionResult,
  type BookletSetCode,
  type CalculatedOMRResult,
  type CornerKey,
  type DetectedCorners,
  type NormalizedRect,
  type OMRScannerProps,
  type OptionLetter,
  type Point,
  type PresentStudentOption,
  type QuestionResponseResult,
  type QuestionStatus,
} from './omr-scanner/types';
import {
  normalizeAnswerMap,
  extractAnswersFromQuestions,
  resolveSetAnswerKeyFromRecord,
  parseAnswerKeyInput,
} from './omr-scanner/answerKeyUtils';
import {
  binarizeImage,
  findCornerMarkers,
  warpPerspective,
  detectBookletSet,
  screenToCanvasCoords,
} from './omr-scanner/geometryAndWarp';
import {
  detectQuestionResponses,
  evaluateOMRResult,
  drawDetectionOverlay,
  drawWarpedAnnotations,
} from './omr-scanner/graderAndCanvas';
import ScannerConfigBar from './omr-scanner/ScannerConfigBar';
import CaptureViewport from './omr-scanner/captureViewPort';
import ResponseVerificationPanel from './omr-scanner/ResponseVerificationPanel';
import ResultMappingSection from './omr-scanner/ResultMappingSection';

export { normalizeAnswerMap, extractAnswersFromQuestions };
export type {
  Point,
  DetectedCorners,
  NormalizedRect,
  OptionLetter,
  BookletSetCode,
  QuestionStatus,
  BookletDetectionResult,
  QuestionResponseResult,
  CalculatedOMRResult,
  
  PresentStudentOption,
};

export default function OMRScanner({
  examId,
  defaultTotalQuestions = 100,
  answerKey,
  students: externalStudents,
  onScanComplete,
  onResultCalculated,
  onStudentMapped,
}: OMRScannerProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const captureCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpedCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const warpedOverlayRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const bottomResultRef = useRef<HTMLDivElement | null>(null);
  const dragRoiOffsetRef = useRef<Point>({ x: 0, y: 0 });

  const [streamActive, setStreamActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [detectedCorners, setDetectedCorners] = useState<DetectedCorners | null>(null);
  const [activeDragCorner, setActiveDragCorner] = useState<CornerKey | null>(null);

  // Exam blueprint & marking scheme loaded strictly from db.exams
  const [examTitle, setExamTitle] = useState<string>('');
  const [totalQuestions, setTotalQuestions] = useState<number>(defaultTotalQuestions);
  const [marksPerCorrect, setMarksPerCorrect] = useState<number>(1);
  const [negativeMarks, setNegativeMarks] = useState<number>(0);
  const [passingMarks, setPassingMarks] = useState<number>(Math.ceil(defaultTotalQuestions * 0.4));

  const [activeAnswerKey, setActiveAnswerKey] = useState<AnswerKeyMap>(answerKey || {});
  const [keySourceLabel, setKeySourceLabel] = useState<string>('Default');
  const [manualSetKeys, setManualSetKeys] = useState<
    Partial<Record<OptionLetter | 'DEFAULT', AnswerKeyMap>>
  >({});
  const [answerKeyText, setAnswerKeyText] = useState<string>('');
  const [showKeyEditor, setShowKeyEditor] = useState<boolean>(false);

  const [bookletRoi, setBookletRoi] = useState<NormalizedRect>(DEFAULT_BOOKLET_ROI);
  const [gridRoi, setGridRoi] = useState<NormalizedRect>(DEFAULT_RESPONSE_GRID_ROI);
  const [isDraggingBookletRoi, setIsDraggingBookletRoi] = useState(false);
  const [bookletResult, setBookletResult] = useState<BookletDetectionResult | null>(null);
  const [manualBookletOverride, setManualBookletOverride] = useState<OptionLetter | null>(null);

  const [questionResponses, setQuestionResponses] = useState<QuestionResponseResult[]>([]);
  const [calculatedResult, setCalculatedResult] = useState<CalculatedOMRResult | null>(null);
  const [showBubbleOverlay, setShowBubbleOverlay] = useState<boolean>(true);

  const [presentStudents, setPresentStudents] = useState<PresentStudentOption[]>([]);
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [allowRemapExisting, setAllowRemapExisting] = useState<boolean>(false);
  const [omrSerialNo, setOmrSerialNo] = useState<string>('');
  const [isMappingResult, setIsMappingResult] = useState<boolean>(false);
  const [mapNotice, setMapNotice] = useState<{
    type: 'success' | 'error';
    message: string;
  } | null>(null);

  const [statusMessage, setStatusMessage] = useState<string>(
    'Align all 4 black corner squares or upload an OMR image.'
  );
  const [isProcessing, setIsProcessing] = useState(false);

  const activeBookletSet: BookletSetCode =
    manualBookletOverride ?? bookletResult?.detectedSet ?? 'BLANK';
  const isResultRevealed = calculatedResult !== null;

  const loadPresentStudents = useCallback(async () => {
    if (externalStudents) {
      setPresentStudents(
        externalStudents.filter((s) => s.attendance === 'present' || s.checkedIn !== false)
      );
      return;
    }

    try {
      const records = examId
        ? await db.studentRecords.where('examId').equals(examId).toArray()
        : await db.studentRecords.toArray();
      const extended = records as PresentStudentOption[];
      setPresentStudents(
        extended.filter((s) => s.attendance === 'present' || Boolean(s.checkedIn))
      );
    } catch (err) {
      console.error('Failed to load present students for result mapping:', err);
    }
  }, [examId, externalStudents]);

  useEffect(() => {
    loadPresentStudents();
  }, [loadPresentStudents]);

  const unmappedPresentCount = useMemo(
    () => presentStudents.filter((s) => !s.omrScanned).length,
    [presentStudents]
  );

  const selectedStudent = useMemo(
    () => presentStudents.find((s) => s.id === selectedStudentId) || null,
    [presentStudents, selectedStudentId]
  );

  useEffect(() => {
    let isCancelled = false;

    async function fetchExamConfigAndSetAnswersFromLocalDb() {
      if (!examId) return;

      try {
        const record: any = await db.exams.get(examId);
        if (isCancelled || !record) return;

        const dbTitle =
          typeof record.examTitle === 'string' && record.examTitle.trim()
            ? record.examTitle.trim()
            : '';
        const dbTotalQuestions =
          typeof record.totalQuestions === 'number' && record.totalQuestions > 0
            ? record.totalQuestions
            : defaultTotalQuestions;
        const dbMarksPerCorrect =
          typeof record.marksPerCorrect === 'number'
            ? record.marksPerCorrect
            : typeof record.positiveMarkValue === 'number'
            ? record.positiveMarkValue
            : 1;
        const dbNegativeMarks = record.enableNegativeMarking
          ? Math.max(0, Number(record.negativeMarkValue ?? 0) || 0)
          : Math.max(0, Number(record.negativeMarkValue ?? 0) || 0);
        const dbPassingMarks =
          typeof record.passingMarks === 'number'
            ? record.passingMarks
            : Math.ceil(dbTotalQuestions * dbMarksPerCorrect * 0.4);

        setExamTitle(dbTitle);
        setTotalQuestions(dbTotalQuestions);
        setMarksPerCorrect(dbMarksPerCorrect);
        setNegativeMarks(dbNegativeMarks);
        setPassingMarks(dbPassingMarks);

        const isSetLetter =
          activeBookletSet === 'A' ||
          activeBookletSet === 'B' ||
          activeBookletSet === 'C' ||
          activeBookletSet === 'D';

        if (isSetLetter && manualSetKeys[activeBookletSet]) {
          setActiveAnswerKey(manualSetKeys[activeBookletSet]!);
          setKeySourceLabel(`Set ${activeBookletSet} (Manual)`);
          return;
        }
        if (!isSetLetter && manualSetKeys.DEFAULT) {
          setActiveAnswerKey(manualSetKeys.DEFAULT);
          setKeySourceLabel('Manual Key');
          return;
        }
        if (answerKey && Object.keys(answerKey).length > 0) {
          setActiveAnswerKey(answerKey);
          setKeySourceLabel('Prop Key');
          return;
        }

        const { keyMap, sourceLabel } = resolveSetAnswerKeyFromRecord(record, activeBookletSet);
        setActiveAnswerKey(keyMap);
        setKeySourceLabel(sourceLabel);
      } catch (err) {
        console.error('Failed to load exam config and set answer key from IndexedDB:', err);
      }
    }

    fetchExamConfigAndSetAnswersFromLocalDb();
    return () => {
      isCancelled = true;
    };
  }, [examId, defaultTotalQuestions, activeBookletSet, answerKey, manualSetKeys]);

  const startCamera = useCallback(async (mode: 'environment' | 'user') => {
    setCameraError(null);
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
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
      setCameraError(
        'Camera unavailable. Use the "Upload Image" button below to select an OMR photo from your device.'
      );
      setStreamActive(false);
    }
  }, []);

  useEffect(() => {
    if (!capturedImage) startCamera(facingMode);
    return () => {
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream).getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode, capturedImage, startCamera]);

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
      activeDragCorner,
      CORNER_ORDER
    );

    if (detectedCorners && warpedCanvas) {
      warpPerspective(srcCanvas, warpedCanvas, detectedCorners);
      const bResult = detectBookletSet(warpedCanvas, bookletRoi);
      setBookletResult(bResult);

      const qResults = detectQuestionResponses(warpedCanvas, totalQuestions, gridRoi, activeAnswerKey);
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
          showBubbleOverlay,
          isResultRevealed
        );
      }

      const activeSet: BookletSetCode = manualBookletOverride ?? bResult.detectedSet;
      let attempted = 0;
      let blank = 0;
      let multiple = 0;
      let correct = 0;
      let wrong = 0;

      for (const r of qResults) {
        if (r.selectedOption === 'BLANK') blank++;
        else if (r.selectedOption === 'MULTIPLE') {
          multiple++;
          if (r.isCorrect === false) wrong++;
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
    activeAnswerKey,
    showBubbleOverlay,
    isResultRevealed,
    examId,
    onScanComplete,
  ]);

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!detectedCorners || !overlayCanvasRef.current) return;
    const pt = screenToCanvasCoords(overlayCanvasRef.current, e.clientX, e.clientY);
    if (!pt) return;

    const hitRadius = Math.max(36, overlayCanvasRef.current.width * 0.06);
    let closestKey: CornerKey | null = null;
    let minDistance = hitRadius;

    for (const { key } of CORNER_ORDER) {
      const dist = Math.hypot(pt.x - detectedCorners[key].x, pt.y - detectedCorners[key].y);
      if (dist <= minDistance) {
        minDistance = dist;
        closestKey = key;
      }
    }

    if (closestKey) {
      e.currentTarget.setPointerCapture(e.pointerId);
      setActiveDragCorner(closestKey);
      setManualBookletOverride(null);
      setCalculatedResult(null);
      setMapNotice(null);
      setStatusMessage(`Adjusting ${closestKey.replace(/([A-Z])/g, ' $1').toUpperCase()} corner...`);
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragCorner || !detectedCorners) return;
    const pt = screenToCanvasCoords(overlayCanvasRef.current, e.clientX, e.clientY);
    if (!pt) return;
    setDetectedCorners((prev) => (prev ? { ...prev, [activeDragCorner]: pt } : null));
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!activeDragCorner) return;
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setActiveDragCorner(null);
    setStatusMessage('Corner updated! Scroll down and click "Calculate Result" to grade.');
  };

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
      setCalculatedResult(null);
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
    setCalculatedResult(null);
    setQuestionResponses((prev) => {
      const updated = prev.map((item) => {
        if (item.questionNumber !== qNum) return item;
        const correctOpt = activeAnswerKey[qNum];
        const isCorrect =
          correctOpt && (newOption === 'A' || newOption === 'B' || newOption === 'C' || newOption === 'D')
            ? newOption === correctOpt
            : undefined;
        return { ...item, selectedOption: newOption, correctOption: correctOpt, isCorrect };
      });

      if (warpedCanvasRef.current && warpedOverlayRef.current) {
        drawWarpedAnnotations(
          warpedOverlayRef.current,
          warpedCanvasRef.current.width,
          warpedCanvasRef.current.height,
          bookletRoi,
          gridRoi,
          bookletResult,
          manualBookletOverride,
          updated,
          totalQuestions,
          showBubbleOverlay,
          false
        );
      }

      return updated;
    });
  };

  const handleCalculateResult = () => {
    if (questionResponses.length === 0) {
      setStatusMessage('No scanned responses found. Capture or upload an OMR sheet first.');
      return;
    }

    const activeSet: BookletSetCode = manualBookletOverride ?? bookletResult?.detectedSet ?? 'BLANK';
    const { evaluatedResponses, result: finalResult } = evaluateOMRResult({
      examId,
      bookletSet: activeSet,
      totalQuestions,
      marksPerCorrect,
      negativeMarks,
      passingMarks,
      responses: questionResponses,
      answerKey: activeAnswerKey,
    });

    setQuestionResponses(evaluatedResponses);
    setCalculatedResult(finalResult);

    if (warpedCanvasRef.current && warpedOverlayRef.current) {
      drawWarpedAnnotations(
        warpedOverlayRef.current,
        warpedCanvasRef.current.width,
        warpedCanvasRef.current.height,
        bookletRoi,
        gridRoi,
        bookletResult,
        manualBookletOverride,
        evaluatedResponses,
        totalQuestions,
        showBubbleOverlay,
        true
      );
    }

    const hasKey = Object.keys(activeAnswerKey).length > 0;
    setStatusMessage(
      hasKey
        ? `Result (${keySourceLabel}): ${finalResult.correct} Correct, ${finalResult.wrong} Wrong — Score ${finalResult.totalScore}/${finalResult.maxMarks} (${finalResult.percentage}%)`
        : `Responses Tallied: ${finalResult.attempted} Attempted, ${finalResult.blank} Blank, ${finalResult.multiple} Multiple (No answer key found for Set ${activeSet})`
    );

    onResultCalculated?.(finalResult, warpedCanvasRef.current);

    requestAnimationFrame(() => {
      bottomResultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    });
  };

  const handleMapResultToStudent = async () => {
    setMapNotice(null);

    if (!calculatedResult) {
      setMapNotice({ type: 'error', message: 'Please click "Calculate Result" first before mapping.' });
      return;
    }
    if (!selectedStudent) {
      setMapNotice({ type: 'error', message: 'Please select a present student from the dropdown first.' });
      return;
    }
    if (selectedStudent.omrScanned && !allowRemapExisting) {
      setMapNotice({
        type: 'error',
        message: `Roll ${selectedStudent.rollNo} (${selectedStudent.name}) is already mapped. Enable "Allow Re-map" to overwrite.`,
      });
      return;
    }

    const cleanSerial = omrSerialNo.trim();
    if (cleanSerial) {
      const duplicate = presentStudents.find(
        (s) =>
          s.id !== selectedStudent.id &&
          s.omrSerialNo &&
          s.omrSerialNo.toLowerCase() === cleanSerial.toLowerCase()
      );
      if (duplicate) {
        setMapNotice({
          type: 'error',
          message: `OMR Serial "${cleanSerial}" is already mapped to Roll ${duplicate.rollNo} (${duplicate.name}).`,
        });
        return;
      }
    }

    setIsMappingResult(true);

    try {
      const warpedCanvas = warpedCanvasRef.current;
      const omrImageUrl = warpedCanvas
        ? warpedCanvas.toDataURL('image/jpeg', 0.9)
        : selectedStudent.omrImageUrl;
      const omrBlob = warpedCanvas
        ? await new Promise<Blob | undefined>((resolve) =>
            warpedCanvas.toBlob((blob) => resolve(blob ?? undefined), 'image/jpeg', 0.9)
          )
        : selectedStudent.omrBlob;

      const resolvedBookletSet =
        activeBookletSet === 'A' ||
        activeBookletSet === 'B' ||
        activeBookletSet === 'C' ||
        activeBookletSet === 'D'
          ? activeBookletSet
          : selectedStudent.bookletSet;

      const updatedStudent: PresentStudentOption = {
        ...selectedStudent,
        attendance: 'present',
        checkedIn: true,
        omrScanned: true,
        bookletSet: resolvedBookletSet,
        omrSerialNo: cleanSerial || selectedStudent.omrSerialNo,
        omrImageUrl,
        omrBlob,
        marksScored: calculatedResult.totalScore,
        maxMarks: calculatedResult.maxMarks,
        passed: calculatedResult.passed,
        syncStatus: 'pending',
      };

      await db.studentRecords.put(updatedStudent as DbStudentRecord);

      const nextStudents = presentStudents.map((s) => (s.id === updatedStudent.id ? updatedStudent : s));
      setPresentStudents(nextStudents);

      const nextUnmapped = nextStudents.find((s) => !s.omrScanned);
      setSelectedStudentId(nextUnmapped ? nextUnmapped.id : '');
      setOmrSerialNo('');

      setMapNotice({
        type: 'success',
        message: `Result mapped to Roll ${updatedStudent.rollNo} — ${updatedStudent.name} (${calculatedResult.totalScore}/${calculatedResult.maxMarks} • ${calculatedResult.passed ? 'PASSED' : 'FAILED'}).${
          nextUnmapped ? ` Next unmapped: Roll ${nextUnmapped.rollNo} (${nextUnmapped.name}).` : ' All present students mapped!'
        }`,
      });

      onStudentMapped?.(updatedStudent, calculatedResult, warpedCanvas);
    } catch (err) {
      console.error('Failed to map result to student:', err);
      setMapNotice({ type: 'error', message: 'Failed to save student result mapping to local database.' });
    } finally {
      setIsMappingResult(false);
    }
  };

  const handleApplyAnswerKey = () => {
    const parsed = parseAnswerKeyInput(answerKeyText, totalQuestions);
    const setTarget: OptionLetter | 'DEFAULT' =
      activeBookletSet === 'A' ||
      activeBookletSet === 'B' ||
      activeBookletSet === 'C' ||
      activeBookletSet === 'D'
        ? activeBookletSet
        : 'DEFAULT';

    setManualSetKeys((prev) => ({ ...prev, [setTarget]: parsed }));
    setActiveAnswerKey(parsed);
    setKeySourceLabel(setTarget === 'DEFAULT' ? 'Manual Key' : `Set ${setTarget} (Manual)`);
    setCalculatedResult(null);
    setShowKeyEditor(false);
    setStatusMessage(
      `Loaded ${Object.keys(parsed).length} answer key entries for ${
        setTarget === 'DEFAULT' ? 'Default' : `Set ${setTarget}`
      }.`
    );
  };

  const handleSetManualCorners = () => {
    const srcCanvas = captureCanvasRef.current;
    if (!srcCanvas) return;
    const { width: w, height: h } = srcCanvas;

    setManualBookletOverride(null);
    setCalculatedResult(null);
    setMapNotice(null);
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
    setCalculatedResult(null);
    setMapNotice(null);
    setStatusMessage('Detecting 4 corner boxes, Booklet Set, & Question Responses...');

    requestAnimationFrame(() => {
      const { width: w, height: h } = srcCanvas;
      const imgData = srcCanvas.getContext('2d')!.getImageData(0, 0, w, h);
      const binary = binarizeImage(imgData, 0.85);
      const corners = findCornerMarkers(binary, w, h);

      if (corners) {
        setDetectedCorners(corners);
        setStatusMessage(
          'Sheet locked! Verify detected bubbles below and click "Calculate Result" at the bottom.'
        );
      } else {
        setDetectedCorners(null);
        setBookletResult(null);
        setQuestionResponses([]);
        if (overlayCanvasRef.current) {
          drawDetectionOverlay(overlayCanvasRef.current, w, h, null, null, CORNER_ORDER);
        }
        setStatusMessage(
          'Auto-detection missed a corner. Click "Set Corners Manually" or upload/retake another image.'
        );
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
    canvas.getContext('2d')!.drawImage(video, 0, 0, canvas.width, canvas.height);

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
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);

        setCapturedImage(canvas.toDataURL('image/jpeg', 0.95));
        processCapturedFrame(canvas);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setUploadedFileName(null);
    setDetectedCorners(null);
    setBookletResult(null);
    setQuestionResponses([]);
    setCalculatedResult(null);
    setManualBookletOverride(null);
    setActiveDragCorner(null);
    setMapNotice(null);
    setBookletRoi(DEFAULT_BOOKLET_ROI);
    setGridRoi(DEFAULT_RESPONSE_GRID_ROI);
    setStatusMessage('Align all 4 black corner squares or upload an OMR image.');
    if (overlayCanvasRef.current) {
      overlayCanvasRef.current
        .getContext('2d')
        ?.clearRect(0, 0, overlayCanvasRef.current.width, overlayCanvasRef.current.height);
    }
  };

  const handleNextScan = () => {
    handleRetake();
    setSelectedStudentId('');
    setOmrSerialNo('');
    setAllowRemapExisting(false);
    setShowKeyEditor(false);
    loadPresentStudents();

    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      window.location.reload();
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Examvia OMR Optical Scanner &amp; Grader</h2>
        <p style={styles.subtitle}>{statusMessage}</p>

        <ScannerConfigBar
          examTitle={examTitle}
          totalQuestions={totalQuestions}
          marksPerCorrect={marksPerCorrect}
          negativeMarks={negativeMarks}
          passingMarks={passingMarks}
          keySourceLabel={keySourceLabel}
          keyEntriesCount={Object.keys(activeAnswerKey).length}
          showKeyEditor={showKeyEditor}
          answerKeyText={answerKeyText}
          activeBookletSet={activeBookletSet}
          onToggleKeyEditor={() => setShowKeyEditor((prev) => !prev)}
          onChangeAnswerKeyText={setAnswerKeyText}
          onApplyAnswerKey={handleApplyAnswerKey}
        />

        <CaptureViewport
          videoRef={videoRef}
          captureCanvasRef={captureCanvasRef}
          overlayCanvasRef={overlayCanvasRef}
          fileInputRef={fileInputRef}
          capturedImage={capturedImage}
          uploadedFileName={uploadedFileName}
          isDraggingFile={isDraggingFile}
          streamActive={streamActive}
          cameraError={cameraError}
          isProcessing={isProcessing}
          detectedCorners={detectedCorners}
          activeDragCorner={activeDragCorner}
          onDragOverChange={setIsDraggingFile}
          onDropFile={loadImageFile}
          onFileSelected={loadImageFile}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onCapturePhoto={handleCapturePhoto}
          onSwitchCamera={() =>
            setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'))
          }
          onRetake={handleRetake}
          onReDetectAuto={() =>
            captureCanvasRef.current && processCapturedFrame(captureCanvasRef.current)
          }
          onSetManualCorners={handleSetManualCorners}
        />

        {detectedCorners && (
          <div style={styles.resultsSection}>
            <ResponseVerificationPanel
              warpedCanvasRef={warpedCanvasRef}
              warpedOverlayRef={warpedOverlayRef}
              activeBookletSet={activeBookletSet}
              bookletResult={bookletResult}
              totalQuestions={totalQuestions}
              questionResponses={questionResponses}
              keySourceLabel={keySourceLabel}
              keyEntriesCount={Object.keys(activeAnswerKey).length}
              showBubbleOverlay={showBubbleOverlay}
              isResultRevealed={isResultRevealed}
              isDraggingBookletRoi={isDraggingBookletRoi}
              onSelectBookletOverride={(opt) => {
                setManualBookletOverride(opt);
                setCalculatedResult(null);
              }}
              onNudgeGridY={(delta) =>
                setGridRoi((prev) => ({
                  ...prev,
                  y: Math.max(0.2, Math.min(0.29, +(prev.y + delta).toFixed(4))),
                }))
              }
              onToggleBubbleOverlay={() => setShowBubbleOverlay((prev) => !prev)}
              onBookletRoiPointerDown={handleBookletRoiPointerDown}
              onBookletRoiPointerMove={handleBookletRoiPointerMove}
              onBookletRoiPointerUp={handleBookletRoiPointerUp}
              onManualResponseChange={handleManualResponseChange}
            />

            <ResultMappingSection
              bottomResultRef={bottomResultRef}
              calculatedResult={calculatedResult}
              presentStudents={presentStudents}
              unmappedPresentCount={unmappedPresentCount}
              selectedStudent={selectedStudent}
              selectedStudentId={selectedStudentId}
              allowRemapExisting={allowRemapExisting}
              omrSerialNo={omrSerialNo}
              isMappingResult={isMappingResult}
              mapNotice={mapNotice}
              onCalculateResult={handleCalculateResult}
              onChangeAllowRemap={setAllowRemapExisting}
              onSelectStudentId={(nextId) => {
                setSelectedStudentId(nextId);
                setMapNotice(null);
                const found = presentStudents.find((s) => s.id === nextId);
                if (found?.omrSerialNo) setOmrSerialNo(found.omrSerialNo);
              }}
              onChangeOmrSerialNo={setOmrSerialNo}
              onMapResultToStudent={handleMapResultToStudent}
              onNextScan={handleNextScan}
            />
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
  resultsSection: {
    marginTop: '20px',
    paddingTop: '16px',
    borderTop: '1px solid #e2e8f0',
  },
};