import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  backButton?: {
    label: string;
    onClick: () => void;
  };
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  action,
  backButton,
}) => {
  return (
    <div className="mb-8">
      {backButton && (
        <button
          onClick={backButton.onClick}
          className="flex items-center text-secondary-600 hover:text-secondary-900 mb-4 text-body-md font-medium transition-colors"
        >
          <svg
            className="w-5 h-5 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          {backButton.label}
        </button>
      )}

      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-heading-lg text-secondary-900 mb-2">{title}</h1>
          {subtitle && (
            <p className="text-body-lg text-secondary-600">{subtitle}</p>
          )}
        </div>
        {action && <div className="flex-shrink-0">{action}</div>}
      </div>
    </div>
  );
};

export default PageHeader;
