import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import BackToTop from '@/components/ui/BackToTop';

export const metadata: Metadata = {
  title: 'Madre Tierra — Verdulería Boutique · Almacén & Más',
  description:
    'Catálogo de productos naturales, frescos y saludables. Frutas, verduras, productos de almacén, dietética y más. Visitá nuestro local y descubrí todo lo que tenemos para vos.',
  keywords: [
    'Madre Tierra',
    'verdulería',
    'almacén natural',
    'dietética',
    'productos saludables',
    'frutas',
    'verduras',
    'productos orgánicos',
  ],
  openGraph: {
    title: 'Madre Tierra — Verdulería Boutique · Almacén & Más',
    description:
      'Catálogo de productos naturales, frescos y saludables. Visitá nuestro local.',
    type: 'website',
    locale: 'es_AR',
    siteName: 'Madre Tierra',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body>
        <Navbar />
        <main>{children}</main>
        <Footer />
        <BackToTop />
      </body>
    </html>
  );
}
