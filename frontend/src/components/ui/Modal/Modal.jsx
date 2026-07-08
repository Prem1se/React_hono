import { CloseIcon } from '../Icons';
import './Modal.css';

const Modal = ({ isOpen, onClose, title, children, maxWidth = '400px' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()}
        style={{ maxWidth }}
      >
        {title && <h2>{title}</h2>}
        <button className="modal-close" onClick={onClose}>
          <CloseIcon size={20} />
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
