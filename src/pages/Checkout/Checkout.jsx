/**
 * Checkout.jsx - Finalizar Compra (Checkout)
 * Muestra el resumen del carrito y formulario de envío
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Checkout.css';

const Checkout = () => {
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [cartItems] = useState([
    {
      id: 1,
      producto: {
        id: 1,
        nombre: 'Kit Solar Portátil',
        precio: 299900,
        emprendimiento: { nombre: 'GreenTech' },
        imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=50'
      },
      cantidad: 1,
      subtotal: 299900
    },
    {
      id: 2,
      producto: {
        id: 2,
        nombre: 'Galletas de Chocolate',
        precio: 2500,
        emprendimiento: { nombre: 'Yupi' },
        imagen: null
      },
      cantidad: 3,
      subtotal: 7500
    },
    {
      id: 3,
      producto: {
        id: 3,
        nombre: 'Sensor Inteligente',
        precio: 149900,
        emprendimiento: { nombre: 'GreenTech' },
        imagen: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=50'
      },
      cantidad: 1,
      subtotal: 149900
    }
  ]);

  // Estado del formulario
  const [formData, setFormData] = useState({
    direccion: '',
    ciudad: '',
    codigo_postal: '',
    telefono: '',
    notas: ''
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Si el carrito está vacío, redirigir
  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Manejar cambios en el formulario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
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

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simular envío
    setTimeout(() => {
      console.log('📦 Orden creada:', {
        items: cartItems,
        total: total,
        ...formData
      });
      
      setSuccess(true);
      setSubmitting(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/my-orders');
      }, 2000);
    }, 1500);
  };

  // Si la compra fue exitosa
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
        <h1 className="checkout-title">✅ Finalizar Compra</h1>
        
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
                    <div className="summary-item-image">
                      {item.producto.imagen ? (
                        <img src={item.producto.imagen} alt={item.producto.nombre} />
                      ) : (
                        <div className="summary-item-placeholder">📦</div>
                      )}
                    </div>
                    <div className="summary-item-info">
                      <small className="summary-item-name">{item.producto.nombre}</small>
                      <br />
                      <small className="summary-item-qty">
                        {item.cantidad} x ${item.producto.precio.toLocaleString()}
                      </small>
                    </div>
                    <div className="summary-item-total">
                      <small className="fw-bold">${item.subtotal.toLocaleString()}</small>
                    </div>
                  </div>
                ))}
                
                <hr className="summary-divider" />
                
                <div className="summary-total">
                  <div className="summary-total-label">
                    <h6 className="fw-bold">Total:</h6>
                  </div>
                  <div className="summary-total-value">
                    <h6 className="fw-bold">${total.toLocaleString()}</h6>
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
                  
                  {/* Dirección */}
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
                    {errors.direccion && <div className="error-message">{errors.direccion}</div>}
                  </div>

                  {/* Ciudad */}
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
                    {errors.ciudad && <div className="error-message">{errors.ciudad}</div>}
                  </div>

                  {/* Código Postal */}
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
                    {errors.codigo_postal && <div className="error-message">{errors.codigo_postal}</div>}
                  </div>

                  {/* Teléfono */}
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
                    {errors.telefono && <div className="error-message">{errors.telefono}</div>}
                    <div className="form-hint">Mínimo 7 dígitos</div>
                  </div>

                  {/* Notas */}
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

                  {/* Botones */}
                  <div className="form-actions">
                    <button type="submit" className="btn-confirm" disabled={submitting}>
                      {submitting ? 'Procesando...' : '✅ Confirmar Compra'}
                    </button>
                    <Link to="/cart" className="btn-back-cart">
                      ← Volver al Carrito
                    </Link>
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