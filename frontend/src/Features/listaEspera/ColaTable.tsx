import type { GrupoEnEspera } from './types';
import styles from './ColaTable.module.css';

interface ColaTableProps {
  grupos: GrupoEnEspera[];
}

export default function ColaTable({ grupos }: ColaTableProps) {
  return (
    <div className={styles.contenedor}>
      <table className={styles.tabla}>
        <thead>
          <tr>
            <th>Posición</th>
            <th>Nombre (Código Estudiante)</th>
            <th>Tamaño de Grupo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>
          {grupos.map((g) => (
            <tr key={g.posicion}>
              <td>#{g.posicion}</td>
              <td>
                {g.nombre} ({g.codigo})
              </td>
              <td>{g.tamanoGrupo} alumnos</td>
              <td>{g.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}