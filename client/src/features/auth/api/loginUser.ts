import { useState } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router';
import { api } from '@/lib/api-client.ts';
import { paths } from '@/config/paths.ts';

import { ROLES } from '@/types/users.d';
import type { AccessToken } from '@/types/api.d.ts';

type LoginParams = { emailOrUsername: string, password: string };

async function login({ emailOrUsername, password }: LoginParams): Promise<AccessToken> {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const isEmailType = emailRegex.test(emailOrUsername);
  const type = isEmailType ? 'email' : 'username';

  return await api.post('/auth/login', { type, data: emailOrUsername, password }, { credentials: 'include' });
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.home.getHref();

  const { mutate, isPending } = useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      const { user, token } = data;
      queryClient.setQueryData(['auth'], { user, token, role: ROLES.USER });
    }
  });

  const [credentials, setCredentials] = useState({ emailOrUsername: '', password: '' });
  const [errorMsg, setErrorMsg] = useState('');

  const { emailOrUsername, password } = credentials;
  const disabledForm = !emailOrUsername || !password || isPending;

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    mutate({ emailOrUsername, password }, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
      onError: (error) => setErrorMsg(error.message)
    });
  }

  return {
    credentials,
    setCredentials,
    handleSubmit,
    isPending,
    errorMsg,
    disabledForm
  };
}
