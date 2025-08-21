import { useContext } from 'react';
import { WindowSizeContext } from '@/contexts/windowSizeContext/WindowSizeContext.tsx';

export function useWindowSize() {
  const context = useContext(WindowSizeContext);
  if (!context) throw new Error('useWindowSize must be used whitin an WindowSizeContext');

  return context;
}
