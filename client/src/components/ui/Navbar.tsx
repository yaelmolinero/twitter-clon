import { useNavigate } from 'react-router';
import { LeftRowIcon } from '@/assets/icons';

interface Props {
  type: 'navigation' | 'header';
  label: string;
  subLabel?: string;
  children?: React.ReactNode;
}

function Navbar({ type, label, subLabel, children }: Props) {
  const navigate = useNavigate();
  const hasSubLabel = subLabel != undefined;

  return (
    <nav className='sticky top-0 z-10 text-primary cursor-pointer bg-blur'>
      <div className={`w-full flex items-center gap-10 px-4 ${hasSubLabel ? 'py-1' : 'py-3'}`}>
        {type === 'navigation' && (
          <div className='group flex items-center'>
            <button
              type='button'
              aria-label='Retroceder de página'
              className='inline-flex relative cursor-pointer'
              onClick={() => navigate(-1)}
            >
              <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-borderColor/50 transition-colors duration-200'></div>
              <LeftRowIcon className='size-5' />
            </button>
          </div>
        )}

        <div className='leading-0'>
          <h2 className='font-bold text-xl'>{label}</h2>
          {hasSubLabel && <span className='text-secondary text-sm'>{subLabel}</span>}
        </div>

      </div>
      {children}
    </nav>
  );
}

export default Navbar;
