/**
 * Profile.jsx - Perfil de Usuario
 * CON PREFERENCIAS - VERSIÓN ESTABLE CON LIMPIEZA
 */

import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyVentures, BASE_URL } from '../../services/api';
import './Profile.css';

const Profile = () => {
    const navigate = useNavigate();
    const isMounted = useRef(true); // ✅ Para saber si el componente está montado
    
    // ✅ OBTENER USUARIO DE LOCALSTORAGE
    const stored = JSON.parse(localStorage.getItem('user') || '{}');
    const user = stored.id ? stored : null;
    const userId = user?.id;

    // ✅ ESTADOS
    const [ventures, setVentures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // ✅ LIMPIAR FLAG AL DESMONTAR
    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    // ✅ CARGAR DATOS
    useEffect(() => {
        if (!userId) {
            navigate('/login');
            return;
        }
        
        const loadProfileData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                const venturesData = await getMyVentures(userId);
                
                // ✅ SOLO ACTUALIZAR SI EL COMPONENTE ESTÁ MONTADO
                if (isMounted.current) {
                    setVentures(venturesData);
                    console.log('📊 Perfil cargado:', { userId, ventures: venturesData });
                }
                
            } catch (err) {
                console.error('❌ Error cargando perfil:', err);
                if (isMounted.current) {
                    setError(err.message);
                }
            } finally {
                if (isMounted.current) {
                    setLoading(false);
                }
            }
        };
        
        loadProfileData();
    }, [userId, navigate]);

    // ✅ FUNCIÓN PARA CERRAR SESIÓN
    const handleLogout = () => {
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('user');
        navigate('/login');
    };

    // ✅ FUNCIÓN PARA OBTENER URL DE IMAGEN
    const getImageUrl = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith('http')) return imagen;
        return `${BASE_URL}${imagen}`;
    };

    // ✅ VERIFICAR USUARIO PRIMERO
    if (!user) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando perfil...</p>
            </div>
        );
    }

    // ✅ LOADING
    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando tus emprendimientos...</p>
            </div>
        );
    }

    // ✅ ERROR
    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Error: {error}</div>
                <button className="btn btn-secondary" onClick={handleLogout}>Cerrar Sesión</button>
            </div>
        );
    }

    // ✅ MÉTRICAS
    const totalVentures = ventures.length;
    const totalLikes = ventures.reduce((acc, v) => acc + (v.num_resenas || 0), 0);
    const totalVentas = 0;

    return (
        <div className="profile-page">
            <div className="container">
                
                {/* === HEADER PERFIL === */}
                <div className="profile-header card shadow-sm">
                    <div className="card-body">
                        <div className="row align-items-center">
                            
                            {/* FOTO */}
                            <div className="col-md-3 text-center">
                                {user.avatar ? (
                                    <img 
                                        src={getImageUrl(user.avatar)}
                                        alt={user.full_name || user.username}
                                        className="profile-avatar-image"
                                        style={{ 
                                            width: '120px', 
                                            height: '120px', 
                                            objectFit: 'cover',
                                            borderRadius: '50%'
                                        }}
                                        onError={(e) => {
                                            e.target.style.display = 'none';
                                            e.target.parentElement.innerHTML = `
                                                <div class="profile-avatar-placeholder">
                                                    <span>${user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}</span>
                                                </div>
                                            `;
                                        }}
                                    />
                                ) : (
                                    <div className="profile-avatar-placeholder">
                                        <span>{user.full_name?.charAt(0) || user.username?.charAt(0) || 'U'}</span>
                                    </div>
                                )}
                            </div>

                            {/* INFO BÁSICA */}
                            <div className="col-md-6">
                                <h3 className="profile-name">{user.full_name || user.username}</h3>
                                <p className="profile-username">@{user.username}</p>
                                
                                {user.bio ? (
                                    <p className="profile-bio">{user.bio}</p>
                                ) : (
                                    <p className="profile-bio text-muted">Sin biografía</p>
                                )}
                                
                                <div className="profile-contact">
                                    {user.telefono && <span>📞 {user.telefono}</span>}
                                    {user.ciudad && <span>📍 {user.ciudad}</span>}
                                    <span>✉️ {user.email}</span>
                                </div>
                            </div>

                            {/* BOTONES */}
                            <div className="col-md-3">
                                <div className="profile-actions">
                                    <Link to="/edit-profile" className="btn btn-primary btn-sm w-100">
                                        ✏️ Editar Perfil
                                    </Link>
                                    <Link to="/change-password" className="btn btn-outline-primary btn-sm w-100">
                                        🔒 Contraseña
                                    </Link>
                                    <Link to="/publish" className="btn btn-success btn-sm w-100">
                                        ➕ Nuevo Emprendimiento
                                    </Link>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div className="row">
                    
                    {/* === COLUMNA IZQUIERDA === */}
                    <div className="col-lg-4">
                        
                        {/* MÉTRICAS */}
                        <div className="card shadow-sm metrics-card">
                            <div className="card-header bg-primary text-white">
                                <h6 className="mb-0">📊 Métricas</h6>
                            </div>
                            <div className="card-body text-center">
                                <div className="row">
                                    <div className="col-4">
                                        <h4 className="text-primary mb-1">{totalVentures}</h4>
                                        <small className="text-muted">Emprendimientos</small>
                                    </div>
                                    <div className="col-4">
                                        <h4 className="text-success mb-1">{totalLikes}</h4>
                                        <small className="text-muted">Likes</small>
                                    </div>
                                    <div className="col-4">
                                        <h4 className="text-info mb-1">{totalVentas}</h4>
                                        <small className="text-muted">Ventas</small>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* INFORMACIÓN ADICIONAL */}
                        <div className="card shadow-sm info-card">
                            <div className="card-header bg-warning">
                                <h6 className="mb-0">🏪 Información Adicional</h6>
                            </div>
                            <div className="card-body">
                                {user.direccion && (
                                    <div className="info-item">
                                        <strong>🏠 Dirección:</strong>
                                        <p className="mb-0 small">{user.direccion}</p>
                                    </div>
                                )}
                                {user.sitio_web && (
                                    <div className="info-item mt-2">
                                        <strong>🌐 Sitio web:</strong>
                                        <p className="mb-0 small">
                                            <a href={`https://${user.sitio_web}`} target="_blank" rel="noopener noreferrer">
                                                {user.sitio_web}
                                            </a>
                                        </p>
                                    </div>
                                )}
                                {user.fecha_nacimiento && (
                                    <div className="info-item mt-2">
                                        <strong>🎂 Fecha de nacimiento:</strong>
                                        <p className="mb-0 small">{user.fecha_nacimiento}</p>
                                    </div>
                                )}
                                {!user.direccion && !user.sitio_web && !user.fecha_nacimiento && (
                                    <div className="text-center text-muted py-2">
                                        No hay información adicional
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* PREFERENCIAS */}
                        <div className="card shadow-sm preferences-card">
                            <div className="card-header bg-success text-white">
                                <h6 className="mb-0">⚙️ Preferencias</h6>
                            </div>
                            <div className="card-body small">
                                <div className="preference-item">
                                    Notificaciones:
                                    <span className={`badge ${user.recibe_notificaciones ? 'bg-success' : 'bg-secondary'} float-end`}>
                                        {user.recibe_notificaciones ? 'Activas' : 'Off'}
                                    </span>
                                </div>
                                <div className="preference-item mt-2">
                                    Notificaciones Email:
                                    <span className={`badge ${user.notificaciones_email ? 'bg-success' : 'bg-secondary'} float-end`}>
                                        {user.notificaciones_email ? 'Activas' : 'Off'}
                                    </span>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* === COLUMNA DERECHA === */}
                    <div className="col-lg-8">

                        {/* HEADER EMPRENDIMIENTOS */}
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <div>
                                <h4 className="mb-0">🏪 Mis Emprendimientos</h4>
                                <small className="text-muted">
                                    {totalVentures} emprendimiento{totalVentures !== 1 ? 's' : ''}
                                </small>
                            </div>
                            <Link to="/publish" className="btn btn-primary btn-sm">
                                + Agregar
                            </Link>
                        </div>

                        {/* GRID */}
                        {totalVentures > 0 ? (
                            <div className="row">
                                {ventures.map(venture => (
                                    <div key={venture.id} className="col-md-6 mb-4">
                                        <div className="card h-100 shadow-sm venture-card">
                                            {venture.imagen ? (
                                                <img 
                                                    src={getImageUrl(venture.imagen)} 
                                                    className="card-img-top" 
                                                    alt={venture.nombre}
                                                    style={{ height: '180px', objectFit: 'cover' }}
                                                    onError={(e) => {
                                                        e.target.style.display = 'none';
                                                        const parent = e.target.parentElement;
                                                        if (parent) {
                                                            parent.innerHTML = `
                                                                <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height:180px;">
                                                                    <span class="text-muted">Sin imagen</span>
                                                                </div>
                                                            `;
                                                        }
                                                    }}
                                                />
                                            ) : (
                                                <div className="card-img-top bg-light d-flex align-items-center justify-content-center" 
                                                     style={{ height: '180px' }}>
                                                    <span className="text-muted">Sin imagen</span>
                                                </div>
                                            )}
                                            <div className="card-body">
                                                <h6 className="fw-bold">{venture.nombre}</h6>
                                                <p className="small text-muted">{venture.descripcion}</p>
                                                <small className="text-muted">{venture.ubicacion || 'Sin ubicación'}</small>
                                            </div>
                                            <div className="card-footer bg-white">
                                                <Link to={`/venture/${venture.id}`} className="btn btn-outline-primary btn-sm w-100">
                                                    Ver Detalles
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="card shadow-sm text-center py-5">
                                <h5 className="text-muted">Aún no tienes negocios publicados</h5>
                                <Link to="/publish" className="btn btn-primary mt-3">
                                    Publicar mi primero 🚀
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;