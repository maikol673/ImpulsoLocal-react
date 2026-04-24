import React from 'react';
import './Emprendimientos.css';

/**
 * Componente Emprendimientos - Muestra emprendimientos destacados
 */
const Emprendimientos = () => {
  // Datos de los emprendimientos destacados
  const emprendimientos = [
    { 
      name: "GreenTech", 
      description: "Soluciones sostenibles para la agricultura urbana." 
    },
    { 
      name: "EduSmart", 
      description: "Plataforma de formación para jóvenes emprendedores." 
    },
    { 
      name: "ArtesanaCo", 
      description: "Comercio digital para artesanos locales." 
    }
  ];

  return (
    <section className="emprendimientos">
      <h2 className="section-title">Emprendimientos Destacados</h2>
      
      {/* Grid responsivo de emprendimientos */}
      <div className="grid-emprendimientos">
        {emprendimientos.map((emprendimiento, index) => (
          <div key={index} className="card-emprendimiento">
            <h3>{emprendimiento.name}</h3>
            <p>{emprendimiento.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Emprendimientos;