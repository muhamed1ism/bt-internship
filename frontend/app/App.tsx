import { QueryClientProvider } from '@tanstack/react-query';
import AuthProvider from './context/AuthContext';
import Root from './routes/root';
import { queryClient } from './utils/query-client';

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Root />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
