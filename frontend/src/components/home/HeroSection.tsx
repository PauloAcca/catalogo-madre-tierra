export default function HeroSection() {
  return (
    <section className="hero" id="hero">
      <div className="hero-container">
        <div className="hero-content">
          <div className="hero-tag">
            <span className="hero-tag-line"></span>
            CERCANÍA Y CALIDAD
          </div>
          <h1>
            Visítanos y descubrí todo lo que<br/>tenemos para vos.
          </h1>
          <p className="hero-description">
            Te invitamos a sumergirte en una experiencia sensorial donde la frescura del campo se encuentra con la curaduría de una boutique exclusiva.
          </p>
          <div className="hero-actions">
            <a href="#catalogo" className="hero-cta">
              Ver Catálogo Completo
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
