/**
 * ChatDetail.jsx - Detalle de Conversación (Chat)
 * Muestra los mensajes con un usuario específico
 * CON BOTÓN VOLVER AL CHAT LIST
 */

import React, { useState, useRef, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import './ChatDetail.css';

const ChatDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const messagesEndRef = useRef(null);
  
  // ✅ HOOKS PRIMERO
  const [newMessage, setNewMessage] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // ✅ Datos FIJOS - Mensajes de la conversación
  const [messages, setMessages] = useState(() => {
    const messagesData = {
      '2': [
        { id: 1, remitente: 'yo', contenido: '¡Hola María! ¿Cómo está tu emprendimiento?', fecha_envio: '2024-01-20T14:25:00', leido: true },
        { id: 2, remitente: 'otro', contenido: '¡Hola! Todo muy bien, gracias por preguntar. ¿Y tú?', fecha_envio: '2024-01-20T14:28:00', leido: true },
        { id: 3, remitente: 'yo', contenido: 'Me alegra escuchar eso. ¿Has visto las nuevas herramientas?', fecha_envio: '2024-01-20T14:30:00', leido: true },
        { id: 4, remitente: 'otro', contenido: 'Sí, me parecen muy útiles. ¡Gracias por compartirlas!', fecha_envio: '2024-01-20T14:32:00', leido: false }
      ],
      '3': [
        { id: 1, remitente: 'otro', contenido: 'Me encantó tu producto, ¿tienes más?', fecha_envio: '2024-01-19T10:10:00', leido: true },
        { id: 2, remitente: 'yo', contenido: '¡Gracias! Sí, tengo varios modelos disponibles.', fecha_envio: '2024-01-19T10:12:00', leido: true },
        { id: 3, remitente: 'otro', contenido: 'Genial, ¿puedo verlos?', fecha_envio: '2024-01-19T10:15:00', leido: true }
      ],
      '4': [
        { id: 1, remitente: 'yo', contenido: 'Hola Ana, ¿cómo puedo ayudarte?', fecha_envio: '2024-01-18T16:40:00', leido: true },
        { id: 2, remitente: 'otro', contenido: 'Gracias por tu ayuda con mi emprendimiento.', fecha_envio: '2024-01-18T16:43:00', leido: true },
        { id: 3, remitente: 'yo', contenido: '¡De nada! Siempre estoy aquí para ayudar.', fecha_envio: '2024-01-18T16:45:00', leido: true }
      ]
    };
    return messagesData[id] || [];
  });

  // ✅ useEffect - Siempre se llama
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // ✅ Datos FIJOS - Usuario destino
  const userDestino = {
    id: parseInt(id),
    username: id === '2' ? 'maria_perez' : id === '3' ? 'carlos_lopez' : 'ana_garcia',
    full_name: id === '2' ? 'María Pérez' : id === '3' ? 'Carlos López' : 'Ana García',
    is_staff: id === '2' ? true : false,
    avatar: null
  };

  // ✅ Datos FIJOS - Lista de usuarios disponibles
  const availableUsers = [
    { id: 2, username: 'maria_perez', full_name: 'María Pérez' },
    { id: 3, username: 'carlos_lopez', full_name: 'Carlos López' },
    { id: 4, username: 'ana_garcia', full_name: 'Ana García' },
    { id: 5, username: 'juan_rodriguez', full_name: 'Juan Rodríguez' }
  ];

  const getInitials = (user) => {
    if (user.full_name) {
      return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    }
    return user.username.charAt(0).toUpperCase();
  };

  const formatTime = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const newMsg = {
      id: messages.length + 1,
      remitente: 'yo',
      contenido: newMessage.trim(),
      fecha_envio: new Date().toISOString(),
      leido: false
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');

    setTimeout(() => {
      const autoReply = {
        id: messages.length + 2,
        remitente: 'otro',
        contenido: '¡Gracias por tu mensaje! Estoy revisando tu consulta.',
        fecha_envio: new Date().toISOString(),
        leido: false
      };
      setMessages(prev => [...prev, autoReply]);
    }, 1000);
  };

  const handleDeleteChat = () => {
    alert('🗑️ Conversación eliminada (simulado)');
    setShowDeleteModal(false);
    navigate('/chat');
  };

  return (
    <div className="chat-detail-page">
      <div className="container">
        
        {/* ============ BOTÓN VOLVER ============ */}
        <div className="chat-detail-back">
          <Link to="/chat" className="btn-back-chatlist">
            <i className="fas fa-arrow-left"></i> Volver a conversaciones
          </Link>
        </div>

        <div className="chat-detail-grid">
          
          {/* ============ SIDEBAR - LISTA DE USUARIOS ============ */}
          <div className="chat-users-column">
            <div className="chat-users-card">
              <div className="chat-users-header">
                <h6 className="chat-users-title">Conversaciones</h6>
                <span className="chat-users-badge">{availableUsers.length}</span>
              </div>
              <div className="chat-users-list">
                {availableUsers.map(user => (
                  <Link
                    key={user.id}
                    to={`/chat/${user.id}`}
                    className={`user-item ${user.id === parseInt(id) ? 'active' : ''}`}
                  >
                    <div className={`user-avatar ${user.id === parseInt(id) ? 'avatar-active' : ''}`}>
                      <span>{getInitials(user)}</span>
                    </div>
                    <div className="user-info">
                      <h6 className="user-name">{user.full_name || user.username}</h6>
                      <small className="user-username">@{user.username}</small>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* ============ ÁREA DE CHAT ============ */}
          <div className="chat-area">
            <div className="chat-card">
              
              {/* HEADER DEL CHAT */}
              <div className="chat-card-header">
                <div className="chat-header-info">
                  <div className="chat-user-avatar">
                    <span>{getInitials(userDestino)}</span>
                  </div>
                  <div className="chat-user-info">
                    <h6 className="chat-user-name">
                      {userDestino.full_name || userDestino.username}
                    </h6>
                    <small className="chat-user-username">
                      @{userDestino.username}
                      {userDestino.is_staff && (
                        <span className="badge-admin">Admin</span>
                      )}
                    </small>
                  </div>
                </div>
                <button 
                  className="btn-delete-chat"
                  onClick={() => setShowDeleteModal(true)}
                  title="Eliminar conversación"
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
              
              {/* MENSAJES */}
              <div className="chat-messages-container" id="chat-messages">
                {messages.length > 0 ? (
                  messages.map(msg => (
                    <div 
                      key={msg.id} 
                      className={`chat-message ${msg.remitente === 'yo' ? 'mio' : 'otro'}`}
                    >
                      <div className={`chat-bubble ${msg.remitente === 'yo' ? 'mio' : 'otro'}`}>
                        {msg.contenido}
                      </div>
                      <div className={`chat-time ${msg.remitente === 'yo' ? 'mio' : 'otro'}`}>
                        {formatTime(msg.fecha_envio)}
                        {msg.remitente === 'yo' && msg.leido && (
                          <i className="fas fa-check-double text-primary ms-1" title="Leído"></i>
                        )}
                        {msg.remitente === 'yo' && !msg.leido && (
                          <i className="fas fa-check text-muted ms-1" title="Enviado"></i>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="empty-messages">
                    <i className="fas fa-comment-slash fa-3x text-muted mb-3"></i>
                    <h5 className="text-muted">No hay mensajes aún</h5>
                    <p className="text-muted">Envía el primer mensaje para comenzar la conversación</p>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
              
              {/* FORMULARIO DE ENVÍO */}
              <div className="chat-input-area">
                <form onSubmit={handleSendMessage} className="chat-form">
                  <textarea
                    className="chat-input"
                    placeholder="Escribe tu mensaje aquí..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    rows="1"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                  />
                  <button type="submit" className="btn-send" disabled={!newMessage.trim()}>
                    <i className="fas fa-paper-plane"></i>
                  </button>
                </form>
                <div className="chat-input-hint">
                  <small className="text-muted">
                    Presiona Enter para enviar, Shift+Enter para nueva línea
                  </small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============ MODAL ELIMINAR CHAT ============ */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h5 className="modal-title">Eliminar Conversación</h5>
              <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
            </div>
            <div className="modal-body">
              <p>¿Estás seguro de que quieres eliminar esta conversación con <strong>{userDestino.username}</strong>?</p>
              <p className="text-muted small">Esta acción no se puede deshacer. Todos los mensajes se eliminarán.</p>
            </div>
            <div className="modal-footer">
              <button className="btn-modal-cancel" onClick={() => setShowDeleteModal(false)}>
                Cancelar
              </button>
              <button className="btn-modal-delete" onClick={handleDeleteChat}>
                Eliminar Conversación
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatDetail;