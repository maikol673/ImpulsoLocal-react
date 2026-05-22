/**
 * Publish.jsx - Página para publicar nuevos emprendimientos
 * Convertido desde Django a React
 * Incluye: validaciones, subida de imágenes, categorías, ubicación
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Publish.css';

const Publish = () => {
  const navigate = useNavigate();
  
  // ============ ESTADOS DEL FORMULARIO ============
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    categoria: '',
    ubicacion: '',
    estado: 'activo',
    imagen: null
  });
  
  // ============ ESTADOS PARA VALIDACIÓN ============
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);
  
  // ============ LISTA DE CATEGORÍAS (como en Django) ============
  const categorias = [
    { value: '', label: 'Selecciona una categoría' },
    { value: 'tecnologia', label: '💻 Tecnología' },
    { value: 'alimentos', label: '🍔 Alimentos y Bebidas' },
    { value: 'servicios', label: '📋 Servicios' },
    { value: 'moda', label: '👗 Moda' },
    { value: 'artesanias', label: '🎨 Artesanías' },
    { value: 'educacion', label: '📚 Educación' },
    { value: 'salud', label: '💊 Salud y Bienestar' },
    { value: 'sostenibilidad', label: '🌱 Sostenibilidad' }
  ];
  
  // ============ OPCIONES DE ESTADO ============
  const estados = [
    { value: 'activo', label: '✅ Activo' },
    { value: 'pendiente', label: '⏳ Pendiente de revisión' },
    { value: 'borrador', label: '📝 Borrador' }
  ];
  
  // ============ MANEJAR CAMBIOS EN INPUTS ============
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo específico
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // ============ MANEJAR SUBIDA DE IMAGEN ============
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validar tipo de archivo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
      if (!tiposPermitidos.includes(file.type)) {
        setErrors(prev => ({ 
          ...prev, 
          imagen: 'Formato no permitido. Usa JPG, PNG o GIF' 
        }));
        return;
      }
      
      // Validar tamaño (5MB máximo)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ 
          ...prev, 
          imagen: 'La imagen no puede superar los 5MB' 
        }));
        return;
      }
      
      setFormData(prev => ({ ...prev, imagen: file }));
      
      // Crear preview de la imagen
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Limpiar error
      if (errors.imagen) {
        setErrors(prev => ({ ...prev, imagen: '' }));
      }
    }
  };
  
  // ============ VALIDAR FORMULARIO ============
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del emprendimiento es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 20) {
      newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
    }
    
    if (!formData.categoria) {
      newErrors.categoria = 'Selecciona una categoría';
    }
    
    if (!formData.ubicacion.trim()) {
      newErrors.ubicacion = 'La ubicación es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // ============ ENVIAR FORMULARIO ============
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      // Scroll al primer error
      const firstError = document.querySelector('.error-message');
      if (firstError) {
        firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return;
    }
    
    setIsSubmitting(true);
    
    // Crear FormData para enviar archivos
    const submitData = new FormData();
    submitData.append('nombre', formData.nombre);
    submitData.append('descripcion', formData.descripcion);
    submitData.append('categoria', formData.categoria);
    submitData.append('ubicacion', formData.ubicacion);
    submitData.append('estado', formData.estado);
    if (formData.imagen) {
      submitData.append('imagen', formData.imagen);
    }
    
    try {
      // Aquí iría la llamada a tu API de Django
      console.log('Enviando datos:', Object.fromEntries(submitData));
      
      // Simular envío (después conectarás con tu backend)
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mostrar mensaje de éxito
      alert('✅ ¡Emprendimiento publicado con éxito!');
      
      // Redirigir al listado de emprendimientos
      navigate('/ventures');
      
    } catch (error) {
      console.error('Error al publicar:', error);
      alert('❌ Error al publicar. Intenta de nuevo.');
      
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // ============ RENDERIZADO ============
  return (
    <div className="publish-page">
      <div className="publish-container">
        <h1 className="publish-title">📢 Publicar Nuevo Emprendimiento</h1>
        
        <form onSubmit={handleSubmit} className="publish-form" encType="multipart/form-data">
          
          {/* Mostrar errores generales */}
          {Object.keys(errors).length > 0 && (
            <div className="errors-container">
              <strong>Por favor corrige los siguientes errores:</strong>
              <ul>
                {Object.values(errors).map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Campo: Nombre */}
          <div className="form-group">
            <label htmlFor="nombre">
              Nombre del Emprendimiento <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              placeholder="Ej: GreenTech Solutions"
              className={errors.nombre ? 'error' : ''}
            />
            {errors.nombre && <span className="error-message">{errors.nombre}</span>}
            <small>Elige un nombre único y memorable</small>
          </div>
          
          {/* Campo: Descripción */}
          <div className="form-group">
            <label htmlFor="descripcion">
              Descripción <span className="required">*</span>
            </label>
            <textarea
              id="descripcion"
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              rows="6"
              placeholder="Describe tu emprendimiento: ¿qué problema resuelve? ¿cuál es tu misión? ¿qué lo hace único?"
              className={errors.descripcion ? 'error' : ''}
            ></textarea>
            {errors.descripcion && <span className="error-message">{errors.descripcion}</span>}
            <small>Mínimo 20 caracteres. Sé claro y convincente</small>
          </div>
          
          {/* Campo: Categoría */}
          <div className="form-group">
            <label htmlFor="categoria">
              Categoría <span className="required">*</span>
            </label>
            <select
              id="categoria"
              name="categoria"
              value={formData.categoria}
              onChange={handleChange}
              className={errors.categoria ? 'error' : ''}
            >
              {categorias.map(cat => (
                <option key={cat.value} value={cat.value} disabled={!cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            {errors.categoria && <span className="error-message">{errors.categoria}</span>}
          </div>
          
          {/* Campo: Ubicación */}
          <div className="form-group">
            <label htmlFor="ubicacion">
              Ubicación <span className="required">*</span>
            </label>
            <input
              type="text"
              id="ubicacion"
              name="ubicacion"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ciudad, País"
              className={errors.ubicacion ? 'error' : ''}
            />
            {errors.ubicacion && <span className="error-message">{errors.ubicacion}</span>}
            <small>Ej: Bogotá, Colombia</small>
          </div>
          
          {/* Campo: Imagen (subida de archivo) */}
          <div className="form-group">
            <label htmlFor="imagen">Imagen del Emprendimiento</label>
            <div className="file-input-wrapper">
              <input
                type="file"
                id="imagen"
                name="imagen"
                onChange={handleImageChange}
                accept="image/jpeg,image/png,image/gif"
                className={errors.imagen ? 'error' : ''}
              />
              <div className="file-input-hint">
                <i className="fas fa-cloud-upload-alt"></i> Haz clic o arrastra una imagen
              </div>
            </div>
            {errors.imagen && <span className="error-message">{errors.imagen}</span>}
            <small>Formatos: JPG, PNG, GIF. Máximo: 5MB</small>
            
            {/* Preview de la imagen */}
            {previewImage && (
              <div className="image-preview">
                <img src={previewImage} alt="Preview" />
                <button 
                  type="button" 
                  className="remove-image"
                  onClick={() => {
                    setFormData(prev => ({ ...prev, imagen: null }));
                    setPreviewImage(null);
                  }}
                >
                  ✖
                </button>
              </div>
            )}
          </div>
          
          {/* Campo: Estado */}
          <div className="form-group">
            <label htmlFor="estado">Estado</label>
            <select
              id="estado"
              name="estado"
              value={formData.estado}
              onChange={handleChange}
            >
              {estados.map(est => (
                <option key={est.value} value={est.value}>
                  {est.label}
                </option>
              ))}
            </select>
            <small>Los emprendimientos pendientes serán revisados por un administrador</small>
          </div>
          
          {/* Botones de acción */}
          <div className="form-actions">
            <button 
              type="submit" 
              className="btn-submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <i className="fas fa-spinner fa-spin"></i> Publicando...
                </>
              ) : (
                <>
                  <i className="fas fa-rocket"></i> Publicar Emprendimiento
                </>
              )}
            </button>
            
            <Link to="/ventures" className="btn-cancel">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Publish;