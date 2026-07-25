'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { cartCount, setIsCartOpen } = useCart();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <a href="/" className="navbar-logo" aria-label="Madre Tierra - Inicio">
          <img src="/images/logo.png" alt="Madre Tierra Logo" />
          <span className="navbar-brand-name">Madre Tierra</span>
        </a>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <button className="navbar-link active" onClick={() => scrollToSection('hero')}>
              Inicio
            </button>
          </li>
          <li>
            <button className="navbar-link" onClick={() => scrollToSection('catalogo')}>
              Catálogo
            </button>
          </li>
          <li>
            <button className="navbar-link" onClick={() => scrollToSection('sobre-nosotros')}>
              Sobre Nosotros
            </button>
          </li>
          <li>
            <button className="navbar-link" onClick={() => scrollToSection('footer')}>
              Contacto
            </button>
          </li>
        </ul>

        <div className="navbar-actions">
          <a href="#footer" className="navbar-btn-whatsapp">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
            </svg>
            Consultar por WhatsApp
          </a>
          
          <button className="navbar-btn-cart" aria-label="Carrito" onClick={() => setIsCartOpen(true)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" />
              <path d="M3 6h18" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </div>

        <button
          className="navbar-mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Menú"
          aria-expanded={mobileOpen}
        >
          <span />
        </button>
      </div>
    </nav>
  );
}
