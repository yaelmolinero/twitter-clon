import z from 'zod';

export const createUserSchema = z.object({
  name: z
    .string({ message: 'El nombre debe ser texto' })
    .min(1, { message: 'El nombre no puede estar vacío' })
    .max(50, { message: 'El nombre no puede exceder los 50 caracteres' }),
  username: z
    .string({ message: 'El nombre del usuario debe ser texto' })
    .min(1, { message: 'El nombre de usuario no puede estar vacío' })
    .max(50, { message: 'El nombre de usuario no puede exceder los 50 caracteres' })
    .refine(val => !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val), {
      message: 'El nombre de usuario no puede ser un correo electrónico'
    }),
  email: z
    .string()
    .email({ message: 'El correo electrónico no es válido' }),
  password: z
    .string()
    .min(3, { message: 'La contraseña debe tener minimo 3 caracteres.' })
});

export const loginUserSchema = z.object({
  type: z.enum(['email', 'username'], {
    required_error: '"type" es requerido',
    invalid_type_error: '"type" solo puede ser "email" o "username"'
  }),
  data: z.string().min(1, { message: '"data" no puede estar vacío' }),
  password: z.string().min(3, { message: 'La contraseña debe tener minimo 3 caracteres.' })
});
