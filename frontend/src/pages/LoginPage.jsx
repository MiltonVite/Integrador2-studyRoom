import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  GraduationCap,
  Lock,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  Camera,
  CheckCircle2,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { loginSchema } from '../schemas/usuarioSchema';

export const LoginPage = ({ onLoginSuccess }) => {
  const { login } = useApp();
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: 'onSubmit',
    defaultValues: {
      identificador: 'U20211045',
      contrasena: 'password123',
      recordarme: true,
    },
  });

  const onSubmit = (data) => {
    login(data);
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  const handleQuickLogin = (codigo, rol) => {
    setValue('identificador', codigo);
    setValue('contrasena', 'password123');
    login({ identificador: codigo, contrasena: 'password123' });
    if (onLoginSuccess) {
      onLoginSuccess();
    }
  };

  return (
    <div className="login-wrapper">
      {/* Columna Izquierda: Banner Institucional & Características IA */}
      <div className="login-brand-panel">
        <div className="login-brand-header">
          <div className="login-logo-pill">
            <GraduationCap size={28} color="#ffffff" />
          </div>
          <div>
            <h2>UTP Campus Piura</h2>
            <span>Sistema Integrado de Salas de Estudio</span>
          </div>
        </div>

        <div className="login-hero-content">
          <span className="login-badge-ai">
            <Sparkles size={14} /> Visión Artificial en Tiempo Real
          </span>
          <h1>
            Gestión Inteligente y Automatizada de Espacios Universitarios
          </h1>
          <p>
            Plataforma centralizada con monitoreo inteligente de aforo, protocolo de liberación inmediata de salas desocupadas y asignación automatizada de listas de espera.
          </p>

          <div className="login-feature-list">
            <div className="login-feature-item">
              <div className="feature-icon-box">
                <Camera size={18} />
              </div>
              <div>
                <strong>Monitoreo Continuo con Cámaras IA</strong>
                <p>Detección de personas, mochilas y alertas de convivencia en salas.</p>
              </div>
            </div>

            <div className="login-feature-item">
              <div className="feature-icon-box">
                <ShieldCheck size={18} />
              </div>
              <div>
                <strong>Protocolo Sala Libre</strong>
                <p>Liberación automática tras abandono temprano y reasignación en cola.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="login-brand-footer">
          <span>Universidad Tecnológica del Perú • Proyecto Integrador 2 • 2026</span>
        </div>
      </div>

      {/* Columna Derecha: Tarjeta de Autenticación */}
      <div className="login-form-container">
        <div className="login-form-card">
          <div className="login-card-header">
            <h3>Acceso al Sistema</h3>
            <p>Portal Administrativo y Operativo • Personal UTP</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} noValidate>
            {/* Campo: Código o Correo Institucional */}
            <div className="form-group" style={{ marginBottom: '16px' }}>
              <label className="form-label">
                Código Institucional o Correo UTP <span style={{ color: '#c8102e' }}>*</span>
              </label>
              <div className="login-input-wrap">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className={`form-input login-input ${errors.identificador ? 'input-error' : ''}`}
                  placeholder="Ej: U20211045 o alumno@utp.edu.pe"
                  {...register('identificador')}
                />
              </div>
              {errors.identificador && (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.identificador.message}
                </span>
              )}
            </div>

            {/* Campo: Contraseña */}
            <div className="form-group" style={{ marginBottom: '18px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <label className="form-label" style={{ marginBottom: 0 }}>
                  Contraseña <span style={{ color: '#c8102e' }}>*</span>
                </label>
                <a
                  href="#recuperar"
                  onClick={(e) => {
                    e.preventDefault();
                    alert('Por favor contacta al administrador de TI del campus.');
                  }}
                  style={{ fontSize: '11.5px', color: '#c8102e', fontWeight: 600, textDecoration: 'none' }}
                >
                  ¿Olvidaste tu clave?
                </a>
              </div>
              <div className="login-input-wrap">
                <Lock size={18} className="input-icon" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className={`form-input login-input ${errors.contrasena ? 'input-error' : ''}`}
                  placeholder="••••••••••••"
                  {...register('contrasena')}
                />
                <button
                  type="button"
                  className="password-toggle-btn"
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
              {errors.contrasena && (
                <span className="form-error-text">
                  <AlertCircle size={13} /> {errors.contrasena.message}
                </span>
              )}
            </div>

            {/* Recordar Sesión */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '22px' }}>
              <input
                type="checkbox"
                id="recordarme"
                style={{ accentColor: '#c8102e', width: '16px', height: '16px', cursor: 'pointer' }}
                {...register('recordarme')}
              />
              <label htmlFor="recordarme" style={{ fontSize: '12.5px', color: '#475569', cursor: 'pointer', userSelect: 'none' }}>
                Mantener mi sesión activa en este equipo
              </label>
            </div>

            {/* Botón Principal de Envío */}
            <button
              type="submit"
              className="btn-utp-primary"
              style={{
                width: '100%',
                height: '46px',
                fontSize: '14px',
                justifyContent: 'center',
                boxShadow: '0 4px 14px rgba(200, 16, 46, 0.3)',
              }}
              disabled={isSubmitting}
            >
              <span>Acceder al Sistema</span>
              <ArrowRight size={17} />
            </button>
          </form>

          {/* Separador de Accesos Rápidos */}
          <div className="login-divider">
            <span>o ingresa como perfil de prueba</span>
          </div>

          <div className="quick-access-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <button
              type="button"
              className="quick-access-btn"
              onClick={() => handleQuickLogin('U20211045', 'ADMINISTRADOR')}
            >
              <strong>Milton Vite</strong>
              <span>Administrador</span>
            </button>
            <button
              type="button"
              className="quick-access-btn"
              onClick={() => handleQuickLogin('U20184421', 'OPERADOR')}
            >
              <strong>Carlos Mendoza</strong>
              <span>Operador TI</span>
            </button>
            <button
              type="button"
              className="quick-access-btn"
              onClick={() => handleQuickLogin('U20179921', 'SUPERVISOR')}
            >
              <strong>Patricia Flores</strong>
              <span>Supervisora</span>
            </button>
          </div>

          <div className="login-security-badge">
            <ShieldCheck size={14} color="#059669" />
            <span>Acceso Seguro con Credenciales Institucionales UTP</span>
          </div>
        </div>
      </div>
    </div>
  );
};
