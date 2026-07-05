/**
 * Settings.jsx - Ajustes Generales
 * Página de configuración de la cuenta del usuario
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Settings.css';

const Settings = () => {
  const navigate = useNavigate();
  
  // ✅ HOOKS PRIMERO
  const [formData, setFormData] = useState({
    recibe_notificaciones: true,
    notificaciones_email: true,
    tema_preferido: 'claro',
    perfil_publico: true,
    mostrar_email: false,
    idioma: 'es',
    zona_horaria: 'colombia'
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
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  // Manejar reset
  const handleReset = () => {
    setFormData({
      recibe_notificaciones: true,
      notificaciones_email: true,
      tema_preferido: 'claro',
      perfil_publico: true,
      mostrar_email: false,
      idioma: 'es',
      zona_horaria: 'colombia'
    });
  };

  // Enviar formulario
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    
    setTimeout(() => {
      console.log('⚙️ Configuración guardada:', formData);
      setSuccess(true);
      setSubmitting(false);
      
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    }, 800);
  };

  return (
    <div className="settings-page">
      <div className="container">
        
        {/* ============ BOTÓN VOLVER ============ */}
        <div className="settings-back">
          <Link to="/" className="btn-back-home-settings">
            <i className="fas fa-arrow-left"></i> Volver al inicio
          </Link>
        </div>

        <div className="row">
          
          {/* ============ MENÚ LATERAL ============ */}
          <div className="col-md-3">
            <div className="settings-sidebar">
              <div className="sidebar-header">
                <h6 className="sidebar-title">⚙️ Ajustes</h6>
              </div>
              <div className="sidebar-menu">
                <Link to="/settings" className="menu-item active">
                  🔧 Generales
                </Link>
                <Link to="/settings/notifications" className="menu-item">
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
                <h4 className="settings-title">🔧 Configuración General</h4>
              </div>
              
              <div className="settings-body">
                
                {/* Mensaje de éxito */}
                {success && (
                  <div className="alert-success">
                    ✅ Configuración guardada correctamente
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  
                  {/* ============ NOTIFICACIONES ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">🔔 Notificaciones</h5>
                    
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="recibe_notificaciones"
                        name="recibe_notificaciones"
                        checked={formData.recibe_notificaciones}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="recibe_notificaciones">
                        Recibir notificaciones
                      </label>
                      <small className="form-text text-muted d-block">
                        Notificaciones sobre actividad en tus emprendimientos
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
                      <label className="form-check-label" htmlFor="notificaciones_email">
                        Notificaciones por correo
                      </label>
                      <small className="form-text text-muted d-block">
                        Recibir notificaciones en tu email
                      </small>
                    </div>
                  </div>

                  {/* ============ APARIENCIA ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">🎨 Apariencia</h5>
                    
                    <div className="form-group">
                      <label className="form-label">Tema de la plataforma</label>
                      <select
                        className="form-select"
                        name="tema_preferido"
                        value={formData.tema_preferido}
                        onChange={handleChange}
                      >
                        <option value="claro">🌞 Claro</option>
                        <option value="oscuro">🌙 Oscuro</option>
                        <option value="auto">⚡ Automático (seguir sistema)</option>
                      </select>
                      <small className="form-text text-muted">
                        Personaliza cómo se ve la plataforma
                      </small>
                    </div>
                  </div>

                  {/* ============ PRIVACIDAD ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">🛡️ Privacidad</h5>
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="perfil_publico"
                        name="perfil_publico"
                        checked={formData.perfil_publico}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="perfil_publico">
                        Perfil público
                      </label>
                      <small className="form-text text-muted d-block">
                        Permitir que otros usuarios vean tu perfil
                      </small>
                    </div>
                    
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="mostrar_email"
                        name="mostrar_email"
                        checked={formData.mostrar_email}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="mostrar_email">
                        Mostrar email en perfil
                      </label>
                      <small className="form-text text-muted d-block">
                        Mostrar tu email en tu perfil público
                      </small>
                    </div>
                  </div>

                  {/* ============ IDIOMA Y REGIÓN ============ */}
                  <div className="settings-section">
                    <h5 className="section-title">🌍 Idioma y Región</h5>
                    
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Idioma</label>
                          <select
                            className="form-select"
                            name="idioma"
                            value={formData.idioma}
                            onChange={handleChange}
                          >
                            <option value="es">🇪🇸 Español</option>
                            <option value="en">🇺🇸 Inglés</option>
                          </select>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label className="form-label">Zona horaria</label>
                          <select
                            className="form-select"
                            name="zona_horaria"
                            value={formData.zona_horaria}
                            onChange={handleChange}
                          >
                            <option value="colombia">🇨🇴 Colombia (GMT-5)</option>
                            <option value="mexico">🇲🇽 México (GMT-6)</option>
                            <option value="espana">🇪🇸 España (GMT+1)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* ============ BOTONES ============ */}
                  <div className="form-actions">
                    <Link to="/profile" className="btn-back-profile">
                      ← Volver al perfil
                    </Link>
                    
                    <div className="form-actions-right">
                      <button type="reset" className="btn-reset" onClick={handleReset}>
                        Restablecer
                      </button>
                      <button type="submit" className="btn-save" disabled={submitting}>
                        {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* ============ INFORMACIÓN DE CUENTA ============ */}
            <div className="account-info">
              <h6 className="account-info-title">📋 Información de tu cuenta</h6>
              <div className="account-info-grid">
                <div className="account-info-item">
                  <strong>Usuario:</strong> @{userData.username || 'usuario'}
                </div>
                <div className="account-info-item">
                  <strong>Email:</strong> {userData.email || 'usuario@email.com'}
                </div>
                <div className="account-info-item">
                  <strong>Miembro desde:</strong> 15/01/2024
                </div>
                <div className="account-info-item">
                  <strong>Último acceso:</strong> 20/01/2024 14:30
                </div>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
};

export default Settings;