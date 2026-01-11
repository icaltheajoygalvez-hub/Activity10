import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  fullWidth?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      fullWidth = false,
      icon,
      disabled,
      className = '',
      children,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 active:scale-95';

    const sizeStyles = {
      sm: 'px-4 py-2 text-sm gap-2',
      md: 'px-6 py-2.5 text-body-md gap-2.5',
      lg: 'px-8 py-3.5 text-body-lg gap-3',
    };

    const variantStyles = {
      primary:
        'bg-gradient-primary text-white shadow-elevation hover:shadow-large active:scale-95',
      secondary:
        'bg-secondary-100 text-secondary-900 hover:bg-secondary-200 hover:text-secondary-900 active:scale-95',
      danger:
        'bg-red-600 text-white shadow-elevation hover:shadow-large hover:bg-red-700 active:scale-95',
      ghost:
        'text-secondary-600 hover:bg-primary-50 active:scale-95',
      outline:
        'border-2 border-secondary-300 text-secondary-600 hover:border-secondary-400 hover:bg-secondary-50 active:scale-95',
    };

    const widthClass = fullWidth ? 'w-full' : '';

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${widthClass} ${className}`}
        {...props}
      >
        {icon && !isLoading && <span className="flex-shrink-0">{icon}</span>}
        {isLoading && (
          <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
