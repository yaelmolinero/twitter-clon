import { useState, useEffect, createContext } from 'react';

export const WindowSizeContext = createContext({
  width: window.innerWidth,
  height: window.innerHeight
});

function WindowSizeProvider({ children }: { children: React.ReactNode }) {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });

  useEffect(() => {
    function handleResize() {
      setSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return <WindowSizeContext.Provider value={size}>
    {children}
  </WindowSizeContext.Provider>;
}

export default WindowSizeProvider;
