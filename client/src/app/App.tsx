import { BrowserRouter } from 'react-router';
import { AppRouter } from '@/app/router.tsx';
import { AppProvider } from '@/app/provider.tsx';
import { ErrorBoundary } from 'react-error-boundary';
import AppError from '@/components/errors/AppError.tsx';

function App() {
  return (
    <ErrorBoundary fallback={<AppError />}>
      <AppProvider>
        <BrowserRouter>
          <AppRouter />
        </BrowserRouter>
      </AppProvider>
    </ErrorBoundary>
  );
}

export default App;
