export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-line"></span>
            BOUTIQUE DE PRODUCTOS NATURALES
          </div>
          <h1>
            Frescura Natural<br/>en tu Mesa
          </h1>
          <p className="hero-description">
            Curaduría de productos seleccionados con dedicación, conectando el origen artesanal directamente con tu hogar. Calidad premium en cada detalle.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="hero-cta">
              Ver Catálogo Completo
            </a>
            <a href="#sobre-nosotros" className="hero-link">
              Nuestra Historia
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"/>
                <polyline points="12 5 19 12 12 19"/>
              </svg>
            </a>
          </div>
        </div>
        <div className="hero-vertical-text">
          EST. 2026 - MADRE TIERRA
        </div>
      </div>
    </section>
  );
}
