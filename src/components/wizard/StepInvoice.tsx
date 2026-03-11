'use client';

import { motion } from 'framer-motion';
import { FileUpload } from '@/components/ui/FileUpload';

interface StepInvoiceProps {
  onChange: (file: File | null) => void;
  error: string | undefined;
  preview: string | null;
}

export function StepInvoice({ onChange, error, preview }: StepInvoiceProps) {
  return (
    <motion.div
      key="step-invoice"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white leading-snug">
          Sube tu factura de compra
        </h2>
        <p className="text-sm text-white/60">
          Fotografía tu factura o ticket de compra. Asegúrate de que sea legible.
        </p>
      </div>

      <FileUpload
        onChange={onChange}
        error={error}
        preview={preview}
        accept="image/*"
      />
    </motion.div>
  );
}

export default StepInvoice;
