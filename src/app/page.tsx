'use client';

import { useState } from 'react';
import { WizardForm } from '@/components/wizard/WizardForm';
import SuccessModal from '@/components/SuccessModal';
import type { PrizeType } from '@/types';

// ── Landing / Splash Screen ──────────────────────────────────────────────────

function LandingScreen({ onParticipate }: { onParticipate: () => void }) {
  return (
    <>
      {/* ── MOBILE landing ── */}
      <section className="lg:hidden min-h-screen flex flex-col justify-end bg-black bg-[url('/images/bg-mobile.png')] bg-[length:100%_auto] bg-top bg-no-repeat">
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent px-6 pt-16 mobile-safe-bottom text-center">
          {/* Main heading */}
          <h1 className="font-bold text-white uppercase leading-none tracking-wide mb-1" style={{ fontSize: '3rem' }}>
            COMPRA PILAS
          </h1>
          <h1 className="font-bold text-white uppercase leading-none tracking-wide mb-3" style={{ fontSize: '3rem' }}>
            DURACELL
          </h1>

          {/* Sub-heading in brand copper */}
          <p className="text-2xl font-bold uppercase leading-tight mb-2" style={{ color: '#BE7753' }}>
            INGRESA TUS FACTURAS
          </p>

          {/* Tagline */}
          <p className="font-bold text-white uppercase leading-none tracking-wide mb-8" style={{ fontSize: '2.5rem' }}>
            Y PARTICIPA POR INCREIBLES PREMIOS
          </p>

          {/* CTA button */}
          <button
            type="button"
            onClick={onParticipate}
            className="block w-full text-center font-bold text-lg py-4 rounded-xl bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black transition-all duration-300 active:scale-[0.97] hover:brightness-110 uppercase tracking-widest"
          >
            PARTICIPAR
          </button>
        </div>
      </section>

      {/* ── DESKTOP landing ── */}
      <main className="hidden lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-screen bg-black bg-[url('/images/bg-desktop.png')] bg-cover bg-top">
        {/* Left side — background fills this */}
        <div />

        {/* Right side — landing copy + CTA */}
        <div className="flex items-center justify-center px-8 py-16 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="w-full max-w-md">
            {/* Main heading */}
            <h1 className="font-bold text-white uppercase leading-none tracking-wide mb-1" style={{ fontSize: '3rem' }}>
              COMPRA PILAS
            </h1>
            <h1 className="font-bold text-white uppercase leading-none tracking-wide mb-4" style={{ fontSize: '3rem' }}>
              DURACELL
            </h1>

            {/* Sub-heading in brand copper */}
            <p className="text-3xl font-bold uppercase leading-tight mb-3" style={{ color: '#BE7753' }}>
              INGRESA TUS FACTURAS
            </p>

            {/* Tagline */}
            <p className="font-bold text-white uppercase leading-none tracking-wide mb-10" style={{ fontSize: '2.5rem' }}>
              Y PARTICIPA POR INCREIBLES PREMIOS
            </p>

            {/* CTA button */}
            <button
              type="button"
              onClick={onParticipate}
              className="block w-full text-center font-bold text-xl py-5 rounded-xl bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black transition-all duration-300 hover:brightness-110 uppercase tracking-widest"
            >
              PARTICIPAR
            </button>
          </div>
        </div>
      </main>
    </>
  );
}

// ── Main page ────────────────────────────────────────────────────────────────

export default function Home() {
  const [showLanding, setShowLanding] = useState(true);
  const [showSuccess, setShowSuccess] = useState(false);
  const [prizeType, setPrizeType] = useState<PrizeType | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleParticipate = () => {
    setShowLanding(false);
    // Give React a tick to render the form section before scrolling
    setTimeout(() => {
      document.getElementById('registro')?.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleSuccess = (receivedPrizeType: string) => {
    setPrizeType(receivedPrizeType as PrizeType);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setPrizeType(null);
    setFormKey((k) => k + 1);
  };

  // Show landing splash screen until user clicks PARTICIPAR
  if (showLanding) {
    return <LandingScreen onParticipate={handleParticipate} />;
  }

  return (
    <>
      {/* ── MOBILE: Section 1 — Full-screen hero ── */}
      <section className="lg:hidden min-h-screen flex flex-col justify-end bg-black bg-[url('/images/bg-mobile.png')] bg-[length:100%_auto] bg-top bg-no-repeat">
        <div className="p-6 mobile-safe-bottom">
          <a
            href="#registro"
            className="block w-full text-center font-bold text-lg py-4 rounded-xl bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black transition-all duration-300 active:scale-[0.97] hover:brightness-110"
          >
            ¡Participa ya!
          </a>
        </div>
      </section>

      {/* ── MOBILE: Section 2 — Form ── */}
      <section id="registro" className="lg:hidden min-h-screen flex items-start justify-center px-4 pt-10 pb-12 bg-black">
        <div className="w-full max-w-md">
          <WizardForm key={formKey} onSuccess={handleSuccess} />
        </div>
      </section>

      {/* ── DESKTOP: Single section — grid: left empty (background), right form ── */}
      <main className="hidden lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-screen bg-black bg-[url('/images/bg-desktop.png')] bg-cover bg-top">
        {/* Left side — empty, background will fill this */}
        <div />
        {/* Right side — form, vertically centered */}
        <div className="flex items-center justify-center px-8 py-12">
          <div className="w-full max-w-md">
            <WizardForm key={formKey} onSuccess={handleSuccess} />
          </div>
        </div>
      </main>

      {/* Success modal */}
      {showSuccess && prizeType !== null && (
        <SuccessModal
          isOpen={showSuccess}
          prizeType={prizeType}
          onClose={handleCloseModal}
        />
      )}
    </>
  );
}
