import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, UserPlus, Shield, Mail, Phone, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { usuarioFormSchema } from '../schemas/usuarioSchema';

export const ModalNuevoUsuario = ({ isOpen, onClose, usuarioAEditar }) => {
  const { crearUsuario, actualizarUsuario } = useApp();

  const isEditing = Boolean(usuarioAEditar);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm({
    resolver: zodResolver(usuarioFormSchema),
    mode: 'onChange',
    defaultValues: {
      codigo_institucional: 'U20241001',
      nombre_completo: '',
      correo: 'u20241001@utp.edu.pe',
      rol: 'OPERADOR',
      departamento: 'Soporte y Monitoreo de Salas',
      telefono: '999888777',
      estado: 'ACTIVO',
    },
  });

  useEffect(() => {
    if (usuarioAEditar) {
      reset({
        codigo_institucional: usuarioAEditar.codigo_institucional,
        nombre_completo: usuarioAEditar.nombre_completo,
        correo: usuarioAEditar.correo,
        rol: usuarioAEditar.rol,
        departamento: usuarioAEditar.departamento,
        telefono: usuarioAEditar.telefono || '',
        estado: usuarioAEditar.estado,
      });
    } else {
      reset({
        codigo_institucional: 'U20241001',
        nombre_completo: '',
        correo: 'u20241001@utp.edu.pe',
        rol: 'OPERADOR',
        departamento: 'Soporte y Monitoreo de Salas',
        telefono: '999888777',
        estado: 'ACTIVO',
      });
    }
  }, [usuarioAEditar, reset]);

  const watchedCodigo = watch('codigo_institucional');

  const handleCodigoChange = (e) => {
    const val = e.target.value.toUpperCase();
    setValue('codigo_institucional', val, { shouldValidate: true });
    if (val) {
      setValue('correo', `${val.toLowerCase().trim()}@utp.edu.pe`, { shouldValidate: true });
    }
  };

  const onSubmit = (data) => {
    if (isEditing) {
      actualizarUsuario(usuarioAEditar.id, data);
    } else {
      crearUsuario(data);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" style={{ maxWidth: '580px' }} onClick={(e) => e.stopPropagation()}>
        {/* Cabecera */}
        <div className="modal-header">
          <div>
            <h2>{isEditing ? 'Editar Personal del Sistema' : '+ Registrar Personal / Operador'}</h2>
            <span style={{ fontSize: '11.5px', color: '#64748b' }}>
              Gestión de cuentas institucionales en tablas <code>usuarios</code> y <code>roles</code>
            </span>
          </div>
          <button className="btn-icon-action" onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="modal-body" style={{ maxHeight: '72vh', overflowY: 'auto' }}>
            
            {/* 1. Código y Rol */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">
                  Código Institucional (UTP) <span style={{ color: '#c8102e' }}>*</span>
                </label>
                <input
                  type="text"
                  className={`form-input ${errors.codigo_institucional ? 'input-error' : ''}`}
                  placeholder="Ej: U20211045"
                  maxLength={9}
                  value={watchedCodigo}
                  onChange={handleCodigoChange}
                />
                {errors.codigo_institucional ? (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.codigo_institucional.message}
                  </span>
                ) : (
                  <span className="form-helper-text">Formato: U + 8 dígitos</span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">
                  Rol Institucional <span style={{ color: '#c8102e' }}>*</span>
                </label>
                <select className="form-select" {...register('rol')}>
                  <option value="ADMINISTRADOR">Administrador de Campus</option>
                  <option value="OPERADOR">Operador de Salas / TI</option>
                  <option value="SUPERVISOR">Supervisor de Campus</option>
                  <option value="RECEPCION_BIBLIOTECA">Recepción / Biblioteca</option>
                </select>
              </div>
            </div>

            {/* 2. Nombre Completo */}
            <div className="form-group">
              <label className="form-label">
                Nombre Completo del Personal <span style={{ color: '#c8102e' }}>*</span>
              </label>
              <input
                type="text"
                className={`form-input ${errors.nombre_completo ? 'input-error' : ''}`}
                placeholder="Ej: Milton Vite Aldair"
                {...register('nombre_completo')}
              />
              {errors.nombre_completo && (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.nombre_completo.message}
                </span>
              )}
            </div>

            {/* 3. Correo y Teléfono */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Correo Institucional UTP</label>
                <input
                  type="email"
                  className={`form-input ${errors.correo ? 'input-error' : ''}`}
                  placeholder="ejemplo@utp.edu.pe"
                  {...register('correo')}
                />
                {errors.correo && (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.correo.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Teléfono Móvil (Opcional)</label>
                <input
                  type="text"
                  className={`form-input ${errors.telefono ? 'input-error' : ''}`}
                  placeholder="Ej: 987654321"
                  maxLength={9}
                  {...register('telefono')}
                />
                {errors.telefono && (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.telefono.message}
                  </span>
                )}
              </div>
            </div>

            {/* 4. Departamento y Estado */}
            <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '12px' }}>
              <div className="form-group">
                <label className="form-label">Área o Departamento</label>
                <input
                  type="text"
                  className={`form-input ${errors.departamento ? 'input-error' : ''}`}
                  placeholder="Ej: Soporte TI / Biblioteca"
                  {...register('departamento')}
                />
                {errors.departamento && (
                  <span className="form-error-text">
                    <AlertCircle size={13} /> {errors.departamento.message}
                  </span>
                )}
              </div>

              <div className="form-group">
                <label className="form-label">Estado de la Cuenta</label>
                <select className="form-select" {...register('estado')}>
                  <option value="ACTIVO">Activo</option>
                  <option value="INACTIVO">Inactivo</option>
                  <option value="SUSPENDIDO">Suspendido</option>
                </select>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button type="button" className="severity-filter-btn" onClick={onClose}>
              Cancelar
            </button>
            <button
              type="submit"
              className="btn-utp-primary"
              disabled={!isValid || isSubmitting}
            >
              {isEditing ? 'Guardar Cambios' : 'Registrar Personal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
