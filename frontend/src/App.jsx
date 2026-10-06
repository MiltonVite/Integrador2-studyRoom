import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Navbar } from './components/Navbar';
import { ModalSimulador } from './components/ModalSimulador';
import { DashboardPage } from './pages/DashboardPage';
import { ReservasPage } from './pages/ReservasPage';
import { CamarasPage } from './pages/CamarasPage';
import { ListaEsperaPage } from './pages/ListaEsperaPage';
import { AlertasPage } from './pages/AlertasPage';
import { ConfiguracionPage } from './pages/ConfiguracionPage';

export const App = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [simuladorOpen, setSimuladorOpen] = useState(false);

  return (
    <AppProvider>
      <div className="app-container">
        {/* Sidebar Lateral */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSimulador={() => setSimuladorOpen(true)}
        />

        {/* Contenido Principal */}
        <div className="main-content">
          <Navbar onNavigateToCamaras={() => setActiveTab('camaras')} />

          {/* Renderizado de Vistas */}
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
          {activeTab === 'configuracion' && <ConfiguracionPage />}
        </div>

        {/* Modal de Simulación de Visión Artificial e Integración */}
        <ModalSimulador
          isOpen={simuladorOpen}
          onClose={() => setSimuladorOpen(false)}
        />
      </div>
    </AppProvider>
  );
};
export default App;
