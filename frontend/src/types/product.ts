export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  imagenUrl: string | null;
  showPrice?: boolean;
  isVisible?: boolean;
}

export interface CategoryInfo {
  nombre: string;
  cantidad: number;
}

export interface ProductsApiResponse {
  data: Product[];
  meta: {
    total: number;
    categories: string[];
    globalShowPrices?: boolean;
  };
}

export interface CategoriesApiResponse {
  data: CategoryInfo[];
}
