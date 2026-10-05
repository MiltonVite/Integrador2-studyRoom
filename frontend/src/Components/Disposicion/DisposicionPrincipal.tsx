import type { ReactNode } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import styles from './DisposicionPrincipal.module.css';

interface DisposicionPrincipalProps {
  seccionActiva: string;
  children: ReactNode;
}

export default function DisposicionPrincipal({
  seccionActiva,
  children,
}: DisposicionPrincipalProps) {
  return (
    <div className={styles.disposicion}>
      <Sidebar activo={seccionActiva} />

      <div className={styles.principal}>
        {/* Por ahora fijos; luego vendrán del login / la API */}
        <Header
          nombreUsuario="Administrador UTP"
          estadoIA="Auto-Match IA: Conectado a Protocolo Sala Libre"
        />

        <main className={styles.contenido}>{children}</main>
      </div>
    </div>
  );
}