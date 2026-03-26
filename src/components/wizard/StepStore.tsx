'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import type { UseFormRegister, UseFormWatch, UseFormSetValue, FieldError } from 'react-hook-form';
import { Select } from '@/components/ui/Select';
import { STORES, ECUADOR_PROVINCES, PROVINCE_CITIES } from '@/lib/constants';
import type { FormData } from '@/types';

interface StepStoreProps {
  register: UseFormRegister<FormData>;
  errors: {
    store?: FieldError;
    province?: FieldError;
    city?: FieldError;
  };
  watch: UseFormWatch<FormData>;
  setValue: UseFormSetValue<FormData>;
}

export function StepStore({ register, errors, watch, setValue }: StepStoreProps) {
  const selectedProvince = watch('province');

  const provinceOptions = ECUADOR_PROVINCES.map((p) => ({ value: p, label: p }));

  const cityOptions =
    selectedProvince && PROVINCE_CITIES[selectedProvince]
      ? PROVINCE_CITIES[selectedProvince].map((c) => ({ value: c, label: c }))
      : [];

  const storeOptions = STORES.map((store) => ({
    value: store,
    label: store,
  }));

  // Reset city whenever the selected province changes
  useEffect(() => {
    setValue('city', '');
  }, [selectedProvince, setValue]);

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
          Selecciona tu ubicación y el local donde adquiriste las pilas Duracell.
        </p>
      </div>

      <Select
        label="Provincia"
        placeholder="Selecciona tu provincia"
        options={provinceOptions}
        error={errors.province?.message}
        {...register('province')}
      />

      <Select
        label="Ciudad"
        placeholder="Selecciona tu ciudad"
        options={cityOptions}
        error={errors.city?.message}
        disabled={!selectedProvince}
        {...register('city')}
      />

      <Select
        label="Local de compra"
        placeholder="Selecciona el local"
        options={storeOptions}
        error={errors.store?.message}
        {...register('store')}
      />
    </motion.div>
  );
}

export default StepStore;
