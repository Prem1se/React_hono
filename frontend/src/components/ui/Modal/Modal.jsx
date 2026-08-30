import { CloseIcon } from '../Icons';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, maxWidth }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        style={maxWidth ? { maxWidth } : undefined}
      >
        {title && (
          <div className="modal-header">
            <h3>{title}</h3>
            <button className="modal-close" onClick={onClose}>
              <CloseIcon size={20} />
            </button>
          </div>
        )}
        {!title && (
          <button className="modal-close" onClick={onClose}>
            <CloseIcon size={20} />
          </button>
        )}
        <div className="modal-body">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;
