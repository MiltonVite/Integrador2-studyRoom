import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ModalSimulador } from './components/ModalSimulador';
import { DashboardPage } from './pages/DashboardPage';
import { ReservasPage } from './pages/ReservasPage';
import { CamarasPage } from './pages/CamarasPage';
import { ListaEsperaPage } from './pages/ListaEsperaPage';
import { AlertasPage } from './pages/AlertasPage';
import { UsuariosPage } from './pages/UsuariosPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';
import { LoginPage } from './pages/LoginPage';

import { puedeAccederTab } from './utils/permisos';

const MainLayout = () => {
  const { isAuthenticated, usuarioActual } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simuladorOpen, setSimuladorOpen] = useState(false);

  // Asegurar que si el usuario no tiene permiso para el tab actual, vuelva a dashboard
  React.useEffect(() => {
    if (!puedeAccederTab(usuarioActual?.rol, activeTab)) {
      setActiveTab('dashboard');
    }
  }, [usuarioActual, activeTab]);

  // Si el usuario no ha iniciado sesión, se muestra la vista de Login institucional
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Lateral con enlaces de navegación filtrados por rol */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulador={() => setSimuladorOpen(true)}
      />

      {/* Contenido Principal */}
      <div className="main-content">
        <Navbar onNavigateToCamaras={() => setActiveTab('camaras')} />

        {/* Renderizado de Vistas según Tab activo y Permisos de Rol */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToAlerts={() => setActiveTab('alertas')}
            onNavigateToEspera={() => setActiveTab('espera')}
          />
        )}

        {activeTab === 'reservas' && puedeAccederTab(usuarioActual?.rol, 'reservas') && <ReservasPage />}
        {activeTab === 'camaras' && puedeAccederTab(usuarioActual?.rol, 'camaras') && <CamarasPage />}
        {activeTab === 'espera' && puedeAccederTab(usuarioActual?.rol, 'espera') && <ListaEsperaPage />}
        {activeTab === 'alertas' && puedeAccederTab(usuarioActual?.rol, 'alertas') && <AlertasPage />}
        {activeTab === 'usuarios' && puedeAccederTab(usuarioActual?.rol, 'usuarios') && <UsuariosPage />}
        {activeTab === 'configuracion' && puedeAccederTab(usuarioActual?.rol, 'configuracion') && <ConfiguracionPage />}
      </div>

      {/* Modal de Simulación de Visión Artificial e Integración */}
      <ModalSimulador
        isOpen={simuladorOpen}
        onClose={() => setSimuladorOpen(false)}
      />
    </div>
  );
};

export const App = () => {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
};

export default App;

