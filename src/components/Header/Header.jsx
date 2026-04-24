import React, { useState } from 'react';
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
  // Estado para controlar el menú responsive en móvil
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="header">
      {/* Logo de la empresa */}
      <div className="logo">
        <img src={logo} alt="Ecosistema Emprendedores" />
      </div>

      {/* Botones de autenticación - siempre visibles en desktop */}
      <div className="auth-buttons">
        <a href="/login" className="btn-login">Iniciar sesión</a>
        <a href="/registro" className="btn-signup">Registrarse</a>
      </div>

      {/* Botón de menú hamburguesa - solo visible en móvil */}
      <button 
        className="menu-toggle" 
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        aria-label="Menú de navegación"
      >
        ☰
      </button>
    </header>
  );
};

export default Header;