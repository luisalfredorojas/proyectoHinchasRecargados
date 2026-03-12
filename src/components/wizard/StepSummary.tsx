'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { TermsModal } from '@/components/TermsModal';

interface SummaryData {
  full_name: string;
  cedula: string;
  phone: string;
  store: string;
  invoicePreview: string | null;
}

interface StepSummaryProps {
  formData: SummaryData;
  onEdit: (step: number) => void;
  isSubmitting: boolean;
}

interface SummaryRowProps {
  label: string;
  value: string;
  step: number;
  onEdit: (step: number) => void;
}

function PencilIcon() {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  );
}

function SummaryRow({ label, value, step, onEdit }: SummaryRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 py-3 border-b border-white/15 last:border-0">
      <div className="min-w-0">
        <p className="text-xs text-white/50 uppercase tracking-wide font-medium mb-0.5">
          {label}
        </p>
        <p className="text-white font-semibold truncate">{value}</p>
      </div>
      <button
        type="button"
        onClick={() => onEdit(step)}
        aria-label={`Editar ${label}`}
        className={[
          'shrink-0 p-1.5 rounded-lg text-[#BE7753]',
          'hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black transition-all duration-300',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]',
        ].join(' ')}
      >
        <PencilIcon />
      </button>
    </div>
  );
}

export function StepSummary({ formData, onEdit, isSubmitting }: StepSummaryProps) {
  const { full_name, cedula, phone, store, invoicePreview } = formData;
  const [showTerms, setShowTerms] = useState(false);

  const rows: { label: string; value: string; step: number }[] = [
    { label: 'Nombre', value: full_name, step: 1 },
    { label: 'Cédula', value: cedula, step: 2 },
    { label: 'Celular', value: `+593 ${phone}`, step: 3 },
    { label: 'Local', value: store, step: 4 },
  ];

  return (
    <>
      <motion.div
        key="step-summary"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="space-y-4"
      >
        <div className="text-center space-y-1">
          <h2 className="text-xl font-bold text-white leading-snug">
            Revisa tus datos
          </h2>
          <p className="text-sm text-white/60">
            Confirma que todo está correcto antes de enviar.
          </p>
        </div>

        {/* Summary card */}
        <div className="bg-white/5 border border-white/15 rounded-xl px-4 py-1">
          {rows.map((row) => (
            <SummaryRow
              key={row.step}
              label={row.label}
              value={row.value}
              step={row.step}
              onEdit={onEdit}
            />
          ))}

          {/* Invoice thumbnail row */}
          <div className="flex items-center justify-between gap-3 py-3">
            <div className="min-w-0">
              <p className="text-xs text-white/50 uppercase tracking-wide font-medium mb-0.5">
                Factura
              </p>
              {invoicePreview ? (
                <div className="relative w-16 h-16 rounded-lg overflow-hidden border border-white/20 mt-1">
                  <Image
                    src={invoicePreview}
                    alt="Vista previa de la factura"
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
              ) : (
                <p className="text-white/40 text-sm italic">Sin imagen</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => onEdit(5)}
              aria-label="Editar factura"
              className={[
                'shrink-0 p-1.5 rounded-lg text-[#BE7753]',
                'hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]',
              ].join(' ')}
            >
              <PencilIcon />
            </button>
          </div>
        </div>

        {/* Terms & Conditions notice */}
        <p className="text-xs text-white/50 text-center leading-relaxed px-1">
          Al hacer clic en <strong className="text-white/70">Enviar</strong>, aceptas los
          términos y condiciones del concurso.{' '}
          <button
            type="button"
            onClick={() => setShowTerms(true)}
            className="text-[#F2B38C] underline underline-offset-2 hover:text-[#BE7753] transition-colors duration-150 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#BE7753] rounded"
          >
            Haz clic aquí para leerlos
          </button>
          .
        </p>

        {/* Submit button */}
        <Button
          type="submit"
          variant="primary"
          size="lg"
          loading={isSubmitting}
          loadingText="Enviando..."
          className="mt-2"
        >
          Enviar
        </Button>
      </motion.div>

      {/* Terms modal — rendered outside the motion.div to avoid stacking context issues */}
      <TermsModal isOpen={showTerms} onClose={() => setShowTerms(false)} />
    </>
  );
}

export default StepSummary;
