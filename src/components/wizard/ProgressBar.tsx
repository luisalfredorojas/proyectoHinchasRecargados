'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  currentStep: number;
  totalSteps?: number;
}

const STEP_LABELS = ['Nombre', 'Cédula', 'Celular', 'Local', 'Factura', 'Enviar'];

export function ProgressBar({ currentStep, totalSteps = 6 }: ProgressBarProps) {
  return (
    <div className="w-full pb-6 pt-2" aria-label={`Paso ${currentStep} de ${totalSteps}`}>
      {/* Circles + lines in a single flex row */}
      <div className="flex items-center w-full">
        {Array.from({ length: totalSteps }).map((_, i) => {
          const step = i + 1;
          const isCompleted = currentStep > step;
          const isActive = currentStep === step;
          // Line after this circle is filled when this step is completed
          const lineCompleted = currentStep > step;

          return (
            <div key={step} className="flex items-center flex-1 last:flex-none">
              {/* ── Circle ── */}
              <div className="relative shrink-0">
                <motion.div
                  className={[
                    'w-7 h-7 rounded-full flex items-center justify-center',
                    'text-[11px] font-bold border-2 shrink-0',
                    isCompleted
                      ? 'bg-[#2D8C3C] border-[#2D8C3C] text-white'
                      : isActive
                        ? 'bg-[#D4A843] border-[#D4A843] text-black'
                        : 'bg-transparent border-white/20 text-white/40',
                  ].join(' ')}
                  initial={false}
                  animate={{
                    scale: isActive ? 1.12 : 1,
                    boxShadow: isActive
                      ? '0 0 0 4px rgba(212,168,67,0.25)'
                      : '0 0 0 0px rgba(212,168,67,0)',
                  }}
                  transition={{ duration: 0.25 }}
                  aria-current={isActive ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path
                        d="M2 6L5 9L10 3"
                        stroke="white"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  ) : (
                    <span>{step}</span>
                  )}
                </motion.div>

                {/* Label below circle */}
                <span
                  className={[
                    'absolute top-full mt-1 left-1/2 -translate-x-1/2',
                    'text-[9px] font-medium whitespace-nowrap select-none',
                    isCompleted
                      ? 'text-[#2D8C3C]'
                      : isActive
                        ? 'text-[#D4A843]'
                        : 'text-white/30',
                  ].join(' ')}
                >
                  {STEP_LABELS[i]}
                </span>
              </div>

              {/* ── Line segment after circle (not after last) ── */}
              {i < totalSteps - 1 && (
                <div className="flex-1 h-[2px] mx-1 relative overflow-hidden rounded-full">
                  {/* Gray track */}
                  <div className="absolute inset-0 bg-white/15 rounded-full" />
                  {/* Gold fill */}
                  <motion.div
                    className="absolute inset-y-0 left-0 bg-[#D4A843] rounded-full"
                    initial={false}
                    animate={{ width: lineCompleted ? '100%' : '0%' }}
                    transition={{ duration: 0.35, ease: 'easeInOut' }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Spacer so labels don't get clipped */}
      <div className="h-4" />
    </div>
  );
}

export default ProgressBar;
