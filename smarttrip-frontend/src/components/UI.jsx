import React from 'react';
import clsx from 'clsx';

export const Button = React.forwardRef(({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  disabled = false,
  loading = false,
  icon: Icon,
  iconPosition = 'left',
  children,
  className,
  ...props
}, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  const variants = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700 focus:ring-primary-500 disabled:bg-primary-300',
    secondary: 'bg-gray-100 text-gray-900 hover:bg-gray-200 focus:ring-gray-500 disabled:bg-gray-200',
    outline: 'border-2 border-primary-600 text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
    ghost: 'text-primary-600 hover:bg-primary-50 focus:ring-primary-500',
  };
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
  };
  
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={clsx(
        baseStyles,
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      {...props}
    >
      {Icon && iconPosition === 'left' && <Icon className="mr-2" size={20} />}
      {loading && <span className="mr-2 inline-block animate-spin">⏳</span>}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="ml-2" size={20} />}
    </button>
  );
});

Button.displayName = 'Button';

export const Card = ({ children, className, hoverable = false, ...props }) => (
  <div
    className={clsx(
      'bg-white dark:bg-dark-900 rounded-xl shadow-lg overflow-hidden',
      hoverable && 'transition-transform duration-200 hover:shadow-premium hover:scale-105',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

export const Input = React.forwardRef(({
  label,
  error,
  icon: Icon,
  type = 'text',
  className,
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
    )}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-3 text-gray-400" size={20} />}
      <input
        ref={ref}
        type={type}
        className={clsx(
          'w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 dark:bg-dark-900 dark:text-white',
          Icon && 'pl-10',
          error && 'border-red-500',
          className
        )}
        {...props}
      />
    </div>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
));

Input.displayName = 'Input';

export const Select = React.forwardRef(({
  label,
  error,
  options = [],
  className,
  ...props
}, ref) => (
  <div className="w-full">
    {label && (
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
        {label}
      </label>
    )}
    <select
      ref={ref}
      className={clsx(
        'w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-primary-600 dark:bg-dark-900 dark:text-white',
        error && 'border-red-500',
        className
      )}
      {...props}
    >
      <option value="">Select an option</option>
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
  </div>
));

Select.displayName = 'Select';

export const Badge = ({ children, variant = 'primary', className, ...props }) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
    danger: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100',
  };

  return (
    <span
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
};

export const Loading = ({ className }) => (
  <div className={clsx('flex justify-center items-center p-8', className)}>
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
  </div>
);

export const EmptyState = ({ icon: Icon, title, description, action }) => (
  <div className="text-center py-12">
    {Icon && <Icon size={48} className="mx-auto text-gray-400 mb-4" />}
    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
    <p className="text-gray-500 dark:text-gray-400 mb-6">{description}</p>
    {action && action}
  </div>
);

export const Modal = ({ isOpen, onClose, title, children, actions }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <Card className="max-w-md w-full mx-4">
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{title}</h2>
          </div>
        )}
        <div className="px-6 py-4">{children}</div>
        {actions && (
          <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700 flex gap-2 justify-end">
            {actions}
          </div>
        )}
      </Card>
    </div>
  );
};
