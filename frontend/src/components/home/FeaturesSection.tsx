export default function FeaturesSection() {
  return (
    <section className="features-section">
      <div className="container features-grid">
        {/* Feature 1 */}
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <h3>100% Natural</h3>
          <p>Libre de procesos industriales pesados, respetando los ciclos de la tierra y su pureza original.</p>
        </div>

        {/* Feature 2 */}
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m9 12 2 2 4-4"/>
            </svg>
          </div>
          <h3>Selección Premium</h3>
          <p>Solo lo mejor llega a nuestro local. Cada producto es probado por expertos en sabor y calidad.</p>
        </div>

        {/* Feature 3 */}
        <div className="feature-item">
          <div className="feature-icon-wrapper">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
          </div>
          <h3>Atención Personalizada</h3>
          <p>Asesoramiento gourmet para tus recetas y necesidades nutricionales. Estamos para escucharte.</p>
        </div>
      </div>
    </section>
  );
}
