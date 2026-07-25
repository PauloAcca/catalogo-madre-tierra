'use client';

import { Product } from '@/types/product';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { items, addToCart, updateQuantity } = useCart();
  const showPrices = product.showPrice !== false;

  const cartItem = items.find(item => item.product.id === product.id);
  const quantityInCart = cartItem ? cartItem.quantity : 0;

  const formattedPrice = (product.precio && showPrices)
    ? new Intl.NumberFormat('es-AR', {
        style: 'currency',
        currency: 'ARS',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(product.precio)
    : null;

  return (
    <article className="product-card" id={`product-${product.id}`}>
      <div className="product-card-image">
        {product.imagenUrl ? (
          <img
            src={product.imagenUrl}
            alt={product.nombre}
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="product-card-placeholder">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            <span>{product.categoria}</span>
          </div>
        )}
        <span className="product-card-category-badge">{product.categoria}</span>
      </div>
      <div className="product-card-body">
        <h3 className="product-card-name">{product.nombre}</h3>
        {showPrices && (
          formattedPrice ? (
            <div className="product-card-price">
              {formattedPrice}
              <span className="product-card-price-label">por kg</span>
            </div>
          ) : (
            <div className="product-card-no-price">Consultar precio en local</div>
          )
        )}
      </div>
      <div className="product-card-footer">
        {quantityInCart > 0 ? (
          <div className="product-cart-controls">
            <button 
              className="qty-btn" 
              onClick={(e) => {
                e.preventDefault();
                updateQuantity(product.id, quantityInCart - 1);
              }}
            >-</button>
            <span className="qty-value">{quantityInCart}</span>
            <button 
              className="qty-btn" 
              onClick={(e) => {
                e.preventDefault();
                updateQuantity(product.id, quantityInCart + 1);
              }}
            >+</button>
          </div>
        ) : (
          <button 
            className="product-add-btn"
            onClick={(e) => {
              e.preventDefault();
              addToCart(product, 1);
            }}
          >
            Agregar
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 5v14M5 12h14"/>
            </svg>
          </button>
        )}
      </div>
    </article>
  );
}
