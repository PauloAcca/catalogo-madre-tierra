'use client';

import { CategoryInfo } from '@/types/product';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

const getCategoryIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes('almacen') || n.includes('almacén')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m3 9 2 12h14l2-12H3Z"/>
        <path d="M16 5c0-2.2-1.8-4-4-4S8 2.8 8 5"/>
      </svg>
    );
  }
  if (n.includes('congelados')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="m10 20-3.5-3.5"/>
        <path d="m14 20 3.5-3.5"/>
        <path d="m10 4-3.5 3.5"/>
        <path d="m14 4 3.5 3.5"/>
        <path d="M12 2v20"/>
        <path d="M2 12h20"/>
        <path d="m4 10 3.5 3.5"/>
        <path d="m4 14 3.5-3.5"/>
        <path d="m20 10-3.5 3.5"/>
        <path d="m20 14-3.5-3.5"/>
        <path d="m6.5 6.5 11 11"/>
        <path d="m17.5 6.5-11 11"/>
      </svg>
    );
  }
  if (n.includes('dietetica') || n.includes('dietética')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M7 21a4 4 0 0 1-4-4c0-3 3-8 9-15 6 7 9 12 9 15a4 4 0 0 1-4 4"/>
        <path d="M12 12v9"/>
      </svg>
    );
  }
  if (n.includes('perfumeria') || n.includes('perfumería')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 4v7"/>
        <path d="M8.5 7h7"/>
        <path d="M16 11H8c-1.1 0-2 .9-2 2v6c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2v-6c0-1.1-.9-2-2-2z"/>
      </svg>
    );
  }
  if (n.includes('fruta')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="8"/>
        <path d="M12 2v4"/>
        <path d="M10 2c0 2 2 2 2 4"/>
      </svg>
    );
  }
  if (n.includes('verdura')) {
    return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
        <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
      </svg>
    );
  }
  // Default icon
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <path d="M12 16v-4"/>
      <path d="M12 8h.01"/>
    </svg>
  );
};

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  return (
    <div className="category-section" id="categorias">
      <div className="section-header">
        <div className="section-tag">EXPLORAR</div>
        <h2>Nuestras Categorías</h2>
      </div>
      <div className="category-filters-container">
        <div className="category-filters" role="group" aria-label="Filtrar por categoría">
          <button
            className={`category-item ${selected === null ? 'active' : ''}`}
            onClick={() => onSelect(null)}
            aria-pressed={selected === null}
          >
            <div className="category-icon-circle">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span className="category-label">Todos</span>
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.nombre}
              className={`category-item ${selected === cat.nombre ? 'active' : ''}`}
              onClick={() => onSelect(selected === cat.nombre ? null : cat.nombre)}
              aria-pressed={selected === cat.nombre}
            >
              <div className="category-icon-circle">
                {getCategoryIcon(cat.nombre)}
              </div>
              <span className="category-label">{cat.nombre}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
