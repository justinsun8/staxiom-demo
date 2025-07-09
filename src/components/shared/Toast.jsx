import React, { useEffect } from 'react';
import { CheckIcon, XIcon, AlertIcon, InfoIcon } from './Icons';
import './Toast.css';

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckIcon size={16} />;
      case 'error':
        return <XIcon size={16} />;
      case 'warning':
        return <AlertIcon size={16} />;
      case 'info':
        return <InfoIcon size={16} />;
      default:
        return <CheckIcon size={16} />;
    }
  };

  return (
    <div className={`toast toast-${type}`}>
      <div className="toast-icon">{getIcon()}</div>
      <div className="toast-message">{message}</div>
      <button className="toast-close" onClick={onClose}>×</button>
    </div>
  );
};

export default Toast;