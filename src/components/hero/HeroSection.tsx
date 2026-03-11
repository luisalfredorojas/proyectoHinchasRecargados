'use client';

import { motion } from 'framer-motion';

export default function HeroSection() {
  const handleParticipate = () => {
    const target = document.getElementById('registro');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      aria-label="Hero Hinchas Recargados"
      className="relative flex flex-col items-center justify-center overflow-hidden min-h-screen lg:min-h-[80vh] hero-bg"
    >
      {/* Duracell logo placeholder */}
      <div className="absolute top-6 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-10">
        <div
          className="flex items-center justify-center w-[200px] h-[80px] border border-[#BE7753]/40 rounded-lg"
          aria-label="Logo Duracell (placeholder)"
        >
          <span
            className="text-2xl font-bold tracking-[0.25em]"
            style={{ color: '#BE7753', fontFamily: 'var(--font-bebas)' }}
          >
            DURACELL
          </span>
        </div>
      </div>

      {/* Main layout: flex row on desktop, stacked on mobile */}
      <div className="relative z-10 flex flex-col lg:flex-row items-center justify-center w-full max-w-7xl mx-auto px-4 pt-32 pb-40 lg:pt-20 lg:pb-20 gap-10 lg:gap-0">
        {/* Left: Hero content */}
        <div className="flex flex-col items-center lg:items-start text-center lg:text-left lg:w-1/2 gap-6">
          {/* Main title */}
          <motion.h1
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="text-4xl sm:text-6xl lg:text-7xl font-bold uppercase leading-none tracking-tight"
            style={{
              color: '#BE7753',
              fontFamily: 'var(--font-bebas)',
              textShadow: '0 0 20px #BE7753, 0 0 40px #BE7753',
            }}
          >
            ¡Hinchas
            <br />
            Recargados!
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: 'easeOut' }}
            className="text-base sm:text-lg lg:text-xl text-white/80 max-w-md"
          >
            Compra Duracell y participa por increíbles premios
          </motion.p>

          {/* CTA button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            onClick={handleParticipate}
            className="mt-2 px-8 py-4 rounded-xl font-bold text-base sm:text-lg uppercase tracking-widest text-black transition-all duration-300 hover:brightness-110 hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753] focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            style={{
              background: 'linear-gradient(to right, #BE7753 0%, #F2B38C 100%)',
              boxShadow: '0 0 24px rgba(190, 119, 83, 0.5)',
            }}
            aria-label="Ir a la sección de registro"
          >
            ¡Participa Ahora!
          </motion.button>
        </div>

        {/* Right: Mascot placeholder */}
        <div className="flex items-center justify-center lg:w-1/2">
          <motion.div
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' }}
            className="flex items-center justify-center w-[300px] h-[300px] border-2 border-dashed border-[#BE7753] rounded-lg text-center p-6"
            aria-label="Imagen del Conejo Duracell (placeholder)"
          >
            {/* Bunny outline icon */}
            <div className="flex flex-col items-center gap-3">
              <svg
                width="80"
                height="80"
                viewBox="0 0 80 80"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                {/* Ears */}
                <ellipse cx="28" cy="22" rx="8" ry="18" stroke="#BE7753" strokeWidth="2.5" />
                <ellipse cx="52" cy="22" rx="8" ry="18" stroke="#BE7753" strokeWidth="2.5" />
                {/* Head */}
                <circle cx="40" cy="46" r="18" stroke="#BE7753" strokeWidth="2.5" />
                {/* Eyes */}
                <circle cx="33" cy="42" r="2.5" fill="#BE7753" />
                <circle cx="47" cy="42" r="2.5" fill="#BE7753" />
                {/* Nose */}
                <ellipse cx="40" cy="50" rx="3" ry="2" fill="#BE7753" />
              </svg>
              <span className="text-sm text-[#BE7753]/80 font-medium leading-snug">
                Imagen del Conejo Duracell
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom green grass strip */}
      <div
        className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none"
        style={{
          background: 'linear-gradient(to top, rgba(45, 140, 60, 0.30), transparent)',
        }}
        aria-hidden="true"
      />
    </section>
  );
}
