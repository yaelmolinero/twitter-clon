import { useInteractionTweet } from '@/features/tweets/api/post-interaction.ts';
import { formatFullDate, formatNumber } from '@/utils/format.ts';

import Divisor from '@/components/ui/Divisor.tsx';
import { CommentIcon, RetweetIcon, LikeIcon, BookmarkIcon } from '@/assets/icons';

import type { TweetType } from '@/types/tweets.d.ts';

interface TweetStats {
  tweet: TweetType;
  primary?: boolean;
}

interface PropsWithTimestamp extends TweetStats {
  showTimestamp: true;
  timestamp: string
}

interface PropsWithoutTimestamp extends TweetStats {
  showTimestamp?: false;
  timestamp?: string;
}

function TweetActions({ tweet, showTimestamp = false, timestamp, primary = false }: PropsWithTimestamp | PropsWithoutTimestamp) {
  const { handleClick, handleReplyBtn } = useInteractionTweet(tweet);

  const { userMeta, likes, retweets, comments } = tweet;
  const { likedByUser, retweetedByUser, bookmarkedByUser } = userMeta;

  return (
    <>
      {showTimestamp && (
        <div className='my-3'>
          <span className='text-secondary'>{formatFullDate(timestamp as string)}</span>
        </div>
      )}
      {showTimestamp && <Divisor />}

      <div className={`flex items-center justify-between *:text-xs **:cursor-pointer ${primary ? '*:text-white' : '*:text-secondary mt-3'}`}>
        <div className="group hover:text-commentHover transition-colors duration-200">
          <button className='flex items-center gap-1' onClick={handleReplyBtn}>
            <div className='inline-flex relative'>
              <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-commentHover/10 transition-colors duration-200'></div>
              <CommentIcon className='size-5 fill-inherit' />
            </div>
            <span>{formatNumber(comments)}</span>
          </button>
        </div>

        <div className="group hover:text-retweetHover transition-colors duration-200">
          <button className='flex items-center gap-1' onClick={(e) => handleClick(e, 'retweets')}>
            <div className='inline-flex relative'>
              <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-retweetHover/10 transition-colors duration-200'></div>
              <RetweetIcon className={`size-5 ${retweetedByUser ? 'text-retweetHover' : 'fill-inherit'}`} isActive={retweetedByUser} />
            </div>
            <span className={retweetedByUser ? 'text-retweetHover' : ''}>{formatNumber(retweets)}</span>
          </button>
        </div>

        <div className="group hover:text-likeHover transition-colors duration-200">
          <button className='flex items-center gap-1' onClick={(e) => handleClick(e, 'likes')}>
            <div className='inline-flex relative'>
              <div className='absolute inset-0.5 -m-[50%] -z-10 rounded-full group-hover:bg-likeHover/10 transition-colors duration-200'></div>
              <LikeIcon className={`size-5 ${likedByUser ? 'text-likeHover' : 'fill-inherit'}`} isActive={likedByUser} />
            </div>
            <span className={likedByUser ? 'text-likeHover' : ''}>{formatNumber(likes)}</span>
          </button>
        </div>

        <div className="hover:text-commentHover transition-colors duration-200">
          <button onClick={(e) => handleClick(e, 'bookmarks')}>
            <BookmarkIcon className={`size-5 ${bookmarkedByUser ? 'text-commentHover' : 'fill-inherit'}`} isActive={bookmarkedByUser} />
          </button>
        </div>
      </div>
    </>
  );
}

export default TweetActions;
