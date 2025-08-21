import { Link, useLocation } from 'react-router';
import { paths } from '@/config/paths.ts';

import { WriteTweetIcon } from '@/assets/icons';

interface Props {
  className?: string;
  small?: boolean;
}

function ComposeButton({ small = false, className }: Props) {
  const location = useLocation();

  return (
    <div className={`my-4 max-w-58 ${className}`}>
      <Link
        to={paths.app.post.getHref()}
        state={{ backgroundLocation: location, post: null }}
        aria-label='Crear tweet'
        className={`cursor-pointer w-full ${small ? 'flex items-center' : 'block text-center'}`}
      >
        <div className='p-3 rounded-full text-buttonText bg-primary hover:opacity-95 transition-opacity duration-200'>
          {small
            ? <WriteTweetIcon className='size-6 text-buttonText' />
            : <span className='font-semibold text-lg'>Postear</span>
          }
        </div>
      </Link>
    </div>
  );
}

export default ComposeButton;
