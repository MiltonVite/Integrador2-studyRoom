import type { IconType } from 'react-icons';
import styles from './StatCard.module.css';

export type TonoStatCard = 'rojo' | 'azul' | 'amarillo' | 'verde';

interface StatCardProps {
  etiqueta: string;
  valor: number;
  unidad?: string;
  icono: IconType;
  tono: TonoStatCard;
}

export default function StatCard({
  etiqueta,
  valor,
  unidad,
  icono: Icono,
  tono,
}: StatCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.cabecera}>
        <span className={styles.etiqueta}>{etiqueta}</span>
        <span className={`${styles.icono} ${styles[tono]}`}>
          <Icono size={16} />
        </span>
      </div>

      <p className={styles.valor}>
        {String(valor).padStart(2, '0')}
        {unidad && <span className={styles.unidad}>{unidad}</span>}

      </p>
    </article>
  );
}