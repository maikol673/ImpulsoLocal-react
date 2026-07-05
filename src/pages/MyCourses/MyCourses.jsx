/**
 * MyCourses.jsx - Mis Cursos
 * Muestra los cursos a los que el usuario está inscrito
 * CON API REAL
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getMyCourses } from '../../services/api';
import './MyCourses.css';

const MyCourses = () => {
    const navigate = useNavigate();
    
    const [courses, setCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [unsubscribing, setUnsubscribing] = useState(false);

    // Obtener usuario logueado
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const userId = user?.id;

    // Verificar autenticación
    useEffect(() => {
        if (!userId) {
            navigate('/login');
        }
    }, [userId, navigate]);

    // Cargar cursos del usuario
    useEffect(() => {
        const loadCourses = async () => {
            try {
                setLoading(true);
                setError(null);
                
                console.log(`📡 Cargando cursos del usuario ${userId}`);
                const data = await getMyCourses(userId);
                setCourses(data);
                console.log('📚 Cursos cargados:', data);
                
            } catch (err) {
                console.error('❌ Error cargando cursos:', err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        
        if (userId) {
            loadCourses();
        }
    }, [userId]);

    // Desinscribirse del curso
    const handleUnsubscribe = async (courseId, courseName) => {
        if (!window.confirm(`¿Estás seguro de que quieres desinscribirte del curso "${courseName}"?`)) {
            return;
        }
        
        try {
            setUnsubscribing(true);
            
            // 🔄 Aquí iría la llamada a la API para desinscribirse
            // await unsubscribeCourse(user.id, courseId);
            
            // Simular desinscripción (mientras no tengas el endpoint)
            setCourses(courses.filter(c => c.curso_id !== courseId));
            alert('✅ Te has desinscrito del curso correctamente');
            
        } catch (err) {
            console.error('❌ Error desinscribiendo:', err);
            alert('Error al desinscribirse del curso');
        } finally {
            setUnsubscribing(false);
        }
    };

    // Obtener texto del nivel
    const getNivelText = (nivel) => {
        const niveles = {
            'principiante': 'Principiante',
            'intermedio': 'Intermedio',
            'avanzado': 'Avanzado'
        };
        return niveles[nivel] || nivel;
    };

    // Obtener clase del nivel
    const getNivelClass = (nivel) => {
        const clases = {
            'principiante': 'nivel-beginner',
            'intermedio': 'nivel-intermediate',
            'avanzado': 'nivel-advanced'
        };
        return clases[nivel] || 'nivel-beginner';
    };

    if (loading) {
        return (
            <div className="container text-center py-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-2">Cargando tus cursos...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container text-center py-5">
                <div className="alert alert-danger">Error: {error}</div>
                <Link to="/" className="btn btn-secondary">← Volver al inicio</Link>
            </div>
        );
    }

    return (
        <div className="my-courses-page">
            <div className="container">
                
                {/* Header */}
                <div className="my-courses-header">
                    <div className="my-courses-header-left">
                        <Link to="/" className="btn-back-home-courses">
                            <i className="fas fa-arrow-left"></i> Volver al inicio
                        </Link>
                        <h1 className="my-courses-title">📚 Mis Cursos</h1>
                    </div>
                    <Link to="/courses" className="btn-new-course">
                        📖 Explorar Cursos
                    </Link>
                </div>

                {courses.length > 0 ? (
                    <div className="courses-grid">
                        {courses.map(item => (
                            <div key={item.id} className="course-card">
                                <div className="course-card-body">
                                    
                                    <h5 className="course-title">{item.curso?.nombre || 'Curso'}</h5>
                                    
                                    <p className="course-description">
                                        {item.curso?.descripcion || 'Sin descripción'}
                                    </p>
                                    
                                    <div className="course-details">
                                        <div className="course-detail-item">
                                            <strong>👨‍🏫 Instructor:</strong> {item.curso?.instructor || 'No especificado'}
                                        </div>
                                        <div className="course-detail-item">
                                            <strong>⏱️ Duración:</strong> {item.curso?.duracion || 'No especificada'}
                                        </div>
                                        <div className="course-detail-item">
                                            <strong>📊 Nivel:</strong>
                                            <span className={`nivel-badge ${getNivelClass(item.curso?.nivel)}`}>
                                                {getNivelText(item.curso?.nivel)}
                                            </span>
                                        </div>
                                        <div className="course-detail-item">
                                            <strong>📅 Inscripción:</strong> {new Date(item.created_at).toLocaleDateString('es-CO')}
                                        </div>
                                        <div className="course-detail-item">
                                            <strong>📈 Progreso:</strong>
                                            <div className="progress-container">
                                                <div className="progress-bar" style={{ width: `${item.progreso || 0}%` }}>
                                                    {item.progreso || 0}%
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="course-actions">
                                        <Link to={`/course/${item.curso?.id}`} className="btn-course-detail">
                                            Ver Detalles
                                        </Link>
                                        <button 
                                            className="btn-course-unsubscribe"
                                            onClick={() => handleUnsubscribe(item.curso?.id, item.curso?.nombre)}
                                            disabled={unsubscribing}
                                        >
                                            Desinscribirse
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="empty-courses">
                        <div className="empty-icon">📚</div>
                        <h4 className="empty-title">No estás inscrito en ningún curso</h4>
                        <p className="empty-text">Explora los cursos disponibles y comienza tu aprendizaje</p>
                        <Link to="/courses" className="btn-explore-courses">
                            Explorar Cursos
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyCourses;