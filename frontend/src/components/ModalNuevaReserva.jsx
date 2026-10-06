import React, { useEffect, useMemo } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Calendar, Clock, Users, User, FileText, UserPlus, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { crearReservaSchema } from '../schemas/reservaSchema';

export const ModalNuevaReserva = ({ isOpen, onClose, preselectedRoomId }) => {
  const { salas, reservarSala, addToast } = useApp();

  const initialSalaId = preselectedRoomId || salas.find((s) => s.estado === 'LIBRE')?.id || 1;

  // Encontrar sala seleccionada inicialmente
  const defaultSala = salas.find((s) => s.id === Number(initialSalaId)) || salas[0];

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: (values, context, options) => {
      const sala = salas.find((s) => s.id === Number(values.salaId)) || salas[0];
      const schema = crearReservaSchema(sala?.capacidad || 6);
      return zodResolver(schema)(values, context, options);
    },
    mode: 'onChange',
    defaultValues: {
      salaId: initialSalaId,
      codigoEstudiante: 'U20211045',
      nombreEstudiante: 'Milton Vite Aldair',
      correoEstudiante: 'u20211045@utp.edu.pe',
      fechaReserva: new Date().toISOString().split('T')[0],
      horaInicio: '10:00',
      duracionMinutos: 60,
      origenReserva: 'MANUAL',
      notas: 'Estudio grupal - Proyecto de Integrador 2',
      integrantesExtra: [{ codigo: 'U20211046' }, { codigo: 'U20211047' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'integrantesExtra',
  });

  const watchedSalaId = watch('salaId');
  const watchedCodigo = watch('codigoEstudiante');
  const watchedIntegrantes = watch('integrantesExtra') || [];

  const salaSeleccionada = useMemo(() => {
    return salas.find((s) => s.id === Number(watchedSalaId)) || salas[0];
  }, [salas, watchedSalaId]);

  // Actualizar salaId si cambia el preselectedRoomId
  useEffect(() => {
    if (preselectedRoomId) {
      setValue('salaId', preselectedRoomId, { shouldValidate: true });
    }
  }, [preselectedRoomId, setValue]);

  // Sincronizar correo institucional al escribir el código
  const handleCodigoChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue('codigoEstudiante', val, { shouldValidate: true });
    if (val) {
      setValue('correoEstudiante', `${val.toLowerCase().trim()}@utp.edu.pe`, { shouldValidate: true });
    }
  };

  const handleAgregarCompanero = () => {
    const max = salaSeleccionada?.capacidad || 6;
    if (1 + fields.length < max) {
      append({ codigo: '' });
    } else {
      addToast(`La sala tiene capacidad máxima de ${max} personas`, 'warning');
    }
  };

  const onSubmit = (data) => {
    const acompanantesLimpio = (data.integrantesExtra || [])
      .map((i) => i.codigo?.toUpperCase().trim())
      .filter(Boolean);

    reservarSala(Number(data.salaId), {
      codigo_estudiante: data.codigoEstudiante.toUpperCase().trim(),
      nombre_estudiante: data.nombreEstudiante.trim(),
      correo: data.correoEstudiante.toLowerCase().trim(),
      integrantes: 1 + acompanantesLimpio.length,
      duracion: Number(data.duracionMinutos),
      hora_inicio: data.horaInicio,
      fecha: data.fechaReserva,
      origen: data.origenReserva,
      notas: data.notas || '',
      integrantes_secundarios: acompanantesLimpio,
    });

    addToast('¡Reserva registrada con éxito en el sistema!', 'success');
    onClose();
  };

  if (!isOpen) return null;

  const maxCapacidad = salaSeleccionada?.capacidad || 6;
  const totalPersonas = 1 + watchedIntegrantes.filter((i) => i.codigo && i.codigo.trim() !== '').length;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '620px' }} onClick={(e) => e.stopPropagation()}>
        {/* Cabecera del Modal */}
        <div className="modal-header">
          <div>
            <h2>+ Reservar Nueva Sala de Estudio</h2>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
              Validación con React Hook Form & Zod Schema
            </span>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            
            {/* 1. SELECCIÓN DE SALA (FK: sala_id) */}
            <div className="form-group">
              <label className="form-label">
                Seleccionar Sala de Estudio <span style={{ color: '#c8102e' }}>*</span>
              </label>
              <select
                className={`form-select ${errors.salaId ? 'input-error' : ''}`}
                {...register('salaId')}
              >
                {salas.map((s) => (
                  <option key={s.id} value={s.id} disabled={s.estado !== 'LIBRE'}>
                    {s.nombre} ({s.codigo}) • Capacidad: {s.capacidad} prs. {s.estado !== 'LIBRE' ? `[Ocupada - ${s.estado}]` : '[Disponible]'}
                  </option>
                ))}
              </select>
              {errors.salaId && (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.salaId.message}
                </span>
              )}
            </div>

            {/* 2. DATOS DEL TITULAR (FK: usuario_id -> codigo_institucional, nombre, correo) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  Código Alumno (UTP) <span style={{ color: '#c8102e' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.codigoEstudiante ? 'input-error' : ''}`}
                  placeholder="Ej: U20211045"
                  maxLength={9}
                  value={watchedCodigo}
                  onChange={handleCodigoChange}
                />
                {errors.codigoEstudiante ? (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.codigoEstudiante.message}
                  </span>
                ) : (
                  <span className="form-helper-text">Formato: U + 8 dígitos numéricos</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Nombre Completo del Titular <span style={{ color: '#c8102e' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.nombreEstudiante ? 'input-error' : ''}`}
                  placeholder="Ej: Milton Vite Aldair"
                  {...register('nombreEstudiante')}
                />
                {errors.nombreEstudiante && (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.nombreEstudiante.message}
                  </span>
                )}
              </div>
            </div>

            {/* 3. PARÁMETROS HORARIOS (hora_inicio, hora_fin / duracion_minutos) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Fecha de Reserva <span style={{ color: '#c8102e' }}>*</span></label>
                <input
                  type="date"
                  className={`form-input ${errors.fechaReserva ? 'input-error' : ''}`}
                  min={new Date().toISOString().split('T')[0]}
                  {...register('fechaReserva')}
                />
                {errors.fechaReserva && (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.fechaReserva.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Hora Inicio <span style={{ color: '#c8102e' }}>*</span></label>
                <input
                  type="time"
                  className={`form-input ${errors.horaInicio ? 'input-error' : ''}`}
                  {...register('horaInicio')}
                />
                {errors.horaInicio ? (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.horaInicio.message}
                  </span>
                ) : (
                  <span className="form-helper-text">07:00 AM - 10:00 PM</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Duración (Máx 2h)</label>
                <select className="form-select" {...register('duracionMinutos')}>
                  <option value={30}>30 min</option>
                  <option value={60}>1 Hora (60 min)</option>
                  <option value={90}>1h 30m (90 min)</option>
                  <option value={120}>2 Horas (120 min)</option>
                </select>
              </div>
            </div>

            {/* 4. AFORO E INTEGRANTES (cantidad_integrantes y tabla reserva_integrantes) */}
            <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div>
                  <label className="form-label" style={{ marginBottom: 0 }}>
                    Compañeros de Estudio ({totalPersonas} de máx. {maxCapacidad} personas)
                  </label>
                  {errors.integrantesExtra?.message && (
                    <span className="form-error-text" style={{ marginTop: '2px' }}>
                      <AlertCircle size={12} /> {errors.integrantesExtra.message}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAgregarCompanero}
                  disabled={1 + fields.length >= maxCapacidad}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                    fontSize: '11.5px',
                    fontWeight: 700,
                    color: 1 + fields.length >= maxCapacidad ? '#94a3b8' : '#c8102e',
                    background: 'none',
                    border: 'none',
                    cursor: 1 + fields.length >= maxCapacidad ? 'not-allowed' : 'pointer',
                  }}
                >
                  <UserPlus size={14} /> + Agregar Compañero
                </button>
              </div>

              {/* Lista de Acompañantes para la tabla reserva_integrantes */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {fields.map((field, index) => {
                  const errorCampo = errors.integrantesExtra?.[index]?.codigo;
                  return (
                    <div key={field.id} style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className={`form-input ${errorCampo ? 'input-error' : ''}`}
                          placeholder={`Código de Integrante #${index + 2} (ej: U20211046)`}
                          maxLength={9}
                          style={{ flex: 1, height: '36px', fontSize: '12.5px' }}
                          {...register(`integrantesExtra.${index}.codigo`)}
                        />
                        <button
                          type="button"
                          onClick={() => remove(index)}
                          style={{
                            width: '36px',
                            height: '36px',
                            border: '1px solid #fee2e2',
                            backgroundColor: '#fff1f2',
                            color: '#e11d48',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                          }}
                          title="Eliminar acompañante"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      {errorCampo && (
                        <span className="form-error-text" style={{ fontSize: '10.5px' }}>
                          <AlertCircle size={12} /> {errorCampo.message}
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* 5. ORIGEN Y NOTAS (origen_id y notas) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 2fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Origen de la Reserva</label>
                <select className="form-select" {...register('origenReserva')}>
                  <option value="MANUAL">Asignación Manual</option>
                  <option value="APP_UNIVERSIDAD">App UTP Móvil (Simulada)</option>
                  <option value="LISTA_ESPERA_AUTO">Lista de Espera Auto</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Notas / Finalidad de Estudio</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="Ej: Trabajo final, sustentación, etc."
                  {...register('notas')}
                />
              </div>
            </div>

          </div>

          {/* Footer del Modal */}
          <div className="modal-footer">
            <button type="button" className="severity-filter-btn" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-utp-primary"
              disabled={!isValid || isSubmitting}
            >
              Confirmar y Registrar Reserva
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
