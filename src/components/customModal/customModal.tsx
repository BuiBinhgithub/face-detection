import React, { type ReactNode } from "react";
import styles from "./index.module.scss";

type CustomModalProps = {
  opened: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
};

export const CustomModal: React.FC<CustomModalProps> = ({
  opened,
  onClose,
  title,
  children,
}) => {
  if (!opened) return null;

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {title && <h2 className={styles.title}>{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );
};

export default CustomModal;
