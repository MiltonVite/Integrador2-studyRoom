import React from 'react';
import {
  LayoutDashboard,
  Calendar,
  Users,
  Camera,
  AlertTriangle,
  Settings,
  Sparkles,
  LogOut,
  GraduationCap,
  UserCheck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { puedeAccederTab, tienePermiso, PERMISOS } from '../utils/permisos';

export const Sidebar = ({ activeTab, setActiveTab, onOpenSimulador }) => {
  const { usuarioActual, logout } = useApp();

  const allNavItems = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'reservas', label: 'Reservas', icon: Calendar },
    { id: 'camaras', label: 'Cámaras IA', icon: Camera },
    { id: 'espera', label: 'Lista de Espera', icon: Users },
    { id: 'alertas', label: 'Incidencias IA', icon: AlertTriangle },
    { id: 'usuarios', label: 'Personal', icon: UserCheck },
    { id: 'configuracion', label: 'Configuración', icon: Settings },
  ];

  // Filtrar elementos según la matriz de permisos del rol del usuario actual
  const navItems = allNavItems.filter((item) =>
    puedeAccederTab(usuarioActual?.rol, item.id)
  );

  const getRoleLabel = (rol) => {
    switch (rol) {
      case 'ADMINISTRADOR':
        return 'Administrador de Campus';
      case 'SUPERVISOR':
        return 'Supervisor de Campus';
      case 'OPERADOR':
        return 'Operador de Monitoreo';
      case 'SEGURIDAD':
        return 'Seguridad de Campus';
      case 'RECEPCION_BIBLIOTECA':
        return 'Recepción / Biblioteca';
      default:
        return 'Personal UTP';
    }
  };

  return (
    <aside className="sidebar">
      {/* Brand Header */}
      <div className="sidebar-brand">
        <div className="brand-icon-wrap">
          <GraduationCap size={22} />
        </div>
        <div className="brand-text">
          <strong>UTP Campus Piura</strong>
          <span>Salas de Estudio IA</span>
        </div>
      </div>

      {/* Navigation Links Filtrados por Permisos */}
      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
            >
              <Icon size={19} className="nav-icon" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      {/* User Card & Simulator in Footer */}
      <div className="sidebar-footer">
        {tienePermiso(usuarioActual?.rol, PERMISOS.USAR_SIMULADOR) && (
          <button className="sim-pill-btn" onClick={onOpenSimulador}>
            <Sparkles size={15} color="#c8102e" />
            <span>Simulador de Eventos</span>
          </button>
        )}

        <div className="user-profile-box">
          <div className="user-profile-name">{usuarioActual?.nombre_completo || 'Personal UTP'}</div>
          <div className="user-profile-id">{usuarioActual?.codigo_institucional || 'UTP-001'}</div>
          <span className="user-profile-role">{getRoleLabel(usuarioActual?.rol)}</span>
        </div>

        <button
          className="nav-item"
          style={{ padding: '8px 12px', fontSize: '12.5px', color: '#dc2626' }}
          onClick={logout}
          title="Cerrar Sesión"
        >
          <LogOut size={16} />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </aside>
  );
};
