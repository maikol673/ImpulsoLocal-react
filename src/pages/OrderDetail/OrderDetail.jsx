/**
 * OrderDetail.jsx - Detalle de Orden
 * Muestra la información completa de una orden específica
 * SIN API - SIN useEffect - Datos directos
 */

import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import './OrderDetail.css';

const OrderDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  //  Verificar login
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  //  Datos de prueba - Órdenes disponibles
  const ordersData = {
    '1001': {
      id: 1001,
      fecha_creacion: '2024-01-15 14:30:00',
      total: 299900,
      estado: 'entregada',
      direccion_envio: 'Calle 123 #45-67, Bogotá, Colombia',
      telefono_contacto: '+57 300 123 4567',
      notas: 'Entregar en la portería',
      items: [
        { 
          producto: { 
            nombre: 'Kit Solar Portátil',
            emprendimiento: { nombre: 'GreenTech' }
          },
          precio: 299900,
          cantidad: 1,
          subtotal: 299900
        }
      ]
    },
    '1002': {
      id: 1002,
      fecha_creacion: '2024-01-20 10:15:00',
      total: 149900,
      estado: 'confirmada',
      direccion_envio: 'Avenida Siempre Viva 742, Medellín, Colombia',
      telefono_contacto: '+57 300 987 6543',
      notas: '',
      items: [
        { 
          producto: { 
            nombre: 'Galletas de Chocolate',
            emprendimiento: { nombre: 'Yupi' }
          },
          precio: 2500,
          cantidad: 2,
          subtotal: 5000
        },
        { 
          producto: { 
            nombre: 'Barra de Cereal',
            emprendimiento: { nombre: 'Yupi' }
          },
          precio: 1800,
          cantidad: 3,
          subtotal: 5400
        },
        { 
          producto: { 
            nombre: 'Sensor Inteligente',
            emprendimiento: { nombre: 'GreenTech' }
          },
          precio: 149900,
          cantidad: 1,
          subtotal: 149900
        }
      ]
    },
    '1003': {
      id: 1003,
      fecha_creacion: '2024-01-25 16:45:00',
      total: 59900,
      estado: 'en_proceso',
      direccion_envio: 'Carrera 50 #20-10, Cali, Colombia',
      telefono_contacto: '+57 300 456 7890',
      notas: 'Llamar antes de entregar',
      items: [
        { 
          producto: { 
            nombre: 'Curso de Matemáticas',
            emprendimiento: { nombre: 'EduSmart' }
          },
          precio: 59900,
          cantidad: 1,
          subtotal: 59900
        }
      ]
    },
    '1004': {
      id: 1004,
      fecha_creacion: '2024-01-28 09:30:00',
      total: 89900,
      estado: 'cancelada',
      direccion_envio: 'Calle 80 #15-20, Barranquilla, Colombia',
      telefono_contacto: '+57 300 111 2222',
      notas: 'Cancelado por el usuario',
      items: [
        { 
          producto: { 
            nombre: 'App de Gestión',
            emprendimiento: { nombre: 'GreenTech' }
          },
          precio: 89900,
          cantidad: 1,
          subtotal: 89900
        }
      ]
    }
  };

  // Buscar la orden por ID
  const order = ordersData[id];

  // Si no existe la orden
  if (!order) {
    return (
      <div className="order-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>⚠️ Orden no encontrada</h2>
            <p>La orden #{id} no existe o no está disponible.</p>
            <Link to="/my-orders" className="btn-back-orders">
              ← Volver a Mis Órdenes
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Obtener estado en español y clase
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
    <div className="order-detail-page">
      <div className="container">
        <div className="order-detail-card">
          
          {/* Header */}
          <div className="order-detail-header">
            <h5 className="order-detail-title">
              ✅ Orden #{order.id} - {getEstadoDisplay(order.estado)}
            </h5>
          </div>
          
          <div className="order-detail-body">
            
            {/* Información de la Orden */}
            <div className="info-row">
              <div className="info-col">
                <h6>Información de la Orden</h6>
                <p><strong>Fecha:</strong> {formatDate(order.fecha_creacion)} {formatTime(order.fecha_creacion)}</p>
                <p><strong>Total:</strong> ${order.total.toLocaleString()}</p>
                <p>
                  <strong>Estado:</strong> 
                  <span className={`badge ${getBadgeClass(order.estado)}`}>
                    {getEstadoDisplay(order.estado)}
                  </span>
                </p>
              </div>
              <div className="info-col">
                <h6>Información de Envío</h6>
                <p><strong>Dirección:</strong> {order.direccion_envio}</p>
                <p><strong>Teléfono:</strong> {order.telefono_contacto}</p>
                {order.notas && (
                  <p><strong>Notas:</strong> {order.notas}</p>
                )}
              </div>
            </div>

            {/* Productos de la Orden */}
            <h6 className="products-title">Productos</h6>
            <div className="table-responsive">
              <table className="products-table">
                <thead>
                  <tr>
                    <th>Producto</th>
                    <th>Precio</th>
                    <th>Cantidad</th>
                    <th>Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((item, index) => (
                    <tr key={index}>
                      <td>
                        <strong>{item.producto.nombre}</strong>
                        <br />
                        <small className="text-muted">
                          {item.producto.emprendimiento.nombre}
                        </small>
                      </td>
                      <td>${item.precio.toLocaleString()}</td>
                      <td>{item.cantidad}</td>
                      <td>${item.subtotal.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                    <td><strong>${order.total.toLocaleString()}</strong></td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Botones de acción */}
            <div className="order-actions">
              <Link to="/my-orders" className="btn-orders">
                📋 Ver Todas mis Órdenes
              </Link>
              <Link to="/ventures" className="btn-shop-continue">
                🛍️ Seguir Comprando
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;