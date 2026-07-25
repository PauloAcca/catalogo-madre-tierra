export default function AboutSection() {
  return (
    <section className="about-section" id="sobre-nosotros">
      <div className="container about-container">
        <div className="about-content">
          <div className="section-header">
            <div className="section-tag">NUESTRA ESENCIA</div>
            <h2>Verdulería Boutique, Almacén & Más</h2>
          </div>
          <p>
            Somos mucho más que una verdulería. En Madre Tierra fusionamos la calidad 
            de los productos <strong>naturales y orgánicos</strong> con la conveniencia de un 
            <strong> almacén convencional</strong>. 
          </p>
          <p>
            Aquí puedes encontrar desde las frutas y verduras más frescas seleccionadas a mano, 
            hasta aquellos productos de uso diario que necesitas en tu despensa. Nuestro objetivo 
            es brindarte un espacio donde la curaduría boutique se encuentra con la cotidianidad, 
            asegurando siempre la mejor calidad para tu familia.
          </p>
        </div>
        <div className="about-image-wrapper">
          <div className="about-image-placeholder">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.2 }}>
              <path d="M4 22h16a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v16a2 2 0 0 1-2 2Zm0 0a2 2 0 0 1-2-2v-9c0-1.1.9-2 2-2h2"/>
              <path d="M18 14h-8"/>
              <path d="M15 18h-5"/>
              <path d="M10 6h8v4h-8V6Z"/>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
