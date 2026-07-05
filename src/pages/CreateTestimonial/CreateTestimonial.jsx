/**
 * CreateTestimonial.jsx - Crear Testimonio
 * Permite a los usuarios compartir su experiencia
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './CreateTestimonial.css';

const CreateTestimonial = () => {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    empresa: '',
    contenido: ''
  });
  
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'Por favor ingresa tu nombre';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.contenido.trim()) {
      newErrors.contenido = 'Por favor escribe tu testimonio';
    } else if (formData.contenido.length < 20) {
      newErrors.contenido = 'El testimonio debe tener al menos 20 caracteres';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setSubmitting(true);
    
    // Simular envío
    setTimeout(() => {
      console.log('📝 Nuevo testimonio:', formData);
      
      // Guardar en localStorage (simulado)
      const testimonios = JSON.parse(localStorage.getItem('testimonios') || '[]');
      testimonios.push({
        id: Date.now(),
        ...formData,
        fecha: new Date().toISOString().split('T')[0]
      });
      localStorage.setItem('testimonios', JSON.stringify(testimonios));
      
      setSuccess(true);
      setSubmitting(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate('/');
      }, 2000);
    }, 800);
  };

  // Si fue exitoso, mostrar mensaje de éxito
  if (success) {
    return (
      <div className="create-testimonial-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2>¡Testimonio Publicado!</h2>
            <p>Gracias por compartir tu experiencia. Tu testimonio ayudará a inspirar a otros emprendedores.</p>
            <Link to="/" className="btn-home">
              ↩ Volver al Inicio
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="create-testimonial-page">
      <div className="container">
        <div className="testimonial-card">
          
          <div className="card-header">
            <h3 className="card-title">📝 Comparte tu Experiencia</h3>
          </div>
          
          <div className="card-body">
            <p className="card-subtitle">
              Tu testimonio ayuda a inspirar a otros emprendedores. ¡Comparte tu historia!
            </p>
            
            <form onSubmit={handleSubmit} className="testimonial-form">
              
              {/* Campo: Nombre */}
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Tu Nombre <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  className={`form-control ${errors.nombre ? 'error' : ''}`}
                  value={formData.nombre}
                  onChange={handleChange}
                  placeholder="Ej: Carlos Mendoza"
                />
                {errors.nombre && <div className="error-message">{errors.nombre}</div>}
              </div>
              
              {/* Campo: Empresa */}
              <div className="form-group">
                <label htmlFor="empresa" className="form-label">
                  Tu Emprendimiento
                </label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  className="form-control"
                  value={formData.empresa}
                  onChange={handleChange}
                  placeholder="Ej: Yupi Alimentos (opcional)"
                />
                <div className="form-hint">Opcional - el nombre de tu negocio o proyecto</div>
              </div>
              
              {/* Campo: Contenido */}
              <div className="form-group">
                <label htmlFor="contenido" className="form-label">
                  Tu Testimonio <span className="required">*</span>
                </label>
                <textarea
                  id="contenido"
                  name="contenido"
                  className={`form-control ${errors.contenido ? 'error' : ''}`}
                  rows="6"
                  value={formData.contenido}
                  onChange={handleChange}
                  placeholder="Comparte cómo te ha ayudado nuestra plataforma..."
                />
                {errors.contenido && <div className="error-message">{errors.contenido}</div>}
                <div className="form-hint">Mínimo 20 caracteres - Cuéntanos tu experiencia</div>
              </div>
              
              {/* Botones */}
              <div className="form-actions">
                <button 
                  type="submit" 
                  className="btn-submit"
                  disabled={submitting}
                >
                  {submitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                      Publicando...
                    </>
                  ) : (
                    '✅ Publicar Testimonio'
                  )}
                </button>
                
                <Link to="/" className="btn-secondary">
                  ↩ Volver al Inicio
                </Link>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateTestimonial;