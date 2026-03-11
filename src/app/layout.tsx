import type { Metadata } from 'next';
import { Bebas_Neue, Inter } from 'next/font/google';
import './globals.css';

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-bebas',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Hinchas Recargados | Duracell Ecuador',
  description:
    'Compra productos Duracell en Ecuador, sube tu factura y participa por increíbles premios: un cine en casa o una camiseta original de la Selección de Ecuador.',
  keywords: ['Duracell', 'Ecuador', 'Hinchas Recargados', 'premios', 'camiseta Ecuador', 'cine en casa'],
  openGraph: {
    title: 'Hinchas Recargados | Duracell Ecuador',
    description:
      'Compra Duracell y participa por increíbles premios. Sube tu factura y entra al sorteo.',
    type: 'website',
    locale: 'es_EC',
    siteName: 'Hinchas Recargados - Duracell',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hinchas Recargados | Duracell Ecuador',
    description: 'Compra Duracell y participa por increíbles premios.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${bebasNeue.variable} ${inter.variable}`}>
      <body className="antialiased min-h-screen bg-black text-white font-[family-name:var(--font-sans)]">
        {children}
      </body>
    </html>
  );
}
