'use client';

import React, { useRef, useState, useCallback } from 'react';

// ─── Validation constants ─────────────────────────────────────────────────────

const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

interface FileUploadProps {
  label?: string;
  error?: string;
  onChange: (file: File | null) => void;
  preview: string | null;
  accept?: string;
  className?: string;
}

function CameraIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-10 w-10 text-[#BE7753]/70"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  );
}

function UploadIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-6 w-6 text-[#BE7753]/50"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
      />
    </svg>
  );
}

export function FileUpload({
  label,
  error,
  onChange,
  preview,
  accept = 'image/*',
  className = '',
}: FileUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [validationError, setValidationError] = useState<string | undefined>(undefined);

  const handleFileChange = useCallback(
    (file: File | null) => {
      if (file) {
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          setValidationError('Solo se permiten imágenes JPG, PNG o WEBP.');
          onChange(null);
          return;
        }
        if (file.size > MAX_FILE_SIZE_BYTES) {
          setValidationError('La imagen no puede superar los 10 MB.');
          onChange(null);
          return;
        }
      }
      setValidationError(undefined);
      onChange(file);
    },
    [onChange]
  );

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    handleFileChange(file);
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file) {
      handleFileChange(file);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const dropZoneId = label?.toLowerCase().replace(/\s+/g, '-') ?? 'file-upload';

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label
          htmlFor={dropZoneId}
          className="text-white/80 text-xs font-semibold uppercase tracking-wider"
        >
          {label}
        </label>
      )}

      <div
        id={dropZoneId}
        role="button"
        tabIndex={0}
        aria-label="Tomar foto o seleccionar imagen"
        aria-describedby={error ? `${dropZoneId}-error` : undefined}
        onClick={() => inputRef.current?.click()}
        onKeyDown={onKeyDown}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          'relative flex flex-col items-center justify-center',
          'min-h-[200px] rounded-2xl cursor-pointer',
          'border-2 border-dashed transition-all duration-200',
          'bg-white/5 overflow-hidden',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]/50',
          isDragging
            ? 'border-[#BE7753] bg-[#BE7753]/10 scale-[1.01]'
            : error
              ? 'border-red-500/60 hover:border-red-500'
              : 'border-[#BE7753]/40 hover:border-[#BE7753]/80 hover:bg-white/8',
        ].join(' ')}
      >
        {preview ? (
          <>
            {/* Preview image */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Vista previa"
              className="absolute inset-0 w-full h-full object-cover"
            />

            {/* Overlay with change button */}
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col items-center gap-2">
                <UploadIcon />
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    inputRef.current?.click();
                  }}
                  className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black text-sm font-bold hover:brightness-110 transition-all duration-300"
                >
                  Cambiar
                </button>
                <button
                  type="button"
                  onClick={handleRemove}
                  className="px-4 py-1.5 rounded-lg bg-white/20 text-white text-sm font-medium hover:bg-white/30 transition-colors"
                >
                  Eliminar
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center gap-3 p-6 text-center pointer-events-none select-none">
            <CameraIcon />
            <div className="flex flex-col gap-1">
              <p className="text-white/80 text-sm font-semibold">
                Tomar foto o seleccionar imagen
              </p>
              <p className="text-white/40 text-xs">
                {isDragging
                  ? 'Suelta la imagen aqui'
                  : 'Arrastra una imagen o toca para seleccionar'}
              </p>
              <p className="text-white/25 text-xs">JPG, PNG o WEBP · Máx. 10 MB</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden file input */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        capture="environment"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onInputChange}
      />

      {(validationError ?? error) && (
        <p
          id={`${dropZoneId}-error`}
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
          {validationError ?? error}
        </p>
      )}
    </div>
  );
}

export default FileUpload;
