/**
 * CourseDetail.jsx - Detalle de Curso
 * Muestra la información completa de un curso específico
 * SIN API - SIN useEffect - Datos directos
 */

import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';  // ← Eliminamos useNavigate
import './CourseDetail.css';

const CourseDetail = () => {
  const { id } = useParams();
  // const navigate = useNavigate();  // ← ELIMINADO - no se usa
  
  // ✅ HOOKS PRIMERO
  const [expandedModule, setExpandedModule] = useState(1);

  // ✅ Verificar login DESPUÉS de los hooks
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

  // ✅ Datos FIJOS - Cursos disponibles
  const coursesData = {
    '1': {
      id: 1,
      nombre: 'Finanzas para Emprendedores',
      descripcion: 'Aprende a manejar las finanzas de tu emprendimiento. Este curso te enseñará a crear presupuestos, gestionar flujo de caja, analizar estados financieros y tomar decisiones basadas en datos.',
      instructor: 'Carlos López',
      duracion: '20 horas',
      nivel: 'Principiante',
      modalidad: 'Online',
      fecha_proxima: '10 Ene 2025',
      certificado: 'Incluido',
      color: 'warning',
      badge: '💡 Principiante',
      badgeColor: 'success',
      features: [
        'Gestión de flujo de caja',
        'Elaboración de estados financieros',
        'Análisis de viabilidad de proyectos',
        'Estrategias de financiamiento',
        'Planificación fiscal'
      ],
      temario: [
        { id: 1, titulo: 'Módulo 1: Fundamentos Financieros', contenido: 'Introducción a las finanzas empresariales, conceptos básicos y terminología.' },
        { id: 2, titulo: 'Módulo 2: Presupuestos y Control', contenido: 'Creación de presupuestos, control de gastos y seguimiento financiero.' },
        { id: 3, titulo: 'Módulo 3: Análisis Financiero', contenido: 'Interpretación de estados financieros y toma de decisiones.' }
      ]
    },
    '2': {
      id: 2,
      nombre: 'Marketing Digital',
      descripcion: 'Domina las estrategias de marketing digital para hacer crecer tu negocio. Aprenderás SEO, SEM, redes sociales, email marketing y análisis de métricas.',
      instructor: 'María Pérez',
      duracion: '30 horas',
      nivel: 'Intermedio',
      modalidad: 'Online',
      fecha_proxima: '15 Dic 2024',
      certificado: 'Incluido',
      color: 'success',
      badge: '🔥 Popular',
      badgeColor: 'warning',
      features: [
        'Estrategias de SEO para posicionar tu web',
        'Gestión de redes sociales para negocios',
        'Campañas de publicidad en Google y Facebook',
        'Análisis de métricas y ROI',
        'Email marketing efectivo'
      ],
      temario: [
        { id: 1, titulo: 'Módulo 1: Fundamentos de Marketing Digital', contenido: 'Introducción al marketing digital, buyer persona, customer journey.' },
        { id: 2, titulo: 'Módulo 2: SEO y Contenido', contenido: 'Optimización para motores de búsqueda, estrategias de contenido.' },
        { id: 3, titulo: 'Módulo 3: Redes Sociales y Publicidad', contenido: 'Gestión de redes sociales, campañas pagadas y análisis de resultados.' }
      ]
    },
    '3': {
      id: 3,
      nombre: 'Escalabilidad Empresarial',
      descripcion: 'Desarrolla estrategias para escalar tu negocio de manera sostenible. Aprende sobre modelos de crecimiento, automatización, expansión y gestión de equipos.',
      instructor: 'Ana García',
      duracion: '15 horas',
      nivel: 'Avanzado',
      modalidad: 'Híbrida',
      fecha_proxima: '5 Dic 2024',
      certificado: 'Incluido',
      color: 'primary',
      badge: '🚀 Avanzado',
      badgeColor: 'danger',
      features: [
        'Modelos de escalabilidad empresarial',
        'Gestión del crecimiento organizacional',
        'Automatización de procesos',
        'Expansión a nuevos mercados',
        'Gestión de equipos en crecimiento'
      ],
      temario: [
        { id: 1, titulo: 'Módulo 1: Fundamentos de Escalabilidad', contenido: 'Conceptos básicos de escalabilidad y modelos de crecimiento.' },
        { id: 2, titulo: 'Módulo 2: Automatización y Procesos', contenido: 'Estrategias de automatización y optimización de procesos.' },
        { id: 3, titulo: 'Módulo 3: Expansión y Gestión', contenido: 'Expansión a nuevos mercados y gestión de equipos en crecimiento.' }
      ]
    }
  };

  const course = coursesData[id];

  // Si no existe el curso
  if (!course) {
    return (
      <div className="course-detail-page">
        <div className="container">
          <div className="not-found">
            <h2>⚠️ Curso no encontrado</h2>
            <p>El curso que buscas no está disponible.</p>
            <Link to="/my-courses" className="btn-back-courses">
              ← Volver a Mis Cursos
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Toggle módulo del temario
  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  // Obtener clase de color para el header
  const getHeaderClass = () => {
    const classes = {
      'success': 'header-success',
      'primary': 'header-primary',
      'warning': 'header-warning'
    };
    return classes[course.color] || 'header-primary';
  };

  // Obtener clase de color para el botón de inscripción
  const getButtonClass = () => {
    const classes = {
      'success': 'btn-success',
      'primary': 'btn-primary',
      'warning': 'btn-warning'
    };
    return classes[course.color] || 'btn-primary';
  };

  return (
    <div className="course-detail-page">
      <div className="container">
        <div className="row">
          <div className="col-md-8 mx-auto">
            
            {/* Botón de volver */}
            <Link to="/my-courses" className="btn-back-courses">
              ← Volver a Mis Cursos
            </Link>

            {/* Tarjeta del curso */}
            <div className="course-card">
              
              {/* Header dinámico */}
              <div className={`course-header ${getHeaderClass()}`}>
                <h2 className="course-name">{course.nombre}</h2>
                <span className={`course-badge badge-${course.badgeColor}`}>
                  {course.badge}
                </span>
              </div>
              
              <div className="course-body">
                
                {/* Información del curso */}
                <div className="course-info-grid">
                  <div className="course-info-col">
                    <p><strong>Duración:</strong> {course.duracion}</p>
                    <p><strong>Nivel:</strong> {course.nivel}</p>
                    <p><strong>Próxima fecha:</strong> {course.fecha_proxima}</p>
                  </div>
                  <div className="course-info-col">
                    <p><strong>Instructor:</strong> {course.instructor}</p>
                    <p><strong>Modalidad:</strong> {course.modalidad}</p>
                    <p><strong>Certificado:</strong> {course.certificado}</p>
                  </div>
                </div>

                {/* Descripción */}
                <h4 className="section-title">📋 Descripción del Curso</h4>
                <p className="course-description">{course.descripcion}</p>

                {/* Lo que aprenderás */}
                <h4 className="section-title">🎯 Lo que aprenderás</h4>
                <ul className="features-list">
                  {course.features.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>

                {/* Temario (solo para Marketing Digital) */}
                {course.id === 2 && (
                  <>
                    <h4 className="section-title">📚 Temario</h4>
                    <div className="accordion">
                      {course.temario.map((module) => (
                        <div key={module.id} className="accordion-item">
                          <button 
                            className={`accordion-button ${expandedModule === module.id ? 'active' : ''}`}
                            onClick={() => toggleModule(module.id)}
                          >
                            {module.titulo}
                            <span className="accordion-icon">
                              {expandedModule === module.id ? '−' : '+'}
                            </span>
                          </button>
                          <div className={`accordion-content ${expandedModule === module.id ? 'open' : ''}`}>
                            <p>{module.contenido}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* Botón de inscripción */}
                <div className="enroll-section">
                  {isLoggedIn ? (
                    <button className={`btn-enroll ${getButtonClass()}`}>
                      📝 Inscribirse en este curso
                    </button>
                  ) : (
                    <Link to="/login" className="btn-enroll-login">
                      📝 Iniciar sesión para inscribirse
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;