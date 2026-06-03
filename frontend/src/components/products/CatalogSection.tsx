'use client';

import { useState, useMemo, useCallback } from 'react';
import { Product, CategoryInfo } from '@/types/product';
import SearchBar from '@/components/search/SearchBar';
import CategoryFilter from '@/components/products/CategoryFilter';
import ProductGrid from '@/components/products/ProductGrid';
import { useDebounce } from '@/hooks/useDebounce';

interface CatalogSectionProps {
  initialProducts: Product[];
  categories: CategoryInfo[];
}

export default function CatalogSection({
  initialProducts,
  categories,
}: CatalogSectionProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const debouncedSearch = useDebounce(searchQuery, 300);

  const filteredProducts = useMemo(() => {
    let result = initialProducts;

    if (selectedCategory) {
      result = result.filter(
        (p) => p.categoria.toLowerCase() === selectedCategory.toLowerCase(),
      );
    }

    if (debouncedSearch.trim()) {
      const search = debouncedSearch.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.nombre.toLowerCase().includes(search) ||
          p.categoria.toLowerCase().includes(search),
      );
    }

    return result;
  }, [initialProducts, selectedCategory, debouncedSearch]);

  const clearFilters = useCallback(() => {
    setSearchQuery('');
    setSelectedCategory(null);
  }, []);

  return (
    <section className="catalog-section" id="catalogo">
      <div className="container">
        <div className="catalog-header">
          <h2>Nuestros Productos</h2>
          <p>Frescos, naturales y seleccionados para vos</p>
        </div>

        <SearchBar value={searchQuery} onChange={setSearchQuery} />
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
        <ProductGrid
          products={filteredProducts}
          searchQuery={debouncedSearch}
          selectedCategory={selectedCategory}
          onClearFilters={clearFilters}
        />
      </div>
    </section>
  );
}
