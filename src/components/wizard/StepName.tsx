'use client';

import { motion } from 'framer-motion';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Input } from '@/components/ui/Input';
import type { FormData } from '@/types';

interface StepNameProps {
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
}

export function StepName({ register, error }: StepNameProps) {
  return (
    <motion.div
      key="step-name"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white leading-snug">
          ¿Cuál es tu nombre completo?
        </h2>
        <p className="text-sm text-white/60">
          Ingresa tu nombre tal como aparece en tu cédula.
        </p>
      </div>

      <Input
        label="Nombres y apellidos"
        placeholder="Ej: Juan Pérez López"
        autoComplete="name"
        autoFocus
        error={error?.message}
        {...register('full_name')}
      />
    </motion.div>
  );
}

export default StepName;
