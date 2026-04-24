/*Login.jsx - Página de inicio de sesión*/
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Login.css';
import logo from '../../assets/logo.png';

const Login = () => {
  // Hook para redirigir después del login
  const navigate = useNavigate();
  
  // Estados para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');  // Para mostrar errores

  /**
    @param {Event} e 
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); 
    
    // Validación básica
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    
    // Aquí iría la llamada al backend para autenticar
    console.log('Login attempt:', { email, password });
    
    // Simular login exitoso
    alert('Login successful!');
    navigate('/');  
  };

  return (
    <div className="login-page">
      <div className="auth-container">
        {/* Logo con enlace al home */}
        <div className="auth-logo">
          <Link to="/">
            <img src={logo} alt="Entrepreneurs Ecosystem" />
          </Link>
        </div>
        
        <h1 className="auth-title">Welcome Back</h1>
        <p className="auth-subtitle">Log in to your account</p>
        
        {/* Mostrar error si existe */}
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit}>
          {/* Campo de email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              placeholder="your@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          
          {/* Campo de contraseña */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Enter your password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          
          {/* Opciones adicionales */}
          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" /> Remember me
            </label>
            <Link to="/forgot-password" className="forgot-link">
              Forgot password?
            </Link>
          </div>
          
          {/* Botón de envío */}
          <button type="submit" className="auth-button">
            Sign In
          </button>
        </form>
        
        {/* Enlace a registro para nuevos usuarios */}
        <div className="auth-footer">
          Don't have an account? <Link to="/register">Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;