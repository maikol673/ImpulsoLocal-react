/**
 * Admin.jsx - Panel de Administración
 */

import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
  // ============ ESTADOS ============
  const [activeTab, setActiveTab] = useState('dashboard');
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(false);
  
  // Datos del dashboard
  const [dashboardStats, setDashboardStats] = useState({
    totalEmprendimientos: 0,
    usuariosActivos: 0,
    totalCategorias: 0,
    totalTestimonios: 0,
    interaccionesHoy: 0,
    interaccionesSemana: 0,
    interaccionesMes: 0,
    usuariosTotales: 0
  });
  
  // Actividad reciente
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Usuarios
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Reportes y tickets
  const [reports, setReports] = useState([]);
  const [tickets, setTickets] = useState([]);
  
  // ============ FUNCIONES DE CARGA (como en Dashboard) ============
  
  const cargarDashboardStats = async () => {
    setLoading(true);
    try {
      // Simulación de API (después conectas con tu backend)
      const data = {
        totalEmprendimientos: 45,
        usuariosActivos: Math.floor(Math.random() * 50) + 20,
        totalCategorias: 12,
        totalTestimonios: 28,
        interaccionesHoy: Math.floor(Math.random() * 100) + 50,
        interaccionesSemana: Math.floor(Math.random() * 500) + 300,
        interaccionesMes: Math.floor(Math.random() * 2000) + 1000,
        usuariosTotales: 1250
      };
      setDashboardStats(data);
      setLastUpdate(new Date());
    } catch (error) {
      console.error("Error cargando dashboard:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const cargarActividadReciente = async () => {
    try {
      const data = [
        { id: 1, usuario: 'María Pérez', accion: 'Publicó un nuevo emprendimiento', tiempo: 'Hace 2 min', icono: 'store', color: 'primary' },
        { id: 2, usuario: 'Carlos López', accion: 'Comentó en GreenTech', tiempo: 'Hace 5 min', icono: 'comment', color: 'success' },
        { id: 3, usuario: 'Ana García', accion: 'Se registró en la plataforma', tiempo: 'Hace 12 min', icono: 'user-plus', color: 'info' },
        { id: 4, usuario: 'Juan Rodríguez', accion: 'Actualizó su perfil', tiempo: 'Hace 20 min', icono: 'user-edit', color: 'warning' }
      ];
      setRecentActivity(data);
    } catch (error) {
      console.error("Error cargando actividad:", error);
    }
  };
  
  const cargarUsuarios = async () => {
    try {
      const data = [
        { id: 1, nombre: 'María Pérez', username: 'mariaperez', email: 'maria@email.com', tipo: 'Emprendedor', fecha_registro: '2024-01-15', ultimo_login: '2024-01-20 14:30', activo: true },
        { id: 2, nombre: 'Carlos López', username: 'carloslopez', email: 'carlos@email.com', tipo: 'Mentor', fecha_registro: '2024-01-10', ultimo_login: '2024-01-20 10:15', activo: true },
        { id: 3, nombre: 'Ana García', username: 'anagarcia', email: 'ana@email.com', tipo: 'Inversor', fecha_registro: '2024-01-05', ultimo_login: '2024-01-19 16:45', activo: false },
        { id: 4, nombre: 'Juan Rodríguez', username: 'juanrod', email: 'juan@email.com', tipo: 'Emprendedor', fecha_registro: '2024-01-18', ultimo_login: '2024-01-20 09:00', activo: true }
      ];
      setUsers(data);
    } catch (error) {
      console.error("Error cargando usuarios:", error);
    }
  };
  
  const cargarReportes = async () => {
    try {
      const data = [
        { id: 1, titulo: 'Contenido inapropiado', descripcion: 'Usuario reportó comentario ofensivo', usuario: 'maria123', fecha: '2024-01-20', prioridad: 'alta', tipo: 'comentario' },
        { id: 2, titulo: 'Spam', descripcion: 'Publicación con enlaces sospechosos', usuario: 'carlos456', fecha: '2024-01-19', prioridad: 'media', tipo: 'publicacion' }
      ];
      setReports(data);
    } catch (error) {
      console.error("Error cargando reportes:", error);
    }
  };
  
  const cargarTickets = async () => {
    try {
      const data = [
        { id: 1, asunto: 'Problema con login', descripcion: 'No puedo acceder a mi cuenta', usuario: 'maria123', fecha: '2024-01-20', estado: 'pendiente', prioridad: 'alta' },
        { id: 2, asunto: 'Error al publicar', descripcion: 'El formulario no guarda cambios', usuario: 'carlos456', fecha: '2024-01-19', estado: 'pendiente', prioridad: 'media' }
      ];
      setTickets(data);
    } catch (error) {
      console.error("Error cargando tickets:", error);
    }
  };
  
  // ============ EFECTO PRINCIPAL (mismo patrón que Dashboard) ============
  
  useEffect(() => {
    const cargarTodo = async () => {
      await Promise.all([
        cargarDashboardStats(),
        cargarActividadReciente(),
        cargarUsuarios(),
        cargarReportes(),
        cargarTickets()
      ]);
    };
    
    cargarTodo();
    
    // Actualización automática cada 30 segundos
    const interval = setInterval(() => {
      if (activeTab === 'dashboard') {
        cargarDashboardStats();
        cargarActividadReciente();
      } else if (activeTab === 'usuarios') {
        cargarUsuarios();
      } else if (activeTab === 'moderacion') {
        cargarReportes();
      } else if (activeTab === 'soporte') {
        cargarTickets();
      }
    }, 30000);
    
    return () => clearInterval(interval);
  }, [activeTab]);
  
  // ============ FILTROS (calculados durante render) ============
  
  const filteredUsers = users.filter(user =>
    user.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // ============ RENDER ============
  
  return (
    <div className="admin-page">
      <div className="admin-panel">
        <div className="container-fluid">
          <div className="row">
            {/* Sidebar */}
            <div className="col-md-3 col-lg-2 d-md-block sidebar">
              <div className="sidebar-header">
                <h4><i className="fas fa-rocket me-2"></i>Admin Panel</h4>
              </div>
              
              <ul className="nav flex-column">
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'dashboard' ? 'active' : ''}`}
                    onClick={() => setActiveTab('dashboard')}
                  >
                    <i className="fas fa-home me-2"></i>Dashboard
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'usuarios' ? 'active' : ''}`}
                    onClick={() => setActiveTab('usuarios')}
                  >
                    <i className="fas fa-users me-2"></i>Usuarios
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'moderacion' ? 'active' : ''}`}
                    onClick={() => setActiveTab('moderacion')}
                  >
                    <i className="fas fa-flag me-2"></i>Moderación
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'analytics' ? 'active' : ''}`}
                    onClick={() => setActiveTab('analytics')}
                  >
                    <i className="fas fa-chart-bar me-2"></i>Analytics
                  </button>
                </li>
                <li className="nav-item">
                  <button 
                    className={`nav-link ${activeTab === 'soporte' ? 'active' : ''}`}
                    onClick={() => setActiveTab('soporte')}
                  >
                    <i className="fas fa-headset me-2"></i>Soporte
                  </button>
                </li>
              </ul>
              
              {/* Estado del sistema */}
              <div className="system-status">
                <small>Estado del sistema:</small>
                <div className="d-flex align-items-center mt-2">
                  <div className="status-indicator online"></div>
                  <small className="ms-2">En línea</small>
                </div>
                <small className="d-block mt-2">
                  Última actualización: {lastUpdate.toLocaleTimeString()}
                </small>
                {loading && (
                  <div className="text-center mt-2">
                    <small className="text-white-50">
                      <i className="fas fa-spinner fa-spin"></i> Cargando...
                    </small>
                  </div>
                )}
              </div>
            </div>

            {/* Main Content */}
            <div className="col-md-9 ms-sm-auto col-lg-10 px-md-4 py-4">
              
              {/* ========== DASHBOARD ========== */}
              {activeTab === 'dashboard' && (
                <div className="dashboard-tab">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Dashboard Administrativo</h2>
                    <div className="d-flex align-items-center">
                      <span className="live-badge">
                        <i className="fas fa-circle"></i> EN VIVO
                      </span>
                      <button 
                        className="btn btn-sm btn-primary ms-2"
                        onClick={cargarDashboardStats}
                        disabled={loading}
                      >
                        <i className="fas fa-sync-alt"></i> Actualizar
                      </button>
                    </div>
                  </div>
                  
                  {/* Stats Cards */}
                  <div className="stats-grid">
                    <div className="stat-card">
                      <div className="stat-icon">🚀</div>
                      <div className="stat-info">
                        <h3>{dashboardStats.totalEmprendimientos}</h3>
                        <p>Emprendimientos</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">👥</div>
                      <div className="stat-info">
                        <h3>{dashboardStats.usuariosActivos}</h3>
                        <p>Usuarios Activos</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">🏷️</div>
                      <div className="stat-info">
                        <h3>{dashboardStats.totalCategorias}</h3>
                        <p>Categorías</p>
                      </div>
                    </div>
                    
                    <div className="stat-card">
                      <div className="stat-icon">💬</div>
                      <div className="stat-info">
                        <h3>{dashboardStats.totalTestimonios}</h3>
                        <p>Testimonios</p>
                      </div>
                    </div>
                  </div>

                  {/* Actividad Reciente */}
                  <div className="row mt-4">
                    <div className="col-12">
                      <div className="card shadow">
                        <div className="card-header">
                          <h6 className="m-0 font-weight-bold">Actividad Reciente</h6>
                        </div>
                        <div className="card-body p-0">
                          <div className="activity-feed">
                            {recentActivity.map(activity => (
                              <div key={activity.id} className={`activity-item border-left-${activity.color}`}>
                                <div className="d-flex justify-content-between">
                                  <div>
                                    <i className={`fas fa-${activity.icono} me-2 text-${activity.color}`}></i>
                                    <strong>{activity.usuario}</strong>
                                  </div>
                                  <small className="text-muted">{activity.tiempo}</small>
                                </div>
                                <p className="mb-0 mt-1 small">{activity.accion}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== USUARIOS ========== */}
              {activeTab === 'usuarios' && (
                <div className="usuarios-tab">
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h2 className="mb-0">Gestión de Usuarios</h2>
                    <button className="btn btn-primary btn-sm" onClick={cargarUsuarios}>
                      <i className="fas fa-sync-alt"></i> Actualizar
                    </button>
                  </div>
                  
                  <div className="card shadow">
                    <div className="card-header">
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="🔍 Buscar usuario..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                    <div className="card-body">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Usuario</th>
                              <th>Email</th>
                              <th>Tipo</th>
                              <th>Estado</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredUsers.map(user => (
                              <tr key={user.id}>
                                <td>
                                  <strong>{user.nombre}</strong>
                                  <br />
                                  <small className="text-muted">@{user.username}</small>
                                </td>
                                <td>{user.email}</td>
                                <td>{user.tipo}</td>
                                <td>
                                  <span className={`badge ${user.activo ? 'bg-success' : 'bg-secondary'}`}>
                                    {user.activo ? 'Activo' : 'Inactivo'}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ========== MODERACIÓN ========== */}
              {activeTab === 'moderacion' && (
                <div className="moderacion-tab">
                  <h2 className="mb-4">Moderación de Contenido</h2>
                  {reports.map(report => (
                    <div key={report.id} className="report-item">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">{report.titulo}</h6>
                        <span className={`badge ${report.prioridad === 'alta' ? 'bg-danger' : 'bg-warning'}`}>
                          {report.prioridad}
                        </span>
                      </div>
                      <p className="mb-1">{report.descripcion}</p>
                      <small className="text-muted">Reportado por: {report.usuario} • {report.fecha}</small>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-success me-1">
                          <i className="fas fa-check"></i> Aprobar
                        </button>
                        <button className="btn btn-sm btn-danger">
                          <i className="fas fa-times"></i> Rechazar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* ========== ANALYTICS ========== */}
              {activeTab === 'analytics' && (
                <div className="analytics-tab">
                  <h2 className="mb-4">Analytics</h2>
                  <div className="alert alert-info">
                    <i className="fas fa-chart-line me-2"></i>
                    Próximamente: Gráficos interactivos con métricas detalladas
                  </div>
                </div>
              )}

              {/* ========== SOPORTE ========== */}
              {activeTab === 'soporte' && (
                <div className="soporte-tab">
                  <h2 className="mb-4">Tickets de Soporte</h2>
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="ticket-item">
                      <div className="d-flex justify-content-between">
                        <h6 className="mb-1">#{ticket.id} - {ticket.asunto}</h6>
                        <span className="badge bg-warning">{ticket.estado}</span>
                      </div>
                      <p className="mb-1">{ticket.descripcion}</p>
                      <small className="text-muted">Usuario: {ticket.usuario} • {ticket.fecha}</small>
                      <div className="mt-2">
                        <button className="btn btn-sm btn-primary me-1">
                          <i className="fas fa-reply"></i> Responder
                        </button>
                        <button className="btn btn-sm btn-success">
                          <i className="fas fa-check"></i> Resolver
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;