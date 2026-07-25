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
            de los productos <strong>naturales y orgánicos</strong> con la enorme variedad y 
            conveniencia de un <strong>almacén convencional</strong>, para que consigas todo 
            en un solo lugar.
          </p>
          <p>
            Aquí puedes encontrar desde las frutas y verduras más frescas, alimentos 
            saludables y naturales, hasta aquellos productos de uso diario que no pueden faltar en tu despensa. 
            Nuestro objetivo es acercarte la frescura de la naturaleza junto con la comodidad 
            de tu almacén de siempre, asegurando la mejor calidad para tu familia.
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
