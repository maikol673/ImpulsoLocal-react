/**
 * Ventures.jsx - Página de listado de emprendimientos
 * AHORA CON DATOS REALES DESDE LA API DE LARAVEL
 */

import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getVentures, getCategories } from '../../services/api';
import './Ventures.css';

// ✅ DEFINIR LA URL BASE DE LA API
const API_URL = 'http://127.0.0.1:8000';

const Ventures = () => {
  // Estados para datos
  const [ventures, setVentures] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1);

  // ✅ Cargar datos desde la API de Laravel
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Cargar emprendimientos
        const venturesData = await getVentures();
        setVentures(venturesData);
        
        // Cargar categorías
        const categoriesData = await getCategories();
        const categoryNames = ['All', ...categoriesData.map(cat => cat.nombre)];
        setCategories(categoryNames);
        
        setError(null);
      } catch (err) {
        console.error('Error cargando datos:', err);
        setError(err.message || 'Error al cargar los datos');
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  // ✅ Construye la URL completa de la imagen
  const getVentureImageUrl = (imagen) => {
    // Si no hay imagen, usar placeholder
    if (!imagen) {
      return 'https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=500&q=60';
    }
    // Si ya es URL absoluta (http), devolverla
    if (imagen.startsWith('http')) {
      return imagen;
    }
    // Si es URL relativa (empieza con /), agregar la URL base
    if (imagen.startsWith('/')) {
      return `${API_URL}${imagen}`;
    }
    // Si es solo el nombre de archivo, construir la URL completa
    return `${API_URL}/uploads/emprendimientos/${imagen}`;
  };

  // Elementos por página
  const itemsPerPage = 6;
  
  // Calcular índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filtrar emprendimientos según búsqueda y categoría
  const filteredVentures = ventures.filter(venture => {
    const matchesSearch = venture.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venture.descripcion?.toLowerCase().includes(searchTerm.toLowerCase());
    
    let ventureCategory = venture.categoria?.nombre || venture.categoria || '';
    const matchesCategory = activeCategory === 'All' || ventureCategory === activeCategory;
    
    return matchesSearch && matchesCategory;
  });
  
  // Aplicar paginación
  const currentVentures = filteredVentures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVentures.length / itemsPerPage);
  
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setCurrentPage(1);
  };

  if (loading) {
    return (
      <div className="ventures-page">
        <section className="hero">
          <h1>Discover innovative ventures</h1>
          <p>Explore projects that are transforming the entrepreneurial ecosystem</p>
        </section>
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Cargando emprendimientos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="ventures-page">
        <section className="hero">
          <h1>Discover innovative ventures</h1>
          <p>Explore projects that are transforming the entrepreneurial ecosystem</p>
        </section>
        <div className="error-container">
          <p>❌ Error: {error}</p>
          <button onClick={() => window.location.reload()}>Intentar de nuevo</button>
        </div>
      </div>
    );
  }

  return (
    <div className="ventures-page">
      <section className="hero">
        <h1>Discover innovative ventures</h1>
        <p>Explore projects that are transforming the entrepreneurial ecosystem</p>
      </section>

      <section className="filters-section">
        <div className="container">
          <div className="search-bar">
            <input 
              type="text" 
              placeholder="Search ventures by name or description..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
            <button className="search-button">🔍 Search</button>
          </div>
          
          <div className="categories-filters">
            {categories.map(category => (
              <button 
                key={category}
                className={`category-btn ${activeCategory === category ? 'active' : ''}`}
                onClick={() => {
                  setActiveCategory(category);
                  setCurrentPage(1);
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="ventures-list-section">
        <div className="container">
          <div className="results-count">
            Found {filteredVentures.length} ventures
            {filteredVentures.length > 0 && ` - Page ${currentPage} of ${totalPages}`}
          </div>
          
          <div className="ventures-grid">
            {currentVentures.map(venture => (
              <div key={venture.id} className="venture-card">
                {/* ✅ IMAGEN CORREGIDA */}
                <div 
                  className="venture-image" 
                  style={{ 
                    backgroundImage: `url(${getVentureImageUrl(venture.imagen)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  {venture.destacado && <span className="featured-badge">Featured</span>}
                </div>
                
                <div className="venture-content">
                  <h3>{venture.nombre}</h3>
                  <span className="venture-category">
                    {venture.categoria?.nombre || venture.categoria || 'Sin categoría'}
                  </span>
                  <p className="venture-description">{venture.descripcion}</p>
                  
                  <div className="venture-meta">
                    <span className="rating">⭐ {venture.calificacion || 'N/A'}</span>
                    <span className="reviews">({venture.num_resenas || 0} reviews)</span>
                    <span className="location">📍 {venture.ubicacion || 'Ubicación no especificada'}</span>
                  </div>
                  
                  <Link to={`/venture/${venture.id}`} className="btn-details">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                ‹ Previous
              </button>
              
              {[...Array(totalPages).keys()].map(number => (
                <button
                  key={number + 1}
                  className={`page-btn ${currentPage === number + 1 ? 'active' : ''}`}
                  onClick={() => goToPage(number + 1)}
                >
                  {number + 1}
                </button>
              ))}
              
              <button 
                className="page-btn" 
                onClick={nextPage}
                disabled={currentPage === totalPages}
              >
                Next ›
              </button>
            </div>
          )}
          
          {filteredVentures.length === 0 && (
            <div className="no-results">
              <p>No ventures found matching your criteria.</p>
              <button onClick={clearFilters}>Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ventures;