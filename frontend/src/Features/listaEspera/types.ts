export type EstadoGrupo = 'En Espera' | 'Llamado' | 'Confirmado';

export interface GrupoEnEspera {
  posicion: number;
  nombre: string;
  codigo: string;
  tamanoGrupo: number;
  estado: EstadoGrupo;
}

export interface TurnoLlamado {
  nombre: string;
  codigo: string;
  tamanoGrupo: number;
  salaId: number;
  segundosRestantes: number;
  avatarUrl?: string;
}

export interface Estadistica {
  id: string;
  etiqueta: string;
  valor: number;
  unidad?: string; // "Grupos", "min"
}

export interface SugerenciaMatching {
  salaId: number;
  grupoNombre: string;
  grupoTamano: number;
  salaCapacidad: number;
  equipamiento: string[];

}
