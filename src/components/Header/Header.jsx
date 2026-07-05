/**
 * Header.jsx - Barra de navegación superior
 * Muestra logo y botones según estado de autenticación
 * EXACTAMENTE como el base.html de Django
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Verificar login al cargar y cuando cambie localStorage
  useEffect(() => {
    const checkAuth = () => {
      const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
      setIsLoggedIn(loggedIn);
      
      if (loggedIn) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        setUser(userData);
      } else {
        setUser(null);
      }
    };

    checkAuth();
    
    // Escuchar cambios en localStorage
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('user');
    setIsLoggedIn(false);
    setUser(null);
    navigate('/');
  };

  // Alternar dropdown
  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownOpen && !event.target.closest('.dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [dropdownOpen]);

  return (
    <header className="header">
      {/* Logo */}
      <div className="logo">
        <Link to="/">
          <img src={logo} alt="Ecosistema Emprendedores" />
        </Link>
      </div>

      {/* Botones de autenticación */}
      <div className="auth-buttons">
        
        {/* Usuario logueado */}
        {isLoggedIn ? (
          <div className="dropdown">
            <button 
              className="dropdown-toggle btn-login" 
              onClick={toggleDropdown}
              aria-expanded={dropdownOpen}
            >
              👤 Hola, {user?.username || 'Usuario'}
            </button>
            
            {dropdownOpen && (
              <ul className="dropdown-menu show">
                <li>
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    👤 Mi Perfil
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📊 Dashboard
                  </Link>
                </li>
                <li>
                  <Link to="/my-orders" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📦 Mis Órdenes
                  </Link>
                </li>
                <li>
                  <Link to="/my-likes" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    ❤️ Mis Favoritos
                  </Link>
                </li>
                <li>
                  <Link to="/my-ventures" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🏪 Mis Emprendimientos
                  </Link>
                </li>
                <li>
                  <Link to="/my-events" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📅 Mis Eventos
                 </Link>
                </li>
                <li>
                  <Link to="/my-courses" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    📚 Mis Cursos
                  </Link>
                </li>
                <li>
                  <Link to="/chat" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    💬 Chat
                  </Link>
                </li>
                <li>
                  <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    🛒 Mi Carrito
                  </Link>
                </li>
                <li>
                  <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                    ⚙️ Ajustes
                  </Link>
                </li>
                <li><hr className="dropdown-divider" /></li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>
                    🚪 Cerrar Sesión
                  </button>
                </li>
              </ul>
            )}
          </div>
        ) : (
          // Usuario NO logueado
          <>
            <Link to="/login" className="btn-login">Iniciar sesión</Link>
            <Link to="/register" className="btn-signup">Registrarse</Link>
          </>
        )}
        
        {/* Botón Admin (solo para admins - simulado) */}
        {isLoggedIn && user?.isAdmin && (
          <Link to="/admin" className="admin-desktop-btn">
            <i className="fas fa-cog"></i> Admin
          </Link>
        )}
      </div>
    </header>
  );
};

export default Header;