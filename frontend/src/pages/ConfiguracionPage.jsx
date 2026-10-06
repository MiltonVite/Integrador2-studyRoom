import React, { useState } from 'react';
import { Settings, Sliders, Camera, Save, CheckCircle2, ShieldAlert } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ConfiguracionPage = () => {
  const { config, setConfig, salas, addToast } = useApp();
  const [formData, setFormData] = useState({ ...config });
  const [salasEquipamiento, setSalasEquipamiento] = useState(
    salas.map((s) => ({
      id: s.id,
      nombre: s.nombre,
      pc: true,
      pizarra: true,
      sillas: true,
      rtsp: 'OK/Conectado',
    }))
  );

  const handleSave = () => {
    setConfig(formData);
    addToast('¡Parámetros del sistema y visión artificial guardados con éxito!', 'success');
  };

  return (
    <div className="page-view">
      {/* Hero Header Espacioso */}
      <div className="hero-welcome-card" style={{ marginBottom: '8px' }}>
        <div className="hero-text-wrap">
          <div className="hero-title-row">
            <h1>Configuración del Sistema y Parámetros IA</h1>
            <span className="role-badge-pill" style={{ backgroundColor: '#f1f5f9', color: '#334155' }}>
              Ajustes Globales
            </span>
          </div>
          <p>Ajuste de tiempos de tolerancia de abandono, umbrales de visión artificial y periféricos de sala.</p>
        </div>

        <div className="hero-actions-row">
          <button className="btn-utp-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </div>

      {/* Grid Superior de 2 Columnas de Parámetros */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        {/* Card 1: Políticas de Tiempo de Reserva */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>
              <Sliders size={16} color="#c8102e" /> Políticas de Tiempo de Reserva
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Duración Mínima</label>
                <select
                  className="form-select"
                  value={formData.duracion_min_minutos}
                  onChange={(e) => setFormData({ ...formData, duracion_min_minutos: Number(e.target.value) })}
                >
                  <option value={30}>30 Minutos</option>
                  <option value={60}>1 Hora (60 min)</option>
                  <option value={90}>1h 30m (90 min)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Duración Máxima</label>
                <select
                  className="form-select"
                  value={formData.duracion_max_minutos}
                  onChange={(e) => setFormData({ ...formData, duracion_max_minutos: Number(e.target.value) })}
                >
                  <option value={60}>1 Hora (60 min)</option>
                  <option value={120}>2 Horas (120 min)</option>
                  <option value={180}>3 Horas (180 min)</option>
                </select>
              </div>
            </div>

            <p style={{ fontSize: '11px', color: '#64748b' }}>
              Duración de reserva acomodada en franjas inmediatas o incremento de personas, como un tiempo de reserva estándar UTP.
            </p>
          </div>
        </div>

        {/* Card 2: Protocolo Sala Libre (Computer Vision) */}
        <div className="panel-card">
          <div className="panel-header">
            <h3>
              <Camera size={16} color="#0284c7" /> Protocolo Sala Libre (Computer Vision)
            </h3>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', fontWeight: 700, marginBottom: '6px' }}>
                <span>Tiempo de tolerancia sin ocupantes antes de liberación:</span>
                <span style={{ color: '#c8102e', fontWeight: 800 }}>{formData.tolerancia_abandono_minutos} minutos</span>
              </div>
              <input
                type="range"
                min="2"
                max="15"
                step="1"
                value={formData.tolerancia_abandono_minutos}
                onChange={(e) =>
                  setFormData({ ...formData, tolerancia_abandono_minutos: Number(e.target.value) })
                }
                style={{ width: '100%', accentColor: '#c8102e', cursor: 'pointer' }}
              />
              <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                (Recomendado: 4-10 min para permitir salidas breves al baño)
              </span>
            </div>

            {/* Switches de IA */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingTop: '8px', borderTop: '1px solid #f1f5f9' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                Detección de mochilas / pertenencias personales
              </span>
              <input
                type="checkbox"
                checked={formData.detectar_mochilas}
                onChange={(e) => setFormData({ ...formData, detectar_mochilas: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#091a36' }}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', fontWeight: 600, color: '#1e293b' }}>
                Auto-notificar Lista de Espera tras liberación
              </span>
              <input
                type="checkbox"
                checked={formData.auto_notificar_espera}
                onChange={(e) => setFormData({ ...formData, auto_notificar_espera: e.target.checked })}
                style={{ width: '18px', height: '18px', accentColor: '#091a36' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tabla de Gestión de las 6 Salas Grupales */}
      <div className="panel-card">
        <div className="panel-header">
          <h3>Gestión de las 6 Salas Grupales y Cámaras RTSP</h3>
          <span style={{ fontSize: '12px', color: '#64748b' }}>
            Estado de cámaras muestra verde para OK. Checklists detallan periféricos (PC, monitor, mouse, teclado, candado y pizarra).
          </span>
        </div>

        <table className="audit-table">
          <thead>
            <tr>
              <th>SALA</th>
              <th style={{ textAlign: 'center' }}>PC COMPLETA</th>
              <th style={{ textAlign: 'center' }}>PIZARRA</th>
              <th style={{ textAlign: 'center' }}>SILLAS (X6)</th>
              <th>CÁMARA RTSP LINK STATUS</th>
            </tr>
          </thead>
          <tbody>
            {salasEquipamiento.map((sala, idx) => (
              <tr key={sala.id}>
                <td>
                  <strong style={{ fontSize: '13px', color: '#0f172a' }}>{sala.nombre}</strong>
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={sala.pc}
                    onChange={(e) => {
                      const updated = [...salasEquipamiento];
                      updated[idx].pc = e.target.checked;
                      setSalasEquipamiento(updated);
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#091a36' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={sala.pizarra}
                    onChange={(e) => {
                      const updated = [...salasEquipamiento];
                      updated[idx].pizarra = e.target.checked;
                      setSalasEquipamiento(updated);
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#091a36' }}
                  />
                </td>
                <td style={{ textAlign: 'center' }}>
                  <input
                    type="checkbox"
                    checked={sala.sillas}
                    onChange={(e) => {
                      const updated = [...salasEquipamiento];
                      updated[idx].sillas = e.target.checked;
                      setSalasEquipamiento(updated);
                    }}
                    style={{ width: '18px', height: '18px', accentColor: '#091a36' }}
                  />
                </td>
                <td>
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '6px',
                      backgroundColor: '#ecfdf5',
                      color: '#065f46',
                      fontWeight: 700,
                      fontSize: '12px',
                      padding: '4px 10px',
                      borderRadius: '12px',
                    }}
                  >
                    <span className="dot-pulse" style={{ width: '6px', height: '6px' }}></span>
                    {sala.rtsp}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
          <button className="btn-utp-primary" onClick={handleSave}>
            <Save size={16} />
            <span>Guardar Parámetros</span>
          </button>
        </div>
      </div>
    </div>
  );
};
