import type { IconType } from 'react-icons';
import {
  FiHome,
  FiCalendar,
  FiList,
  FiAlertTriangle,
  FiSettings,
} from 'react-icons/fi';
import logoUtp from '../../assets/logo_utp.png';
import styles from './Sidebar.module.css';

interface ItemMenu {
  etiqueta: string;
  icono: IconType;
}

const items: ItemMenu[] = [
  { etiqueta: 'Inicio / Dashboard', icono: FiHome },
  { etiqueta: 'Reservas', icono: FiCalendar },
  { etiqueta: 'Lista de Espera', icono: FiList },
  { etiqueta: 'Alertas IA', icono: FiAlertTriangle },
  { etiqueta: 'Configuración', icono: FiSettings },
];

interface SidebarProps {
  activo: string;
}

export default function Sidebar({ activo }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>

        <img src={logoUtp} alt="Universidad Tecnológica del Perú" />
      </div>

      <nav className={styles.menu}>
        {items.map(({ etiqueta, icono: Icono }) => (
          <button
            key={etiqueta}
            type="button"
            className={`${styles.item} ${etiqueta === activo ? styles.activo : ''}`}
          >
            <Icono size={18} />
            <span>{etiqueta}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}