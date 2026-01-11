import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<{
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}> = ({ title, subtitle, action }) => (
  <div className="mb-8 flex items-start justify-between">
    <div>
      <h1 className="text-heading-lg text-secondary-900 font-bold">{title}</h1>
      {subtitle && <p className="text-body-md text-secondary-600 mt-2">{subtitle}</p>}
    </div>
    {action && <div>{action}</div>}
  </div>
);

export const PageContainer: React.FC<LayoutProps> = ({ children, className = '' }) => (
  <main className={`min-h-screen bg-secondary-50 ${className}`}>
    <div className="max-w-7xl mx-auto px-6 py-10">{children}</div>
  </main>
);

export const Card: React.FC<LayoutProps & { gradient?: boolean; noPadding?: boolean; glass?: boolean }> = ({
  children,
  className = '',
  gradient = false,
  noPadding = false,
  glass = false,
}) => (
  <div
    className={`rounded-lg-custom border border-white/30 shadow-soft hover:shadow-medium transition-all duration-200 ${
      glass ? 'bg-white/40 backdrop-blur-lg' : 'bg-white'
    } ${
      !noPadding ? 'p-6' : ''
    } ${className}`}
  >
    {children}
  </div>
);

export const CardContent: React.FC<LayoutProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 ${className}`}>{children}</div>
);

export const CardFooter: React.FC<LayoutProps> = ({ children, className = '' }) => (
  <div className={`px-6 py-4 border-t border-secondary-200 bg-secondary-50 rounded-b-lg-custom flex gap-3 ${className}`}>
    {children}
  </div>
);

export const Grid: React.FC<LayoutProps & { cols?: number }> = ({
  children,
  cols = 3,
  className = '',
}) => (
  <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${cols} gap-6 ${className}`}>
    {children}
  </div>
);

export const Badge: React.FC<{
  label: string;
  variant?: 'primary' | 'success' | 'danger' | 'warning' | 'info';
  icon?: string;
}> = ({ label, variant = 'primary', icon }) => {
  const variantClasses = {
    primary: 'bg-primary-50 text-primary-700 border border-primary-200',
    success: 'bg-green-50 text-green-700 border border-green-200',
    danger: 'bg-red-50 text-red-700 border border-red-200',
    warning: 'bg-yellow-50 text-yellow-700 border border-yellow-200',
    info: 'bg-blue-50 text-blue-700 border border-blue-200',
  };

  return (
    <span
      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-label font-medium ${variantClasses[variant]}`}
    >
      {icon && <span>{icon}</span>}
      {label}
    </span>
  );
};

export default PageContainer;
