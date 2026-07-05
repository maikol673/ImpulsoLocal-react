/**
 * MyOrders.jsx - Mis Órdenes
 * Muestra el historial de compras del usuario
 * SIN API - SIN useEffect - Datos directos
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './MyOrders.css';

const MyOrders = () => {
  const navigate = useNavigate();
  
  // ✅ Datos fijos - SIN useState (no necesitamos setOrders)
  const orders = [
    {
      id: 1001,
      fecha_creacion: '2024-01-15 14:30',
      total: 299900,
      estado: 'entregada',
      items: [
        { producto: { nombre: 'Kit Solar Portátil' } },
        { producto: { nombre: 'Sensor Inteligente' } }
      ]
    },
    {
      id: 1002,
      fecha_creacion: '2024-01-20 10:15',
      total: 149900,
      estado: 'confirmada',
      items: [
        { producto: { nombre: 'Galletas de Chocolate' } },
        { producto: { nombre: 'Barra de Cereal' } },
        { producto: { nombre: 'Sensor Inteligente' } }
      ]
    },
    {
      id: 1003,
      fecha_creacion: '2024-01-25 16:45',
      total: 59900,
      estado: 'en_proceso',
      items: [
        { producto: { nombre: 'Curso de Matemáticas' } }
      ]
    },
    {
      id: 1004,
      fecha_creacion: '2024-01-28 09:30',
      total: 89900,
      estado: 'cancelada',
      items: [
        { producto: { nombre: 'App de Gestión' } }
      ]
    }
  ];

  // ✅ Verificar login
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Calcular estadísticas
  const totalOrdenes = orders.length;
  const ordenesCompletadas = orders.filter(o => o.estado === 'entregada').length;
  const ordenesPendientes = orders.filter(o => o.estado !== 'entregada' && o.estado !== 'cancelada').length;
  const totalGastado = orders
    .filter(o => o.estado !== 'cancelada')
    .reduce((sum, o) => sum + o.total, 0);

  // Obtener estado en español
  const getEstadoDisplay = (estado) => {
    const estados = {
      'entregada': 'Entregada',
      'confirmada': 'Confirmada',
      'en_proceso': 'En Proceso',
      'enviada': 'Enviada',
      'cancelada': 'Cancelada',
      'pendiente': 'Pendiente'
    };
    return estados[estado] || estado;
  };

  // Obtener clase de badge según estado
  const getBadgeClass = (estado) => {
    const clases = {
      'entregada': 'badge-success',
      'confirmada': 'badge-primary',
      'en_proceso': 'badge-info',
      'enviada': 'badge-warning',
      'cancelada': 'badge-danger',
      'pendiente': 'badge-secondary'
    };
    return clases[estado] || 'badge-secondary';
  };

  // Formatear fecha
  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      day: '2-digit', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  const formatTime = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-CO', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className="my-orders-page">
      <div className="container">
        
        {/* Header */}
        <div className="orders-header">
          <h1 className="orders-title">📦 Mis Órdenes</h1>
          <Link to="/ventures" className="btn-shop">
            🛍️ Seguir Comprando
          </Link>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card stat-primary">
            <div className="stat-body">
              <h4>{totalOrdenes}</h4>
              <p>Total Órdenes</p>
            </div>
          </div>
          <div className="stat-card stat-success">
            <div className="stat-body">
              <h4>{ordenesCompletadas}</h4>
              <p>Completadas</p>
            </div>
          </div>
          <div className="stat-card stat-warning">
            <div className="stat-body">
              <h4>{ordenesPendientes}</h4>
              <p>Pendientes</p>
            </div>
          </div>
          <div className="stat-card stat-info">
            <div className="stat-body">
              <h4>${totalGastado.toLocaleString()}</h4>
              <p>Total Gastado</p>
            </div>
          </div>
        </div>

        {orders.length > 0 ? (
          <>
            {/* Tabla - Desktop */}
            <div className="table-card">
              <div className="table-header">
                <h5 className="table-title">Historial de Compras</h5>
              </div>
              <div className="table-body">
                <div className="table-responsive">
                  <table className="orders-table">
                    <thead>
                      <tr>
                        <th>Orden #</th>
                        <th>Fecha</th>
                        <th>Total</th>
                        <th>Estado</th>
                        <th>Productos</th>
                        <th>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.map(order => (
                        <tr key={order.id}>
                          <td><strong>#{order.id}</strong></td>
                          <td>
                            {formatDate(order.fecha_creacion)}
                            <br />
                            <small className="text-muted">{formatTime(order.fecha_creacion)}</small>
                          </td>
                          <td>
                            <strong className="text-success">${order.total.toLocaleString()}</strong>
                          </td>
                          <td>
                            <span className={`badge ${getBadgeClass(order.estado)}`}>
                              {getEstadoDisplay(order.estado)}
                            </span>
                          </td>
                          <td>
                            <small>
                              {order.items.slice(0, 2).map((item, index) => (
                                <span key={index}>
                                  {item.producto.nombre}
                                  {index < order.items.slice(0, 2).length - 1 && ', '}
                                </span>
                              ))}
                              {order.items.length > 2 && (
                                <>
                                  <br />+{order.items.length - 2} más
                                </>
                              )}
                            </small>
                          </td>
                          <td>
                            <Link to={`/order/${order.id}`} className="btn-detail">
                              👁️ Ver Detalles
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Tarjetas - Mobile */}
            <div className="mobile-cards">
              {orders.map(order => (
                <div key={order.id} className="mobile-order-card">
                  <div className="mobile-card-header">
                    <strong>Orden #{order.id}</strong>
                    <span className={`badge ${getBadgeClass(order.estado)}`}>
                      {getEstadoDisplay(order.estado)}
                    </span>
                  </div>
                  <div className="mobile-card-body">
                    <div className="mobile-card-row">
                      <div className="mobile-card-col">
                        <small className="text-muted">Fecha</small>
                        <br />
                        <strong>{formatDate(order.fecha_creacion)}</strong>
                      </div>
                      <div className="mobile-card-col">
                        <small className="text-muted">Total</small>
                        <br />
                        <strong className="text-success">${order.total.toLocaleString()}</strong>
                      </div>
                    </div>
                    <div className="mobile-card-products">
                      <small className="text-muted">Productos:</small>
                      <br />
                      <small>
                        {order.items.slice(0, 3).map((item, index) => (
                          <span key={index}>
                            • {item.producto.nombre}
                            <br />
                          </span>
                        ))}
                        {order.items.length > 3 && (
                          <em>+{order.items.length - 3} más</em>
                        )}
                      </small>
                    </div>
                    <Link to={`/order/${order.id}`} className="btn-detail-mobile">
                      Ver Detalles Completos
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          /* Estado vacío */
          <div className="empty-state">
            <div className="empty-icon">🛒</div>
            <h3 className="empty-title">Aún no tienes órdenes</h3>
            <p className="empty-text">
              ¡Descubre productos increíbles y realiza tu primera compra!
            </p>
            <div className="empty-actions">
              <Link to="/ventures" className="btn-explore-shop">
                🛍️ Explorar Emprendimientos
              </Link>
              <Link to="/courses" className="btn-explore-courses">
                📚 Ver Cursos
              </Link>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default MyOrders;