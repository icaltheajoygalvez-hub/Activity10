import React from 'react';
import { ErrorIcon } from '../icons/IconSystem';

interface ErrorMessageProps {
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, dismissible, onDismiss }) => {
  return (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-start gap-3 mb-4 relative" role="alert">
      <ErrorIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
      <span className="block sm:inline flex-1">{message}</span>
      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-500 hover:text-red-700 ml-2"
          aria-label="Dismiss"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
