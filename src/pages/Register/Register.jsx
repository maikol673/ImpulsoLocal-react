/*Register.jsx - Página de registro de nuevos usuarios*/
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Register.css';
import logo from '../../assets/logo.png';

const Register = () => {
  const navigate = useNavigate();
  
  // Estado único para todos los campos del formulario
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    ventureType: ''
  });
  
  const [errors, setErrors] = useState({});  

  /**
   * handleChange - Actualiza el estado cuando el usuario escribe
   * @param {Event} e - 
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Limpiar error del campo específico
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  };

  /**
   * validateForm - Valida todos los campos del formulario
   * @returns {boolean} 
   */
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    if (!formData.ventureType) {
      newErrors.ventureType = 'Please select your profile';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  /**
   * handleSubmit - Valida y envía el formulario
   * @param {Event} e 
   */
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      console.log('Registration data:', formData);
      alert('Account created successfully!');
      navigate('/login');
    }
  };

  return (
    <div className="register-page">
      <div className="auth-container">
        <div className="auth-logo">
          <Link to="/">
            <img src={logo} alt="Entrepreneurs Ecosystem" />
          </Link>
        </div>
        
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtitle">Join our community of entrepreneurs</p>
        
        <form onSubmit={handleSubmit}>
          {/* Nombre completo */}
          <div className="form-group">
            <label htmlFor="name">Full Name *</label>
            <input 
              type="text" 
              id="name" 
              name="name"
              placeholder="Carlos Mendoza" 
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'error' : ''}
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          
          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address *</label>
            <input 
              type="email" 
              id="email" 
              name="email"
              placeholder="your@email.com" 
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'error' : ''}
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          
          {/* Contraseña */}
          <div className="form-group">
            <label htmlFor="password">Password *</label>
            <input 
              type="password" 
              id="password" 
              name="password"
              placeholder="Minimum 6 characters" 
              value={formData.password}
              onChange={handleChange}
              className={errors.password ? 'error' : ''}
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          {/* Confirmar contraseña */}
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input 
              type="password" 
              id="confirmPassword" 
              name="confirmPassword"
              placeholder="Confirm your password" 
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'error' : ''}
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          {/* Tipo de emprendimiento */}
          <div className="form-group">
            <label htmlFor="ventureType">Profile Type *</label>
            <select 
              id="ventureType" 
              name="ventureType"
              value={formData.ventureType} 
              onChange={handleChange}
              className={errors.ventureType ? 'error' : ''}
            >
              <option value="">Select your profile</option>
              <option value="startup">Startup/Scaleup</option>
              <option value="sme">SME</option>
              <option value="freelance">Freelance/Self-employed</option>
              <option value="student">Student</option>
              <option value="investor">Investor</option>
              <option value="mentor">Mentor</option>
            </select>
            {errors.ventureType && <span className="error-text">{errors.ventureType}</span>}
          </div>
          
          {/* Términos y condiciones */}
          <div className="terms-group">
            <label className="checkbox-label">
              <input type="checkbox" required />
              <span>I agree to the <Link to="/terms">Terms of Service</Link> and <Link to="/privacy">Privacy Policy</Link></span>
            </label>
          </div>
          
          <button type="submit" className="auth-button">
            Create Account
          </button>
        </form>
        
        <div className="auth-footer">
          Already have an account? <Link to="/login">Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;