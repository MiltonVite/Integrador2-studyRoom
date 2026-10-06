import React, { useState } from 'react';
import {
  Monitor,
  PenTool,
  Users,
  Plus,
  Clock,
  AlertTriangle,
  DoorOpen,
  UserCheck,
  TrendingUp,
  Camera,
  Calendar as CalendarIcon,
  CheckCircle2,
  Sparkles,
  ShieldAlert,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ModalNuevaReserva } from '../components/ModalNuevaReserva';
import { ModalConfirmarLiberacion } from '../components/ModalConfirmarLiberacion';

export const DashboardPage = ({ onNavigateToAlerts, onNavigateToEspera }) => {
  const { salas, alertas, listaEspera } = useApp();
  const [modalReservaOpen, setModalReservaOpen] = useState(false);
  const [modalLiberarOpen, setModalLiberarOpen] = useState(false);
  const [selectedRoomId, setSelectedRoomId] = useState(null);
  const [salaParaLiberar, setSalaParaLiberar] = useState(null);

  // Cálculos en tiempo real
  const totalSalas = salas.length;
  const libres = salas.filter((s) => s.estado === 'LIBRE').length;
  const ocupadas = salas.filter((s) => s.estado === 'OCUPADA' || s.estado === 'PROTOCOLO_LIBERACION').length;
  const totalAlertas = alertas.filter((a) => a.estado === 'PENDIENTE').length;
  const tasaOcupacion = Math.round((ocupadas / totalSalas) * 100);

  const handleOpenReserva = (roomId) => {
    setSelectedRoomId(roomId);
    setModalReservaOpen(true);
  };

  const handleSolicitarLiberacion = (sala) => {
    setSalaParaLiberar(sala);
    setModalLiberarOpen(true);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="page-view">
      {/* 1. Hero Welcome Card */}
      <div className="hero-welcome-card">
        <div className="hero-text-wrap">
          <div className="hero-title-row">
            <h1>¡Hola, Milton Aldair!</h1>
            <span className="role-badge-pill">Administrador</span>
          </div>
          <p>Resumen general y métricas del sistema inteligente de salas de estudio con IA.</p>
        </div>

        <div className="hero-actions-row">
          <div className="date-pill">
            <CalendarIcon size={16} color="#64748b" />
            <span>5 de octubre de 2026</span>
          </div>
          <button className="btn-utp-primary" onClick={() => handleOpenReserva(null)}>
            <Plus size={16} />
            <span>+ Reservar Nueva Sala</span>
          </button>
        </div>
      </div>

      {/* 2. KPI Cards (Estilo Limpio de la Imagen de Referencia) */}
      <div className="kpi-grid">
        {/* KPI 1: TOTAL SALAS */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">TOTAL SALAS</span>
            <div className="kpi-icon-pill blue">
              <DoorOpen size={18} />
            </div>
          </div>
          <div className="kpi-value">{totalSalas < 10 ? `0${totalSalas}` : totalSalas}</div>
          <span className="kpi-subtext">Salas de estudio habilitadas</span>
        </div>

        {/* KPI 2: SALAS DISPONIBLES */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">DISPONIBLES</span>
            <div className="kpi-icon-pill green">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#059669' }}>
            {libres < 10 ? `0${libres}` : libres}
          </div>
          <span className="kpi-subtext">Espacios libres para reserva</span>
        </div>

        {/* KPI 3: TASA DE OCUPACIÓN */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">% OCUPACIÓN</span>
            <div className="kpi-icon-pill purple">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#7c3aed' }}>
            {tasaOcupacion}%
          </div>
          <span className="kpi-subtext">{ocupadas} salas con estudiantes</span>
        </div>

        {/* KPI 4: INCIDENCIAS IA */}
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">INCIDENCIAS IA</span>
            <div className="kpi-icon-pill red">
              <ShieldAlert size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>
            {totalAlertas < 10 ? `0${totalAlertas}` : totalAlertas}
          </div>
          <span className="kpi-subtext">Reportes de abandono o alimentos</span>
        </div>
      </div>

      {/* 3. Sección de Analítica y Estado de Salas */}
      <div className="section-divider-title">MONITOREO DE SALAS EN TIEMPO REAL</div>

      <div className="dashboard-layout">
        {/* Grilla de Salas Físicas */}
        <div className="rooms-grid">
          {salas.map((sala) => {
            const isLibre = sala.estado === 'LIBRE';
            const isProtocolo = sala.estado === 'PROTOCOLO_LIBERACION';
            const isOcupada = sala.estado === 'OCUPADA';

            return (
              <div key={sala.id} className="room-card">
                <div className="room-card-header">
                  <span className="room-index-tag">SALA {sala.numero}</span>
                  {isLibre && <span className="status-pill free">• LIBRE</span>}
                  {isOcupada && <span className="status-pill occupied">• OCUPADA</span>}
                  {isProtocolo && <span className="status-pill protocol">• LIBERANDO IA</span>}
                </div>

                <div className="room-name">{sala.nombre}</div>

                {/* Equipamiento */}
                <div className="equipment-row">
                  <span className="equipment-badge">
                    <Monitor size={12} /> PC Completa
                  </span>
                  <span className="equipment-badge">
                    <PenTool size={12} /> Pizarra
                  </span>
                </div>

                <div className="capacity-info">
                  <Users size={14} />
                  <span>Capacidad: {sala.capacidad} prs.</span>
                </div>

                {/* Ocupada Normal */}
                {isOcupada && (
                  <div className="occupancy-time-box">
                    <div className="time-row">
                      <span style={{ color: '#64748b' }}>Tiempo restante:</span>
                      <strong style={{ color: '#0f172a' }}>{sala.tiempo_restante_min} min</strong>
                    </div>
                    <div className="progress-bar-bg">
                      <div
                        className="progress-bar-fill"
                        style={{
                          width: `${Math.min(100, ((120 - sala.tiempo_restante_min) / 120) * 100)}%`,
                        }}
                      ></div>
                    </div>
                    <div style={{ fontSize: '10px', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                      <span>Ocupantes: {sala.ocupantes_actuales}/{sala.capacidad}</span>
                      <span>Máx: 2h</span>
                    </div>
                  </div>
                )}

                {/* Protocolo Sala Libre Activado */}
                {isProtocolo && (
                  <div className="protocol-banner">
                    <div className="protocol-header">
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Camera size={13} /> Protocolo Sala Libre:
                      </span>
                      <span className="protocol-timer">{formatTimer(sala.protocolo_segundos)}</span>
                    </div>
                    <p className="protocol-text">
                      Alumnos salieron antes. Liberando automáticamente en {formatTimer(sala.protocolo_segundos)} min.
                    </p>
                  </div>
                )}

                {/* Botón de Acción con Modal de Confirmación */}
                {isLibre ? (
                  <button className="btn-room-action" onClick={() => handleOpenReserva(sala.id)}>
                    <span className="utp-tag">UTP</span>
                    <span>Reservar ahora (1h - 2h)</span>
                  </button>
                ) : (
                  <button className="btn-room-action btn-danger" onClick={() => handleSolicitarLiberacion(sala)}>
                    <span>Liberar Sala Inmediatamente</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Panel Lateral Derecho: Incidencias + Lista de Espera */}
        <div className="right-sidebar-panel">
          {/* Panel Alertas IA */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>
                <AlertTriangle size={16} color="#c8102e" /> Incidencias IA
              </h3>
              <span className="panel-link" onClick={onNavigateToAlerts}>
                Ver todas →
              </span>
            </div>

            <div className="alerts-list">
              {alertas.slice(0, 3).map((alerta) => (
                <div
                  key={alerta.id}
                  className={`alert-item-card ${
                    alerta.severidad === 'CRITICA'
                      ? 'critica'
                      : alerta.severidad === 'IMPORTANTE'
                      ? 'advertencia'
                      : 'informativa'
                  }`}
                  onClick={onNavigateToAlerts}
                >
                  <div className="alert-item-title">
                    <span>{alerta.titulo}</span>
                    <span style={{ fontSize: '10.5px', color: '#94a3b8' }}>{alerta.hora}</span>
                  </div>
                  <p className="alert-item-desc">{alerta.descripcion}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Panel Lista de Espera */}
          <div className="panel-card">
            <div className="panel-header">
              <h3>
                <Users size={16} color="#2563eb" /> Lista de Espera
              </h3>
              <span className="panel-link" onClick={onNavigateToEspera}>
                Gestionar →
              </span>
            </div>

            <div className="waitlist-items">
              {listaEspera.map((item) => (
                <div key={item.id} className="waitlist-row">
                  <div className="waitlist-user">
                    <div className="waitlist-avatar">#{item.prioridad}</div>
                    <div className="waitlist-meta">
                      <strong>{item.nombre}</strong>
                      <span>{item.codigo} • {item.integrantes} prs.</span>
                    </div>
                  </div>
                  <span className="waitlist-room-pill">{item.sala_deseada}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modal Nueva Reserva */}
      <ModalNuevaReserva
        isOpen={modalReservaOpen}
        onClose={() => setModalReservaOpen(false)}
        preselectedRoomId={selectedRoomId}
      />

      {/* Modal de Confirmación de Liberación de Sala */}
      <ModalConfirmarLiberacion
        isOpen={modalLiberarOpen}
        onClose={() => setModalLiberarOpen(false)}
        sala={salaParaLiberar}
      />
    </div>
  );
};
