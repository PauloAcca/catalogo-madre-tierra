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
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
        <line x1="3" y1="9" x2="21" y2="9"/>
        <path d="M9 21V9"/>
      </svg>
    );
  }
  if (n.includes('congelados')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="2" x2="12" y2="22"/>
        <line x1="12" y1="2" x2="15" y2="5"/>
        <line x1="12" y1="2" x2="9" y2="5"/>
        <line x1="12" y1="22" x2="15" y2="19"/>
        <line x1="12" y1="22" x2="9" y2="19"/>
        <line x1="2" y1="12" x2="22" y2="12"/>
        <line x1="2" y1="12" x2="5" y2="9"/>
        <line x1="2" y1="12" x2="5" y2="15"/>
        <line x1="22" y1="12" x2="19" y2="9"/>
        <line x1="22" y1="12" x2="19" y2="15"/>
        <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"/>
        <line x1="4.93" y1="19.07" x2="19.07" y2="4.93"/>
      </svg>
    );
  }
  if (n.includes('dietetica') || n.includes('dietética')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (n.includes('perfumeria') || n.includes('perfumería')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"/>
        <line x1="16" y1="8" x2="2" y2="22"/>
        <line x1="17.5" y1="15" x2="9" y2="6.5"/>
      </svg>
    );
  }
  if (n.includes('fruta')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="14" r="8"/>
        <path d="M12 2v4"/>
        <path d="M10 2c0 2 2 2 2 4"/>
      </svg>
    );
  }
  if (n.includes('verdura')) {
    return (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
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
