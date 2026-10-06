import { z } from 'zod';
import { codigoUTPSchema, nombreCompletoSchema } from './reservaSchema';

// Esquema para Inicio de Sesión
export const loginSchema = z.object({
  identificador: z
    .string({ required_error: 'Ingresa tu código o correo institucional' })
    .trim()
    .min(1, 'El código o correo institucional es obligatorio'),
  contrasena: z
    .string({ required_error: 'Ingresa tu contraseña' })
    .min(1, 'La contraseña es obligatoria'),
  recordarme: z.boolean().default(true),
});

// Esquema para Crear / Editar Usuario
export const usuarioFormSchema = z.object({
  codigo_institucional: codigoUTPSchema,
  nombre_completo: nombreCompletoSchema,
  correo: z
    .string({ required_error: 'El correo es obligatorio' })
    .email('Correo inválido')
    .regex(/^[a-zA-Z0-9._%+-]+@utp\.edu\.pe$/i, 'Debe ser un correo institucional (@utp.edu.pe)'),
  rol: z.enum(['ADMINISTRADOR', 'OPERADOR', 'ESTUDIANTE', 'DOCENTE'], {
    required_error: 'Selecciona un rol de usuario',
  }),
  carrera: z.string().min(1, 'Ingresa la carrera o departamento'),
  telefono: z.string().regex(/^[0-9]{9}$/, 'El teléfono debe tener 9 dígitos').optional().or(z.literal('')),
  estado: z.enum(['ACTIVO', 'INACTIVO', 'SUSPENDIDO']).default('ACTIVO'),
});
