/**
 * ChangePassword.jsx - Cambiar Contraseña
 * CON API REAL
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { changePassword } from '../../services/api';
import './ChangePassword.css';

const ChangePassword = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        current_password: '',
        new_password: '',
        new_password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const [success, setSuccess] = useState(false);
    const [apiError, setApiError] = useState('');

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Verificar autenticación
    if (!user.id) {
        navigate('/login');
        return null;
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.current_password) {
            newErrors.current_password = 'La contraseña actual es obligatoria';
        }
        
        if (!formData.new_password) {
            newErrors.new_password = 'La nueva contraseña es obligatoria';
        } else if (formData.new_password.length < 6) {
            newErrors.new_password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (!formData.new_password_confirmation) {
            newErrors.new_password_confirmation = 'Confirma tu nueva contraseña';
        } else if (formData.new_password !== formData.new_password_confirmation) {
            newErrors.new_password_confirmation = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        setSuccess(false);
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            const data = {
                current_password: formData.current_password,
                new_password: formData.new_password,
                new_password_confirmation: formData.new_password_confirmation
            };
            
            console.log('📡 Cambiando contraseña para usuario:', user.id);
            
            const response = await changePassword(user.id, data);
            console.log('✅ Contraseña cambiada:', response);
            
            setSuccess(true);
            setFormData({
                current_password: '',
                new_password: '',
                new_password_confirmation: ''
            });
            
            setTimeout(() => {
                navigate('/profile');
            }, 2000);
            
        } catch (err) {
            console.error('❌ Error al cambiar contraseña:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setApiError(err.message || 'Error al cambiar la contraseña');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="change-password-page">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="password-card">
                            
                            <div className="password-header">
                                <h4 className="password-title">🔒 Cambiar Contraseña</h4>
                            </div>
                            
                            <div className="password-body">
                                
                                {success && (
                                    <div className="alert alert-success">
                                        ✅ Contraseña actualizada correctamente
                                    </div>
                                )}
                                
                                {apiError && (
                                    <div className="alert alert-danger">
                                        <i className="fas fa-exclamation-circle"></i> {apiError}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit}>
                                    
                                    {/* Contraseña actual */}
                                    <div className="form-group">
                                        <label className="form-label">Contraseña actual *</label>
                                        <input
                                            type="password"
                                            name="current_password"
                                            className={`form-control ${errors.current_password ? 'error' : ''}`}
                                            value={formData.current_password}
                                            onChange={handleChange}
                                            placeholder="Ingresa tu contraseña actual"
                                        />
                                        {errors.current_password && (
                                            <span className="error-text">{errors.current_password}</span>
                                        )}
                                    </div>

                                    {/* Nueva contraseña */}
                                    <div className="form-group">
                                        <label className="form-label">Nueva contraseña *</label>
                                        <input
                                            type="password"
                                            name="new_password"
                                            className={`form-control ${errors.new_password ? 'error' : ''}`}
                                            value={formData.new_password}
                                            onChange={handleChange}
                                            placeholder="Nueva contraseña (mínimo 6 caracteres)"
                                        />
                                        {errors.new_password && (
                                            <span className="error-text">{errors.new_password}</span>
                                        )}
                                        
                                        <div className="password-hint">
                                            <small>
                                                <strong>Requisitos:</strong><br />
                                                • Mínimo 6 caracteres<br />
                                                • No puede ser similar a tu información personal<br />
                                                • No puede ser una contraseña común<br />
                                                • No puede ser completamente numérica
                                            </small>
                                        </div>
                                    </div>

                                    {/* Confirmar nueva contraseña */}
                                    <div className="form-group">
                                        <label className="form-label">Confirmar nueva contraseña *</label>
                                        <input
                                            type="password"
                                            name="new_password_confirmation"
                                            className={`form-control ${errors.new_password_confirmation ? 'error' : ''}`}
                                            value={formData.new_password_confirmation}
                                            onChange={handleChange}
                                            placeholder="Confirma tu nueva contraseña"
                                        />
                                        {errors.new_password_confirmation && (
                                            <span className="error-text">{errors.new_password_confirmation}</span>
                                        )}
                                    </div>

                                    {/* Botones */}
                                    <div className="form-actions">
                                        <Link to="/profile" className="btn-cancel">
                                            ← Cancelar
                                        </Link>
                                        <button type="submit" className="btn-save" disabled={submitting}>
                                            {submitting ? 'Guardando...' : '💾 Cambiar Contraseña'}
                                        </button>
                                    </div>
                                </form>
                            </div>
                            
                            {/* Footer */}
                            <div className="password-footer">
                                <small>
                                    ¿Problemas con tu cuenta? <a href="#">Contactar soporte</a>
                                </small>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChangePassword;