/**
 * ChatList.jsx - Lista de Conversaciones (Chat)
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getConversations, getAvailableUsers } from '../../services/api';
import './ChatList.css';

const ChatList = () => {
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO, SIN CONDICIONES ANTES DE ELLOS
    // ============================================================
    const [conversations, setConversations] = useState([]);
    const [availableUsers, setAvailableUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showNewChatModal, setShowNewChatModal] = useState(false);

    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar conversaciones y usuarios disponibles (redirige dentro del efecto si no hay sesión)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar conversaciones del usuario
                const convData = await getConversations(user.id);
                setConversations(convData);
                console.log('💬 Conversaciones cargadas:', convData);
                
                // Cargar usuarios disponibles
                const usersData = await getAvailableUsers(user.id);
                setAvailableUsers(usersData);
                console.log('👥 Usuarios disponibles:', usersData);
                
            } catch (err) {
                console.error('❌ Error cargando datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user.id, navigate]);

    // Filtrar conversaciones por búsqueda
    const filteredConversations = conversations.filter(conv => {
        const search = searchTerm.toLowerCase();
        const otroUsuario = conv.otro_usuario?.full_name || conv.otro_usuario?.username || '';
        return otroUsuario.toLowerCase().includes(search);
    });

    // Filtrar usuarios disponibles
    const filteredAvailableUsers = availableUsers.filter(u => {
        const search = searchTerm.toLowerCase();
        const nombre = u.full_name || u.username || '';
        return nombre.toLowerCase().includes(search);
    });

    // Formatear fecha
    const formatTimeAgo = (fecha) => {
        if (!fecha) return 'Reciente';
        const date = new Date(fecha);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000);
        
        if (diff < 60) return 'Hace ' + diff + 's';
        if (diff < 3600) return 'Hace ' + Math.floor(diff / 60) + 'm';
        if (diff < 86400) return 'Hace ' + Math.floor(diff / 3600) + 'h';
        if (diff < 2592000) return 'Hace ' + Math.floor(diff / 86400) + 'd';
        return date.toLocaleDateString('es-CO');
    };

    // Obtener iniciales
    const getInitials = (user) => {
        if (!user) return 'U';
        if (user.full_name) {
            return user.full_name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
        }
        return user.username?.charAt(0).toUpperCase() || 'U';
    };

    // Iniciar chat con usuario
    const startChat = (userId) => {
        navigate(`/chat/${userId}`);
        setShowNewChatModal(false);
    };

    // ============================================================
    // ✅ RENDERIZADO (después de todos los Hooks)
    // ============================================================

    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="chat-list-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando conversaciones...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="chat-list-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="chat-list-page">
            <div className="container">
                
                {/* Header */}
                <div className="chat-header">
                    <div className="chat-header-left">
                        <Link to="/" className="btn-back-home">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
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

                {/* Buscador */}
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
                    
                    {/* Lista de conversaciones */}
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
                                            to={`/chat/${conv.otro_usuario?.id}`}
                                            className="conversation-item"
                                        >
                                            <div className="conversation-avatar">
                                                <span>{getInitials(conv.otro_usuario)}</span>
                                            </div>
                                            <div className="conversation-info">
                                                <div className="conversation-name-row">
                                                    <h6 className="conversation-name">
                                                        {conv.otro_usuario?.full_name || conv.otro_usuario?.username || 'Usuario'}
                                                    </h6>
                                                    {conv.mensajes_no_leidos > 0 && (
                                                        <span className="unread-badge">{conv.mensajes_no_leidos}</span>
                                                    )}
                                                </div>
                                                <small className="conversation-last-message">
                                                    {conv.ultimo_mensaje || 'No hay mensajes'}
                                                </small>
                                                <div className="conversation-meta">
                                                    <small className="text-muted">@{conv.otro_usuario?.username}</small>
                                                    <small className="text-muted">{formatTimeAgo(conv.ultima_actualizacion)}</small>
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

                        {/* Usuarios disponibles */}
                        <div className="users-card">
                            <div className="users-header">
                                <h6 className="users-title">Usuarios Disponibles</h6>
                            </div>
                            <div className="users-list">
                                {filteredAvailableUsers.length > 0 ? (
                                    filteredAvailableUsers.map(u => (
                                        <button
                                            key={u.id}
                                            className="user-item"
                                            onClick={() => startChat(u.id)}
                                        >
                                            <div className="user-avatar">
                                                <span>{getInitials(u)}</span>
                                            </div>
                                            <div className="user-info">
                                                <h6 className="user-name">{u.full_name || u.username}</h6>
                                                <small className="text-muted">@{u.username}</small>
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

                    {/* Área de chat vacía */}
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

            {/* Modal Nuevo Chat */}
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
                                    .filter(u => {
                                        const search = searchTerm.toLowerCase();
                                        const nombre = u.full_name || u.username || '';
                                        return nombre.toLowerCase().includes(search);
                                    })
                                    .map(u => (
                                        <button
                                            key={u.id}
                                            className="modal-user-item"
                                            onClick={() => startChat(u.id)}
                                        >
                                            <div className="modal-user-avatar">
                                                <span>{getInitials(u)}</span>
                                            </div>
                                            <div className="modal-user-info">
                                                <h6 className="modal-user-name">{u.full_name || u.username}</h6>
                                                <small className="text-muted">@{u.username}</small>
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