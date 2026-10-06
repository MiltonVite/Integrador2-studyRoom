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

const MainLayout = () => {
  const { isAuthenticated } = useApp();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simuladorOpen, setSimuladorOpen] = useState(false);

  // Si el usuario no ha iniciado sesión, se muestra la vista de Login institucional
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={() => setActiveTab('dashboard')} />;
  }

  return (
    <div className="app-container">
      {/* Sidebar Lateral con enlaces de navegación y botón de cerrar sesión */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenSimulador={() => setSimuladorOpen(true)}
      />

      {/* Contenido Principal */}
      <div className="main-content">
        <Navbar onNavigateToCamaras={() => setActiveTab('camaras')} />

        {/* Renderizado de Vistas según Tab activo */}
        {activeTab === 'dashboard' && (
          <DashboardPage
            onNavigateToAlerts={() => setActiveTab('alertas')}
            onNavigateToEspera={() => setActiveTab('espera')}
          />
        )}

        {activeTab === 'reservas' && <ReservasPage />}
        {activeTab === 'camaras' && <CamarasPage />}
        {activeTab === 'espera' && <ListaEsperaPage />}
        {activeTab === 'alertas' && <AlertasPage />}
        {activeTab === 'usuarios' && <UsuariosPage />}
        {activeTab === 'configuracion' && <ConfiguracionPage />}
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

