import { Product } from '@/types/product';
import ProductCard from './ProductCard';

interface ProductGridProps {
  products: Product[];
  searchQuery: string;
  selectedCategory: string | null;
  onClearFilters: () => void;
}

export default function ProductGrid({
  products,
  searchQuery,
  selectedCategory,
  onClearFilters,
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="product-grid">
        <div className="empty-state">
          <div className="empty-state-icon">🔍</div>
          <h3>No encontramos productos</h3>
          <p>
            {searchQuery
              ? `No hay resultados para "${searchQuery}"`
              : selectedCategory
                ? `No hay productos en la categoría "${selectedCategory}"`
                : 'No hay productos disponibles en este momento'}
          </p>
          {(searchQuery || selectedCategory) && (
            <button className="empty-state-clear" onClick={onClearFilters}>
              Ver todos los productos
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="results-info">
        Mostrando <strong>{products.length}</strong> producto{products.length !== 1 ? 's' : ''}
        {selectedCategory && <> en <strong>{selectedCategory}</strong></>}
        {searchQuery && <> para &ldquo;<strong>{searchQuery}</strong>&rdquo;</>}
      </div>
      <div className="product-grid stagger-children">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </>
  );
}
