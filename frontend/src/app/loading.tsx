export default function Loading() {
  return (
    <>
      {/* Hero skeleton */}
      <section className="hero" style={{ minHeight: '60vh' }}>
        <div className="hero-content" style={{ opacity: 0.5 }}>
          <div className="hero-icon">🌿</div>
          <h1>Madre Tierra</h1>
          <p className="hero-description">Cargando catálogo...</p>
        </div>
      </section>

      {/* Catalog skeleton */}
      <section className="catalog-section">
        <div className="container">
          <div className="catalog-header">
            <div className="skeleton" style={{ height: 36, width: 250, margin: '0 auto 8px' }} />
            <div className="skeleton" style={{ height: 20, width: 320, margin: '0 auto' }} />
          </div>

          {/* Search skeleton */}
          <div className="search-container">
            <div className="skeleton" style={{ height: 52, borderRadius: 16 }} />
          </div>

          {/* Category chips skeleton */}
          <div className="category-filters" style={{ marginBottom: 40 }}>
            {[80, 90, 70, 100, 85, 75].map((w, i) => (
              <div key={i} className="skeleton" style={{ height: 36, width: w, borderRadius: 999 }} />
            ))}
          </div>

          {/* Product grid skeleton */}
          <div className="product-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton-card">
                <div className="skeleton skeleton-image" />
                <div className="skeleton-body">
                  <div className="skeleton skeleton-title" />
                  <div className="skeleton skeleton-subtitle" />
                  <div className="skeleton skeleton-price" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
