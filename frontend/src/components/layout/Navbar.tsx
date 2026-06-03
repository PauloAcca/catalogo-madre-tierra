'use client';

import { useState, useEffect } from 'react';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

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
          <img src="/images/logo.png" alt="Madre Tierra" />
        </a>

        <ul className={`navbar-links ${mobileOpen ? 'mobile-open' : ''}`}>
          <li>
            <button
              className="navbar-link"
              onClick={() => scrollToSection('hero')}
            >
              Inicio
            </button>
          </li>
          <li>
            <button
              className="navbar-link"
              onClick={() => scrollToSection('catalogo')}
            >
              Catálogo
            </button>
          </li>
          <li>
            <button
              className="navbar-link"
              onClick={() => scrollToSection('footer')}
            >
              Contacto
            </button>
          </li>
        </ul>

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
