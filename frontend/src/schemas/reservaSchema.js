import { z } from 'zod';

/**
 * ESQUEMAS DE VALIDACIÓN ZOD - SISTEMA DE SALAS DE ESTUDIO UTP
 * Alineado con las entidades de la base de datos y directivas institucionales
 */

// 1. Regex institucional UTP (U seguido de 8 dígitos)
export const regexCodigoUTP = /^[uU][0-9]{8}$/;

// 2. Esquema para Código UTP individual
export const codigoUTPSchema = z
  .string({ required_error: 'El código institucional es obligatorio' })
  .trim()
  .min(1, 'El código institucional es obligatorio')
  .regex(regexCodigoUTP, 'Formato inválido. Debe iniciar con "U" seguido de 8 dígitos (ej: U20211045)');

// 3. Esquema para Nombre Completo
export const nombreCompletoSchema = z
  .string({ required_error: 'El nombre completo es obligatorio' })
  .trim()
  .min(3, 'El nombre debe tener al menos 3 caracteres')
  .regex(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/, 'El nombre solo debe contener letras y espacios');

// 4. Esquema Completo para Nueva Reserva
export const crearReservaSchema = (capacidadMaxima = 6) =>
  z
    .object({
      salaId: z.coerce.number().min(1, 'Debes seleccionar una sala'),
      codigoEstudiante: codigoUTPSchema,
      nombreEstudiante: nombreCompletoSchema,
      correoEstudiante: z
        .string()
        .email('Correo inválido')
        .regex(/^[a-zA-Z0-9._%+-]+@utp\.edu\.pe$/i, 'Debe ser un correo institucional (@utp.edu.pe)'),
      fechaReserva: z
        .string({ required_error: 'La fecha es obligatoria' })
        .refine(
          (fecha) => {
            const hoy = new Date().toISOString().split('T')[0];
            return fecha >= hoy;
          },
          { message: 'No puedes reservar en una fecha pasada' }
        ),
      horaInicio: z
        .string({ required_error: 'La hora de inicio es obligatoria' })
        .refine(
          (hora) => {
            if (!hora) return false;
            const [h, m] = hora.split(':').map(Number);
            const totalMin = h * 60 + m;
            return totalMin >= 7 * 60 && totalMin <= 22 * 60;
          },
          { message: 'El horario de atención es de 07:00 AM a 10:00 PM' }
        ),
      duracionMinutos: z.coerce.number().min(30).max(120, 'La duración máxima permitida es de 2 horas'),
      origenReserva: z.enum(['MANUAL', 'APP_UNIVERSIDAD', 'LISTA_ESPERA_AUTO']).default('MANUAL'),
      notas: z.string().optional(),
      integrantesExtra: z
        .array(
          z.object({
            codigo: z.string().trim(),
          })
        )
        .optional()
        .default([]),
    })
    .superRefine((data, ctx) => {
      // Validar aforo total (Titular + Acompañantes con código ingresado)
      const acompanantesValidos = (data.integrantesExtra || []).filter((i) => i.codigo && i.codigo.trim() !== '');
      const totalIntegrantes = 1 + acompanantesValidos.length;

      if (totalIntegrantes > capacidadMaxima) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `El aforo total (${totalIntegrantes}) supera la capacidad máxima de la sala (${capacidadMaxima})`,
          path: ['integrantesExtra'],
        });
      }

      // Validar códigos de acompañantes (sin duplicados y sin coincidir con titular)
      const setCodigos = new Set();
      const titularCod = data.codigoEstudiante.toUpperCase().trim();
      setCodigos.add(titularCod);

      (data.integrantesExtra || []).forEach((item, index) => {
        const cod = item.codigo?.toUpperCase().trim();
        if (!cod) return; // Se ignoran vacíos si el usuario aún está escribiendo

        if (!regexCodigoUTP.test(cod)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: 'Código inválido (ej: U20211046)',
            path: ['integrantesExtra', index, 'codigo'],
          });
          return;
        }

        if (setCodigos.has(cod)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: cod === titularCod ? 'Coincide con el código del titular' : 'Código duplicado',
            path: ['integrantesExtra', index, 'codigo'],
          });
          return;
        }

        setCodigos.add(cod);
      });
    });

// 5. Esquema para Registro en Lista de Espera
export const listaEsperaSchema = z.object({
  codigo: codigoUTPSchema,
  nombre: nombreCompletoSchema,
  tipo_sala: z.string().min(1, 'Selecciona un tipo de sala'),
  integrantes: z.coerce.number().min(1).max(8, 'Capacidad entre 1 y 8 personas'),
  sala_deseada: z.string().default('Cualquiera'),
});
