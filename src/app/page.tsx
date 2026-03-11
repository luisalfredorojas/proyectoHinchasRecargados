'use client';

import { useState } from 'react';
import { WizardForm } from '@/components/wizard/WizardForm';
import SuccessModal from '@/components/SuccessModal';
import type { PrizeType } from '@/types';

export default function Home() {
  const [showSuccess, setShowSuccess] = useState(false);
  const [prizeType, setPrizeType] = useState<PrizeType | null>(null);
  const [formKey, setFormKey] = useState(0);

  const handleSuccess = (receivedPrizeType: string) => {
    setPrizeType(receivedPrizeType as PrizeType);
    setShowSuccess(true);
  };

  const handleCloseModal = () => {
    setShowSuccess(false);
    setPrizeType(null);
    setFormKey((k) => k + 1);
  };

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
      <main className="hidden lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-screen bg-black bg-[url('/images/bg-desktop.png')] bg-cover bg-center">
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
