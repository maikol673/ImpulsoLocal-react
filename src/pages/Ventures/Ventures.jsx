/* Ventures.jsx - Página de listado de emprendimientos*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Ventures.css';

const Ventures = () => {
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [currentPage, setCurrentPage] = useState(1); 

  // Categorías disponibles
  const categories = ['All', 'Technology', 'Food', 'Services', 'Fashion', 'Crafts'];

  // Datos de ejemplo (normalmente vendrían de una API)
  const ventures = [
    {
      id: 1,
      name: 'GreenTech Solutions',
      category: 'Technology',
      description: 'Tech solutions for urban agriculture and carbon footprint reduction.',
      location: 'Bogotá, Colombia',
      rating: 4.8,
      reviews: 120,
      featured: true,
      image: 'https://images.unsplash.com/photo-1551434678-e076c223a692'
    },
    {
      id: 2,
      name: 'ArtesanaCo',
      category: 'Crafts',
      description: 'Platform connecting local artisans with international buyers.',
      location: 'Medellín, Colombia',
      rating: 4.5,
      reviews: 89,
      featured: false,
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b'
    },
    {
      id: 3,
      name: 'EduSmart',
      category: 'Technology',
      description: 'Interactive learning platform for children with AI.',
      location: 'Santiago, Chile',
      rating: 4.9,
      reviews: 210,
      featured: false,
      image: 'https://images.unsplash.com/photo-1556740738-b6a63e27c4df'
    },
    {
      id: 4,
      name: 'FoodyApp',
      category: 'Food',
      description: 'Restaurant discovery and food delivery platform.',
      location: 'Lima, Perú',
      rating: 4.6,
      reviews: 156,
      featured: true,
      image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5'
    }
  ];

  // Elementos por página 
  const itemsPerPage = 6;
  
  // Calcular índices para la paginación
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  
  // Filtrar emprendimientos según búsqueda y categoría
  const filteredVentures = ventures.filter(venture => {
    const matchesSearch = venture.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          venture.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory === 'All' || venture.category === activeCategory;
    return matchesSearch && matchesCategory;
  });
  
  // Aplicar paginación a los resultados filtrados
  const currentVentures = filteredVentures.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredVentures.length / itemsPerPage);
  
  // Función para cambiar de página 
  const goToPage = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' }); 
  };
  
  // Función para página siguiente
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Función para página anterior
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  
  // Función para limpiar filtros
  const clearFilters = () => {
    setSearchTerm('');
    setActiveCategory('All');
    setCurrentPage(1); 
  };

  return (
    <div className="ventures-page">
      {/* Hero de la página */}
      <section className="hero">
        <h1>Discover innovative ventures</h1>
        <p>Explore projects that are transforming the entrepreneurial ecosystem</p>
      </section>

      {/* Sección de filtros */}
      <section className="filters-section">
        <div className="container">
          {/* Barra de búsqueda */}
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
            <button className="search-button">
              🔍 Search
            </button>
          </div>
          
          {/* Botones de categorías */}
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

      {/* Listado de emprendimientos */}
      <section className="ventures-list-section">
        <div className="container">
          {/* Mostrar contador de resultados */}
          <div className="results-count">
            Found {filteredVentures.length} ventures
            {filteredVentures.length > 0 && ` - Page ${currentPage} of ${totalPages}`}
          </div>
          
          {/* Grid de tarjetas */}
          <div className="ventures-grid">
            {currentVentures.map(venture => (
              <div key={venture.id} className="venture-card">
                {/* Imagen */}
                <div 
                  className="venture-image" 
                  style={{ backgroundImage: `url(${venture.image}?auto=format&fit=crop&w=500&q=60)` }}
                >
                  {venture.featured && <span className="featured-badge">Featured</span>}
                </div>
                
                {/* Información */}
                <div className="venture-content">
                  <h3>{venture.name}</h3>
                  <span className="venture-category">{venture.category}</span>
                  <p className="venture-description">{venture.description}</p>
                  
                  <div className="venture-meta">
                    <span className="rating">⭐ {venture.rating}</span>
                    <span className="reviews">({venture.reviews} reviews)</span>
                    <span className="location">📍 {venture.location}</span>
                  </div>
                  
                  <Link to={`/venture/${venture.id}`} className="btn-details">
                    View Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
          
          {/* Paginación - AHORA SÍ SE USA setCurrentPage */}
          {totalPages > 1 && (
            <div className="pagination">
              <button 
                className="page-btn" 
                onClick={prevPage}
                disabled={currentPage === 1}
              >
                ‹ Previous
              </button>
              
              {/* Generar botones de página dinámicamente */}
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
          
          {/* Mensaje cuando no hay resultados */}
          {filteredVentures.length === 0 && (
            <div className="no-results">
              <p>No ventures found matching your criteria.</p>
              <button onClick={clearFilters}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Ventures;