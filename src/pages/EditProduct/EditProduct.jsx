/**
 * EditProduct.jsx - Editar Producto
 * CON API REAL Y SUBIDA DE IMAGENES
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getProductById, updateProductWithImage, BASE_URL } from '../../services/api';
import './EditProduct.css';

const EditProduct = () => {
    const { id } = useParams(); // ID del producto
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO
    // ============================================================
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [previewImage, setPreviewImage] = useState(null);
    const [currentImage, setCurrentImage] = useState(null);
    
    const [formData, setFormData] = useState({
        nombre: '',
        descripcion: '',
        precio: '',
        stock: '',
        estado: 'activo',
        imagen: null
    });
    
    const [errors, setErrors] = useState({});

    // ============================================================
    // ✅ VERIFICAR LOGIN (dentro de un useEffect, para no romper el orden de los Hooks)
    // ============================================================
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        if (!user.id) {
            navigate('/login');
        }
    }, [user.id, navigate]);

    // Cargar datos del producto
    useEffect(() => {
        if (!user.id) return; // evita cargar datos si no hay usuario logueado

        const loadProduct = async () => {
            try {
                setLoading(true);
                const data = await getProductById(id);
                
                setFormData({
                    nombre: data.nombre || '',
                    descripcion: data.descripcion || '',
                    precio: data.precio || '',
                    stock: data.stock || '',
                    estado: data.estado || 'activo',
                    imagen: null
                });
                
                if (data.imagen) {
                    setCurrentImage(data.imagen);
                }
                
                console.log('📝 Producto cargado:', data);
                
            } catch (err) {
                console.error('❌ Error cargando producto:', err);
                setError(err.message || 'Error al cargar el producto');
            } finally {
                setLoading(false);
            }
        };
        
        loadProduct();
    }, [id, user.id]);

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
            newErrors.nombre = 'El nombre del producto es obligatorio';
        } else if (formData.nombre.length < 3) {
            newErrors.nombre = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!formData.precio) {
            newErrors.precio = 'El precio es obligatorio';
        } else if (parseFloat(formData.precio) <= 0) {
            newErrors.precio = 'El precio debe ser mayor a 0';
        }
        
        if (!formData.descripcion.trim()) {
            newErrors.descripcion = 'La descripción es obligatoria';
        } else if (formData.descripcion.length < 10) {
            newErrors.descripcion = 'La descripción debe tener al menos 10 caracteres';
        }
        
        if (!formData.stock) {
            newErrors.stock = 'El stock es obligatorio';
        } else if (parseInt(formData.stock) < 0) {
            newErrors.stock = 'El stock no puede ser negativo';
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
            const submitData = new FormData();
            submitData.append('nombre', formData.nombre);
            submitData.append('descripcion', formData.descripcion);
            submitData.append('precio', formData.precio);
            submitData.append('stock', formData.stock);
            submitData.append('estado', formData.estado);
            
            if (formData.imagen) {
                submitData.append('imagen', formData.imagen);
                console.log('📸 Subiendo nueva imagen:', formData.imagen.name);
            }
            
            console.log('📡 Actualizando producto...');
            const response = await updateProductWithImage(id, submitData);
            console.log('✅ Producto actualizado:', response);
            
            setSuccess(true);
            setSubmitting(false);
            
            setTimeout(() => {
                navigate(`/venture/${response.data.emprendimiento_id}`);
            }, 1500);
            
        } catch (err) {
            console.error('❌ Error al actualizar producto:', err);
            if (err.errors) {
                setErrors(err.errors);
            } else {
                setError(err.message || 'Error al actualizar el producto');
            }
            setSubmitting(false);
        }
    };

    // ============================================================
    // ✅ RENDERIZADO
    // ============================================================
    
    if (loading) {
        return (
            <div className="edit-product-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando producto...</p>
                </div>
            </div>
        );
    }

    if (success) {
        return (
            <div className="edit-product-page">
                <div className="container">
                    <div className="success-card">
                        <div className="success-icon">🎉</div>
                        <h2 className="success-title">¡Producto Actualizado!</h2>
                        <p className="success-text">
                            El producto ha sido actualizado exitosamente.
                        </p>
                        <Link to={`/venture/${formData.emprendimiento_id}`} className="btn-venture">
                            📋 Ver Emprendimiento
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="edit-product-page">
            <div className="container">
                <div className="product-card">
                    
                    <div className="product-header">
                        <h5 className="product-title">✏️ Editar Producto</h5>
                    </div>
                    
                    <div className="product-body">
                        
                        {error && (
                            <div className="alert alert-danger">
                                <i className="fas fa-exclamation-circle"></i> {error}
                            </div>
                        )}
                        
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            
                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Nombre del Producto *</label>
                                        <input
                                            type="text"
                                            name="nombre"
                                            className={`form-control ${errors.nombre ? 'error' : ''}`}
                                            value={formData.nombre}
                                            onChange={handleChange}
                                            placeholder="Ej: Galletas de Chocolate"
                                        />
                                        {errors.nombre && <span className="error-text">{errors.nombre}</span>}
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Precio *</label>
                                        <input
                                            type="number"
                                            name="precio"
                                            className={`form-control ${errors.precio ? 'error' : ''}`}
                                            value={formData.precio}
                                            onChange={handleChange}
                                            placeholder="2500"
                                            min="0"
                                            step="100"
                                        />
                                        {errors.precio && <span className="error-text">{errors.precio}</span>}
                                    </div>
                                </div>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Descripción *</label>
                                <textarea
                                    name="descripcion"
                                    className={`form-control ${errors.descripcion ? 'error' : ''}`}
                                    rows="4"
                                    value={formData.descripcion}
                                    onChange={handleChange}
                                    placeholder="Describe tu producto..."
                                />
                                {errors.descripcion && <span className="error-text">{errors.descripcion}</span>}
                            </div>

                            <div className="row">
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Stock Disponible *</label>
                                        <input
                                            type="number"
                                            name="stock"
                                            className={`form-control ${errors.stock ? 'error' : ''}`}
                                            value={formData.stock}
                                            onChange={handleChange}
                                            placeholder="10"
                                            min="0"
                                        />
                                        {errors.stock && <span className="error-text">{errors.stock}</span>}
                                    </div>
                                </div>
                                
                                <div className="col-md-6">
                                    <div className="form-group">
                                        <label className="form-label">Estado *</label>
                                        <select
                                            name="estado"
                                            className="form-select"
                                            value={formData.estado}
                                            onChange={handleChange}
                                        >
                                            <option value="activo">✅ Activo</option>
                                            <option value="pendiente">⏳ Pendiente</option>
                                            <option value="borrador">📝 Borrador</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            {/* Imagen */}
                            <div className="form-group">
                                <label className="form-label">Imagen del Producto</label>
                                <input
                                    type="file"
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

                            <div className="form-actions">
                                <Link to={`/venture/${id}`} className="btn-cancel">
                                    Cancelar
                                </Link>
                                <button type="submit" className="btn-submit" disabled={submitting}>
                                    {submitting ? 'Guardando...' : '💾 Guardar Cambios'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default EditProduct;