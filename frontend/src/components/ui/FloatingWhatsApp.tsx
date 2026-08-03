'use client';

import { usePathname } from 'next/navigation';

export default function FloatingWhatsApp() {
  const pathname = usePathname();

  if (pathname?.startsWith('/admin')) {
    return null;
  }

  return (
    <a 
      href="https://wa.me/5491162720179" 
      target="_blank" 
      rel="noopener noreferrer" 
      className="floating-whatsapp"
      aria-label="Contactar por WhatsApp"
    >
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12.01 2.01c-5.51 0-9.99 4.47-9.99 9.98 0 1.95.55 3.82 1.57 5.43L2 22l4.69-1.57c1.55.97 3.37 1.53 5.31 1.53 5.51 0 9.99-4.48 9.99-9.99 0-5.5-4.48-9.96-9.98-9.96zM17.47 16.2c-.23.63-1.32 1.22-1.84 1.28-.48.06-1.12.21-3.55-.8-2.92-1.22-4.78-4.22-4.92-4.41-.14-.19-1.18-1.56-1.18-2.98 0-1.42.74-2.12 1-2.4.24-.26.54-.33.72-.33.18 0 .36 0 .52.01.18 0 .42-.07.64.48.24.58.74 1.8.8 1.94.07.13.12.29.02.48-.09.19-.14.3-.28.46-.14.16-.3.35-.42.48-.14.15-.29.31-.12.61.16.29.73 1.22 1.56 1.96.96.86 1.87 1.13 2.17 1.28.29.14.47.12.64-.06.18-.2.78-.9.99-1.21.21-.31.42-.26.68-.16.26.1 1.66.78 1.94.92.28.14.47.21.54.33.07.12.07.72-.16 1.35z"/>
      </svg>
    </a>
  );
}
