import HeroSection from '@/components/home/HeroSection';
import CatalogSection from '@/components/products/CatalogSection';
import { getProducts, getCategories } from '@/services/api';
import { Product, CategoryInfo } from '@/types/product';

export const revalidate = 300; // ISR: revalidate every 5 minutes

export default async function HomePage() {
  let products: Product[] = [];
  let categories: CategoryInfo[] = [];

  try {
    const [productsRes, categoriesRes] = await Promise.all([
      getProducts(),
      getCategories(),
    ]);
    products = productsRes.data;
    categories = categoriesRes.data;
  } catch (error) {
    console.error('Failed to fetch data from API:', error);
    // Will render with empty arrays — fallback UI handles this gracefully
  }

  return (
    <>
      <HeroSection
        totalProducts={products.length}
        totalCategories={categories.length}
      />
      <CatalogSection
        initialProducts={products}
        categories={categories}
      />
    </>
  );
}
