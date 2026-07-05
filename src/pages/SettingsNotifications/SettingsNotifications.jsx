/**
 * SettingsNotifications.jsx - Ajustes de Notificaciones
 * Página de configuración de notificaciones del usuario
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './SettingsNotifications.css';

const SettingsNotifications = () => {
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [formData, setFormData] = useState({
    recibe_notificaciones: true,
    notificaciones_email: true,
    nuevos_seguidores: true,
    nuevos_me_gusta: true,
    nuevos_comentarios: true,
    nuevas_ordenes: true,
    promociones: false,
    actualizaciones_sistema: true,
    frecuencia_email: 'inmediato',
    horario_notificaciones: 'siempre',
    tipo_alerta: 'silenciosa'
  });

  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  const userData = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (!isLoggedIn) {
    navigate('/login');
    return null;
  }

  // Manejar cambios en inputs
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: checked }));
    } else if (type === 'radio') {
      setFormData(prev => ({ ...prev, [name]: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejar reset
  const handleReset = () => {
    setFormData({
      recibe_notificaciones: true,
      notificaciones_email: true,
      nuevos_seguidores: true,
      nuevos_me_gusta: true,
      nuevos_comentarios: true,
      nuevas_ordenes: true,
      promociones: false,
      actualizaciones_sistema: true,
      frecuencia_email: 'inmediato',
      horario_notificaciones: 'siempre',
      tipo_alerta: 'silenciosa'
    });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      console.log('🔔 Preferencias de notificaciones guardadas:', formData);
      setSuccess(true);
      setSubmitting(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="settings-notifications-page">
      <div className="container">
        <div className="row">
          
          {/* ============ MENÚ LATERAL ============ */}
          <div className="col-md-3">
            <div className="settings-sidebar">
              <div className="sidebar-header">
                <h6 className="sidebar-title">⚙️ Ajustes</h6>
              </div>
              <div className="sidebar-menu">
                <Link to="/settings" className="menu-item">
                  🔧 Generales
                </Link>
                <Link to="/settings/notifications" className="menu-item active">
                  🔔 Notificaciones
                </Link>
                <Link to="/edit-profile" className="menu-item">
                  👤 Perfil
                </Link>
                <Link to="/change-password" className="menu-item">
                  🔒 Seguridad
                </Link>
                <Link to="/my-ventures" className="menu-item">
                  🏪 Mis Emprendimientos
                </Link>
              </div>
            </div>
          </div>

          {/* ============ CONTENIDO PRINCIPAL ============ */}
          <div className="col-md-9">
            <div className="settings-card">
              
              <div className="settings-header">
                <h4 className="settings-title">🔔 Gestión de Notificaciones</h4>
              </div>
              
              <div className="settings-body">
                
                {/* Mensaje de éxito */}
                {success && (
                  <div className="alert-success">
                    ✅ Preferencias de notificaciones guardadas correctamente
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* ============ ESTADO GENERAL ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">📱 Estado de Notificaciones</h5>
                    
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="recibe_notificaciones"
                        name="recibe_notificaciones"
                        checked={formData.recibe_notificaciones}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-bold" htmlFor="recibe_notificaciones">
                        Activar notificaciones
                      </label>
                      <small className="form-text text-muted d-block">
                        Activa o desactiva todas las notificaciones del sistema
                      </small>
                    </div>
                    
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="notificaciones_email"
                        name="notificaciones_email"
                        checked={formData.notificaciones_email}
                        onChange={handleChange}
                      />
                      <label className="form-check-label fw-bold" htmlFor="notificaciones_email">
                        Notificaciones por correo electrónico
                      </label>
                      <small className="form-text text-muted d-block">
                        Recibir notificaciones en tu email: {userData.email || 'usuario@email.com'}
                      </small>
                    </div>
                  </div>

                  {/* ============ TIPOS DE NOTIFICACIONES ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">📬 Tipos de Notificaciones</h5>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nuevos_seguidores"
                            name="nuevos_seguidores"
                            checked={formData.nuevos_seguidores}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="nuevos_seguidores">
                            👥 Nuevos seguidores
                          </label>
                          <small className="form-text text-muted d-block">
                            Cuando alguien sigue tus emprendimientos
                          </small>
                        </div>
                        
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nuevos_me_gusta"
                            name="nuevos_me_gusta"
                            checked={formData.nuevos_me_gusta}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="nuevos_me_gusta">
                            ❤️ Nuevos "Me gusta"
                          </label>
                          <small className="form-text text-muted d-block">
                            Cuando a alguien le gusta tu emprendimiento
                          </small>
                        </div>
                        
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nuevos_comentarios"
                            name="nuevos_comentarios"
                            checked={formData.nuevos_comentarios}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="nuevos_comentarios">
                            💬 Nuevos comentarios
                          </label>
                          <small className="form-text text-muted d-block">
                            Cuando alguien comenta en tus productos
                          </small>
                        </div>
                      </div>
                      
                      <div className="col-md-6">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="nuevas_ordenes"
                            name="nuevas_ordenes"
                            checked={formData.nuevas_ordenes}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="nuevas_ordenes">
                            📦 Nuevas órdenes
                          </label>
                          <small className="form-text text-muted d-block">
                            Cuando alguien compra tus productos
                          </small>
                        </div>
                        
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="promociones"
                            name="promociones"
                            checked={formData.promociones}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="promociones">
                            🎉 Promociones y ofertas
                          </label>
                          <small className="form-text text-muted d-block">
                            Ofertas especiales y novedades de la plataforma
                          </small>
                        </div>
                        
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id="actualizaciones_sistema"
                            name="actualizaciones_sistema"
                            checked={formData.actualizaciones_sistema}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="actualizaciones_sistema">
                            🔄 Actualizaciones del sistema
                          </label>
                          <small className="form-text text-muted d-block">
                            Novedades y mejoras en la plataforma
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============ FRECUENCIA ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">⏰ Frecuencia</h5>
                    
                    <div className="form-group">
                      <label className="form-label fw-bold">Frecuencia de notificaciones por email</label>
                      <select
                        className="form-select"
                        name="frecuencia_email"
                        value={formData.frecuencia_email}
                        onChange={handleChange}
                      >
                        <option value="inmediato">📩 Inmediato (en tiempo real)</option>
                        <option value="diario">📅 Resumen diario</option>
                        <option value="semanal">🗓️ Resumen semanal</option>
                      </select>
                      <small className="form-text text-muted">
                        Controla con qué frecuencia recibes notificaciones por email
                      </small>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label fw-bold">Horario de notificaciones</label>
                      <select
                        className="form-select"
                        name="horario_notificaciones"
                        value={formData.horario_notificaciones}
                        onChange={handleChange}
                      >
                        <option value="siempre">🌞 Siempre activas</option>
                        <option value="diurno">☀️ Solo horario diurno (8:00 - 20:00)</option>
                        <option value="personalizado">⏰ Horario personalizado</option>
                      </select>
                      <small className="form-text text-muted">
                        Define cuándo quieres recibir notificaciones
                      </small>
                    </div>
                  </div>

                  {/* ============ TIPO DE ALERTA ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">🔊 Tipo de Alerta</h5>
                    
                    <div className="row">
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_alerta"
                            id="alerta_silenciosa"
                            value="silenciosa"
                            checked={formData.tipo_alerta === 'silenciosa'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="alerta_silenciosa">
                            🔇 Silenciosa
                          </label>
                          <small className="form-text text-muted d-block">
                            Solo notificaciones visuales
                          </small>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_alerta"
                            id="alerta_sonido"
                            value="sonido"
                            checked={formData.tipo_alerta === 'sonido'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="alerta_sonido">
                            🔊 Con sonido
                          </label>
                          <small className="form-text text-muted d-block">
                            Notificaciones con sonido
                          </small>
                        </div>
                      </div>
                      
                      <div className="col-md-4">
                        <div className="form-check">
                          <input
                            className="form-check-input"
                            type="radio"
                            name="tipo_alerta"
                            id="alerta_vibracion"
                            value="vibracion"
                            checked={formData.tipo_alerta === 'vibracion'}
                            onChange={handleChange}
                          />
                          <label className="form-check-label" htmlFor="alerta_vibracion">
                            📳 Con vibración
                          </label>
                          <small className="form-text text-muted d-block">
                            Notificaciones con vibración (móvil)
                          </small>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============ BOTONES ============ */}
                  <div className="form-actions">
                    <Link to="/settings" className="btn-back-settings">
                      ← Volver a Ajustes
                    </Link>
                    
                    <div className="form-actions-right">
                      <button type="reset" className="btn-reset" onClick={handleReset}>
                        Restablecer
                      </button>
                      <button type="submit" className="btn-save" disabled={submitting}>
                        {submitting ? 'Guardando...' : '💾 Guardar Preferencias'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* ============ PANEL DE AYUDA ============ */}
            <div className="help-card">
              <div className="help-header">
                <h6 className="help-title">❓ Ayuda sobre Notificaciones</h6>
              </div>
              <div className="help-body">
                
                <div className="help-item">
                  <button className="help-question" onClick={(e) => {
                    const answer = e.target.closest('.help-item').querySelector('.help-answer');
                    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                  }}>
                    ¿Qué tipos de notificaciones puedo recibir?
                  </button>
                  <div className="help-answer">
                    Puedes recibir notificaciones sobre: nuevos seguidores, likes en tus emprendimientos, 
                    comentarios en productos, nuevas órdenes, promociones y actualizaciones del sistema.
                  </div>
                </div>
                
                <div className="help-item">
                  <button className="help-question" onClick={(e) => {
                    const answer = e.target.closest('.help-item').querySelector('.help-answer');
                    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                  }}>
                    ¿Cómo funcionan las notificaciones por email?
                  </button>
                  <div className="help-answer">
                    Las notificaciones por email se envían a tu dirección registrada 
                    (<strong>{userData.email || 'usuario@email.com'}</strong>). Puedes elegir recibirlas en tiempo real, 
                    en resumen diario o semanal.
                  </div>
                </div>
                
                <div className="help-item">
                  <button className="help-question" onClick={(e) => {
                    const answer = e.target.closest('.help-item').querySelector('.help-answer');
                    answer.style.display = answer.style.display === 'block' ? 'none' : 'block';
                  }}>
                    ¿Puedo desactivar todas las notificaciones?
                  </button>
                  <div className="help-answer">
                    Sí, desmarca la opción "Activar notificaciones" para desactivar 
                    todas las notificaciones del sistema. Aún así, recibirás notificaciones 
                    críticas del sistema.
                  </div>
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default SettingsNotifications;