import React, { useState } from 'react';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  MonitorCheck,
  DoorOpen,
  UserX,
  Camera,
  ShieldCheck,
  Check,
  X,
  Filter,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const AlertasPage = () => {
  const { alertas, liberarSala, addToast } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('TODAS');
  const [selectedAlerta, setSelectedAlerta] = useState(alertas[0] || null);

  const filteredAlertas =
    filterSeverity === 'TODAS'
      ? alertas
      : alertas.filter((a) => a.severidad === filterSeverity);

  const handleConfirmarLiberacion = () => {
    if (!selectedAlerta) return;
    const salaId = Number(selectedAlerta.sala_codigo.split('-')[1]) || 5;
    liberarSala(salaId);
    addToast(`Sala ${selectedAlerta.sala_nombre} confirmada como LIBRE y reasignada a lista de espera.`, 'success');
  };

  const handleMantenerReserva = () => {
    addToast(`Alerta de ${selectedAlerta.sala_nombre} descartada. Reserva mantenida activa.`, 'warning');
  };

  return (
    <div className="page-view">
      {/* Hero Header Espacioso */}
      <div className="hero-welcome-card" style={{ marginBottom: '8px' }}>
        <div className="hero-text-wrap">
          <div className="hero-title-row">
            <h1>Centro de Incidencias y Auditoría IA</h1>
            <span className="role-badge-pill" style={{ backgroundColor: '#fee2e2', color: '#dc2626' }}>
              Supervisión Activa
            </span>
          </div>
          <p>Supervisión en tiempo real de infracciones de convivencia y desocupación anticipada de salas.</p>
        </div>
      </div>

      {/* KPI Cards de Auditoría IA */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">INCIDENCIAS HOY</span>
            <div className="kpi-icon-pill red">
              <AlertTriangle size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>08</div>
          <span className="kpi-subtext">Reportes registrados</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">LIBERADAS POR IA</span>
            <div className="kpi-icon-pill green">
              <DoorOpen size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#059669' }}>05</div>
          <span className="kpi-subtext">Salas recuperadas por ausencia</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">EQUIPAMIENTO PC</span>
            <div className="kpi-icon-pill blue">
              <MonitorCheck size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#2563eb' }}>6/6</div>
          <span className="kpi-subtext">Monitores y teclados OK</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">TIEMPO RESPUESTA</span>
            <div className="kpi-icon-pill orange">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value">3 min</div>
          <span className="kpi-subtext">Promedio de atención</span>
        </div>
      </div>

      {/* Filtros de Severidad */}
      <div className="severity-filter-bar" style={{ marginTop: '8px', marginBottom: '8px' }}>
        <span style={{ fontSize: '13px', fontWeight: 700, color: '#475569', alignSelf: 'center', marginRight: '4px' }}>
          Filtrar por Severidad:
        </span>
        {['TODAS', 'BAJA', 'MEDIA', 'IMPORTANTE', 'CRITICA'].map((sev) => (
          <button
            key={sev}
            className={`severity-filter-btn ${filterSeverity === sev ? 'active' : ''}`}
            onClick={() => setFilterSeverity(sev)}
          >
            {sev === 'TODAS' ? 'Todas' : sev.charAt(0) + sev.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Grid Principal: Tabla de Alertas + Visor de Snapshot IA */}
      <div className="alerts-audit-grid">
        {/* Tabla de Alertas */}
        <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="audit-table">
            <thead>
              <tr>
                <th>SEVERIDAD</th>
                <th>ALERTA / INCIDENCIA</th>
                <th>SALA</th>
                <th>HORA</th>
              </tr>
            </thead>
            <tbody>
              {filteredAlertas.map((alerta) => (
                <tr
                  key={alerta.id}
                  className={`audit-row ${selectedAlerta?.id === alerta.id ? 'selected' : ''}`}
                  onClick={() => setSelectedAlerta(alerta)}
                >
                  <td>
                    <span
                      className={`badge-severity ${
                        alerta.severidad === 'CRITICA'
                          ? 'critica'
                          : alerta.severidad === 'IMPORTANTE'
                          ? 'importante'
                          : 'baja'
                      }`}
                    >
                      {alerta.severidad}
                    </span>
                  </td>
                  <td>
                    <strong style={{ display: 'block', color: '#0f172a', fontSize: '13px' }}>
                      {alerta.titulo}
                    </strong>
                    <span style={{ fontSize: '11px', color: '#64748b' }}>
                      {alerta.descripcion.slice(0, 70)}...
                    </span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: '#0f172a' }}>{alerta.sala_nombre}</span>
                  </td>
                  <td>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{alerta.hora}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Derecho: Visor de Evidencia de Visión Artificial */}
        <div className="panel-card" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div className="panel-header" style={{ marginBottom: '0' }}>
            <h3>
              <Camera size={16} color="#c8102e" /> Detalle de Alerta: {selectedAlerta?.sala_nombre}
            </h3>
          </div>

          {selectedAlerta ? (
            <>
              {/* Snapshot con Bounding Boxes IA */}
              <div className="ia-snapshot-viewport">
                <img
                  src={selectedAlerta.evidencia_url}
                  alt="Snapshot Cámara IA"
                  className="ia-snapshot-img"
                />

                {/* Bounding Box 1: PC Monitor */}
                <div
                  className="bounding-box"
                  style={{ top: '25%', left: '32%', width: '38%', height: '40%' }}
                >
                  <span className="bounding-tag">PC Monitor Detectado</span>
                </div>

                {/* Bounding Box 2: Teclado */}
                <div
                  className="bounding-box"
                  style={{ top: '70%', left: '35%', width: '32%', height: '18%' }}
                >
                  <span className="bounding-tag">Teclado Detectado</span>
                </div>

                {/* Si la alerta es de comida, mostrar bounding box roja */}
                {selectedAlerta.tipo === 'ALIMENTO_PROHIBIDO' && (
                  <div
                    className="bounding-box food"
                    style={{ top: '55%', left: '15%', width: '20%', height: '25%' }}
                  >
                    <span className="bounding-tag">Alimento Prohibido</span>
                  </div>
                )}
              </div>

              {/* Indicador de Personas Detectadas */}
              <div
                style={{
                  textAlign: 'center',
                  padding: '10px',
                  backgroundColor: selectedAlerta.personas_detectadas === 0 ? '#fee2e2' : '#ecfdf5',
                  color: selectedAlerta.personas_detectadas === 0 ? '#b91c1c' : '#065f46',
                  borderRadius: '10px',
                  fontWeight: 800,
                  fontSize: '15px',
                }}
              >
                {selectedAlerta.personas_detectadas} Personas detectadas en sala
              </div>

              <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.4 }}>
                {selectedAlerta.descripcion}
              </p>

              {/* Botones de Acción Inmediata */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <button
                  className="btn-utp-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleConfirmarLiberacion}
                >
                  <Check size={16} />
                  <span>Confirmar Sala Libre Ahora</span>
                </button>

                <button
                  className="sim-pill-btn"
                  style={{ width: '100%', backgroundColor: '#091a36', color: 'white' }}
                  onClick={handleMantenerReserva}
                >
                  <ShieldCheck size={16} />
                  <span>Mantener Reserva (Descartar Alerta)</span>
                </button>
              </div>
            </>
          ) : (
            <p style={{ fontSize: '13px', color: '#64748b' }}>Selecciona una alerta para inspeccionar.</p>
          )}
        </div>
      </div>
    </div>
  );
};
