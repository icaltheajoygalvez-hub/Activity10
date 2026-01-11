import React, { InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, icon, className = '', required, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-label font-label text-secondary-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        <input
          ref={ref}
          className={`
            w-full px-4 py-2.5 rounded-lg
            border border-secondary-200
            text-body-md text-secondary-900 placeholder-secondary-400
            bg-white transition-all duration-200
            focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
            hover:border-secondary-300
            disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed disabled:border-secondary-200
            ${error ? 'border-red-500 focus:ring-red-500' : ''}
            ${icon ? 'pl-10' : ''}
            ${className}
          `}
          {...props}
        />
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-secondary-500">
            {icon}
          </div>
        )}
      </div>
      {error && <p className="text-body-sm text-red-600 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-body-sm text-secondary-500 mt-1.5">{helperText}</p>}
    </div>
  )
);

Input.displayName = 'Input';

interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const TextArea = React.forwardRef<HTMLTextAreaElement, TextAreaProps>(
  ({ label, error, helperText, className = '', required, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-label font-label text-secondary-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border border-secondary-200
          text-body-md text-secondary-900 placeholder-secondary-400
          bg-white transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          hover:border-secondary-300
          disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed disabled:border-secondary-200
          resize-none
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      />
      {error && <p className="text-body-sm text-red-600 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-body-sm text-secondary-500 mt-1.5">{helperText}</p>}
    </div>
  )
);

TextArea.displayName = 'TextArea';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  options: Array<{ value: string | number; label: string }>;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, helperText, options, className = '', required, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label className="block text-label font-label text-secondary-900 mb-2">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        ref={ref}
        className={`
          w-full px-4 py-2.5 rounded-lg
          border border-secondary-200
          text-body-md text-secondary-900
          bg-white transition-all duration-200
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent
          hover:border-secondary-300
          disabled:bg-secondary-50 disabled:text-secondary-500 disabled:cursor-not-allowed disabled:border-secondary-200
          appearance-none cursor-pointer
          ${error ? 'border-red-500 focus:ring-red-500' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-body-sm text-red-600 mt-1.5">{error}</p>}
      {helperText && !error && <p className="text-body-sm text-secondary-500 mt-1.5">{helperText}</p>}
    </div>
  )
);

Select.displayName = 'Select';

export default Input;
