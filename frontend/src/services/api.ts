import { ProductsApiResponse, CategoriesApiResponse, Product } from '@/types/product';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

async function fetchApi<T>(endpoint: string): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    next: { revalidate: 300 }, // ISR: revalidate every 5 minutes
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

export async function getProducts(
  search?: string,
  category?: string,
): Promise<ProductsApiResponse> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const query = params.toString();
  return fetchApi<ProductsApiResponse>(`/api/products${query ? `?${query}` : ''}`);
}

export async function getProduct(id: string): Promise<{ data: Product }> {
  return fetchApi<{ data: Product }>(`/api/products/${id}`);
}

export async function getCategories(): Promise<CategoriesApiResponse> {
  return fetchApi<CategoriesApiResponse>('/api/categories');
}

// Client-side fetch (no ISR)
export async function clientFetchProducts(
  search?: string,
  category?: string,
): Promise<ProductsApiResponse> {
  const params = new URLSearchParams();
  if (search) params.set('search', search);
  if (category) params.set('category', category);

  const query = params.toString();
  const res = await fetch(`${API_BASE}/api/products${query ? `?${query}` : ''}`);

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}
