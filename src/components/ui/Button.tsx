import React from 'react';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  loading = false,
  icon,
  children,
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-blue-600 text-white shadow-md hover:bg-blue-700 hover:shadow-lg focus:ring-blue-500 focus:ring-offset-2',
    secondary: 'bg-gray-600 text-white shadow-md hover:bg-gray-700 hover:shadow-lg focus:ring-gray-500 focus:ring-offset-2',
    outline: 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50 hover:shadow-md focus:ring-blue-500 focus:ring-offset-2',
    ghost: 'text-gray-700 hover:bg-gray-100 hover:shadow-md focus:ring-gray-500 focus:ring-offset-2',
    danger: 'bg-red-600 text-white shadow-md hover:bg-red-700 hover:shadow-lg focus:ring-red-500 focus:ring-offset-2',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  return (
    <button
      className={classes}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
      {!loading && icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};
