import { useSignup } from '@/features/auth/api/createUser.ts';
import AuthLayout from '@/components/layouts/AuthLayout.tsx';
import InputForm from '@/components/ui/InputForm.tsx';
import Spinner from '@/components/ui/Spinner.tsx';

function Signup() {
  const {
    newUser,
    setNewUser,
    handleSubmit,
    isPending,
    errorMsg,
    emailErrorMsg,
    usernameErrorMsg,
    disabledForm
  } = useSignup();

  const { name, username, email, password } = newUser;

  return (
    <AuthLayout variant='signup' errorMsg={errorMsg}>
      <form onSubmit={handleSubmit} className='space-y-6'>
        <InputForm
          id='name'
          label='Nombre'
          value={name}
          maxLength={50}
          onChange={(inputValue) => setNewUser({ ...newUser, name: inputValue })}
        />

        <InputForm
          id='email'
          label='Correro electrónico'
          value={email}
          maxLength={120}
          hideFeedback
          autoComplete
          errorMsg={emailErrorMsg}
          onChange={(inputValue) => setNewUser({ ...newUser, email: inputValue.trim() })}
        />

        <InputForm
          id='username'
          label='Username'
          value={username}
          maxLength={120}
          hideFeedback
          errorMsg={usernameErrorMsg}
          onChange={(inputValue) => setNewUser({ ...newUser, username: inputValue.trim() })}
        />

        <InputForm
          variant='password'
          id='password'
          label='Contraseña'
          value={password}
          maxLength={120}
          hideFeedback
          onChange={(inputValue) => setNewUser({ ...newUser, password: inputValue })}
        />

        <button
          type='submit'
          disabled={disabledForm}
          className='flex justify-center items-center gap-4 w-full py-4 rounded-full text-buttonText bg-primary font-bold cursor-pointer text-center hover:opacity-95 disabled:opacity-50 disabled:cursor-default'
        >
          <span>Siguiente</span>
          {isPending && <Spinner size='size-6' />}
        </button>
      </form>
    </AuthLayout>
  );
}

export default Signup;
