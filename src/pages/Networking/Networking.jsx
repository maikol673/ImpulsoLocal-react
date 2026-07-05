/**
 * Networking.jsx - Networking para Emprendedores
 * Muestra eventos de networking y comunidad
 * SIN API - SIN useEffect - Datos directos
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Networking.css';

const Networking = () => {
  const navigate = useNavigate();
  
  // ✅ Verificar login
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  // const userData = JSON.parse(localStorage.getItem('user') || '{}');  // ← ELIMINADO - no se usa

  // ✅ Datos FIJOS - Eventos
  const events = [
    {
      id: 1,
      nombre: 'Networking Emprendedores Bogotá',
      fecha: '2024-02-15T18:00:00',
      hora: '18:00',
      tipo: 'presencial',
      ubicacion: 'Centro de Convenciones, Bogotá',
      descripcion: 'Únete al evento de networking más grande de Bogotá. Conecta con otros emprendedores, inversores y mentores.',
      asistentes: 150,
      badge: '150+ Asistentes!',
      color: 'primary'
    },
    {
      id: 2,
      nombre: 'Feria de Emprendimiento Medellín',
      fecha: '2024-03-01T09:00:00',
      hora: '09:00',
      tipo: 'presencial',
      ubicacion: 'Plaza Mayor, Medellín',
      descripcion: 'Exposición de emprendimientos locales. Oportunidad para mostrar tus productos y hacer contactos comerciales.',
      asistentes: 80,
      badge: null,
      color: 'success'
    },
    {
      id: 3,
      nombre: 'Webinar: Finanzas para Emprendedores',
      fecha: '2024-02-20T10:00:00',
      hora: '10:00',
      tipo: 'online',
      ubicacion: 'Plataforma Zoom',
      descripcion: 'Aprende a manejar las finanzas de tu emprendimiento con expertos en el tema.',
      asistentes: 200,
      badge: '¡Online!',
      color: 'info'
    }
  ];

  // ✅ Datos FIJOS - Usuarios para conectar
  const users = [
    { id: 2, username: 'maria_perez', full_name: 'María Pérez' },
    { id: 3, username: 'carlos_lopez', full_name: 'Carlos López' },
    { id: 4, username: 'ana_garcia', full_name: 'Ana García' },
    { id: 5, username: 'juan_rodriguez', full_name: 'Juan Rodríguez' }
  ];

  // Formatear fecha
  const formatDate = (fecha) => {
    const date = new Date(fecha);
    return date.toLocaleDateString('es-CO', { 
      day: '2-digit', 
      month: 'long', 
      year: 'numeric' 
    });
  };

  const formatTime = (fecha) => {
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

  // Obtener clase de badge
  const getBadgeClass = (color) => {
    const classes = {
      'primary': 'badge-warning',
      'success': 'badge-warning',
      'info': 'badge-warning'
    };
    return classes[color] || 'badge-warning';
  };

  // Obtener estilo de botón según tipo de evento
  const getButtonClass = (tipo) => {
    return tipo === 'online' ? 'btn-online' : 'btn-presencial';
  };

  const getButtonText = (tipo) => {
    return tipo === 'online' ? '🎯 Unirse Online' : '✅ Confirmar Asistencia';
  };

  return (
    <div className="networking-page">
      <div className="container">
        
        {/* ============ HEADER CON BOTÓN VOLVER ============ */}
        <div className="networking-header">
          <div className="networking-header-left">
            <Link to="/" className="btn-back-home-networking">
              <i className="fas fa-arrow-left"></i> Volver al inicio
            </Link>
            <h1 className="networking-title">Networking</h1>
          </div>
        </div>

        {/* ============ SECCIÓN COMUNIDAD ============ */}
        <div className="community-section">
          <div className="community-content">
            <h2 className="community-title">Únete a Nuestra Comunidad</h2>
            <p className="community-text">
              Más de <strong>2,000 emprendedores</strong> conectados
            </p>
            
            <div className="community-buttons">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-social btn-facebook"
              >
                <i className="fab fa-facebook-f me-2"></i>
                Facebook
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-social btn-instagram"
              >
                <i className="fab fa-instagram me-2"></i>
                Instagram
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="btn-social btn-twitter"
              >
                <i className="fab fa-twitter me-2"></i>
                Twitter
              </a>
            </div>
          </div>
        </div>

        {/* ============ EVENTOS ============ */}
        <div className="events-grid">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              
              {/* Header del evento */}
              <div className={`event-header ${getHeaderClass(event.color)}`}>
                <h4 className="event-name">{event.nombre}</h4>
                {event.badge && (
                  <span className={`event-badge ${getBadgeClass(event.color)}`}>
                    {event.badge}
                  </span>
                )}
              </div>
              
              <div className="event-body">
                <div className="event-date">
                  <strong>Fecha:</strong> {formatDate(event.fecha)}
                </div>
                <div className="event-time">
                  <strong>Hora:</strong> {formatTime(event.fecha)}
                </div>
                <div className="event-location">
                  <strong>Lugar:</strong>{' '}
                  {event.tipo === 'online' 
                    ? `Virtual (${event.ubicacion})` 
                    : event.ubicacion}
                </div>
                <p className="event-description">{event.descripcion}</p>
              </div>
              
              <div className="event-footer">
                {isLoggedIn ? (
                  <button className={`btn-event ${getButtonClass(event.tipo)}`}>
                    {getButtonText(event.tipo)}
                  </button>
                ) : (
                  <button 
                    className="btn-event-login"
                    onClick={() => navigate('/login')}
                  >
                    Iniciar sesión para participar
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ============ RED DE CONTACTOS ============ */}
        {isLoggedIn && (
          <div className="contacts-section">
            <div className="contacts-card">
              <div className="contacts-header">
                <h4 className="contacts-title">Red de Contactos</h4>
              </div>
              <div className="contacts-body">
                <h5 className="contacts-subtitle">Conecta con otros Emprendedores</h5>
                <p className="contacts-text">
                  Expande tu red profesional y encuentra colaboradores.
                </p>
                <div className="contacts-grid">
                  {users.slice(0, 3).map((user, index) => (
                    <button 
                      key={user.id}
                      className={`btn-contact ${index === 0 ? 'btn-contact-primary' : index === 1 ? 'btn-contact-success' : 'btn-contact-info'}`}
                      onClick={() => alert(`💬 Conectando con ${user.full_name || user.username}`)}
                    >
                      👤 Conectar con {user.full_name || user.username}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
};

export default Networking;