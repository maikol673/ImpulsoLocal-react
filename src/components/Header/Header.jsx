/**
 * Header.jsx - Barra de navegación superior
 * CON CONTADOR DE CARRITO - CON ADMIN
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart } from '../../services/api';
import './Header.css';
import logo from '../../assets/logo.png';

const Header = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [cartCount, setCartCount] = useState(0);

    // Cargar carrito
    const cargarCarrito = useCallback(async (usuarioId) => {
        try {
            console.log('📡 Cargando carrito para usuario:', usuarioId);
            const data = await getCart(usuarioId);
            if (data && data.items) {
                const totalItems = data.items.reduce((sum, item) => sum + item.cantidad, 0);
                setCartCount(totalItems);
                console.log('🛒 Carrito cargado:', totalItems, 'items');
            } else {
                setCartCount(0);
            }
        } catch (error) {
            console.error('❌ Error cargando carrito:', error);
            setCartCount(0);
        }
    }, []);

    // Verificar login al cargar
    useEffect(() => {
        const checkAuth = () => {
            const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
            setIsLoggedIn(loggedIn);
            
            if (loggedIn) {
                try {
                    const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
                    console.log('👤 Usuario logueado:', storedUser);
                    setUser(storedUser);
                    if (storedUser.id) {
                        cargarCarrito(storedUser.id);
                    }
                } catch (error) {
                    console.error('Error parsing user data:', error);
                    setUser(null);
                    setCartCount(0);
                }
            } else {
                setUser(null);
                setCartCount(0);
            }
        };

        checkAuth();
        
        window.addEventListener('storage', checkAuth);
        
        return () => {
            window.removeEventListener('storage', checkAuth);
        };
    }, [cargarCarrito]);

    // Cerrar sesión
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUser(null);
        setCartCount(0);
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
                            {cartCount > 0 && (
                                <span className="cart-badge">{cartCount}</span>
                            )}
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
                                    <Link to="/chat" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        💬 Chat
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/cart" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        🛒 Mi Carrito
                                        {cartCount > 0 && (
                                            <span className="cart-dropdown-badge">{cartCount}</span>
                                        )}
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/settings" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                        ⚙️ Ajustes
                                    </Link>
                                </li>
                                <li><hr className="dropdown-divider" /></li>
                                {/* ✅ BOTÓN ADMIN - SIEMPRE VISIBLE PARA ADMINISTRADORES */}
                                {user?.is_staff === true && (
                                    <li>
                                        <Link to="/admin" className="dropdown-item" onClick={() => setDropdownOpen(false)}>
                                            👑 Admin
                                        </Link>
                                    </li>
                                )}
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
                
                {/* Botón Admin (fuera del dropdown) - solo para admins */}
                {isLoggedIn && user?.is_staff === true && (
                    <Link to="/admin" className="admin-desktop-btn">
                        <i className="fas fa-cog"></i> Admin
                    </Link>
                )}
            </div>
        </header>
    );
};

export default Header;