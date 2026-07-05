/**
 * ChatList.jsx - Lista de Conversaciones (Chat)
 * Muestra todas las conversaciones del usuario y usuarios disponibles
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ChatList.css';

const ChatList = () => {
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [searchTerm, setSearchTerm] = useState('');
  const [showNewChatModal, setShowNewChatModal] = useState(false);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // ✅ Datos FIJOS - Conversaciones
  const conversations = [
    {
      id: 1,
      otro_usuario: {
        id: 2,
        username: 'maria_perez',
        full_name: 'María Pérez',
        first_name: 'María',
        avatar: null
      },
      ultimo_mensaje: '¡Hola! ¿Cómo va tu emprendimiento?',
      fecha_ultimo_mensaje: '2024-01-20T14:30:00',
      mensajes_no_leidos: 3
    },
    {
      id: 2,
      otro_usuario: {
        id: 3,
        username: 'carlos_lopez',
        full_name: 'Carlos López',
        first_name: 'Carlos',
        avatar: null
      },
      ultimo_mensaje: 'Me encantó tu producto, ¿tienes más?',
      fecha_ultimo_mensaje: '2024-01-19T10:15:00',
      mensajes_no_leidos: 0
    },
    {
      id: 3,
      otro_usuario: {
        id: 4,
        username: 'ana_garcia',
        full_name: 'Ana García',
        first_name: 'Ana',
        avatar: null
      },
      ultimo_mensaje: 'Gracias por tu ayuda!',
      fecha_ultimo_mensaje: '2024-01-18T16:45:00',
      mensajes_no_leidos: 1
    }
  ];

  // ✅ Datos FIJOS - Usuarios disponibles
  const availableUsers = [
    {
      id: 5,
      username: 'juan_rodriguez',
      full_name: 'Juan Rodríguez',
      first_name: 'Juan'
    },
    {
      id: 6,
      username: 'laura_martinez',
      full_name: 'Laura Martínez',
      first_name: 'Laura'
    },
    {
      id: 7,
      username: 'pedro_ramirez',
      full_name: 'Pedro Ramírez',
      first_name: 'Pedro'
    }
  ];

  // Filtrar usuarios disponibles por búsqueda
  const filteredAvailableUsers = availableUsers.filter(user => {
    const search = searchTerm.toLowerCase();
    return user.full_name.toLowerCase().includes(search) ||
           user.username.toLowerCase().includes(search);
  });

  // Filtrar conversaciones por búsqueda
  const filteredConversations = conversations.filter(conv => {
    const search = searchTerm.toLowerCase();
    return conv.otro_usuario.full_name.toLowerCase().includes(search) ||
           conv.otro_usuario.username.toLowerCase().includes(search);
  });

  // Formatear fecha
  const formatTimeAgo = (fecha) => {
    const date = new Date(fecha);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return 'Hace ' + diff + 's';
    if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
    if (diff < 86400) return 'Hace ' + Math.floor(diff / 3600) + 'h';
    if (diff < 2592000) return 'Hace ' + Math.floor(diff / 86400) + 'd';
    return date.toLocaleDateString('es-CO');
  };

  // Obtener iniciales del nombre
  const getInitials = (user) => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.username.charAt(0).toUpperCase();
  };

  // Abrir chat con usuario
  const startChat = (userId) => {
    console.log('💬 Iniciando chat con usuario:', userId);
    alert('💬 Chat iniciado con el usuario (simulado)');
    setShowNewChatModal(false);
  };

  return (
    <div className="chat-list-page">
      <div className="container">
        
        {/* ============ HEADER CON BOTÓN VOLVER ============ */}
        <div className="chat-header">
          <div className="chat-header-left">
            <Link to="/" className="btn-back-home" title="Volver al inicio">
              <i className="fas fa-arrow-left"></i> Volver
            </Link>
            <h1 className="chat-title">
              <i className="fas fa-comments text-primary me-2"></i>
              Mensajes
            </h1>
          </div>
          <button className="btn-new-chat" onClick={() => setShowNewChatModal(true)}>
            <i className="fas fa-plus me-2"></i> Nuevo Chat
          </button>
        </div>

        {/* ============ BUSCADOR ============ */}
        <div className="chat-search">
          <input
            type="text"
            className="search-input"
            placeholder="🔍 Buscar conversaciones o usuarios..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="chat-grid">
          
          {/* ============ LISTA DE CONVERSACIONES ============ */}
          <div className="conversations-column">
            <div className="conversations-card">
              <div className="conversations-header">
                <h6 className="conversations-title">
                  Conversaciones
                  <span className="conversations-badge">{filteredConversations.length}</span>
                </h6>
              </div>
              <div className="conversations-list">
                {filteredConversations.length > 0 ? (
                  filteredConversations.map(conv => (
                    <Link
                      key={conv.id}
                      to={`/chat/${conv.otro_usuario.id}`}
                      className="conversation-item"
                    >
                      <div className="conversation-avatar">
                        <span>{getInitials(conv.otro_usuario)}</span>
                      </div>
                      <div className="conversation-info">
                        <div className="conversation-name-row">
                          <h6 className="conversation-name">
                            {conv.otro_usuario.full_name || conv.otro_usuario.username}
                          </h6>
                          {conv.mensajes_no_leidos > 0 && (
                            <span className="unread-badge">{conv.mensajes_no_leidos}</span>
                          )}
                        </div>
                        <small className="conversation-last-message">
                          {conv.ultimo_mensaje || 'No hay mensajes'}
                        </small>
                        <div className="conversation-meta">
                          <small className="text-muted">@{conv.otro_usuario.username}</small>
                          <small className="text-muted">{formatTimeAgo(conv.fecha_ultimo_mensaje)}</small>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="empty-conversations">
                    <i className="fas fa-comments fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No tienes conversaciones</h5>
                    <p className="text-muted small">Inicia un nuevo chat para comenzar</p>
                  </div>
                )}
              </div>
            </div>

            {/* ============ USUARIOS DISPONIBLES ============ */}
            <div className="users-card">
              <div className="users-header">
                <h6 className="users-title">Usuarios Disponibles</h6>
              </div>
              <div className="users-list">
                {filteredAvailableUsers.length > 0 ? (
                  filteredAvailableUsers.map(user => (
                    <button
                      key={user.id}
                      className="user-item"
                      onClick={() => startChat(user.id)}
                    >
                      <div className="user-avatar">
                        <span>{getInitials(user)}</span>
                      </div>
                      <div className="user-info">
                        <h6 className="user-name">{user.full_name || user.username}</h6>
                        <small className="text-muted">@{user.username}</small>
                      </div>
                      <div className="user-action">
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="empty-users">
                    <small className="text-muted">No hay otros usuarios registrados</small>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ============ ÁREA DE CHAT (VACÍA) ============ */}
          <div className="chat-area-column">
            <div className="chat-area-card">
              <div className="chat-area-empty">
                <i className="fas fa-comments fa-4x text-muted mb-3"></i>
                <h4 className="text-muted">Selecciona una conversación</h4>
                <p className="text-muted">O inicia un nuevo chat con otro usuario</p>
                <button className="btn btn-primary mt-2" onClick={() => setShowNewChatModal(true)}>
                  <i className="fas fa-plus me-2"></i> Nuevo Chat
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MODAL NUEVO CHAT ============ */}
      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Nuevo Chat</h5>
              <button className="modal-close" onClick={() => setShowNewChatModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <div className="modal-search">
                <input
                  type="text"
                  className="modal-search-input"
                  placeholder="🔍 Buscar usuario..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="modal-users-list">
                {availableUsers
                  .filter(user => {
                    const search = searchTerm.toLowerCase();
                    return user.full_name.toLowerCase().includes(search) ||
                           user.username.toLowerCase().includes(search);
                  })
                  .map(user => (
                    <button
                      key={user.id}
                      className="modal-user-item"
                      onClick={() => startChat(user.id)}
                    >
                      <div className="modal-user-avatar">
                        <span>{getInitials(user)}</span>
                      </div>
                      <div className="modal-user-info">
                        <h6 className="modal-user-name">{user.full_name || user.username}</h6>
                        <small className="text-muted">@{user.username}</small>
                      </div>
                      <div className="modal-user-action">
                        <i className="fas fa-chevron-right text-muted"></i>
                      </div>
                    </button>
                  ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatList;