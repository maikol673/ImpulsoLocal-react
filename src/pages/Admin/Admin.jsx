/**
 * Admin.jsx - Panel de Administración
 * CON API REAL - DATOS REALES
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getVentures, getAllOrders, getAllReviews, getUsers } from '../../services/api';
import './Admin.css';

const Admin = () => {
    const navigate = useNavigate();

    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIEMPRE EN EL MISMO ORDEN
    // ============================================================
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [stats, setStats] = useState({
        ventures: 0,
        users: 0,
        orders: 0,
        reviews: 0
    });
    const [recentVentures, setRecentVentures] = useState([]);

    // Recuperamos el usuario de forma segura (no hace return, así que es seguro)
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar datos del admin y validar sesión (todo dentro del useEffect)
    useEffect(() => {
        // ✅ Si no hay usuario logueado, redirigir y no seguir cargando
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadAdminData = async () => {
            try {
                setLoading(true);
                setError(null);

                console.log('📡 Cargando datos del Admin...');

                // ✅ Cargar datos en paralelo
                const [venturesData, ordersData, reviewsData, usersData] = await Promise.all([
                    getVentures(),                          // Todos los emprendimientos
                    getAllOrders(),                         // Todas las órdenes de la plataforma
                    getAllReviews(),                        // Todas las reseñas de la plataforma
                    getUsers()                               // Todos los usuarios
                ]);

                console.log('📊 Datos cargados:', {
                    ventures: venturesData.length,
                    orders: ordersData.length,
                    reviews: reviewsData.length,
                    users: usersData.length
                });

                // ✅ Calcular estadísticas REALES
                setStats({
                    ventures: venturesData.length || 0,
                    users: usersData.length || 0,
                    orders: ordersData.length || 0,
                    reviews: reviewsData.length || 0
                });

                // ✅ Últimos emprendimientos (los 3 más recientes)
                const sortedVentures = [...venturesData]
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 3);
                setRecentVentures(sortedVentures);

                console.log('✅ Admin cargado con datos reales');

            } catch (err) {
                console.error('❌ Error cargando admin:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        loadAdminData();
    }, [user.id, navigate]); // Dependencias estables

    // Formatear fecha
    const formatDate = (fecha) => {
        if (!fecha) return 'Reciente';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'short',
            year: 'numeric'
        });
    };

    // ============================================================
    // ✅ RETURNS CONDICIONALES SOLO DESPUÉS DE TODOS LOS HOOKS
    // ============================================================

    // Evitar parpadeos visuales mientras se redirige
    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="admin-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando panel de administración...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-page">
            <div className="container">

                {/* Header */}
                <div className="admin-header">
                    <div className="admin-header-left">
                        <Link to="/" className="btn-back-home-admin">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="admin-title">👑 Panel de Administración</h1>
                    </div>
                    <span className="admin-badge">🔐 Admin</span>
                </div>

                {/* ✅ Stats Cards con datos REALES */}
                <div className="stats-grid">
                    <div className="stat-card stat-primary">
                        <div className="stat-icon">🚀</div>
                        <div className="stat-info">
                            <h3>{stats.ventures}</h3>
                            <p>Emprendimientos</p>
                        </div>
                    </div>

                    <div className="stat-card stat-success">
                        <div className="stat-icon">👥</div>
                        <div className="stat-info">
                            <h3>{stats.users}</h3>
                            <p>Usuarios</p>
                        </div>
                    </div>

                    <div className="stat-card stat-info">
                        <div className="stat-icon">📦</div>
                        <div className="stat-info">
                            <h3>{stats.orders}</h3>
                            <p>Órdenes</p>
                        </div>
                    </div>

                    <div className="stat-card stat-warning">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-info">
                            <h3>{stats.reviews}</h3>
                            <p>Reseñas</p>
                        </div>
                    </div>
                </div>

                {/* Últimos Emprendimientos */}
                <div className="recent-ventures">
                    <h3 className="section-title">📋 Últimos Emprendimientos</h3>
                    <div className="ventures-list">
                        {recentVentures.length > 0 ? (
                            recentVentures.map(venture => (
                                <div key={venture.id} className="venture-item">
                                    <div className="venture-info">
                                        <h4>{venture.nombre}</h4>
                                        <p>{venture.descripcion?.substring(0, 80)}...</p>
                                        <span className="venture-date">
                                            📅 {formatDate(venture.created_at)}
                                        </span>
                                    </div>
                                    <div className="venture-status">
                                        <span className={`status-badge ${venture.estado === 'activo' ? 'active' : 'pending'}`}>
                                            {venture.estado === 'activo' ? '✅ Activo' : '⏳ Pendiente'}
                                        </span>
                                        <Link to={`/venture/${venture.id}`} className="btn-view">
                                            Ver
                                        </Link>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="empty-ventures">
                                <p>No hay emprendimientos registrados</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Acciones Rápidas */}
                <div className="quick-actions">
                    <h3 className="section-title">⚡ Acciones Rápidas</h3>
                    <div className="actions-grid">
                        <Link to="/ventures" className="action-card">
                            <div className="action-icon">📋</div>
                            <h4>Ver Emprendimientos</h4>
                            <p>Gestionar todos los emprendimientos</p>
                        </Link>
                        <Link to="/my-orders" className="action-card">
                            <div className="action-icon">📦</div>
                            <h4>Ver Órdenes</h4>
                            <p>Revisar órdenes</p>
                        </Link>
                        <Link to="/chat" className="action-card">
                            <div className="action-icon">💬</div>
                            <h4>Chat</h4>
                            <p>Gestionar mensajes</p>
                        </Link>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Admin;