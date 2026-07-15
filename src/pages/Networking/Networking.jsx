/**
 * Networking.jsx - Networking para Emprendedores
 * CON API REAL - CONFIRMAR ASISTENCIA
 */

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getEvents, confirmAttendance } from '../../services/api';
import './Networking.css';

const Networking = () => {
    const navigate = useNavigate();

    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO (sin returns antes de declararlos)
    // ============================================================
    const [events, setEvents] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState({});

    // Usuario logueado (se lee una sola vez)
    const [user] = useState(() => JSON.parse(localStorage.getItem('user') || '{}'));

    // ✅ Redirigir a /login como efecto, no como return anticipado
    // (un return antes de declarar los demás hooks rompe las reglas de hooks
    // de React: en el siguiente render el useEffect de abajo dejaría de
    // ejecutarse y events/loading/error/processing cambiarían de orden)
    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [user.id, navigate]);

    // Cargar eventos
    useEffect(() => {
        const loadEvents = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getEvents();
                setEvents(data);
                console.log('📅 Eventos cargados:', data);
            } catch (err) {
                console.error('❌ Error cargando eventos:', err);
                setError(err.message || 'No se pudieron cargar los eventos');
            } finally {
                setLoading(false);
            }
        };
        loadEvents();
    }, []);

    // ✅ CONFIRMAR ASISTENCIA
    const handleConfirmAttendance = useCallback(async (eventoId, modalidad, nombre) => {
        if (!user.id) {
            alert('Debes iniciar sesión para confirmar asistencia');
            navigate('/login');
            return;
        }

        // Marcar como procesando
        setProcessing(prev => ({ ...prev, [eventoId]: true }));

        try {
            const data = {
                usuario_id: user.id,
                evento_id: eventoId
            };

            console.log(`📡 Confirmando asistencia a: ${nombre}`);
            const response = await confirmAttendance(data);

            if (response) {
                alert(`✅ Asistencia confirmada para "${nombre}"`);

                // Actualizar estado local (marcar como asistido)
                setEvents(prev => prev.map(event =>
                    event.id === eventoId
                        ? { ...event, ya_asistio: true }
                        : event
                ));
            }
        } catch (err) {
            console.error('❌ Error:', err);
            if (err.message === 'Ya estás registrado en este evento') {
                alert('⚠️ Ya estás registrado en este evento');
                // Reflejar el estado real aunque la llamada haya fallado por duplicado
                setEvents(prev => prev.map(event =>
                    event.id === eventoId
                        ? { ...event, ya_asistio: true }
                        : event
                ));
            } else {
                alert('❌ Error al confirmar asistencia. Intenta nuevamente.');
            }
        } finally {
            setProcessing(prev => ({ ...prev, [eventoId]: false }));
        }
    }, [user.id, navigate]);

    // Formatear fecha
    const formatDate = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleDateString('es-CO', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatTime = (fecha) => {
        if (!fecha) return 'N/A';
        const date = new Date(fecha);
        return date.toLocaleTimeString('es-CO', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Obtener clase de color para el header
    const getHeaderClass = (color) => {
        const classes = {
            'primary': 'header-primary',
            'success': 'header-success',
            'info': 'header-info'
        };
        return classes[color] || 'header-primary';
    };

    // Obtener estilo de botón según modalidad del evento
    const getButtonClass = (modalidad) => {
        return modalidad === 'online' ? 'btn-online' : 'btn-presencial';
    };

    const getButtonText = (modalidad) => {
        return modalidad === 'online' ? '🎯 Unirse Online' : '✅ Confirmar Asistencia';
    };

    // ============================================================
    // ✅ RENDER CONDICIONAL (después de declarar todos los hooks)
    // ============================================================
    if (!user.id) {
        // Se está redirigiendo en el useEffect de arriba
        return null;
    }

    if (loading) {
        return (
            <div className="networking-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando eventos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="networking-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="networking-page">
            <div className="container">

                {/* Header */}
                <div className="networking-header">
                    <div className="networking-header-left">
                        <Link to="/" className="btn-back-home-networking">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="networking-title">🌐 Networking</h1>
                    </div>
                </div>

                {/* Sección Comunidad */}
                <div className="community-section">
                    <div className="community-content">
                        <h2 className="community-title">Únete a Nuestra Comunidad</h2>
                        <p className="community-text">
                            Más de <strong>2,000 emprendedores</strong> conectados
                        </p>
                        <div className="community-buttons">
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn-social btn-facebook">
                                <i className="fab fa-facebook-f me-2"></i> Facebook
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-social btn-instagram">
                                <i className="fab fa-instagram me-2"></i> Instagram
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="btn-social btn-twitter">
                                <i className="fab fa-twitter me-2"></i> Twitter
                            </a>
                        </div>
                    </div>
                </div>

                {/* Eventos */}
                {events.length === 0 ? (
                    <p className="networking-status">No hay eventos disponibles por el momento.</p>
                ) : (
                    <div className="events-grid">
                        {events.map(event => (
                            <div key={event.id} className="event-card">
                                <div className={`event-header ${getHeaderClass(event.color || 'primary')}`}>
                                    <h4 className="event-name">{event.nombre}</h4>
                                    {event.badge && (
                                        <span className="event-badge">{event.badge}</span>
                                    )}
                                </div>
                                <div className="event-body">
                                    <div className="event-date">
                                        <strong>📅 Fecha:</strong> {formatDate(event.fecha)}
                                    </div>
                                    <div className="event-time">
                                        <strong>⏰ Hora:</strong> {formatTime(event.fecha)}
                                    </div>
                                    <div className="event-location">
                                        <strong>📍 Lugar:</strong>{' '}
                                        {event.modalidad === 'online'
                                            ? `Virtual (${event.enlace_online || 'Plataforma Zoom'})`
                                            : event.ubicacion}
                                    </div>
                                    {event.descripcion && (
                                        <p className="event-description">{event.descripcion}</p>
                                    )}
                                </div>
                                <div className="event-footer">
                                    <button
                                        className={`btn-event ${getButtonClass(event.modalidad)}`}
                                        onClick={() => handleConfirmAttendance(event.id, event.modalidad, event.nombre)}
                                        disabled={processing[event.id] || event.ya_asistio}
                                    >
                                        {processing[event.id] ? (
                                            <>
                                                <i className="fas fa-spinner fa-spin"></i> Procesando...
                                            </>
                                        ) : event.ya_asistio ? (
                                            '✅ Ya confirmado'
                                        ) : (
                                            getButtonText(event.modalidad)
                                        )}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Red de Contactos */}
                <div className="contacts-section">
                    <div className="contacts-card">
                        <div className="contacts-header">
                            <h4 className="contacts-title">🤝 Red de Contactos</h4>
                        </div>
                        <div className="contacts-body">
                            <h5 className="contacts-subtitle">Conecta con otros Emprendedores</h5>
                            <p className="contacts-text">
                                Expande tu red profesional y encuentra colaboradores.
                            </p>
                            <div className="contacts-grid">
                                <button className="btn-contact btn-contact-primary" onClick={() => alert('💬 Función de conexión próximamente')}>
                                    👤 Conectar con María Pérez
                                </button>
                                <button className="btn-contact btn-contact-success" onClick={() => alert('💬 Función de conexión próximamente')}>
                                    👤 Conectar con Carlos López
                                </button>
                                <button className="btn-contact btn-contact-info" onClick={() => alert('💬 Función de conexión próximamente')}>
                                    👤 Conectar con Ana García
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Networking;