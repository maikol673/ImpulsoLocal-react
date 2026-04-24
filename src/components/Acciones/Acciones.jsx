import React from 'react';
import './Acciones.css';

/**
 * Componente Acciones - Botones de acción principal
 * Permite al usuario navegar a las secciones principales
 */
const Acciones = () => {
  return (
    <section className="acciones">
      {/* Título de la sección */}
      <h2 className="section-title">¿Qué deseas hacer?</h2>
      
      {/* Contenedor de botones */}
      <div className="acciones-botones">
        {/* Botón para ver emprendimientos (azul) */}
        <a href="/ver-emprendimientos" className="boton-accion">
          Ver Emprendimientos
        </a>
        
        {/* Botón para publicar emprendimiento (verde - destacado) */}
        <a href="/publicar-emprendimiento" className="boton-accion publicar">
          Publicar Emprendimiento
        </a>
      </div>
    </section>
  );
};

export default Acciones;