/**
 * api.js - Servicio para conectar con Laravel API
 * VERSIÓN CORREGIDA: siempre envía Accept: application/json
 * y detecta cuando el servidor responde HTML en vez de JSON
 * (evita el error "Unexpected token '<'... is not valid JSON")
 */

// URL base del servidor Laravel (sin /api) - para imágenes y archivos
export const BASE_URL = 'http://127.0.0.1:8000';

// URL de la API de Laravel
const API_URL = `${BASE_URL}/api`;


const handleResponse = async (response) => {
    const contentType = response.headers.get('content-type') || '';

    if (!contentType.includes('application/json')) {
        const text = await response.text();
        console.error(
            `❌ El servidor respondió con status ${response.status} y contenido no-JSON:`,
            text.slice(0, 800)
        );
        throw new Error(
            `Error del servidor (${response.status}). Revisa la consola para ver el detalle (probablemente un error 500 de Laravel).`
        );
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Error en la petición');
    }

    return data;
};

/**
 * Wrapper central de fetch.
 * - Agrega automáticamente 'Accept: application/json' (clave para que Laravel
 *   devuelva JSON en los errores en vez de la página HTML de "Whoops").
 * - Si el body NO es FormData, agrega 'Content-Type: application/json'.
 * - Si el body ES FormData (subida de imágenes), deja que el navegador
 *   ponga el Content-Type con el boundary correcto.
 */
const apiFetch = async (url, options = {}) => {
    const isFormData = options.body instanceof FormData;

    const headers = {
        'Accept': 'application/json',
        ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
        ...options.headers,
    };

    // Agregar token de autenticación si existe
    const token = localStorage.getItem('token');
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    try {
        const response = await fetch(url, { ...options, headers });
        return await handleResponse(response);
    } catch (error) {
        // Errores de red (servidor caído, CORS, sin conexión, etc.)
        if (error instanceof TypeError) {
            console.error('❌ Error de red o CORS:', error.message);
            throw new Error('No se pudo conectar con el servidor. Verifica que el backend esté corriendo.');
        }
        throw error;
    }
};

// ============ AUTENTICACIÓN ============

export const login = async (email, password) => {
    return apiFetch(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
};

export const register = async (userData) => {
    return apiFetch(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

// ============ EMPRENDIMIENTOS ============

export const getVentures = async () => {
    return apiFetch(`${API_URL}/emprendimientos`);
};

export const getVentureById = async (id) => {
    return apiFetch(`${API_URL}/emprendimientos/${id}`);
};

export const createVentureWithImage = async (formData) => {
    try {
        return await apiFetch(`${API_URL}/emprendimientos`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('❌ Error creando emprendimiento:', error);
        throw error;
    }
};

export const updateVentureWithImage = async (id, formData) => {
    try {
        return await apiFetch(`${API_URL}/emprendimientos/${id}`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('❌ Error actualizando emprendimiento:', error);
        throw error;
    }
};

export const deleteVenture = async (id) => {
    return apiFetch(`${API_URL}/emprendimientos/${id}`, {
        method: 'DELETE',
    });
};

export const getVenturesByCategory = async (categoriaId) => {
    return apiFetch(`${API_URL}/emprendimientos/categoria/${categoriaId}`);
};

export const getMyVentures = async (usuarioId) => {
    return apiFetch(`${API_URL}/emprendimientos/usuario/${usuarioId}`);
};

// ============ CATEGORÍAS ============

export const getCategories = async () => {
    return apiFetch(`${API_URL}/categorias`);
};

// ============ PRODUCTOS ============

export const getProductsByVenture = async (emprendimientoId) => {
    return apiFetch(`${API_URL}/productos/emprendimiento/${emprendimientoId}`);
};

export const getProductById = async (id) => {
    try {
        return await apiFetch(`${API_URL}/productos/${id}`);
    } catch (error) {
        console.error('❌ Error obteniendo producto:', error);
        throw error;
    }
};

export const createProductWithImage = async (formData) => {
    try {
        return await apiFetch(`${API_URL}/productos`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('❌ Error creando producto:', error);
        throw error;
    }
};

export const updateProductWithImage = async (id, formData) => {
    try {
        return await apiFetch(`${API_URL}/productos/${id}`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('❌ Error actualizando producto:', error);
        throw error;
    }
};

// ============ RESEÑAS ============

export const getReviews = async (emprendimientoId) => {
    return apiFetch(`${API_URL}/resenas/emprendimiento/${emprendimientoId}`);
};

export const createReview = async (data) => {
    return apiFetch(`${API_URL}/resenas`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const updateReview = async (reviewId, data) => {
    try {
        return await apiFetch(`${API_URL}/resenas/${reviewId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('❌ Error actualizando reseña:', error);
        throw error;
    }
};

export const deleteReview = async (reviewId) => {
    return apiFetch(`${API_URL}/resenas/${reviewId}`, {
        method: 'DELETE',
    });
};

// ============ TESTIMONIOS ============

export const getTestimonials = async () => {
    return apiFetch(`${API_URL}/testimonios`);
};

export const createTestimonial = async (data) => {
    return apiFetch(`${API_URL}/testimonios`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

// ============ ME ENCANTA (LIKES) ============

export const toggleLike = async (data) => {
    return apiFetch(`${API_URL}/me-encanta/toggle`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getMyLikes = async (usuarioId) => {
    return apiFetch(`${API_URL}/me-encanta/usuario/${usuarioId}`);
};

// ============ CURSOS ============

export const getCourses = async () => {
    return apiFetch(`${API_URL}/cursos`);
};

export const getCourseById = async (id) => {
    return apiFetch(`${API_URL}/cursos/${id}`);
};

export const enrollCourse = async (data) => {
    return apiFetch(`${API_URL}/cursos/inscribir`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getMyCourses = async (usuarioId) => {
    return apiFetch(`${API_URL}/cursos/usuario/${usuarioId}`);
};

// ============ EVENTOS ============

export const getEvents = async () => {
    return apiFetch(`${API_URL}/eventos`);
};

export const getEventById = async (id) => {
    return apiFetch(`${API_URL}/eventos/${id}`);
};

export const confirmAttendance = async (data) => {
    return apiFetch(`${API_URL}/eventos/confirmar-asistencia`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};

export const getMyEvents = async (usuarioId) => {
    return apiFetch(`${API_URL}/eventos/usuario/${usuarioId}`);
};

// ============ PERFIL DE USUARIO ============

export const updateProfile = async (userId, data) => {
    try {
        return await apiFetch(`${API_URL}/perfil/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('❌ Error actualizando perfil:', error);
        throw error;
    }
};

export const updateProfileWithImage = async (userId, formData) => {
    try {
        return await apiFetch(`${API_URL}/perfil/${userId}`, {
            method: 'POST',
            body: formData,
        });
    } catch (error) {
        console.error('❌ Error actualizando perfil con imagen:', error);
        throw error;
    }
};

export const getProfile = async (userId) => {
    try {
        return await apiFetch(`${API_URL}/perfil/${userId}`);
    } catch (error) {
        console.error('❌ Error obteniendo perfil:', error);
        throw error;
    }
};

// ============ CAMBIAR CONTRASEÑA ============

export const changePassword = async (userId, data) => {
    try {
        return await apiFetch(`${API_URL}/cambiar-password/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('❌ Error cambiando contraseña:', error);
        throw error;
    }
};

// ============ CARRITO ============

export const getCart = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/carrito/${usuarioId}`);
    } catch (error) {
        console.error('Error obteniendo carrito:', error);
        throw error;
    }
};

export const addToCart = async (data) => {
    try {
        return await apiFetch(`${API_URL}/carrito/agregar`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error agregando al carrito:', error);
        throw error;
    }
};

export const updateCartItem = async (itemId, data) => {
    try {
        return await apiFetch(`${API_URL}/carrito/actualizar/${itemId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error actualizando item:', error);
        throw error;
    }
};

export const removeFromCart = async (itemId) => {
    try {
        return await apiFetch(`${API_URL}/carrito/eliminar/${itemId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error eliminando del carrito:', error);
        throw error;
    }
};

export const clearCart = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/carrito/vaciar/${usuarioId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error vaciando carrito:', error);
        throw error;
    }
};

// ============ ÓRDENES ============

export const createOrder = async (data) => {
    try {
        return await apiFetch(`${API_URL}/ordenes`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error creando orden:', error);
        throw error;
    }
};

export const getMyOrders = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/ordenes/usuario/${usuarioId}`);
    } catch (error) {
        console.error('Error obteniendo órdenes:', error);
        throw error;
    }
};

export const getOrderById = async (orderId) => {
    try {
        return await apiFetch(`${API_URL}/ordenes/${orderId}`);
    } catch (error) {
        console.error('Error obteniendo orden:', error);
        throw error;
    }
};

export const cancelOrder = async (orderId) => {
    try {
        return await apiFetch(`${API_URL}/ordenes/${orderId}/cancelar`, {
            method: 'PUT',
        });
    } catch (error) {
        console.error('Error cancelando orden:', error);
        throw error;
    }
};

// ============ CHAT ============

export const getConversations = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/conversaciones/${usuarioId}`);
    } catch (error) {
        console.error('Error obteniendo conversaciones:', error);
        throw error;
    }
};

export const getAvailableUsers = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/usuarios/disponibles/${usuarioId}`);
    } catch (error) {
        console.error('Error obteniendo usuarios disponibles:', error);
        throw error;
    }
};

export const getUserById = async (usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/usuarios/${usuarioId}`);
    } catch (error) {
        console.error('Error obteniendo usuario:', error);
        throw error;
    }
};

export const getMessages = async (conversacionId) => {
    try {
        return await apiFetch(`${API_URL}/mensajes/${conversacionId}`);
    } catch (error) {
        console.error('Error obteniendo mensajes:', error);
        throw error;
    }
};

export const sendMessage = async (data) => {
    try {
        return await apiFetch(`${API_URL}/mensajes`, {
            method: 'POST',
            body: JSON.stringify(data),
        });
    } catch (error) {
        console.error('Error enviando mensaje:', error);
        throw error;
    }
};

export const markMessagesAsRead = async (conversacionId, usuarioId) => {
    try {
        return await apiFetch(`${API_URL}/mensajes/leer/${conversacionId}`, {
            method: 'PUT',
            body: JSON.stringify({ usuario_id: usuarioId }),
        });
    } catch (error) {
        console.error('Error marcando mensajes como leídos:', error);
        throw error;
    }
};

export const deleteConversation = async (conversacionId) => {
    try {
        return await apiFetch(`${API_URL}/conversaciones/${conversacionId}`, {
            method: 'DELETE',
        });
    } catch (error) {
        console.error('Error eliminando conversación:', error);
        throw error;
    }
};