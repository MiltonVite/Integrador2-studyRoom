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

  // Filtrado reactivo de personal
  const usuariosFiltrados = useMemo(() => {
    return usuarios.filter((u) => {
      const matchSearch =
        u.nombre_completo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.codigo_institucional.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.correo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (u.departamento && u.departamento.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchRol = rolFiltro === 'TODOS' || u.rol === rolFiltro;

      return matchSearch && matchRol;
    });
  }, [usuarios, searchTerm, rolFiltro]);

  // Contadores KPI de Personal
  const stats = useMemo(() => {
    return {
      total: usuarios.length,
      administradores: usuarios.filter((u) => u.rol === 'ADMINISTRADOR').length,
      operadores: usuarios.filter((u) => u.rol === 'OPERADOR').length,
      supervisores: usuarios.filter((u) => u.rol === 'SUPERVISOR' || u.rol === 'RECEPCION_BIBLIOTECA').length,
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
      case 'SUPERVISOR':
        return <span className="user-role-badge teacher">Supervisor</span>;
      case 'RECEPCION_BIBLIOTECA':
        return <span className="user-role-badge student">Recepción / Salas</span>;
      default:
        return <span className="user-role-badge operator">Personal</span>;
    }
  };

  return (
    <div className="page-view">
      {/* Header */}
      <div className="view-header">
        <div className="view-title-wrap">
          <h1>Directorio de Personal y Operadores de Salas</h1>
          <p>
            Administración de cuentas internas de personal UTP en tablas <code>usuarios</code>, <code>roles</code> y permisos de acceso
          </p>
        </div>
        <div className="view-actions-row">
          <button className="btn-utp-primary" onClick={handleAbrirCrear}>
            <UserPlus size={16} />
            <span>Registrar Nuevo Personal</span>
          </button>
        </div>
      </div>

      {/* Tarjetas KPI de Usuarios */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Total Personal</span>
            <div className="kpi-icon-pill blue">
              <Users size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.total}</div>
          <div className="kpi-subtext">Cuentas autorizadas en campus</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Administradores</span>
            <div className="kpi-icon-pill purple">
              <Shield size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.administradores}</div>
          <div className="kpi-subtext">Control total de configuración y políticas</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Operadores de Salas</span>
            <div className="kpi-icon-pill orange">
              <Briefcase size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.operadores}</div>
          <div className="kpi-subtext">Monitoreo de cámaras y liberación</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">Supervisores & Recepción</span>
            <div className="kpi-icon-pill green">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="kpi-value">{stats.supervisores}</div>
          <div className="kpi-subtext">{stats.activos} cuentas activas en el sistema</div>
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
              placeholder="Buscar por código de personal (ej: U20211045), nombre o departamento..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Filtro de Roles */}
          <div className="severity-filter-bar" style={{ margin: 0 }}>
            {['TODOS', 'ADMINISTRADOR', 'OPERADOR', 'SUPERVISOR', 'RECEPCION_BIBLIOTECA'].map((rol) => (
              <button
                key={rol}
                className={`severity-filter-btn ${rolFiltro === rol ? 'active' : ''}`}
                onClick={() => setRolFiltro(rol)}
              >
                {rol === 'TODOS'
                  ? 'Todos'
                  : rol === 'RECEPCION_BIBLIOTECA'
                  ? 'Recepción'
                  : rol === 'OPERADOR'
                  ? 'Operadores'
                  : rol === 'SUPERVISOR'
                  ? 'Supervisores'
                  : 'Administradores'}
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
              <th>PERSONAL INSTITUCIONAL</th>
              <th>CORREO UTP</th>
              <th>ROL</th>
              <th>DEPARTAMENTO / ÁREA</th>
              <th>ESTADO</th>
              <th style={{ textAlign: 'right' }}>ACCIONES</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '36px', color: '#64748b' }}>
                  No se encontró personal institucional con los criterios especificados.
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div
                        className="waitlist-avatar"
                        style={{
                          backgroundColor:
                            u.rol === 'ADMINISTRADOR'
                              ? '#7c3aed'
                              : u.rol === 'SUPERVISOR'
                              ? '#ea580c'
                              : u.rol === 'RECEPCION_BIBLIOTECA'
                              ? '#059669'
                              : '#2563eb',
                        }}
                      >
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
                      {u.departamento}
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
                        title="Editar Personal"
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
