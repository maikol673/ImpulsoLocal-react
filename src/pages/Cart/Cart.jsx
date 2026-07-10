/**
 * Cart.jsx - Carrito de Compras
 * CON API REAL
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, updateCartItem, removeFromCart, clearCart, BASE_URL } from '../../services/api';
import './Cart.css';

const Cart = () => {
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [total, setTotal] = useState(0);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Calcular total (declarada con useCallback, antes de usarse en el efecto)
    const calcularTotal = useCallback((items) => {
        const nuevoTotal = items.reduce((sum, item) => sum + (item.precio * item.cantidad), 0);
        setTotal(nuevoTotal);
    }, []);

    // ✅ Construye la URL completa de la imagen, sin importar si es relativa o absoluta
    const getImageUrl = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith('http')) return imagen;
        return `${BASE_URL}${imagen}`;
    };

    // Redirigir si no hay sesión (dentro de un efecto, no antes de los Hooks)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [user.id, navigate]);

    // Cargar carrito (solo si hay usuario)
    useEffect(() => {
        if (!user.id) return;

        const loadCart = async () => {
            try {
                setLoading(true);
                const data = await getCart(user.id);
                
                if (data.items) {
                    setCartItems(data.items);
                    setTotal(data.total || 0);
                } else {
                    setCartItems(data);
                    calcularTotal(data);
                }
                
                console.log('🛒 Carrito cargado:', data);
                
            } catch (err) {
                console.error('Error cargando carrito:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadCart();
    }, [user.id, calcularTotal]);

    // Actualizar cantidad
    const updateQuantity = async (itemId, newQuantity) => {
        if (newQuantity < 1) return;
        
        setUpdating(true);
        
        try {
            await updateCartItem(itemId, { cantidad: newQuantity });
            
            // Actualizar lista local
            const updatedItems = cartItems.map(item => 
                item.id === itemId 
                    ? { ...item, cantidad: newQuantity }
                    : item
            );
            setCartItems(updatedItems);
            calcularTotal(updatedItems);
            
        } catch (err) {
            console.error('Error actualizando cantidad:', err);
            alert('Error al actualizar la cantidad');
        } finally {
            setUpdating(false);
        }
    };

    // Eliminar item del carrito
    const handleRemoveItem = async (itemId, productName) => {
        if (!window.confirm(`¿Eliminar "${productName}" del carrito?`)) {
            return;
        }
        
        try {
            await removeFromCart(itemId);
            
            // Actualizar lista local
            const updatedItems = cartItems.filter(item => item.id !== itemId);
            setCartItems(updatedItems);
            calcularTotal(updatedItems);
            
            alert('✅ Producto eliminado del carrito');
            
        } catch (err) {
            console.error('Error eliminando del carrito:', err);
            alert('Error al eliminar del carrito');
        }
    };

    // Vaciar carrito
    const handleClearCart = async () => {
        if (!window.confirm('¿Vaciar todo el carrito?')) {
            return;
        }
        
        try {
            await clearCart(user.id);
            setCartItems([]);
            setTotal(0);
            alert('✅ Carrito vaciado');
            
        } catch (err) {
            console.error('Error vaciando carrito:', err);
            alert('Error al vaciar el carrito');
        }
    };

    // Ir a checkout
    const handleCheckout = () => {
        if (cartItems.length === 0) {
            alert('El carrito está vacío');
            return;
        }
        navigate('/checkout');
    };

    // ============================================================
    // ✅ RENDERIZADO (después de todos los Hooks)
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="cart-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando carrito...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="cart-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="cart-page">
            <div className="container">
                
                {/* Header con botón volver */}
                <div className="cart-header">
                    <div className="cart-header-left">
                        <Link to="/" className="btn-back-home-cart">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="cart-title">🛒 Mi Carrito de Compras</h1>
                    </div>
                </div>
                
                {cartItems.length > 0 ? (
                    <>
                        {/* Lista de productos */}
                        <div className="cart-card">
                            <div className="cart-body">
                                
                                {/* Encabezado desktop */}
                                <div className="cart-header-grid desktop-only">
                                    <div className="col-product">Producto</div>
                                    <div className="col-price">Precio</div>
                                    <div className="col-quantity">Cantidad</div>
                                    <div className="col-subtotal">Subtotal</div>
                                    <div className="col-actions">Acciones</div>
                                </div>
                                
                                {/* Items del carrito */}
                                {cartItems.map(item => (
                                    <div key={item.id} className="cart-item">
                                        
                                        {/* Producto */}
                                        <div className="item-product">
                                            {item.imagen ? (
                                                <img 
                                                    src={getImageUrl(item.imagen)} 
                                                    alt={item.nombre}
                                                    className="item-image"
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                    }}
                                                />
                                            ) : (
                                                <div className="item-image-placeholder">
                                                    <span>📦</span>
                                                </div>
                                            )}
                                            <div className="item-info">
                                                <h6 className="item-name">{item.nombre}</h6>
                                                <small className="item-venture">
                                                    {item.emprendimiento_nombre || 'Emprendimiento'}
                                                </small>
                                            </div>
                                        </div>
                                        
                                        {/* Precio */}
                                        <div className="item-price">
                                            <span className="price-label">Precio:</span>
                                            <span className="price-value">${item.precio}</span>
                                        </div>
                                        
                                        {/* Cantidad */}
                                        <div className="item-quantity">
                                            <label className="quantity-label">Cantidad:</label>
                                            <div className="quantity-control">
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                                                    disabled={updating || item.cantidad <= 1}
                                                >
                                                    −
                                                </button>
                                                <span className="qty-number">{item.cantidad}</span>
                                                <button 
                                                    className="qty-btn"
                                                    onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                                                    disabled={updating}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        
                                        {/* Subtotal */}
                                        <div className="item-subtotal">
                                            <span className="subtotal-label">Subtotal:</span>
                                            <span className="subtotal-value">
                                                ${(item.precio * item.cantidad).toFixed(2)}
                                            </span>
                                        </div>
                                        
                                        {/* Eliminar */}
                                        <div className="item-actions">
                                            <button 
                                                className="btn-remove"
                                                onClick={() => handleRemoveItem(item.id, item.nombre)}
                                                disabled={updating}
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                        
                                    </div>
                                ))}
                                
                                {/* Botones de acción */}
                                <div className="cart-actions">
                                    <button className="btn-clear" onClick={handleClearCart}>
                                        🗑️ Vaciar Carrito
                                    </button>
                                    <div className="cart-actions-right">
                                        <button 
                                            className="btn-checkout" 
                                            onClick={handleCheckout}
                                        >
                                            ✅ Finalizar Compra
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        {/* Total */}
                        <div className="cart-total">
                            <div className="total-body">
                                <h4 className="total-label">Total:</h4>
                                <h4 className="total-value">${total.toFixed(2)}</h4>
                            </div>
                        </div>
                        
                    </>
                ) : (
                    /* Carrito vacío */
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h4>Tu carrito está vacío</h4>
                        <p>¡Descubre productos increíbles en nuestros emprendimientos!</p>
                        <Link to="/ventures" className="btn-explore">
                            Explorar Emprendimientos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Cart;