import { useLogin } from '@/features/auth/api/loginUser.ts';
import AuthLayout from '@/components/layouts/AuthLayout.tsx';
import InputForm from '@/components/ui/InputForm.tsx';
import Spinner from '@/components/ui/Spinner.tsx';

function Login() {
  const {
    credentials,
    setCredentials,
    handleSubmit,
    isPending,
    errorMsg,
    disabledForm
  } = useLogin();

  const { emailOrUsername, password } = credentials;

  return (
    <AuthLayout variant='login' errorMsg={errorMsg}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <InputForm
          id='email-username'
          label='Correro electrónico o nombre de usuario'
          value={emailOrUsername}
          maxLength={100}
          hideFeedback
          autoComplete
          onChange={(inputValue) => setCredentials({ ...credentials, emailOrUsername: inputValue.trim() })}
        />

        <InputForm
          variant='password'
          id='password'
          label='Contraseña'
          value={password}
          maxLength={50}
          hideFeedback
          onChange={(inputValue) => setCredentials({ ...credentials, password: inputValue })}
        />

        <button
          type='submit'
          disabled={disabledForm}
          className='flex gap-4 justify-center w-full py-4 rounded-full text-buttonText bg-primary font-bold cursor-pointer hover:opacity-95 disabled:opacity-50 disabled:cursor-default'
        >
          <span>Iniciar sesión</span>
          {isPending && <Spinner size='size-6' />}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Login;
