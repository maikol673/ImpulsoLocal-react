
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';  


// Componentes comunes (se muestran en todas las páginas)
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';

// Importación de páginas desde sus respectivas carpetas
import Home from './pages/Home/Home';
import Login from './pages/Login/Login';
import Register from './pages/Register/Register';
import Ventures from './pages/Ventures/Ventures';
import Publish from './pages/Publish/Publish';
import Admin from './pages/Admin/Admin';

function App() {
  return (
    <div className="App">
      {/* Header - Barra de navegación superior */}
      <Header />
      
      <Routes>
        <Route path="/" element={<Home />} />           
        <Route path="/login" element={<Login />} />     
        <Route path="/register" element={<Register />} /> 
        <Route path="/ventures" element={<Ventures />} /> 
        <Route path="/publish" element={<Publish />} />   
        <Route path="/admin" element={<Admin />} />       
      </Routes>
      
      {/* Footer - Pie de página */}
      <Footer />
    </div>
  );
}

export default App;