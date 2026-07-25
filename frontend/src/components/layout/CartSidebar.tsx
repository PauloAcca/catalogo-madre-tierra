'use client';

import { useCart } from '@/context/CartContext';
import { useEffect } from 'react';

export default function CartSidebar() {
  const { items, isCartOpen, setIsCartOpen, updateQuantity, removeFromCart, cartTotal } = useCart();
  const showPrices = process.env.NEXT_PUBLIC_SHOW_PRICES !== 'false';

  // Bloquear el scroll del body cuando el carrito está abierto
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!isCartOpen) return null;

  const formattedTotal = new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
  }).format(cartTotal);

  const formatCartText = () => {
    let text = 'Hola Madre Tierra! 🌱 Quería hacer el siguiente pedido:\n\n';
    items.forEach(item => {
      text += `- ${item.quantity}x ${item.product.nombre}\n`;
    });
    if (showPrices) {
      text += `\n*Total estimado: ${formattedTotal}*`;
    }
    return text;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(formatCartText());
    alert('Pedido copiado al portapapeles');
  };

  const handleWhatsApp = () => {
    const encoded = encodeURIComponent(formatCartText());
    window.open(`https://wa.me/5491162720179?text=${encoded}`, '_blank');
  };

  return (
    <>
      <div className="cart-overlay" onClick={() => setIsCartOpen(false)}></div>
      <div className="cart-sidebar">
        <div className="cart-header">
          <h2>Mi Pedido</h2>
          <button className="cart-close-btn" onClick={() => setIsCartOpen(false)}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div className="cart-empty">
              <p>Tu cesta está vacía</p>
              <button onClick={() => setIsCartOpen(false)} className="cart-empty-btn">Seguir explorando</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.product.id} className="cart-item">
                <div className="cart-item-image">
                  {item.product.imagenUrl ? (
                    <img src={item.product.imagenUrl} alt={item.product.nombre} />
                  ) : (
                    <div className="cart-item-placeholder"></div>
                  )}
                </div>
                <div className="cart-item-info">
                  <h4>{item.product.nombre}</h4>
                  {showPrices && (
                    <p className="cart-item-price">
                      {item.product.precio ? `$${item.product.precio}` : 'Consultar'}
                    </p>
                  )}
                  <div className="cart-item-controls">
                    <button onClick={() => updateQuantity(item.product.id, item.quantity - 1)}>-</button>
                    <span>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.product.id, item.quantity + 1)}>+</button>
                  </div>
                </div>
                <button className="cart-item-remove" onClick={() => removeFromCart(item.product.id)}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                  </svg>
                </button>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="cart-footer">
            {showPrices && (
              <div className="cart-total">
                <span>Total Estimado:</span>
                <span>{formattedTotal}</span>
              </div>
            )}
            <div className="cart-actions">
              <button className="cart-btn-secondary" onClick={handleCopy}>
                Copiar Lista
              </button>
              <button className="cart-btn-primary" onClick={handleWhatsApp}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                </svg>
                Enviar a WhatsApp
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
