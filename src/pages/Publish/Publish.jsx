/**
 * Publish.jsx - Publicar Emprendimiento CON IMAGEN
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getCategories, createVentureWithImage } from '../../services/api';
import './Publish.css';



const Publish = () => {
    const navigate = useNavigate();
    
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [previewImage, setPreviewImage] = useState(null);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        categoria_id: '',
        ubicacion: '',
        email_contacto: '',
        telefono: '',
        sitio_web: '',
        estado: 'activo',
        imagen: null
    });
    
    const [errors, setErrors] = useState({});

    // Cargar categorías
    useEffect(() => {
        const loadCategories = async () => {
            try {
                setLoading(true);
                const data = await getCategories();
                setCategories(data);
            } catch (err) {
                console.error('Error cargando categorías:', err);
                setError('Error al cargar categorías');
            } finally {
                setLoading(false);
            }
        };
        loadCategories();
    }, []);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!tiposPermitidos.includes(file.type)) {
                setErrors(prev => ({ ...prev, imagen: 'Formato no permitido. Usa JPG, PNG, GIF o WEBP' }));
                return;
            }
            
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, imagen: 'La imagen no puede superar los 5MB' }));
                return;
            }
            
            setFormData(prev => ({ ...prev, imagen: file }));
            
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            
            if (errors.imagen) {
                setErrors(prev => ({ ...prev, imagen: '' }));
            }
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombre.trim()) {
            newErrors.nombre = 'El nombre es obligatorio';
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
        
        if (!user.id) {
            setError('Debes iniciar sesión');
            navigate('/login');
            return;
        }
        
        setSubmitting(true);
        
        try {
            const submitData = new FormData();
            submitData.append('nombre', formData.nombre);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('categoria_id', formData.categoria_id);
            submitData.append('ubicacion', formData.ubicacion || '');
            submitData.append('email_contacto', formData.email_contacto || '');
            submitData.append('telefono', formData.telefono || '');
            submitData.append('sitio_web', formData.sitio_web || '');
            submitData.append('estado', formData.estado);
            submitData.append('usuario_id', user.id);
            
            if (formData.imagen) {
                submitData.append('imagen', formData.imagen);
            }
            
            const response = await createVentureWithImage(submitData);
            
            alert('✅ Emprendimiento publicado exitosamente!');
            navigate(`/venture/${response.data.id}`);
            
        } catch (err) {
            console.error('Error al publicar:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al publicar el emprendimiento');
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="publish-page">
            <div className="container">
                <div className="publish-header">
                    <h2>🚀 Publicar Emprendimiento</h2>
                    <p className="text-muted">Comparte tu negocio con la comunidad</p>
                </div>

                {error && (
                    <div className="alert alert-danger">
                        <i className="fas fa-exclamation-circle"></i> {error}
                    </div>
                )}

                <div className="publish-card">
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        <div className="row">
                            <div className="col-md-6">
                                
                                <div className="form-group">
                                    <label htmlFor="nombre">Nombre del emprendimiento *</label>
                                    <input
                                        type="text"
                                        id="nombre"
                                        name="nombre"
                                        className={`form-control ${errors.nombre ? 'error' : ''}`}
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Yupi Snacks"
                                    />
                                    {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="descripcion">Descripción *</label>
                                    <textarea
                                        id="descripcion"
                                        name="descripcion"
                                        className={`form-control ${errors.descripcion ? 'error' : ''}`}
                                        rows="4"
                                        value={formData.descripcion}
                                        onChange={handleChange}
                                        placeholder="Describe tu emprendimiento (mínimo 20 caracteres)"
                                    />
                                    {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="categoria_id">Categoría *</label>
                                    {loading ? (
                                        <div className="text-muted small">Cargando categorías...</div>
                                    ) : (
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
                                    )}
                                    {errors.categoria_id && <span className="error-text">{errors.categoria_id}</span>}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="ubicacion">Ubicación</label>
                                    <input
                                        type="text"
                                        id="ubicacion"
                                        name="ubicacion"
                                        className="form-control"
                                        value={formData.ubicacion}
                                        onChange={handleChange}
                                        placeholder="Cali, Colombia"
                                    />
                                </div>
                            </div>

                            <div className="col-md-6">
                                
                                <div className="form-group">
                                    <label htmlFor="imagen">Imagen del emprendimiento</label>
                                    <input
                                        type="file"
                                        id="imagen"
                                        name="imagen"
                                        className={`form-control ${errors.imagen ? 'error' : ''}`}
                                        onChange={handleImageChange}
                                        accept="image/jpeg,image/png,image/gif,image/webp"
                                    />
                                    {errors.imagen && <span className="error-text">{errors.imagen}</span>}
                                    <small className="form-hint">
                                        Formatos: JPG, PNG, GIF, WEBP. Máximo: 5MB
                                    </small>

                                    {previewImage && (
                                        <div className="image-preview-container">
                                            <img src={previewImage} alt="Preview" className="image-preview" />
                                            <button
                                                type="button"
                                                className="btn-remove-image"
                                                onClick={() => {
                                                    setPreviewImage(null);
                                                    setFormData(prev => ({ ...prev, imagen: null }));
                                                }}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <div className="form-group">
                                    <label htmlFor="email_contacto">Email de contacto</label>
                                    <input
                                        type="email"
                                        id="email_contacto"
                                        name="email_contacto"
                                        className={`form-control ${errors.email_contacto ? 'error' : ''}`}
                                        value={formData.email_contacto}
                                        onChange={handleChange}
                                        placeholder="contacto@negocio.com"
                                    />
                                    {errors.email_contacto && <span className="error-text">{errors.email_contacto}</span>}
                                </div>

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

                                <div className="form-group">
                                    <label htmlFor="sitio_web">Sitio web</label>
                                    <input
                                        type="text"
                                        id="sitio_web"
                                        name="sitio_web"
                                        className="form-control"
                                        value={formData.sitio_web}
                                        onChange={handleChange}
                                        placeholder="https://tunegocio.com"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="row mt-4">
                            <div className="col-12">
                                <div className="form-actions">
                                    <Link to="/profile" className="btn-cancel">Cancelar</Link>
                                    <button type="submit" className="btn-save" disabled={submitting}>
                                        {submitting ? 'Publicando...' : '🚀 Publicar Emprendimiento'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Publish;