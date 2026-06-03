interface HeroSectionProps {
  totalProducts: number;
  totalCategories: number;
}

export default function HeroSection({ totalProducts, totalCategories }: HeroSectionProps) {
  return (
    <section className="hero" id="hero">
      <div className="hero-content">
        <img src="/images/logo.png" alt="Madre Tierra" style={{ maxWidth: '220px', margin: '0 auto 1.5rem', borderRadius: '1rem', boxShadow: '0 8px 24px rgba(139, 105, 20, 0.15)' }} />
        <h1>
          Madre Tierra
          <span>Verdulería Boutique · Almacén & Más</span>
        </h1>
        <p className="hero-description">
          Productos naturales, frescos y saludables. Explorá nuestro catálogo
          y descubrí todo lo que tenemos disponible en nuestro local.
        </p>
        <a href="#catalogo" className="hero-cta">
          Explorar Productos
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="5" y1="12" x2="19" y2="12"/>
            <polyline points="12 5 19 12 12 19"/>
          </svg>
        </a>
        <div className="hero-stats">
          <div className="hero-stat">
            <div className="hero-stat-value">{totalProducts}+</div>
            <div className="hero-stat-label">Productos</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">{totalCategories}</div>
            <div className="hero-stat-label">Categorías</div>
          </div>
          <div className="hero-stat">
            <div className="hero-stat-value">100%</div>
            <div className="hero-stat-label">Natural</div>
          </div>
        </div>
      </div>
    </section>
  );
}
