/**
 * EditVenture.jsx - Editar Emprendimiento
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getVentureById, updateVentureWithImage, getCategories, BASE_URL } from '../../services/api';
import './EditVenture.css';


const EditVenture = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState([]);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    
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

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (!user.id) {
        navigate('/login');
    }

    // Cargar datos
    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError('');
                
                // Cargar categorías
                const categoriesData = await getCategories();
                setCategories(categoriesData);
                
                // Cargar emprendimiento
                const ventureData = await getVentureById(id);
                setFormData({
                    nombre: ventureData.nombre || '',
                    descripcion: ventureData.descripcion || '',
                    categoria_id: ventureData.categoria_id || '',
                    ubicacion: ventureData.ubicacion || '',
                    email_contacto: ventureData.email_contacto || '',
                    telefono: ventureData.telefono || '',
                    sitio_web: ventureData.sitio_web || '',
                    estado: ventureData.estado || 'activo',
                    imagen: null
                });
                
                if (ventureData.imagen) {
                    setCurrentImage(ventureData.imagen);
                }
                
                console.log('📝 Datos cargados:', ventureData);
                
            } catch (err) {
                console.error('❌ Error cargando datos:', err);
                setError(err.message || 'Error al cargar los datos');
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [id]);

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
            
            if (formData.imagen) {
                submitData.append('imagen', formData.imagen);
                console.log('📸 Subiendo nueva imagen:', formData.imagen.name);
            }
            
            console.log('📡 Actualizando emprendimiento...');
            
            const response = await updateVentureWithImage(id, submitData);
            console.log('✅ Emprendimiento actualizado:', response);
            
            alert('✅ Emprendimiento actualizado exitosamente');
            navigate(`/venture/${id}`);
            
        } catch (err) {
            console.error('❌ Error al actualizar:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al actualizar el emprendimiento');
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
                <p className="mt-2">Cargando datos del emprendimiento...</p>
            </div>
        );
    }

    return (
        <div className="edit-venture-page">
            <div className="container">
                
                <Link to={`/venture/${id}`} className="btn-back-edit">
                    ← Volver al detalle
                </Link>

                <div className="edit-card">
                    <h1 className="edit-title">✏️ Editar Emprendimiento</h1>
                    
                    {error && (
                        <div className="alert alert-danger">
                            <i className="fas fa-exclamation-circle"></i> {error}
                        </div>
                    )}
                    
                    <form onSubmit={handleSubmit} encType="multipart/form-data">
                        
                        <div className="form-group">
                            <label htmlFor="nombre">Nombre del emprendimiento *</label>
                            <input
                                type="text"
                                id="nombre"
                                name="nombre"
                                className={`form-control ${errors.nombre ? 'error' : ''}`}
                                value={formData.nombre}
                                onChange={handleChange}
                            />
                            {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                        </div>
                        
                        <div className="form-group">
                            <label htmlFor="descripcion">Descripción *</label>
                            <textarea
                                id="descripcion"
                                name="descripcion"
                                className={`form-control ${errors.descripcion ? 'error' : ''}`}
                                rows="5"
                                value={formData.descripcion}
                                onChange={handleChange}
                            />
                            {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
                        </div>
                        
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
                        
                        <div className="form-group">
                            <label htmlFor="ubicacion">Ubicación</label>
                            <input
                                type="text"
                                id="ubicacion"
                                name="ubicacion"
                                className="form-control"
                                value={formData.ubicacion}
                                onChange={handleChange}
                            />
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
                            />
                        </div>

                        {/* CAMPO DE IMAGEN */}
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
                            
                            {/* Imagen actual */}
                            {currentImage && !previewImage && (
                                <div className="current-image">
                                    <small>Imagen actual:</small>
                                    <img src={`${BASE_URL}${currentImage}`} alt="Imagen actual" />
                                </div>
                            )}
                            
                            {/* Preview de nueva imagen */}
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
                        
                        <div className="form-actions">
                            <Link to={`/venture/${id}`} className="btn-cancel">Cancelar</Link>
                            <button 
                                type="submit" 
                                className="btn-submit"
                                disabled={submitting}
                            >
                                {submitting ? (
                                    <>
                                        <i className="fas fa-spinner fa-spin"></i> Guardando...
                                    </>
                                ) : (
                                    '💾 Guardar Cambios'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditVenture;