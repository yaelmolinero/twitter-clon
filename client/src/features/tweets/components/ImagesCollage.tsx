import { Link, useLocation } from 'react-router';
import { paths } from '@/config/paths.ts';

import type { TweetType } from '@/types/tweets.d.ts';

interface Props {
  tweets: TweetType[]
}

function ImagesCollage({ tweets }: Props) {
  const location = useLocation();

  return (
    <div className='grid grid-cols-3 gap-1 p-1'>
      {tweets.map(tw => (
        <div key={tw.id} className='h-50 overflow-hidden'>
          <Link
            to={paths.app.status.image.getHref(tw.user.username, tw.id)}
            state={{ status: tw, backgroundLocation: location }}
            className='block w-full h-full'
          >
            <img
              src={tw.imageUrl as string}
              alt={tw.content}
              className='size-full object-cover'
            />
          </Link>
        </div>
      ))}
    </div>
  );
}

export default ImagesCollage;
