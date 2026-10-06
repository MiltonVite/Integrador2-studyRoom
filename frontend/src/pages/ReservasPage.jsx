import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  UserCheck,
  UserX,
  Plus,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  AlertCircle,
  DoorOpen,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ModalNuevaReserva } from '../components/ModalNuevaReserva';
import { ModalConfirmarLiberacion } from '../components/ModalConfirmarLiberacion';
import { tienePermiso, PERMISOS } from '../utils/permisos';

export const ReservasPage = () => {
  const { salas, usuarioActual } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalLiberarOpen, setModalLiberarOpen] = useState(false);
  const [selectedReserva, setSelectedReserva] = useState({
    id: 'RES-102',
    estudiante: 'Andrea Ruiz',
    codigo_alumno: 'U20199821',
    sala_nombre: 'Sala 102',
    sala_id: 2,
    horario: '09:00 - 11:00',
    integrantes: 4,
    estado: 'EN_CURSO',
    validado_ia: true,
    personas_detectadas: 4,
  });

  const hours = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00'];

  const timelineData = [
    {
      sala: 'Sala 101',
      reservas: [
        { id: 'r1', inicio: '08:00', fin: '10:00', estudiante: 'U20199821 - Grupal', tipo: 'no-show', color: '#b91c1c' },
        { id: 'r2', inicio: '12:00', fin: '14:00', estudiante: 'U18274563 - Grupal', tipo: 'normal', color: '#091a36' },
      ],
    },
    {
      sala: 'Sala 102',
      reservas: [
        { id: 'r3', inicio: '09:00', fin: '11:00', estudiante: 'U20199821 - Andrea', tipo: 'active', color: '#091a36' },
        { id: 'r4', inicio: '12:00', fin: '14:00', estudiante: 'U17283940 - Reunión', tipo: 'normal', color: '#1e293b' },
      ],
    },
    {
      sala: 'Sala 103',
      reservas: [
        { id: 'r5', inicio: '10:00', fin: '12:00', estudiante: 'U19123456 - Estudio', tipo: 'normal', color: '#091a36' },
        { id: 'r6', inicio: '13:00', fin: '15:00', estudiante: 'U20199821 - Piso 1', tipo: 'normal', color: '#1e293b' },
      ],
    },
    {
      sala: 'Sala 104',
      reservas: [
        { id: 'r7', inicio: '08:00', fin: '09:00', estudiante: 'Grupo A - Examen', tipo: 'no-show', color: '#b91c1c' },
        { id: 'r8', inicio: '11:00', fin: '13:00', estudiante: 'U20199821 - Proyectos', tipo: 'normal', color: '#091a36' },
      ],
    },
    {
      sala: 'Sala 105',
      reservas: [
        { id: 'r9', inicio: '08:00', fin: '10:00', estudiante: 'U19876543 - Grupal', tipo: 'no-show', color: '#b91c1c' },
        { id: 'r10', inicio: '12:00', fin: '14:00', estudiante: 'U20199821 - Tesis', tipo: 'normal', color: '#091a36' },
      ],
    },
    {
      sala: 'Sala 106',
      reservas: [
        { id: 'r11', inicio: '10:00', fin: '12:00', estudiante: 'L. Pérez - Grupal', tipo: 'normal', color: '#091a36' },
      ],
    },
  ];

  const salaSeleccionadaObj = salas.find((s) => s.id === selectedReserva?.sala_id) || salas[0];

  return (
    <div className="page-view">
      {/* Header */}
      <div className="view-header">
        <div className="view-title-wrap">
          <h1>Gestión de Reservas y Calendario</h1>
          <p>Supervisión horaria, validación por visión artificial y prevención de No-Shows</p>
        </div>
        <div className="view-actions-row">
          <div className="date-pill">
            <CalendarIcon size={16} color="#64748b" />
            <span>Hoy, 17 Octubre 2026</span>
          </div>
          {tienePermiso(usuarioActual?.rol, PERMISOS.CREAR_RESERVA) && (
            <button className="btn-utp-primary" onClick={() => setModalOpen(true)}>
              <Plus size={16} />
              <span>Nueva Reserva</span>
            </button>
          )}
        </div>
      </div>

      {/* KPI Cards de Reservas */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">RESERVAS HOY</span>
            <div className="kpi-icon-pill blue">
              <CalendarIcon size={18} />
            </div>
          </div>
          <div className="kpi-value">64</div>
          <span className="kpi-subtext">Total de bloques programados</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">EN CURSO</span>
            <div className="kpi-icon-pill green">
              <UserCheck size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#059669' }}>
            09
          </div>
          <span className="kpi-subtext">Estudiantes en sala</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">PRÓXIMAS</span>
            <div className="kpi-icon-pill purple">
              <Clock size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#7c3aed' }}>
            28
          </div>
          <span className="kpi-subtext">Programadas en la tarde</span>
        </div>

        <div className="kpi-card">
          <div className="kpi-top-row">
            <span className="kpi-label">NO-SHOW DETECTADOS</span>
            <div className="kpi-icon-pill red">
              <UserX size={18} />
            </div>
          </div>
          <div className="kpi-value" style={{ color: '#dc2626' }}>
            04
          </div>
          <span className="kpi-subtext">Liberadas automáticamente</span>
        </div>
      </div>

      {/* Grid Principal: Timeline + Detalle */}
      <div className="dashboard-layout" style={{ gridTemplateColumns: '1fr 340px' }}>
        {/* Matriz de Tiempo */}
        <div className="timeline-container">
          <div className="timeline-header-hours">
            <div style={{ textAlign: 'left', color: '#0f172a' }}>SALA</div>
            {hours.map((h) => (
              <div key={h}>{h}</div>
            ))}
          </div>

          {timelineData.map((row, idx) => (
            <div key={idx} className="timeline-row">
              <div className="timeline-room-label">{row.sala}</div>
              {hours.map((hour, hIdx) => {
                const res = row.reservas.find((r) => r.inicio === hour);
                return (
                  <div key={hIdx} className="timeline-slot">
                    {res && (
                      <div
                        className={`reservation-block ${res.tipo}`}
                        onClick={() =>
                          setSelectedReserva({
                            id: res.id,
                            estudiante: res.estudiante.split(' - ')[1] || 'Estudiante UTP',
                            codigo_alumno: res.estudiante.split(' - ')[0] || 'U20199821',
                            sala_nombre: row.sala,
                            sala_id: idx + 1,
                            horario: `${res.inicio} - ${res.fin}`,
                            integrantes: 4,
                            estado: res.tipo === 'no-show' ? 'NO_SHOW_LIBERADO' : 'EN_CURSO',
                            validado_ia: true,
                            personas_detectadas: res.tipo === 'no-show' ? 0 : 4,
                          })
                        }
                      >
                        <span style={{ fontSize: '10px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {res.estudiante}
                        </span>
                        <span style={{ fontSize: '9px', opacity: 0.8 }}>
                          {res.inicio}-{res.fin}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Panel Lateral: Detalle de Reserva */}
        <div className="panel-card" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <h3>Detalle de Reserva Seleccionada</h3>
          </div>

          {selectedReserva ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div
                  style={{
                    width: '46px',
                    height: '46px',
                    borderRadius: '50%',
                    backgroundColor: '#0f172a',
                    color: 'white',
                    fontWeight: 800,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '15px',
                  }}
                >
                  AR
                </div>
                <div>
                  <strong style={{ fontSize: '15px', color: '#0f172a', display: 'block' }}>
                    {selectedReserva.estudiante}
                  </strong>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Código: ({selectedReserva.codigo_alumno})
                  </span>
                </div>
              </div>

              <div style={{ background: '#f8fafc', padding: '14px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>Espacio Asignado:</div>
                <div style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a' }}>
                  {selectedReserva.sala_nombre}
                </div>
                <div style={{ fontSize: '13px', color: '#334155', fontWeight: 600, marginTop: '4px' }}>
                  Horario: {selectedReserva.horario}
                </div>
              </div>

              {/* Validación IA */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  backgroundColor: '#ecfdf5',
                  border: '1px solid #a7f3d0',
                  color: '#065f46',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  fontSize: '12px',
                  fontWeight: 700,
                }}
              >
                <CheckCircle2 size={16} />
                <span>Validado por Visión IA (Ocupantes: {selectedReserva.personas_detectadas})</span>
              </div>

              <button
                className="btn-room-action btn-danger"
                style={{ padding: '10px' }}
                onClick={() => setModalLiberarOpen(true)}
              >
                <DoorOpen size={15} />
                <span>Cancelar / Liberar Reserva</span>
              </button>
            </div>
          ) : (
            <p style={{ fontSize: '13px', color: '#64748b' }}>Selecciona una reserva en la matriz para ver los detalles.</p>
          )}
        </div>
      </div>

      {/* Modal Nueva Reserva */}
      <ModalNuevaReserva isOpen={modalOpen} onClose={() => setModalOpen(false)} />

      {/* Modal de Confirmación de Liberación de Sala */}
      <ModalConfirmarLiberacion
        isOpen={modalLiberarOpen}
        onClose={() => setModalLiberarOpen(false)}
        sala={salaSeleccionadaObj}
      />
    </div>
  );
};
