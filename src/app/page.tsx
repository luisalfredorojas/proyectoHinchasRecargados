// ── Pantalla de cierre del concurso ──────────────────────────────────────────
// El concurso "Hinchas Recargados" ha finalizado. Se reemplazó el formulario de
// registro por este mensaje. El flujo del wizard sigue disponible en
// components/wizard si se necesita reactivar.

function ContestEndedContent({ size }: { size: 'mobile' | 'desktop' }) {
  const isDesktop = size === 'desktop';
  return (
    <>
      {/* Etiqueta superior */}
      <p
        className="font-bold uppercase tracking-[0.3em] mb-4"
        style={{ color: '#BE7753', fontSize: isDesktop ? '1rem' : '0.8rem' }}
      >
        HINCHAS RECARGADOS
      </p>

      {/* Título principal */}
      <h1
        className="font-bold text-white uppercase leading-none tracking-wide"
        style={{ fontSize: isDesktop ? '3.5rem' : '2.4rem' }}
      >
        EL CONCURSO
      </h1>
      <h1
        className="font-bold text-white uppercase leading-none tracking-wide mb-5"
        style={{ fontSize: isDesktop ? '3.5rem' : '2.4rem' }}
      >
        HA TERMINADO
      </h1>

      {/* Mensaje secundario */}
      <p
        className="font-bold text-white uppercase leading-tight mb-3"
        style={{ fontSize: isDesktop ? '1.6rem' : '1.25rem' }}
      >
        ¡GRACIAS POR PARTICIPAR!
      </p>

      {/* Anuncio */}
      <p
        className="text-white/80 leading-snug"
        style={{ fontSize: isDesktop ? '1.15rem' : '1rem' }}
      >
        Muy pronto anunciaremos a los participantes ganadores.
      </p>
    </>
  );
}

export default function Home() {
  return (
    <>
      {/* ── MOBILE ── */}
      <section className="lg:hidden min-h-screen flex flex-col justify-end bg-black bg-[url('/images/bg-mobile.png')] bg-[length:100%_auto] bg-top bg-no-repeat">
        <div className="bg-gradient-to-t from-black via-black/90 to-transparent px-6 pt-12 mobile-safe-bottom text-center">
          <ContestEndedContent size="mobile" />
        </div>
      </section>

      {/* ── DESKTOP ── */}
      <main className="hidden lg:grid lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] min-h-screen bg-black bg-[url('/images/bg-desktop.png')] bg-cover bg-top">
        {/* Lado izquierdo — lo llena el fondo */}
        <div />

        {/* Lado derecho — mensaje de cierre */}
        <div className="flex items-center justify-center px-8 py-16 bg-gradient-to-t from-black via-black/80 to-transparent">
          <div className="w-full max-w-md">
            <ContestEndedContent size="desktop" />
          </div>
        </div>
      </main>
    </>
  );
}
