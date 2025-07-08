import { useRef, useState } from "react";
import { Button } from "@mantine/core";
import { useFaceDetection } from "./hooks/useFaceDetection";
import CustomModal from "./components/customModal";

function App() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [modalOpened, setModalOpened] = useState(false);

  const {
    startVideo,
    stopVideo,
    reset,
    directionMessage,
    capturedImage,
    step,
  } = useFaceDetection(videoRef, canvasRef);

  const openModal = () => {
    reset();
    setModalOpened(true);
    setTimeout(() => startVideo(), 300);
  };

  const closeModal = () => {
    stopVideo();
    setModalOpened(false);
  };

  return (
    <div
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        gap: "1rem",
      }}
    >
      <Button onClick={openModal}>📷 Bắt đầu quét khuôn mặt</Button>

      {capturedImage && (
        <div style={{ textAlign: "center" }}>
          <p>📸 Ảnh đã chụp:</p>
          <img
            src={capturedImage}
            alt="Ảnh đã chụp"
            style={{ width: 300, borderRadius: 8 }}
          />
        </div>
      )}

      <CustomModal
        opened={modalOpened}
        onClose={closeModal}
        title="🔍 Nhận diện khuôn mặt theo từng bước"
      >
        <div
          style={{
            alignItems: "center",
            gap: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <p style={{ fontSize: "1.2rem", margin: 0 }}>{directionMessage}</p>

          {step === "done" ? (
            <img
              src={capturedImage!}
              alt="Ảnh đã chụp"
              style={{ width: 300, borderRadius: 8 }}
            />
          ) : (
            <video
              ref={videoRef}
              autoPlay
              muted
              width={300}
              height={400}
              style={{ borderRadius: 8 }}
            />
          )}

          <Button color="red" onClick={closeModal}>
            🛑 Đóng
          </Button>

          <canvas ref={canvasRef} style={{ display: "none" }} />
        </div>
      </CustomModal>
    </div>
  );
}

export default App;
