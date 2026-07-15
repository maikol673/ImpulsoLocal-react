/**
 * Home.jsx - Página principal
 * SIN CRECIMIENTO - SOLO NETWORKING Y FORMACIÓN
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  // Leer datos directamente (sin useEffect)
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const testimonios = JSON.parse(localStorage.getItem('testimonios') || '[]');

  return (
    <div className="home-page">
      
      {/* HERO SECTION */}
      <section className="hero">
        <h1>Impulsa tu emprendimiento al siguiente nivel</h1>
        <p>Conecta, aprende y crece con nuestra comunidad de emprendedores innovadores</p>
      </section>

      {/* ACCIONES */}
      <section className="actions">
        <h2 className="section-title">¿Qué deseas hacer?</h2>
        <div className="actions-buttons">
          <Link to="/ventures" className="action-button">
            Ver Emprendimientos
          </Link>
          <Link to="/publish" className="action-button publish">
            Publicar Emprendimiento
          </Link>
        </div>
      </section>

      {/* BENEFICIOS - SOLO NETWORKING Y FORMACIÓN */}
      <section className="features">
        <h2 className="section-title">Nuestros Beneficios</h2>
        <div className="features-grid">
          
          {/* ✅ Networking */}
          <Link to="/networking" className="feature-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <div className="feature-icon">🤝</div>
              <h3>Networking</h3>
              <p>Conecta con mentores y otros emprendedores</p>
            </div>
          </Link>
          
          {/* ✅ Formación */}
          <Link to="/courses" className="feature-link" style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className="feature-card">
              <div className="feature-icon">🎓</div>
              <h3>Formación</h3>
              <p>Cursos especializados para cada etapa de tu negocio</p>
            </div>
          </Link>
          
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section className="testimonials">
        <h2 className="section-title">Lo que dicen nuestros miembros</h2>
        
        {testimonios.length > 0 ? (
          <div className="testimonials-grid">
            {testimonios.map((testimonio, index) => (
              <div key={index} className="testimonial-card">
                <p>"{testimonio.contenido}"</p>
                <div className="testimonial-author">
                  <strong>
                    {testimonio.nombre}
                    {testimonio.empresa && `, ${testimonio.empresa}`}
                  </strong>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-testimonials">
            <p className="no-testimonials-text">Aún no hay testimonios. ¡Sé el primero en compartir tu experiencia!</p>
          </div>
        )}
        
        {/* Botón para compartir testimonio - SIEMPRE visible */}
        <div className="testimonial-button-container">
          {isLoggedIn ? (
            <Link to="/create-testimonial" className="btn-share-testimonial">
              📝 Compartir mi experiencia
            </Link>
          ) : (
            <button 
              className="btn-share-testimonial"
              onClick={() => navigate('/login')}
            >
              📝 Inicia sesión para compartir tu experiencia
            </button>
          )}
        </div>
      </section>
      
    </div>
  );
};

export default Home;