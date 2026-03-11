'use client';

import React from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  children: React.ReactNode;
  className?: string;
  loadingText?: string;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: [
    'bg-gradient-to-r from-[#BE7753] to-[#F2B38C]',
    'text-black font-bold',
    'hover:from-[#BE7753] hover:to-[#F2B38C]',
    'shadow-[0_0_20px_rgba(190,119,83,0.35)]',
    'hover:shadow-[0_0_28px_rgba(242,179,140,0.55)]',
    'hover:brightness-110',
    'active:scale-[0.98]',
  ].join(' '),

  secondary: [
    'bg-[#1B6B8A]',
    'text-white font-semibold',
    'hover:bg-[#155870]',
    'active:scale-[0.98]',
  ].join(' '),

  outline: [
    'bg-transparent',
    'border-2 border-[#BE7753]',
    'text-[#BE7753] font-semibold',
    'hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black hover:border-transparent',
    'active:scale-[0.98]',
  ].join(' '),
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm',
  md: 'px-6 py-3 text-base',
  lg: 'px-8 py-4 text-lg',
};

function Spinner() {
  return (
    <svg
      className="animate-spin h-4 w-4 shrink-0"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
      />
    </svg>
  );
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  children,
  className = '',
  loadingText = 'Cargando...',
}: ButtonProps) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      aria-busy={loading}
      className={[
        'w-full rounded-xl transition-all duration-200',
        'inline-flex items-center justify-center gap-2',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753] focus-visible:ring-offset-2 focus-visible:ring-offset-black',
        variantClasses[variant],
        sizeClasses[size],
        isDisabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {loading ? (
        <>
          <Spinner />
          <span>{loadingText}</span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
