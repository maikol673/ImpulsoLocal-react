/**
 * EditVenture.jsx - Editar Emprendimiento
 */


import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import './EditVenture.css';

const EditVenture = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  //  Datos de prueba DIRECTAMENTE en el estado inicial
  const [formData, setFormData] = useState(() => {
    // Datos de prueba según el ID
    const mockData = {
      1: {
        nombre: 'Yupi',
        descripcion: 'Empresa de alimentos empaquetados saludables y deliciosos.',
        categoria: '1',
        ubicacion: 'Cal, Colombia',
        estado: 'activo'
      },
      2: {
        nombre: 'GreenTech',
        descripcion: 'Soluciones tecnológicas para agricultura urbana.',
        categoria: '2',
        ubicacion: 'Bogotá, Colombia',
        estado: 'activo'
      }
    };
    return mockData[id] || mockData[1];
  });

  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    // Simular envío
    setTimeout(() => {
      console.log('📝 Datos actualizados:', formData);
      alert('✅ Emprendimiento actualizado correctamente');
      navigate(`/venture/${id}`);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="edit-venture-page">
      <div className="container">
        <h1 className="page-title">✏️ Editar Emprendimiento</h1>
        
        <form onSubmit={handleSubmit} className="edit-form">
          <div className="form-group">
            <label className="form-label">Nombre *</label>
            <input
              type="text"
              name="nombre"
              className="form-control"
              value={formData.nombre}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Descripción *</label>
            <textarea
              name="descripcion"
              className="form-control"
              rows="5"
              value={formData.descripcion}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Categoría *</label>
            <select
              name="categoria"
              className="form-select"
              value={formData.categoria}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona una categoría</option>
              <option value="1">💻 Tecnología</option>
              <option value="2">🍔 Alimentario y bebidas</option>
              <option value="3">📋 Servicios</option>
              <option value="4">👗 Moda</option>
              <option value="5">🎨 Artesanías</option>
              <option value="6">📚 Educación</option>
              <option value="7">💊 Salud y Bienestar</option>
            </select>
          </div>
          
          <div className="form-group">
            <label className="form-label">Ubicación</label>
            <input
              type="text"
              name="ubicacion"
              className="form-control"
              value={formData.ubicacion}
              onChange={handleChange}
              placeholder="Ciudad, País"
            />
          </div>
          
          <div className="form-group">
            <label className="form-label">Estado</label>
            <select
              name="estado"
              className="form-select"
              value={formData.estado}
              onChange={handleChange}
            >
              <option value="activo">✅ Activo</option>
              <option value="pendiente">⏳ Pendiente de revisión</option>
              <option value="borrador">📝 Borrador</option>
            </select>
          </div>
          
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
            </button>
            <Link to={`/venture/${id}`} className="btn btn-secondary">
              Cancelar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditVenture;