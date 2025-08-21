import { api } from '@/lib/api-client.ts';
import { ROLES } from '@/types/users.d';
import type { User } from '@/types/users.d.ts';

export async function getRefreshToken(): Promise<User> {
  try {
    return await api.post('/auth/refresh', undefined, { credentials: 'include' });

  } catch (err) {
    console.error(err);
    return { role: ROLES.GUEST, user: undefined, token: undefined };
  }
}
