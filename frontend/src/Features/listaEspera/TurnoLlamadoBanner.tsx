import { useEffect, useState } from 'react';
import type { TurnoLlamado } from './types';
import styles from './TurnoLlamadoBanner.module.css';

interface TurnoLlamadoBannerProps {
  turno: TurnoLlamado;
}

function formatearTiempo(totalSegundos: number): string {
  const min = Math.floor(totalSegundos / 60);
  const seg = totalSegundos % 60;
  return `${String(min).padStart(2, '0')}:${String(seg).padStart(2, '0')}`;
}

export default function TurnoLlamadoBanner({ turno }: TurnoLlamadoBannerProps) {
  const [segundos, setSegundos] = useState(turno.segundosRestantes);

  useEffect(() => {
    const id = setInterval(() => {
      setSegundos((actual) => (actual > 0 ? actual - 1 : 0));
    }, 1000);

    return () => clearInterval(id);
  }, []);

  const tiempo = formatearTiempo(segundos);

  return (
    <section className={styles.banner}>
      <h3 className={styles.titulo}>
        Sala {turno.salaId} Liberada Anticipadamente - Turno Llamado ({tiempo} min
        restantes para confirmar)

      </h3>

      <div className={styles.tarjeta}>
        <div className={styles.persona}>
          {turno.avatarUrl ? (
            <img src={turno.avatarUrl} alt={turno.nombre} className={styles.avatar} />
          ) : (
            <span className={styles.avatar}>{turno.nombre.charAt(0)}</span>
          )}
          <div>
            <p className={styles.nombre}>{turno.nombre}</p>
            <p className={styles.codigo}>{turno.codigo}</p>
          </div>
        </div>

        <p className={styles.grupo}>{turno.tamanoGrupo} alumnos</p>

        <p className={styles.tiempo}>
          {tiempo}
          <span className={styles.min}>min</span>
        </p>
      </div>
    </section>
  );
}