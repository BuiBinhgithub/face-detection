import { useEffect, useRef, useState } from "react";
import * as faceapi from "face-api.js";

const MODEL_URL = "/models";

type Step = "detecting" | "right" | "left" | "center" | "done";

export function useFaceDetection(
  videoRef: React.RefObject<HTMLVideoElement | null>,
  canvasRef: React.RefObject<HTMLCanvasElement | null>
) {
  const streamRef = useRef<MediaStream | null>(null);

  const [step, setStep] = useState<Step>("detecting");
  const [directionMessage, setDirectionMessage] = useState(
    "🔍 Đang tìm khuôn mặt..."
  );
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [isCameraOn, setIsCameraOn] = useState(false);

  // load model
  useEffect(() => {
    const loadModels = async () => {
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
    };
    loadModels();
  }, []);

  const startVideo = () => {
    navigator.mediaDevices.getUserMedia({ video: true }).then((stream) => {
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        streamRef.current = stream;
        setIsCameraOn(true);
      }
    });
  };

  const stopVideo = () => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    setIsCameraOn(false);
  };

  const capture = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const ctx = canvasRef.current.getContext("2d");
    if (!ctx) return;

    const width = videoRef.current.videoWidth;
    const height = videoRef.current.videoHeight;

    canvasRef.current.width = width;
    canvasRef.current.height = height;

    ctx.drawImage(videoRef.current, 0, 0, width, height);

    const imageData = canvasRef.current.toDataURL("image/png");
    setCapturedImage(imageData);
    setStep("done");
    setDirectionMessage("✅ Đã chụp ảnh thành công");
  };

  const detect = async () => {
    if (
      !videoRef.current ||
      videoRef.current.readyState !== 4 ||
      step === "done"
    )
      return;

    const detection = await faceapi
      .detectSingleFace(videoRef.current, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks();

    if (!detection) {
      if (step === "detecting") {
        setDirectionMessage(
          "🙈 Không thấy khuôn mặt, vui lòng đưa mặt vào khung hình"
        );
      }
      return;
    }

    const landmarks = detection.landmarks;
    const nose = landmarks.getNose()[3];
    const leftEye = landmarks.getLeftEye();
    const rightEye = landmarks.getRightEye();
    const eyeCenterX = (leftEye[0].x + rightEye[3].x) / 2;
    const diff = nose.x - eyeCenterX;

    switch (step) {
      case "detecting":
        setStep("left");
        setDirectionMessage("👈 Vui lòng quay mặt sang trái");
        break;

      case "left":
        if (diff > 15) {
          setStep("right");
          setDirectionMessage("👉 Giờ quay mặt sang phải");
        }
        break;

      case "right":
        if (diff < -15) {
          setStep("center");
          setDirectionMessage("✅ Giờ hãy nhìn chính diện, vui lòng giữ yên");
        }
        break;

      case "center":
        if (Math.abs(diff) <= 15) {
          capture();
        }
        break;
    }
  };

  useEffect(() => {
    if (!isCameraOn) return;
    const interval = setInterval(detect, 500);
    return () => clearInterval(interval);
  }, [isCameraOn, step]);

  const reset = () => {
    setCapturedImage(null);
    setStep("detecting");
    setDirectionMessage("🔍 Đang tìm khuôn mặt...");
  };

  return {
    startVideo,
    stopVideo,
    reset,
    step,
    directionMessage,
    capturedImage,
    isCameraOn,
  };
}
