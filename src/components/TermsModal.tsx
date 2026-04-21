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

                <p>Los presentes Términos y Condiciones de la Promoción (en adelante referidos como los &ldquo;Términos y Condiciones&rdquo;) regulan la promoción temporal denominada &ldquo;Hinchas Recargados DURACELL®&rdquo; (en adelante la &ldquo;Promoción&rdquo;). El contenido y las bases de la Promoción están disponibles en todo momento en la web de la promoción: www.hinchasrecargados.com (en adelante la &ldquo;web de la promoción&rdquo;) la cual se regirá bajo las siguientes reglas y condiciones:</p>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTICULO 1: ORGANIZADOR/PROPIETARIO</h3>
                  <p>La Promoción pertenece exclusivamente a la empresa CALBAQ S.A. ECUADOR, empresa que es distribuidor exclusivo en la República del Ecuador de la marca DURACELL®; y que de ahora en adelante se denominará como &ldquo;EL PATROCINADOR o EL ORGANIZADOR&rdquo;. La Promoción se llevará a cabo en compras de productos DURACELL® (anexo 1) realizadas en las tiendas que forman parte de Coral Hipermercados, Kywi, Promart, Pharmacys, Fybeca, TIA y de conformidad con los Términos y Condiciones.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTÍCULO 2: GENERALIDADES</h3>
                  <p>Al participar en la Promoción, los concursantes aceptan que el contenido y el alcance legal de los Términos y Condiciones son de su entera responsabilidad. Se informa a los participantes que la lectura y comprensión completa de estos términos es crucial antes de participar en la Promoción, por lo que EL PATROCINADOR no asume responsabilidad por la falta de lectura o comprensión de estos Términos y Condiciones por parte de los participantes.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">2.1 Elegibilidad para Participar</h4>
                  <p>La Promoción está disponible exclusivamente para residentes de la República del Ecuador mayores de 18 años.</p>
                  <p className="mt-2">El Participante está de acuerdo que para efectos de poder reclamar o redimir el premio será obligatorio comprobar la mayoría de edad y que la identidad del participante coincida con la identificación correspondiente, así mismo, deberá cumplir que los demás requisitos que se describen en estos Términos y Condiciones para participar en la Promoción.</p>
                  <p className="mt-2">Por lo anterior, EL PATROCINADOR se reserva el derecho de no entregar el premio si no se cumple con este requisito, por lo que únicamente se aceptarán como documentos de identificación válidos los siguientes:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-white/70">
                    <li>Cédula de ciudadanía</li>
                    <li>Pasaporte</li>
                  </ul>
                  <p className="mt-2">Quedan excluidos de participar en la Promoción los empleados de EL PATROCINADOR, sus familiares directos y cualquier persona vinculada profesionalmente con la Promoción. Tampoco podrán participar los empleados de los establecimientos participantes: Coral Hipermercados, Kywi, Promart, Pharmacys, Fybeca y TIA.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">2.2. Vigencia y cobertura geográfica</h4>
                  <p>La Promoción tendrá una duración definida en los establecimientos Coral Hipermercados, Kywi, Promart, Pharmacys, Fybeca y TIA con vigencia desde el <strong className="text-white">15 de abril de 2026 a las 00h00 hasta el 15 de junio de 2026 a las 23h59</strong>, ambas fechas inclusive. Cualquier factura con fecha u hora anterior o posterior a este período será anulada automáticamente sin derecho a reclamo. Válida en la República del Ecuador en los lugares específicos en donde haya cualquiera de los establecimientos indicados anteriormente. Durante este periodo, los participantes tendrán la oportunidad de realizar sus compras de productos DURACELL® (anexo 1) y registrarse para participar en la Promoción que se describe adelante en el artículo 3 siguiente. Es responsabilidad de los participantes asegurarse de que sus compras y registros se realicen dentro de la vigencia indicada anteriormente para ser considerados válidos.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">2.3. Modificaciones a los Términos y Condiciones</h4>
                  <p>EL PATROCINADOR se reserva el derecho de modificar total o parcialmente estos Términos y Condiciones en cualquier momento, notificando a los participantes a través de la web de la promoción. Las modificaciones entrarán en vigor a partir del momento de su publicación.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTICULO 3. MECÁNICA DE LA PARTICIPACIÓN</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">3.1 Participación</h4>
                  <p>Al acceder, registrarse y participar en la web de la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, el participante declara haber leído, entendido y aceptado íntegramente los presentes Términos y Condiciones.</p>
                  <p className="mt-2">Asimismo, el participante autoriza el tratamiento de sus datos personales, los cuales serán utilizados exclusivamente para la gestión de la promoción, validación de participación y contacto con los posibles ganadores, conforme a lo establecido en la Ley Orgánica de Protección de Datos Personales del Ecuador.</p>
                  <p className="mt-2">La información proporcionada y el comprobante cargado serán utilizados únicamente para validar la participación y determinar la elegibilidad del participante dentro del sorteo correspondiente al establecimiento donde realizó la compra.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1">Mecánica de la promoción</h4>
                  <p>Para participar en la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, los interesados deberán cumplir con los siguientes pasos:</p>

                  <p className="mt-3 font-semibold text-white/90">Paso 1: Compra de producto(s) participantes en locales autorizados.</p>
                  <p className="mt-1">Adquirir cualquier producto DURACELL® (Anexo 1) durante el período de vigencia de la promoción en cualquiera de los siguientes establecimientos participantes:</p>
                  <ul className="mt-1 list-none space-y-0.5 text-white/70 pl-2">
                    <li>Coral Hipermercados</li>
                    <li>Kywi</li>
                    <li>Promart</li>
                    <li>Pharmacys</li>
                    <li>Fybeca</li>
                    <li>TIA</li>
                  </ul>

                  <p className="mt-3 font-semibold text-white/90">Paso 2: Emisión de factura legal</p>
                  <p className="mt-1">Solicitar una <strong className="text-white">factura válida emitida con número de cédula de identidad del participante</strong> al momento de realizar la compra de productos <strong className="text-white">DURACELL®</strong> en los establecimientos participantes. No serán válidas facturas emitidas con la leyenda <strong className="text-white">&ldquo;consumidor final&rdquo;</strong>, con números genéricos, ni comprobantes sin identificación del comprador.</p>
                  <p className="mt-2">En caso de que la factura se encuentre emitida a nombre de un tercero distinto del participante registrado en la promoción, el participante deberá presentar:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-white/70">
                    <li>copia del documento de identidad del titular de la factura;</li>
                    <li>copia de la factura registrada;</li>
                    <li>carta de autorización firmada por el titular de la factura autorizando el uso de dicha factura para participar en la promoción y recibir el premio.</li>
                  </ul>
                  <p className="mt-2">La factura deberá corresponder a una compra realizada dentro del período de vigencia de la promoción y en uno de los establecimientos participantes autorizados. Cada factura válida registrada corresponderá a una <strong className="text-white">(1) participación independiente</strong> en el sorteo.</p>
                  <p className="mt-2">El organizador se reserva el derecho de verificar la <strong className="text-white">autenticidad, unicidad y validez</strong> de la factura registrada como requisito previo para la participación y eventual entrega del premio. <strong className="text-white">El monto mínimo de compra es de $5</strong></p>

                  <p className="mt-3 font-semibold text-white/90">Paso 3: Registro en la web cargando foto donde se vea claramente: RUC del local, número de factura, fecha, descripción del producto Duracell y total.</p>
                  <p className="mt-1">Una vez realizada la compra, el participante deberá ingresar a la web de la promoción mediante: el escaneo del código QR disponible en el material promocional ubicado en los establecimientos participantes; o accediendo directamente a la siguiente dirección web:</p>
                  <p className="mt-1 text-white">www.hinchasrecargados.com</p>
                  <p className="mt-2">La página web podrá ser accedida desde dispositivos móviles, tablets o computadoras, independientemente del sistema operativo o navegador utilizado.</p>
                  <p className="mt-2">Dentro de la web de la promoción, el participante deberá completar un formulario de registro con la siguiente información:</p>
                  <ul className="mt-1 list-none space-y-0.5 text-white/70 pl-2">
                    <li>nombre completo;</li>
                    <li>número de cédula;</li>
                    <li>número de teléfono;</li>
                    <li>Ciudad y provincia;</li>
                    <li>establecimiento participante donde realizó la compra.</li>
                  </ul>
                  <p className="mt-2">Adicionalmente, deberá subir una fotografía clara y legible de la factura o comprobante de compra, en la cual se pueda verificar:</p>
                  <ul className="mt-1 list-none space-y-0.5 text-white/70 pl-2">
                    <li>el establecimiento participante;</li>
                    <li>la fecha de compra dentro del período de vigencia;</li>
                    <li>la compra de al menos un producto DURACELL® (anexo 1).</li>
                  </ul>
                  <p className="mt-2">Posterior al registro, el participante deberá aceptar los presentes Términos y Condiciones y autorizar el uso de sus datos personales para efectos de la gestión de la promoción y contacto en caso de resultar ganador.</p>
                  <p className="mt-2">Un mismo participante podrá registrar más de una compra utilizando la misma cédula, incluso en diferentes establecimientos participantes. Sin embargo, cada participante podrá ser acreedor únicamente a un (1) premio durante toda la promoción.</p>
                  <p className="mt-2">En caso de que un mismo participante resulte ganador en más de un sorteo correspondiente a distintos establecimientos, se considerará válido únicamente el primer premio asignado conforme al orden cronológico por fecha de sorteo en que se realicen, anulándose automáticamente cualquier premio adicional.</p>
                  <p className="mt-2">Los establecimientos participantes actúan exclusivamente como puntos de venta, por lo que no son responsables de la organización, ejecución, validación de participaciones, selección de ganadores ni entrega de premios de la promoción.</p>

                  <p className="mt-3 font-semibold text-white/90">Paso 4: Validación automática (o manual) de la factura contra la base de datos para evitar duplicidad de fotos de la misma factura.</p>
                  <p className="mt-1">Los ganadores serán seleccionados mediante sorteo aleatorio, entre todos los participantes que hayan cumplido correctamente con los requisitos establecidos en estos Términos y Condiciones. Los sorteos se realizarán hasta cumplidos los quince (15) días calendario posteriores a la finalización de la vigencia de la promoción, en presencia de un Notario Público, quien certificará la transparencia del proceso.</p>
                  <p className="mt-2">Los premios serán asignados por establecimiento participante de la siguiente manera:</p>
                  <ul className="mt-1 list-none space-y-1 text-white/70 pl-2">
                    <li><span className="text-white/90">Coral Hipermercados</span><br />1 ganador: 1 premio Cine en Casa</li>
                    <li className="mt-1"><span className="text-white/90">Kywi</span><br />2 ganadores: cada uno recibirá 1 premio Cine en Casa</li>
                    <li className="mt-1"><span className="text-white/90">Promart</span><br />1 ganador: 1 premio Cine en Casa</li>
                    <li className="mt-1"><span className="text-white/90">Pharmacys</span><br />13 ganadores: cada uno recibirá 1 camiseta deportiva original marca Marathon</li>
                    <li className="mt-1"><span className="text-white/90">Fybeca</span><br />13 ganadores: cada uno recibirá 1 camiseta deportiva original marca Marathon</li>
                    <li className="mt-1"><span className="text-white/90">TIA</span><br />6 Televisor Pantalla LED 4K de 55&rdquo;<br />10 Camisetas Originales marca Marathon<br />20 balones Originales Mundial<br />4 tarjetas de regalo en montos diferenciados.</li>
                  </ul>
                  <p className="mt-2">El modelo, talla y color estarán sujetos a disponibilidad del organizador.</p>
                  <p className="mt-2">Cada participante deberá conservar la factura original registrada en la plataforma, la misma que será validada cruzando la información otorgada con el registro del SRI. Estos documentos podrán ser solicitados por el organizador para verificar la autenticidad de la participación.</p>
                  <p className="mt-2">La no presentación de la factura original registrada o la presentación de documentos ilegibles, alterados, duplicados o inválidos podrá resultar en la descalificación inmediata del participante, incluso si hubiese sido seleccionado como ganador. En caso de que la factura registrada en la promoción se encuentre emitida a nombre de un tercero distinto del participante registrado en la plataforma, el participante deberá presentar obligatoriamente:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-white/70">
                    <li>copia del documento de identidad del titular de la factura;</li>
                    <li>copia de la factura registrada;</li>
                    <li>carta de autorización firmada por el titular de la factura autorizando expresamente el uso de dicha factura para participar en la promoción y recibir el premio.</li>
                  </ul>
                  <p className="mt-2">El organizador podrá solicitar la presencia del titular de la factura para la validación del premio si lo considera necesario.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">3.3 Medios de difusión de la dinámica:</h4>
                  <p>La Promoción se comunicará en las tiendas participantes indicadas en estos Términos y Condiciones, en el punto de venta, respecto a los productos que se encuentren marcados dentro de la Promoción, mediante material POP como:</p>
                  <ol className="mt-1 list-decimal list-inside space-y-0.5 text-white/70">
                    <li>Banner</li>
                    <li>Vibrines</li>
                    <li>Laterales de Checkout</li>
                    <li>Artes en Minicabeceras</li>
                    <li>Sticker en los productos</li>
                    <li>Muebles brandeados con la promoción.</li>
                    <li>Redes Sociales</li>
                  </ol>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTICULO 4. ENTREGA DE PREMIOS</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">4.1 Premios:</h4>
                  <p>Entre las personas que cumplan con la mecánica y condiciones indicadas en el presente documento, EL PATROCINADOR hará entrega de:</p>

                  <p className="mt-2 font-semibold text-white/90">1. Descripción de los premios</p>
                  <p className="mt-1 font-semibold text-white/90">a. Premio &ldquo;Cine en Casa&rdquo; incluye:</p>
                  <ul className="mt-1 list-none space-y-0.5 text-white/70 pl-2">
                    <li>1 Televisor Pantalla LED 4K de 55&rdquo;</li>
                    <li>1 Butaca reclinable.</li>
                    <li>1 Barra de sonido</li>
                  </ul>
                  <p className="mt-2 font-semibold text-white/90">b. Premio Camiseta Ecuador</p>
                  <p className="text-white/70 pl-2">1 camiseta deportiva original de la marca Marathon</p>
                  <p className="mt-2 font-semibold text-white/90">c. Premios TIA</p>
                  <ul className="mt-1 list-none space-y-0.5 text-white/70 pl-2">
                    <li>6 Televisor Pantalla LED 4K de 55&rdquo;</li>
                    <li>10 Camisetas deportivas originales marca Marathon</li>
                    <li>20 balones Originales Mundial</li>
                    <li>4 tarjetas de regalo en montos diferenciados.</li>
                  </ul>
                  <p className="mt-2">La talla y color de la camiseta estarán sujetos a disponibilidad de stock al momento de la entrega del premio.</p>
                  <p className="mt-2">Los premios no son transferibles, ni canjeables por dinero en efectivo u otros productos.</p>

                  <p className="mt-2 font-semibold text-white/90">2. Entrega del premio</p>
                  <p className="mt-1">El ganador será responsable de retirar su premio en el lugar y fecha indicados por el organizador. En caso de solicitar envío a domicilio, los costos de transporte o envío deberán ser asumidos por el ganador, salvo que el organizador determine lo contrario.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">4.2 Notificación y Entrega de Premios:</h4>
                  <p>Los ganadores serán notificados por conducto del personal designado por el organizador de la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, mediante <strong className="text-white">llamada telefónica o mensaje de texto/WhatsApp</strong>, utilizando los datos proporcionados por el participante en el formulario de registro de la promoción. Los participantes potencialmente ganadores contarán con un <strong className="text-white">plazo máximo de dos (2) días calendario</strong> para responder a la notificación y proporcionar la información y documentación solicitada para continuar con el proceso de validación, la cual podrá incluir, entre otros, <strong className="text-white">documento de identidad y la factura o comprobante original de compra de productos DURACELL®</strong> registrado en la plataforma.</p>
                  <p className="mt-2">El organizador realizará sus mejores esfuerzos por <strong className="text-white">localizar al ganador potencial</strong>, sin que ello implique asumir responsabilidad alguna en caso de no lograr establecer contacto. En caso de que el participante no responda dentro del plazo establecido, no proporcione la documentación requerida o no sea posible localizarlo mediante los medios de contacto registrados, <strong className="text-white">el organizador podrá anular la participación y seleccionar a un nuevo ganador</strong>, sin responsabilidad alguna para el organizador o cualquiera de sus socios comerciales.</p>
                  <p className="mt-2">Una vez validada la condición de ganador, el premio deberá ser <strong className="text-white">retirado en el lugar, ciudad y fecha que el organizador determine oportunamente dentro del territorio ecuatoriano</strong>, con el fin de acreditar la identidad del ganador y verificar el comprobante original de compra. En caso de que el premio sea enviado al domicilio del ganador, este podrá ser remitido mediante <strong className="text-white">servicio de mensajería o courier</strong>, y únicamente podrá ser entregado al ganador previa verificación de identidad. Si el servicio de mensajería no logra efectuar la entrega por ausencia del destinatario, dirección incorrecta u otras circunstancias fuera del control del organizador, <strong className="text-white">no será responsabilidad del organizador</strong>, quien podrá disponer del premio o designar a un nuevo ganador.</p>
                  <p className="mt-2">El participante reconoce y acepta que, en caso de resultar ganador, el organizador y la marca DURACELL® no estarán obligados a cubrir ningún gasto adicional relacionado con la recepción o retiro del premio, incluyendo, pero sin limitarse a, gastos de transporte, servicios de courier, o cualquier otro gasto asociado. El organizador únicamente se responsabiliza por la entrega del premio descrito en la promoción, sin que exista obligación de compensación monetaria o de cualquier otra naturaleza para cubrir costos adicionales. Al participar en la promoción, los participantes aceptan expresamente esta condición y renuncian a cualquier reclamación adicional por dichos conceptos.</p>
                  <p className="mt-2">En caso de existir dudas sobre la autenticidad de la participación o si el participante no acredita mediante documentos idóneos cualquiera de las condiciones establecidas en los presentes Términos y Condiciones, <strong className="text-white">el organizador se reserva el derecho de descalificar o excluir al participante o ganador</strong>, así como de negar la entrega del premio correspondiente, sin responsabilidad alguna para el organizador o cualquiera de sus socios comerciales.</p>
                  <p className="mt-2">El organizador informará oportunamente a los ganadores <strong className="text-white">la fecha, lugar y horario para la entrega o retiro de los premios</strong>, una vez verificada la documentación y validada la participación. En caso de que el ganador no se presente o no coordine la recepción del premio dentro del plazo indicado por el organizador, <strong className="text-white">perderá automáticamente el derecho al mismo</strong>, sin que exista obligación de contacto posterior. En tal caso, el organizador se reserva el derecho de <strong className="text-white">disponer del premio de la manera que considere más conveniente</strong>, incluida la posibilidad de seleccionar a un nuevo ganador conforme a las condiciones de la promoción.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">5.- LIMITACIONES DE RESPONSABILIDAD</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">5.1 Daños y Perjuicios:</h4>
                  <p>El organizador de la promoción y/o DURACELL® no serán responsables por cualquier daño, pérdida o perjuicio sufrido por los participantes o ganadores con ocasión de su participación en la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo;, ni por la aceptación, retiro, entrega, instalación, uso o disfrute de los premios otorgados.</p>
                  <p className="mt-2">Lo anterior incluye, sin limitarse a, daños personales, daños materiales, pérdidas económicas o cualquier otro perjuicio directo o indirecto que pudiera derivarse de la participación en la promoción o del uso de los premios entregados.</p>
                  <p className="mt-2">El organizador y/o DURACELL® tampoco asumirán responsabilidad alguna por fallas, retrasos, pérdidas o inconvenientes ocasionados por servicios de transporte, mensajería, logística o cualquier tercero involucrado en el proceso de entrega de los premios.</p>
                  <p className="mt-2">Una vez realizada la entrega del premio y verificado su estado al momento de la recepción por parte del ganador, cualquier falla técnica posterior será cubierta exclusivamente por la <strong className="text-white">garantía del fabricante</strong>, conforme a sus condiciones.</p>
                  <p className="mt-2">En consecuencia, el organizador y/o DURACELL® no serán responsables por daños, accidentes o perjuicios que pudieran derivarse de la instalación, manipulación o uso del premio, aun cuando este sea utilizado conforme a su naturaleza o finalidad prevista.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.2 Problemas Técnicos:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no se hacen responsables por problemas técnicos, errores humanos, fallas en el hardware o software, ni por cualquier otra dificultad técnica que pueda impedir a los participantes inscribirse correctamente en la Promoción, participar en la Web de la Promoción, o recibir notificaciones relacionadas con la Promoción.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.3 Disponibilidad de la web de la promoción:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no garantizan la disponibilidad continua y permanente de la Web de la Promoción. EL PATROCINADOR no será responsable por cualquier interrupción temporal del servicio debido a mantenimientos técnicos, actualizaciones, o cualquier otra causa fuera del control razonable de EL PATROCINADOR.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.4 Exactitud de la Información:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no serán responsables por errores o inexactitudes en la información proporcionada por los participantes durante el proceso de registro. Es responsabilidad de los participantes asegurarse de que toda la información ingresada sea correcta y actualizada.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.5 Decisiones Definitivas:</h4>
                  <p>Todos los resultados y decisiones de EL PATROCINADOR relacionados con esta Promoción son definitivos y no están sujetos a revisión o apelación. Por razones de confidencialidad y seguridad, no se proporcionarán detalles adicionales sobre la selección de ganadores ni sobre los resultados del concurso. Los participantes aceptan esta condición al inscribirse en la Promoción.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.6 Cumplimiento Legal:</h4>
                  <p>La Promoción se lleva a cabo de acuerdo con las leyes y regulaciones aplicables en la República del Ecuador. EL PATROCINADOR y/o DURACELL® no asumen ninguna responsabilidad por la participación de personas que no cumplan con las leyes locales o que sean impedidas de participar por cualquier legislación vigente. EL ORGANIZADOR y DURACELL® no serán responsables por daños derivados de la instalación o uso del premio.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.7 Modificación de la Promoción:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® se reservan el derecho de modificar, suspender o cancelar la Promoción en cualquier momento, por cualquier razón, incluyendo, pero no limitándose a, situaciones de fuerza mayor, fraude, o cualquier otro factor fuera del control de EL PATROCINADOR que pueda afectar la integridad o el funcionamiento de la Promoción. En caso de cualquier modificación, los términos y condiciones actualizados se publicarán en la Web de la Promoción.</p>
                  <p className="mt-2">La Promoción &ldquo;Hinchas Recargados&rdquo;, no está patrocinada, avalada, administrada ni asociada en modo alguno con las plataformas de redes sociales utilizadas para su difusión. Los participantes eximen de toda responsabilidad a estas plataformas por cualquier daño o perjuicio que pudiera derivarse de su participación en la Promoción.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.8 Daños por Pérdida de Ingresos y Otros:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no serán responsables en ningún caso de los daños causados por la pérdida de ingresos, el suministro de información incorrecta o incompleta por parte de un participante, o fallos de red, hardware o software que provoquen la reducción, el retraso o la pérdida de datos. EL PATROCINADOR y/o DURACELL® y todos los terceros contratados no son responsables de ningún daño o perjuicio (directo o indirecto) como resultado de la participación en esta Promoción o del uso de los premios concedidos.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.9 Fallas de Terceros:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no se hacen responsable de las pérdidas, retrasos o fallos técnicos causados por terceros, como operadores de telecomunicaciones, o por fallos de la red, del hardware informático o del software de cualquier tipo que den lugar a mensajes de error, participaciones reducidas, atrasadas o pérdidas o a un sorteo y entrega de premios aleatorios. Tampoco se hace responsable de los errores en el material impreso o en el embalaje participante.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.10 Interrupción de la Promoción:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no se hacen responsables de la interrupción de la Promoción debido a problemas técnicos o de otro tipo que escapen a su control.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.11 Información Incompleta o Incorrecta:</h4>
                  <p>A pesar del máximo cuidado que EL PATROCINADOR y/o DURACELL® ponen en la Promoción y en la gestión de la Web de la Promoción, es posible que la información sea incompleta o incorrecta. EL PATROCINADOR y/o DURACELL® no se hacen responsable de ningún daño (consecuente) causado por errores u omisiones técnicos o editoriales en la Web de la Promoción, ni de ningún daño (consecuente) derivado del uso, presentación, puesta a disposición o indisponibilidad temporal de esta Web de la Promoción o de enlaces a sitios web de terceros, salvo en caso de dolo o negligencia grave por parte EL PATROCINADOR.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.12 Seguridad y Virus Informáticos:</h4>
                  <p>Se ha comprobado que la Web de la Promoción no contiene virus informáticos conocidos y se ha probado en múltiples sistemas informáticos. Sin embargo, nunca se puede garantizar la ausencia de virus informáticos. EL PATROCINADOR y/o DURACELL® no se hacen responsables del software de terceros, como controladores de software y complementos del navegador. Cada participante deberá tomar todas las medidas necesarias para proteger sus propios datos y/o programas de software en su equipo informático y/o su sitio web de cualquier daño/malware/acceso no autorizado o similar. La conexión a la Web de la Promoción y la participación en la misma son responsabilidad exclusiva de los participantes. En ningún caso el participante podrá reclamar a EL PATROCINADOR los costes asociados a la participación. Las participaciones organizadas y/o colectivas en el concurso se considerarán irrazonables y, en consecuencia, quedarán automáticamente excluidas de la participación.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">5.13 Uso Indebido de la Web de la Promoción:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® no se hace responsable del uso indebido de esta Web de la Promoción. La información sobre las personas que hagan un uso indebido de esta Web de la Promoción se transmitirá, en caso necesario, a las autoridades.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTÍCULO 6: DERECHOS DE EL PATROCINADOR Y/O DURACELL®</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">6.1 Exclusión de Participantes:</h4>
                  <p>EL PATROCINADOR se reserva en todo momento el derecho a excluir a los participantes del proceso si considera que su participación resulta dolosa o fraudulenta, a su entera discreción. Asimismo, se reserva el derecho de no conceder un premio si se infringen de algún modo los presentes Términos y Condiciones o cualquier disposición legalmente aplicable, en particular si EL PATROCINADOR sospecha fraude por parte del participante o si no cumple con la totalidad de los requisitos previstos en los presentes Términos y Condiciones, sin ningún tipo de responsabilidad. Aquellos casos en que se compruebe el intento de fraude se considerará la presentación de cada caso ante las autoridades correspondientes.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">6.2 Propiedad Intelectual e Industrial de EL PATROCINADOR y/o DURACELL®:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® y sus filiales conservan todos los derechos de propiedad intelectual e industrial sobre sus marcas, logotipos y cualquier otro elemento distintivo relacionado que le corresponda a cada uno de ellos. Cualquier uso no autorizado de estas marcas está estrictamente prohibido y puede dar lugar a acciones legales por parte de EL PATROCINADOR y/o DURACELL®.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">6.3 Confidencialidad de los Datos Personales:</h4>
                  <p>EL PATROCINADOR se compromete a respetar la confidencialidad de los datos personales de los participantes recopilados durante la Promoción y a utilizarlos únicamente con el propósito de administrar la Promoción y comunicarse con los participantes en relación con la misma. Los datos personales no serán compartidos con terceros sin el consentimiento previo de los participantes, excepto en los casos en que sea necesario para el cumplimiento de las obligaciones legales de EL PATROCINADOR o cuando sea requerido por las autoridades competentes.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">6.4 Uso de Datos Personales para Promoción:</h4>
                  <p>El Participante acepta que EL PATROCINADOR y/o DURACELL® podrán utilizar su nombre, imagen (fija o en video), voz, opinión, testimonio y demás datos personales con fines promocionales y publicitarios relacionados con la presente Promoción, sin que ello genere compensación económica adicional, salvo indicación expresa en contrario por escrito por parte del propio Participante.</p>
                  <p className="mt-2">Dicho uso no dará lugar a regalías ni requerirá autorización adicional. EL PATROCINADOR y/o DURACELL® se comprometen a utilizar dicha información respetando en todo momento la integridad del Participante, asegurando que su imagen y datos personales no sean utilizados de forma que puedan afectar su reputación o dignidad.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">6.5 Modificación, Suspensión o Cancelación de la Promoción:</h4>
                  <p>EL PATROCINADOR y/o DURACELL® se reserva el derecho de modificar, suspender o cancelar la promoción en cualquier momento, por cualquier razón, sin previo aviso. En caso de modificaciones, EL PATROCINADOR y/o DURACELL® se compromete a informar a los participantes de los cambios a través de la Web de la Promoción.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">7. CONFIDENCIALIDAD Y PROTECCIÓN DE DATOS</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">7.1 Consentimiento y Finalidad de los Datos Personales</h4>
                  <p>Al participar en esta Promoción, el participante acepta proporcionar sus datos personales a DURACELL®, quien actúa en calidad de Responsable del Tratamiento de Datos Personales, en los términos establecidos por la Ley Orgánica de Protección de Datos Personales del Ecuador.</p>
                  <p className="mt-2">Los datos serán recolectados y tratados con la finalidad de:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-white/70">
                    <li>Administrar y ejecutar la Promoción,</li>
                    <li>Verificar la elegibilidad de los participantes,</li>
                    <li>Contactar y entregar los premios a los ganadores,</li>
                    <li>Realizar comunicaciones exclusivamente relacionadas con la Promoción.</li>
                  </ul>
                  <p className="mt-2">CALBAQ S.A. en su calidad de Encargado del Tratamiento, realizará el tratamiento de los datos únicamente por cuenta y bajo las instrucciones de DURACELL®, y no podrá utilizarlos para fines propios ni cederlos a terceros sin autorización expresa del Responsable.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">7.2 Confidencialidad</h4>
                  <p>DURACELL® y CALBAQ S.A. se comprometen a mantener la confidencialidad de los datos personales suministrados por los participantes, y a adoptar todas las medidas necesarias para evitar su pérdida, acceso no autorizado, uso indebido, divulgación o modificación.</p>
                  <p className="mt-2">Los datos personales solo serán compartidos con terceros cuando:</p>
                  <ul className="mt-1 list-disc list-inside space-y-1 text-white/70">
                    <li>Sea necesario para la ejecución de la Promoción,</li>
                    <li>Exista autorización previa y expresa del titular,</li>
                    <li>O cuando una autoridad competente así lo exija conforme a la ley.</li>
                  </ul>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">7.3 Eliminación de Datos</h4>
                  <p>DURACELL®, como Responsable del Tratamiento, se obliga a garantizar que todos los datos personales recolectados sean eliminados una vez finalice la Promoción, y en todo caso a más tardar dentro de los noventa (90) días hábiles siguientes a la entrega de los premios.</p>
                  <p className="mt-2">CALBAQ S.A. en calidad de Encargado, realizará dicha eliminación siguiendo los protocolos de seguridad que impidan la recuperación o uso posterior de los datos.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">7.4 Seguridad de la Información</h4>
                  <p>DURACELL® y CALBAQ S.A. se comprometen a implementar medidas técnicas, humanas y administrativas que sean razonables y proporcionales al riesgo, para garantizar la seguridad de la información personal de los participantes, y protegerla contra cualquier acceso, alteración, pérdida o destrucción no autorizada.</p>
                  <p className="mt-2">Ambas partes actuarán conforme a los estándares de seguridad de la industria y lo previsto en sus políticas de protección de datos personales vigentes.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTÍCULO 8: JURISDICCIÓN Y RESOLUCIÓN DE CONTROVERSIAS</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">8.1 Jurisdicción:</h4>
                  <p>Cualquier controversia que surja en relación con esta Promoción será resuelta de conformidad con las leyes aplicables de República del Ecuador, y los participantes se someten a la jurisdicción de los tribunales competentes en la ciudad de Guayaquil, Ecuador, renunciando a cualquier otro fuero que pudiera corresponderles por domicilio presente o futuro.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">8.2 Resolución de Controversias:</h4>
                  <p>En caso de cualquier disputa o reclamación relacionada con la Promoción, los participantes deberán dirigirse primero a EL PATROCINADOR para intentar resolver la controversia de manera amistosa. Si no se llega a una solución, la controversia será sometida a los tribunales competentes según lo establecido en el presente apartado.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 text-center underline">ARTÍCULO 9: COMUNICACIÓN OFICIAL</h3>

                  <h4 className="text-white font-semibold mt-2 mb-1 underline">9.1 Canales Oficiales:</h4>
                  <p>Toda comunicación oficial relacionada con la promoción &ldquo;Hinchas Recargados DURACELL®&rdquo; se realizará exclusivamente a través de la Web de la Promoción y de los medios de contacto que proporcionen los ganadores, así mismo, solo a través de los correos electrónicos provenientes de las direcciones oficiales de EL PATROCINADOR. El canal oficial es el siguiente:</p>
                  <p className="mt-1">La Web de la Promoción: <strong className="text-white">www.hinchasrecargados.com</strong></p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">9.2 Fraude y Canales No Oficiales:</h4>
                  <p>EL PATROCINADOR y/o DURACELL®, no se hacen responsables por cualquier daño, pérdida o perjuicio que los participantes puedan sufrir como resultado de información recibida a través de canales no oficiales. Los participantes deben asegurarse de que cualquier comunicación que reciban provenga de los canales oficiales mencionados anteriormente.</p>
                  <p className="mt-2">En caso de que los participantes reciban información de fuentes no oficiales y resulten víctimas de fraude, EL PATROCINADOR y/o DURACELL® no asumirán ninguna responsabilidad. Los participantes son responsables de verificar la autenticidad de cualquier comunicación recibida y de tomar las precauciones necesarias para evitar caer en fraudes.</p>
                  <p className="mt-2">EL PATROCINADOR y/o DURACELL® nunca solicitarán información bancaria, ni requerirán el pago de ninguna cantidad adicional para participar en la Promoción. La participación en el concurso está limitada exclusivamente a cumplir todos y cada uno de los requisitos para participar en términos de estos Términos y Condiciones.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">9.3 Actualización de Información:</h4>
                  <p>EL PATROCINADOR se reserva el derecho de actualizar y modificar los canales oficiales de comunicación. Cualquier cambio será notificado a los participantes a través de la Web de la Promoción.</p>

                  <h4 className="text-white font-semibold mt-3 mb-1 underline">9.4 Responsabilidad del Participante:</h4>
                  <p>Los participantes son responsables de mantenerse informados sobre cualquier actualización o cambio en los términos y condiciones de la Promoción, cumplir con los requisitos para participar, aceptar la determinación de los ganadores, entregar la información que les sea requerida, proporcionar información veraz, verificar la autenticidad de cualquier información recibida y en general cualquier obligación que se derive a su cargo conforme a los presentes Términos y Condiciones.</p>

                  <p className="mt-4 text-white/60 text-xs text-center">FECHA DE PUBLICACIÓN: 30 DE MARZO DEL 2026.</p>
                </section>

                <section>
                  <h3 className="text-[#F2B38C] font-bold mb-2 underline">ANEXO 1</h3>
                  <p className="mb-2">Listado de productos habilitado para la dinámica.</p>
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#BE7753]/30">
                        <th className="border border-white/20 px-2 py-1 text-white font-bold text-center">EAN 13</th>
                        <th className="border border-white/20 px-2 py-1 text-white font-bold text-left">PRODUCTO</th>
                      </tr>
                    </thead>
                    <tbody className="text-white/70">
                      {[
                        ['41333001005', 'DURACELL PILA AA BLISTER X2 X12 X4'],
                        ['41333001029', 'DURACELL PILA AA BLISTER X4 X12 X4'],
                        ['41333900483', 'DURACELL PILA AA BLISTER X6 X12 X4'],
                        ['41333001036', 'DURACELL PILA AA BLISTER X8 X12 X4'],
                        ['41333666815', 'DURACELL PILA AA BLISTER X16 X6'],
                        ['41333001074', 'DURACELL PILA AAA BLISTER X2 X12 X4'],
                        ['41333001098', 'DURACELL PILA AAA BLISTER X4 X12 X4'],
                        ['41333904481', 'DURACELL PILA AAA BLISTER X6 X12 X4'],
                        ['41333666648', 'DURACELL PILA AAA BLISTER X8 X12 X4'],
                        ['41333666952', 'DURACELL PILA AAA BLISTER X16 X6'],
                        ['41333001043', 'DURACELL PILA 9V BLISTER X1 X12 X4'],
                        ['41333000992', 'DURACELL PILA C BLISTER X2 X8 X6'],
                        ['41333000985', 'DURACELL PILA D BLISTER X2 X6 X8'],
                        ['41333030098', 'DURACELL SP PILA 2016 BLISTER X1'],
                        ['41333048550', 'DURACELL SP PILA 2016 X2'],
                        ['41333038209', 'DURACELL SP PILA 2025 X2'],
                        ['41333038216', 'DURACELL SP PILA 2032 BLISTER X2'],
                      ].map(([ean, producto]) => (
                        <tr key={ean} className="even:bg-white/5">
                          <td className="border border-white/20 px-2 py-1 text-center font-mono">{ean}</td>
                          <td className="border border-white/20 px-2 py-1">{producto}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
