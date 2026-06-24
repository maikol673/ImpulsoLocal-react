/**
 * VentureDetail.jsx - Página de detalle de un emprendimiento

 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import './VentureDetail.css';

const VentureDetail = () => {
  const { id } = useParams();
  
  const [venture, setVenture] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userHasLiked, setUserHasLiked] = useState(false);
  const [reviews, setReviews] = useState([]);

  // esta linea la comente por el momento para que no me saliera en rojo el codigo
  // const [activeTab, setActiveTab] = useState('products');

  useEffect(() => {
    const loadVentureData = async () => {
      setLoading(true);
      
      // Datos simulados (igual que Django)
      const mockVenture = {
        id: parseInt(id),
        nombre: id === '1' ? 'Yupi' : 'GreenTech',
        descripcion: 'empresa de alimentos empaquetados',
        categoria: { id: 1, nombre: 'Alimentario y bebidas' },
        calificacion: 4.5,
        num_resenas: 0,
        ubicacion: 'cal, colombia',
        imagen: null,
        email_contacto: 'contacto@yupi.com',
        telefono: '+57 300 123 4567',
        sitio_web: 'www.yupi.com',
        usuario: { id: 1, username: 'emprededor123' },
        productos: [
          {
            id: 1,
            nombre: 'Galletas de Chocolate',
            descripcion: 'gallitas artesanales',
            precio: 2500,
            stock: 10,
            estado: 'activo',
            disponible: true,
            imagen: null
          }
        ]
      };
      
      setVenture(mockVenture);
      setReviews([]);
      setLoading(false);
    };
    
    loadVentureData();
  }, [id]);
  
  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }
  
  if (!venture) {
    return (
      <div className="container text-center py-5">
        <h2>Emprendimiento no encontrado</h2>
        <Link to="/ventures" className="btn btn-secondary">← Volver</Link>
      </div>
    );
  }
  
  return (
    <div className="container py-4">
      
      {/* Botón Volver */}
      <Link to="/ventures" className="btn btn-secondary mb-4">
        ← Volver
      </Link>
      
      <div className="row g-4">
        
        {/* ============ COLUMNA IZQUIERDA ============ */}
        <div className="col-lg-4">
          
          {/* Card de información */}
          <div className="card shadow-sm border-0 p-3">
            
            {/* Imagen principal */}
            {venture.imagen && (
              <div className="text-center mb-3">
                <img src={venture.imagen} className="img-fluid rounded shadow-sm" alt={venture.nombre} />
              </div>
            )}
            
            {/* Título */}
            <h2 className="fw-bold text-capitalize mb-1 text-center">
              {venture.nombre}
            </h2>
            
            {/* Categoría */}
            <div className="text-center mt-2 mb-3">
              <span className="badge bg-primary px-3 py-2 fs-6">
                {venture.categoria.nombre}
              </span>
            </div>
            
            {/* Calificación */}
            <p className="text-center mb-1 fs-6">
              ⭐ {venture.calificacion}  
              <span className="text-muted">({venture.num_resenas} reseñas)</span>
            </p>
            
            {/* Ubicación */}
            <p className="text-muted text-center mb-3">
              📍 {venture.ubicacion}
            </p>
            
            {/* Botón Dejar Reseña */}
            <div className="mb-3">
              <Link to={`/add-review/${venture.id}`} className="btn btn-warning w-100">
                ⭐ Dejar Reseña
              </Link>
            </div>
            
            {/* ACCIONES */}
            <div className="d-grid gap-2">
              
              {/* Me Gusta */}
              <button 
                className={`btn ${userHasLiked ? 'btn-danger' : 'btn-outline-danger'}`}
                onClick={() => setUserHasLiked(!userHasLiked)}
              >
                {userHasLiked ? '❤️ Te Gusta' : '🤍 Me Gusta'}
              </button>
              
              {/* Contactar */}
              <button className="btn btn-primary">
                📞 Contactar
              </button>
              
              {/* Seguir */}
              <button className="btn btn-outline-primary">
                👤 Seguir
              </button>
              
              {/* Ver Métricas (solo dueño) */}
              {venture.usuario.id === 1 && (
                <Link to={`/dashboard/${venture.id}`} className="btn btn-info mt-2">
                  📊 Ver Métricas
                </Link>
              )}
            </div>
            
            {/* OPCIONES DE EDICIÓN (solo dueño) */}
            {venture.usuario.id === 1 && (
              <>
                <hr />
                <div className="d-flex gap-2">
                  <Link to={`/edit-venture/${venture.id}`} className="btn btn-warning w-50">
                    ✏ Editar
                  </Link>
                  <button className="btn btn-danger w-50">
                    🗑 Eliminar
                  </button>
                </div>
              </>
            )}
          </div>
          
          {/* DESCRIPCIÓN */}
          <div className="card shadow-sm border-0 p-3 mt-3">
            <h4 className="fw-bold mb-2">📄 Descripción</h4>
            <p className="text-muted mb-0" style={{ lineHeight: 1.6 }}>
              {venture.descripcion}
            </p>
          </div>
        </div>
        
        {/* ============ COLUMNA DERECHA ============ */}
        <div className="col-lg-8">
          
          {/* PRODUCTOS */}
          <div className="card shadow-sm border-0">
            <div className="card-header bg-info text-white py-3">
              <h4 className="mb-0">🛍 Productos de {venture.nombre}</h4>
            </div>
            
            <div className="card-body">
              
              {/* Botón Agregar Producto (solo dueño) */}
              {venture.usuario.id === 1 && (
                <Link to={`/add-product/${venture.id}`} className="btn btn-success btn-sm mb-3">
                  ➕ Agregar Producto
                </Link>
              )}
              
              <div className="row g-3">
                {venture.productos.map(producto => (
                  <div key={producto.id} className="col-md-6 col-lg-4">
                    <div className="card h-100 border-0 shadow-sm producto-card">
                      
                      {/* Imagen del producto */}
                      {producto.imagen ? (
                        <img src={producto.imagen} className="card-img-top rounded-top" 
                             style={{ height: '190px', objectFit: 'cover' }} alt={producto.nombre} />
                      ) : (
                        <div className="card-img-top bg-light d-flex align-items-center justify-content-center rounded-top"
                             style={{ height: '190px' }}>
                          <span className="text-muted">Sin imagen</span>
                        </div>
                      )}
                      
                      <div className="card-body">
                        <h6 className="fw-bold mb-1">{producto.nombre}</h6>
                        <p className="text-muted small mb-2">
                          {producto.descripcion}
                        </p>
                        <span className="fw-bold text-success d-block mb-1">
                          ${producto.precio.toLocaleString()}
                        </span>
                        <small className="text-muted">
                          Stock: {producto.stock} |
                          <span className={producto.estado === 'activo' ? 'text-success' : 'text-danger'}>
                            {producto.estado === 'activo' ? ' Activo' : ' Inactivo'}
                          </span>
                        </small>
                      </div>
                      
                      <div className="card-footer bg-white border-0">
                        {producto.disponible ? (
                          <button className="btn btn-primary btn-sm w-100">
                            🛒 Agregar al carrito
                          </button>
                        ) : (
                          <button className="btn btn-secondary btn-sm w-100" disabled>
                            No Disponible
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {venture.productos.length === 0 && (
                <p className="text-center text-muted mt-3">
                  Aún no hay productos disponibles.
                </p>
              )}
            </div>
          </div>
          
          {/* RESEÑAS */}
          <div className="card shadow-sm border-0 p-3 mt-4">
            
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="mb-0">⭐ Reseñas ({reviews.length})</h4>
              <Link to={`/add-review/${venture.id}`} className="btn btn-warning btn-sm">
                ✍️ Escribir Reseña
              </Link>
            </div>
            
            {reviews.length > 0 ? (
              <div>
                {reviews.map(review => (
                  <div key={review.id} className="bg-light p-3 rounded mb-3">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div className="d-flex align-items-center">
                        <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2"
                             style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                          {review.usuario.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <strong>{review.usuario}</strong>
                          <div className="text-muted small">{review.fecha}</div>
                        </div>
                      </div>
                      <div className="text-warning">
                        {'★'.repeat(review.calificacion)}{'☆'.repeat(5 - review.calificacion)}
                        <span className="ms-1 fw-bold text-dark">{review.calificacion}/5</span>
                      </div>
                    </div>
                    <p className="mb-0">{review.comentario}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4">
                <div className="text-muted mb-2" style={{ fontSize: '3rem' }}>📝</div>
                <h5 className="text-muted">Aún no hay reseñas</h5>
                <p className="text-muted small">Sé el primero en compartir tu experiencia</p>
              </div>
            )}
          </div>
          
          {/* CONTACTO */}
          <div className="card shadow-sm border-0 p-3 mt-4">
            <h4 className="mb-3">📞 Contacto</h4>
            
            <div className="mb-2"><strong>✉ Email:</strong> {venture.email_contacto}</div>
            <div className="mb-2"><strong>📱 Teléfono:</strong> {venture.telefono}</div>
            <div className="mb-2"><strong>🌐 Web:</strong> {venture.sitio_web}</div>
            
            <div className="d-flex gap-2 mt-3">
              <button className="btn btn-primary w-25">📱 WhatsApp</button>
              <button className="btn btn-success w-25">✉ Email</button>
              <button className="btn btn-outline-primary w-25">🌐 Web</button>
            </div>
          </div>
          
        </div>
      </div>
      
      <style>{`
        .producto-card {
          cursor: pointer;
          transition: transform .2s, box-shadow .2s;
        }
        .producto-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 6px 18px rgba(0,0,0,.12);
        }
      `}</style>
      
    </div>
  );
};

export default VentureDetail;