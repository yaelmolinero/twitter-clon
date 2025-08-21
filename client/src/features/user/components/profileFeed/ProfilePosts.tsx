import { useParams } from 'react-router';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';

function ProfilePosts() {
  const { username } = useParams();

  return <TweetsContainer type='postedBy' username={username} cacheMinutes={5} />;
}

export default ProfilePosts;
