import React, { useState } from 'react';
import {
  Video,
  Camera,
  Maximize2,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Users,
  Eye,
  Activity,
  Wifi,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const CamarasPage = () => {
  const { salas, addToast } = useApp();
  const [fullscreenCam, setFullscreenCam] = useState(null);

  const camarasData = [
    {
      id: 1,
      sala_id: 1,
      sala_nombre: 'Sala 101',
      codigo_camara: 'CAM-A101',
      ip_camara: '192.168.1.101',
      url_stream: 'rtsp://192.168.1.101:554/live/sala101',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 0,
      comida_detectada: false,
      imagen_url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'PC Monitor', top: '30%', left: '35%', w: '30%', h: '35%', color: '#10b981' },
        { label: 'Teclado', top: '70%', left: '38%', w: '25%', h: '15%', color: '#10b981' },
      ],
    },
    {
      id: 2,
      sala_id: 2,
      sala_nombre: 'Sala 102',
      codigo_camara: 'CAM-A102',
      ip_camara: '192.168.1.102',
      url_stream: 'rtsp://192.168.1.102:554/live/sala102',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 0,
      comida_detectada: false,
      imagen_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'PC Monitor', top: '25%', left: '40%', w: '28%', h: '35%', color: '#10b981' },
      ],
    },
    {
      id: 3,
      sala_id: 3,
      sala_nombre: 'Sala 103',
      codigo_camara: 'CAM-A103',
      ip_camara: '192.168.1.103',
      url_stream: 'rtsp://192.168.1.103:554/live/sala103',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 4,
      comida_detectada: true,
      imagen_url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Persona #1 (96%)', top: '20%', left: '15%', w: '25%', h: '60%', color: '#3b82f6' },
        { label: 'Persona #2 (94%)', top: '22%', left: '55%', w: '25%', h: '58%', color: '#3b82f6' },
        { label: 'Alimento Prohibido (92%)', top: '65%', left: '42%', w: '18%', h: '22%', color: '#ef4444' },
      ],
    },
    {
      id: 4,
      sala_id: 4,
      sala_nombre: 'Sala 104',
      codigo_camara: 'CAM-A104',
      ip_camara: '192.168.1.104',
      url_stream: 'rtsp://192.168.1.104:554/live/sala104',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 3,
      comida_detectada: false,
      imagen_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'Persona #1 (95%)', top: '25%', left: '20%', w: '25%', h: '55%', color: '#3b82f6' },
        { label: 'Persona #2 (91%)', top: '28%', left: '50%', w: '25%', h: '52%', color: '#3b82f6' },
      ],
    },
    {
      id: 5,
      sala_id: 5,
      sala_nombre: 'Sala 105',
      codigo_camara: 'CAM-A105',
      ip_camara: '192.168.1.105',
      url_stream: 'rtsp://192.168.1.105:554/live/sala105',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 0,
      comida_detectada: false,
      imagen_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'PC Monitor', top: '25%', left: '32%', w: '38%', h: '40%', color: '#10b981' },
        { label: '0 Ocupantes (Liberando)', top: '10%', left: '10%', w: '80%', h: '80%', color: '#f59e0b' },
      ],
    },
    {
      id: 6,
      sala_id: 6,
      sala_nombre: 'Sala 106',
      codigo_camara: 'CAM-A106',
      ip_camara: '192.168.1.106',
      url_stream: 'rtsp://192.168.1.106:554/live/sala106',
      fps: 30,
      resolucion: '1920x1080 (Full HD)',
      estado: 'ONLINE',
      personas_detectadas: 0,
      comida_detectada: false,
      imagen_url: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=800&q=80',
      boxes: [
        { label: 'PC Monitor', top: '30%', left: '35%', w: '30%', h: '35%', color: '#10b981' },
      ],
    },
  ];

  return (
    <div className="page-view">
      {/* Hero Header Espacioso y Limpio */}
      <div className="hero-welcome-card" style={{ marginBottom: '8px' }}>
        <div className="hero-text-wrap">
          <div className="hero-title-row">
            <h1>Cámaras de Visión Artificial en Vivo (RTSP)</h1>
            <span className="role-badge-pill" style={{ backgroundColor: '#ecfdf5', color: '#047857' }}>
              6 Canales Activos
            </span>
          </div>
          <p>Transmisión continua y procesamiento de Computer Vision (YOLOv8 + OpenCV) en tiempo real.</p>
        </div>

        <div className="hero-actions-row">
          <div className="cam-badge-status">
            <span className="dot-pulse"></span>
            <Wifi size={14} />
            <span>6/6 Streams Online</span>
          </div>
          <button
            className="btn-utp-primary"
            onClick={() => addToast('Todos los streams RTSP reiniciados y sincronizados.', 'success')}
          >
            <RefreshCw size={15} />
            <span>Reconectar Cámaras</span>
          </button>
        </div>
      </div>

      {/* Grilla de Cámaras de Video con Overlay de IA */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '20px' }}>
        {camarasData.map((cam) => (
          <div
            key={cam.id}
            className="panel-card"
            style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            {/* Header de la Tarjeta de Cámara */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <strong style={{ fontSize: '15px', color: '#0f172a' }}>{cam.sala_nombre}</strong>
                <span style={{ fontSize: '11px', color: '#64748b', marginLeft: '6px' }}>({cam.codigo_camara})</span>
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '4px',
                  backgroundColor: '#ecfdf5',
                  color: '#065f46',
                  fontSize: '11px',
                  fontWeight: 800,
                  padding: '2px 8px',
                  borderRadius: '12px',
                }}
              >
                <span className="dot-pulse" style={{ width: '5px', height: '5px' }}></span>
                ONLINE ({cam.fps} FPS)
              </span>
            </div>

            {/* Viewport de Cámara con Bounding Boxes */}
            <div
              className="ia-snapshot-viewport"
              style={{ height: '220px', cursor: 'pointer' }}
              onClick={() => setFullscreenCam(cam)}
              title="Click para ampliar vista"
            >
              <img src={cam.imagen_url} alt={cam.codigo_camara} className="ia-snapshot-img" />

              {/* Bounding Boxes */}
              {cam.boxes.map((box, bIdx) => (
                <div
                  key={bIdx}
                  className="bounding-box"
                  style={{
                    top: box.top,
                    left: box.left,
                    width: box.w,
                    height: box.h,
                    borderColor: box.color,
                    backgroundColor: `${box.color}22`,
                  }}
                >
                  <span className="bounding-tag" style={{ backgroundColor: box.color }}>
                    {box.label}
                  </span>
                </div>
              ))}

              {/* Overlay inferior con datos de red */}
              <div
                style={{
                  position: 'absolute',
                  bottom: '8px',
                  left: '8px',
                  right: '8px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  backgroundColor: 'rgba(15, 23, 42, 0.75)',
                  backdropFilter: 'blur(3px)',
                  padding: '4px 10px',
                  borderRadius: '6px',
                  fontSize: '10.5px',
                  color: '#e2e8f0',
                  fontWeight: 600,
                }}
              >
                <span>IP: {cam.ip_camara}</span>
                <span>{cam.resolucion}</span>
              </div>
            </div>

            {/* Footer de la Cámara: Ocupantes e Infracciones */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={14} color="#64748b" />
                <span style={{ fontWeight: 700, color: '#0f172a' }}>
                  {cam.personas_detectadas} {cam.personas_detectadas === 1 ? 'persona' : 'personas'}
                </span>
              </div>

              {cam.comida_detectada && (
                <span
                  style={{
                    backgroundColor: '#fee2e2',
                    color: '#b91c1c',
                    fontWeight: 800,
                    fontSize: '10.5px',
                    padding: '2px 8px',
                    borderRadius: '6px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <AlertTriangle size={12} /> Alimento Detectado
                </span>
              )}

              <button
                className="severity-filter-btn"
                style={{ fontSize: '11px', padding: '4px 10px' }}
                onClick={() => setFullscreenCam(cam)}
              >
                <Eye size={12} /> Inspeccionar
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Modal de Inspección Fullscreen */}
      {fullscreenCam && (
        <div className="modal-backdrop" onClick={() => setFullscreenCam(null)}>
          <div className="modal-card" style={{ maxWidth: '750px' }} onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Camera size={18} color="#c8102e" />
                <h2>Inspección de Transmisión IA: {fullscreenCam.sala_nombre} ({fullscreenCam.codigo_camara})</h2>
              </div>
              <button className="btn-icon-action" onClick={() => setFullscreenCam(null)}>
                <Maximize2 size={16} />
              </button>
            </div>

            <div className="modal-body">
              <div className="ia-snapshot-viewport" style={{ height: '360px' }}>
                <img src={fullscreenCam.imagen_url} alt="Fullscreen Cam" className="ia-snapshot-img" />

                {fullscreenCam.boxes.map((box, bIdx) => (
                  <div
                    key={bIdx}
                    className="bounding-box"
                    style={{
                      top: box.top,
                      left: box.left,
                      width: box.w,
                      height: box.h,
                      borderColor: box.color,
                      backgroundColor: `${box.color}25`,
                    }}
                  >
                    <span className="bounding-tag" style={{ backgroundColor: box.color }}>
                      {box.label}
                    </span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginTop: '6px' }}>
                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>RTSP Stream URI:</span>
                  <strong style={{ display: 'block', fontSize: '11.5px', color: '#0f172a', wordBreak: 'break-all' }}>
                    {fullscreenCam.url_stream}
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Personas Detectadas:</span>
                  <strong style={{ display: 'block', fontSize: '14px', color: '#0f172a' }}>
                    {fullscreenCam.personas_detectadas} Alumnos
                  </strong>
                </div>

                <div style={{ background: '#f8fafc', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Infracciones de Convivencia:</span>
                  <strong
                    style={{
                      display: 'block',
                      fontSize: '13px',
                      color: fullscreenCam.comida_detectada ? '#c8102e' : '#059669',
                    }}
                  >
                    {fullscreenCam.comida_detectada ? 'Comida No Permitida' : 'Ninguna (Sala OK)'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-utp-primary" onClick={() => setFullscreenCam(null)}>
                Cerrar Visor
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
