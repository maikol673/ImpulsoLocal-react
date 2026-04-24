import React from 'react';
import './Testimonios.css';


  // Componente Testimonios - Muestra opiniones de usuarios
 

const Testimonios = () => {
  const testimonios = [
    { 
      texto: "Este ecosistema me ayudó a conectar con inversionistas para mi startup", 
      autor: "Ana L., Fundadora de TechSolution" 
    },
    { 
      texto: "Los cursos me dieron las herramientas para triplicar mis ventas", 
      autor: "Carlos M., Dueño de Panadería Dulce" 
    },
    { 
      texto: "La comunidad es increíble, siempre encuentro apoyo cuando lo necesito", 
      autor: "Laura G., Creadora de Moda Sostenible" 
    }
  ];

  return (
    <section className="testimonios">
      <h2 className="section-title">Lo que dicen nuestros miembros</h2>
      

      <div className="testimonios-container">
        {testimonios.map((testimonio, index) => (
          <div key={index} className="testimonio-card">
            <p className="testimonio-texto">"{testimonio.texto}"</p>
            <p className="testimonio-autor">
              <strong>- {testimonio.autor}</strong>
            </p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonios;