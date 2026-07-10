/**
 * MyOrders.jsx - Mis Órdenes
 * CON API REAL - CON CANCELAR ORDEN
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyOrders, cancelOrder } from '../../services/api';
import './MyOrders.css';

const MyOrders = () => {
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar órdenes del usuario
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadOrders = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando órdenes del usuario ${user.id}`);
                const data = await getMyOrders(user.id);
                setOrders(data);
                console.log('📦 Órdenes cargadas:', data);
                
            } catch (err) {
                console.error('❌ Error cargando órdenes:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadOrders();
    }, [user.id, navigate]);

    // ✅ Cancelar orden
    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('¿Estás seguro de que quieres cancelar esta orden?')) {
            return;
        }
        
        setCancelling(true);
        
        try {
            await cancelOrder(orderId);
            
            // Actualizar la lista localmente
            setOrders(orders.map(order => 
                order.id === orderId 
                    ? { ...order, estado: 'cancelada' } 
                    : order
            ));
            
            alert('✅ Orden cancelada exitosamente');
            
        } catch (err) {
            console.error('❌ Error cancelando orden:', err);
            alert(err.message || 'Error al cancelar la orden');
        } finally {
            setCancelling(false);
        }
    };

    // Calcular estadísticas
    const totalOrdenes = orders.length;
    const ordenesCompletadas = orders.filter(o => o.estado === 'entregada').length;
    const ordenesPendientes = orders.filter(o => o.estado !== 'entregada' && o.estado !== 'cancelada').length;
    const totalGastado = orders
        .filter(o => o.estado !== 'cancelada')
        .reduce((sum, o) => sum + parseFloat(o.total || 0), 0);

    // Obtener estado en español
    const getEstadoDisplay = (estado) => {
        const estados = {
            'pendiente': 'Pendiente',
            'confirmada': 'Confirmada',
            'en_proceso': 'En Proceso',
            'enviada': 'Enviada',
            'entregada': 'Entregada',
            'cancelada': 'Cancelada'
        };
        return estados[estado] || estado;
    };

    // Obtener clase de badge según estado
    const getBadgeClass = (estado) => {
        const clases = {
            'pendiente': 'badge-secondary',
            'confirmada': 'badge-primary',
            'en_proceso': 'badge-info',
            'enviada': 'badge-warning',
            'entregada': 'badge-success',
            'cancelada': 'badge-danger'
        };
        return clases[estado] || 'badge-secondary';
    };

    // Verificar si la orden se puede cancelar
    const canCancel = (estado) => {
        return ['pendiente', 'confirmada', 'en_proceso'].includes(estado);
    };

    // Formatear fecha
    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', { 
            day: '2-digit', 
            month: 'short', 
            year: 'numeric' 
        });
    };

    const formatTime = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // ============================================================
    // ✅ RENDERIZADO
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="my-orders-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando tus órdenes...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="my-orders-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="my-orders-page">
            <div className="container">
                
                {/* Header */}
                <div className="orders-header">
                    <div className="orders-header-left">
                        <Link to="/" className="btn-back-home-orders">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="orders-title">📦 Mis Órdenes</h1>
                    </div>
                    <Link to="/ventures" className="btn-shop">
                        🛍️ Seguir Comprando
                    </Link>
                </div>

                {orders.length > 0 ? (
                    <>
                        {/* Estadísticas rápidas */}
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
                                    <h4>${totalGastado.toFixed(2)}</h4>
                                    <p>Total Gastado</p>
                                </div>
                            </div>
                        </div>

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
                                                        {formatDate(order.created_at)}
                                                        <br />
                                                        <small className="text-muted">{formatTime(order.created_at)}</small>
                                                    </td>
                                                    <td>
                                                        <strong className="text-success">${parseFloat(order.total).toFixed(2)}</strong>
                                                    </td>
                                                    <td>
                                                        <span className={`badge ${getBadgeClass(order.estado)}`}>
                                                            {getEstadoDisplay(order.estado)}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        <small>
                                                            {order.items && order.items.slice(0, 2).map((item, index) => (
                                                                <span key={index}>
                                                                    {item.producto?.nombre || 'Producto'}
                                                                    {index < order.items.slice(0, 2).length - 1 && ', '}
                                                                </span>
                                                            ))}
                                                            {order.items && order.items.length > 2 && (
                                                                <>
                                                                    <br />+{order.items.length - 2} más
                                                                </>
                                                            )}
                                                        </small>
                                                    </td>
                                                    <td>
                                                        <div className="action-buttons">
                                                            <Link to={`/order/${order.id}`} className="btn-detail">
                                                                👁️ Ver Detalles
                                                            </Link>
                                                            {canCancel(order.estado) && (
                                                                <button 
                                                                    className="btn-cancel-order"
                                                                    onClick={() => handleCancelOrder(order.id)}
                                                                    disabled={cancelling}
                                                                >
                                                                    ❌ Cancelar
                                                                </button>
                                                            )}
                                                        </div>
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
                                                <strong>{formatDate(order.created_at)}</strong>
                                            </div>
                                            <div className="mobile-card-col">
                                                <small className="text-muted">Total</small>
                                                <br />
                                                <strong className="text-success">${parseFloat(order.total).toFixed(2)}</strong>
                                            </div>
                                        </div>
                                        <div className="mobile-card-products">
                                            <small className="text-muted">Productos:</small>
                                            <br />
                                            <small>
                                                {order.items && order.items.slice(0, 3).map((item, index) => (
                                                    <span key={index}>
                                                        • {item.producto?.nombre || 'Producto'}
                                                        <br />
                                                    </span>
                                                ))}
                                                {order.items && order.items.length > 3 && (
                                                    <em>+{order.items.length - 3} más</em>
                                                )}
                                            </small>
                                        </div>
                                        <div className="mobile-card-actions">
                                            <Link to={`/order/${order.id}`} className="btn-detail-mobile">
                                                Ver Detalles Completos
                                            </Link>
                                            {canCancel(order.estado) && (
                                                <button 
                                                    className="btn-cancel-order-mobile"
                                                    onClick={() => handleCancelOrder(order.id)}
                                                    disabled={cancelling}
                                                >
                                                    ❌ Cancelar Orden
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
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