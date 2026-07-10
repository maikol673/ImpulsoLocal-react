/**
 * AddReview.jsx - Agregar/Editar Reseña
 * CON API REAL 
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVentureById, getReviews, createReview, updateReview, deleteReview } from '../../services/api';
import './AddReview.css';

const AddReview = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    // ============================================================
    //  TODOS LOS HOOKS PRIMERO - Siempre en el mismo orden
    // ============================================================
    const [venture, setVenture] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [reviewExists, setReviewExists] = useState(false);
    const [existingReviewId, setExistingReviewId] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    const [formData, setFormData] = useState({
        calificacion: 0,
        comentario: ''
    });
    
    const [errors, setErrors] = useState({});

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // ============================================================
    //  useEffect - Con todas las dependencias (Puesto antes del return anticipado)
    // ============================================================
    useEffect(() => {
        // Si no hay usuario, redirigir inmediatamente
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                
                const ventureData = await getVentureById(id);
                setVenture(ventureData);
                
                const reviewsData = await getReviews(id);
                
                const existingReview = reviewsData.find(
                    r => r.usuario_id === user.id
                );
                
                if (existingReview) {
                    setReviewExists(true);
                    setExistingReviewId(existingReview.id);
                    setFormData({
                        calificacion: existingReview.calificacion || 0,
                        comentario: existingReview.comentario || ''
                    });
                }
                
            } catch (err) {
                console.error('Error cargando datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [id, user.id, navigate]); //  Agregada navigate a las dependencias

    // ============================================================
    //  VERIFICAR LOGIN PARA EL RENDERIZADO
    // ============================================================
    if (!user.id) {
        return null;
    }

    // ============================================================
    //  FUNCIONES
    // ============================================================
    const handleStarClick = (rating) => {
        setFormData(prev => ({ ...prev, calificacion: rating }));
        if (errors.calificacion) {
            setErrors(prev => ({ ...prev, calificacion: '' }));
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (formData.calificacion === 0) {
            newErrors.calificacion = 'Selecciona una calificación';
        }
        
        if (!formData.comentario.trim()) {
            newErrors.comentario = 'Escribe un comentario';
        } else if (formData.comentario.length < 10) {
            newErrors.comentario = 'El comentario debe tener al menos 10 caracteres';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            let response;
            
            if (reviewExists) {
                response = await updateReview(existingReviewId, {
                    calificacion: formData.calificacion,
                    comentario: formData.comentario
                });
            } else {
                response = await createReview({
                    emprendimiento_id: parseInt(id),
                    usuario_id: user.id,
                    calificacion: formData.calificacion,
                    comentario: formData.comentario
                });
            }
            
            console.log('✅ Reseña guardada:', response);
            
            setSuccess(true);
            setSubmitting(false);
            
            setTimeout(() => {
                navigate(`/venture/${id}`);
            }, 1500);
            
        } catch (err) {
            console.error('Error al guardar reseña:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al guardar la reseña');
            }
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('¿Estás seguro de que quieres eliminar tu reseña?')) {
            return;
        }
        
        setIsDeleting(true);
        
        try {
            await deleteReview(existingReviewId);
            alert('✅ Reseña eliminada correctamente');
            navigate(`/venture/${id}`);
        } catch (err) {
            console.error('Error al eliminar reseña:', err);
            alert('Error al eliminar la reseña');
            setIsDeleting(false);
        }
    };

    const renderStars = () => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            stars.push(
                <span
                    key={i}
                    className={`star ${i <= formData.calificacion ? 'filled' : ''}`}
                    onClick={() => handleStarClick(i)}
                >
                    {i <= formData.calificacion ? '★' : '☆'}
                </span>
            );
        }
        return stars;
    };

    // ============================================================
    // ✅ RENDERIZADO
    // ============================================================
    
    if (loading) {
        return (
            <div className="add-review-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando datos...</p>
                </div>
            </div>
        );
    }

    if (!venture) {
        return (
            <div className="add-review-page">
                <div className="container">
                    <div className="alert alert-danger">
                        <h2>⚠️ Emprendimiento no encontrado</h2>
                        <Link to="/ventures" className="btn btn-secondary">← Volver</Link>
                    </div>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="add-review-page">
                <div className="container">
                    <div className="success-card">
                        <div className="success-icon">⭐</div>
                        <h2 className="success-title">
                            {reviewExists ? '¡Reseña Actualizada!' : '¡Reseña Publicada!'}
                        </h2>
                        <p className="success-text">
                            {reviewExists 
                                ? 'Tu reseña ha sido actualizada exitosamente.'
                                : '¡Gracias por compartir tu experiencia!'}
                        </p>
                        <Link to={`/venture/${id}`} className="btn-venture">
                            📋 Ver Emprendimiento
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="add-review-page">
            <div className="container">
                <div className="review-card">
                    
                    <h2 className="review-title">
                        {reviewExists ? '✏️ Editar tu Reseña' : '⭐ Dejar Reseña'}
                    </h2>
                    
                    <p className="review-subtitle">
                        para <strong>{venture.nombre}</strong>
                    </p>
                    
                    {error && (
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="review-form">
                        
                        <div className="form-group">
                            <label className="form-label">Calificación</label>
                            <div className="stars-container">
                                {renderStars()}
                            </div>
                            {errors.calificacion && (
                                <span className="error-text">{errors.calificacion}</span>
                            )}
                        </div>
                        
                        <div className="form-group">
                            <label className="form-label">Comentario</label>
                            <textarea
                                name="comentario"
                                className={`form-control ${errors.comentario ? 'error' : ''}`}
                                rows="5"
                                value={formData.comentario}
                                onChange={handleChange}
                                placeholder="¿Qué opinas de este emprendimiento?"
                            />
                            {errors.comentario && <span className="error-text">{errors.comentario}</span>}
                        </div>
                        
                        <div className="form-actions">
                            <div className="form-actions-left">
                                {reviewExists && (
                                    <button 
                                        type="button" 
                                        className="btn-delete"
                                        onClick={handleDelete}
                                        disabled={isDeleting}
                                    >
                                        🗑️ Eliminar Reseña
                                    </button>
                                )}
                            </div>
                            <div className="form-actions-right">
                                <Link to={`/venture/${id}`} className="btn-cancel">
                                    Cancelar
                                </Link>
                                <button 
                                    type="submit" 
                                    className="btn-submit"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <i className="fas fa-spinner fa-spin"></i> Guardando...
                                        </>
                                    ) : (
                                        reviewExists ? 'Actualizar Reseña' : 'Publicar Reseña'
                                    )}
                                </button>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddReview;