'use client';

import { motion } from 'framer-motion';
import type { UseFormRegister, FieldError } from 'react-hook-form';
import { Select } from '@/components/ui/Select';
import { STORES } from '@/lib/constants';
import type { FormData } from '@/types';

interface StepStoreProps {
  register: UseFormRegister<FormData>;
  error: FieldError | undefined;
}

export function StepStore({ register, error }: StepStoreProps) {
  const storeOptions = STORES.map((store) => ({
    value: store,
    label: store,
  }));

  return (
    <motion.div
      key="step-store"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      <div className="text-center space-y-1">
        <h2 className="text-xl font-bold text-white leading-snug">
          ¿Dónde compraste?
        </h2>
        <p className="text-sm text-white/60">
          Selecciona el local donde adquiriste las pilas Duracell.
        </p>
      </div>

      <Select
        label="Local de compra"
        placeholder="Selecciona el local"
        options={storeOptions}
        error={error?.message}
        {...register('store')}
      />
    </motion.div>
  );
}

export default StepStore;
