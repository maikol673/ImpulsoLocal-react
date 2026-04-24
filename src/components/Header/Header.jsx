/**
 * Header.jsx - Barra de navegación superior
 * Se muestra en todas las páginas de la aplicación
 * Contiene el logo y los botones de navegación principales
 */
import React from 'react';
import { Link } from 'react-router-dom';  // Link permite navegación sin recargar
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
  return (
    <header className="header">
      {/* Logo - Al hacer clic navega al home "/" */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Entrepreneurs Ecosystem" />
        </Link>
      </div>

      {/* Botones de navegación */}
      <div className="auth-buttons">
        {/* Botón Admin - Solo visible para administradores */}
        <Link to="/admin" className="admin-desktop-btn">
          <i className="fas fa-cog"></i> Admin
        </Link>
        {/* Botón Login - Inicio de sesión */}
        <Link to="/login" className="btn-login">Login</Link>
        {/* Botón Register - Registro de nuevos usuarios */}
        <Link to="/register" className="btn-signup">Register</Link>
      </div>

      {/* Menú hamburguesa - Solo visible en dispositivos móviles */}
      <button className="menu-toggle" aria-label="Navigation menu">
        ☰
      </button>
    </header>
  );
};

export default Header;