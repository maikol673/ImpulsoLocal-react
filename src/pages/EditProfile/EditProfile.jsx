/**
 * EditProfile.jsx - Editar Perfil
 * CON SUBIDA DE IMAGENES
 */

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { updateProfileWithImage } from '../../services/api';
import './EditProfile.css';

const BASE_URL = 'http://127.0.0.1:8000';

const EditProfile = () => {
    const navigate = useNavigate();
    
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Si no hay sesión, redirige
    if (!user.id) {
        navigate('/login');
    }

    // Estado del formulario
    const [formData, setFormData] = useState(() => ({
        full_name: user.full_name || '',
        bio: user.bio || '',
        telefono: user.telefono || '',
        ciudad: user.ciudad || '',
        direccion: user.direccion || '',
        sitio_web: user.sitio_web || '',
        fecha_nacimiento: user.fecha_nacimiento || '',
        recibe_notificaciones: user.recibe_notificaciones !== undefined ? user.recibe_notificaciones : true,
        notificaciones_email: user.notificaciones_email !== undefined ? user.notificaciones_email : true,
        avatar: null
    }));
    
    const [errors, setErrors] = useState({});

    // Manejar cambio de imagen
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validar tipo de archivo
            const tiposPermitidos = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!tiposPermitidos.includes(file.type)) {
                setErrors(prev => ({ ...prev, avatar: 'Formato no permitido. Usa JPG, PNG, GIF o WEBP' }));
                return;
            }
            
            // Validar tamaño (5MB máximo)
            if (file.size > 5 * 1024 * 1024) {
                setErrors(prev => ({ ...prev, avatar: 'La imagen no puede superar los 5MB' }));
                return;
            }
            
            setFormData(prev => ({ ...prev, avatar: file }));
            
            // Crear preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
            
            if (errors.avatar) {
                setErrors(prev => ({ ...prev, avatar: '' }));
            }
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.full_name.trim()) {
            newErrors.full_name = 'El nombre completo es obligatorio';
        }
        
        if (formData.sitio_web && !/^https?:\/\/[^\s]+/.test(formData.sitio_web)) {
            newErrors.sitio_web = 'URL inválida (debe comenzar con http:// o https://)';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess(false);
        
        if (!validateForm()) {
            return;
        }
        
        setSubmitting(true);
        
        try {
            // Crear FormData para enviar archivos
            const submitData = new FormData();
            submitData.append('full_name', formData.full_name);
            submitData.append('bio', formData.bio || '');
            submitData.append('telefono', formData.telefono || '');
            submitData.append('ciudad', formData.ciudad || '');
            submitData.append('direccion', formData.direccion || '');
            submitData.append('sitio_web', formData.sitio_web || '');
            submitData.append('fecha_nacimiento', formData.fecha_nacimiento || '');
            submitData.append('recibe_notificaciones', formData.recibe_notificaciones ? 1 : 0);
            submitData.append('notificaciones_email', formData.notificaciones_email ? 1 : 0);
            
            if (formData.avatar) {
                submitData.append('avatar', formData.avatar);
                console.log('📸 Subiendo imagen:', formData.avatar.name);
            }
            
            console.log('📡 Actualizando perfil con imagen');
            
            const response = await updateProfileWithImage(user.id, submitData);
            console.log('✅ Respuesta:', response);
            
            // Actualizar localStorage con los nuevos datos
            const updatedUser = {
                ...user,
                full_name: formData.full_name,
                bio: formData.bio,
                telefono: formData.telefono,
                ciudad: formData.ciudad,
                direccion: formData.direccion,
                sitio_web: formData.sitio_web,
                fecha_nacimiento: formData.fecha_nacimiento,
                recibe_notificaciones: formData.recibe_notificaciones,
                notificaciones_email: formData.notificaciones_email,
            };
            
            // Si la respuesta tiene URL de avatar, actualizarla
            if (response.data?.avatar) {
                updatedUser.avatar = response.data.avatar;
            }
            
            localStorage.setItem('user', JSON.stringify(updatedUser));
            
            setSuccess(true);
            setSubmitting(false);
            
            setTimeout(() => {
                navigate('/profile');
            }, 1500);
            
        } catch (err) {
            console.error('❌ Error al actualizar perfil:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al actualizar el perfil');
            }
            setSubmitting(false);
        }
    };

    return (
        <div className="edit-profile-page">
            <div className="container">
                <div className="row">
                    
                    {/* Menú lateral */}
                    <div className="col-md-3">
                        <div className="sidebar-card">
                            <div className="sidebar-avatar">
                                {previewImage ? (
                                    <img src={previewImage} alt="Preview" className="avatar-preview" />
                                ) : user.avatar ? (
                                    <img 
                                        src={`${BASE_URL}${user.avatar}`} 
                                        alt={formData.full_name || 'Usuario'} 
                                        className="avatar-preview" 
                                    />
                                ) : (
                                    <div className="avatar-placeholder">
                                        <span>{formData.full_name?.charAt(0) || 'U'}</span>
                                    </div>
                                )}
                            </div>
                            <h5 className="sidebar-name">{formData.full_name || 'Usuario'}</h5>
                            <p className="sidebar-username">@{user.username}</p>
                            
                            <div className="sidebar-menu">
                                <Link to="/profile" className="menu-item">
                                    👤 Ver Perfil
                                </Link>
                                <Link to="/edit-profile" className="menu-item active">
                                    ✏️ Editar Perfil
                                </Link>
                                <Link to="/change-password" className="menu-item">
                                    🔒 Cambiar Contraseña
                                </Link>
                                <Link to="/my-ventures" className="menu-item">
                                    🏪 Mis Emprendimientos
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Formulario */}
                    <div className="col-md-9">
                        <div className="form-card">
                            <div className="form-header">
                                <h4 className="form-title">✏️ Editar Perfil</h4>
                            </div>
                            <div className="form-body">
                                
                                {success && (
                                    <div className="alert alert-success">
                                        ✅ Perfil actualizado correctamente
                                    </div>
                                )}
                                
                                {error && (
                                    <div className="alert alert-danger">
                                        <i className="fas fa-exclamation-circle"></i> {error}
                                    </div>
                                )}
                                
                                <form onSubmit={handleSubmit} encType="multipart/form-data">
                                    <div className="row">
                                        <div className="col-md-6">
                                            <h5 className="section-subtitle">Información Básica</h5>
                                            
                                            <div className="form-group">
                                                <label htmlFor="full_name">Nombre *</label>
                                                <input
                                                    type="text"
                                                    id="full_name"
                                                    name="full_name"
                                                    className={`form-control ${errors.full_name ? 'error' : ''}`}
                                                    value={formData.full_name}
                                                    onChange={handleChange}
                                                    placeholder="Tu nombre"
                                                />
                                                {errors.full_name && <span className="error-text">{errors.full_name}</span>}
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="bio">Biografía</label>
                                                <textarea
                                                    id="bio"
                                                    name="bio"
                                                    className="form-control"
                                                    rows="3"
                                                    value={formData.bio}
                                                    onChange={handleChange}
                                                    placeholder="Cuéntanos sobre ti..."
                                                />
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
                                        </div>
                                        
                                        <div className="col-md-6">
                                            <h5 className="section-subtitle">Información Adicional</h5>
                                            
                                            {/* Campo de foto de perfil */}
                                            <div className="form-group">
                                                <label htmlFor="avatar">Foto de Perfil</label>
                                                <input
                                                    type="file"
                                                    id="avatar"
                                                    name="avatar"
                                                    className={`form-control ${errors.avatar ? 'error' : ''}`}
                                                    onChange={handleImageChange}
                                                    accept="image/jpeg,image/png,image/gif,image/webp"
                                                />
                                                {errors.avatar && <span className="error-text">{errors.avatar}</span>}
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
                                                                setFormData(prev => ({ ...prev, avatar: null }));
                                                            }}
                                                        >
                                                            ✖
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="ciudad">Ciudad</label>
                                                <input
                                                    type="text"
                                                    id="ciudad"
                                                    name="ciudad"
                                                    className="form-control"
                                                    value={formData.ciudad}
                                                    onChange={handleChange}
                                                    placeholder="Bogotá, Colombia"
                                                />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="direccion">Dirección</label>
                                                <input
                                                    type="text"
                                                    id="direccion"
                                                    name="direccion"
                                                    className="form-control"
                                                    value={formData.direccion}
                                                    onChange={handleChange}
                                                    placeholder="Calle 123 #45-67"
                                                />
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="sitio_web">Sitio web</label>
                                                <input
                                                    type="text"
                                                    id="sitio_web"
                                                    name="sitio_web"
                                                    className={`form-control ${errors.sitio_web ? 'error' : ''}`}
                                                    value={formData.sitio_web}
                                                    onChange={handleChange}
                                                    placeholder="https://tusitio.com"
                                                />
                                                {errors.sitio_web && <span className="error-text">{errors.sitio_web}</span>}
                                            </div>
                                            
                                            <div className="form-group">
                                                <label htmlFor="fecha_nacimiento">Fecha de nacimiento</label>
                                                <input
                                                    type="date"
                                                    id="fecha_nacimiento"
                                                    name="fecha_nacimiento"
                                                    className="form-control"
                                                    value={formData.fecha_nacimiento}
                                                    onChange={handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Preferencias */}
                                    <div className="row mt-3">
                                        <div className="col-12">
                                            <h5 className="section-subtitle">Preferencias</h5>
                                            <div className="row">
                                                <div className="col-md-6">
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
                                                    </div>
                                                </div>
                                                <div className="col-md-6">
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
                                                            Notificaciones por email
                                                        </label>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Botones */}
                                    <div className="row mt-4">
                                        <div className="col-12">
                                            <div className="form-actions">
                                                <Link to="/profile" className="btn-cancel">Cancelar</Link>
                                                <button type="submit" className="btn-save" disabled={submitting}>
                                                    {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProfile;