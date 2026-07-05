/**
 * AddProduct.jsx - Agregar Producto
 * Permite agregar un nuevo producto a un emprendimiento
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './AddProduct.css';

const AddProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [formData, setFormData] = useState({
    nombre: '',
    precio: '',
    descripcion: '',
    stock: '',
    estado: 'activo',
    imagen: null
  });
  
  const [errors, setErrors] = useState({});
  const [previewImage, setPreviewImage] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Datos del emprendimiento (simulado)
  const venture = {
    id: parseInt(id),
    nombre: id === '1' ? 'Yupi' : 'GreenTech'
  };

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Manejar cambio de imagen
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validar tipo
      const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif'];
      if (!tiposPermitidos.includes(file.type)) {
        setErrors(prev => ({ ...prev, imagen: 'Formato no permitido. Usa JPG, PNG o GIF' }));
        return;
      }
      
      // Validar tamaño (5MB)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, imagen: 'La imagen no puede superar los 5MB' }));
        return;
      }
      
      setFormData(prev => ({ ...prev, imagen: file }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
      
      if (errors.imagen) {
        setErrors(prev => ({ ...prev, imagen: '' }));
      }
    }
  };

  // Validar formulario
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del producto es obligatorio';
    } else if (formData.nombre.length < 3) {
      newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
    }
    
    if (!formData.precio) {
      newErrors.precio = 'El precio es obligatorio';
    } else if (parseFloat(formData.precio) <= 0) {
      newErrors.precio = 'El precio debe ser mayor a 0';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es obligatoria';
    } else if (formData.descripcion.length < 10) {
      newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
    }
    
    if (!formData.stock) {
      newErrors.stock = 'El stock es obligatorio';
    } else if (parseInt(formData.stock) < 0) {
      newErrors.stock = 'El stock no puede ser negativo';
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
      console.log('📦 Nuevo producto:', {
        emprendimiento: venture.nombre,
        ...formData,
        precio: parseFloat(formData.precio),
        stock: parseInt(formData.stock)
      });
      
      setSuccess(true);
      setSubmitting(false);
      
      // Redirigir después de 2 segundos
      setTimeout(() => {
        navigate(`/venture/${id}`);
      }, 1500);
    }, 800);
  };

  // Si fue exitoso
  if (success) {
    return (
      <div className="add-product-page">
        <div className="container">
          <div className="success-card">
            <div className="success-icon">🎉</div>
            <h2 className="success-title">¡Producto Agregado!</h2>
            <p className="success-text">
              El producto ha sido agregado exitosamente al emprendimiento.
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
    <div className="add-product-page">
      <div className="container">
        <div className="product-card">
          
          <div className="product-header">
            <h5 className="product-title">
              ➕ Agregar Producto a "{venture.nombre}"
            </h5>
          </div>
          
          <div className="product-body">
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              
              <div className="row">
                {/* Nombre */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Nombre del Producto *</label>
                    <input
                      type="text"
                      name="nombre"
                      className={`form-control ${errors.nombre ? 'error' : ''}`}
                      value={formData.nombre}
                      onChange={handleChange}
                      placeholder="Ej: Galletas de Chocolate"
                    />
                    {errors.nombre && <div className="error-message">{errors.nombre}</div>}
                  </div>
                </div>
                
                {/* Precio */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Precio *</label>
                    <input
                      type="number"
                      name="precio"
                      className={`form-control ${errors.precio ? 'error' : ''}`}
                      value={formData.precio}
                      onChange={handleChange}
                      placeholder="2500"
                      min="0"
                      step="100"
                    />
                    {errors.precio && <div className="error-message">{errors.precio}</div>}
                  </div>
                </div>
              </div>

              {/* Descripción */}
              <div className="form-group">
                <label className="form-label">Descripción *</label>
                <textarea
                  name="descripcion"
                  className={`form-control ${errors.descripcion ? 'error' : ''}`}
                  rows="4"
                  value={formData.descripcion}
                  onChange={handleChange}
                  placeholder="Describe tu producto, sus características y beneficios..."
                />
                {errors.descripcion && <div className="error-message">{errors.descripcion}</div>}
              </div>

              <div className="row">
                {/* Stock */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Stock Disponible *</label>
                    <input
                      type="number"
                      name="stock"
                      className={`form-control ${errors.stock ? 'error' : ''}`}
                      value={formData.stock}
                      onChange={handleChange}
                      placeholder="10"
                      min="0"
                    />
                    {errors.stock && <div className="error-message">{errors.stock}</div>}
                  </div>
                </div>
                
                {/* Estado */}
                <div className="col-md-6">
                  <div className="form-group">
                    <label className="form-label">Estado *</label>
                    <select
                      name="estado"
                      className="form-select"
                      value={formData.estado}
                      onChange={handleChange}
                    >
                      <option value="activo">✅ Activo</option>
                      <option value="pendiente">⏳ Pendiente</option>
                      <option value="borrador">📝 Borrador</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Imagen */}
              <div className="form-group">
                <label className="form-label">Imagen del Producto</label>
                <input
                  type="file"
                  name="imagen"
                  className={`form-control ${errors.imagen ? 'error' : ''}`}
                  onChange={handleImageChange}
                  accept="image/jpeg,image/png,image/gif"
                />
                {errors.imagen && <div className="error-message">{errors.imagen}</div>}
                <div className="form-hint">Imagen opcional para mostrar tu producto (JPG, PNG, GIF - máx 5MB)</div>
                
                {previewImage && (
                  <div className="image-preview">
                    <img src={previewImage} alt="Preview" />
                    <button 
                      type="button"
                      className="btn-remove-image"
                      onClick={() => {
                        setPreviewImage(null);
                        setFormData(prev => ({ ...prev, imagen: null }));
                      }}
                    >
                      ✖
                    </button>
                  </div>
                )}
              </div>

              {/* Botones */}
              <div className="form-actions">
                <Link to={`/venture/${id}`} className="btn-cancel">
                  Cancelar
                </Link>
                <button type="submit" className="btn-submit" disabled={submitting}>
                  {submitting ? 'Guardando...' : '➕ Agregar Producto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddProduct;