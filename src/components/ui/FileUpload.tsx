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

function CameraIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'h-5 w-5'}
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

function GalleryIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className ?? 'h-5 w-5'}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
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
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
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
    // Reset so the same file can be selected again
    e.target.value = '';
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

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
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
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={[
          'relative flex flex-col items-center justify-center',
          'min-h-[200px] rounded-2xl',
          'border-2 border-dashed transition-all duration-200',
          'bg-white/5 overflow-hidden',
          isDragging
            ? 'border-[#BE7753] bg-[#BE7753]/10 scale-[1.01]'
            : error
              ? 'border-red-500/60'
              : 'border-[#BE7753]/40',
        ].join(' ')}
      >
        {preview ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Vista previa"
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
              <div className="flex flex-col items-center gap-2">
                <UploadIcon />
                <button
                  type="button"
                  onClick={() => galleryInputRef.current?.click()}
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
          <div className="flex flex-col items-center gap-4 p-6 text-center">
            {/* Icon */}
            <CameraIcon className="h-10 w-10 text-[#BE7753]/70" />

            {/* Text */}
            <div className="flex flex-col gap-1 pointer-events-none select-none">
              <p className="text-white/80 text-sm font-semibold">
                {isDragging ? 'Suelta la imagen aquí' : 'Sube tu factura'}
              </p>
              <p className="text-white/25 text-xs">JPG, PNG o WEBP · Máx. 10 MB</p>
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 mt-1">
              <button
                type="button"
                onClick={() => cameraInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black text-sm font-bold hover:brightness-110 active:scale-95 transition-all duration-200"
              >
                <CameraIcon className="h-4 w-4" />
                Cámara
              </button>
              <button
                type="button"
                onClick={() => galleryInputRef.current?.click()}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 border border-[#BE7753]/40 text-white text-sm font-semibold hover:bg-white/15 active:scale-95 transition-all duration-200"
              >
                <GalleryIcon className="h-4 w-4" />
                Galería
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Input para cámara (capture fuerza la cámara en mobile) */}
      <input
        ref={cameraInputRef}
        type="file"
        accept={accept}
        capture="environment"
        className="sr-only"
        aria-hidden="true"
        tabIndex={-1}
        onChange={onInputChange}
      />

      {/* Input para galería (sin capture para abrir el selector de archivos) */}
      <input
        ref={galleryInputRef}
        type="file"
        accept={accept}
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
