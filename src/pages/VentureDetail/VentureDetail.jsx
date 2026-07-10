/**
 * VentureDetail.jsx - Detalle de Emprendimiento
 * CON API REAL - CON SOPORTE DE IMÁGENES - CON AGREGAR AL CARRITO
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getVentureById, getProductsByVenture, getReviews, toggleLike, BASE_URL, addToCart } from '../../services/api';
import './VentureDetail.css';

const VentureDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    
    const [venture, setVenture] = useState(null);
    const [products, setProducts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [userHasLiked, setUserHasLiked] = useState(false);
    const [activeTab, setActiveTab] = useState('products');
    const [imageError, setImageError] = useState(false);
    const [imgVersion, setImgVersion] = useState(null);
    const [addingToCart, setAddingToCart] = useState(false);

    // Obtener usuario logueado
    const loggedUser = JSON.parse(localStorage.getItem('user') || '{}');

    useEffect(() => {
        const loadVentureData = async () => {
            setLoading(true);
            setError(null);
            setImageError(false);
            
            try {
                console.log(`📡 Cargando emprendimiento ID: ${id}`);
                
                const ventureData = await getVentureById(id);
                setVenture(ventureData);
                
                setImgVersion(Date.now());
                
                const productsData = await getProductsByVenture(id);
                setProducts(productsData);
                
                const reviewsData = await getReviews(id);
                setReviews(reviewsData);
                
                console.log('✅ Datos cargados:', { venture: ventureData, products: productsData, reviews: reviewsData });
                
            } catch (err) {
                console.error('❌ Error cargando datos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadVentureData();
    }, [id]);

    // Dar/Quitar "Me gusta"
    const handleLike = async () => {
        try {
            const user = JSON.parse(localStorage.getItem('user') || '{}');
            if (!user.id) {
                navigate('/login');
                return;
            }
            
            const result = await toggleLike({
                usuario_id: user.id,
                emprendimiento_id: parseInt(id)
            });
            
            setUserHasLiked(result.liked);
            console.log('❤️ Like toggled:', result);
            
        } catch (err) {
            console.error('❌ Error al dar like:', err);
            alert('Error al dar like');
        }
    };

    // ✅ AGREGAR AL CARRITO
    const handleAddToCart = async (productId, productName) => {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        
        if (!user.id) {
            alert('Debes iniciar sesión para agregar productos al carrito');
            navigate('/login');
            return;
        }
        
        setAddingToCart(true);
        
        try {
            const result = await addToCart({
                usuario_id: user.id,
                producto_id: productId,
                cantidad: 1
            });
            
            alert(`✅ ${productName} agregado al carrito`);
            console.log('🛒 Producto agregado:', result);
            
        } catch (err) {
            console.error('❌ Error al agregar al carrito:', err);
            alert(err.message || 'Error al agregar al carrito');
        } finally {
            setAddingToCart(false);
        }
    };

    const getImageUrl = (imagen) => {
        if (!imagen) return null;
        if (imagen.startsWith('http')) return imagen;
        const url = `${BASE_URL}${imagen}`;
        return imgVersion ? `${url}?t=${imgVersion}` : url;
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando emprendimiento...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Error: {error}</div>
                <Link to="/ventures" className="btn btn-secondary">← Volver</Link>
            </div>
        );
    }

    if (!venture) {
        return (
            <div className="container text-center py-5">
                <h2>⚠️ Emprendimiento no encontrado</h2>
                <Link to="/ventures" className="btn btn-secondary">← Volver</Link>
            </div>
        );
    }

    const isOwner = loggedUser.id && venture.usuario_id === loggedUser.id;

    return (
        <div className="venture-detail-page">
            <div className="container">
                
                <Link to="/ventures" className="btn-back">
                    ← Volver al listado
                </Link>

                <div className="detail-grid">
                    
                    <div className="detail-left">
                        
                        <div className="info-card">
                            
                            <div className="venture-image">
                                {venture.imagen && !imageError ? (
                                    <img 
                                        src={getImageUrl(venture.imagen)} 
                                        alt={venture.nombre}
                                        onError={() => {
                                            console.warn('❌ Error cargando imagen:', venture.imagen);
                                            setImageError(true);
                                        }}
                                    />
                                ) : (
                                    <div className="no-image-placeholder">📦</div>
                                )}
                            </div>
                            
                            <h1 className="venture-title">{venture.nombre}</h1>
                            
                            <div className="venture-category-badge">
                                <span className="badge">
                                    {venture.categoria?.nombre || 'Sin categoría'}
                                </span>
                            </div>
                            
                            <div className="venture-rating">
                                <div className="stars">
                                    {[1, 2, 3, 4, 5].map(star => (
                                        <span key={star} className={star <= Math.floor(venture.calificacion) ? 'star filled' : 'star'}>
                                            ★
                                        </span>
                                    ))}
                                </div>
                                <span className="rating-value">{venture.calificacion || 0}</span>
                                <span className="reviews-count">({venture.num_resenas || 0} reseñas)</span>
                            </div>
                            
                            <div className="venture-location">
                                <i className="fas fa-map-marker-alt"></i> {venture.ubicacion || 'Ubicación no especificada'}
                            </div>
                            
                            <div className="action-buttons">
                                <button 
                                    className={`btn-like ${userHasLiked ? 'liked' : ''}`}
                                    onClick={handleLike}
                                >
                                    {userHasLiked ? '❤️ Te Gusta' : '🤍 Me Gusta'}
                                </button>
                                <button className="btn-contact">📞 Contactar</button>
                                <button className="btn-follow">👤 Seguir</button>
                            </div>
                        </div>
                        
                        <div className="description-card">
                            <h3>📄 Descripción</h3>
                            <p>{venture.descripcion}</p>
                        </div>
                    </div>

                    <div className="detail-right">
                        
                        <div className="tabs">
                            <button 
                                className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                                onClick={() => setActiveTab('products')}
                            >
                                🛍️ Productos ({products.length})
                            </button>
                            <button 
                                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                                onClick={() => setActiveTab('reviews')}
                            >
                                ⭐ Reseñas ({reviews.length})
                            </button>
                        </div>
                        
                        {/* ============ PRODUCTOS ============ */}
                        {activeTab === 'products' && (
                            <div className="products-section">
                                {isOwner && (
                                    <div className="add-product-button-container">
                                        <Link to={`/add-product/${venture.id}`} className="btn-add-product">
                                            ➕ Agregar Producto
                                        </Link>
                                    </div>
                                )}
                                
                                {products.length > 0 ? (
                                    <div className="products-grid">
                                        {products.map(product => (
                                            <div key={product.id} className="product-card">
                                                {product.imagen && (
                                                    <img 
                                                        src={getImageUrl(product.imagen)} 
                                                        alt={product.nombre}
                                                        className="product-image"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                        }}
                                                    />
                                                )}
                                                <div className="product-info">
                                                    <h4>{product.nombre}</h4>
                                                    <p className="product-description">{product.descripcion}</p>
                                                    <div className="product-price">${product.precio}</div>
                                                    <div className="product-meta">
                                                        <span className={`stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                                                            Stock: {product.stock}
                                                        </span>
                                                        <span className={`status ${product.estado === 'activo' ? 'active' : 'inactive'}`}>
                                                            {product.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                                                        </span>
                                                    </div>

                                                    {isOwner && (
                                                        <Link to={`/edit-product/${product.id}`} className="btn-edit-product">
                                                            ✏️ Editar
                                                        </Link>
                                                    )}
                                                    
                                                    {/* ✅ BOTÓN AGREGAR AL CARRITO */}
                                                    <button 
                                                        className="btn-add-to-cart"
                                                        onClick={() => handleAddToCart(product.id, product.nombre)}
                                                        disabled={addingToCart}
                                                    >
                                                        {addingToCart ? (
                                                            <>
                                                                <i className="fas fa-spinner fa-spin"></i> Agregando...
                                                            </>
                                                        ) : (
                                                            '🛒 Agregar al carrito'
                                                        )}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-message">
                                        <p>No hay productos disponibles.</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        {/* ============ RESEÑAS ============ */}
                        {activeTab === 'reviews' && (
                            <div className="reviews-section">
                                {loggedUser.id && (
                                    <div className="add-review-button-container">
                                        <Link to={`/add-review/${venture.id}`} className="btn-add-review">
                                            ⭐ Dejar Reseña
                                        </Link>
                                    </div>
                                )}
                                
                                {reviews.length > 0 ? (
                                    <div className="reviews-list">
                                        {reviews.map(review => (
                                            <div key={review.id} className="review-card">
                                                <div className="review-header">
                                                    <div className="reviewer-info">
                                                        <div className="avatar">
                                                            {review.usuario?.full_name?.charAt(0) || review.usuario?.username?.charAt(0) || 'U'}
                                                        </div>
                                                        <div>
                                                            <strong>{review.usuario?.full_name || review.usuario?.username || 'Usuario'}</strong>
                                                            <div className="review-date">
                                                                {new Date(review.created_at).toLocaleDateString('es-CO')}
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="review-stars">
                                                        {[1, 2, 3, 4, 5].map(star => (
                                                            <span key={star} className={star <= review.calificacion ? 'star filled' : 'star'}>
                                                                ★
                                                            </span>
                                                        ))}
                                                        <span className="rating">{review.calificacion}/5</span>
                                                    </div>
                                                </div>
                                                <p className="review-comment">{review.comentario}</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="empty-message">
                                        <div className="empty-icon">📝</div>
                                        <h4>Aún no hay reseñas</h4>
                                        <p>Sé el primero en compartir tu experiencia</p>
                                    </div>
                                )}
                            </div>
                        )}
                        
                        <div className="contact-card">
                            <h3>📞 Contacto</h3>
                            <div className="contact-info">
                                <div><strong>✉ Email:</strong> {venture.email_contacto || 'No disponible'}</div>
                                <div><strong>📱 Teléfono:</strong> {venture.telefono || 'No disponible'}</div>
                                <div><strong>🌐 Web:</strong> {venture.sitio_web || 'No disponible'}</div>
                            </div>
                            <div className="contact-buttons">
                                <button className="btn-whatsapp">📱 WhatsApp</button>
                                <button className="btn-email">✉ Email</button>
                                <button className="btn-web">🌐 Web</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VentureDetail;