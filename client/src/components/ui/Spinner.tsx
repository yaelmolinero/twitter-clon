interface Props {
  size?: string;
  loadingContainer?: boolean;
}

function Spinner({ size = 'size-8', loadingContainer = false }: Props) {
  const spinnerStyle = `${size} rounded-full border-4 border-twitterBlue/20 border-l-twitterBlue animate-spin`;

  if (!loadingContainer) return <div className={spinnerStyle} />;

  return (
    <div className='flex justify-center items-center w-full h-16'>
      <div className={spinnerStyle} />
    </div>
  );
}

export default Spinner;
