'use client';

import { motion } from 'framer-motion';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { FormData } from '@/types';

interface StepCedulaProps {
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
}

export function StepCedula({ register, error }: StepCedulaProps) {
  return (
    <motion.div
      key="step-cedula"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white leading-snug">
          ¿Cuál es tu cédula o RUC?
        </h2>
        <p className="text-sm text-white/60">
          Ingresa los dígitos sin espacios ni guiones.
        </p>
      </div>

      <Input
        label="Cédula o RUC"
        placeholder="Ej: 0912345678"
        type="text"
        inputMode="numeric"
        autoComplete="off"
        autoFocus
        maxLength={13}
        error={error?.message}
        {...register('cedula')}
      />
    </motion.div>
  );
}

export default StepCedula;
