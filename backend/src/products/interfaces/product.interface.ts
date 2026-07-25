export interface Product {
  id: string;
  nombre: string;
  categoria: string;
  precio: number | null;
  imagenUrl: string | null;
  showPrice?: boolean;
  _meta?: {
    sheetName: string;
    rowNumber: number;
    imgColLetter: string;
  };
}

export interface CategoryInfo {
  nombre: string;
  cantidad: number;
}

export interface ProductsResponse {
  data: Product[];
  meta: {
    total: number;
    categories: string[];
  };
}
