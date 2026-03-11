'use client';

import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'prefix'> {
  label?: string;
  error?: string;
  placeholder?: string;
  type?: React.HTMLInputTypeAttribute;
  className?: string;
  prefix?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(function Input(
  {
    label,
    error,
    placeholder,
    type = 'text',
    className = '',
    prefix,
    name,
    ...rest
  },
  ref,
) {
  const inputId = name ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;

  const baseInputClasses = [
    'w-full bg-white/10 text-white placeholder-white/50',
    'border rounded-xl px-4 py-3',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-[#D4A843]/30',
    error
      ? 'border-red-500 focus:border-red-500'
      : 'border-white/20 focus:border-[#D4A843]',
  ].join(' ');

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-white/80 text-xs font-semibold uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative flex items-center">
        {prefix && (
          <span
            className={[
              'absolute left-0 flex items-center justify-center',
              'h-full px-3 text-white/70 text-sm font-medium',
              'border-r border-white/20 select-none pointer-events-none',
              'bg-white/5 rounded-l-xl',
            ].join(' ')}
            aria-hidden="true"
          >
            {prefix}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          name={name}
          type={type}
          placeholder={placeholder}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${inputId}-error` : undefined}
          className={[
            baseInputClasses,
            prefix ? 'pl-[calc(var(--prefix-width,3rem)+1rem)]' : '',
          ]
            .filter(Boolean)
            .join(' ')}
          style={prefix ? { paddingLeft: `calc(${prefix.length}ch + 2.5rem)` } : undefined}
          {...rest}
        />
      </div>

      {error && (
        <p
          id={`${inputId}-error`}
          role="alert"
          className="text-red-400 text-xs mt-0.5 flex items-center gap-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-3.5 w-3.5 shrink-0"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
