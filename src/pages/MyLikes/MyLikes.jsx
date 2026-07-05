/**
 * MyLikes.jsx - Mis Favoritos (Me Encanta)
 * Muestra los emprendimientos que el usuario ha marcado como favoritos
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyLikes, toggleLike } from '../../services/api';
import './MyLikes.css';

const MyLikes = () => {
    const navigate = useNavigate();
    
    const [likes, setLikes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [removing, setRemoving] = useState(false);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Verificar autenticación
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [user.id, navigate]);

    // Cargar favoritos
    useEffect(() => {
        const loadLikes = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando favoritos del usuario ${user.id}`);
                const data = await getMyLikes(user.id);
                setLikes(data);
                console.log('❤️ Favoritos cargados:', data);
                
            } catch (err) {
                console.error('❌ Error cargando favoritos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (user.id) {
            loadLikes();
        }
    }, [user.id]);

    // Quitar de favoritos
    const handleRemoveLike = async (likeId, ventureName) => {
        if (!window.confirm(`¿Quitar "Me encanta" de "${ventureName}"?`)) {
            return;
        }
        
        try {
            setRemoving(true);
            
            // Buscar el emprendimiento_id del like
            const like = likes.find(l => l.id === likeId);
            if (!like) {
                throw new Error('Like no encontrado');
            }
            
            await toggleLike({
                usuario_id: user.id,
                emprendimiento_id: like.emprendimiento_id
            });
            
            // Eliminar de la lista local
            setLikes(likes.filter(l => l.id !== likeId));
            alert('✅ Eliminado de favoritos');
            
        } catch (err) {
            console.error('❌ Error eliminando favorito:', err);
            alert('Error al eliminar de favoritos');
        } finally {
            setRemoving(false);
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando tus favoritos...</p>
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
        <div className="my-likes-page">
            <div className="container">
                
                {/* Header */}
                <div className="likes-header">
                    <div className="likes-header-left">
                        <Link to="/" className="btn-back-home-likes">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="likes-title">❤️ Mis Favoritos</h1>
                    </div>
                </div>

                {likes.length > 0 ? (
                    <div className="likes-grid">
                        {likes.map(like => (
                            <div key={like.id} className="like-card">
                                <div className="like-card-body">
                                    
                                    {/* Imagen */}
                                    {like.emprendimiento?.imagen ? (
                                        <img 
                                            src={like.emprendimiento.imagen} 
                                            alt={like.emprendimiento.nombre}
                                            className="like-image"
                                        />
                                    ) : (
                                        <div className="like-image-placeholder">
                                            <span>📦</span>
                                        </div>
                                    )}
                                    
                                    <div className="like-content">
                                        <h5 className="like-title">{like.emprendimiento?.nombre || 'Sin nombre'}</h5>
                                        
                                        <p className="like-date">
                                            <small>Agregado: {new Date(like.created_at).toLocaleDateString('es-CO')}</small>
                                        </p>
                                        
                                        <div className="like-badges">
                                            <span className="badge badge-secondary">
                                                {like.emprendimiento?.categoria?.nombre || 'Sin categoría'}
                                            </span>
                                            <span className={`badge ${like.emprendimiento?.estado === 'destacado' ? 'badge-success' : 'badge-primary'}`}>
                                                {like.emprendimiento?.estado === 'destacado' ? '⭐ Destacado' : 'Activo'}
                                            </span>
                                        </div>
                                        
                                        <p className="like-description">
                                            {like.emprendimiento?.descripcion || 'Sin descripción'}
                                        </p>
                                        
                                        <div className="like-actions">
                                            <Link to={`/venture/${like.emprendimiento?.id}`} className="btn-venture-detail">
                                                Ver Detalles
                                            </Link>
                                            <button 
                                                className="btn-remove-like"
                                                onClick={() => handleRemoveLike(like.id, like.emprendimiento?.nombre || '')}
                                                disabled={removing}
                                            >
                                                💔 Quitar
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-state">
                        <div className="empty-icon">❤️</div>
                        <h4 className="empty-title">No tienes emprendimientos favoritos</h4>
                        <p className="empty-text">
                            Explora los emprendimientos y da "Me encanta" a tus favoritos
                        </p>
                        <Link to="/ventures" className="btn-explore">
                            Explorar Emprendimientos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyLikes;