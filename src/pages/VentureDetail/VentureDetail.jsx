/**
 * VentureDetail.jsx - Página de detalle de un emprendimiento
 * Muestra toda la información de un emprendimiento específico
 * Incluye: imágenes, descripción, productos, reseñas, contacto
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VentureDetail.css';

const VentureDetail = () => {
  const { id } = useParams(); // Obtener el ID de la URL
//   const navigate = useNavigate();
  
  // ============ ESTADOS ============
  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userHasLiked, setUserHasLiked] = useState(false);
//   const [userReview, setUserReview] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [activeTab, setActiveTab] = useState('products'); // products, reviews
  
  // ============ SIMULACIÓN DE DATOS (después conectas con API) ============
  useEffect(() => {
    // Simular carga de datos desde una API
    const loadVentureData = async () => {
      setLoading(true);
      
      // Datos simulados del emprendimiento
      const mockVenture = {
        id: parseInt(id),
        nombre: id === '1' ? 'GreenTech Solutions' : 
                id === '2' ? 'ArtesanaCo' : 'EduSmart',
        descripcion: 'Somos una empresa dedicada a ofrecer soluciones innovadoras para emprendedores. Nuestra misión es ayudar a otros negocios a crecer y alcanzar sus metas. Con más de 5 años de experiencia, hemos ayudado a más de 100 emprendedores a despegar sus proyectos.',
        categoria: { id: 1, nombre: 'Tecnología' },
        calificacion: 4.8,
        num_resenas: 124,
        ubicacion: 'Bogotá, Colombia',
        imagen: 'https://images.unsplash.com/photo-1551434678-e076c223a692?w=500',
        email_contacto: 'contacto@greentech.com',
        telefono: '+57 300 123 4567',
        sitio_web: 'www.greentech.com',
        usuario: { id: 1, username: 'emprededor123' },
        productos: [
          {
            id: 1,
            nombre: 'Kit Solar Portátil',
            descripcion: 'Panel solar portátil para cargar dispositivos electrónicos en cualquier lugar.',
            precio: 299900,
            stock: 15,
            estado: 'activo',
            disponible: true,
            imagen: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=300'
          },
          {
            id: 2,
            nombre: 'Sensor Inteligente',
            descripcion: 'Sensor para monitoreo de consumo energético en tiempo real.',
            precio: 149900,
            stock: 8,
            estado: 'activo',
            disponible: true,
            imagen: 'https://images.unsplash.com/photo-1581091226033-d5c48150dbaa?w=300'
          },
          {
            id: 3,
            nombre: 'App de Gestión',
            descripcion: 'Aplicación móvil para control de consumo energético.',
            precio: 99900,
            stock: 0,
            estado: 'inactivo',
            disponible: false,
            imagen: null
          }
        ],
        resenas: [
          {
            id: 1,
            usuario: { id: 2, username: 'carlos_dev', first_name: 'Carlos' },
            calificacion: 5,
            comentario: 'Excelente producto, muy recomendado. La atención al cliente es increíble.',
            fecha_creacion: '2024-01-15'
          },
          {
            id: 2,
            usuario: { id: 3, username: 'maria_b', first_name: 'María' },
            calificacion: 4,
            comentario: 'Muy buen servicio, solo mejoraría el tiempo de entrega.',
            fecha_creacion: '2024-01-10'
          },
          {
            id: 3,
            usuario: { id: 4, username: 'juan_p', first_name: 'Juan' },
            calificacion: 5,
            comentario: '¡Fantástico! Superó mis expectativas.',
            fecha_creacion: '2024-01-05'
          }
        ]
      };
      
      setVenture(mockVenture);
      setReviews(mockVenture.resenas);
      setLoading(false);
    };
    
    loadVentureData();
  }, [id]);
  
  // ============ FUNCIONES DE INTERACCIÓN ============
  const handleLike = () => {
    setUserHasLiked(!userHasLiked);
    // Aquí iría la llamada a la API
    console.log('Like toggled');
  };
  
  const handleContact = (method) => {
    console.log(`Contactar por: ${method}`);
    // Aquí iría la lógica de contacto
    alert(`Próximamente: contacto por ${method}`);
  };
  
  const handleAddToCart = (productoId) => {
    console.log(`Agregar al carrito: producto ${productoId}`);
    alert('✅ Producto agregado al carrito');
  };
  
  // ============ RENDERIZADO ============
  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando emprendimiento...</p>
      </div>
    );
  }
  
  if (!venture) {
    return (
      <div className="error-container">
        <h2>⚠️ Emprendimiento no encontrado</h2>
        <Link to="/ventures" className="btn-back">← Volver al listado</Link>
      </div>
    );
  }
  
  return (
    <div className="venture-detail-page">
      <div className="container">
        
        {/* Botón Volver */}
        <Link to="/ventures" className="btn-back">
          ← Volver al listado
        </Link>
        
        <div className="detail-grid">
          
          {/* ============ COLUMNA IZQUIERDA ============ */}
          <div className="detail-left">
            
            {/* Tarjeta de información principal */}
            <div className="info-card">
              
              {/* Imagen principal */}
              {venture.imagen && (
                <div className="venture-image">
                  <img src={venture.imagen} alt={venture.nombre} />
                </div>
              )}
              
              {/* Título */}
              <h1 className="venture-title">{venture.nombre}</h1>
              
              {/* Categoría */}
              <div className="venture-category-badge">
                <span className="badge">{venture.categoria.nombre}</span>
              </div>
              
              {/* Calificación */}
              <div className="venture-rating">
                <div className="stars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <span key={star} className={star <= Math.floor(venture.calificacion) ? 'star filled' : 'star'}>
                      ★
                    </span>
                  ))}
                </div>
                <span className="rating-value">{venture.calificacion}</span>
                <span className="reviews-count">({venture.num_resenas} reseñas)</span>
              </div>
              
              {/* Ubicación */}
              <div className="venture-location">
                <i className="fas fa-map-marker-alt"></i> {venture.ubicacion}
              </div>
              
              {/* Botones de acción */}
              <div className="action-buttons">
                <button 
                  className={`btn-like ${userHasLiked ? 'liked' : ''}`}
                  onClick={handleLike}
                >
                  {userHasLiked ? '❤️ Te Gusta' : '🤍 Me Gusta'}
                </button>
                
                <button className="btn-contact" onClick={() => handleContact('whatsapp')}>
                  📞 Contactar
                </button>
                
                <button className="btn-follow">
                  👤 Seguir
                </button>
              </div>
              
              {/* Botones de edición (solo dueño) */}
              {venture.usuario.id === 1 && ( // Simular que es el dueño
                <div className="owner-actions">
                  <hr />
                  <div className="owner-buttons">
                    <Link to={`/edit-venture/${venture.id}`} className="btn-edit">
                      ✏️ Editar
                    </Link>
                    <button className="btn-delete" onClick={() => alert('¿Eliminar?')}>
                      🗑️ Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Descripción */}
            <div className="description-card">
              <h3>📄 Descripción</h3>
              <p>{venture.descripcion}</p>
            </div>
          </div>
          
          {/* ============ COLUMNA DERECHA ============ */}
          <div className="detail-right">
            
            {/* Tabs de navegación */}
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'products' ? 'active' : ''}`}
                onClick={() => setActiveTab('products')}
              >
                🛍️ Productos ({venture.productos.length})
              </button>
              <button 
                className={`tab ${activeTab === 'reviews' ? 'active' : ''}`}
                onClick={() => setActiveTab('reviews')}
              >
                ⭐ Reseñas ({reviews.length})
              </button>
            </div>
            
            {/* ============ TAB: PRODUCTOS ============ */}
            {activeTab === 'products' && (
              <div className="products-section">
                
                {/* Botón agregar producto (solo dueño) */}
                {venture.usuario.id === 1 && (
                  <Link to={`/add-product/${venture.id}`} className="btn-add-product">
                    ➕ Agregar Producto
                  </Link>
                )}
                
                <div className="products-grid">
                  {venture.productos.map(producto => (
                    <div key={producto.id} className="product-card">
                      {/* Imagen del producto */}
                      {producto.imagen ? (
                        <img src={producto.imagen} alt={producto.nombre} />
                      ) : (
                        <div className="no-image">📦 Sin imagen</div>
                      )}
                      
                      <div className="product-info">
                        <h4>{producto.nombre}</h4>
                        <p className="product-description">{producto.descripcion}</p>
                        
                        <div className="product-price">
                          ${producto.precio.toLocaleString('es-CO')}
                        </div>
                        
                        <div className="product-meta">
                          <span className={`stock ${producto.stock > 0 ? 'in-stock' : 'out-stock'}`}>
                            Stock: {producto.stock}
                          </span>
                          <span className={`status ${producto.estado === 'activo' ? 'active' : 'inactive'}`}>
                            {producto.estado === 'activo' ? '✅ Activo' : '❌ Inactivo'}
                          </span>
                        </div>
                        
                        {/* Botón agregar al carrito */}
                        {producto.disponible ? (
                          <button 
                            className="btn-add-to-cart"
                            onClick={() => handleAddToCart(producto.id)}
                          >
                            🛒 Agregar al carrito
                          </button>
                        ) : (
                          <button className="btn-unavailable" disabled>
                            No disponible
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                {venture.productos.length === 0 && (
                  <div className="empty-message">
                    <p>Aún no hay productos disponibles.</p>
                  </div>
                )}
              </div>
            )}
            
            {/* ============ TAB: RESEÑAS ============ */}
            {activeTab === 'reviews' && (
              <div className="reviews-section">
                
                {/* Botón escribir reseña */}
                <div className="reviews-header">
                  <h3>⭐ Reseñas ({reviews.length})</h3>
                  <Link to={`/add-review/${venture.id}`} className="btn-write-review">
                    ✍️ Escribir Reseña
                  </Link>
                </div>
                
                {/* Lista de reseñas */}
                {reviews.length > 0 ? (
                  <div className="reviews-list">
                    {reviews.map(review => (
                      <div key={review.id} className="review-card">
                        <div className="review-header">
                          <div className="reviewer-info">
                            <div className="avatar">
                              {review.usuario.first_name?.charAt(0) || review.usuario.username.charAt(0)}
                            </div>
                            <div>
                              <strong>{review.usuario.first_name || review.usuario.username}</strong>
                              <div className="review-date">
                                {new Date(review.fecha_creacion).toLocaleDateString('es-CO')}
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
            
            {/* ============ CONTACTO ============ */}
            <div className="contact-card">
              <h3>📞 Contacto</h3>
              
              <div className="contact-info">
                <div><strong>✉ Email:</strong> {venture.email_contacto}</div>
                <div><strong>📱 Teléfono:</strong> {venture.telefono}</div>
                <div><strong>🌐 Web:</strong> {venture.sitio_web}</div>
              </div>
              
              <div className="contact-buttons">
                <button className="btn-whatsapp" onClick={() => handleContact('whatsapp')}>
                  📱 WhatsApp
                </button>
                <button className="btn-email" onClick={() => handleContact('email')}>
                  ✉ Email
                </button>
                <button className="btn-web" onClick={() => window.open(`https://${venture.sitio_web}`, '_blank')}>
                  🌐 Web
                </button>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default VentureDetail;