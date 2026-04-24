import React from 'react';
import './Beneficios.css';

/**
 * Componente Beneficios - Muestra los beneficios de la plataforma
 */
const Beneficios = () => {
  
  const beneficios = [
    { 
      icono: "📈", 
      titulo: "Crecimiento", 
      descripcion: "Herramientas para escalar tu negocio de manera sostenible" 
    },
    { 
      icono: "🤝", 
      titulo: "Networking", 
      descripcion: "Conecta con mentores y otros emprendedores" 
    },
    { 
      icono: "🎓", 
      titulo: "Formación", 
      descripcion: "Cursos especializados para cada etapa de tu negocio" 
    }
  ];

  return (
    <section className="beneficios">
      <h2 className="section-title">Nuestros Beneficios</h2>
      
      {/* Grid responsivo de beneficios */}
      <div className="beneficios-grid">
        {/* Mapeo del array para generar las tarjetas dinámicamente */}
        {beneficios.map((beneficio, index) => (
          <div key={index} className="beneficio-card">
            <div className="beneficio-icono">{beneficio.icono}</div>
            <h3>{beneficio.titulo}</h3>
            <p>{beneficio.descripcion}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Beneficios;