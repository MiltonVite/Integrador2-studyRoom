# Base de Datos - Sistema Inteligente de Gestión de Salas de Estudio

Este módulo contiene el diseño relacional completamente normalizado en **Tercera Forma Normal (3FN)** con política de **Borrado Lógico (Soft Delete)** y los scripts de inicialización en **PostgreSQL 16** para el proyecto universitario.

---

## Política de No Eliminación Física (Soft Delete & Auditoría)

Para cumplir con el requerimiento de que **ningún registro se elimine físicamente de la base de datos**, se implementan las siguientes capas de protección:

1. **Columna `eliminado_en` (TIMESTAMP WITH TIME ZONE DEFAULT NULL)**:
   - `NULL`: El registro está activo y operativo en el sistema.
   - Con fecha (`TIMESTAMP`): El registro fue dado de baja de manera lógica, preservando la fecha exacta para auditoría histórica.
2. **Índices Parciales de Alto Rendimiento**:
   - `CREATE INDEX idx_... ON ... (eliminado_en) WHERE eliminado_en IS NULL;`
   - Optimiza las consultas del backend para consultar solo registros activos sin impacto de rendimiento.
3. **Integridad Referencial `ON DELETE RESTRICT`**:
   - Se eliminaron todos los `ON DELETE CASCADE`. La base de datos rechaza cualquier intento de eliminación física de registros que tengan dependencias o historial asociado.
4. **Tablas Transaccionales e Inmutables**:
   - Tablas como `registros_ocupacion` y `logs_sincronizacion_externa` son de tipo *Append-Only* (solo inserción) para servir como evidencia inalterable ante cualquier auditoría.

---

## Estructura Modular y Normalización (3FN)

```
+-----------------------------------------------------------------------------------+
|                            1. MÓDULO SEGURIDAD Y USUARIOS                         |
|  roles (1) ───< (N) usuarios                                                      |
+-----------------------------------------------------------------------------------+
|                      2. MÓDULO INFRAESTRUCTURA Y SALAS                            |
|  pabellones (1) ──┐                                                               |
|  tipos_sala (1) ──┼───< (N) salas (capacidad_min, capacidad_max) (1)─(1) camaras  |
|  estados_sala (1)─┘            │                                                  |
+--------------------------------┼--------------------------------------------------+
|                                │ (1)                                              |
|                                ├───< (N) reservas (1) ───< (N) reserva_integrantes|
|                                │            │     >─── (1) estados_reserva        |
|                                │            │     >─── (1) origenes_reserva       |
|                                │ (1)        │ (1)                                 |
|                                ├───< (N) alertas  >─── (1) tipos_alerta           |
|                                │            │     >─── (1) estados_alerta         |
|                                │ (1)        │                                     |
|                                ├───< (N) registros_ocupacion                      |
|                                │ (1)                                              |
|                                └───< (N) lista_espera >─ (1) estados_lista_espera |
+-----------------------------------------------------------------------------------+
|                   6. MÓDULO INTEGRACIÓN Y CONFIGURACIONES                         |
|  logs_sincronizacion_externa (Bitácora Webhook App Universidad / Simulador)       |
|  configuraciones_sistema     (Parámetros y Reglas de Negocio)                     |
+-----------------------------------------------------------------------------------+
```

---

## Control de Integrantes y Aforo (Mínimo y Máximo)

1. **En `salas`**:
   - `capacidad_minima`: Mínimo de personas para usar el espacio.
   - `capacidad_maxima`: Aforo máximo permitido (`CHECK (capacidad_maxima >= capacidad_minima)`).
2. **En `reservas`**:
   - `cantidad_integrantes`: Cantidad declarada de estudiantes en la reserva.
3. **En `reserva_integrantes`**:
   - Tabla asociativa de acompañantes vinculados a la reserva.
4. **En `lista_espera`**:
   - `cantidad_integrantes`: Tamaño del grupo en espera.
5. **En `alertas`**:
   - `SOBREPOBLACION`: Disparada por IA cuando `ocupantes_detectados > capacidad_maxima`.

---

## Catálogos Maestros y Tablas Principales

### 1. Seguridad y Usuarios
- **`roles`**: Catálogo de perfiles (`ADMINISTRADOR`, `SUPERVISOR`, `SEGURIDAD`, `ESTUDIANTE`).
- **`usuarios`**: Datos de usuarios con `codigo_institucional`, `rol_id` y `eliminado_en`.

### 2. Infraestructura y Monitoreo Físico
- **`pabellones`**: Edificios y pabellones universitarios (`nombre`, `codigo`, `ubicacion`).
- **`tipos_sala`**: Clasificación de espacios (`SALA_GRUPAL`, `SALA_SILENCIOSA`, `SALA_PROYECTOS`).
- **`estados_sala`**: Estados normalizados (`DISPONIBLE`, `RESERVADA`, `OCUPADA`, `MANTENIMIENTO`, `LIMPIEZA`, `DESHABILITADA`).
- **`salas`**: Salas físicas con ubicación (`pabellon_id`, `piso`, `tipo_sala_id`, `capacidad_minima`, `capacidad_maxima`, `eliminado_en`).
- **`camaras`**: Dispositivos de visión artificial asociados (`codigo_camara`, `ip_camara`, `url_stream`, `resolucion`, `fps`).

### 3. Reservas y Gestión de Espacios
- **`estados_reserva`**: `CONFIRMADA`, `EN_USO`, `COMPLETADA`, `CANCELADA`, `LIBERADA_AUTOMATICA`, `NO_ASISTIO`.
- **`origenes_reserva`**: `APP_UNIVERSIDAD`, `MANUAL`, `LISTA_ESPERA_AUTO`.
- **`reservas`**: Centraliza reservas, soporte para `id_reserva_externa` (sincronización/simulación universitaria), `cantidad_integrantes` y trazabilidad de `motivo_liberacion` por IA.
- **`reserva_integrantes`**: Registro de compañeros de grupo asociados a la reserva.
- **`estados_lista_espera`**: `EN_ESPERA`, `NOTIFICADO`, `ASIGNADO`, `EXPIRADO`, `CANCELADO`.
- **`lista_espera`**: Solicitudes de espacios en cola para reasignación automática inmediata.

### 4. Visión Artificial y Telemetría
- **`registros_ocupacion`**: Telemetría de IA con conteo de ocupantes, detección de alimentos/bebidas y bounding boxes (`JSONB`).

### 5. Alertas e Incidencias
- **`tipos_alerta`**: Catálogo de infracciones con severidad por defecto (`COMIDA_PROHIBIDA`, `SOBREPOBLACION`, `SALA_ABANDONADA`, etc.).
- **`estados_alerta`**: `PENDIENTE`, `NOTIFICADA`, `RESUELTA`, `DESCARTADA`.
- **`alertas`**: Incidencias generadas en tiempo real con evidencia fotográfica y usuario responsable de la resolución (`atendido_por_usuario_id`).

### 6. Integración y Parámetros
- **`logs_sincronizacion_externa`**: Bitácora inmutable de eventos recibidos de la app universitaria.
- **`configuraciones_sistema`**: Reglas de negocio (tiempos de abandono, tolerancias y umbrales de confianza).

---

## Despliegue con Docker

Para iniciar el contenedor de base de datos con los esquemas y datos semilla:

```bash
docker compose up -d db
```


### Credenciales de Conexión:
- **Host:** `localhost` / `db` (red Docker)
- **Puerto:** `5432`
- **Base de Datos:** `studyroom_db`
- **Usuario:** `studyroom_user`
- **Contraseña:** `studyroom_password`
