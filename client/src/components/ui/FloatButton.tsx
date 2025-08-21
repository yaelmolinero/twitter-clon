interface Props {
  ariaLabel: string;
  onClick: () => void;
  icon: React.JSX.Element;
}

function FloatButton({ ariaLabel, onClick, icon }: Props) {
  return (
    <button
      type='button'
      aria-label={ariaLabel}
      onClick={onClick}
      className='p-3 rounded-full bg-floatButton cursor-pointer hover:bg-floatButtonHover transition-colors duration-200'>
      {icon}
    </button>
  );
}

export default FloatButton;
