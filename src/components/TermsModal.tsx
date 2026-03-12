'use client';

import { useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

interface TermsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

function CloseIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className="h-5 w-5"
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        clipRule="evenodd"
      />
    </svg>
  );
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

const contentVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 300, damping: 28 },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: { duration: 0.18, ease: 'easeIn' as const },
  },
};

export function TermsModal({ isOpen, onClose }: TermsModalProps) {
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';
      requestAnimationFrame(() => closeButtonRef.current?.focus());
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          key="terms-overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby="terms-title"
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          onClick={handleOverlayClick}
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="hidden"
          transition={{ duration: 0.22 }}
          style={{
            backgroundColor: 'rgba(0,0,0,0.80)',
            backdropFilter: 'blur(4px)',
            WebkitBackdropFilter: 'blur(4px)',
          }}
        >
          <motion.div
            key="terms-content"
            variants={contentVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="relative w-full max-w-lg p-[2px] rounded-2xl bg-gradient-to-br from-[#BE7753] to-[#F2B38C] shadow-2xl shadow-[#BE7753]/20"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-black rounded-2xl max-h-[85vh] flex flex-col">
              {/* Header */}
              <div className="flex items-start justify-between gap-4 p-6 pb-4 border-b border-white/10">
                <h2
                  id="terms-title"
                  className="text-base font-bold text-white leading-snug pr-8"
                >
                  Términos y Condiciones de la Campaña
                  <span className="block text-[#F2B38C]">&ldquo;Hinchas Recargados Duracell&rdquo;</span>
                </h2>
                <button
                  ref={closeButtonRef}
                  type="button"
                  onClick={onClose}
                  aria-label="Cerrar términos y condiciones"
                  className={[
                    'absolute top-4 right-4',
                    'flex items-center justify-center',
                    'h-8 w-8 rounded-full shrink-0',
                    'text-white/60 hover:text-white',
                    'bg-white/10 hover:bg-white/20',
                    'transition-all duration-150',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]/60',
                  ].join(' ')}
                >
                  <CloseIcon />
                </button>
              </div>

              {/* Scrollable body */}
              <div className="overflow-y-auto p-6 pt-4 space-y-4 text-sm text-white/80 leading-relaxed">
                <p>
                  El presente documento tiene por objeto determinar las bases y condiciones legales
                  aplicables a la campaña denominada{' '}
                  <strong className="text-white">&ldquo;MEGA PROMO&rdquo;</strong> (en adelante &ldquo;la Promoción&rdquo;)
                  que realiza la compañía <strong className="text-white">CALBAQ S.A.</strong> (en
                  adelante &ldquo;Promotora&rdquo;).
                </p>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    1. CONDICIONES GENERALES DE LA PROMOCIÓN
                  </h3>
                  <ul className="space-y-1.5 list-none">
                    <li>
                      <strong className="text-white/90">Período de vigencia:</strong> La promoción
                      estará vigente desde el 01 de abril hasta el 30 de mayo del 2026.
                    </li>
                    <li>
                      <strong className="text-white/90">Establecimientos participantes:</strong> Los
                      locales comerciales &ldquo;Kywi&rdquo; y &ldquo;MegaKywi&rdquo;, en tiendas físicas y a través de
                      plataforma virtual, a nivel nacional.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    2. MECÁNICA DE LA PROMOCIÓN
                  </h3>
                  <p>
                    Por la compra de pilas marca Duracell realizadas en Kywi o MegaKywi, los
                    clientes podrán participar en el sorteo de un{' '}
                    <strong className="text-white">&ldquo;Cine en Casa Duracell&rdquo;</strong>, que incluye:
                  </p>
                  <ul className="mt-2 space-y-1 list-disc list-inside text-white/70">
                    <li>1 televisor de 55 pulgadas</li>
                    <li>1 butaca reclinable</li>
                    <li>1 barra de sonido</li>
                  </ul>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5">Forma de participación</h4>
                  <ul className="space-y-2 list-none">
                    <li>
                      Durante el período de vigencia, los clientes que compren pilas Duracell en
                      Kywi o MegaKywi podrán participar en el sorteo.
                    </li>
                    <li>
                      Para que la participación sea válida, el cliente deberá escanear el código QR
                      presente en los materiales promocionales y acceder al sitio web{' '}
                      <strong className="text-white">HinchasRecargados.com</strong>.
                    </li>
                    <li>
                      El participante deberá completar el formulario de registro con la información
                      solicitada: nombre completo, número de identificación, teléfono, correo
                      electrónico y ciudad.
                    </li>
                    <li>
                      Deberá cargar una fotografía clara y legible de la factura o comprobante de
                      compra en la que se evidencie la compra de pilas Duracell en Kywi o MegaKywi
                      dentro del período de la promoción.
                    </li>
                    <li>
                      Cada factura válida registrada equivale a una (1) participación en el sorteo.
                      Si un participante realiza múltiples compras, podrá registrar cada factura por
                      separado para obtener participaciones adicionales.
                    </li>
                    <li>
                      Las facturas registradas deberán corresponder exclusivamente a compras
                      realizadas dentro del período de vigencia de la promoción.
                    </li>
                    <li>
                      El organizador se reserva el derecho de verificar la autenticidad de las
                      facturas y podrá solicitar el comprobante original en caso de resultar ganador.
                    </li>
                    <li>
                      No se aceptarán facturas ilegibles, alteradas, duplicadas o que no permitan
                      verificar claramente la compra de productos Duracell en los establecimientos
                      participantes.
                    </li>
                    <li>
                      Cada factura o comprobante de compra podrá ser registrado únicamente una vez
                      y por un solo participante. No se permitirá que una misma factura sea
                      utilizada para más de un registro o por más de una persona.
                    </li>
                  </ul>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    3. LIMITACIONES DE LA PROMOCIÓN
                  </h3>
                  <p>
                    a) Se deja constancia que existe un determinado stock de premios distribuidos en
                    los diferentes establecimientos participantes, por lo que se podrán adquirir
                    según el abastecimiento que exista en cada caso y hasta agotar stock.
                  </p>
                  <p className="mt-2">
                    h) El cliente otorga su consentimiento voluntario para que por motivo de esta
                    promoción la compañía incluya sus datos personales en sus bases de datos y pueda
                    dar tratamiento a los mismos, en cumplimiento de su Política de Privacidad y de
                    la normativa vigente respecto a la protección y tratamiento de datos personales.
                    Esto incluye: contacto con los participantes sobre reclamos, sugerencias,
                    comentarios; análisis de preferencias y hábitos de consumo; elaboración de
                    perfiles; envío de publicidad; uso de herramientas de inteligencia artificial o
                    aprendizaje automático; prestación y personalización de las funciones de las
                    apps y sitios web de COMERCIAL KYWI; desarrollo de nuevas funciones y mejoras;
                    cumplimiento de obligaciones legales y contractuales; detección de fraudes;
                    encuestas y sorteos.
                  </p>
                  <p className="mt-2">
                    Los fines detallados se ejercerán mediante comunicación a través de medios
                    electrónicos, llamadas telefónicas, correspondencia escrita o medios digitales,
                    correos electrónicos y mensajes de texto.
                  </p>
                  <p className="mt-2">
                    El cliente declara conocer que puede ejercer los derechos que la ley le asista,
                    por ejemplo el de eliminación y oposición, mediante comunicación dirigida a{' '}
                    <strong className="text-white">promociones@kywi.com.ec</strong>. Comercial Kywi
                    S.A. se compromete a resguardar la información que reciba por parte del cliente,
                    así como también mantener la confidencialidad pertinente respecto de la misma.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    4. MODIFICACIÓN DE LOS TÉRMINOS Y CONDICIONES
                  </h3>
                  <p>
                    En caso de resultar necesario, y/o a discreción de Comercial Kywi S.A., ésta se
                    reserva el derecho de ampliar y/o aclarar el alcance de los presentes Términos
                    y Condiciones.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">5. DIVULGACIÓN</h3>
                  <p>
                    Los presentes Términos y Condiciones se encuentran disponibles para su consulta
                    durante toda la vigencia de la campaña. Cualquier leyenda en la actividad que
                    haga referencia a &ldquo;consulte más información&rdquo;, &ldquo;para más información&rdquo; o &ldquo;aplican
                    términos y condiciones&rdquo;, se referirán a este documento.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    6. NOTIFICACIÓN DEL GANADOR Y ENTREGA DEL PREMIO
                  </h3>
                  <ul className="space-y-2 list-none">
                    <li>
                      Una vez realizado el sorteo, el organizador se contactará con el participante
                      seleccionado utilizando los datos registrados en el formulario.
                    </li>
                    <li>
                      El contacto se realizará a través de: llamada telefónica, correo electrónico
                      y mensaje de texto o WhatsApp.
                    </li>
                    <li>
                      El participante seleccionado dispondrá de un plazo máximo de{' '}
                      <strong className="text-white">siete (7) días calendario</strong>, contados
                      desde el primer intento de contacto, para responder y confirmar la aceptación
                      del premio.
                    </li>
                    <li>
                      En caso de no recibirse respuesta dentro del plazo, el participante perderá
                      automáticamente su condición de ganador y el premio será sorteado nuevamente.
                    </li>
                    <li>
                      El organizador podrá solicitar al ganador la presentación de la factura
                      original registrada y un documento de identificación antes de la entrega del
                      premio.
                    </li>
                  </ul>
                </section>

                {/* Bottom close button */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className={[
                      'w-full py-3 rounded-xl font-semibold text-sm',
                      'bg-gradient-to-r from-[#BE7753] to-[#F2B38C] text-black',
                      'hover:opacity-90 transition-opacity duration-150',
                      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BE7753]',
                    ].join(' ')}
                  >
                    Entendido
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default TermsModal;
