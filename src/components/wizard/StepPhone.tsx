'use client';

import { motion } from 'framer-motion';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { FormData } from '@/types';

interface StepPhoneProps {
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
}

export function StepPhone({ register, error }: StepPhoneProps) {
  return (
    <motion.div
      key="step-phone"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white leading-snug">
          ¿Cuál es tu número de celular?
        </h2>
        <p className="text-sm text-white/60">
          Ingresa los 9 dígitos sin el cero inicial (Ej: 991234567).
        </p>
      </div>

      <Input
        label="Celular"
        placeholder="Ej: 991234567"
        type="text"
        inputMode="numeric"
        autoComplete="tel"
        autoFocus
        maxLength={9}
        prefix="+593"
        error={error?.message}
        {...register('phone')}
      />
    </motion.div>
  );
}

export default StepPhone;
