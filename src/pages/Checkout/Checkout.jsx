/**
 * Checkout.jsx - Finalizar Compra
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCart, createOrder } from '../../services/api';
import './Checkout.css';

const Checkout = () => {
    const navigate = useNavigate();
    
    // ============================================================
    //  TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [cartItems, setCartItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [total, setTotal] = useState(0);
    
    const [formData, setFormData] = useState({
        direccion: '',
        ciudad: '',
        codigo_postal: '',
        telefono: '',
        notas: ''
    });
    
    const [errors, setErrors] = useState({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar carrito (solo si hay usuario logueado)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadCart = async () => {
            try {
                setLoading(true);
                const data = await getCart(user.id);
                
                if (data && data.items && data.items.length > 0) {
                    setCartItems(data.items);
                    setTotal(parseFloat(data.total) || 0);
                } else {
                    // Si el carrito está vacío, redirigir al carrito
                    navigate('/cart');
                }
                
            } catch (err) {
                console.error('Error cargando carrito:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadCart();
    }, [user.id, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.direccion.trim()) {
            newErrors.direccion = 'La dirección es obligatoria';
        }
        
        if (!formData.ciudad.trim()) {
            newErrors.ciudad = 'La ciudad es obligatoria';
        }
        
        if (!formData.codigo_postal.trim()) {
            newErrors.codigo_postal = 'El código postal es obligatorio';
        }
        
        if (!formData.telefono.trim()) {
            newErrors.telefono = 'El teléfono es obligatorio';
        } else if (!/^\d{7,15}$/.test(formData.telefono.replace(/\s/g, ''))) {
            newErrors.telefono = 'Teléfono inválido (mínimo 7 dígitos)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            const orderData = {
                usuario_id: user.id,
                direccion_envio: formData.direccion,
                ciudad: formData.ciudad,
                codigo_postal: formData.codigo_postal,
                telefono_contacto: formData.telefono,
                notas: formData.notas || '',
                items: cartItems.map(item => ({
                    producto_id: item.producto_id,
                    cantidad: item.cantidad,
                    precio: parseFloat(item.precio.replace(/,/g, ''))
                }))
            };
            
            console.log('📡 Creando orden:', orderData);
            
            const response = await createOrder(orderData);
            console.log('✅ Orden creada:', response);
            
            setSuccess(true);
            setSubmitting(false);
            
            setTimeout(() => {
                navigate('/my-orders');
            }, 2000);
            
        } catch (err) {
            console.error('❌ Error al crear orden:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al crear la orden');
            }
            setSubmitting(false);
        }
    };

    // ============================================================
    // ✅ RENDERIZADO (después de todos los Hooks)
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="checkout-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando carrito...</p>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="empty-cart">
                        <div className="empty-icon">🛒</div>
                        <h4>Tu carrito está vacío</h4>
                        <p>Agrega productos antes de finalizar la compra</p>
                        <Link to="/ventures" className="btn btn-primary">Explorar Emprendimientos</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="checkout-page">
                <div className="container">
                    <div className="success-card">
                        <div className="success-icon">🎉</div>
                        <h2 className="success-title">¡Compra Confirmada!</h2>
                        <p className="success-text">
                            Tu orden ha sido procesada exitosamente. Recibirás un correo con los detalles.
                        </p>
                        <Link to="/my-orders" className="btn-orders">
                            📦 Ver Mis Órdenes
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="container">
                
                <div className="checkout-header">
                    <Link to="/cart" className="btn-back-checkout">
                        ← Volver al Carrito
                    </Link>
                    <h1 className="checkout-title">✅ Finalizar Compra</h1>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}
                
                <div className="checkout-grid">
                    
                    {/* Resumen del Carrito */}
                    <div className="cart-summary">
                        <div className="summary-card">
                            <div className="summary-header">
                                <h5 className="summary-title">Resumen de tu Compra</h5>
                            </div>
                            <div className="summary-body">
                                {cartItems.map(item => (
                                    <div key={item.id} className="summary-item">
                                        <div className="summary-item-info">
                                            <small className="summary-item-name">{item.nombre}</small>
                                            <br />
                                            <small className="summary-item-qty">
                                                {item.cantidad} x ${item.precio}
                                            </small>
                                        </div>
                                        <div className="summary-item-total">
                                            <small>${(parseFloat(item.precio.replace(/,/g, '')) * item.cantidad).toFixed(2)}</small>
                                        </div>
                                    </div>
                                ))}
                                
                                <hr className="summary-divider" />
                                
                                <div className="summary-total">
                                    <div className="summary-total-label">
                                        <h6 className="fw-bold">Total:</h6>
                                    </div>
                                    <div className="summary-total-value">
                                        <h6 className="fw-bold">${total.toFixed(2)}</h6>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Formulario de Envío */}
                    <div className="shipping-form">
                        <div className="form-card">
                            <div className="form-header">
                                <h5 className="form-title">Información de Envío</h5>
                            </div>
                            <div className="form-body">
                                <form onSubmit={handleSubmit}>
                                    
                                    <div className="form-group">
                                        <label className="form-label">Dirección *</label>
                                        <input
                                            type="text"
                                            name="direccion"
                                            className={`form-control ${errors.direccion ? 'error' : ''}`}
                                            value={formData.direccion}
                                            onChange={handleChange}
                                            placeholder="Calle 123 #45-67"
                                        />
                                        {errors.direccion && <span className="error-text">{errors.direccion}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Ciudad *</label>
                                        <input
                                            type="text"
                                            name="ciudad"
                                            className={`form-control ${errors.ciudad ? 'error' : ''}`}
                                            value={formData.ciudad}
                                            onChange={handleChange}
                                            placeholder="Bogotá"
                                        />
                                        {errors.ciudad && <span className="error-text">{errors.ciudad}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Código Postal *</label>
                                        <input
                                            type="text"
                                            name="codigo_postal"
                                            className={`form-control ${errors.codigo_postal ? 'error' : ''}`}
                                            value={formData.codigo_postal}
                                            onChange={handleChange}
                                            placeholder="110111"
                                        />
                                        {errors.codigo_postal && <span className="error-text">{errors.codigo_postal}</span>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Teléfono *</label>
                                        <input
                                            type="tel"
                                            name="telefono"
                                            className={`form-control ${errors.telefono ? 'error' : ''}`}
                                            value={formData.telefono}
                                            onChange={handleChange}
                                            placeholder="3001234567"
                                        />
                                        {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                                        <div className="form-hint">Mínimo 7 dígitos</div>
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Notas (opcional)</label>
                                        <textarea
                                            name="notas"
                                            className="form-control"
                                            rows="3"
                                            value={formData.notas}
                                            onChange={handleChange}
                                            placeholder="Instrucciones especiales para la entrega..."
                                        />
                                    </div>

                                    <div className="form-actions">
                                        <button type="submit" className="btn-confirm" disabled={submitting}>
                                            {submitting ? 'Procesando...' : '✅ Confirmar Compra'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                    
                </div>
            </div>
        </div>
    );
};

export default Checkout;