/**
 * Courses.jsx - Formación para Emprendedores
 * CON API REAL - INSCRIPCIÓN A CURSOS
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getCourses, enrollCourse, getMyCourses } from '../../services/api';
import './Courses.css';

const Courses = () => {
    const navigate = useNavigate();
    
    // ============================================================
    // ✅ TODOS LOS HOOKS PRIMERO (Declarados incondicionalmente)
    // ============================================================
    const [courses, setCourses] = useState([]);
    const [myCourses, setMyCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState({});

    // Recuperamos el usuario de forma segura
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    // Cargar cursos y verificar sesión
    useEffect(() => {
        // Redirección si no hay sesión iniciada
        if (!user.id) {
            navigate('/login');
            return;
        }

        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                
                // Cargar todos los cursos y cursos del usuario en paralelo
                const [coursesData, myCoursesData] = await Promise.all([
                    getCourses(),
                    getMyCourses(user.id)
                ]);

                setCourses(Array.isArray(coursesData) ? coursesData : []);
                setMyCourses(Array.isArray(myCoursesData) ? myCoursesData : []);
                
                console.log('📚 Cursos cargados:', coursesData);
                console.log('📚 Mis cursos:', myCoursesData);
                
            } catch (err) {
                console.error('❌ Error cargando cursos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        loadData();
    }, [user.id, navigate]); // Dependencias estables

    // ✅ INSCRIBIRSE A UN CURSO
    const handleEnroll = async (cursoId, nombre) => {
        if (!user.id) {
            alert('Debes iniciar sesión para inscribirte');
            navigate('/login');
            return;
        }

        // Verificar si ya está inscrito
        const yaInscrito = myCourses.some(mc => mc.curso_id === cursoId);
        if (yaInscrito) {
            alert('⚠️ Ya estás inscrito en este curso');
            return;
        }

        setProcessing(prev => ({ ...prev, [cursoId]: true }));

        try {
            const data = {
                usuario_id: user.id,
                curso_id: cursoId
            };

            console.log(`📡 Inscribiendo al curso: ${nombre}`);
            const response = await enrollCourse(data);

            if (response) {
                alert(`✅ Inscripción exitosa al curso "${nombre}"`);
                
                // Actualizar mis cursos
                setMyCourses(prev => [...prev, {
                    curso_id: cursoId,
                    curso: courses.find(c => c.id === cursoId),
                    progreso: 0
                }]);
            }
        } catch (err) {
            console.error('❌ Error:', err);
            if (err.message === 'Ya estás inscrito en este curso') {
                alert('⚠️ Ya estás inscrito en este curso');
            } else {
                alert('❌ Error al inscribirte. Intenta nuevamente.');
            }
        } finally {
            setProcessing(prev => ({ ...prev, [cursoId]: false }));
        }
    };

    // Verificar si ya está inscrito
    const isEnrolled = (cursoId) => {
        return myCourses.some(mc => mc.curso_id === cursoId);
    };

    // Obtener nivel en español
    const getNivelText = (nivel) => {
        const niveles = {
            'principiante': 'Principiante',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        return niveles[nivel] || nivel;
    };

    // Obtener clase de nivel
    const getNivelClass = (nivel) => {
        const clases = {
            'principiante': 'nivel-beginner',
            'intermedio': 'nivel-intermediate',
            'avanzado': 'nivel-advanced'
        };
        return clases[nivel] || 'nivel-beginner';
    };

    // Obtener clase de color para el header
    const getHeaderClass = (nivel) => {
        const clases = {
            'principiante': 'header-beginner',
            'intermedio': 'header-intermediate',
            'avanzado': 'header-advanced'
        };
        return clases[nivel] || 'header-beginner';
    };

    // ============================================================
    // ✅ RENDERIZADOS CONDICIONALES (Siempre al final)
    // ============================================================

    // Prevenir renderizado visual antes de que la navegación actúe
    if (!user.id) {
        return null;
    }

    if (loading) {
        return (
            <div className="courses-page">
                <div className="container text-center py-5">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Cargando...</span>
                    </div>
                    <p className="mt-2">Cargando cursos...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="courses-page">
                <div className="container text-center py-5">
                    <div className="alert alert-danger">Error: {error}</div>
                    <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="courses-page">
            <div className="container">
                
                {/* Header */}
                <div className="courses-header">
                    <div className="courses-header-left">
                        <Link to="/" className="btn-back-home-courses">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="courses-title">📚 Formación</h1>
                    </div>
                    <Link to="/my-courses" className="btn-my-courses">
                        📖 Mis Cursos
                    </Link>
                </div>
                
                <p className="courses-subtitle">Desarrolla tus habilidades y haz crecer tu negocio</p>

                {courses.length === 0 ? (
                    <p className="text-center text-muted py-4">No hay cursos disponibles por el momento.</p>
                ) : (
                    <div className="courses-grid">
                        {courses.map(course => {
                            const enrolled = isEnrolled(course.id);
                            
                            return (
                                <div key={course.id} className="course-card">
                                    
                                    <div className={`course-header-card ${getHeaderClass(course.nivel)}`}>
                                        <h4 className="course-card-name">{course.nombre}</h4>
                                        <span className={`course-card-badge ${getNivelClass(course.nivel)}`}>
                                            {getNivelText(course.nivel)}
                                        </span>
                                    </div>
                                    
                                    <div className="course-card-body">
                                        <div className="course-card-badges">
                                            <span className="badge-duracion">{course.duracion}</span>
                                            <span className="badge-modalidad">
                                                {course.modalidad === 'online' ? '🖥️ Online' : '🏫 Presencial'}
                                            </span>
                                        </div>
                                        
                                        <p className="course-card-description">{course.descripcion}</p>
                                        
                                        <div className="course-features">
                                            <ul className="features-list-simple">
                                                <li>✅ Certificado incluido</li>
                                                <li>✅ Acceso de por vida</li>
                                                <li>✅ Soporte personalizado</li>
                                            </ul>
                                        </div>
                                    </div>
                                    
                                    <div className="course-card-footer">
                                        <div className="course-next-date">
                                            <strong>Próxima fecha:</strong> {course.fecha_proxima || 'Flexible'}
                                        </div>
                                        
                                        {enrolled ? (
                                            <button className="btn-enrolled" disabled>
                                                ✅ Ya inscrito
                                            </button>
                                        ) : (
                                            <button 
                                                className="btn-enroll-course"
                                                onClick={() => handleEnroll(course.id, course.nombre)}
                                                disabled={processing[course.id]}
                                            >
                                                {processing[course.id] ? (
                                                    <>
                                                        <i className="fas fa-spinner fa-spin"></i> Inscribiendo...
                                                    </>
                                                ) : (
                                                    '📝 Inscribirse'
                                                )}
                                            </button>
                                        )}
                                        
                                        <Link to={`/course/${course.id}`} className="btn-details-course">
                                            ℹ️ Ver Detalles
                                        </Link>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}

                {/* Sección de información */}
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