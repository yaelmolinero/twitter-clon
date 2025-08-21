import { useNavigate, Link, useLocation } from 'react-router';
import { paths } from '@/config/paths.ts';

import ProfileImage from '@/components/ui/ProfileImage.tsx';
import TweetHeader from '@/features/tweets/components/tweetParts/TweetHeader.tsx';
import TweetActions from '@/features/tweets/components/tweetParts/TweetActions.tsx';
import DeletedTweet from '@/features/tweets/components/DeletedTweet.tsx';
import FormatTextContet from '@/components/ui/FormatTextContent.tsx';

import type { TweetType, TweetVariant } from '@/types/tweets.d.ts';

interface Props extends TweetType {
  variant: TweetVariant;
  isStatus?: boolean;
}

function Tweet({ variant, isStatus = false, ...tweetProps }: Props) {
  const navigate = useNavigate();
  const location = useLocation();

  const { deleted } = tweetProps;
  const isFocused = variant === 'focused';
  const isThread = variant === 'thread';
  const isReplying = variant === 'replying';

  if (deleted && (isThread || isStatus)) return <DeletedTweet isStatus={isStatus} />;
  if (deleted) return null;

  const { id: tweetID, user, content, imageUrl, createdAt } = tweetProps;
  const { username } = user;

  function handleClick() {
    if (isFocused || isReplying) return;

    navigate(paths.app.status.getHref(username, tweetID), {
      state: { status: tweetProps }
    });
  }

  return (
    <article
      onClick={handleClick}
      className={`flex gap-2 px-4 py-3 w-full border-borderColor ${(!isFocused && !isReplying) && 'cursor-pointer hover:bg-hoverColor transition-colors duration-200'} ${(!isThread && !isReplying) && 'border-b-1'}`}
    >
      {/* FOTO DE PERFIL */}
      {!isFocused && (
        <div className='shrink-0 grow-0'>
          <ProfileImage user={user} size='size-10' disabled={isReplying} />
          {(isThread || isReplying) && <div className='w-0.5 bg-borderColor h-full mx-auto -z-10'></div>}
        </div>
      )}

      <div className='flex-1 min-w-0'>
        <TweetHeader
          tweetID={tweetID}
          user={user}
          createdAt={createdAt}
          isFocused={isFocused}
          hideOptions={isReplying}
        />

        <FormatTextContet text={content} preWrap />

        {(imageUrl && !isReplying) && (
          <div className='mt-3 rounded-twitterRounded'>
            <Link
              to={paths.app.status.image.getHref(username, tweetID)}
              onClick={((e) => e.stopPropagation())}
              state={{ backgroundLocation: location, status: tweetProps }}
            >
              <img
                src={imageUrl}
                alt='Imagen del tweet'
                loading='lazy'
                className='aspect-square outline-1 outline-borderColor rounded-twitterRounded w-full max-h-[510px] object-cover'
                onLoad={(e) => e.currentTarget.classList.replace('aspect-square', 'aspect-auto')}
              />
            </Link>
          </div>
        )}

        {!isReplying && (
          <TweetActions
            tweet={tweetProps}
            showTimestamp={isFocused}
            timestamp={createdAt}
          />
        )}
      </div>
    </article>
  );
}

export default Tweet;
