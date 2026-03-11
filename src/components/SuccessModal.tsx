'use client';

import { motion } from 'framer-motion';
import { Modal } from '@/components/ui/Modal';
import { getPrizeMessage } from '@/lib/constants';
import type { PrizeType } from '@/types';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  prizeType: PrizeType;
}

// ─── Confetti particle config ─────────────────────────────────────────────────

const CONFETTI_PARTICLES = Array.from({ length: 16 }, (_, i) => {
  const angle = (i / 16) * 2 * Math.PI;
  const radius = 90 + Math.random() * 40;
  return {
    id: i,
    x: Math.cos(angle) * radius,
    y: Math.sin(angle) * radius,
    size: 5 + Math.random() * 6,
    delay: Math.random() * 0.25,
  };
});

// ─── Prize icons ──────────────────────────────────────────────────────────────

function CinemaIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Cine en casa"
    >
      <rect x="4" y="10" width="40" height="26" rx="3" stroke="#BE7753" strokeWidth="2.5" />
      <circle cx="24" cy="23" r="7" stroke="#BE7753" strokeWidth="2.5" />
      <path d="M21 23l6 3-6 3V23z" fill="#BE7753" />
      <path d="M12 36v4M36 36v4M16 40h16" stroke="#BE7753" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  );
}

function JerseyIcon() {
  return (
    <svg
      width="48"
      height="48"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Camiseta Ecuador"
    >
      <path
        d="M16 6l-10 8 4 4 2-2v26h24V16l2 2 4-4-10-8c-1 3-5 5-12 5S17 9 16 6z"
        stroke="#BE7753"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      {/* Ecuador stripe */}
      <path d="M17 20h14" stroke="#2D8C3C" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 26h14" stroke="#BE7753" strokeWidth="3" strokeLinecap="round" />
      <path d="M17 32h14" stroke="#cc0000" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

function CheckmarkIcon() {
  return (
    <div
      className="flex items-center justify-center w-16 h-16 rounded-full"
      style={{ background: '#2D8C3C' }}
      aria-hidden="true"
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 16l8 8 12-14"
          stroke="white"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function SuccessModal({ isOpen, onClose, prizeType }: SuccessModalProps) {
  const prizeMessage = getPrizeMessage(prizeType);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative flex flex-col items-center text-center px-8 py-10 gap-5 overflow-hidden">

        {/* Confetti burst — renders on mount while modal is open */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          aria-hidden="true"
        >
          {CONFETTI_PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 1, x: 0, y: 0, scale: 0 }}
              animate={{
                opacity: [1, 1, 0],
                x: p.x,
                y: p.y,
                scale: [0, 1.2, 0.8],
              }}
              transition={{
                duration: 1.0,
                delay: p.delay,
                ease: 'easeOut',
              }}
              style={{
                position: 'absolute',
                width: p.size,
                height: p.size,
                borderRadius: '50%',
                background: '#BE7753',
              }}
            />
          ))}
        </div>

        {/* Checkmark */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 0.45, delay: 0.1, type: 'spring', stiffness: 260, damping: 18 }}
        >
          <CheckmarkIcon />
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="text-2xl font-bold tracking-tight"
          style={{ color: '#BE7753', fontFamily: 'var(--font-bebas)' }}
        >
          ¡Registro exitoso!
        </motion.h2>

        {/* Prize icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          aria-hidden="true"
        >
          {prizeType === 'cine_en_casa' ? <CinemaIcon /> : <JerseyIcon />}
        </motion.div>

        {/* Prize message */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.45 }}
          className="text-lg text-white leading-snug"
        >
          {prizeMessage}
        </motion.p>

        {/* Good luck subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.55 }}
          className="text-base text-white/60 -mt-2"
        >
          ¡Buena suerte!
        </motion.p>

        {/* Close button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.65 }}
          onClick={onClose}
          className="mt-2 px-8 py-3 rounded-xl font-semibold text-sm uppercase tracking-wider transition-all duration-300 hover:bg-gradient-to-r hover:from-[#BE7753] hover:to-[#F2B38C] hover:text-black hover:border-transparent active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
          style={{ border: '2px solid #BE7753', color: '#BE7753' }}
        >
          Cerrar
        </motion.button>
      </div>
    </Modal>
  );
}
