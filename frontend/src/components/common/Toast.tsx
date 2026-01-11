import React, { useEffect } from 'react';
import { CheckIcon, ErrorIcon, WarningIcon, InfoIcon } from '../icons/IconSystem';

export type ToastType = 'success' | 'error' | 'info' | 'warning';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose, duration = 5000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border border-green-200 text-green-800';
      case 'error':
        return 'bg-red-50 border border-red-200 text-red-800';
      case 'warning':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800';
      case 'info':
        return 'bg-blue-50 border border-blue-200 text-blue-800';
      default:
        return 'bg-secondary-50 border border-secondary-200 text-secondary-800';
    }
  };

  const getIconColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'info':
        return 'text-blue-600';
      default:
        return 'text-secondary-600';
    }
  };

  const getIcon = () => {
    const iconClass = `w-5 h-5 ${getIconColor()}`;
    switch (type) {
      case 'success':
        return <CheckIcon className={iconClass} />;
      case 'error':
        return <ErrorIcon className={iconClass} />;
      case 'warning':
        return <WarningIcon className={iconClass} />;
      case 'info':
        return <InfoIcon className={iconClass} />;
    }
  };

  return (
    <div className={`fixed top-4 right-4 z-50 flex items-start gap-3 px-5 py-4 rounded-lg shadow-elevation max-w-sm ${getTypeStyles()} animate-slide-in-right`}>
      <div className="flex-shrink-0 mt-0.5">
        {getIcon()}
      </div>
      <p className="text-sm font-medium flex-1">{message}</p>
      <button
        onClick={onClose}
        className="ml-2 text-current hover:opacity-60 transition-opacity flex-shrink-0"
        aria-label="Close"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
