import z from 'zod';

const parseBoolean = z
  .preprocess(val => {
    if (typeof val === 'string') {
      if (val.toLowerCase() === 'true' || val === '1') return true;
      if (val.toLowerCase() === 'false' || val === '0') return false;
    }
    return undefined;

  }, z.boolean({ message: 'El valor pasado en multimedia tiene que ser tipo booleano' }));

export const updateUserSchema = z.object({
  name: z.string().nonempty().max(100).optional(),
  bio: z.string().max(160).nullable().optional(),
  location: z.string().max(30).nullable().optional(),
  website: z.string().max(100).nullable().optional(),
  removeCover: parseBoolean.optional()
});

export const pageValidation = z
  .string({ required_error: 'Es necesario el parametro page en la busqueda' })
  .transform(Number)
  .refine(num => Number.isInteger(num) && num > 0, {
    message: 'page tiene que ser un numero entero positivo'
  });

export const tweetsByUserValidation = z.object({
  page: pageValidation,
  multimedia: parseBoolean.optional()
});

export type ZUpdateUser = z.infer<typeof updateUserSchema>;
