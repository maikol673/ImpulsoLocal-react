/**
 * MyVentures.jsx - Mis Emprendimientos
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyVentures, deleteVenture } from '../../services/api';
import './MyVentures.css';

const MyVentures = () => {
    const navigate = useNavigate();
    
    const [ventures, setVentures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [deleting, setDeleting] = useState(false);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Verificar autenticación
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [user.id, navigate]);

    // Cargar emprendimientos del usuario
    useEffect(() => {
        const loadMyVentures = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando emprendimientos del usuario ${user.id}`);
                const data = await getMyVentures(user.id);
                setVentures(data);
                console.log('✅ Mis emprendimientos:', data);
                
            } catch (err) {
                console.error('❌ Error cargando mis emprendimientos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (user.id) {
            loadMyVentures();
        }
    }, [user.id]);

    // Eliminar emprendimiento
    const handleDelete = async (id, nombre) => {
        if (!window.confirm(`¿Estás seguro de eliminar "${nombre}"?`)) {
            return;
        }
        
        try {
            setDeleting(true);
            await deleteVenture(id);
            setVentures(ventures.filter(v => v.id !== id));
            alert('✅ Emprendimiento eliminado');
        } catch (err) {
            console.error('❌ Error eliminando:', err);
            alert('Error al eliminar el emprendimiento');
        } finally {
            setDeleting(false);
        }
    };

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

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Error: {error}</div>
                <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="my-ventures-page">
            <div className="container">
                
                {/* Header */}
                <div className="my-ventures-header">
                    <div className="my-ventures-header-left">
                        <Link to="/" className="btn-back-home">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="my-ventures-title">🚀 Mis Emprendimientos</h1>
                    </div>
                    <Link to="/publish" className="btn-new-venture">
                        ➕ Nuevo Emprendimiento
                    </Link>
                </div>

                {ventures.length > 0 ? (
                    <div className="ventures-grid">
                        {ventures.map(venture => (
                            <div key={venture.id} className="venture-card">
                                <div className="venture-card-header">
                                    <h3 className="venture-name">{venture.nombre}</h3>
                                    <span className={`venture-status ${venture.estado === 'activo' ? 'status-active' : 'status-pending'}`}>
                                        {venture.estado === 'activo' ? '✅ Activo' : '⏳ Pendiente'}
                                    </span>
                                </div>
                                
                                <p className="venture-description">{venture.descripcion}</p>
                                
                                <div className="venture-meta">
                                    <span className="venture-category">
                                        📂 {venture.categoria?.nombre || 'Sin categoría'}
                                    </span>
                                    <span className="venture-location">
                                        📍 {venture.ubicacion || 'Sin ubicación'}
                                    </span>
                                </div>
                                
                                <div className="venture-stats">
                                    <span>⭐ {venture.calificacion || 0} ({venture.num_resenas || 0} reseñas)</span>
                                </div>
                                
                                <div className="venture-actions">
                                    <Link to={`/venture/${venture.id}`} className="btn-view">
                                        👁️ Ver
                                    </Link>
                                    <Link to={`/edit-venture/${venture.id}`} className="btn-edit">
                                        ✏️ Editar
                                    </Link>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => handleDelete(venture.id, venture.nombre)}
                                        disabled={deleting}
                                    >
                                        🗑️ Eliminar
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">📭</div>
                        <h3>No tienes emprendimientos publicados</h3>
                        <p>Comienza compartiendo tu proyecto con la comunidad</p>
                        <Link to="/publish" className="btn-empty-create">
                            ➕ Publicar mi primer emprendimiento
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyVentures;