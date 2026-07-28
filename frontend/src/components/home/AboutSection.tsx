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
            saludables y naturales, hasta aquellos productos de uso diario y de limpieza que no pueden faltar en tu hogar. 
            Nuestro objetivo es acercarte la frescura de la naturaleza junto con la comodidad 
            de tu almacén de siempre, asegurando la mejor calidad para tu familia.
          </p>
        </div>
        <div className="about-image-wrapper">
          <img 
            src="/images/about-store.jpg" 
            alt="Interior del local Madre Tierra" 
            className="about-image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}
