import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useUser } from '@/hooks/useAuth.ts';
import { paths } from '@/config/paths.ts';
import { api } from '@/lib/api-client.ts';

import Tweet from '@/features/tweets/components/Tweet.tsx';
import ProfileImage from '@/components/ui/ProfileImage.tsx';
import FormatTextContet from '@/components/ui/FormatTextContent.tsx';
import { RetweetIcon, LikeIcon, ProfileIcon } from '@/assets/icons';

import type { NotificationType } from '@/types/notifications.d.ts';

function Notification({ id, type, sender, tweet, checked }: NotificationType) {
  const navigate = useNavigate();
  const { session } = useUser();
  const [localCheck, setLocalCheck] = useState(checked);
  const actions = {
    follow: {
      Icon: <ProfileIcon className='size-8 text-twitterBlue' isActive />,
      label: ' te siguió'
    },
    like: {
      Icon: <LikeIcon className='size-8 text-likeHover' isActive />,
      label: ' indicó que le gusta tu post'
    },
    retweet: {
      Icon: <RetweetIcon className='size-8 text-retweetHover' isActive />,
      label: ' reposteó tu post'
    },
  } as const;

  if (type === 'comment') return <Tweet {...tweet} user={sender} variant='normal' />;

  const { Icon, label } = actions[type];
  const { name, username } = sender;

  function handleClick() {
    if (type === 'follow') return navigate(paths.app.profile.getHref(username));
    if (session?.user) navigate(paths.app.status.getHref(session.user.username, tweet.id));
  }

  function handleHover() {
    if (localCheck) return;

    setLocalCheck(true);
    api.post(`notifications/check/${id}`)
      .then(() => console.log('Notificacion marcada como vista'));
  }

  return (
    <article
      className={`w-full flex gap-2 px-4 py-3 border-b-1 border-borderColor cursor-pointer transition-colors duration-200m ${localCheck ? 'hover:bg-hoverColor' : 'bg-twitterBlue/15 hover:bg-twitterBlue/20'}`}
      onClick={handleClick}
      onMouseLeave={handleHover}
    >
      <div>{Icon}</div>

      <div className='space-y-2'>
        <ProfileImage user={sender} size='size-8' />
        <div className='text-primary'>
          <Link
            to={paths.app.profile.getHref(username)}
            onClick={(e) => e.stopPropagation()}
            className='font-bold hover:underline'
            state={{ user: sender }}
          >
            {name}
          </Link>
          <span>{label}</span>
        </div>

        {type !== 'follow' && <FormatTextContet text={tweet.content} preWrap textSecondary />}
      </div>
    </article>
  );
}

export default Notification;
