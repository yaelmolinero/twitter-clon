import z from 'zod';

export const createTweetSchema = z.object({
  content: z
    .string({ message: 'El contenido tiene que ser texto' })
    .min(1, { message: 'El tweet no puede estar vacio.' })
    .max(250, { message: 'El tweet debe tener menos de 250 caracteres.' }),
  parentTweetID: z
    .string()
    .transform(val => val === 'null' ? null : val)
    .refine(val => val === null || /^\d{18}$/.test(val), { message: 'El ID debe tener exactamente 18 dígitos númericos' }),
});

export const queryValidation = z.object({
  page: z
    .string({ message: 'Es necesario el parametro page en la busqueda.' })
    .transform(Number)
    .refine(val => Number.isInteger(val) && val > 0, { message: 'page tiene que ser un numero entero positivo.' }),
  following: z
    .preprocess(val => {
      if (typeof val === 'string') {
        if (val.toLowerCase() === 'true' || val === '1') return true;
        if (val.toLowerCase() === 'false' || val === '0') return false;
      }
      return undefined;
    },
      z.boolean({ message: 'El valor pasado en following tiene que ser tipo booleano' })
    )
    .optional()
});
