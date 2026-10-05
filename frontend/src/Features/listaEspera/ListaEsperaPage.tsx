
import type { IconType } from 'react-icons';
import {
    FiPlus,
    FiClipboard,
    FiClock,
    FiUnlock,
    FiCheckCircle,
} from 'react-icons/fi';
import TurnoLlamadoBanner from './TurnoLlamadoBanner';
import ColaTable from './ColaTable';
import StatCard, { type TonoStatCard } from '../../Components/StatCard/StatCard';
import { estadisticas, turnoLlamado, cola } from './mockData';
import styles from './ListaEsperaPage.module.css';

const apariencia: Record<string, { icono: IconType; tono: TonoStatCard }> = {
    enEspera: { icono: FiClipboard, tono: 'rojo' },
    tiempoPromedio: { icono: FiClock, tono: 'azul' },
    salasLiberadas: { icono: FiUnlock, tono: 'amarillo' },
    turnosConfirmados: { icono: FiCheckCircle, tono: 'verde' },
};

export default function ListaEsperaPage() {
    return (
        <section className={styles.pagina}>
            <div className={styles.titulo}>
                <h2 className={styles.encabezado}>
                    Cola Inteligente de Espera y Asignación Automática
                </h2>
                <button type="button" className={styles.btnAnadir}>
                    <FiPlus size={16} />
                    Añadir a Cola
                </button>
            </div>


            <div className={styles.estadisticas}>
                {estadisticas.map((e) => {
                    const { icono, tono } = apariencia[e.id];
                    return (
                        <StatCard
                            key={e.id}
                            etiqueta={e.etiqueta}
                            valor={e.valor}
                            unidad={e.unidad}
                            icono={icono}
                            tono={tono}
                        />
                    );
                })}
            </div>
            <TurnoLlamadoBanner turno={turnoLlamado} />
            <ColaTable grupos={cola} />
        </section>
    );
}