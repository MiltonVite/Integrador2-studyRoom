-- =============================================================================
-- SISTEMA INTELIGENTE DE GESTIÓN DE SALAS DE ESTUDIO
-- Esquema DDL Normalizado (3FN) con Borrado Lógico (Soft Delete) - PostgreSQL 16+
-- =============================================================================

-- Extensiones útiles
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Limpieza preventiva en orden inverso de dependencias (solo para scripts de inicialización)
DROP TABLE IF EXISTS configuraciones_sistema CASCADE;
DROP TABLE IF EXISTS logs_sincronizacion_externa CASCADE;
DROP TABLE IF EXISTS alertas CASCADE;
DROP TABLE IF EXISTS estados_alerta CASCADE;
DROP TABLE IF EXISTS tipos_alerta CASCADE;
DROP TABLE IF EXISTS registros_ocupacion CASCADE;
DROP TABLE IF EXISTS camaras CASCADE;
DROP TABLE IF EXISTS lista_espera CASCADE;
DROP TABLE IF EXISTS estados_lista_espera CASCADE;
DROP TABLE IF EXISTS reserva_integrantes CASCADE;
DROP TABLE IF EXISTS reservas CASCADE;
DROP TABLE IF EXISTS origenes_reserva CASCADE;
DROP TABLE IF EXISTS estados_reserva CASCADE;
DROP TABLE IF EXISTS salas CASCADE;
DROP TABLE IF EXISTS estados_sala CASCADE;
DROP TABLE IF EXISTS tipos_sala CASCADE;
DROP TABLE IF EXISTS pabellones CASCADE;
DROP TABLE IF EXISTS usuarios CASCADE;
DROP TABLE IF EXISTS roles CASCADE;

-- =============================================================================
-- 1. MÓDULO: SEGURIDAD Y USUARIOS
-- =============================================================================

-- 1.1 Catálogo de Roles
CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,       -- Ej: 'ADMINISTRADOR', 'ESTUDIANTE', 'SEGURIDAD', 'SUPERVISOR'
    descripcion VARCHAR(255),
    esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 1.2 Usuarios del Sistema Institucional
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY,
    codigo_institucional VARCHAR(50) UNIQUE NOT NULL, -- Código de estudiante o docente (ej: U20211045)
    nombre_completo VARCHAR(150) NOT NULL,
    correo VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    rol_id INT NOT NULL REFERENCES roles(id) ON DELETE RESTRICT,
    telefono VARCHAR(25),
    esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL -- Borrado lógico: NULL = activo, con fecha = dado de baja
);

CREATE INDEX idx_usuarios_codigo_institucional ON usuarios(codigo_institucional);
CREATE INDEX idx_usuarios_rol_id ON usuarios(rol_id);
CREATE INDEX idx_usuarios_eliminado_en ON usuarios(eliminado_en) WHERE eliminado_en IS NULL;

-- =============================================================================
-- 2. MÓDULO: INFRAESTRUCTURA UNIVERSITARIA Y SALAS
-- =============================================================================

-- 2.1 Pabellones / Edificios
CREATE TABLE pabellones (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(100) UNIQUE NOT NULL,     -- Ej: "Pabellón A", "Pabellón B"
    codigo VARCHAR(20) UNIQUE NOT NULL,      -- Ej: "PAB-A", "BIB-CEN"
    ubicacion VARCHAR(255),                  -- Ej: "Campus Piura"
    esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 2.2 Tipos de Sala
CREATE TABLE tipos_sala (
    id SERIAL PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,      -- Ej: 'SALA_GRUPAL', 'SALA_SILENCIOSA', 'SALA_PROYECTOS'
    descripcion VARCHAR(255),
    esta_activo BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

-- 2.3 Estados de Sala
CREATE TABLE estados_sala (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- 'DISPONIBLE', 'RESERVADA', 'OCUPADA', 'MANTENIMIENTO', 'LIMPIEZA'
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- 2.4 Salas Físicas (Con Aforo Mínimo y Máximo)
CREATE TABLE salas (
    id SERIAL PRIMARY KEY,
    pabellon_id INT NOT NULL REFERENCES pabellones(id) ON DELETE RESTRICT,
    tipo_sala_id INT NOT NULL REFERENCES tipos_sala(id) ON DELETE RESTRICT,
    estado_id INT NOT NULL REFERENCES estados_sala(id) ON DELETE RESTRICT,
    nombre VARCHAR(100) NOT NULL,            -- Ej: "Sala de Estudio Grupal 101"
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- Ej: "SALA-A101"
    piso INT NOT NULL DEFAULT 1 CHECK (piso >= 0),
    capacidad_minima INT NOT NULL DEFAULT 1 CHECK (capacidad_minima > 0),
    capacidad_maxima INT NOT NULL CHECK (capacidad_maxima >= capacidad_minima),
    esta_activa BOOLEAN NOT NULL DEFAULT TRUE,
    descripcion TEXT,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL -- Borrado lógico
);

CREATE INDEX idx_salas_pabellon_id ON salas(pabellon_id);
CREATE INDEX idx_salas_estado_id ON salas(estado_id);
CREATE INDEX idx_salas_codigo ON salas(codigo);
CREATE INDEX idx_salas_eliminado_en ON salas(eliminado_en) WHERE eliminado_en IS NULL;

-- 2.5 Cámaras de Monitoreo (Visión Artificial)
CREATE TABLE camaras (
    id SERIAL PRIMARY KEY,
    sala_id INT UNIQUE NOT NULL REFERENCES salas(id) ON DELETE RESTRICT,
    codigo_camara VARCHAR(50) UNIQUE NOT NULL, -- Ej: "CAM-A101"
    ip_camara VARCHAR(45),
    url_stream VARCHAR(255) NOT NULL,          -- URL RTSP / WebRTC
    resolucion VARCHAR(20) DEFAULT '1920x1080',
    fps INT DEFAULT 30,
    esta_activa BOOLEAN NOT NULL DEFAULT TRUE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_camaras_sala_id ON camaras(sala_id);

-- =============================================================================
-- 3. MÓDULO: RESERVAS Y LISTA DE ESPERA
-- =============================================================================

-- 3.1 Estados de Reserva
CREATE TABLE estados_reserva (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- 'CONFIRMADA', 'EN_USO', 'COMPLETADA', 'CANCELADA', 'LIBERADA_AUTOMATICA', 'NO_ASISTIO'
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- 3.2 Orígenes de Reserva
CREATE TABLE origenes_reserva (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- 'APP_UNIVERSIDAD', 'MANUAL', 'LISTA_ESPERA_AUTO'
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- 3.3 Reservas de Salas
CREATE TABLE reservas (
    id SERIAL PRIMARY KEY,
    id_reserva_externa VARCHAR(100) UNIQUE,  -- ID recibido desde la app externa de la universidad
    sala_id INT NOT NULL REFERENCES salas(id) ON DELETE RESTRICT,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT, -- Titular de la reserva
    estado_id INT NOT NULL REFERENCES estados_reserva(id) ON DELETE RESTRICT,
    origen_id INT NOT NULL REFERENCES origenes_reserva(id) ON DELETE RESTRICT,
    cantidad_integrantes INT NOT NULL DEFAULT 1 CHECK (cantidad_integrantes > 0), -- Cantidad declarada de personas
    hora_inicio TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_fin TIMESTAMP WITH TIME ZONE NOT NULL,
    hora_entrada TIMESTAMP WITH TIME ZONE,
    hora_salida TIMESTAMP WITH TIME ZONE,
    motivo_liberacion VARCHAR(150),          -- Ej: 'ABANDONO_TIEMPO_EXCEDIDO', 'NO_ASISTENCIA', 'SALIDA_MANUAL'
    notas TEXT,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL, -- Borrado lógico para auditoría
    CONSTRAINT chk_horas_reserva CHECK (hora_fin > hora_inicio)
);

CREATE INDEX idx_reservas_sala_horas ON reservas(sala_id, hora_inicio, hora_fin);
CREATE INDEX idx_reservas_estado_id ON reservas(estado_id);
CREATE INDEX idx_reservas_id_externa ON reservas(id_reserva_externa);
CREATE INDEX idx_reservas_usuario_id ON reservas(usuario_id);
CREATE INDEX idx_reservas_eliminado_en ON reservas(eliminado_en) WHERE eliminado_en IS NULL;

-- 3.4 Integrantes Acompañantes de la Reserva
CREATE TABLE reserva_integrantes (
    id SERIAL PRIMARY KEY,
    reserva_id INT NOT NULL REFERENCES reservas(id) ON DELETE RESTRICT,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    asistio BOOLEAN DEFAULT FALSE,
    agregado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL,
    CONSTRAINT uq_reserva_integrante UNIQUE (reserva_id, usuario_id)
);

CREATE INDEX idx_reserva_integrantes_reserva_id ON reserva_integrantes(reserva_id);

-- 3.5 Estados de Lista de Espera
CREATE TABLE estados_lista_espera (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- 'EN_ESPERA', 'NOTIFICADO', 'ASIGNADO', 'EXPIRADO', 'CANCELADO'
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- 3.6 Lista de Espera Inteligente
CREATE TABLE lista_espera (
    id SERIAL PRIMARY KEY,
    usuario_id INT NOT NULL REFERENCES usuarios(id) ON DELETE RESTRICT,
    sala_id INT REFERENCES salas(id) ON DELETE RESTRICT, -- Sala específica o NULL para cualquier sala
    tipo_sala_id INT REFERENCES tipos_sala(id) ON DELETE RESTRICT, -- Tipo preferido
    estado_id INT NOT NULL REFERENCES estados_lista_espera(id) ON DELETE RESTRICT,
    cantidad_integrantes INT NOT NULL DEFAULT 1 CHECK (cantidad_integrantes > 0),
    puntuacion_prioridad INT NOT NULL DEFAULT 0,
    notificado_en TIMESTAMP WITH TIME ZONE,
    oferta_expira_en TIMESTAMP WITH TIME ZONE,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_lista_espera_estado_id ON lista_espera(estado_id, creado_en);
CREATE INDEX idx_lista_espera_usuario_id ON lista_espera(usuario_id);

-- =============================================================================
-- 4. MÓDULO: VISIÓN ARTIFICIAL Y TELEMETRÍA
-- (Tabla histórica e inmutable: los registros de telemetría son de solo lectura)
-- =============================================================================

CREATE TABLE registros_ocupacion (
    id BIGSERIAL PRIMARY KEY,
    sala_id INT NOT NULL REFERENCES salas(id) ON DELETE RESTRICT,
    camara_id INT REFERENCES camaras(id) ON DELETE SET NULL,
    ocupantes_detectados INT NOT NULL DEFAULT 0 CHECK (ocupantes_detectados >= 0),
    comida_detectada BOOLEAN NOT NULL DEFAULT FALSE,
    nivel_confianza NUMERIC(5, 4),           -- Confianza del modelo de IA (ej: 0.9520)
    detalle_detecciones JSONB DEFAULT '[]'::jsonb, -- Array con bounding boxes, etiquetas y coordenadas
    url_captura VARCHAR(255),                -- Frame/foto de evidencia
    registrado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_registros_ocupacion_sala_fecha ON registros_ocupacion(sala_id, registrado_en DESC);
CREATE INDEX idx_registros_ocupacion_comida ON registros_ocupacion(comida_detectada) WHERE comida_detectada = TRUE;

-- =============================================================================
-- 5. MÓDULO: ALERTAS E INCIDENCIAS DE CONVIVENCIA
-- =============================================================================

-- 5.1 Catálogo de Tipos de Alerta
CREATE TABLE tipos_alerta (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(50) UNIQUE NOT NULL,      -- 'COMIDA_PROHIBIDA', 'SOBREPOBLACION', 'SALA_ABANDONADA', 'NO_PRESENTACION'
    nombre VARCHAR(100) NOT NULL,
    severidad_defecto VARCHAR(20) NOT NULL DEFAULT 'MEDIA' CHECK (severidad_defecto IN ('INFO', 'BAJA', 'MEDIA', 'ALTA', 'CRITICA')),
    descripcion VARCHAR(255)
);

-- 5.2 Estados de Alerta
CREATE TABLE estados_alerta (
    id SERIAL PRIMARY KEY,
    codigo VARCHAR(30) UNIQUE NOT NULL,      -- 'PENDIENTE', 'NOTIFICADA', 'RESUELTA', 'DESCARTADA'
    nombre VARCHAR(50) NOT NULL,
    descripcion VARCHAR(255)
);

-- 5.3 Alertas Generadas
CREATE TABLE alertas (
    id SERIAL PRIMARY KEY,
    sala_id INT NOT NULL REFERENCES salas(id) ON DELETE RESTRICT,
    tipo_alerta_id INT NOT NULL REFERENCES tipos_alerta(id) ON DELETE RESTRICT,
    estado_id INT NOT NULL REFERENCES estados_alerta(id) ON DELETE RESTRICT,
    reserva_id INT REFERENCES reservas(id) ON DELETE SET NULL,
    atendido_por_usuario_id INT REFERENCES usuarios(id) ON DELETE RESTRICT, -- Personal que atendió la alerta
    descripcion TEXT NOT NULL,
    url_imagen_evidencia VARCHAR(255),
    metadatos JSONB DEFAULT '{}'::jsonb,
    creado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
    resuelto_en TIMESTAMP WITH TIME ZONE,
    eliminado_en TIMESTAMP WITH TIME ZONE DEFAULT NULL
);

CREATE INDEX idx_alertas_sala_estado ON alertas(sala_id, estado_id);
CREATE INDEX idx_alertas_creado_en ON alertas(creado_en DESC);

-- =============================================================================
-- 6. MÓDULO: INTEGRACIÓN EXTERNA Y CONFIGURACIONES
-- =============================================================================

-- 6.1 Bitácora Inmutable de Sincronización con App Externa Universitaria
CREATE TABLE logs_sincronizacion_externa (
    id BIGSERIAL PRIMARY KEY,
    tipo_evento VARCHAR(60) NOT NULL,          -- 'RESERVA_CREADA', 'RESERVA_CANCELADA', 'RESERVA_MODIFICADA'
    id_reserva_externa VARCHAR(100),
    datos_evento JSONB NOT NULL,               -- Payload completo recibido en JSON
    estado VARCHAR(30) NOT NULL DEFAULT 'PROCESADO'
        CHECK (estado IN ('RECIBIDO', 'PROCESADO', 'FALLIDO', 'IGNORADO')),
    mensaje_error TEXT,
    recibido_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_logs_sincronizacion_id_externa ON logs_sincronizacion_externa(id_reserva_externa);
CREATE INDEX idx_logs_sincronizacion_recibido ON logs_sincronizacion_externa(recibido_en DESC);

-- 6.2 Parámetros Globales y Reglas de Negocio
CREATE TABLE configuraciones_sistema (
    clave VARCHAR(80) PRIMARY KEY,
    valor VARCHAR(255) NOT NULL,
    descripcion TEXT,
    actualizado_en TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- =============================================================================
-- DATOS SEMILLA BASE (CATÁLOGOS, PARÁMETROS Y USUARIO ADMINISTRADOR)
-- =============================================================================

-- 1. Roles del Sistema
INSERT INTO roles (nombre, descripcion) VALUES
('ADMINISTRADOR', 'Acceso total a gestión de salas, usuarios, configuraciones y reportes'),
('SUPERVISOR', 'Monitoreo de salas, revisión de alertas y gestión de incidencias'),
('SEGURIDAD', 'Recepción de alertas de convivencia y presencia de alimentos en tiempo real'),
('ESTUDIANTE', 'Consulta de salas disponibles, ingreso a lista de espera y visualización de reservas');

-- 2. Tipos de Sala
INSERT INTO tipos_sala (nombre, descripcion) VALUES
('SALA_GRUPAL', 'Sala equipada para trabajo en equipo, con pizarra y monitor'),
('SALA_SILENCIOSA', 'Espacio individual diseñado para lectura y concentración'),
('SALA_PROYECTOS', 'Sala con mesas colaborativas y tomas para laptops');

-- 3. Estados de Sala
INSERT INTO estados_sala (codigo, nombre, descripcion) VALUES
('DISPONIBLE', 'Disponible', 'La sala está libre y lista para su uso'),
('RESERVADA', 'Reservada', 'La sala cuenta con una reserva activa próxima a iniciar'),
('OCUPADA', 'Ocupada', 'La sala se encuentra actualmente con estudiantes dentro'),
('MANTENIMIENTO', 'En Mantenimiento', 'La sala no está disponible por reparaciones o mantenimiento'),
('LIMPIEZA', 'En Limpieza', 'La sala está en proceso de limpieza y desinfección'),
('DESHABILITADA', 'Deshabilitada', 'La sala se encuentra fuera de servicio');

-- 4. Estados de Reserva
INSERT INTO estados_reserva (codigo, nombre, descripcion) VALUES
('CONFIRMADA', 'Confirmada', 'Reserva creada y confirmada a la espera de inicio'),
('EN_USO', 'En Uso', 'Reserva activa con ocupantes en la sala'),
('COMPLETADA', 'Completada', 'Reserva finalizada satisfactoriamente'),
('CANCELADA', 'Cancelada', 'Reserva cancelada por el usuario o administrador'),
('LIBERADA_AUTOMATICA', 'Liberada Automáticamente', 'Liberada por el sistema tras detectar sala vacía por abandono'),
('NO_ASISTIO', 'No Asistió', 'Reserva cancelada automáticamente por no presentarse en el tiempo de tolerancia');

-- 5. Orígenes de Reserva
INSERT INTO origenes_reserva (codigo, nombre, descripcion) VALUES
('APP_UNIVERSIDAD', 'App Universitaria', 'Reserva sincronizada desde el sistema externo de la universidad'),
('MANUAL', 'Asignación Manual', 'Reserva generada por un supervisor o administrador'),
('LISTA_ESPERA_AUTO', 'Lista de Espera Automática', 'Reserva asignada automáticamente por el algoritmo de reasignación');

-- 6. Estados de Lista de Espera
INSERT INTO estados_lista_espera (codigo, nombre, descripcion) VALUES
('EN_ESPERA', 'En Espera', 'Estudiante esperando asignación de sala'),
('NOTIFICADO', 'Notificado', 'Se ha liberado un espacio y se le notificó al estudiante'),
('ASIGNADO', 'Asignado', 'El estudiante aceptó y se convirtió en reserva activa'),
('EXPIRADO', 'Expirado', 'El estudiante no respondió dentro del tiempo límite de aceptación'),
('CANCELADO', 'Cancelado', 'El estudiante canceló su solicitud de espera');

-- 7. Tipos de Alerta
INSERT INTO tipos_alerta (codigo, nombre, severidad_defecto, descripcion) VALUES
('COMIDA_PROHIBIDA', 'Detección de Alimentos Prohibidos', 'ALTA', 'Se ha detectado consumo de alimentos o bebidas no permitidas en la sala'),
('SOBREPOBLACION', 'Exceso de Aforo', 'MEDIA', 'El número de personas detectadas supera la capacidad máxima de la sala'),
('SALA_ABANDONADA', 'Sala de Estudio Abandonada', 'MEDIA', 'La sala tiene reserva activa pero permanece vacía por más tiempo del permitido'),
('INGRESO_NO_AUTORIZADO', 'Ocupación sin Reserva', 'ALTA', 'Se detectan personas en una sala sin reserva activa'),
('NO_PRESENTACION', 'No Presentación (No-Show)', 'BAJA', 'El titular no asistió dentro de los minutos de gracia tras el inicio');

-- 8. Estados de Alerta
INSERT INTO estados_alerta (codigo, nombre, descripcion) VALUES
('PENDIENTE', 'Pendiente', 'Alerta recién generada en espera de revisión'),
('NOTIFICADA', 'Notificada', 'Alerta enviada a seguridad o supervisores'),
('RESUELTA', 'Resuelta', 'Incidencia atendida y resuelta'),
('DESCARTADA', 'Descartada', 'Falso positivo descartado por el supervisor');

-- 9. Parámetros del Sistema
INSERT INTO configuraciones_sistema (clave, valor, descripcion) VALUES
('MINUTOS_TOLERANCIA_ABANDONO', '10', 'Tiempo en minutos con sala vacía continua antes de liberarla automáticamente'),
('MINUTOS_GRACIA_NO_ASISTENCIA', '15', 'Tolerancia máxima para presentarse tras la hora de inicio'),
('MINUTOS_RESPUESTA_LISTA_ESPERA', '5', 'Tiempo otorgado al estudiante de la lista de espera para aceptar el espacio'),
('UMBRAL_CONFIANZA_DETECCION_COMIDA', '0.65', 'Confianza mínima del modelo de IA para reportar comida/bebida'),
('INTERVALO_ANALISIS_SEGUNDOS', '10', 'Frecuencia de captura y procesamiento de IA en segundos');

-- 10. Usuario Administrador Inicial (Acceso al Sistema)
-- Contraseña de prueba por defecto: 'admin123' (hash bcrypt)
INSERT INTO usuarios (codigo_institucional, nombre_completo, correo, password_hash, rol_id, telefono) VALUES
('ADM001', 'Administrador General', 'admin@universidad.edu.pe', '$2b$12$K8yXv1WzQvE9kP0tH3y6euZ.mD0zRkI7sVjJ1r1WqLz6.JtF/e4lq', 1, '+51987654321');
