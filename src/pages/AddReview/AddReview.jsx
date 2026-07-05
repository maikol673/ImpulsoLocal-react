/**
 * AddReview.jsx - Agregar/Editar Reseña
 * Permite a los usuarios dejar o editar una reseña para un emprendimiento
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './AddReview.css';

const AddReview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // Datos de prueba DIRECTOS (sin useEffect)
  const mockVentures = [
    {
      id: 1,
      nombre: 'Yupi',
      resenas: [
        { id: 1, usuario: 'carlos_dev', calificacion: 5, comentario: 'Excelente producto' }
      ]
    },
    {
      id: 2,
      nombre: 'GreenTech',
      resenas: [
        { id: 1, usuario: 'maria_b', calificacion: 4, comentario: 'Muy buen servicio' }
      ]
    }
  ];

  // Buscar el emprendimiento directamente
  const venture = mockVentures.find(v => v.id === parseInt(id));
  
  // Verificar si el usuario tiene reseña
  const user = JSON.parse(localStorage.getItem('user') || '{"username":"carlos_dev"}');
  const existingReview = venture?.resenas?.find(r => r.usuario === user.username);
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    calificacion: existingReview?.calificacion || 0,
    comentario: existingReview?.comentario || ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Manejar estrellas
  const handleStarClick = (rating) => {
    setFormData(prev => ({ ...prev, calificacion: rating }));
    if (errors.calificacion) setErrors(prev => ({ ...prev, calificacion: '' }));
  };

  // Manejar cambio en comentario
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  // Validar
  const validateForm = () => {
    const newErrors = {};
    if (formData.calificacion === 0) newErrors.calificacion = 'Selecciona una calificación';
    if (!formData.comentario.trim()) newErrors.comentario = 'Escribe un comentario';
    else if (formData.comentario.length < 10) newErrors.comentario = 'Mínimo 10 caracteres';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    
    setSubmitting(true);
    setTimeout(() => {
      console.log('📝 Reseña guardada:', formData);
      alert(existingReview ? '✅ Reseña actualizada' : '✅ Reseña publicada');
      navigate(`/venture/${id}`);
      setSubmitting(false);
    }, 500);
  };

  // Estrellas
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

  if (!venture) {
    return (
      <div className="error-container">
        <h2>⚠️ Emprendimiento no encontrado</h2>
        <Link to="/ventures" className="btn-back">← Volver</Link>
      </div>
    );
  }

  return (
    <div className="add-review-page">
      <div className="container">
        <div className="review-card">
          
          <h2 className="review-title">
            {existingReview ? '✏️ Editar tu Reseña' : '⭐ Dejar Reseña'}
          </h2>
          
          <p className="review-subtitle">
            para <strong>{venture.nombre}</strong>
          </p>
          
          <form onSubmit={handleSubmit} className="review-form">
            
            <div className="form-group">
              <label className="form-label">Calificación</label>
              <div className="stars-container">{renderStars()}</div>
              {errors.calificacion && <div className="error-message">{errors.calificacion}</div>}
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
              {errors.comentario && <div className="error-message">{errors.comentario}</div>}
            </div>
            
            <div className="form-actions">
              <button type="submit" className="btn-submit" disabled={submitting}>
                {submitting ? 'Guardando...' : (existingReview ? 'Actualizar Reseña' : 'Publicar Reseña')}
              </button>
              <Link to={`/venture/${id}`} className="btn-cancel">Cancelar</Link>
            </div>
            
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddReview;