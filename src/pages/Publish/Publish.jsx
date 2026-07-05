/**
 * Publish.jsx - Publicar Emprendimiento
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories, createVenture } from '../../services/api';
import './Publish.css';

const Publish = () => {
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria_id: '',
        ubicacion: '',
        email_contacto: '',
        telefono: '',
        sitio_web: '',
        estado: 'activo'
    });
    
    const [errors, setErrors] = useState({});

    // Cargar categorías desde la API
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
                console.log('📂 Categorías cargadas:', data);
            } catch (err) {
                console.error('❌ Error cargando categorías:', err);
                setError('Error al cargar categorías');
            } finally {
                setLoading(false);
            }
        };
        
        loadCategories();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        } else if (formData.descripcion.length < 20) {
            newErrors.descripcion = 'La descripción debe tener al menos 20 caracteres';
        }
        
        if (!formData.categoria_id) {
            newErrors.categoria_id = 'Selecciona una categoría';
        }
        
        if (formData.email_contacto && !/\S+@\S+\.\S+/.test(formData.email_contacto)) {
            newErrors.email_contacto = 'Email inválido';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        
        if (!validateForm()) {
            return;
        }
        
        // Obtener usuario logueado
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        if (!user.id) {
            setError('Debes iniciar sesión para publicar');
            navigate('/login');
            return;
        }
        
        setSubmitting(true);
        
        try {
            const data = {
                ...formData,
                usuario_id: user.id,
                categoria_id: parseInt(formData.categoria_id)
            };
            
            console.log('📡 Publicando emprendimiento:', data);
            
            const response = await createVenture(data);
            console.log('✅ Emprendimiento publicado:', response);
            
            alert('✅ ¡Emprendimiento publicado exitosamente!');
            navigate(`/venture/${response.data.id}`);
            
        } catch (err) {
            console.error('❌ Error al publicar:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al publicar el emprendimiento');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando categorías...</p>
            </div>
        );
    }

    return (
        <div className="publish-page">
            <div className="container">
                
                {/* Botón Volver */}
                <Link to="/ventures" className="btn-back-publish">
                    ← Volver al listado
                </Link>

                <div className="publish-card">
                    <h1 className="publish-title">🚀 Publicar Emprendimiento</h1>
                    
                    {error && (
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} className="publish-form">
                        
                        {/* Nombre */}
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del emprendimiento *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={`form-control ${errors.nombre ? 'error' : ''}`}
                                value={formData.nombre}
                                onChange={handleChange}
                                placeholder="Ej: GreenTech Solutions"
                            />
                            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                        </div>
                        
                        {/* Descripción */}
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción *</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className={`form-control ${errors.descripcion ? 'error' : ''}`}
                                rows="5"
                                value={formData.descripcion}
                                onChange={handleChange}
                                placeholder="Describe tu emprendimiento, qué problema resuelve, etc."
                            />
                            {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
                            <small>Mínimo 20 caracteres</small>
                        </div>
                        
                        {/* Categoría */}
                        <div className="form-group">
                            <label htmlFor="categoria_id">Categoría *</label>
                            <select
                                id="categoria_id"
                                name="categoria_id"
                                className={`form-control ${errors.categoria_id ? 'error' : ''}`}
                                value={formData.categoria_id}
                                onChange={handleChange}
                            >
                                <option value="">Selecciona una categoría</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.nombre}
                                    </option>
                                ))}
                            </select>
                            {errors.categoria_id && <span className="error-text">{errors.categoria_id}</span>}
                        </div>
                        
                        {/* Ubicación */}
                        <div className="form-group">
                            <label htmlFor="ubicacion">Ubicación</label>
                            <input
                                type="text"
                                id="ubicacion"
                                name="ubicacion"
                                className="form-control"
                                value={formData.ubicacion}
                                onChange={handleChange}
                                placeholder="Ciudad, País"
                            />
                        </div>
                        
                        {/* Email de contacto */}
                        <div className="form-group">
                            <label htmlFor="email_contacto">Email de contacto</label>
                            <input
                                type="email"
                                id="email_contacto"
                                name="email_contacto"
                                className={`form-control ${errors.email_contacto ? 'error' : ''}`}
                                value={formData.email_contacto}
                                onChange={handleChange}
                                placeholder="contacto@tue mprendimiento.com"
                            />
                            {errors.email_contacto && <span className="error-text">{errors.email_contacto}</span>}
                        </div>
                        
                        {/* Teléfono */}
                        <div className="form-group">
                            <label htmlFor="telefono">Teléfono</label>
                            <input
                                type="text"
                                id="telefono"
                                name="telefono"
                                className="form-control"
                                value={formData.telefono}
                                onChange={handleChange}
                                placeholder="+57 300 123 4567"
                            />
                        </div>
                        
                        {/* Sitio web */}
                        <div className="form-group">
                            <label htmlFor="sitio_web">Sitio web</label>
                            <input
                                type="text"
                                id="sitio_web"
                                name="sitio_web"
                                className="form-control"
                                value={formData.sitio_web}
                                onChange={handleChange}
                                placeholder="www.tuempresa.com"
                            />
                        </div>
                        
                        {/* Estado */}
                        <div className="form-group">
                            <label htmlFor="estado">Estado</label>
                            <select
                                id="estado"
                                name="estado"
                                className="form-control"
                                value={formData.estado}
                                onChange={handleChange}
                            >
                                <option value="activo">✅ Activo</option>
                                <option value="pendiente">⏳ Pendiente</option>
                                <option value="borrador">📝 Borrador</option>
                            </select>
                        </div>
                        
                        {/* Botones */}
                        <div className="form-actions">
                            <Link to="/ventures" className="btn-cancel">Cancelar</Link>
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Publicando...
                                    </>
                                ) : (
                                    '🚀 Publicar Emprendimiento'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Publish;