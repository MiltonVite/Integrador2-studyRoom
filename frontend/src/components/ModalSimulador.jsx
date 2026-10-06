import React from 'react';
import { X, Sparkles, UserX, Utensils, Smartphone, RefreshCw } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ModalSimulador = ({ isOpen, onClose }) => {
  const {
    salas,
    simularAbandonoSala,
    simularDeteccionComida,
    simularReservaUniversitaria,
    addToast,
  } = useApp();

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Sparkles size={18} color="#c8102e" />
            <h2>Simulador de Eventos de Visión Artificial e Integración</h2>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <div className="modal-body" style={{ gap: '14px' }}>
          <p style={{ fontSize: '13px', color: '#64748b' }}>
            Prueba cómo reacciona el sistema ante eventos automáticos de visión artificial (cámaras IA) y llamadas simuladas de la aplicación móvil de la universidad:
          </p>

          {/* Acción 1: Simular Abandono */}
          <div
            style={{
              padding: '12px 14px',
              border: '1px solid #fed7aa',
              backgroundColor: '#fffbeb',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong style={{ fontSize: '13px', color: '#9a3412', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <UserX size={16} /> 1. Detección de Sala Abandonada (0 Ocupantes)
              </strong>
              <span style={{ fontSize: '11px', color: '#c2410c' }}>
                Inicia el protocolo de temporizador para liberación y reasignación automática.
              </span>
            </div>
            <button
              className="btn-utp-primary"
              style={{ backgroundColor: '#ea580c', fontSize: '11px', padding: '6px 12px' }}
              onClick={() => {
                simularAbandonoSala(3); // Simular en Sala 103
                onClose();
              }}
            >
              Simular en Sala 103
            </button>
          </div>

          {/* Acción 2: Simular Alimento Prohibido */}
          <div
            style={{
              padding: '12px 14px',
              border: '1px solid #fecaca',
              backgroundColor: '#fef2f2',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong style={{ fontSize: '13px', color: '#991b1b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Utensils size={16} /> 2. Infracción: Alimentos / Bebidas
              </strong>
              <span style={{ fontSize: '11px', color: '#b91c1c' }}>
                La IA detecta snacks o gaseosas no permitidas y genera alerta inmediata.
              </span>
            </div>
            <button
              className="btn-utp-primary"
              style={{ fontSize: '11px', padding: '6px 12px' }}
              onClick={() => {
                simularDeteccionComida(4); // Simular en Sala 104
                onClose();
              }}
            >
              Simular en Sala 104
            </button>
          </div>

          {/* Acción 3: Simular Reserva desde App Externa Universitaria */}
          <div
            style={{
              padding: '12px 14px',
              border: '1px solid #bae6fd',
              backgroundColor: '#f0f9ff',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <strong style={{ fontSize: '13px', color: '#075985', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Smartphone size={16} /> 3. Webhook de App Universitaria
              </strong>
              <span style={{ fontSize: '11px', color: '#0369a1' }}>
                Simula una reserva remota entrante desde la app oficial de alumnos UTP.
              </span>
            </div>
            <button
              className="btn-utp-primary"
              style={{ backgroundColor: '#0284c7', fontSize: '11px', padding: '6px 12px' }}
              onClick={() => {
                simularReservaUniversitaria();
                onClose();
              }}
            >
              Recibir Reserva
            </button>
          </div>
        </div>

        <div className="modal-footer">
          <button className="btn-utp-primary" onClick={onClose} style={{ backgroundColor: '#0f172a' }}>
            Cerrar Simulador
          </button>
        </div>
      </div>
    </div>
  );
};
