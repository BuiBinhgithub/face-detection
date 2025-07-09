import React, { type ReactNode } from "react";

type CustomModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

const styles: Record<string, React.CSSProperties> = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    backgroundColor: "rgba(0,0,0,0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  modal: {
    background: "#fff",
    borderRadius: "8px",
    padding: "1rem",
    width: "90%",
    maxWidth: "600px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
  },
  title: {
    margin: "0 0 1rem 0",
    fontSize: "1.2rem",
  },
};

export const CustomModal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  title,
  children,
}) => {
  if (!opened) return null;

  return (
    <div style={styles.overlay} onClick={onClose}>
      <div style={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 style={styles.title}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
