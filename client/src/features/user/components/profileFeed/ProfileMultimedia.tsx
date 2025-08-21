import { useParams } from 'react-router';
import { useWindowSize } from '@/contexts/windowSizeContext/useWindowSize.ts';
import TweetsContainer from '@/features/tweets/components/TweetsContainer.tsx';

function ProfileMultimedia() {
  const { username } = useParams();
  const { width } = useWindowSize();
  const isMovil = width <= 600;

  return <TweetsContainer
    variant={isMovil ? 'normal' : 'collage'}
    type='multimediaBy'
    username={username}
    cacheMinutes={5}
  />;
}

export default ProfileMultimedia;