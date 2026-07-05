/**
 * ConfirmDeleteChat.jsx - Confirmar Eliminación de Conversación
 * Página de confirmación antes de eliminar una conversación
 * CON BOTÓN VOLVER AL CHAT LIST - VERSIÓN AZUL
 */

import React, { useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ConfirmDeleteChat.css';

const ConfirmDeleteChat = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [isDeleting, setIsDeleting] = useState(false);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // ✅ Datos de la conversación (simulado)
  const conversation = {
    id: parseInt(id),
    fecha_creacion: '2024-01-20T14:25:00',
    ultima_actualizacion: '2024-01-20T14:32:00',
    total_mensajes: 8,
    otro_usuario: 'María Pérez'
  };

  const formatDateTime = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setIsDeleting(true);
    
    setTimeout(() => {
      console.log(`🗑️ Conversación #${id} eliminada`);
      alert('✅ Conversación eliminada correctamente');
      navigate('/chat');
      setIsDeleting(false);
    }, 1000);
  };

  return (
    <div className="confirm-delete-page">
      <div className="container">
        
        {/* ============ BOTÓN VOLVER ============ */}
        <div className="confirm-delete-back">
          <Link to="/chat" className="btn-back-chatlist-confirm">
            <i className="fas fa-arrow-left"></i> Volver a conversaciones
          </Link>
        </div>

        <div className="confirm-delete-card">
          
          {/* Header AZUL */}
          <div className="confirm-delete-header">
            <h4 className="confirm-delete-title">
              <i className="fas fa-trash me-2"></i>
              Eliminar Conversación
            </h4>
          </div>
          
          <div className="confirm-delete-body">
            
            {/* Alerta de advertencia */}
            <div className="alert-warning">
              <i className="fas fa-exclamation-triangle me-2"></i>
              <strong>Advertencia:</strong> Esta acción no se puede deshacer.
            </div>
            
            <p className="confirm-delete-question">
              ¿Estás seguro de que quieres eliminar esta conversación?
            </p>
            
            {/* Detalles de la conversación */}
            <div className="conversation-details">
              <h6>Detalles de la conversación:</h6>
              <ul className="details-list">
                <li><strong>ID:</strong> #{conversation.id}</li>
                <li><strong>Con:</strong> {conversation.otro_usuario}</li>
                <li><strong>Creada:</strong> {formatDateTime(conversation.fecha_creacion)}</li>
                <li><strong>Última actualización:</strong> {formatDateTime(conversation.ultima_actualizacion)}</li>
                <li><strong>Total mensajes:</strong> {conversation.total_mensajes}</li>
              </ul>
            </div>
            
            {/* Botones */}
            <form onSubmit={handleDelete} className="confirm-delete-form">
              <div className="confirm-delete-actions">
                <Link to="/chat" className="btn-cancel">
                  <i className="fas fa-arrow-left me-2"></i> Cancelar
                </Link>
                <button type="submit" className="btn-delete" disabled={isDeleting}>
                  <i className="fas fa-trash me-2"></i>
                  {isDeleting ? 'Eliminando...' : 'Eliminar Conversación'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDeleteChat;