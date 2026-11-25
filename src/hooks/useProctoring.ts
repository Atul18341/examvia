// hooks/useProctoring.ts
import { useState, useEffect, useRef } from 'react';
import { FilesetResolver, FaceDetector } from '@mediapipe/tasks-vision';

interface UseProctoringProps {
  hasStarted: boolean;
  onTerminate: (reason: 'absence' | 'integrity') => void;
}

export function useProctoring({ hasStarted, onTerminate }: UseProctoringProps) {
  const [integrityScore, setIntegrityScore] = useState<number>(100);
  const [infractionMessage, setInfractionMessage] = useState<string | null>(null);
  const [faceMissing, setFaceMissing] = useState(false);
  const [multipleFaces, setMultipleFaces] = useState(false);
  const [mediaStream, setMediaStream] = useState<MediaStream | null>(null);
  const [webcamActive, setWebcamActive] = useState(false);

  const infractionCountRef = useRef<number>(0);
  const consecutiveMissingRef = useRef<number>(0);
  const lastPenaltyTimeRef = useRef<number>(0);
  const terminatedRef = useRef<boolean>(false);
  const currentScoreRef = useRef<number>(100);

  const hiddenVideoRef = useRef<HTMLVideoElement | null>(null);
  const mobileVideoRef = useRef<HTMLVideoElement | null>(null);
  const desktopVideoRef = useRef<HTMLVideoElement | null>(null);

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { width: 320, height: 240, facingMode: 'user' } 
      });
      setMediaStream(stream);
      setWebcamActive(true);
    } catch (err) {
      console.warn('Webcam permission denied or unavailable:', err);
      recordInfraction('Webcam stream unavailable or blocked.');
    }
  };

  useEffect(() => {
    if (!mediaStream) return;
    [hiddenVideoRef.current, mobileVideoRef.current, desktopVideoRef.current].forEach((videoElem) => {
      if (videoElem && videoElem.srcObject !== mediaStream) {
        videoElem.srcObject = mediaStream;
        videoElem.play().catch((e) => console.warn('Video play restricted:', e));
      }
    });
  }, [mediaStream, hasStarted]);

  const recordInfraction = (reason: string) => {
    if (terminatedRef.current) return;
    infractionCountRef.current += 1;

    currentScoreRef.current = Math.max(0, currentScoreRef.current - 15);
    const updatedScore = currentScoreRef.current;

    setIntegrityScore(updatedScore);
    setInfractionMessage(`Warning #${infractionCountRef.current}: ${reason} (-15% Integrity)`);

    // Terminated due to 0% integrity score
    if (updatedScore <= 0 && !terminatedRef.current) {
      terminatedRef.current = true;
      onTerminate('integrity');
      return;
    }

    setTimeout(() => {
      setInfractionMessage(null);
    }, 5000);
  };

  // MediaPipe AI Loop
  useEffect(() => {
    if (!hasStarted || !webcamActive || terminatedRef.current) return;

    let faceDetector: FaceDetector | null = null;
    let aiInterval: NodeJS.Timeout;

    async function initAI() {
      try {
        const vision = await FilesetResolver.forVisionTasks(
          "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm"
        );
        faceDetector = await FaceDetector.createFromOptions(vision, {
          baseOptions: {
            modelAssetPath: "https://storage.googleapis.com/mediapipe-models/face_detector/blaze_face_short_range/float16/1/blaze_face_short_range.tflite",
            delegate: "GPU"
          },
          runningMode: "VIDEO",
          minDetectionConfidence: 0.5
        });

        aiInterval = setInterval(() => {
          if (terminatedRef.current || !faceDetector || !hiddenVideoRef.current || hiddenVideoRef.current.readyState !== 4) return;
          
          const detections = faceDetector.detectForVideo(hiddenVideoRef.current, performance.now());
          const now = Date.now();
          const canPenalize = now - lastPenaltyTimeRef.current > 15000;

          if (!detections.detections || detections.detections.length === 0) {
            setFaceMissing(true);
            setMultipleFaces(false);
            consecutiveMissingRef.current += 3;

            // Terminated due to 15 seconds continuous absence
            if (consecutiveMissingRef.current >= 15 && !terminatedRef.current) {
              terminatedRef.current = true;
              onTerminate('absence');
              return;
            }

            if (canPenalize) {
              lastPenaltyTimeRef.current = now;
              recordInfraction('AI Alert: Candidate face not detected in camera view.');
            }
          } else if (detections.detections.length > 1) {
            setFaceMissing(false);
            setMultipleFaces(true);
            consecutiveMissingRef.current = 0;

            if (canPenalize) {
              lastPenaltyTimeRef.current = now;
              recordInfraction('AI Alert: Multiple faces detected in camera view.');
            }
          } else {
            setFaceMissing(false);
            setMultipleFaces(false);
            consecutiveMissingRef.current = 0;
          }
        }, 3000);
      } catch (err) {
        console.warn('Failed to initialize MediaPipe AI detector:', err);
      }
    }

    initAI();

    return () => {
      clearInterval(aiInterval);
      if (faceDetector) faceDetector.close();
    };
  }, [hasStarted, webcamActive]);

  return {
    integrityScore,
    infractionMessage,
    faceMissing,
    multipleFaces,
    mediaStream,
    webcamActive,
    startWebcam,
    hiddenVideoRef,
    mobileVideoRef,
    desktopVideoRef,
    recordInfraction
  };
}