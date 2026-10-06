import React from 'react';
import { Search, Bell, MessageSquare, Video, Camera } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Navbar = ({ onNavigateToCamaras }) => {
  const { alertas } = useApp();
  const pendientesCount = alertas.filter((a) => a.estado === 'PENDIENTE').length;

  return (
    <header className="top-header">
      <div className="header-left">
        <div className="search-box">
          <Search size={16} className="search-icon" />
          <input type="text" placeholder="Buscar sala por número o código..." />
        </div>
      </div>

      <div className="header-right">
        {/* Badge interactivo exclusivo para ir a Cámaras IA */}
        <button
          className="cam-badge-status"
          onClick={onNavigateToCamaras}
          style={{ cursor: 'pointer', border: '1px solid #a7f3d0' }}
          title="Ver transmisión de cámaras IA en vivo"
        >
          <span className="dot-pulse"></span>
          <Video size={14} />
          <span>Cámaras IA: 6/6 Online</span>
        </button>

        <div className="header-actions">
          <button className="btn-icon-action" onClick={onNavigateToCamaras} title="Acceso a Cámaras IA">
            <Camera size={17} />
          </button>

          <button className="btn-icon-action" title="Mensajes">
            <MessageSquare size={17} />
          </button>

          <button className="btn-icon-action" title="Incidencias IA">
            <Bell size={17} />
            {pendientesCount > 0 && <span className="badge-counter">{pendientesCount}</span>}
          </button>
        </div>
      </div>
    </header>
  );
};
