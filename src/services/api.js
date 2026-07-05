/**
 * api.js - Servicio para conectar con Laravel API
 */

// URL de la API de Laravel
const API_URL = 'http://127.0.0.1:8000/api';

// Helper para manejar errores de respuesta
const handleResponse = async (response) => {
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || error.error || 'Error en la petición');
    }
    return response.json();
};

// ============ AUTENTICACIÓN ============

/**
 * Iniciar sesión
 */
export const login = async (email, password) => {
    const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
};

/**
 * Registrar usuario
 */
export const register = async (userData) => {
    const response = await fetch(`${API_URL}/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    return handleResponse(response);
};

// ============ EMPRENDIMIENTOS ============

/**
 * Obtener todos los emprendimientos
 */
export const getVentures = async () => {
    const response = await fetch(`${API_URL}/emprendimientos`);
    return handleResponse(response);
};

/**
 * Obtener un emprendimiento por ID
 */
export const getVentureById = async (id) => {
    const response = await fetch(`${API_URL}/emprendimientos/${id}`);
    return handleResponse(response);
};

/**
 * Crear un emprendimiento
 */
export const createVenture = async (data) => {
    const response = await fetch(`${API_URL}/emprendimientos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/**
 * Actualizar un emprendimiento
 */
export const updateVenture = async (id, data) => {
    const response = await fetch(`${API_URL}/emprendimientos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/**
 * Eliminar un emprendimiento
 */
export const deleteVenture = async (id) => {
    const response = await fetch(`${API_URL}/emprendimientos/${id}`, {
        method: 'DELETE',
    });
    return handleResponse(response);
};

/**
 * Obtener emprendimientos por categoría
 */
export const getVenturesByCategory = async (categoriaId) => {
    const response = await fetch(`${API_URL}/emprendimientos/categoria/${categoriaId}`);
    return handleResponse(response);
};

/**
 * Obtener emprendimientos de un usuario
 */
export const getMyVentures = async (usuarioId) => {
    const response = await fetch(`${API_URL}/emprendimientos/usuario/${usuarioId}`);
    return handleResponse(response);
};

// ============ CATEGORÍAS ============

/**
 * Obtener todas las categorías
 */
export const getCategories = async () => {
    const response = await fetch(`${API_URL}/categorias`);
    return handleResponse(response);
};

// ============ PRODUCTOS ============

/**
 * Obtener productos de un emprendimiento
 */
export const getProductsByVenture = async (emprendimientoId) => {
    const response = await fetch(`${API_URL}/productos/emprendimiento/${emprendimientoId}`);
    return handleResponse(response);
};

/**
 * Crear un producto
 */
export const createProduct = async (data) => {
    const response = await fetch(`${API_URL}/productos`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// ============ RESEÑAS ============

/**
 * Obtener reseñas de un emprendimiento
 */
export const getReviews = async (emprendimientoId) => {
    const response = await fetch(`${API_URL}/resenas/emprendimiento/${emprendimientoId}`);
    return handleResponse(response);
};

/**
 * Crear una reseña
 */
export const createReview = async (data) => {
    const response = await fetch(`${API_URL}/resenas`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// ============ TESTIMONIOS ============

/**
 * Obtener testimonios aprobados
 */
export const getTestimonials = async () => {
    const response = await fetch(`${API_URL}/testimonios`);
    return handleResponse(response);
};

/**
 * Crear un testimonio
 */
export const createTestimonial = async (data) => {
    const response = await fetch(`${API_URL}/testimonios`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

// ============ ME ENCANTA (LIKES) ============

/**
 * Dar o quitar "Me gusta"
 */
export const toggleLike = async (data) => {
    const response = await fetch(`${API_URL}/me-encanta/toggle`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/**
 * Obtener "Me gusta" de un usuario
 */
export const getMyLikes = async (usuarioId) => {
    const response = await fetch(`${API_URL}/me-encanta/usuario/${usuarioId}`);
    return handleResponse(response);
};

// ============ CURSOS ============

/**
 * Obtener todos los cursos
 */
export const getCourses = async () => {
    const response = await fetch(`${API_URL}/cursos`);
    return handleResponse(response);
};

/**
 * Obtener un curso por ID
 */
export const getCourseById = async (id) => {
    const response = await fetch(`${API_URL}/cursos/${id}`);
    return handleResponse(response);
};

/**
 * Inscribirse a un curso
 */
export const enrollCourse = async (data) => {
    const response = await fetch(`${API_URL}/cursos/inscribir`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/**
 * Obtener cursos de un usuario
 */
export const getMyCourses = async (usuarioId) => {
    const response = await fetch(`${API_URL}/cursos/usuario/${usuarioId}`);
    return handleResponse(response);
};

// ============ EVENTOS ============

/**
 * Obtener todos los eventos
 */
export const getEvents = async () => {
    const response = await fetch(`${API_URL}/eventos`);
    return handleResponse(response);
};

/**
 * Obtener un evento por ID
 */
export const getEventById = async (id) => {
    const response = await fetch(`${API_URL}/eventos/${id}`);
    return handleResponse(response);
};

/**
 * Confirmar asistencia a un evento
 */
export const confirmAttendance = async (data) => {
    const response = await fetch(`${API_URL}/eventos/confirmar-asistencia`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    return handleResponse(response);
};

/**
 * Obtener eventos de un usuario
 */
export const getMyEvents = async (usuarioId) => {
    const response = await fetch(`${API_URL}/eventos/usuario/${usuarioId}`);
    return handleResponse(response);
};


// ============ PERFIL DE USUARIO ============

/**
 * Actualizar perfil de usuario (sin imagen)
 */
export const updateProfile = async (userId, data) => {
    try {
        const response = await fetch(`${API_URL}/perfil/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        throw error;
    }
};

/**
 * Actualizar perfil de usuario CON IMAGEN
 */
export const updateProfileWithImage = async (userId, formData) => {
    try {
        const response = await fetch(`${API_URL}/perfil/${userId}`, {
            method: 'POST',  // ← POST para subir archivos
            body: formData,  // ← FormData con la imagen
            // NO incluir headers 'Content-Type' (lo maneja FormData)
        });
        return handleResponse(response);
    } catch (error) {
        console.error('❌ Error actualizando perfil con imagen:', error);
        throw error;
    }
};

/**
 * Obtener perfil de usuario
 */
export const getProfile = async (userId) => {
    try {
        const response = await fetch(`${API_URL}/perfil/${userId}`);
        return handleResponse(response);
    } catch (error) {
        console.error('❌ Error obteniendo perfil:', error);
        throw error;
    }
};


// ============ CAMBIAR CONTRASEÑA ============

/**
 * Cambiar contraseña de usuario
 */
export const changePassword = async (userId, data) => {
    try {
        const response = await fetch(`${API_URL}/cambiar-password/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        return handleResponse(response);
    } catch (error) {
        console.error('❌ Error cambiando contraseña:', error);
        throw error;
    }
};