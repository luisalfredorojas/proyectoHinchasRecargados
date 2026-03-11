'use client';

import { motion } from 'framer-motion';

interface Step {
  number: string;
  title: string;
  icon: React.ReactNode;
}

function ShoppingBagIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M9 10h18l-2 16H11L9 10z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M14 10V8a4 4 0 018 0v2"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CameraIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <rect x="4" y="12" width="28" height="20" rx="3" stroke="currentColor" strokeWidth="2" />
      <circle cx="18" cy="22" r="5" stroke="currentColor" strokeWidth="2" />
      <path d="M13 12l2-4h6l2 4" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
    </svg>
  );
}

function TrophyIcon() {
  return (
    <svg
      width="36"
      height="36"
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M12 6h12v12a6 6 0 01-12 0V6z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M12 10H7a4 4 0 004 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 10h5a4 4 0 01-4 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18 24v4M14 28h8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

const STEPS: Step[] = [
  {
    number: '1',
    title: 'Compra productos Duracell',
    icon: <ShoppingBagIcon />,
  },
  {
    number: '2',
    title: 'Sube tu factura',
    icon: <CameraIcon />,
  },
  {
    number: '3',
    title: '¡Participa por premios!',
    icon: <TrophyIcon />,
  },
];

const containerVariants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.18,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};

export default function HowToParticipate() {
  return (
    <section
      id="como-participar"
      aria-labelledby="how-to-participate-title"
      className="relative py-16 px-4"
      style={{ background: '#0a0a0a' }}
    >
      {/* Subtle dot-grid pattern overlay */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            'radial-gradient(circle, rgba(212,168,67,0.06) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">
        {/* Section title */}
        <motion.h2
          id="how-to-participate-title"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center text-3xl font-bold mb-12 tracking-tight"
          style={{ color: '#BE7753' }}
        >
          ¿Cómo participar?
        </motion.h2>

        {/* Steps grid */}
        <motion.div
          className="flex flex-col md:flex-row items-center justify-center gap-10 md:gap-6 lg:gap-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-40px' }}
        >
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              variants={itemVariants}
              className="flex flex-col items-center text-center gap-5 w-full md:w-1/3 max-w-xs"
            >
              {/* Icon with number badge */}
              <div className="relative flex items-center justify-center">
                {/* Circle background */}
                <div
                  className="flex items-center justify-center w-20 h-20 rounded-full"
                  style={{
                    background:
                      'radial-gradient(circle, rgba(212,168,67,0.15) 0%, rgba(212,168,67,0.04) 100%)',
                    border: '2px solid rgba(212,168,67,0.5)',
                  }}
                >
                  <span className="text-[#BE7753]">{step.icon}</span>
                </div>

                {/* Step number badge */}
                <div
                  className="absolute -top-2 -right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-black"
                  style={{ background: '#BE7753' }}
                  aria-label={`Paso ${step.number}`}
                >
                  {step.number}
                </div>
              </div>

              {/* Connector line (desktop only, between steps) */}
              {index < STEPS.length - 1 && (
                <div
                  aria-hidden="true"
                  className="hidden md:block absolute"
                  style={{
                    width: '60px',
                    height: '2px',
                    background: 'linear-gradient(to right, #BE7753, transparent)',
                    right: '-30px',
                    top: '40px',
                  }}
                />
              )}

              {/* Step title */}
              <p className="text-white text-base font-semibold leading-snug px-2">
                {step.title}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
