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
                  Los presentes Términos y Condiciones de la Promoción (en adelante referidos como los
                  &ldquo;Términos y Condiciones&rdquo;) regulan la promoción temporal denominada{' '}
                  <strong className="text-white">&ldquo;Hinchas Recargados DURACELL®&rdquo;</strong> (en adelante
                  la &ldquo;Promoción&rdquo;). El contenido y las bases de la Promoción están disponibles en todo
                  momento en la web de la promoción: www.hinchasrecargados.com (en adelante la &ldquo;web de
                  la promoción&rdquo;) la cual se regirá bajo las siguientes reglas y condiciones:
                </p>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 1: ORGANIZADOR/PROPIETARIO
                  </h3>
                  <p>
                    La Promoción pertenece exclusivamente a la empresa{' '}
                    <strong className="text-white">CALBAQ S.A. ECUADOR</strong>, empresa que es
                    distribuidor exclusivo en la República del Ecuador de la marca DURACELL®; y que de
                    ahora en adelante se denominará como &ldquo;EL PATROCINADOR o EL ORGANIZADOR&rdquo;. La
                    Promoción se llevará a cabo en compras de productos DURACELL® (anexo 1) realizadas
                    en las tiendas que forman parte de Coral Hipermercados, Kywi, Promart, Pharmacys,
                    Fybeca, TIA y de conformidad con los Términos y Condiciones.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 2: GENERALIDADES
                  </h3>
                  <p>
                    Al participar en la Promoción, los concursantes aceptan que el contenido y el
                    alcance legal de los Términos y Condiciones son de su entera responsabilidad. Se
                    informa a los participantes que la lectura y comprensión completa de estos
                    términos es crucial antes de participar en la Promoción, por lo que{' '}
                    <strong className="text-white">EL PATROCINADOR</strong> no asume responsabilidad
                    por la falta de lectura o comprensión de estos Términos y Condiciones por parte de
                    los participantes.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    2.1 Elegibilidad para Participar
                  </h4>
                  <p>
                    La Promoción está disponible exclusivamente para residentes de la República del
                    Ecuador mayores de 18 años.
                  </p>
                  <p className="mt-2">
                    El Participante está de acuerdo que para efectos de poder reclamar o redimir el
                    premio será obligatorio comprobar la mayoría de edad y que la identidad del
                    participante coincida con la identificación correspondiente, así mismo, deberá
                    cumplir que los demás requisitos que se describen en estos Términos y Condiciones
                    para participar en la Promoción.
                  </p>
                  <p className="mt-2">
                    Por lo anterior, <strong className="text-white">EL PATROCINADOR</strong> se
                    reserva el derecho de no entregar el premio si no se cumple con este requisito,
                    por lo que únicamente se aceptarán como documentos de identificación válidos los
                    siguientes:
                  </p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>Cédula de ciudadanía</li>
                    <li>Pasaporte</li>
                  </ul>
                  <p className="mt-2">
                    Quedan excluidos de participar en la Promoción los empleados de{' '}
                    <strong className="text-white">EL PATROCINADOR</strong>, sus familiares directos y
                    cualquier persona vinculada profesionalmente con la Promoción. Tampoco podrán
                    participar los empleados de los establecimientos participantes: Coral
                    Hipermercados, Kywi, Promart, Pharmacys, Fybeca y TIA.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    2.2. Vigencia y cobertura geográfica
                  </h4>
                  <p>
                    La Promoción tendrá una duración definida en los establecimientos Coral
                    Hipermercados, Kywi, Promart, Pharmacys, Fybeca y TIA con vigencia desde el{' '}
                    <strong className="text-white">15 de abril de 2026 a las 00h00 hasta el 15 de
                    junio de 2026 a las 23h59</strong>, ambas fechas inclusive. Cualquier factura con
                    fecha u hora anterior o posterior a este período será anulada automáticamente sin
                    derecho a reclamo. Válida en la República del Ecuador en los lugares específicos
                    en donde haya cualquiera de los establecimientos indicados anteriormente.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    2.3. Modificaciones a los Términos y Condiciones
                  </h4>
                  <p>
                    <strong className="text-white">EL PATROCINADOR</strong> se reserva el derecho de
                    modificar total o parcialmente estos Términos y Condiciones en cualquier momento,
                    notificando a los participantes a través de la web de la promoción. Las
                    modificaciones entrarán en vigor a partir del momento de su publicación.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 3. MECÁNICA DE LA PARTICIPACIÓN
                  </h3>

                  <h4 className="text-white/90 font-semibold mt-2 mb-1.5 underline">
                    3.1 Participación
                  </h4>
                  <p>
                    Al acceder, registrarse y participar en la web de la promoción &ldquo;Hinchas
                    Recargados DURACELL®&rdquo;, el participante declara haber leído, entendido y aceptado
                    íntegramente los presentes Términos y Condiciones.
                  </p>
                  <p className="mt-2">
                    Asimismo, el participante autoriza el tratamiento de sus datos personales, los
                    cuales serán utilizados exclusivamente para la gestión de la promoción, validación
                    de participación y contacto con los posibles ganadores, conforme a lo establecido
                    en la Ley Orgánica de Protección de Datos Personales del Ecuador.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5">
                    Mecánica de la promoción
                  </h4>
                  <p>
                    Para participar en la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, los interesados
                    deberán cumplir con los siguientes pasos:
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1">
                    Paso 1: Compra de producto(s) participantes en locales autorizados.
                  </h4>
                  <p>
                    Adquirir cualquier producto DURACELL® (Anexo 1) durante el período de vigencia de
                    la promoción en cualquiera de los siguientes establecimientos participantes:
                  </p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>Coral Hipermercados</li>
                    <li>Kywi</li>
                    <li>Promart</li>
                    <li>Pharmacys</li>
                    <li>Fybeca</li>
                    <li>TIA</li>
                  </ul>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1">
                    Paso 2: Emisión de factura legal
                  </h4>
                  <p>
                    Solicitar una <strong className="text-white">factura válida emitida con número de
                    cédula de identidad del participante</strong> al momento de realizar la compra de
                    productos <strong className="text-white">DURACELL®</strong> en los
                    establecimientos participantes.
                  </p>
                  <p className="mt-2">
                    No serán válidas facturas emitidas con la leyenda{' '}
                    <strong className="text-white">&ldquo;consumidor final&rdquo;</strong>, con números
                    genéricos, ni comprobantes sin identificación del comprador.
                  </p>
                  <p className="mt-2">
                    En caso de que la factura se encuentre emitida a nombre de un tercero distinto del
                    participante registrado en la promoción, el participante deberá presentar:
                  </p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>copia del documento de identidad del titular de la factura;</li>
                    <li>copia de la factura registrada;</li>
                    <li>
                      carta de autorización firmada por el titular de la factura autorizando el uso de
                      dicha factura para participar en la promoción y recibir el premio.
                    </li>
                  </ul>
                  <p className="mt-2">
                    Cada factura válida registrada corresponderá a una{' '}
                    <strong className="text-white">(1) participación independiente</strong> en el
                    sorteo. El organizador se reserva el derecho de verificar la{' '}
                    <strong className="text-white">autenticidad, unicidad y validez</strong> de la
                    factura registrada como requisito previo para la participación y eventual entrega
                    del premio.
                  </p>
                  <p className="mt-2 font-semibold text-white">
                    El monto mínimo de compra es de $5
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1">
                    Paso 3: Registro en la web
                  </h4>
                  <p>
                    Cargando foto donde se vea claramente: RUC del local, número de factura, fecha,
                    descripción del producto Duracell y total.
                  </p>
                  <p className="mt-2">
                    Una vez realizada la compra, el participante deberá ingresar a la web de la
                    promoción mediante el escaneo del código QR disponible en el material promocional
                    ubicado en los establecimientos participantes; o accediendo directamente a:{' '}
                    <strong className="text-white">www.hinchasrecargados.com</strong>
                  </p>
                  <p className="mt-2">
                    Dentro de la web de la promoción, el participante deberá completar un formulario
                    de registro con la siguiente información:
                  </p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>nombre completo;</li>
                    <li>número de cédula;</li>
                    <li>número de teléfono;</li>
                    <li>ciudad y provincia;</li>
                    <li>establecimiento participante donde realizó la compra.</li>
                  </ul>
                  <p className="mt-2">
                    Adicionalmente, deberá subir una fotografía clara y legible de la factura o
                    comprobante de compra, en la cual se pueda verificar: el establecimiento
                    participante; la fecha de compra dentro del período de vigencia; la compra de al
                    menos un producto DURACELL® (anexo 1).
                  </p>
                  <p className="mt-2">
                    Un mismo participante podrá registrar más de una compra utilizando la misma
                    cédula, incluso en diferentes establecimientos participantes. Sin embargo, cada
                    participante podrá ser acreedor únicamente a un (1) premio durante toda la
                    promoción.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1">
                    Paso 4: Validación automática (o manual) de la factura
                  </h4>
                  <p>
                    Validación contra la base de datos para evitar duplicidad de fotos de la misma
                    factura.
                  </p>
                  <p className="mt-2">
                    Los ganadores serán seleccionados mediante sorteo aleatorio, entre todos los
                    participantes que hayan cumplido correctamente con los requisitos establecidos en
                    estos Términos y Condiciones. Los sorteos se realizarán hasta cumplidos los quince
                    (15) días calendario posteriores a la finalización de la vigencia de la promoción,
                    en presencia de un Notario Público, quien certificará la transparencia del proceso.
                  </p>
                  <p className="mt-2 font-semibold text-white/90">
                    Los premios serán asignados por establecimiento participante de la siguiente
                    manera:
                  </p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>Coral Hipermercados — 1 ganador: 1 premio Cine en Casa</li>
                    <li>Kywi — 2 ganadores: cada uno recibirá 1 premio Cine en Casa</li>
                    <li>Promart — 1 ganador: 1 premio Cine en Casa</li>
                    <li>Pharmacys — 13 ganadores: cada uno recibirá 1 camiseta deportiva original marca Marathon</li>
                    <li>Fybeca — 13 ganadores: cada uno recibirá 1 camiseta deportiva original marca Marathon</li>
                    <li>TIA — 6 Televisor Pantalla LED 4K de 55&ldquo;, 10 Camisetas Originales marca Marathon, 20 balones Originales Mundial, 4 tarjetas de regalo en montos diferenciados</li>
                  </ul>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    3.3 Medios de difusión de la dinámica:
                  </h4>
                  <p>
                    La Promoción se comunicará en las tiendas participantes mediante material POP como:
                    Banner, Vibrines, Laterales de Checkout, Artes en Minicabeceras, Sticker en los
                    productos, Muebles brandeados con la promoción y Redes Sociales.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 4. ENTREGA DE PREMIOS
                  </h3>

                  <h4 className="text-white/90 font-semibold mt-2 mb-1.5 underline">4.1 Premios:</h4>
                  <p className="font-semibold text-white/90">a. Premio &ldquo;Cine en Casa&rdquo; incluye:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-white/70">
                    <li>1 Televisor Pantalla LED 4K de 55&ldquo;</li>
                    <li>1 Butaca reclinable</li>
                    <li>1 Barra de sonido</li>
                  </ul>
                  <p className="mt-2 font-semibold text-white/90">b. Premio Camiseta Ecuador:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-white/70">
                    <li>1 camiseta deportiva original de la marca Marathon</li>
                  </ul>
                  <p className="mt-2 font-semibold text-white/90">c. Premios TIA:</p>
                  <ul className="mt-1 space-y-1 list-disc list-inside text-white/70">
                    <li>6 Televisor Pantalla LED 4K de 55&ldquo;</li>
                    <li>10 Camisetas deportivas originales marca Marathon</li>
                    <li>20 balones Originales Mundial</li>
                    <li>4 tarjetas de regalo en montos diferenciados</li>
                  </ul>
                  <p className="mt-2">
                    La talla y color de la camiseta estarán sujetos a disponibilidad de stock al
                    momento de la entrega del premio. Los premios no son transferibles, ni canjeables
                    por dinero en efectivo u otros productos.
                  </p>
                  <p className="mt-2">
                    El ganador será responsable de retirar su premio en el lugar y fecha indicados por
                    el organizador. En caso de solicitar envío a domicilio, los costos de transporte o
                    envío deberán ser asumidos por el ganador, salvo que el organizador determine lo
                    contrario.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    4.2 Notificación y Entrega de Premios:
                  </h4>
                  <p>
                    Los ganadores serán notificados por conducto del personal designado por el
                    organizador de la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, mediante{' '}
                    <strong className="text-white">llamada telefónica o mensaje de texto/WhatsApp</strong>,
                    utilizando los datos proporcionados por el participante en el formulario de
                    registro. Los participantes potencialmente ganadores contarán con un{' '}
                    <strong className="text-white">plazo máximo de dos (2) días calendario</strong>{' '}
                    para responder a la notificación y proporcionar la información y documentación
                    solicitada.
                  </p>
                  <p className="mt-2">
                    En caso de que el participante no responda dentro del plazo establecido, no
                    proporcione la documentación requerida o no sea posible localizarlo mediante los
                    medios de contacto registrados,{' '}
                    <strong className="text-white">
                      el organizador podrá anular la participación y seleccionar a un nuevo ganador
                    </strong>
                    , sin responsabilidad alguna para el organizador o cualquiera de sus socios
                    comerciales.
                  </p>
                  <p className="mt-2">
                    Una vez validada la condición de ganador, el premio deberá ser{' '}
                    <strong className="text-white">
                      retirado en el lugar, ciudad y fecha que el organizador determine
                      oportunamente dentro del territorio ecuatoriano
                    </strong>
                    , con el fin de acreditar la identidad del ganador y verificar el comprobante
                    original de compra.
                  </p>
                  <p className="mt-2">
                    En caso de existir dudas sobre la autenticidad de la participación, el organizador
                    se reserva el derecho de descalificar o excluir al participante o ganador, así
                    como de negar la entrega del premio correspondiente, sin responsabilidad alguna
                    para el organizador.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    5. LIMITACIONES DE RESPONSABILIDAD
                  </h3>
                  <p>
                    El organizador de la promoción y/o{' '}
                    <strong className="text-white">DURACELL®</strong> no serán responsables por
                    cualquier daño, pérdida o perjuicio sufrido por los participantes o ganadores con
                    ocasión de su participación en la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, ni por
                    la aceptación, retiro, entrega, instalación, uso o disfrute de los premios
                    otorgados.
                  </p>
                  <p className="mt-2">
                    <strong className="text-white">EL PATROCINADOR</strong> y/o{' '}
                    <strong className="text-white">DURACELL®</strong> no se hacen responsables por
                    problemas técnicos, errores humanos, fallas en el hardware o software, ni por
                    cualquier otra dificultad técnica que pueda impedir a los participantes
                    inscribirse correctamente en la Promoción o participar en la Web de la Promoción.
                  </p>
                  <p className="mt-2">
                    Todos los resultados y decisiones de{' '}
                    <strong className="text-white">EL PATROCINADOR</strong> relacionados con esta
                    Promoción son definitivos y no están sujetos a revisión o apelación. Los
                    participantes aceptan esta condición al inscribirse en la Promoción.
                  </p>
                  <p className="mt-2">
                    La Promoción &ldquo;Hinchas Recargados&rdquo; no está patrocinada, avalada, administrada ni
                    asociada en modo alguno con las plataformas de redes sociales utilizadas para su
                    difusión. Los participantes eximen de toda responsabilidad a estas plataformas por
                    cualquier daño o perjuicio que pudiera derivarse de su participación en la
                    Promoción.
                  </p>
                  <p className="mt-2">
                    <strong className="text-white">EL PATROCINADOR</strong> y/o{' '}
                    <strong className="text-white">DURACELL®</strong> nunca solicitarán información
                    bancaria, ni requerirán el pago de ninguna cantidad adicional para participar en
                    la Promoción.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 6: DERECHOS DE EL PATROCINADOR Y/O DURACELL®
                  </h3>

                  <h4 className="text-white/90 font-semibold mt-2 mb-1.5 underline">
                    6.1 Exclusión de Participantes:
                  </h4>
                  <p>
                    <strong className="text-white">EL PATROCINADOR</strong> se reserva en todo momento
                    el derecho a excluir a los participantes del proceso si considera que su
                    participación resulta dolosa o fraudulenta, a su entera discreción. Asimismo, se
                    reserva el derecho de no conceder un premio si se infringen de algún modo los
                    presentes Términos y Condiciones.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    6.3 Confidencialidad de los Datos Personales:
                  </h4>
                  <p>
                    <strong className="text-white">EL PATROCINADOR</strong> se compromete a respetar
                    la confidencialidad de los datos personales de los participantes recopilados
                    durante la Promoción y a utilizarlos únicamente con el propósito de administrar la
                    Promoción y comunicarse con los participantes en relación con la misma. Los datos
                    personales no serán compartidos con terceros sin el consentimiento previo de los
                    participantes.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    6.4 Uso de Datos Personales para Promoción:
                  </h4>
                  <p>
                    El Participante acepta que <strong className="text-white">EL PATROCINADOR</strong>{' '}
                    y/o <strong className="text-white">DURACELL®</strong> podrán utilizar su nombre,
                    imagen (fija o en video), voz, opinión, testimonio y demás datos personales con
                    fines promocionales y publicitarios relacionados con la presente Promoción, sin que
                    ello genere compensación económica adicional, salvo indicación expresa en contrario
                    por escrito por parte del propio Participante.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    7. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS
                  </h3>

                  <h4 className="text-white/90 font-semibold mt-2 mb-1.5 underline">
                    7.1 Consentimiento y Finalidad de los Datos Personales
                  </h4>
                  <p>
                    Al participar en esta Promoción, el participante acepta proporcionar sus datos
                    personales a <strong className="text-white">DURACELL®</strong>, quien actúa en
                    calidad de Responsable del Tratamiento de Datos Personales, en los términos
                    establecidos por la Ley Orgánica de Protección de Datos Personales del Ecuador.
                  </p>
                  <p className="mt-2">Los datos serán recolectados y tratados con la finalidad de:</p>
                  <ul className="mt-1.5 space-y-1 list-disc list-inside text-white/70">
                    <li>Administrar y ejecutar la Promoción,</li>
                    <li>Verificar la elegibilidad de los participantes,</li>
                    <li>Contactar y entregar los premios a los ganadores,</li>
                    <li>Realizar comunicaciones exclusivamente relacionadas con la Promoción.</li>
                  </ul>
                  <p className="mt-2">
                    <strong className="text-white">CALBAQ S.A.</strong> en su calidad de Encargado del
                    Tratamiento, realizará el tratamiento de los datos únicamente por cuenta y bajo las
                    instrucciones de DURACELL®, y no podrá utilizarlos para fines propios ni cederlos
                    a terceros sin autorización expresa del Responsable.
                  </p>

                  <h4 className="text-white/90 font-semibold mt-3 mb-1.5 underline">
                    7.3 Eliminación de Datos
                  </h4>
                  <p>
                    <strong className="text-white">DURACELL®</strong>, como Responsable del
                    Tratamiento, se obliga a garantizar que todos los datos personales recolectados
                    sean eliminados una vez finalice la Promoción, y en todo caso a más tardar dentro
                    de los noventa (90) días hábiles siguientes a la entrega de los premios.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 8: JURISDICCIÓN Y RESOLUCIÓN DE CONTROVERSIAS
                  </h3>
                  <p>
                    Cualquier controversia que surja en relación con esta Promoción será resuelta de
                    conformidad con las leyes aplicables de República del Ecuador, y los participantes
                    se someten a la jurisdicción de los tribunales competentes en la ciudad de
                    Guayaquil, Ecuador, renunciando a cualquier otro fuero que pudiera
                    corresponderles por domicilio presente o futuro.
                  </p>
                  <p className="mt-2">
                    En caso de cualquier disputa o reclamación relacionada con la Promoción, los
                    participantes deberán dirigirse primero a{' '}
                    <strong className="text-white">EL PATROCINADOR</strong> para intentar resolver la
                    controversia de manera amistosa.
                  </p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2">
                    ARTÍCULO 9: COMUNICACIÓN OFICIAL
                  </h3>
                  <p>
                    Toda comunicación oficial relacionada con la promoción &ldquo;Hinchas Recargados
                    DURACELL®&rdquo; se realizará exclusivamente a través de la Web de la Promoción y de
                    los medios de contacto que proporcionen los ganadores, así mismo, solo a través de
                    los correos electrónicos provenientes de las direcciones oficiales de{' '}
                    <strong className="text-white">EL PATROCINADOR</strong>. El canal oficial es:{' '}
                    <strong className="text-white">www.hinchasrecargados.com</strong>
                  </p>
                  <p className="mt-2">
                    <strong className="text-white">EL PATROCINADOR</strong> y/o{' '}
                    <strong className="text-white">DURACELL®</strong> nunca solicitarán información
                    bancaria, ni requerirán el pago de ninguna cantidad adicional para participar en
                    la Promoción. Los participantes son responsables de verificar la autenticidad de
                    cualquier comunicación recibida y de tomar las precauciones necesarias para evitar
                    caer en fraudes.
                  </p>

                  <p className="mt-4 text-white/50 text-xs text-center">
                    FECHA DE PUBLICACIÓN: 30 DE MARZO DEL 2026
                  </p>
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
