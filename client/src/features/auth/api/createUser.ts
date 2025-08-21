import { useState, useEffect } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useSearchParams, useNavigate } from 'react-router';
import { useDebounce } from '@/hooks/useDebounce.ts';

import { api } from '@/lib/api-client.ts';
import { paths } from '@/config/paths.ts';

import { ROLES } from '@/types/users.d';
import type { AccessToken } from '@/types/api.d.ts';

type SignupParams = { name: string, username: string, email: string, password: string };

async function signup(input: SignupParams): Promise<AccessToken> {
  return await api.post('/auth/signup', input, { credentials: 'include' });
}

export function useSignup() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get('redirectTo') ?? paths.app.home.getHref();

  const { mutate, isPending } = useMutation({
    mutationFn: signup,
    onSuccess: ({ user, token }) => queryClient.setQueryData(['auth'], { user, token, role: ROLES.USER })
  });

  const [newUser, setNewUser] = useState({ name: '', email: '', username: '', password: '' });
  const [isEmailAviable, setIsEmailAviable] = useState(false);
  const [isUsernameAviable, setIsUsernameAviable] = useState(false);

  const [emailErrorMsg, setEmailErrorMsg] = useState('');
  const [usernameErrorMsg, setUsernameErrorMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const { name, email, username, password } = newUser;
  const { debounceValue: debounceEmail } = useDebounce(email);        // Debounce para email
  const { debounceValue: debounceUsername } = useDebounce(username);  // Debounce para username

  const disabledForm = !name || !email || !username || !password || !isEmailAviable || !isUsernameAviable || isPending;

  useEffect(() => {
    setEmailErrorMsg('');
    if (debounceEmail === '') return;

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(debounceEmail)) return setEmailErrorMsg('Ingrese un email valido');

    api.post('/auth/exist_user', { type: 'email', data: debounceEmail })
      .then(() => setIsEmailAviable(true))
      .catch(err => {
        setIsEmailAviable(false);
        setEmailErrorMsg(err.message);
      });

  }, [debounceEmail]);

  useEffect(() => {
    setUsernameErrorMsg('');
    if (debounceUsername === '') return;

    api.post('/auth/exist_user', { type: 'username', data: debounceUsername })
      .then(() => setIsUsernameAviable(true))
      .catch(err => {
        setIsUsernameAviable(false);
        setUsernameErrorMsg(err.message);
      });

  }, [debounceUsername]);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!isEmailAviable || !isUsernameAviable) return;

    mutate(newUser, {
      onSuccess: () => navigate(redirectTo, { replace: true }),
      onError: (error) => setErrorMsg(error.message)
    });
  }

  return {
    handleSubmit,
    setNewUser,
    newUser,
    isPending,
    disabledForm,
    emailErrorMsg,
    usernameErrorMsg,
    errorMsg
  };
}
