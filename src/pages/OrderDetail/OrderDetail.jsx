/**
 * OrderDetail.jsx - Detalle de Orden
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderById } from '../../services/api';
import './OrderDetail.css';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar datos de la orden (redirige dentro del efecto si no hay sesión)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadOrder = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando orden ID: ${id}`);
                const data = await getOrderById(id);
                setOrder(data);
                console.log('📦 Orden cargada:', data);
                
            } catch (err) {
                console.error('❌ Error cargando orden:', err);
                setError(err.message || 'Orden no encontrada');
            } finally {
                setLoading(false);
            }
        };
        
        loadOrder();
    }, [id, user.id, navigate]);

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

    // Formatear fecha
    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', { 
            day: '2-digit', 
            month: 'long', 
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
    // ✅ RENDERIZADO (después de todos los Hooks)
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="order-detail-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando orden...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
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

    return (
        <div className="order-detail-page">
            <div className="container">
                
                <Link to="/my-orders" className="btn-back-orders">
                    ← Volver a Mis Órdenes
                </Link>

                <div className="order-detail-card">
                    
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
                                <p><strong>Fecha:</strong> {formatDate(order.created_at)} {formatTime(order.created_at)}</p>
                                <p><strong>Total:</strong> ${parseFloat(order.total).toFixed(2)}</p>
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
                                <p><strong>Ciudad:</strong> {order.ciudad}</p>
                                <p><strong>Código Postal:</strong> {order.codigo_postal}</p>
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
                                    {order.items && order.items.map((item, index) => (
                                        <tr key={index}>
                                            <td>
                                                <strong>{item.producto?.nombre || 'Producto'}</strong>
                                                <br />
                                                <small className="text-muted">
                                                    {item.producto?.emprendimiento?.nombre || 'Emprendimiento'}
                                                </small>
                                            </td>
                                            <td>${parseFloat(item.precio).toFixed(2)}</td>
                                            <td>{item.cantidad}</td>
                                            <td>${parseFloat(item.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colSpan="3" className="text-end"><strong>Total:</strong></td>
                                        <td><strong>${parseFloat(order.total).toFixed(2)}</strong></td>
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