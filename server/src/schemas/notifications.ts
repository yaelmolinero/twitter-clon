import z from 'zod';

const requieredID = z
  .string()
  .refine(val => /^\d{18}$/.test(val), { message: 'El ID debe tener exactamente 18 dígitos númericos' });

const optionalID = z
  .string()
  .transform(val => val === 'null' ? null : val)
  .refine(val => val === null || /^\d{18}$/.test(val), { message: 'El ID debe tener exactamente 18 dígitos númericos' });

export const notificationSchema = z.object({
  recipientID: requieredID,
  senderID: requieredID,
  type: z.enum(['like', 'follow', 'comment', 'retweet'], { message: 'El tipo de notificación no es valido' }),
  tweetID: optionalID
});
