import { useEffect } from "react";
import styles from "./Modal.module.scss";
import { createPortal } from "react-dom";

const modalRoot = document.getElementById('modal-root')

export default function Modal({ children, isOpen, onClose }) {
  useEffect(() => {
    if (!isOpen) return;

    const onEsc = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onEsc);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.ContentModal} onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>, modalRoot
  );
}
