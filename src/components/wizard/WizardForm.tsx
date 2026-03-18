'use client';

import { useState, useCallback, useRef } from 'react';
import { useForm, Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AnimatePresence, motion } from 'framer-motion';

import { registerSchema } from '@/lib/schemas';
import type { FormData, WizardStep } from '@/types';
import { Button } from '@/components/ui/Button';
import { ProgressBar } from './ProgressBar';
import { StepName } from './StepName';
import { StepCedula } from './StepCedula';
import { StepPhone } from './StepPhone';
import { StepStore } from './StepStore';
import { StepInvoice } from './StepInvoice';
import { StepSummary } from './StepSummary';

// ─── Types ────────────────────────────────────────────────────────────────────

interface WizardFormProps {
  onSuccess: (prizeType: string) => void;
}

// Fields validated per step (step 5 = invoice, handled separately)
const STEP_FIELDS: Record<number, (keyof Omit<FormData, 'invoice'>)[]> = {
  1: ['full_name'],
  2: ['cedula'],
  3: ['phone'],
  4: ['store'],
};

// Slide animation variants — direction drives enter/exit side
const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? 100 : -100,
    opacity: 0,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? -100 : 100,
    opacity: 0,
  }),
};

const slideTransition = { duration: 0.3, ease: 'easeInOut' as const };

// ─── Component ────────────────────────────────────────────────────────────────

export function WizardForm({ onSuccess }: WizardFormProps) {
  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  const [invoiceError, setInvoiceError] = useState<string | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [dataConsent, setDataConsent] = useState(false);
  const submittingRef = useRef(false);

  const {
    register,
    trigger,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(registerSchema) as unknown as Resolver<FormData>,
    mode: 'onTouched',
    defaultValues: {
      full_name: '',
      cedula: '',
      phone: '',
      store: '',
      invoice: null,
    },
  });

  // ─── Invoice file handler ──────────────────────────────────────────────────

  const handleInvoiceChange = useCallback((file: File | null) => {
    setInvoiceFile(file);
    setInvoiceError(undefined);

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setInvoicePreview(null);
    }
  }, []);

  // ─── Navigation ───────────────────────────────────────────────────────────

  const goNext = useCallback(async () => {
    setSubmitError(null);

    if (currentStep <= 4) {
      const fields = STEP_FIELDS[currentStep];
      const valid = await trigger(fields as (keyof FormData)[]);
      if (!valid) return;
    }

    if (currentStep === 5) {
      if (!invoiceFile) {
        setInvoiceError('Por favor sube una foto de tu factura');
        return;
      }
      setInvoiceError(undefined);
    }

    if (currentStep < 6) {
      setDirection(1);
      setCurrentStep((prev) => (prev + 1) as WizardStep);
    }
  }, [currentStep, invoiceFile, trigger]);

  const goBack = useCallback(() => {
    if (currentStep > 1) {
      setDirection(-1);
      setCurrentStep((prev) => (prev - 1) as WizardStep);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    setDirection(step < currentStep ? -1 : 1);
    setCurrentStep(step as WizardStep);
  }, [currentStep]);

  // ─── Form submission ──────────────────────────────────────────────────────

  const onSubmit = useCallback(async () => {
    if (submittingRef.current) return;

    if (!invoiceFile) {
      setInvoiceError('Por favor sube una foto de tu factura');
      setCurrentStep(5);
      return;
    }

    submittingRef.current = true;
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const values = getValues();
      const payload = new FormData();
      payload.append('full_name', values.full_name);
      payload.append('cedula', values.cedula);
      payload.append('phone', values.phone);
      payload.append('store', values.store);
      payload.append('invoice', invoiceFile);
      payload.append('terms_accepted', termsAccepted.toString());
      payload.append('terms_accepted_at', new Date().toISOString());
      payload.append('data_treatment_accepted', dataConsent.toString());
      if (dataConsent) {
        payload.append('data_treatment_accepted_at', new Date().toISOString());
      }

      const response = await fetch('/api/register', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        if (response.status === 413) {
          throw new Error('La imagen es demasiado grande para enviarla. Usa una foto de menor resolución (máx. 10 MB).');
        }
        const errorData = (await response.json().catch(() => ({}))) as {
          error?: string;
        };
        const fallback =
          response.status >= 500
            ? 'Error en el servidor. Intenta nuevamente en unos minutos.'
            : 'Error al registrar. Verifica los datos e intenta de nuevo.';
        throw new Error(errorData.error ?? fallback);
      }

      const result = (await response.json()) as { prize_type?: string };
      const prizeType = result.prize_type ?? 'cine_en_casa';
      onSuccess(prizeType);
    } catch (err) {
      let message = 'Error inesperado. Intenta nuevamente.';
      if (err instanceof Error) {
        message =
          err.message === 'Failed to fetch'
            ? 'No se pudo conectar al servidor. Verifica tu conexión a internet e intenta de nuevo.'
            : err.message;
      }
      setSubmitError(message);
    } finally {
      submittingRef.current = false;
      setIsSubmitting(false);
    }
  }, [invoiceFile, getValues, onSuccess, termsAccepted, dataConsent]);

  // ─── Derived state for StepSummary ────────────────────────────────────────

  const values = getValues();
  const summaryData = {
    full_name: values.full_name,
    cedula: values.cedula,
    phone: values.phone,
    store: values.store,
    invoicePreview,
  };

  // ─── Step renderer ────────────────────────────────────────────────────────

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            key={1}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepName register={register} error={errors.full_name} />
          </motion.div>
        );
      case 2:
        return (
          <motion.div
            key={2}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepCedula register={register} error={errors.cedula} />
          </motion.div>
        );
      case 3:
        return (
          <motion.div
            key={3}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepPhone register={register} error={errors.phone} />
          </motion.div>
        );
      case 4:
        return (
          <motion.div
            key={4}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepStore register={register} error={errors.store} />
          </motion.div>
        );
      case 5:
        return (
          <motion.div
            key={5}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepInvoice
              onChange={handleInvoiceChange}
              error={invoiceError}
              preview={invoicePreview}
            />
          </motion.div>
        );
      case 6:
        return (
          <motion.div
            key={6}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={slideTransition}
          >
            <StepSummary
              formData={summaryData}
              onEdit={goToStep}
              isSubmitting={isSubmitting}
              onTermsAccepted={(terms, consent) => {
                setTermsAccepted(terms);
                setDataConsent(consent);
              }}
            />
          </motion.div>
        );
      default:
        return null;
    }
  }

  // ─── Render ───────────────────────────────────────────────────────────────

  return (
    <div id="registro" className="w-full max-w-md mx-auto">
      {/* Gradient border wrapper */}
      <div className="p-[2px] rounded-2xl bg-gradient-to-br from-[#BE7753] to-[#F2B38C] shadow-2xl shadow-[#BE7753]/20">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="bg-black rounded-2xl p-6"
      >
        {/* Progress indicator */}
        <ProgressBar currentStep={currentStep} totalSteps={6} />

        {/* Step content with animated transitions */}
        <div className="relative overflow-hidden min-h-[220px]">
          <AnimatePresence mode="wait" custom={direction}>
            {renderStep()}
          </AnimatePresence>
        </div>

        {/* Error banner */}
        {submitError && (
          <div
            role="alert"
            className="mt-4 rounded-lg bg-red-500/15 border border-red-500/30 px-4 py-3 text-sm text-red-300"
          >
            {submitError}
          </div>
        )}

        {/* Navigation buttons — hidden on step 6 because StepSummary has the submit button */}
        {currentStep < 6 && (
          <div className="mt-6 flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={goBack}
                disabled={isSubmitting}
                className="flex-1"
              >
                Atrás
              </Button>
            )}
            <Button
              type="button"
              variant="primary"
              size="md"
              onClick={goNext}
              disabled={isSubmitting}
              className={currentStep === 1 ? 'w-full' : 'flex-1'}
            >
              Continuar
            </Button>
          </div>
        )}

        {/* Back button on summary step */}
        {currentStep === 6 && (
          <div className="mt-3">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={goBack}
              disabled={isSubmitting}
            >
              Atrás
            </Button>
          </div>
        )}
      </form>
      </div>
    </div>
  );
}

export default WizardForm;
