/**
 * main.jsx - Punto de entrada de la aplicación
 * Aquí se monta la aplicación React en el DOM
 */
import React from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'  // Enrutador para navegación
import './index.css'  // Estilos globales base
import App from './App.jsx'

// Renderiza la aplicación en el elemento con id "root"
createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* BrowserRouter habilita la navegación entre páginas sin recargar */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)