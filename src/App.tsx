import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './lib/queryClient';
import { ErrorBoundary } from './components/ErrorBoundary';
import TransportPage from './domains/transport';

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TransportPage />
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
