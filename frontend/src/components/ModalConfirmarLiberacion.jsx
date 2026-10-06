import React, { useState } from 'react';
import { AlertTriangle, X, DoorOpen, CheckCircle, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ModalConfirmarLiberacion = ({ isOpen, onClose, sala }) => {
  const { liberarSala, addToast } = useApp();
  const [motivoLiberacion, setMotivoLiberacion] = useState('SALIDA_ANTICIPADA');
  const [observaciones, setObservaciones] = useState('');

  if (!isOpen || !sala) return null;

  const handleConfirmar = () => {
    liberarSala(sala.id);
    addToast(
      `Sala ${sala.nombre} liberada correctamente. Motivo registrado: ${motivoLiberacion}.`,
      'success'
    );
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '480px' }} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header" style={{ borderBottomColor: '#fee2e2', backgroundColor: '#fff5f5' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#c8102e',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <DoorOpen size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '16px', color: '#991b1b' }}>Confirmar Liberación de Sala</h2>
              <span style={{ fontSize: '11.5px', color: '#b91c1c' }}>
                Acción inmediata para habilitar el espacio a otros estudiantes
              </span>
            </div>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="modal-body" style={{ gap: '14px' }}>
          <div
            style={{
              padding: '12px 14px',
              backgroundColor: '#f8fafc',
              borderRadius: '10px',
              border: '1px solid #e2e8f0',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong style={{ fontSize: '14px', color: '#0f172a' }}>{sala.nombre} ({sala.codigo})</strong>
              <span className="status-pill occupied" style={{ fontSize: '10px' }}>
                {sala.estado}
              </span>
            </div>
            {sala.reserva_actual && (
              <span style={{ fontSize: '12px', color: '#64748b' }}>
                Titular actual: <strong>{sala.reserva_actual.estudiante}</strong> ({sala.reserva_actual.codigo_alumno})
              </span>
            )}
          </div>

          {/* Motivo de Liberación (Alineado con el campo reservas.motivo_liberacion) */}
          <div className="form-group">
            <label className="form-label">
              Motivo de Liberación (Auditoría BD) <span style={{ color: '#c8102e' }}>*</span>
            </label>
            <select
              className="form-select"
              value={motivoLiberacion}
              onChange={(e) => setMotivoLiberacion(e.target.value)}
            >
              <option value="SALIDA_ANTICIPADA">Salida Anticipada de Alumnos</option>
              <option value="ABANDONO_CONFIRMADO">Abandono Confirmado por Cámara IA</option>
              <option value="INFRACCION_CONVIVENCIA">Infracción al Reglamento (Alimentos / Ruido)</option>
              <option value="NO_SHOW_INASISTENCIA">No Asistió dentro de la Tolerancia</option>
              <option value="CANCELACION_ADMINISTRATIVA">Liberación Manual por Supervisor</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Observaciones Adicionales (Opcional)</label>
            <input
              type="text"
              className="form-input"
              placeholder="Ej: Verificado por personal de seguridad pabellón A"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
            />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 12px',
              backgroundColor: '#fffbeb',
              border: '1px solid #fef3c7',
              borderRadius: '8px',
              color: '#92400e',
              fontSize: '11.5px',
            }}
          >
            <AlertTriangle size={16} style={{ flexShrink: 0 }} />
            <span>Al confirmar, la sala pasará a estado <strong>DISPONIBLE</strong> y se notificará automáticamente al primer alumno en lista de espera.</span>
          </div>
        </div>

        {/* Footer */}
        <div className="modal-footer">
          <button type="button" className="severity-filter-btn" onClick={onClose}>
            Cancelar
          </button>
          <button
            type="button"
            className="btn-utp-primary"
            onClick={handleConfirmar}
            style={{ backgroundColor: '#c8102e' }}
          >
            <DoorOpen size={15} />
            <span>Confirmar y Liberar Sala</span>
          </button>
        </div>
      </div>
    </div>
  );
};
