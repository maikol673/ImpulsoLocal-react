/**
 * ChatDetail.jsx - Detalle de Conversación (Chat)
 * CON API REAL
 */

import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMessages, sendMessage, getConversations, markMessagesAsRead, BASE_URL } from '../../services/api';
import './ChatDetail.css';

const ChatDetail = () => {
    const { id } = useParams(); // ID del usuario destino
    const navigate = useNavigate();
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userDestino, setUserDestino] = useState(null);
    const [conversationId, setConversationId] = useState(null);
    const [availableUsers, setAvailableUsers] = useState([]);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar conversaciones y usuarios disponibles (redirige dentro del efecto si no hay sesión)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                const [convData, usersData] = await Promise.all([
                    getConversations(user.id),
                    fetch(`${BASE_URL}/api/usuarios/disponibles/${user.id}`).then(res => res.json())
                ]);
                
                setAvailableUsers(usersData);
                
                // Buscar si ya existe conversación con este usuario
                const existingConv = convData.find(c => 
                    c.otro_usuario?.id === parseInt(id)
                );
                
                if (existingConv) {
                    setConversationId(existingConv.id);
                    setUserDestino(existingConv.otro_usuario);
                } else {
                    // Si no existe, obtener datos del usuario destino
                    const userData = await fetch(`${BASE_URL}/api/usuarios/${id}`).then(res => res.json());
                    setUserDestino(userData);
                    setConversationId(null);
                }
            } catch (err) {
                console.error('Error cargando datos:', err);
                setError(err.message || 'Error al cargar la conversación');
            }
        };
        
        loadData();
    }, [id, user.id, navigate]);

    // Cargar mensajes
    useEffect(() => {
        const loadMessages = async () => {
            if (!conversationId) {
                setLoading(false);
                return;
            }
            
            try {
                setLoading(true);
                setError(null);
                const data = await getMessages(conversationId);
                setMessages(data);
                
                // Marcar mensajes como leídos
                await markMessagesAsRead(conversationId, user.id);
                
            } catch (err) {
                console.error('Error cargando mensajes:', err);
                setError(err.message || 'Error al cargar los mensajes');
            } finally {
                setLoading(false);
            }
        };
        
        loadMessages();
    }, [conversationId, user.id]);

    // Scroll al final cuando hay nuevos mensajes
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    // Auto-refresh cada 5 segundos
    useEffect(() => {
        if (!conversationId) return;
        
        const interval = setInterval(() => {
            const loadMessages = async () => {
                try {
                    const data = await getMessages(conversationId);
                    setMessages(data);
                } catch (err) {
                    console.error('Error refrescando mensajes:', err);
                }
            };
            loadMessages();
        }, 5000);
        
        return () => clearInterval(interval);
    }, [conversationId]);

    // Obtener iniciales
    const getInitials = (user) => {
        if (!user) return 'U';
        if (user.full_name) {
            return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return user.username?.charAt(0).toUpperCase() || 'U';
    };

    // Formatear hora
    const formatTime = (fecha) => {
        if (!fecha) return '';
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' });
    };

    // Enviar mensaje
    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;
        
        setSending(true);
        
        try {
            const data = {
                remitente_id: user.id,
                receptor_id: parseInt(id),
                contenido: newMessage.trim(),
                conversacion_id: conversationId
            };
            
            const response = await sendMessage(data);
            
            // Si no había conversación, actualizar el ID
            if (!conversationId && response.conversacion_id) {
                setConversationId(response.conversacion_id);
            }
            
            // Agregar mensaje a la lista
            setMessages(prev => [...prev, {
                id: response.id || Date.now(),
                remitente_id: user.id,
                contenido: newMessage.trim(),
                created_at: new Date().toISOString(),
                leido: false
            }]);
            
            setNewMessage('');
            
        } catch (err) {
            console.error('Error enviando mensaje:', err);
            alert('Error al enviar el mensaje');
        } finally {
            setSending(false);
            if (inputRef.current) {
                inputRef.current.focus();
            }
        }
    };

    // Eliminar conversación
    const handleDeleteChat = async () => {
        try {
            await fetch(`${BASE_URL}/api/conversaciones/${conversationId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                }
            });
            navigate('/chat');
        } catch (err) {
            console.error('Error eliminando conversación:', err);
            alert('Error al eliminar la conversación');
        }
        setShowDeleteModal(false);
    };

    // Obtener clase del mensaje
    const getMessageClass = (remitenteId) => {
        return remitenteId === user.id ? 'mio' : 'otro';
    };

    // ============================================================
    // ✅ RENDERIZADO (después de todos los Hooks)
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="chat-detail-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando conversación...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-detail-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/chat" className="btn btn-secondary">← Volver a Mensajes</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-detail-page">
            <div className="container">
                <div className="chat-detail-grid">
                    
                    {/* SIDEBAR - LISTA DE USUARIOS */}
                    <div className="chat-users-column">
                        <div className="chat-users-card">
                            <div className="chat-users-header">
                                <h6 className="chat-users-title">Conversaciones</h6>
                                <span className="chat-users-badge">{availableUsers.length}</span>
                            </div>
                            <div className="chat-users-list">
                                {availableUsers.map(u => (
                                    <Link
                                        key={u.id}
                                        to={`/chat/${u.id}`}
                                        className={`user-item ${u.id === parseInt(id) ? 'active' : ''}`}
                                    >
                                        <div className={`user-avatar ${u.id === parseInt(id) ? 'avatar-active' : ''}`}>
                                            <span>{getInitials(u)}</span>
                                        </div>
                                        <div className="user-info">
                                            <h6 className="user-name">{u.full_name || u.username}</h6>
                                            <small className="user-username">@{u.username}</small>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ÁREA DE CHAT */}
                    <div className="chat-area">
                        <div className="chat-card">
                            
                            {/* HEADER DEL CHAT */}
                            <div className="chat-card-header">
                                <div className="chat-header-info">
                                    <Link to="/chat" className="btn-back-chat" title="Volver al chat">
                                        <i className="fas fa-arrow-left"></i>
                                    </Link>
                                    <div className="chat-user-avatar">
                                        <span>{userDestino ? getInitials(userDestino) : 'U'}</span>
                                    </div>
                                    <div className="chat-user-info">
                                        <h6 className="chat-user-name">
                                            {userDestino?.full_name || userDestino?.username || 'Usuario'}
                                        </h6>
                                        <small className="chat-user-username">
                                            @{userDestino?.username || 'usuario'}
                                        </small>
                                    </div>
                                </div>
                                <button 
                                    className="btn-delete-chat"
                                    onClick={() => setShowDeleteModal(true)}
                                    title="Eliminar conversación"
                                    disabled={!conversationId}
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
                                            className={`chat-message ${getMessageClass(msg.remitente_id)}`}
                                        >
                                            <div className={`chat-bubble ${getMessageClass(msg.remitente_id)}`}>
                                                {msg.contenido}
                                            </div>
                                            <div className={`chat-time ${getMessageClass(msg.remitente_id)}`}>
                                                {formatTime(msg.created_at)}
                                                {msg.remitente_id === user.id && msg.leido && (
                                                    <i className="fas fa-check-double text-primary ms-1" title="Leído"></i>
                                                )}
                                                {msg.remitente_id === user.id && !msg.leido && (
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
                                        ref={inputRef}
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
                                        disabled={sending}
                                    />
                                    <button type="submit" className="btn-send" disabled={!newMessage.trim() || sending}>
                                        {sending ? (
                                            <i className="fas fa-spinner fa-spin"></i>
                                        ) : (
                                            <i className="fas fa-paper-plane"></i>
                                        )}
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

            {/* MODAL ELIMINAR CHAT */}
            {showDeleteModal && (
                <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h5 className="modal-title">Eliminar Conversación</h5>
                            <button className="modal-close" onClick={() => setShowDeleteModal(false)}>×</button>
                        </div>
                        <div className="modal-body">
                            <p>¿Estás seguro de que quieres eliminar esta conversación con <strong>{userDestino?.username}</strong>?</p>
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