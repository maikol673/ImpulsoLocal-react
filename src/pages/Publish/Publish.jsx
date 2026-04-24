/* Publish.jsx - Página para publicar nuevos emprendimientos*/
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Publish.css';

const Publish = () => {
  const navigate = useNavigate();
  
  // Estado del formulario
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
    location: '',
    contact: '',
    website: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  /**
   * handleChange - Actualiza el estado cuando el usuario escribe
   */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  /**
   * handleSubmit - Envía el formulario al backend
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Validación básica
    if (!formData.name || !formData.category || !formData.description) {
      alert('Please fill in all required fields (*)');
      setIsSubmitting(false);
      return;
    }
    
    // Aquí iría la llamada a la API
    console.log('Publishing venture:', formData);
    
    // Simular envío
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    alert('Venture published successfully! 🎉');
    navigate('/ventures');
  };

  return (
    <div className="publish-page">
      {/* Hero */}
      <section className="hero">
        <h1>Share Your Venture</h1>
        <p>Tell the world about your project and connect with potential partners</p>
      </section>

      {/* Formulario */}
      <section className="publish-form-section">
        <div className="form-container">
          <h2 className="section-title">Venture Information</h2>
          <p className="form-hint">All fields marked with * are required</p>
          
          <form onSubmit={handleSubmit}>
            {/* Nombre del emprendimiento */}
            <div className="form-group">
              <label htmlFor="name">Venture Name *</label>
              <input 
                type="text" 
                id="name" 
                name="name"
                placeholder="e.g., GreenTech Solutions"
                value={formData.name}
                onChange={handleChange}
                required 
              />
              <small>Choose a memorable name for your venture</small>
            </div>

            {/* Categoría */}
            <div className="form-group">
              <label htmlFor="category">Category *</label>
              <select 
                id="category" 
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
              >
                <option value="">Select a category</option>
                <option value="technology">💻 Technology</option>
                <option value="food">🍔 Food & Beverage</option>
                <option value="services">📋 Services</option>
                <option value="fashion">👗 Fashion</option>
                <option value="crafts">🎨 Crafts & Art</option>
                <option value="education">📚 Education</option>
                <option value="health">💊 Health & Wellness</option>
              </select>
            </div>

            {/* Descripción */}
            <div className="form-group">
              <label htmlFor="description">Description *</label>
              <textarea 
                id="description" 
                name="description"
                rows="6"
                placeholder="Describe your venture: what problem it solves, your target audience, what makes it unique..."
                value={formData.description}
                onChange={handleChange}
                required
              ></textarea>
              <small>Provide a detailed description to attract potential partners</small>
            </div>

            {/* Ubicación */}
            <div className="form-group">
              <label htmlFor="location">Location</label>
              <input 
                type="text" 
                id="location" 
                name="location"
                placeholder="City, Country"
                value={formData.location}
                onChange={handleChange}
              />
              <small>Where is your venture based?</small>
            </div>

            {/* Contacto */}
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="contact">Contact Email</label>
                <input 
                  type="email" 
                  id="contact" 
                  name="contact"
                  placeholder="contact@yourventure.com"
                  value={formData.contact}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="website">Website</label>
                <input 
                  type="url" 
                  id="website" 
                  name="website"
                  placeholder="https://yourventure.com"
                  value={formData.website}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Botones */}
            <div className="form-buttons">
              <button type="submit" className="btn-submit" disabled={isSubmitting}>
                {isSubmitting ? 'Publishing...' : '🚀 Publish Venture'}
              </button>
              <button type="button" className="btn-cancel" onClick={() => navigate('/')}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Publish;