'use client';

import React from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'className'> {
  label?: string;
  error?: string;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}

function ChevronDownIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-4 w-4 text-[#BE7753] pointer-events-none"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(function Select(
  {
    label,
    error,
    options,
    placeholder,
    className = '',
    name,
    ...rest
  },
  ref,
) {
  const selectId = name ?? label?.toLowerCase().replace(/\s+/g, '-') ?? undefined;

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-white/80 text-xs font-semibold uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div className="relative">
        <select
          ref={ref}
          id={selectId}
          name={name}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${selectId}-error` : undefined}
          className={[
            'w-full appearance-none bg-white/10 text-white',
            'border rounded-xl px-4 py-3 pr-10',
            'transition-all duration-200',
            'focus:outline-none focus:ring-2 focus:ring-[#BE7753]/30',
            '[&>option]:bg-black [&>option]:text-white',
            error
              ? 'border-red-500 focus:border-red-500'
              : 'border-white/20 focus:border-[#BE7753]',
          ].join(' ')}
          defaultValue=""
          {...rest}
        >
          {placeholder && (
            <option value="" disabled className="text-white/50">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <span className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
          <ChevronDownIcon />
        </span>
      </div>

      {error && (
        <p
          id={`${selectId}-error`}
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

export default Select;
