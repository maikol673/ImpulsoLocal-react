import React from 'react';
import './Footer.css';
import logo from '../../assets/logo.png'; 

/**
 * Componente Footer - Pie de página
 * Contiene logo, redes sociales y copyright
 */
const Footer = () => {
  return (
    <footer className="footer">
      <div className="logo">
        <img 
          src={logo} 
          alt="Ecosistema Emprendedores" 
          style={{ height: '50px', filter: 'brightness(0) invert(1)' }} 
        />
      </div>
      
      {/* Redes sociales - emojis como placeholders */}
      <div className="social-links">
        <a href="#" aria-label="Teléfono">📱</a>
        <a href="#" aria-label="Instagram">📷</a>
        <a href="#" aria-label="LinkedIn">💼</a>
      </div>
      
      {/* Copyright */}
      <p>© 2025 Plataforma para Emprendedores. Todos los derechos reservados.</p>
    </footer>
  );
};

export default Footer;