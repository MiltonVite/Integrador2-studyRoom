# Frontend - Sistema Inteligente de Gestión de Salas de Estudio (UTP)

Este módulo contiene la aplicación web desarrollada en **React 18 + Vite** con un sistema de diseño moderno inspirado en la identidad institucional de la **Universidad Tecnológica del Perú (UTP)**. La plataforma está diseñada para la supervisión y automatización de salas de estudio universitarias mediante **Visión Artificial e Inteligencia Artificial**.

---

##  Arquitectura y Tecnologías

- **Framework:** React 18
- **Empaquetador y Entorno:** Vite 5
- **Iconografía:** Lucide React
- **Estilos:** Sistema de diseño modular en CSS nativo (`src/index.css`) con variables HSL, elevaciones, micro-animaciones y paleta moderna SaaS / UTP.
- **Gestor de Estado:** React Context API (`AppContext.jsx`) con soporte para sincronización en tiempo real, temporizadores de abandono y simulación de eventos.
- **Contenerización:** Dockerfile multi-etapa con Node.js 20 Alpine y soporte para Hot-Reload.

---

##  Estructura del Proyecto

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx                   # Barra superior con acceso directo a cámaras IA, búsqueda y alertas
│   │   ├── Sidebar.jsx                  # Menú lateral institucional limpio con tarjeta de usuario y Cámaras IA
│   │   ├── ModalNuevaReserva.jsx        # Diálogo para registrar reservas según esquema de BD
│   │   ├── ModalConfirmarLiberacion.jsx # Diálogo de confirmación con registro de motivo de liberación
│   │   └── ModalSimulador.jsx           # Simulador interactivo de visión artificial y webhooks
│   ├── context/
│   │   └── AppContext.jsx               # Estado global, reglas de temporizador y motor de eventos
│   ├── pages/
│   │   ├── DashboardPage.jsx            # Vista principal: Hero card, KPIs limpios y grilla de salas
│   │   ├── ReservasPage.jsx             # Matriz horaria (Timeline), validación IA y detalle de reservas
│   │   ├── CamarasPage.jsx              # Monitoreo en vivo de 6 cámaras RTSP con Bounding Boxes IA
│   │   ├── AlertasPage.jsx              # Centro de auditoría IA con visor de evidencia
│   │   ├── ListaEsperaPage.jsx          # Gestión y reasignación de cola de espera
│   │   └── ConfiguracionPage.jsx        # Parámetros de tolerancia, políticas y estado de cámaras RTSP
│   ├── App.jsx                          # Orquestador principal de vistas y navegación
│   ├── index.css                        # Hoja de estilos global y tokens de diseño SaaS
│   └── main.jsx                         # Punto de entrada de React DOM
├── index.html                           # Documento raíz con tipografía Plus Jakarta Sans
├── package.json                         # Dependencias y scripts de ejecución
├── vite.config.js                       # Configuración del servidor de desarrollo Vite
├── Dockerfile                           # Definición de contenedor Docker
└── front.md                             # Documentación del módulo Frontend
```

---

##  Módulos y Vistas Desarrolladas

### 1. Inicio / Dashboard (`DashboardPage.jsx`)
- **Hero Card de Bienvenida:** Saludo personalizado con badge de rol (*Administrador*) y selector de fecha.
- **Métricas KPI en tarjetas SaaS:** *Total Salas (06)*, *Disponibles (03)*, *% Ocupación (50%)* e *Incidencias IA (02)* con subtítulos descriptivos.
- **Grilla de Salas Grupales:** Monitoreo visual de las 6 salas con indicadores de equipamiento (PC, Pizarra, Capacidad: 6 personas).
- **Protocolo Sala Libre (Liberación Automática por IA):** Cuenta regresiva en vivo cuando la cámara detecta 0 personas en una sala con reserva activa.
- **Liberación Segura con Modal de Confirmación:** Diálogo previo para seleccionar el motivo de auditoría antes de desocupar cualquier espacio.

### 2. Gestión de Reservas y Calendario (`ReservasPage.jsx`)
- **KPIs operacionales:** Reservas del día, en curso, próximas y detecciones de inasistencia (*No-Show*).
- **Matriz Horaria Interactiva:** Grilla de 08:00 a 15:00 por sala con bloques de reserva clasificados por color y estado.
- **Panel de Inspección:** Detalle del alumno titular, código institucional, franja horaria y confirmación con badge `Validado por Visión IA`.

### 3. Cámaras de Visión Artificial en Vivo (`CamarasPage.jsx`) *(Nuevo módulo exclusivo)*
- **Transmisión de 6 cámaras RTSP:** Vista en tiempo real de cada una de las salas físicas (`CAM-A101` a `CAM-A106`).
- **Superposición de Bounding Boxes (Cajas Delimitadoras IA):**
  - Detección de personas y conteo dinámico.
  - Reconocimiento de periféricos (`PC Monitor`, `Teclado`, `Mouse`).
  - Detección de alimentos y bebidas no permitidas con alerta roja.
- **Visor a pantalla completa e inspección técnica:** Muestra la IP del dispositivo, resolución Full HD, FPS y URI de streaming RTSP.

### 4. Centro de Alertas y Auditoría IA (`AlertasPage.jsx`)
- **Filtros por severidad:** *Todas*, *Baja*, *Media*, *Importante*, *Crítica*.
- **Visor de Evidencia Fotográfica:** Muestra fotogramas capturados por las cámaras con cajas delimitadoras.
- **Acciones de resolución inmediata:** Botones para `Confirmar Sala Libre Ahora` o `Mantener Reserva`.

### 5. Configuración del Sistema y Parámetros IA (`ConfiguracionPage.jsx`)
- **Políticas de Tiempo:** Configuración de rangos de duración mínima y máxima de reserva.
- **Calibración de Visión Artificial:** Slider para ajustar el tiempo de tolerancia sin ocupantes antes de ejecutar la liberación automática (4 a 10 minutos).
- **Switches inteligentes:** Habilitación de detección de pertenencias personales y auto-notificación a la lista de espera.
- **Gestión de Periféricos y RTSP:** Checklist de equipamiento por sala y estado de conexión de cámaras en vivo (*OK/Conectado*).

### 6. Lista de Espera Inteligente (`ListaEsperaPage.jsx`)
- Tabla de estudiantes en cola con orden de prioridad, tamaño del grupo y botón de asignación inmediata tras liberación de salas.

### 7. Simulador de Eventos de Integración (`ModalSimulador.jsx`)
- Herramienta interactiva para probar el flujo completo:
  1. Simular desocupación anticipada de una sala (activa el temporizador de abandono).
  2. Simular detección de alimentos o bebidas no permitidas.
  3. Simular la recepción de una reserva entrante desde la app móvil universitaria.

---

##  Despliegue y Ejecución

### Opción 1: Con Docker Compose (Frontend Únicamente)

Para construir y levantar **únicamente el contenedor del Frontend**:

```bash
docker compose up --build frontend
```

Para levantar **todos los servicios juntos** (Base de datos + Frontend):
```bash
docker compose up -d
```

La aplicación web estará disponible en: **`http://localhost:3000`**

### Opción 2: Ejecución Local (Node.js)

1. Ingresar a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instalar las dependencias de Node:
   ```bash
   npm install
   ```
3. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```
4. Abrir en el navegador: **`http://localhost:3000`**
