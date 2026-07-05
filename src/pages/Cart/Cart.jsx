/**
 * Cart.jsx - Carrito de Compras
 * Muestra los productos agregados al carrito
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Cart.css';

const Cart = () => {
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO - Siempre en el mismo orden
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      producto: {
        id: 1,
        nombre: 'Kit Solar Portátil',
        precio: 299900,
        emprendimiento: { nombre: 'GreenTech' },
        stock: 15,
        imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=80'
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
        stock: 10,
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
        stock: 8,
        imagen: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=80'
      },
      cantidad: 1,
      subtotal: 149900
    }
  ]);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Calcular total
  const total = cartItems.reduce((sum, item) => sum + item.subtotal, 0);

  // Actualizar cantidad
  const updateQuantity = (itemId, newQuantity) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === itemId) {
          const quantity = Math.max(1, Math.min(newQuantity, item.producto.stock));
          return {
            ...item,
            cantidad: quantity,
            subtotal: quantity * item.producto.precio
          };
        }
        return item;
      })
    );
  };

  // Eliminar item del carrito
  const removeItem = (itemId, productName) => {
    if (window.confirm(`¿Eliminar "${productName}" del carrito?`)) {
      setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
    }
  };

  // Vaciar carrito
  const clearCart = () => {
    if (window.confirm('¿Vaciar todo el carrito?')) {
      setCartItems([]);
    }
  };

  return (
    <div className="cart-page">
      <div className="container">
        <h1 className="cart-title">🛒 Mi Carrito de Compras</h1>
        
        {cartItems.length > 0 ? (
          <>
            {/* Lista de productos */}
            <div className="cart-card">
              <div className="cart-body">
                
                {/* Encabezado para desktop */}
                <div className="cart-header desktop-only">
                  <div className="col-product">Producto</div>
                  <div className="col-price">Precio</div>
                  <div className="col-quantity">Cantidad</div>
                  <div className="col-subtotal">Subtotal</div>
                  <div className="col-actions">Acciones</div>
                </div>
                
                {/* Items del carrito */}
                {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                    
                    {/* Imagen y nombre */}
                    <div className="item-product">
                      {item.producto.imagen ? (
                        <img 
                          src={item.producto.imagen} 
                          alt={item.producto.nombre}
                          className="item-image"
                        />
                      ) : (
                        <div className="item-image-placeholder">
                          <span>📦</span>
                        </div>
                      )}
                      <div className="item-info">
                        <h6 className="item-name">{item.producto.nombre}</h6>
                        <small className="item-venture">{item.producto.emprendimiento.nombre}</small>
                      </div>
                    </div>
                    
                    {/* Precio */}
                    <div className="item-price">
                      <span className="price-label">Precio:</span>
                      <span className="price-value">${item.producto.precio.toLocaleString()}</span>
                    </div>
                    
                    {/* Cantidad */}
                    <div className="item-quantity">
                      <label className="quantity-label">Cantidad:</label>
                      <div className="quantity-control">
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                          disabled={item.cantidad <= 1}
                        >
                          −
                        </button>
                        <input
                          type="number"
                          className="qty-input"
                          value={item.cantidad}
                          onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                          min="1"
                          max={item.producto.stock}
                        />
                        <button 
                          className="qty-btn"
                          onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                          disabled={item.cantidad >= item.producto.stock}
                        >
                          +
                        </button>
                      </div>
                      <small className="stock-info">Stock: {item.producto.stock}</small>
                    </div>
                    
                    {/* Subtotal */}
                    <div className="item-subtotal">
                      <span className="subtotal-label">Subtotal:</span>
                      <span className="subtotal-value">${item.subtotal.toLocaleString()}</span>
                    </div>
                    
                    {/* Eliminar */}
                    <div className="item-actions">
                      <button 
                        className="btn-remove"
                        onClick={() => removeItem(item.id, item.producto.nombre)}
                      >
                        🗑️
                      </button>
                    </div>
                    
                  </div>
                ))}
                
                {/* Botones de acción */}
                <div className="cart-actions">
                  <div className="cart-actions-left">
                    <button className="btn-clear" onClick={clearCart}>
                      🗑️ Vaciar Carrito
                    </button>
                  </div>
                  <div className="cart-actions-right">
                    <button className="btn-update" onClick={() => alert('Carrito actualizado')}>
                      🔄 Actualizar Carrito
                    </button>
                    <Link to="/checkout" className="btn-checkout">
                      ✅ Finalizar Compra
                    </Link>
                    <Link to="/ventures" className="btn-continue">
                      🛍️ Seguir Comprando
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Total */}
            <div className="cart-total">
              <div className="total-body">
                <h4 className="total-label">Total:</h4>
                <h4 className="total-value">${total.toLocaleString()}</h4>
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