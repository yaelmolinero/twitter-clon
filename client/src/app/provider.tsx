import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import WindowSizeProvider from '@/contexts/windowSizeContext/WindowSizeContext.tsx';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      retry: false,
    }
  }
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <WindowSizeProvider>
        {children}
      </WindowSizeProvider>
    </QueryClientProvider>
  );
}
