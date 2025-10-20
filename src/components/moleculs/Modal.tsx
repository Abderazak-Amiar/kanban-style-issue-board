import { useEffect } from 'react';
import '../../styles/modal.css';
import type { ModalProps } from '../../types';
export default function Modal({ children, onClose }: ModalProps) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="modal-container"
      aria-modal="true"
      role="dialog"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()} className="modal-content">
        {children}
      </div>
    </div>
  );
}
