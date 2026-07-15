/**
 * Dashboard.jsx - Panel de Control del Usuario
 * CON API REAL - Diseño homogéneo con la app
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyVentures, getMyOrders, getMyLikes, getMyEvents } from '../../services/api';
import './Dashboard.css';

const Dashboard = () => {
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO (Y NINGÚN RETURN PREVIO)
    // ============================================================
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        ventures: 0,
        orders: 0,
        likes: 0,
        events: 0,
        totalSales: 0,
        pendingOrders: 0
    });
    const [recentActivity, setRecentActivity] = useState([]);

    // Obtenemos los datos del usuario de forma segura
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar datos del dashboard y verificar sesión de forma segura
    useEffect(() => {
        // Redireccionar si no hay usuario logueado
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadDashboardData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando dashboard del usuario ${user.id}`);
                
                // Cargar datos en paralelo
                const [venturesData, ordersData, likesData, eventsData] = await Promise.all([
                    getMyVentures(user.id),
                    getMyOrders(user.id),
                    getMyLikes(user.id),
                    getMyEvents(user.id)
                ]);
                
                // Calcular estadísticas
                const totalVentures = venturesData.length || 0;
                const totalOrders = ordersData.length || 0;
                const totalLikes = likesData.length || 0;
                const totalEvents = eventsData.length || 0;
                
                // Calcular ventas totales (de órdenes completadas)
                const completedOrders = ordersData.filter(o => o.estado === 'entregada');
                const totalSales = completedOrders.reduce((sum, o) => sum + parseFloat(o.total || 0), 0);
                
                // Órdenes pendientes
                const pendingOrders = ordersData.filter(o => o.estado !== 'entregada' && o.estado !== 'cancelada').length;
                
                // Guardamos los nuevos stats en una constante para evitar leer el estado 'stats' directamente
                const newStats = {
                    ventures: totalVentures,
                    orders: totalOrders,
                    likes: totalLikes,
                    events: totalEvents,
                    totalSales: totalSales,
                    pendingOrders: pendingOrders
                };
                
                setStats(newStats);
                
                // Crear actividad reciente
                const activities = [];
                
                // Últimos emprendimientos
                if (venturesData.length > 0) {
                    const lastVenture = venturesData[0];
                    activities.push({
                        id: 'venture_' + Date.now(),
                        type: 'venture',
                        icon: '🚀',
                        title: 'Nuevo emprendimiento',
                        description: `Publicaste "${lastVenture.nombre}"`,
                        date: lastVenture.created_at || new Date().toISOString()
                    });
                }
                
                // Últimas órdenes
                if (ordersData.length > 0) {
                    const lastOrder = ordersData[0];
                    activities.push({
                        id: 'order_' + Date.now(),
                        type: 'order',
                        icon: '📦',
                        title: 'Nueva orden',
                        description: `Orden #${lastOrder.id} - $${parseFloat(lastOrder.total).toFixed(2)}`,
                        date: lastOrder.created_at || new Date().toISOString()
                    });
                }
                
                // Últimos likes
                if (likesData.length > 0) {
                    const lastLike = likesData[0];
                    activities.push({
                        id: 'like_' + Date.now(),
                        type: 'like',
                        icon: '❤️',
                        title: 'Nuevo me gusta',
                        description: `Le diste me gusta a "${lastLike.emprendimiento?.nombre || 'un emprendimiento'}"`,
                        date: lastLike.created_at || new Date().toISOString()
                    });
                }
                
                // Últimos eventos
                if (eventsData.length > 0) {
                    const lastEvent = eventsData[0];
                    activities.push({
                        id: 'event_' + Date.now(),
                        type: 'event',
                        icon: '📅',
                        title: 'Evento registrado',
                        description: `Te registraste en "${lastEvent.evento?.nombre || 'un evento'}"`,
                        date: lastEvent.created_at || new Date().toISOString()
                    });
                }
                
                // Ordenar por fecha (más reciente primero)
                activities.sort((a, b) => new Date(b.date) - new Date(a.date));
                setRecentActivity(activities.slice(0, 5));
                
                console.log('✅ Dashboard cargado con éxito:', { stats: newStats, activities });
                
            } catch (err) {
                console.error('❌ Error cargando dashboard:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadDashboardData();
    }, [user.id, navigate]); // Dependencias limpias sin loops infinitos

    // Formatear fecha
    const formatDate = (fecha) => {
        if (!fecha) return 'Reciente';
        const date = new Date(fecha);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return 'Hace ' + diff + 's';
        if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
        if (diff < 86400) return 'Hace ' + Math.floor(diff / 3600) + 'h';
        if (diff < 2592000) return 'Hace ' + Math.floor(diff / 86400) + 'd';
        return date.toLocaleDateString('es-CO');
    };

    // Evita parpadeos de HTML roto si no hay usuario antes de la redirección
    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="dashboard-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando tu dashboard...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-page">
            <div className="container">
                
                {/* Header */}
                <div className="dashboard-header">
                    <div className="dashboard-header-left">
                        <Link to="/" className="btn-back-home-dashboard">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="dashboard-title">📊 Dashboard</h1>
                    </div>
                    <span className="dashboard-welcome">
                        👋 ¡Bienvenido, {user.full_name || user.username}!
                    </span>
                </div>

                {/* Stats Cards */}
                <div className="stats-grid">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-info">
                            <h3>{stats.ventures}</h3>
                            <p>Emprendimientos</p>
                        </div>
                    </div>
                    
                    <div className="stat-card stat-success">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{stats.orders}</h3>
                            <p>Órdenes</p>
                        </div>
                    </div>
                    
                    <div className="stat-card stat-danger">
                        <div className="stat-icon">❤️</div>
                        <div className="stat-info">
                            <h3>{stats.likes}</h3>
                            <p>Me gusta</p>
                        </div>
                    </div>
                    
                    <div className="stat-card stat-info">
                        <div className="stat-icon">📅</div>
                        <div className="stat-info">
                            <h3>{stats.events}</h3>
                            <p>Eventos</p>
                        </div>
                    </div>
                </div>

                {/* Métricas adicionales */}
                <div className="metrics-row">
                    <div className="metric-card">
                        <div className="metric-icon">💰</div>
                        <div className="metric-info">
                            <h4>${stats.totalSales.toFixed(2)}</h4>
                            <p>Ventas totales</p>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">⏳</div>
                        <div className="metric-info">
                            <h4>{stats.pendingOrders}</h4>
                            <p>Órdenes pendientes</p>
                        </div>
                    </div>
                    <div className="metric-card">
                        <div className="metric-icon">📊</div>
                        <div className="metric-info">
                            <h4>{stats.ventures + stats.orders}</h4>
                            <p>Total actividad</p>
                        </div>
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="quick-actions">
                    <h3 className="section-title">⚡ Acciones Rápidas</h3>
                    <div className="actions-grid">
                        <Link to="/publish" className="action-card">
                            <div className="action-icon">➕</div>
                            <h4>Publicar</h4>
                            <p>Nuevo emprendimiento</p>
                        </Link>
                        <Link to="/my-ventures" className="action-card">
                            <div className="action-icon">📋</div>
                            <h4>Mis Emprendimientos</h4>
                            <p>Gestionar mis proyectos</p>
                        </Link>
                        <Link to="/my-orders" className="action-card">
                            <div className="action-icon">📦</div>
                            <h4>Mis Órdenes</h4>
                            <p>Ver historial de compras</p>
                        </Link>
                        <Link to="/chat" className="action-card">
                            <div className="action-icon">💬</div>
                            <h4>Chat</h4>
                            <p>Conectar con otros</p>
                        </Link>
                    </div>
                </div>

                {/* Actividad Reciente */}
                <div className="recent-activity">
                    <h3 className="section-title">🕐 Actividad Reciente</h3>
                    <div className="activity-list">
                        {recentActivity.length > 0 ? (
                            recentActivity.map(activity => (
                                <div key={activity.id} className="activity-item">
                                    <div className="activity-icon">{activity.icon}</div>
                                    <div className="activity-info">
                                        <h4>{activity.title}</h4>
                                        <p>{activity.description}</p>
                                        <span className="activity-date">{formatDate(activity.date)}</span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-activity">
                                <p>No hay actividad reciente</p>
                                <small>Comienza a interactuar para ver tu actividad aquí</small>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Dashboard;