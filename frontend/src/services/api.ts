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

export async function updateProductImage(
  productId: string,
  imageUrl: string,
  adminPassword: string,
): Promise<Product> {
  const res = await fetch(`${API_BASE}/api/products/${productId}/image`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${adminPassword}`,
    },
    body: JSON.stringify({ imageUrl }),
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => null);
    throw new Error(errorData?.message || 'Error al actualizar la imagen del producto');
  }

  const json = await res.json();
  return json.data;
}

export async function updateGlobalShowPrices(showPrices: boolean, adminPassword: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/config/global`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminPassword}`
    },
    body: JSON.stringify({ showPrices })
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error('Contraseña incorrecta');
    throw new Error('Error al actualizar configuración global');
  }
  
  return res.json();
}

export async function updateProductShowPrice(productId: string, showPrice: boolean | null, adminPassword: string): Promise<any> {
  const res = await fetch(`${API_BASE}/api/config/product`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${adminPassword}`
    },
    body: JSON.stringify({ productId, showPrice })
  });
  
  if (!res.ok) {
    if (res.status === 401) throw new Error('Contraseña incorrecta');
    throw new Error('Error al actualizar configuración del producto');
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
