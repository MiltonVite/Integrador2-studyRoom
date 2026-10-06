import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // 0. Estado de Autenticación y Usuario Actual (Inicia en false para mostrar el Login al arrancar)
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [usuarioActual, setUsuarioActual] = useState({
    id: 1,
    codigo_institucional: 'U20211045',
    nombre_completo: 'Milton Vite Aldair',
    correo: 'u20211045@utp.edu.pe',
    rol: 'ADMINISTRADOR',
    campus: 'Campus Piura',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
  });

  // 0.1 Directorio de Personal y Usuarios del Sistema (Tabla `usuarios` + `roles`)
  const [usuarios, setUsuarios] = useState([
    {
      id: 1,
      codigo_institucional: 'U20211045',
      nombre_completo: 'Milton Vite Aldair',
      correo: 'u20211045@utp.edu.pe',
      rol: 'ADMINISTRADOR',
      departamento: 'Dirección de TI & Sistemas Campus Piura',
      telefono: '987654321',
      estado: 'ACTIVO',
      fecha_creacion: '2026-01-15',
    },
    {
      id: 2,
      codigo_institucional: 'U20184421',
      nombre_completo: 'Carlos Mendoza Ramos',
      correo: 'u20184421@utp.edu.pe',
      rol: 'OPERADOR',
      departamento: 'Soporte Técnico y Monitoreo de Cámaras',
      telefono: '934567890',
      estado: 'ACTIVO',
      fecha_creacion: '2026-02-01',
    },
    {
      id: 3,
      codigo_institucional: 'U20179921',
      nombre_completo: 'Patricia Flores Huamán',
      correo: 'u20179921@utp.edu.pe',
      rol: 'SUPERVISOR',
      departamento: 'Coordinación de Biblioteca & Espacios de Estudio',
      telefono: '912345678',
      estado: 'ACTIVO',
      fecha_creacion: '2026-02-15',
    },
    {
      id: 4,
      codigo_institucional: 'U20195512',
      nombre_completo: 'Luis Barrientos Vega',
      correo: 'u20195512@utp.edu.pe',
      rol: 'OPERADOR',
      departamento: 'Operaciones y Logística Campus',
      telefono: '923456789',
      estado: 'ACTIVO',
      fecha_creacion: '2026-03-01',
    },
    {
      id: 5,
      codigo_institucional: 'U20203344',
      nombre_completo: 'Carmen Rivera Peña',
      correo: 'u20203344@utp.edu.pe',
      rol: 'RECEPCION_BIBLIOTECA',
      departamento: 'Módulo de Atención y Préstamo de Ambientes',
      telefono: '945678901',
      estado: 'ACTIVO',
      fecha_creacion: '2026-03-10',
    },
  ]);

  // 1. Estado de Salas de Estudio (Salas 101 a 106 del wireframe UTP)
  const [salas, setSalas] = useState([
    {
      id: 1,
      numero: 1,
      codigo: 'SALA-101',
      nombre: 'Sala 101',
      estado: 'LIBRE', // 'LIBRE', 'OCUPADA', 'PROTOCOLO_LIBERACION'
      capacidad: 6,
      ocupantes_actuales: 0,
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      tiempo_restante_min: 0,
      max_tiempo_horas: 2,
      protocolo_segundos: 0,
      rtsp_status: 'OK/Conectado',
      reserva_actual: null,
    },
    {
      id: 2,
      numero: 2,
      codigo: 'SALA-102',
      nombre: 'Sala 102',
      estado: 'LIBRE',
      capacidad: 6,
      ocupantes_actuales: 0,
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      tiempo_restante_min: 0,
      max_tiempo_horas: 2,
      protocolo_segundos: 0,
      rtsp_status: 'OK/Conectado',
      reserva_actual: null,
    },
    {
      id: 3,
      numero: 3,
      codigo: 'SALA-103',
      nombre: 'Sala 103',
      estado: 'OCUPADA',
      capacidad: 6,
      ocupantes_actuales: 4,
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      tiempo_restante_min: 22,
      max_tiempo_horas: 2,
      protocolo_segundos: 0,
      rtsp_status: 'OK/Conectado',
      reserva_actual: {
        id: 'RES-001',
        estudiante: 'Andrea Ruiz',
        codigo_alumno: 'U20199821',
        integrantes: 4,
        hora_inicio: '09:00',
        hora_fin: '11:00',
        validado_ia: true,
      },
    },
    {
      id: 4,
      numero: 4,
      codigo: 'SALA-104',
      nombre: 'Sala 104',
      estado: 'OCUPADA',
      capacidad: 6,
      ocupantes_actuales: 3,
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      tiempo_restante_min: 42,
      max_tiempo_horas: 2,
      protocolo_segundos: 0,
      rtsp_status: 'OK/Conectado',
      reserva_actual: {
        id: 'RES-002',
        estudiante: 'Jorge Allaga',
        codigo_alumno: 'U18274563',
        integrantes: 3,
        hora_inicio: '12:00',
        hora_fin: '14:00',
        validado_ia: true,
      },
    },
    {
      id: 5,
      numero: 5,
      codigo: 'SALA-105',
      nombre: 'Sala 105',
      estado: 'PROTOCOLO_LIBERACION', // Mostrado en el wireframe con Protocolo Sala Libre
      capacidad: 6,
      ocupantes_actuales: 0, // Alumnos salieron antes
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      tiempo_restante_min: 65,
      max_tiempo_horas: 2,
      protocolo_segundos: 160, // 02:40 min restantes para liberación automática
      rtsp_status: 'OK/Conectado',
      reserva_actual: {
        id: 'RES-003',
        estudiante: 'Marcos Vilchez',
        codigo_alumno: 'U19876543',
        integrantes: 4,
        hora_inicio: '08:00',
        hora_fin: '10:00',
        validado_ia: true,
      },
    },
    {
      id: 6,
      numero: 6,
      codigo: 'SALA-106',
      nombre: 'Sala 106',
      estado: 'LIBRE',
      capacidad: 6,
      equipamiento: { pc: true, pizarra: true, sillas: 6 },
      ocupantes_actuales: 0,
      tiempo_restante_min: 0,
      max_tiempo_horas: 2,
      protocolo_segundos: 0,
      rtsp_status: 'OK/Conectado',
      reserva_actual: null,
    },
  ]);

  // 2. Alertas de Visión Artificial
  const [alertas, setAlertas] = useState([
    {
      id: 1,
      sala_codigo: 'SALA-105',
      sala_nombre: 'Sala 105',
      tipo: 'PROTOCOLO_SALA_LIBRE',
      titulo: 'Detección de Sala Desocupada en Sala 105',
      descripcion: 'Protocolo Sala Libre: Alumnos salieron antes - Liberación automática en curso (0 personas detectadas por cámara IA).',
      severidad: 'CRITICA', // 'BAJA', 'MEDIA', 'ALTA', 'CRITICA'
      hora: '10:30 AM',
      personas_detectadas: 0,
      evidencia_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      estado: 'PENDIENTE',
      tags_ia: ['PC Monitor Detectado', 'Teclado Detectado', 'Mouse Detectado', '0 Personas'],
    },
    {
      id: 2,
      sala_codigo: 'SALA-103',
      sala_nombre: 'Sala 103',
      tipo: 'ALIMENTO_PROHIBIDO',
      titulo: 'Alimento Prohibido Detectado en Sala 103',
      descripcion: 'Visión artificial detectó bebidas y snacks sobre el módulo de estudio grupal.',
      severidad: 'IMPORTANTE',
      hora: '10:25 AM',
      personas_detectadas: 4,
      evidencia_url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
      estado: 'PENDIENTE',
      tags_ia: ['Alimento Detectado (Confianza 94%)', 'Bebida Detectada'],
    },
    {
      id: 3,
      sala_codigo: 'SALA-101',
      sala_nombre: 'Sala 101',
      tipo: 'INTENTO_RESERVA_EXCESO',
      titulo: 'Intento Reserva >2h en Sala 101',
      descripcion: 'Solicitud rechazada por superar el tiempo máximo permitido según normativa de campus.',
      severidad: 'IMPORTANTE',
      hora: '10:15 AM',
      personas_detectadas: 0,
      evidencia_url: 'https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=800&q=80',
      estado: 'RESUELTA',
      tags_ia: ['Módulo Libre'],
    },
  ]);

  // 3. Lista de Espera Inteligente
  const [listaEspera, setListaEspera] = useState([
    {
      id: 1,
      nombre: 'Andrea Ruiz',
      codigo: 'U20199821',
      sala_deseada: 'Sala 104',
      integrantes: 4,
      prioridad: 1,
      estado: 'EN_ESPERA',
      tiempo_espera_min: 12,
    },
    {
      id: 2,
      nombre: 'Jorge Allaga',
      codigo: 'U18274563',
      sala_deseada: 'Sala 102',
      integrantes: 3,
      prioridad: 2,
      estado: 'EN_ESPERA',
      tiempo_espera_min: 8,
    },
    {
      id: 3,
      nombre: 'Valeria Mendoza',
      codigo: 'U21203491',
      sala_deseada: 'Cualquiera',
      integrantes: 2,
      prioridad: 3,
      estado: 'EN_ESPERA',
      tiempo_espera_min: 5,
    },
  ]);

  // 4. Parámetros de Configuración del Sistema
  const [config, setConfig] = useState({
    duracion_min_minutos: 60,
    duracion_max_minutos: 120,
    tolerancia_abandono_minutos: 4,
    detectar_mochilas: true,
    auto_notificar_espera: true,
    umbral_confianza_ia: 0.70,
  });

  // 5. Notificaciones Toast
  const [toasts, setToasts] = useState([]);

  const addToast = (mensaje, tipo = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, mensaje, tipo }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  // Motor de Temporizador en Tiempo Real (Decrementa el tiempo del protocolo de liberación)
  useEffect(() => {
    const interval = setInterval(() => {
      setSalas((prevSalas) =>
        prevSalas.map((sala) => {
          if (sala.estado === 'PROTOCOLO_LIBERACION' && sala.protocolo_segundos > 0) {
            const nuevosSegundos = sala.protocolo_segundos - 1;
            if (nuevosSegundos === 0) {
              // Liberar automáticamente la sala y reasignar a lista de espera
              addToast(`¡Sala ${sala.nombre} liberada automáticamente por Visión Artificial! Espacio asignado a lista de espera.`, 'warning');
              return {
                ...sala,
                estado: 'LIBRE',
                protocolo_segundos: 0,
                tiempo_restante_min: 0,
                reserva_actual: null,
                ocupantes_actuales: 0,
              };
            }
            return { ...sala, protocolo_segundos: nuevosSegundos };
          }
          return sala;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Acciones: Reservar Sala
  const reservarSala = (salaId, datosReserva) => {
    setSalas((prev) =>
      prev.map((s) => {
        if (s.id === salaId) {
          return {
            ...s,
            estado: 'OCUPADA',
            ocupantes_actuales: datosReserva.integrantes || 2,
            tiempo_restante_min: datosReserva.duracion || 60,
            reserva_actual: {
              id: `RES-${Date.now().toString().slice(-4)}`,
              estudiante: datosReserva.nombre_estudiante,
              codigo_alumno: datosReserva.codigo_estudiante,
              integrantes: datosReserva.integrantes || 2,
              hora_inicio: '10:00',
              hora_fin: '11:00',
              validado_ia: true,
            },
          };
        }
        return s;
      })
    );
    addToast(`Reserva confirmada en Sala ${salaId} para ${datosReserva.codigo_estudiante}`, 'success');
  };

  // Acciones: Liberar Sala Manualmente
  const liberarSala = (salaId) => {
    setSalas((prev) =>
      prev.map((s) =>
        s.id === salaId
          ? { ...s, estado: 'LIBRE', protocolo_segundos: 0, tiempo_restante_min: 0, reserva_actual: null, ocupantes_actuales: 0 }
          : s
      )
    );
    addToast(`Sala ${salaId} liberada y disponible inmediatamente.`, 'success');
  };

  // Simulación: Iniciar abandono de sala (Computer Vision detecta 0 personas en sala con reserva)
  const simularAbandonoSala = (salaId) => {
    setSalas((prev) =>
      prev.map((s) =>
        s.id === salaId
          ? { ...s, estado: 'PROTOCOLO_LIBERACION', protocolo_segundos: config.tolerancia_abandono_minutos * 60, ocupantes_actuales: 0 }
          : s
      )
    );
    // Registrar Alerta
    const nuevaAlerta = {
      id: Date.now(),
      sala_codigo: `SALA-${salaId}`,
      sala_nombre: `Sala ${salaId}`,
      tipo: 'PROTOCOLO_SALA_LIBRE',
      titulo: `Detección de Sala Desocupada en Sala ${salaId}`,
      descripcion: `Cámara IA detectó 0 ocupantes con reserva activa. Temporizador de liberación automática iniciado (${config.tolerancia_abandono_minutos} min).`,
      severidad: 'CRITICA',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personas_detectadas: 0,
      evidencia_url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=800&q=80',
      estado: 'PENDIENTE',
      tags_ia: ['PC Monitor Detectado', '0 Personas Detectadas', 'Liberación en curso'],
    };
    setAlertas((prev) => [nuevaAlerta, ...prev]);
    addToast(`[IA Visión] Abandono detectado en Sala ${salaId}. Protocolo activado.`, 'error');
  };

  // Simulación: Alimento Prohibido Detectado
  const simularDeteccionComida = (salaId) => {
    const nuevaAlerta = {
      id: Date.now(),
      sala_codigo: `SALA-${salaId}`,
      sala_nombre: `Sala ${salaId}`,
      tipo: 'ALIMENTO_PROHIBIDO',
      titulo: `Alimento no permitido en Sala ${salaId}`,
      descripcion: `El modelo YOLO de visión artificial detectó comida/bebidas no permitidas en la mesa de estudio.`,
      severidad: 'IMPORTANTE',
      hora: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personas_detectadas: 4,
      evidencia_url: 'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=800&q=80',
      estado: 'PENDIENTE',
      tags_ia: ['Snack / Comida Detectada (92%)', 'Bebida'],
    };
    setAlertas((prev) => [nuevaAlerta, ...prev]);
    addToast(`[IA Visión] Infracción de convivencia: Alimentos detectados en Sala ${salaId}`, 'warning');
  };

  // Simulación: Recibir reserva externa de la app universitaria
  const simularReservaUniversitaria = () => {
    const salaLibre = salas.find((s) => s.estado === 'LIBRE');
    if (!salaLibre) {
      addToast('No hay salas libres disponibles. Estudiante añadido a Lista de Espera.', 'warning');
      setListaEspera((prev) => [
        ...prev,
        {
          id: Date.now(),
          nombre: 'Nuevo Alumno UTP',
          codigo: `U20${Math.floor(100000 + Math.random() * 900000)}`,
          sala_deseada: 'Cualquiera',
          integrantes: 3,
          prioridad: prev.length + 1,
          estado: 'EN_ESPERA',
          tiempo_espera_min: 1,
        },
      ]);
      return;
    }
    reservarSala(salaLibre.id, {
      nombre_estudiante: 'Estudiante App UTP Móvil',
      codigo_estudiante: `U20${Math.floor(100000 + Math.random() * 900000)}`,
      integrantes: 4,
      duracion: 60,
    });
  };

  // Acciones de Autenticación
  const login = (datosLogin) => {
    setIsAuthenticated(true);
    // Si viene código o correo, actualizamos el nombre simulado
    if (datosLogin?.identificador) {
      const idClean = datosLogin.identificador.toUpperCase().trim();
      const userFound = usuarios.find(
        (u) => u.codigo_institucional === idClean || u.correo.toUpperCase() === idClean
      );
      if (userFound) {
        setUsuarioActual(userFound);
      }
    }
    addToast('¡Bienvenido al Sistema de Gestión de Salas de Estudio UTP!', 'success');
  };

  const logout = () => {
    setIsAuthenticated(false);
    addToast('Sesión cerrada correctamente.', 'warning');
  };

  // Acciones de Gestión de Usuarios
  const crearUsuario = (nuevoUser) => {
    const id = Date.now();
    const usuarioCreado = {
      id,
      ...nuevoUser,
      fecha_creacion: new Date().toISOString().split('T')[0],
    };
    setUsuarios((prev) => [usuarioCreado, ...prev]);
    addToast(`Usuario ${nuevoUser.nombre_completo} registrado con éxito.`, 'success');
  };

  const actualizarUsuario = (id, datosActualizados) => {
    setUsuarios((prev) =>
      prev.map((u) => (u.id === id ? { ...u, ...datosActualizados } : u))
    );
    addToast('Datos de usuario actualizados.', 'success');
  };

  const cambiarEstadoUsuario = (id) => {
    setUsuarios((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const nuevoEstado = u.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
          addToast(`Estado de usuario cambiado a ${nuevoEstado}`, 'warning');
          return { ...u, estado: nuevoEstado };
        }
        return u;
      })
    );
  };

  return (
    <AppContext.Provider
      value={{
        isAuthenticated,
        usuarioActual,
        usuarios,
        login,
        logout,
        crearUsuario,
        actualizarUsuario,
        cambiarEstadoUsuario,
        salas,
        alertas,
        listaEspera,
        config,
        setConfig,
        reservarSala,
        liberarSala,
        simularAbandonoSala,
        simularDeteccionComida,
        simularReservaUniversitaria,
        addToast,
        toasts,
      }}
    >
      {children}
      {/* Contenedor de Notificaciones Toast */}
      <div className="toast-container">
        {toasts.map((toast) => (
          <div key={toast.id} className={`toast ${toast.tipo}`}>
            {toast.mensaje}
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
