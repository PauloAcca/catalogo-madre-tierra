'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/types/product';
import { getProducts, updateProductImage, updateGlobalShowPrices, updateProductShowPrice, updateProductVisibility, deleteProduct, verifyAdminPassword } from '@/services/api';
import { uploadToCloudinary } from '@/services/cloudinary';
import Navbar from '@/components/layout/Navbar';

export default function AdminPage() {
  const [password, setPassword] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [imageFilter, setImageFilter] = useState<'all' | 'with_image' | 'without_image'>('all');
  const [visibilityFilter, setVisibilityFilter] = useState<'all' | 'visible' | 'hidden'>('all');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [globalShowPrices, setGlobalShowPrices] = useState(true);

  const [uploadingId, setUploadingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [togglingVisibilityId, setTogglingVisibilityId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

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
      // Verificar la contraseña con el backend primero
      await verifyAdminPassword(currentPass);

      // Si es correcta, cargamos todos los productos (incluidos ocultos) y permitimos el ingreso
      const data = await getProducts(undefined, undefined, true);
      setProducts(data.data);
      if (data.meta && data.meta.globalShowPrices !== undefined) {
        setGlobalShowPrices(data.meta.globalShowPrices);
      }
      setIsLoggedIn(true);
      sessionStorage.setItem('adminPassword', currentPass);
    } catch (err: any) {
      setError('Contraseña incorrecta. Inténtalo de nuevo.');
      sessionStorage.removeItem('adminPassword');
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

  const handleDeleteImage = async (productId: string) => {
    if (!confirm('¿Estás seguro de eliminar la foto de este producto?')) return;

    setUploadingId(productId);
    setError('');

    try {
      await updateProductImage(productId, '', password);
      setProducts((prev) =>
        prev.map((p) => (p.id === productId ? { ...p, imagenUrl: null } : p)),
      );
    } catch (err: any) {
      setError(err.message || 'Error al eliminar la imagen');
      if (err.message?.includes('Contraseña incorrecta')) {
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
      const data = await getProducts(undefined, undefined, true);
      setProducts(data.data);
    } catch (err: any) {
      alert(err.message || 'Error al actualizar configuración global');
      setGlobalShowPrices(!globalShowPrices); // rollback
      if (err.message === 'Contraseña incorrecta') {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminPassword');
      }
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
      alert(err.message || 'Error al actualizar visibilidad de precio');
      if (err.message === 'Contraseña incorrecta') {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminPassword');
      }
    } finally {
      setTogglingId(null);
    }
  };

  const handleVisibilityToggle = async (product: Product) => {
    setTogglingVisibilityId(product.id);
    try {
      const currentVisible = product.isVisible !== false;
      const nextVisible = !currentVisible;
      await updateProductVisibility(product.id, nextVisible, password);
      setProducts(prev => 
        prev.map(p => p.id === product.id ? { ...p, isVisible: nextVisible } : p)
      );
    } catch (err: any) {
      alert(err.message || 'Error al actualizar visibilidad del producto');
      if (err.message === 'Contraseña incorrecta') {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminPassword');
      }
    } finally {
      setTogglingVisibilityId(null);
    }
  };

  const handleDeleteProduct = async (product: Product) => {
    if (!confirm(`¿Estás seguro de eliminar el producto "${product.nombre}"? Se borrará también de la planilla Excel.`)) return;

    setDeletingId(product.id);
    setError('');

    try {
      await deleteProduct(product.id, password);
      setProducts(prev => prev.filter(p => p.id !== product.id));
      alert('Producto eliminado exitosamente');
    } catch (err: any) {
      setError(err.message || 'Error al eliminar el producto');
      if (err.message?.includes('Contraseña incorrecta')) {
        setIsLoggedIn(false);
        sessionStorage.removeItem('adminPassword');
      }
    } finally {
      setDeletingId(null);
    }
  };

  if (!isLoggedIn) {
    return (
      <>
        <Navbar />
        <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', paddingLeft: '1rem', paddingRight: '1rem' }}>
          <h1 style={{ marginBottom: '1.5rem', fontSize: 'clamp(1.5rem, 6vw, 2.5rem)', textAlign: 'center', wordBreak: 'break-word' }}>Acceso Administración</h1>
          <div style={{ background: '#FAF8F5', padding: '2rem', borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', width: '100%', maxWidth: '400px' }}>
            {error && <p style={{ color: 'red', marginBottom: '1rem' }}>{error}</p>}
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.8rem', marginBottom: '1rem', border: '1px solid #c5ceae', borderRadius: '0.5rem', fontSize: '16px' }}
            />
            <button 
              onClick={() => handleLogin()}
              disabled={loading}
              style={{ width: '100%', padding: '0.8rem', background: '#5C6B3C', color: 'white', border: 'none', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '16px' }}
            >
              {loading ? 'Cargando...' : 'Ingresar'}
            </button>
          </div>
        </main>
      </>
    );
  }

  const categories = Array.from(new Set(products.map((p) => p.categoria))).filter(Boolean).sort();

  const totalCount = products.length;
  const visibleCount = products.filter(p => p.isVisible !== false).length;
  const hiddenCount = products.filter(p => p.isVisible === false).length;
  const noImageCount = products.filter(p => !p.imagenUrl).length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.nombre.toLowerCase().includes(search.toLowerCase()) ||
      p.categoria.toLowerCase().includes(search.toLowerCase());

    const matchesCategory = selectedCategory === 'all' || p.categoria === selectedCategory;

    const matchesImage =
      imageFilter === 'all' ||
      (imageFilter === 'with_image' && Boolean(p.imagenUrl)) ||
      (imageFilter === 'without_image' && !p.imagenUrl);

    const matchesVisibility =
      visibilityFilter === 'all' ||
      (visibilityFilter === 'visible' && p.isVisible !== false) ||
      (visibilityFilter === 'hidden' && p.isVisible === false);

    return matchesSearch && matchesCategory && matchesImage && matchesVisibility;
  });

  return (
    <>
      <Navbar />
      <main className="container" style={{ paddingTop: '120px', minHeight: '100vh', paddingBottom: '2rem' }}>
        <div className="admin-header">
          <h1 style={{ fontSize: 'clamp(1.5rem, 5vw, 2.5rem)', margin: 0 }}>Panel de Administración</h1>
          <button 
            onClick={() => {
              sessionStorage.removeItem('adminPassword');
              setIsLoggedIn(false);
            }}
            style={{ 
              padding: '0.6rem 1.2rem', 
              background: '#dc2626', 
              color: 'white', 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: 'pointer', 
              fontSize: '14px',
              fontWeight: 600,
              boxShadow: '0 2px 6px rgba(220, 38, 38, 0.25)',
              transition: 'background 0.2s'
            }}
          >
            Cerrar Sesión
          </button>
        </div>

        {error && <p style={{ color: 'red', marginBottom: '1rem', padding: '1rem', background: '#ffeeee', borderRadius: '0.5rem' }}>{error}</p>}

        {/* Tarjetas de Estadísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{ background: '#FAF8F5', padding: '1.2rem', borderRadius: '0.8rem', border: '1px solid #e1e6d5', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.85rem', color: '#5C6B3C', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>TOTAL PRODUCTOS</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#2C3E50' }}>{totalCount}</span>
          </div>
          <div style={{ background: '#F0FDF4', padding: '1.2rem', borderRadius: '0.8rem', border: '1px solid #BBF7D0', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.85rem', color: '#166534', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>VISIBLES</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#15803D' }}>{visibleCount}</span>
          </div>
          <div style={{ background: '#FEF2F2', padding: '1.2rem', borderRadius: '0.8rem', border: '1px solid #FECACA', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.85rem', color: '#991B1B', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>NO VISIBLES</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#DC2626' }}>{hiddenCount}</span>
          </div>
          <div style={{ background: '#FFFBEB', padding: '1.2rem', borderRadius: '0.8rem', border: '1px solid #FDE68A', boxShadow: '0 2px 8px rgba(0,0,0,0.03)' }}>
            <span style={{ fontSize: '0.85rem', color: '#92400E', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>SIN IMAGEN</span>
            <span style={{ fontSize: '1.8rem', fontWeight: 700, color: '#D97706' }}>{noImageCount}</span>
          </div>
        </div>

        <div className="admin-controls">
          <div className="admin-global-toggle-box">
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

          <input
            type="text"
            placeholder="Buscar producto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="admin-search-input"
          />

          <div className="admin-selects-row">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="admin-select"
            >
              <option value="all">Todas las categorías ({products.length})</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>

            <select
              value={imageFilter}
              onChange={(e) => setImageFilter(e.target.value as any)}
              className="admin-select"
            >
              <option value="all">Fotos: Todas</option>
              <option value="with_image">Con foto</option>
              <option value="without_image">Sin foto</option>
            </select>

            <select
              value={visibilityFilter}
              onChange={(e) => setVisibilityFilter(e.target.value as any)}
              className="admin-select"
            >
              <option value="all">Visibilidad: Todos</option>
              <option value="visible">Visibles</option>
              <option value="hidden">Ocultos</option>
            </select>
          </div>
        </div>

        <div className="admin-table-wrapper">
          <table className="admin-table">
            <thead>
              <tr style={{ background: '#5C6B3C', color: 'white', textAlign: 'left' }}>
                <th style={{ padding: '1rem' }}>Producto</th>
                <th style={{ padding: '1rem' }}>Imagen Actual</th>
                <th style={{ padding: '1rem' }}>Subir Imagen</th>
                <th style={{ padding: '1rem' }}>Categoría</th>
                <th style={{ padding: '1rem' }}>Mostrar Producto</th>
                <th style={{ padding: '1rem' }}>Mostrar Precio</th>
                <th style={{ padding: '1rem' }}>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.map((product) => (
                <tr key={product.id} style={{ borderBottom: '1px solid #e1e6d5', opacity: product.isVisible === false ? 0.7 : 1 }}>
                  <td style={{ padding: '1rem', fontWeight: 500 }}>{product.nombre}</td>
                  <td style={{ padding: '1rem' }}>
                    {product.imagenUrl ? (
                      <img src={product.imagenUrl} alt={product.nombre} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '0.5rem' }} />
                    ) : (
                      <span style={{ color: '#A3A3A3', fontSize: '0.9rem' }}>Sin imagen</span>
                    )}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                      <div style={{ position: 'relative', overflow: 'hidden', display: 'inline-block' }}>
                        <button 
                          disabled={uploadingId === product.id}
                          style={{ 
                            padding: '0.4rem 0.8rem', 
                            background: '#D4C5A9', 
                            border: 'none', 
                            borderRadius: '0.5rem', 
                            cursor: uploadingId === product.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem'
                          }}
                        >
                          {uploadingId === product.id ? '...' : (product.imagenUrl ? 'Cambiar' : 'Subir')}
                        </button>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleFileUpload(product.id, e)}
                          disabled={uploadingId === product.id}
                          style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer' }}
                        />
                      </div>

                      {product.imagenUrl && (
                        <button
                          onClick={() => handleDeleteImage(product.id)}
                          disabled={uploadingId === product.id}
                          title="Eliminar foto"
                          style={{
                            padding: '0.4rem 0.8rem',
                            background: '#fee2e2',
                            color: '#dc2626',
                            border: '1px solid #fca5a5',
                            borderRadius: '0.5rem',
                            cursor: uploadingId === product.id ? 'not-allowed' : 'pointer',
                            fontSize: '0.85rem',
                            fontWeight: 600
                          }}
                        >
                          Eliminar
                        </button>
                      )}
                    </div>
                  </td>
                  <td style={{ padding: '1rem' }}>{product.categoria}</td>
                  <td style={{ padding: '1rem' }}>
                    <button
                      onClick={() => handleVisibilityToggle(product)}
                      disabled={togglingVisibilityId === product.id}
                      style={{
                        background: product.isVisible !== false ? '#25D366' : '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        cursor: togglingVisibilityId === product.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}
                    >
                      {togglingVisibilityId === product.id ? '...' : (product.isVisible !== false ? 'Visible' : 'Oculto')}
                    </button>
                  </td>
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
                    <button
                      onClick={() => handleDeleteProduct(product)}
                      disabled={deletingId === product.id}
                      title="Eliminar producto completamente"
                      style={{
                        background: '#dc2626',
                        color: 'white',
                        border: 'none',
                        padding: '0.4rem 0.8rem',
                        borderRadius: '0.5rem',
                        cursor: deletingId === product.id ? 'not-allowed' : 'pointer',
                        fontSize: '0.85rem',
                        fontWeight: 600,
                        boxShadow: '0 2px 4px rgba(220, 38, 38, 0.2)'
                      }}
                    >
                      {deletingId === product.id ? '...' : 'Borrar'}
                    </button>
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
