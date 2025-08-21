import z from 'zod';

export const querySchema = z.object({
  query: z
    .string({ message: 'La busqueda no puede estar vacia.' })
    .nonempty(),
  filter: z
    .enum(['post', 'user', 'media']),
  page: z
    .string({ message: 'Es necesario el parametro page en la busqueda.' })
    .transform(Number)
    .refine(val => Number.isInteger(val) && val > 0, { message: 'page tiene que ser un numero entero positivo.' })
});
