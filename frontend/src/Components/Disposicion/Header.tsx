import { FiSearch, FiMessageSquare, FiBell } from 'react-icons/fi';
import styles from './Header.module.css';

interface HeaderProps {
  nombreUsuario: string;
  estadoIA: string;
}

export default function Header({ nombreUsuario, estadoIA }: HeaderProps) {
  return (
    <header className={styles.header}>
      <h1 className={styles.saludo}>Hola, {nombreUsuario}</h1>

      <div className={styles.buscador}>
        <FiSearch size={16} />
        <input type="text" placeholder="Busca por número" />
      </div>

      <div className={styles.estadoIA}>
        <span className={styles.punto} />
        {estadoIA}
      </div>

      <div className={styles.acciones}>
        <button type="button" className={styles.iconBtn} aria-label="Mensajes">
          <FiMessageSquare size={20} />
        </button>
        <button type="button" className={styles.iconBtn} aria-label="Notificaciones">
          <FiBell size={20} />
        </button>
        <div className={styles.avatar}>{nombreUsuario.charAt(0)}</div>
      </div>

    </header>
  );
}