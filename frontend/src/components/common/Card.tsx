import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  glass?: boolean;
  padding?: 'sm' | 'md' | 'lg';
  elevated?: boolean;
  interactive?: boolean;
}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      glass = false,
      padding = 'md',
      elevated = false,
      interactive = false,
      className = '',
      ...props
    },
    ref
  ) => {
    const paddingStyles = {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
    };

    const baseStyles = `rounded-lg-custom transition-all duration-200 border border-primary-100`;

    const glassStyles = glass
      ? 'bg-glass-dark backdrop-blur-md bg-opacity-70 border-primary-200'
      : 'bg-white';

    const shadowStyles = elevated
      ? 'shadow-elevation hover:shadow-medium'
      : 'shadow-soft';

    const interactiveStyles = interactive
      ? 'hover:shadow-medium hover:border-primary-200 cursor-pointer'
      : '';

    return (
      <div
        ref={ref}
        className={`${baseStyles} ${glassStyles} ${shadowStyles} ${paddingStyles[padding]} ${interactiveStyles} ${className}`}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = 'Card';

export default Card;
