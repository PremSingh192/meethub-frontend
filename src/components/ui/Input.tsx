import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'w-full px-4 py-3.5 border-2 border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-gray-900 placeholder-gray-400 shadow-sm';
  const errorStyles = error ? 'border-red-500 focus:ring-red-500 bg-red-50 text-red-900' : 'border-gray-300 focus:border-blue-500 bg-white';
  
  const classes = `${baseStyles} ${errorStyles} ${className}`;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-semibold text-gray-700 mb-3">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          className={`${classes} ${icon ? 'pl-12' : ''} text-lg shadow-inner`}
          placeholder={`Enter ${label?.toLowerCase() || 'value'}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-2 text-sm text-red-600 font-medium animate-pulse">
          {error}
        </p>
      )}
    </div>
  );
};
