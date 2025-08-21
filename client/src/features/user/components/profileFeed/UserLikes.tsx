import { useParams } from 'react-router';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';

function UserLikes() {
  const { username } = useParams();

  return <TweetsContainer type='likedByUser' username={username} cacheMinutes={5} />;
}

export default UserLikes;
