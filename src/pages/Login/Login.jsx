/**
 * Login.jsx - Página de inicio de sesión
 * CON API REAL 
 */

import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { login } from '../../services/api';
import './Login.css';
import logo from '../../assets/logo.png';

const Login = () => {
    const navigate = useNavigate();
    const isMounted = useRef(true);
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    // ✅ LIMPIAR AL DESMONTAR
    React.useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        if (!email || !password) {
            setError('Por favor ingresa email y contraseña');
            setLoading(false);
            return;
        }

        try {
            console.log('📡 Intentando login con:', { email, password });
            const response = await login(email, password);
            
            // ✅ SOLO ACTUALIZAR SI ESTÁ MONTADO
            if (isMounted.current) {
                console.log('✅ Login exitoso:', response);
                
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('user', JSON.stringify(response.user));
                
                navigate('/profile');
            }
            
        } catch (err) {
            if (isMounted.current) {
                console.error('❌ Error en login:', err);
                setError(err.message || 'Credenciales inválidas');
            }
        } finally {
            if (isMounted.current) {
                setLoading(false);
            }
        }
    };

    return (
        <div className="login-page">
            <div className="auth-container">
                <div className="auth-logo">
                    <Link to="/">
                        <img src={logo} alt="Plataforma" />
                    </Link>
                </div>
                
                <h1 className="auth-title">Iniciar Sesión</h1>
                <p className="auth-subtitle">Ingresa a tu cuenta</p>
                
                {error && (
                    <div className="error-message">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}
                
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Correo electrónico</label>
                        <input 
                            type="email" 
                            id="email" 
                            placeholder="tu@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input 
                            type="password" 
                            id="password" 
                            placeholder="Tu contraseña" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            disabled={loading}
                            required 
                        />
                    </div>
                    
                    <button 
                        type="submit" 
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Ingresando...
                            </>
                        ) : (
                            'Ingresar'
                        )}
                    </button>
                </form>
                
                <div className="auth-footer">
                    ¿No tienes cuenta? <Link to="/register">Regístrate</Link>
                </div>
            </div>
        </div>
    );
};

export default Login;