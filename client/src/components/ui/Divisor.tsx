interface Props {
  className?: string;
}

function Divisor({ className = '' }: Props) {
  return <div className={`h-[1px] w-full bg-borderColor ${className}`}></div>;
}

export default Divisor;
