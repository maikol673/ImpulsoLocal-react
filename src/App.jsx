import React from 'react';
import './App.css';

import Header from './components/Header/Header';
import Hero from './components/Hero/Hero';
import Acciones from './components/Acciones/Acciones';
import Beneficios from './components/Beneficios/Beneficios';    
import Testimonios from './components/Testimonios/Testimonios'; 
import Emprendimientos from './components/Emprendimientos/Emprendimientos';
import Footer from './components/Footer/Footer';


function App() {
  return (
    <div className="App">
      <Header />
      
      <Hero />
      
      <Acciones />
      
      <Beneficios />

      <Testimonios />

      <Emprendimientos />

      <Footer />
    </div>
  );
}

export default App;