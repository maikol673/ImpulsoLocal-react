/**
 * Home.jsx - Página principal de la aplicación
 * Es la primera vista que ven los usuarios al entrar al sitio
 * Contiene: Hero, acciones, beneficios, testimonios y emprendimientos destacados
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-page">
      {/* 
        HERO SECTION - Sección principal de bienvenida
      */}
      <section className="hero">
        <h1>Take your entrepreneurship to the next level</h1>
        <p>Connect, learn and grow with our community of innovative entrepreneurs</p>
      </section>

      {/* 
        ACTIONS SECTION - Botones principales de acción
      */}
      <section className="actions-section">
        <h2 className="section-title">What do you want to do?</h2>
        <div className="actions-buttons">
          {/* Ver todos los emprendimientos */}
          <Link to="/ventures" className="action-button">
            View Ventures
          </Link>
          {/* Publicar un nuevo emprendimiento */}
          <Link to="/publish" className="action-button publish">
            Publish Venture
          </Link>
        </div>
      </section>

      {/* 
        FEATURES SECTION - Beneficios de la plataforma
      */}
      <section className="features-section">
        <h2 className="section-title">Our Benefits</h2>
        <div className="features-grid">
          {/* Beneficio 1: Crecimiento */}
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Growth</h3>
            <p>Tools to scale your business sustainably</p>
          </div>
          
          {/* Beneficio 2: Networking */}
          <div className="feature-card">
            <div className="feature-icon">🤝</div>
            <h3>Networking</h3>
            <p>Connect with mentors and other entrepreneurs</p>
          </div>
          
          {/* Beneficio 3: Formación */}
          <div className="feature-card">
            <div className="feature-icon">🎓</div>
            <h3>Training</h3>
            <p>Specialized courses for each stage of your business</p>
          </div>
        </div>
      </section>

      {/* 
        TESTIMONIALS SECTION - Opiniones de usuarios
      */}
      <section className="testimonials-section">
        <h2 className="section-title">What our members say</h2>
        <div className="testimonial-card">
          <p>"This ecosystem helped me connect with investors for my startup"</p>
          <p><strong>- Ana L., Founder of TechSolution</strong></p>
        </div>
        <div className="testimonial-card">
          <p>"The courses gave me the tools to triple my sales"</p>
          <p><strong>- Carlos M., Owner of Dulce Bakery</strong></p>
        </div>
      </section>

      {/* 
        FEATURED VENTURES - Emprendimientos destacados
      */}
      <section className="featured-ventures">
        <h2 className="section-title">Featured Ventures</h2>
        <div className="ventures-grid">
          <div className="venture-card">
            <h3>GreenTech</h3>
            <p>Sustainable solutions for urban agriculture.</p>
          </div>
          <div className="venture-card">
            <h3>EduSmart</h3>
            <p>Training platform for young entrepreneurs.</p>
          </div>
          <div className="venture-card">
            <h3>ArtesanaCo</h3>
            <p>Digital commerce for local artisans.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;