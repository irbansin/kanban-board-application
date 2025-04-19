import React, { useEffect, useRef } from 'react';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ open, onClose, children }) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, onClose]);

  if (!open) return null;
  return (
    <div className="modal-backdrop" style={{
      position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
      background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
    }}>
      <div className="modal" ref={modalRef} style={{ background: 'var(--secondary-bg)', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 2px 16px rgba(0,0,0,0.3)' }}>
        <button
          className="modal-close-btn"
          aria-label="Close modal"
          type="button"
          onClick={onClose}
          style={{ position: 'absolute', top: 24, right: 32, color: 'var(--muted)', fontSize: 20, background: 'none', border: 'none', cursor: 'pointer' }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
