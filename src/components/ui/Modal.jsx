import { FiX } from 'react-icons/fi';

/**
 * Modal
 * Komponen modal reusable untuk dialog, form, dan konfirmasi.
 */
const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  // Tutup modal ketika klik overlay (luar modal)
  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>{title}</h2>
          <button className="modal-close" onClick={onClose}>
            <FiX />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Modal;
