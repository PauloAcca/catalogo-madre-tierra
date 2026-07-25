export default function ContactSection() {
  return (
    <section className="contact-section" id="footer">
      <div className="container">
        <div className="contact-grid">
          
          <div className="contact-left-col">
            <div className="contact-info-card">
              <h3 className="contact-card-title">Información</h3>
              <div className="contact-card-line"></div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                    <circle cx="12" cy="10" r="3"></circle>
                  </svg>
                </div>
                <div className="contact-item-content">
                  <h4>DIRECCIÓN</h4>
                  <p>Juan José Díaz 935<br/>San Isidro, Buenos Aires</p>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <polyline points="12 6 12 12 16 14"></polyline>
                  </svg>
                </div>
                <div className="contact-item-content">
                  <h4>HORARIOS DE ATENCIÓN</h4>
                  <div className="schedule-row"><span>Lun - Vie:</span> <span>08:00 — 19:00</span></div>
                  <div className="schedule-row"><span>Sábados:</span> <span>09:00 — 14:00</span></div>
                  <div className="schedule-row closed"><span>Domingos:</span> <span>Cerrado</span></div>
                </div>
              </div>

              <div className="contact-item">
                <div className="contact-item-icon">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                  </svg>
                </div>
                <div className="contact-item-content">
                  <h4>CONTACTO DIRECTO</h4>
                  <p>+54 011 6272-0179<br/>madretierra.distribuidora@gmail.com</p>
                </div>
              </div>

              <a href="https://wa.me/5491162720179" target="_blank" rel="noopener noreferrer" className="contact-whatsapp-btn">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Consulta por WhatsApp
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{marginLeft: 'auto'}}>
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </a>
            </div>

            <div className="contact-quote-card">
              <p>"De la tierra a tu mesa, con el respeto que la naturaleza merece."</p>
              <div className="quote-author">
                <span></span> EQUIPO MADRE TIERRA
              </div>
            </div>
          </div>

          <div className="contact-right-col">
            <div className="contact-map-card">
              <iframe
                src="https://maps.google.com/maps?q=Juan+Jose+Diaz+935,+San+Isidro&t=&z=15&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0, position: 'absolute', inset: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
              <a href="https://maps.google.com/?q=Juan+Jose+Diaz+935+San+Isidro" target="_blank" rel="noopener noreferrer" className="map-overlay-btn">
                <div className="map-btn-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z" />
                  </svg>
                </div>
                ¿Cómo llegar a Madre Tierra?
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
