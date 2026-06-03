'use client';

import { CategoryInfo } from '@/types/product';

interface CategoryFilterProps {
  categories: CategoryInfo[];
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter({
  categories,
  selected,
  onSelect,
}: CategoryFilterProps) {
  const totalProducts = categories.reduce((sum, c) => sum + c.cantidad, 0);

  return (
    <div className="category-filters" role="group" aria-label="Filtrar por categoría">
      <button
        className={`category-chip ${selected === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
        aria-pressed={selected === null}
      >
        Todos
        <span className="category-chip-count">{totalProducts}</span>
      </button>
      {categories.map((cat) => (
        <button
          key={cat.nombre}
          className={`category-chip ${selected === cat.nombre ? 'active' : ''}`}
          onClick={() => onSelect(selected === cat.nombre ? null : cat.nombre)}
          aria-pressed={selected === cat.nombre}
        >
          {cat.nombre}
          <span className="category-chip-count">{cat.cantidad}</span>
        </button>
      ))}
    </div>
  );
}
