import React, { useState, useMemo } from 'react';
import {
  Users,
  UserPlus,
  Shield,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Edit2,
  UserCheck,
  ShieldAlert,
  GraduationCap,
  Briefcase,
  Power,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ModalNuevoUsuario } from '../components/ModalNuevoUsuario';

export const UsuariosPage = () => {
  const { usuarios, cambiarEstadoUsuario } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [rolFiltro, setRolFiltro] = useState('TODOS');
  const [modalOpen, setModalOpen] = useState(false);
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  // Filtrado reactivo de usuarios
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch =
        u.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.codigo_institucional.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.carrera.toLowerCase().includes(searchTerm.toLowerCase());

      const matchRol = rolFiltro === 'TODOS' || u.rol === rolFiltro;

      return matchSearch && matchRol;
    });
  }, [usuarios, searchTerm, rolFiltro]);

  // Contadores KPI
  const stats = useMemo(() => {
    return {
      total: usuarios.length,
      administradores: usuarios.filter((u) => u.rol === 'ADMINISTRADOR').length,
      operadores: usuarios.filter((u) => u.rol === 'OPERADOR').length,
      estudiantes: usuarios.filter((u) => u.rol === 'ESTUDIANTE').length,
      activos: usuarios.filter((u) => u.estado === 'ACTIVO').length,
    };
  }, [usuarios]);

  const handleAbrirCrear = () => {
    setUsuarioEditando(null);
    setModalOpen(true);
  };

  const handleAbrirEditar = (user) => {
    setUsuarioEditando(user);
    setModalOpen(true);
  };

  const getRoleBadge = (rol) => {
    switch (rol) {
      case 'ADMINISTRADOR':
        return <span className="user-role-badge admin">Administrador</span>;
      case 'OPERADOR':
        return <span className="user-role-badge operator">Operador TI</span>;
      case 'DOCENTE':
        return <span className="user-role-badge teacher">Docente</span>;
      default:
        return <span className="user-role-badge student">Estudiante</span>;
    }
  };

  return (
    <div className="page-view">
      {/* Header */}
      <div className="view-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div className="view-title-wrap">
          <h1>Directorio y Gestión de Usuarios</h1>
          <p>
            Administración de cuentas institucionales en tablas <code>usuarios</code>, <code>roles</code> y permisos
          </p>
        </div>
        <button className="btn-utp-primary" onClick={handleAbrirCrear}>
          <UserPlus size={16} />
          <span>+ Registrar Nuevo Usuario</span>
        </button>
      </div>

      {/* Tarjetas KPI de Usuarios */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Usuarios</span>
            <div className="kpi-icon-pill blue">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-subtext">Cuentas registradas en el campus</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Administradores</span>
            <div className="kpi-icon-pill purple">
              <Shield size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.administradores}</div>
          <div className="kpi-subtext">Acceso total a configuración</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Operadores de Salas</span>
            <div className="kpi-icon-pill orange">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.operadores}</div>
          <div className="kpi-subtext">Monitoreo y liberación de salas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Estudiantes Activos</span>
            <div className="kpi-icon-pill green">
              <GraduationCap size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.estudiantes}</div>
          <div className="kpi-subtext">{stats.activos} usuarios con acceso habilitado</div>
        </div>
      </div>

      {/* Barra de Búsqueda y Filtros */}
      <div className="panel-card" style={{ padding: '16px 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          {/* Input de Búsqueda */}
          <div style={{ position: 'relative', flex: 1, minWidth: '260px' }}>
            <Search size={16} style={{ position: 'absolute', left: '14px', top: '13px', color: '#94a3b8' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '38px', width: '100%' }}
              placeholder="Buscar por código (ej: U20211045), nombre o carrera..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro de Roles */}
          <div className="severity-filter-bar" style={{ margin: 0 }}>
            {['TODOS', 'ADMINISTRADOR', 'OPERADOR', 'ESTUDIANTE'].map((rol) => (
              <button
                key={rol}
                className={`severity-filter-btn ${rolFiltro === rol ? 'active' : ''}`}
                onClick={() => setRolFiltro(rol)}
              >
                {rol === 'TODOS' ? 'Todos los Roles' : rol}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Tabla de Usuarios */}
      <div className="panel-card" style={{ padding: 0, overflow: 'hidden' }}>
        <table className="audit-table">
          <thead>
            <tr>
              <th>USUARIO INSTITUCIONAL</th>
              <th>CORREO UTP</th>
              <th>ROL</th>
              <th>CARRERA / ÁREA</th>
              <th>ESTADO</th>
              <th style={{ textAlign: 'right' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No se encontraron usuarios con los criterios de búsqueda especificados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div className="waitlist-avatar" style={{ backgroundColor: u.rol === 'ADMINISTRADOR' ? '#7c3aed' : u.rol === 'OPERADOR' ? '#2563eb' : '#0f172a' }}>
                        {u.nombre_completo.charAt(0)}
                      </div>
                      <div>
                        <strong style={{ display: 'block', color: '#0f172a', fontSize: '13.5px' }}>
                          {u.nombre_completo}
                        </strong>
                        <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
                          {u.codigo_institucional}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td>
                    <span style={{ color: '#475569', fontSize: '12.5px' }}>{u.correo}</span>
                  </td>
                  <td>{getRoleBadge(u.rol)}</td>
                  <td>
                    <span style={{ color: '#334155', fontSize: '12.5px', fontWeight: 500 }}>
                      {u.carrera}
                    </span>
                  </td>
                  <td>
                    <span
                      className={`status-pill ${u.estado === 'ACTIVO' ? 'free' : 'occupied'}`}
                      style={{ fontSize: '11px' }}
                    >
                      {u.estado === 'ACTIVO' ? '● Activo' : '● Inactivo'}
                    </span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                      <button
                        className="btn-icon-action"
                        title="Editar Usuario"
                        onClick={() => handleAbrirEditar(u)}
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        className="btn-icon-action"
                        title={u.estado === 'ACTIVO' ? 'Desactivar Cuenta' : 'Activar Cuenta'}
                        onClick={() => cambiarEstadoUsuario(u.id)}
                        style={{ color: u.estado === 'ACTIVO' ? '#dc2626' : '#16a34a' }}
                      >
                        <Power size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Modal de Crear / Editar Usuario */}
      <ModalNuevoUsuario
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        usuarioAEditar={usuarioEditando}
      />
    </div>
  );
};
