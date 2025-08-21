function ErrorAlert({ className }: { className?: string }) {
  return (
    <div className={`w-full px-4 py-2 ${className ?? ''}`}>
      <div className='px-4 py-2 rounded-xl bg-red-950'>
        <span className='text-primary'>Algo salío mal, pero no te preocupes. Vamos a intentarlo de nuevo.</span>
      </div>
    </div>
  );
}

export default ErrorAlert;
