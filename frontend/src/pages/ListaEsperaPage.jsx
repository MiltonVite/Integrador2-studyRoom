import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Users, Clock, ArrowRight, UserPlus, CheckCircle2, XCircle, BellRing, Filter, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { listaEsperaSchema } from '../schemas/reservaSchema';

export const ListaEsperaPage = () => {
  const { listaEspera, salas, reservarSala, addToast } = useApp();
  
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(listaEsperaSchema),
    mode: 'onChange',
    defaultValues: {
      codigo: '',
      nombre: '',
      tipo_sala: 'SALA_GRUPAL',
      integrantes: 3,
      sala_deseada: 'Cualquiera',
    },
  });

  const watchedCodigo = watch('codigo');

  const handleCodigoChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue('codigo', val, { shouldValidate: true });
  };

  const handleAsignarSalaInmediata = (item) => {
    const salaLibre = salas.find((s) => s.estado === 'LIBRE');
    if (!salaLibre) {
      addToast('No hay salas disponibles en este momento para asignar.', 'error');
      return;
    }
    reservarSala(salaLibre.id, {
      codigo_estudiante: item.codigo,
      nombre_estudiante: item.nombre,
      integrantes: item.integrantes,
      duracion: 60,
      origen: 'LISTA_ESPERA_AUTO',
      notas: 'Asignación automática desde cola de espera tras liberación de sala',
    });
    addToast(`¡Espacio asignado con éxito a ${item.nombre} en ${salaLibre.nombre}!`, 'success');
  };

  const onSubmit = (data) => {
    addToast(`Estudiante ${data.nombre.trim()} agregado a la tabla lista_espera con prioridad #${listaEspera.length + 1}`, 'success');
    reset();
  };

  return (
    <div className="page-view">
      {/* Header */}
      <div className="view-header">
        <div className="view-title-wrap">
          <h1>Lista de Espera y Asignación Automática</h1>
          <p>Gestión de la tabla <code>lista_espera</code> con algoritmo de asignación prioritaria por tiempo y aforo</p>
        </div>
      </div>

      {/* Grid Principal */}
      <div className="dashboard-layout" style={{ gridTemplateColumns: '1fr 380px' }}>
        {/* Tabla de Fila de Espera */}
        <div className="panel-card" style={{ padding: '0', overflow: 'hidden' }}>
          <table className="audit-table">
            <thead>
              <tr>
                <th>PRIORIDAD</th>
                <th>ESTUDIANTE (UTP)</th>
                <th>SALA PREFERIDA</th>
                <th>INTEGRANTES</th>
                <th>TIEMPO EN COLA</th>
                <th>ACCIÓN</th>
              </tr>
            </thead>
            <tbody>
              {listaEspera.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div className="waitlist-avatar" style={{ margin: '0 auto' }}>
                      #{item.prioridad}
                    </div>
                  </td>
                  <td>
                    <strong style={{ display: 'block', color: '#0f172a' }}>{item.nombre}</strong>
                    <span style={{ fontSize: '12px', color: '#64748b' }}>{item.codigo}</span>
                  </td>
                  <td>
                    <span className="waitlist-room-pill">{item.sala_deseada}</span>
                  </td>
                  <td>
                    <span style={{ fontWeight: 600, color: '#334155' }}>{item.integrantes} personas</span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#b45309', fontWeight: 600, fontSize: '12px' }}>
                      <Clock size={14} />
                      <span>{item.tiempo_espera_min} min</span>
                    </div>
                  </td>
                  <td>
                    <button
                      className="btn-utp-primary"
                      style={{ fontSize: '11px', padding: '6px 12px' }}
                      onClick={() => handleAsignarSalaInmediata(item)}
                    >
                      Asignar Ahora
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Panel Lateral: Formulario de Ingreso a Fila de Espera */}
        <div className="panel-card" style={{ height: 'fit-content' }}>
          <div className="panel-header">
            <h3>
              <UserPlus size={16} color="#c8102e" /> Registro en Lista de Espera
            </h3>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
          >
            <div className="form-group">
              <label className="form-label">Código Institucional (UTP) *</label>
              <input
                type="text"
                className={`form-input ${errors.codigo ? 'input-error' : ''}`}
                placeholder="Ej: U20211045"
                maxLength={9}
                value={watchedCodigo}
                onChange={handleCodigoChange}
              />
              {errors.codigo ? (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.codigo.message}
                </span>
              ) : (
                <span className="form-helper-text">Formato: U + 8 dígitos numéricos</span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Nombre Completo del Alumno *</label>
              <input
                type="text"
                className={`form-input ${errors.nombre ? 'input-error' : ''}`}
                placeholder="Ej: Milton Aldair"
                {...register('nombre')}
              />
              {errors.nombre && (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.nombre.message}
                </span>
              )}
            </div>

            <div className="form-group">
              <label className="form-label">Tipo de Sala Preferido (FK: tipo_sala_id)</label>
              <select className="form-select" {...register('tipo_sala')}>
                <option value="SALA_GRUPAL">Sala de Estudio Grupal (Pizarra + PC)</option>
                <option value="SALA_SILENCIOSA">Sala Silenciosa / Individual</option>
                <option value="SALA_PROYECTOS">Sala de Proyectos Colaborativos</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Cantidad de Integrantes Requerida</label>
              <select className="form-select" {...register('integrantes')}>
                <option value={2}>2 Alumnos</option>
                <option value={3}>3 Alumnos</option>
                <option value={4}>4 Alumnos</option>
                <option value={5}>5 Alumnos</option>
                <option value={6}>6 Alumnos</option>
              </select>
            </div>

            <button
              type="submit"
              className="btn-utp-primary"
              disabled={!isValid || isSubmitting}
              style={{ marginTop: '8px', justifyContent: 'center' }}
            >
              <UserPlus size={15} />
              <span>Ingresar a Cola de Espera</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
