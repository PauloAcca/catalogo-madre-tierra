import { useState, useEffect } from 'react';
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
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 12;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory]);

  const totalPages = Math.ceil(products.length / productsPerPage);
  const startIndex = (currentPage - 1) * productsPerPage;
  const currentProducts = products.slice(startIndex, startIndex + productsPerPage);
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
        {currentProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      
      {totalPages > 1 && (
        <div className="pagination">
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            Anterior
          </button>
          
          <div className="pagination-info">
            Página {currentPage} de {totalPages}
          </div>
          
          <button 
            className="pagination-btn" 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            Siguiente
          </button>
        </div>
      )}
    </>
  );
}
