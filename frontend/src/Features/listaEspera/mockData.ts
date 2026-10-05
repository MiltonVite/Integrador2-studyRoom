import type {
  Estadistica,
  GrupoEnEspera,
  SugerenciaMatching,
  TurnoLlamado,
} from './types';

export const estadisticas: Estadistica[] = [
  { id: 'enEspera', etiqueta: 'En Espera:', valor: 7, unidad: 'Grupos' },
  { id: 'tiempoPromedio', etiqueta: 'Tiempo Promedio Espera:', valor: 12, unidad: 'min' },
  { id: 'salasLiberadas', etiqueta: 'Salas Liberadas Hoy por IA:', valor: 6 },
  { id: 'turnosConfirmados', etiqueta: 'Turnos Confirmados:', valor: 18 },
];

export const turnoLlamado: TurnoLlamado = {
  nombre: 'Andrea Ruiz',
  codigo: 'U20199821',
  tamanoGrupo: 4,
  salaId: 105,
  segundosRestantes: 195, // 03:15
};

export const cola: GrupoEnEspera[] = [
  { posicion: 2, nombre: 'Jorge Allaga', codigo: 'U1928374', tamanoGrupo: 4, estado: 'En Espera' },
  { posicion: 3, nombre: 'Sofia Torres', codigo: 'U1928375', tamanoGrupo: 3, estado: 'En Espera' },
  { posicion: 4, nombre: 'Jorge Allaga', codigo: 'U1928374', tamanoGrupo: 4, estado: 'En Espera' },
  { posicion: 5, nombre: 'Jorge Allaga', codigo: 'U1928375', tamanoGrupo: 3, estado: 'En Espera' },
  { posicion: 6, nombre: 'Jorge Allaga', codigo: 'U1928375', tamanoGrupo: 3, estado: 'En Espera' },
  { posicion: 7, nombre: 'Sofia Torres', codigo: 'U1928375', tamanoGrupo: 4, estado: 'En Espera' },
];

export const sugerencia: SugerenciaMatching = {

  salaId: 105,
  grupoNombre: 'Ruiz',
  grupoTamano: 4,
  salaCapacidad: 6,
  equipamiento: ['PC Completa', 'Pizarra'],
};