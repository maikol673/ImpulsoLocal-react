/**
 * MyVentures.jsx - Mis Emprendimientos
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './MyVentures.css';

const MyVentures = () => {
  //  Datos de prueba DIRECTAMENTE en el estado inicial
  const [ventures, setVentures] = useState([
    {
      id: 1,
      nombre: 'Yupi',
      descripcion: 'Empresa de alimentos empaquetados saludables y deliciosos.',
      categoria: 'Alimentario y bebidas',
      calificacion: 4.5,
      num_resenas: 12,
      ubicacion: 'Cal, Colombia',
      estado: 'activo'
    },
    {
      id: 2,
      nombre: 'GreenTech',
      descripcion: 'Soluciones tecnológicas para agricultura urbana.',
      categoria: 'Tecnología',
      calificacion: 4.8,
      num_resenas: 45,
      ubicacion: 'Bogotá, Colombia',
      estado: 'activo'
    }
  ]);

  // Eliminar emprendimiento
  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de eliminar este emprendimiento?')) {
      setVentures(ventures.filter(v => v.id !== id));
      alert('✅ Emprendimiento eliminado');
    }
  };

  return (
    <div className="my-ventures-page">
      <div className="container">
        <h1 className="page-title">🚀 Mis Emprendimientos</h1>
        
        {ventures.length > 0 ? (
          <div className="ventures-grid">
            {ventures.map(venture => (
              <div key={venture.id} className="venture-card">
                <h2 className="venture-name">{venture.nombre}</h2>
                <p className="venture-description">{venture.descripcion}</p>
                
                <div className="venture-category">
                  {venture.categoria}
                </div>
                
                <div className="venture-metrics">
                  <div className="metric">
                    <span>⭐</span>
                    <span>{venture.calificacion} ({venture.num_resenas} reseñas)</span>
                  </div>
                  <div className="metric">
                    <span>📍</span>
                    <span>{venture.ubicacion}</span>
                  </div>
                </div>
                
                <div className="venture-actions">
                  <Link to={`/dashboard/${venture.id}`} className="btn-metrics">
                    📊 Ver Métricas
                  </Link>
                  <div className="action-buttons">
                    <Link to={`/edit-venture/${venture.id}`} className="btn-edit">
                      ✏️ Editar
                    </Link>
                    <button 
                      onClick={() => handleDelete(venture.id)} 
                      className="btn-delete"
                    >
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">📊</div>
            <h3>No tienes emprendimientos</h3>
            <p>Crea tu primer emprendimiento para ver métricas</p>
            <Link to="/publish" className="btn-create">
              ➕ Crear Emprendimiento
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyVentures;