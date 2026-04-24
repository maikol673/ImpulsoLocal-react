/**
 * Footer.jsx - Pie de página de la aplicación
 */
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';
import logo from '../../assets/logo.png';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Logo y descripción */}
        <div className="footer-brand">
          <div className="footer-logo">
            <Link to="/">
              <img src={logo} alt="Plataforma de Emprendimiento" />
            </Link>
          </div>
          <p className="brand-description">
            Conectamos emprendedores con las herramientas y el apoyo que necesitan para crecer.
          </p>
        </div>

        {/* Columna 1: Plataforma */}
        <div className="footer-column">
          <h4>Plataforma</h4>
          <ul>
            <li><Link to="/ventures">Emprendimientos</Link></li>
            <li><Link to="/publish">Publicar</Link></li>
            <li><Link to="/about">Sobre nosotros</Link></li>
          </ul>
        </div>

        {/* Columna 2: Apoyo */}
        <div className="footer-column">
          <h4>Apoyo</h4>
          <ul>
            <li><Link to="/help">Centro de ayuda</Link></li>
            <li><Link to="/contact">Contacto</Link></li>
            <li><Link to="/privacy">Política de privacidad</Link></li>
          </ul>
        </div>

        {/* Columna 3: Conectar */}
        <div className="footer-column">
          <h4>Conectar</h4>
          <ul className="social-links">
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">🐦 Twitter</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">💼 LinkedIn</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">📷 Instagram</a></li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>© {currentYear} Plataforma de Emprendimiento. Todos los derechos reservados.</p>
        <p className="footer-motto">Empoderando a emprendedores de todo el mundo 🌎</p>
      </div>
    </footer>
  );
};

export default Footer;