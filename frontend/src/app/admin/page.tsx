'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getProducts, updateProductImage, updateGlobalShowPrices, updateProductShowPrice } from '@/services/api';
import { uploadToCloudinary } from '@/services/cloudinary';
import Navbar from '@/components/layout/Navbar';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [globalShowPrices, setGlobalShowPrices] = useState(true);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    // Check if we have password in sessionStorage
    const savedPassword = sessionStorage.getItem('adminPassword');
    if (savedPassword) {
      setPassword(savedPassword);
      handleLogin(savedPassword);
    }
  }, []);

  const handleLogin = async (passToTry?: string) => {
    const currentPass = passToTry || password;
    if (!currentPass) return;
    
    setLoading(true);
    setError('');
    
    try {
      // Fetch products to verify we can access the page (even though products is public, 
      // we just want to load them once logged in)
      const data = await getProducts();
      setProducts(data.data);
      if (data.meta && data.meta.globalShowPrices !== undefined) {
        setGlobalShowPrices(data.meta.globalShowPrices);
      }
      setIsLoggedIn(true);
      sessionStorage.setItem('adminPassword', currentPass);
    } catch (err) {
      setError('Error al cargar productos');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingId(productId);
    setError('');

    try {
      // 1. Upload to Cloudinary
      const imageUrl = await uploadToCloudinary(file);
      
      // 2. Update via API
      await updateProductImage(productId, imageUrl, password);
      
      // 3. Update local state
      setProducts(prev => 
        prev.map(p => p.id === productId ? { ...p, imagenUrl: imageUrl } : p)
      );
      
      alert('Imagen subida y guardada exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al subir la imagen');
      if (err.message.includes('Contraseña incorrecta')) {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminPassword');
      }
    } finally {
      setUploadingId(null);
    }
  };

  const handleGlobalToggle = async () => {
    try {
      const newValue = !globalShowPrices;
      setGlobalShowPrices(newValue);
      await updateGlobalShowPrices(newValue, password);
      // Actualizar todos los productos que no tengan un override para que reflejen el nuevo estado visualmente
      // Lo más fácil es recargar los productos
      const data = await getProducts();
      setProducts(data.data);
    } catch (err: any) {
      alert('Error al actualizar configuración global');
      setGlobalShowPrices(!globalShowPrices); // rollback
    }
  };

  const handleProductToggle = async (product: Product) => {
    setTogglingId(product.id);
    try {
      const newValue = !product.showPrice;
      await updateProductShowPrice(product.id, newValue, password);
      setProducts(prev => 
        prev.map(p => p.id === product.id ? { ...p, showPrice: newValue } : p)
      );
    } catch (err: any) {
      alert('Error al actualizar visibilidad del producto');
    } finally {
      setTogglingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '150px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <h1 style={{ marginBottom: '2rem' }}>Acceso Administración</h1>
          <div style={{ background: '#FAF8F5', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #c5ceae', borderRadius: '0.5rem' }}
            />
            <button 
              onClick={() => handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '0.8rem', background: '#5C6B3C', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </div>
        </main>
      </>
    );
  }

  const filteredProducts = products.filter(
    (p) =>
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h1>Panel de Administración</h1>
          <button 
            onClick={() => {
              sessionStorage.removeItem('adminPassword');
              setIsLoggedIn(false);
            }}
            style={{ padding: '0.5rem 1rem', background: '#e1e6d5', border: 'none', borderRadius: '0.5rem', cursor: 'pointer' }}
          >
            Cerrar Sesión
          </button>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffeeee', borderRadius: '0.5rem' }}>{error}</p>}

        <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Buscar producto por nombre o categoría..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, padding: '1rem', border: '1px solid #c5ceae', borderRadius: '0.5rem', fontSize: '1rem', outline: 'none' }}
          />
          <div style={{ background: 'white', padding: '1rem', borderRadius: '0.5rem', border: '1px solid #c5ceae', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <span style={{ fontWeight: 600, color: '#5C6B3C' }}>Precios Globales:</span>
            <button 
              onClick={handleGlobalToggle}
              style={{
                background: globalShowPrices ? '#25D366' : '#A3A3A3',
                color: 'white',
                border: 'none',
                padding: '0.5rem 1rem',
                borderRadius: '2rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                transition: 'all 0.3s'
              }}
            >
              {globalShowPrices ? 'VISIBLES' : 'OCULTOS'}
            </button>
          </div>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '1rem', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <thead>
              <tr style={{ background: '#5C6B3C', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Producto</th>
                <th style={{ padding: '1rem' }}>Categoría</th>
                <th style={{ padding: '1rem' }}>Mostrar Precio</th>
                <th style={{ padding: '1rem' }}>Imagen Actual</th>
                <th style={{ padding: '1rem' }}>Acción</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e1e6d5' }}>
                  <td style={{ padding: '1rem' }}>{product.nombre}</td>
                  <td style={{ padding: '1rem' }}>{product.categoria}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleProductToggle(product)}
                      disabled={togglingId === product.id}
                      style={{
                        background: product.showPrice ? '#5C6B3C' : '#e1e6d5',
                        color: product.showPrice ? 'white' : '#5C6B3C',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        cursor: togglingId === product.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem'
                      }}
                    >
                      {togglingId === product.id ? '...' : (product.showPrice ? 'Sí' : 'No')}
                    </button>
                  </td>
                  <td style={{ padding: '1rem' }}>
                    {product.imagenUrl ? (
                      <img src={product.imagenUrl} alt={product.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                    ) : (
                      <span style={{ color: '#A3A3A3', fontSize: '0.9rem' }}>Sin imagen</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                      <button 
                        disabled={uploadingId === product.id}
                        style={{ padding: '0.5rem 1rem', background: '#D4C5A9', border: 'none', borderRadius: '0.5rem', cursor: uploadingId === product.id ? 'not-allowed' : 'pointer' }}
                      >
                        {uploadingId === product.id ? 'Subiendo...' : 'Subir Foto'}
                      </button>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleFileUpload(product.id, e)}
                        disabled={uploadingId === product.id}
                        style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </>
  );
}
