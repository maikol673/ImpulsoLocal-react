/**
 * Courses.jsx - Formación para Emprendedores
 * Muestra todos los cursos disponibles para inscribirse
 * SIN API - SIN useEffect - Datos directos
 */

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Courses.css';

const Courses = () => {
  const navigate = useNavigate();
  
  // ✅ Datos FIJOS - Cursos disponibles
  const courses = [
    {
      id: 1,
      nombre: 'Finanzas para Emprendedores',
      descripcion: 'Aprende a manejar las finanzas de tu emprendimiento. Incluye presupuestos, flujo de caja, y análisis financiero para tomar mejores decisiones.',
      duracion: '20 horas',
      nivel: 'Principiante',
      fecha_proxima: '10 Ene 2025',
      color: 'warning',
      badge: '💡 Principiante',
      badgeColor: 'success',
      features: ['Certificado incluido', 'Acceso de por vida', 'Soporte personalizado']
    },
    {
      id: 2,
      nombre: 'Marketing Digital',
      descripcion: 'Domina las estrategias de marketing digital para hacer crecer tu negocio. Incluye SEO, SEM, redes sociales y email marketing.',
      duracion: '30 horas',
      nivel: 'Intermedio',
      fecha_proxima: '15 Dic 2024',
      color: 'success',
      badge: '🔥 Popular',
      badgeColor: 'warning',
      features: ['Certificado incluido', 'Acceso de por vida', 'Soporte personalizado']
    },
    {
      id: 3,
      nombre: 'Escalabilidad Empresarial',
      descripcion: 'Desarrolla estrategias para escalar tu negocio de manera sostenible. Aprende sobre modelos de crecimiento, automatización y expansión.',
      duracion: '15 horas',
      nivel: 'Avanzado',
      fecha_proxima: '5 Dic 2024',
      color: 'primary',
      badge: '🚀 Avanzado',
      badgeColor: 'danger',
      features: ['Certificado incluido', 'Acceso de por vida', 'Soporte personalizado']
    }
  ];

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // Obtener clase de color para el header
  const getHeaderClass = (color) => {
    const classes = {
      'success': 'header-success',
      'primary': 'header-primary',
      'warning': 'header-warning'
    };
    return classes[color] || 'header-primary';
  };

  // Obtener clase de color para el badge
  const getBadgeClass = (badgeColor) => {
    const classes = {
      'warning': 'badge-warning',
      'danger': 'badge-danger',
      'success': 'badge-success'
    };
    return classes[badgeColor] || 'badge-success';
  };

  // Obtener clase de color para el botón de inscripción
  const getButtonClass = (color) => {
    const classes = {
      'success': 'btn-success',
      'primary': 'btn-primary',
      'warning': 'btn-warning'
    };
    return classes[color] || 'btn-primary';
  };

  return (
    <div className="courses-page">
      <div className="container">
        
        {/* ============ HEADER CON BOTÓN VOLVER ============ */}
        <div className="courses-header">
          <div className="courses-header-left">
            <Link to="/" className="btn-back-home-courses">
              <i className="fas fa-arrow-left"></i> Volver al inicio
            </Link>
            <h1 className="courses-title">Formación para Emprendedores</h1>
          </div>
        </div>
        
        <p className="courses-subtitle">Desarrolla tus habilidades y haz crecer tu negocio</p>

        <div className="courses-grid">
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              
              {/* Header dinámico */}
              <div className={`course-header-card ${getHeaderClass(course.color)}`}>
                <h4 className="course-card-name">{course.nombre}</h4>
                <span className={`course-card-badge ${getBadgeClass(course.badgeColor)}`}>
                  {course.badge}
                </span>
              </div>
              
              <div className="course-card-body">
                
                {/* Badges de duración y nivel */}
                <div className="course-card-badges">
                  <span className="badge-duracion">{course.duracion}</span>
                  <span className={`badge-nivel ${getHeaderClass(course.color)}`}>
                    Nivel: {course.nivel}
                  </span>
                </div>
                
                <p className="course-card-description">{course.descripcion}</p>
                
                {/* Características */}
                <div className="course-features">
                  <ul className="features-list-simple">
                    {course.features.map((feature, index) => (
                      <li key={index}>✅ {feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="course-card-footer">
                <div className="course-next-date">
                  <strong>Próxima fecha:</strong> {course.fecha_proxima}
                </div>
                
                {isLoggedIn ? (
                  <button className={`btn-enroll-course ${getButtonClass(course.color)}`}>
                    📝 Inscribirse
                  </button>
                ) : (
                  <button 
                    className="btn-enroll-login-course"
                    onClick={() => navigate('/login')}
                  >
                    📝 Iniciar sesión para inscribirse
                  </button>
                )}
                
                <Link to={`/course/${course.id}`} className="btn-details-course">
                  ℹ️ Ver Detalles
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* ============ SECCIÓN DE INFORMACIÓN ============ */}
        <div className="info-section">
          <div className="info-card">
            <h3>🎓 ¿Por qué elegir nuestros cursos?</h3>
            <div className="info-grid">
              <div className="info-item">
                <h5>👨‍🏫 Expertos del sector</h5>
                <p>Instructores con experiencia real en emprendimiento</p>
              </div>
              <div className="info-item">
                <h5>💼 Enfoque práctico</h5>
                <p>Aplicación inmediata en tu negocio</p>
              </div>
              <div className="info-item">
                <h5>🤝 Comunidad activa</h5>
                <p>Networking con otros emprendedores</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Courses;