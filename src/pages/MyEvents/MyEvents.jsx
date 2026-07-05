/**
 * MyEvents.jsx - Mis Eventos
 * Muestra los eventos a los que el usuario está registrado
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyEvents } from '../../services/api';
import './MyEvents.css';

const MyEvents = () => {
    const navigate = useNavigate();
    
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cancelling, setCancelling] = useState(false);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    // Verificar autenticación
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    // Cargar eventos del usuario
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando eventos del usuario ${userId}`);
                const data = await getMyEvents(userId);
                setEvents(data);
                console.log('📅 Eventos cargados:', data);
                
            } catch (err) {
                console.error('❌ Error cargando eventos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            loadEvents();
        }
    }, [userId]);

    // Cancelar asistencia a evento
    const handleCancelAttendance = async (eventId, eventName) => {
        if (!window.confirm(`¿Estás seguro de que quieres cancelar tu asistencia al evento "${eventName}"?`)) {
            return;
        }
        
        try {
            setCancelling(true);
            
            // 🔄 Aquí iría la llamada a la API para cancelar asistencia
            // await cancelAttendance(user.id, eventId);
            
            // Simular cancelación (mientras no tengas el endpoint)
            setEvents(events.filter(e => e.evento_id !== eventId));
            alert('✅ Asistencia cancelada correctamente');
            
        } catch (err) {
            console.error('❌ Error cancelando asistencia:', err);
            alert('Error al cancelar la asistencia');
        } finally {
            setCancelling(false);
        }
    };

    // Formatear fecha
    const formatDate = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', { 
            day: '2-digit', 
            month: 'long', 
            year: 'numeric' 
        });
    };

    // Formatear hora
    const formatTime = (fecha) => {
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-CO', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    // Obtener texto de modalidad
    const getModalidadText = (modalidad) => {
        const modalidades = {
            'presencial': 'Presencial',
            'online': 'Online',
            'hibrida': 'Híbrida'
        };
        return modalidades[modalidad] || modalidad;
    };

    // Obtener clase de badge según estado
    const getBadgeClass = (asistio) => {
        return asistio ? 'badge-success' : 'badge-warning';
    };

    const getBadgeText = (asistio) => {
        return asistio ? '✅ Asistirás' : '⏳ Pendiente';
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando tus eventos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Error: {error}</div>
                <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="my-events-page">
            <div className="container">
                
                {/* Header */}
                <div className="my-events-header">
                    <div className="my-events-header-left">
                        <Link to="/" className="btn-back-home-events">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="my-events-title">📅 Mis Eventos</h1>
                    </div>
                    <Link to="/networking" className="btn-new-event">
                        🌐 Explorar Eventos
                    </Link>
                </div>

                {events.length > 0 ? (
                    <div className="events-grid">
                        {events.map(item => (
                            <div key={item.id} className="event-card">
                                <div className="event-card-body">
                                    
                                    <h5 className="event-title">{item.evento?.nombre || 'Evento'}</h5>
                                    
                                    <p className="event-description">
                                        {item.evento?.descripcion || 'Sin descripción'}
                                    </p>
                                    
                                    <div className="event-details">
                                        <div className="event-detail-item">
                                            <strong>📅 Fecha:</strong> {formatDate(item.evento?.fecha)}
                                        </div>
                                        <div className="event-detail-item">
                                            <strong>⏰ Hora:</strong> {formatTime(item.evento?.fecha)}
                                        </div>
                                        <div className="event-detail-item">
                                            <strong>📍 Modalidad:</strong> {getModalidadText(item.evento?.modalidad)}
                                        </div>
                                        <div className="event-detail-item">
                                            <strong>📍 Ubicación:</strong> {item.evento?.ubicacion || 'No especificada'}
                                        </div>
                                        <div className="event-detail-item">
                                            <strong>📌 Estado:</strong>
                                            <span className={`badge ${getBadgeClass(item.asistio)}`}>
                                                {getBadgeText(item.asistio)}
                                            </span>
                                        </div>
                                    </div>
                                    
                                    <div className="event-actions">
                                        <Link to={`/event/${item.evento?.id}`} className="btn-event-detail">
                                            Ver Detalles
                                        </Link>
                                        <button 
                                            className="btn-event-cancel"
                                            onClick={() => handleCancelAttendance(item.evento?.id, item.evento?.nombre)}
                                            disabled={cancelling}
                                        >
                                            Cancelar Asistencia
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-events">
                        <div className="empty-icon">📅</div>
                        <h4 className="empty-title">No estás registrado en ningún evento</h4>
                        <p className="empty-text">Explora los eventos disponibles y regístrate para participar</p>
                        <Link to="/networking" className="btn-explore-events">
                            Explorar Eventos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyEvents;