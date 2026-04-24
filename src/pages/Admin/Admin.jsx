/*Admin.jsx - Panel de administración*/
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  const [activeTab, setActiveTab] = useState('dashboard');

  // Datos de ejemplo para el dashboard
  const stats = {
    totalUsers: 1250,
    activeVentures: 45,
    pendingReports: 5,
    monthlyGrowth: 12.5
  };

  // Usuarios de ejemplo
  const users = [
    { id: 1, name: 'María Pérez', email: 'maria@example.com', role: 'Entrepreneur', status: 'active' },
    { id: 2, name: 'Carlos López', email: 'carlos@example.com', role: 'Mentor', status: 'active' },
    { id: 3, name: 'Ana García', email: 'ana@example.com', role: 'Investor', status: 'inactive' },
  ];

  return (
    <div className="admin-page">
      {/* Header del admin */}
      <div className="admin-header">
        <div className="admin-header-content">
          <h1>
            <i className="fas fa-cog"></i> Admin Dashboard
          </h1>
          <Link to="/" className="btn-back-home">
            ← Back to Home
          </Link>
        </div>
      </div>

      {/* Pestañas de navegación */}
      <div className="admin-tabs">
        <button 
          className={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          className={`tab-btn ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          👥 Users
        </button>
        <button 
          className={`tab-btn ${activeTab === 'ventures' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventures')}
        >
          🚀 Ventures
        </button>
        <button 
          className={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          🚩 Reports
        </button>
      </div>

      {/* Contenido según pestaña activa */}
      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="dashboard-tab">
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                  <span className="stat-change positive">+{stats.monthlyGrowth}%</span>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🚀</div>
                <div className="stat-info">
                  <h3>{stats.activeVentures}</h3>
                  <p>Active Ventures</p>
                </div>
              </div>
              
              <div className="stat-card">
                <div className="stat-icon">🚩</div>
                <div className="stat-info">
                  <h3>{stats.pendingReports}</h3>
                  <p>Pending Reports</p>
                </div>
              </div>
            </div>

            <div className="admin-message">
              <p>✅ This is a demo admin panel. Full functionality coming soon!</p>
              <p>In production, this would include user management, content moderation, analytics, and more.</p>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="users-tab">
            <div className="table-container">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role}</td>
                      <td>
                        <span className={`status-badge ${user.status}`}>
                          {user.status}
                        </span>
                      </td>
                      <td>
                        <button className="action-btn edit">✏️</button>
                        <button className="action-btn delete">🗑️</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Ventures Tab */}
        {activeTab === 'ventures' && (
          <div className="ventures-tab">
            <div className="admin-message">
              <p>📋 Venture management panel</p>
              <p>Here you can approve, feature, or remove ventures posted by users.</p>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="reports-tab">
            <div className="admin-message">
              <p>🚩 Content moderation panel</p>
              <p>Review and moderate reported content from users.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;