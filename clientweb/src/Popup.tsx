import React, { useEffect } from "react";
import './cssStyle/Popup.css';

interface PopupProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  color: string;
}

const Popup = ({ isOpen, onClose, title, message, color }: PopupProps): React.ReactNode | null => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="popup-overlay">
      <div className="popup-container" style={{ borderColor: color }}>
        <div className="popup-close">
          <button
            onClick={onClose}
            className="close-button"
          >
            ×
          </button>
        </div>
        <div className="popup-content">
          <h2 className="popup-title">
            {title}
          </h2>
        </div>
        <div className="popup-message">{message}</div>
      </div>
    </div>
  );
};

export default Popup;