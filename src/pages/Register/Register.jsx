/**
 * Register.jsx - Página de registro de usuarios
 * CON API REAL
 */

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../services/api';
import './Register.css';
import logo from '../../assets/logo.png';

const Register = () => {
    const navigate = useNavigate();
    
    const [formData, setFormData] = useState({
        username: '',
        full_name: '',
        email: '',
        password: '',
        password_confirmation: ''
    });
    
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.username.trim()) {
            newErrors.username = 'Usuario es obligatorio';
        } else if (formData.username.length < 3) {
            newErrors.username = 'El usuario debe tener al menos 3 caracteres';
        }
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'Nombre completo es obligatorio';
        }
        
        if (!formData.email.trim()) {
            newErrors.email = 'Email es obligatorio';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email inválido';
        }
        
        if (!formData.password) {
            newErrors.password = 'Contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (formData.password !== formData.password_confirmation) {
            newErrors.password_confirmation = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setApiError('');
        
        if (!validateForm()) {
            return;
        }
        
        setLoading(true);

        try {
            console.log('📡 Intentando registro:', { 
                username: formData.username, 
                email: formData.email 
            });
            
            const response = await register({
                username: formData.username,
                full_name: formData.full_name,
                email: formData.email,
                password: formData.password,
            });
            
            console.log('✅ Registro exitoso:', response);
            
            // Guardar usuario en localStorage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('user', JSON.stringify(response.user));
            
            alert('✅ ¡Registro exitoso! Bienvenido a la plataforma');
            navigate('/profile');
            
        } catch (err) {
            console.error('❌ Error en registro:', err);
            
            // Manejar errores de validación de Laravel
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setApiError(err.message || 'Error al registrar usuario');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <Link to="/">
                        <img src={logo} alt="Plataforma" />
                    </Link>
                </div>
                
                <h1 className="auth-title">Crear Cuenta</h1>
                <p className="auth-subtitle">Únete a nuestra comunidad</p>
                
                {apiError && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {apiError}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    {/* Usuario */}
                    <div className="form-group">
                        <label htmlFor="username">Usuario *</label>
                        <input 
                            type="text" 
                            id="username" 
                            name="username"
                            placeholder="emprendedor" 
                            value={formData.username}
                            onChange={handleChange}
                            className={errors.username ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.username && <span className="error-text">{errors.username}</span>}
                    </div>
                    
                    {/* Nombre completo */}
                    <div className="form-group">
                        <label htmlFor="full_name">Nombre completo *</label>
                        <input 
                            type="text" 
                            id="full_name" 
                            name="full_name"
                            placeholder="Carlos Emprendedor" 
                            value={formData.full_name}
                            onChange={handleChange}
                            className={errors.full_name ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                    </div>
                    
                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico *</label>
                        <input 
                            type="email" 
                            id="email" 
                            name="email"
                            placeholder="tu@email.com" 
                            value={formData.email}
                            onChange={handleChange}
                            className={errors.email ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.email && <span className="error-text">{errors.email}</span>}
                    </div>
                    
                    {/* Contraseña */}
                    <div className="form-group">
                        <label htmlFor="password">Contraseña *</label>
                        <input 
                            type="password" 
                            id="password" 
                            name="password"
                            placeholder="Mínimo 6 caracteres" 
                            value={formData.password}
                            onChange={handleChange}
                            className={errors.password ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.password && <span className="error-text">{errors.password}</span>}
                    </div>
                    
                    {/* Confirmar contraseña */}
                    <div className="form-group">
                        <label htmlFor="password_confirmation">Confirmar contraseña *</label>
                        <input 
                            type="password" 
                            id="password_confirmation" 
                            name="password_confirmation"
                            placeholder="Repite tu contraseña" 
                            value={formData.password_confirmation}
                            onChange={handleChange}
                            className={errors.password_confirmation ? 'error' : ''}
                            disabled={loading}
                        />
                        {errors.password_confirmation && <span className="error-text">{errors.password_confirmation}</span>}
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Registrando...
                            </>
                        ) : (
                            'Registrarse'
                        )}
                    </button>
                </form>
                
                <div className="auth-footer">
                    ¿Ya tienes cuenta? <Link to="/login">Inicia sesión aquí</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;