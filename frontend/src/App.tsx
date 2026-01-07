import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Dashboard } from './pages/Dashboard';
import { DeliverablesList } from './pages/DeliverablesList';
import { DeliverableView } from './pages/DeliverableView';
import { DeliverableEditor } from './pages/DeliverableEditor';
import { ThemeProvider } from './providers';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/deliverables" element={<DeliverablesList />} />
            <Route path="/deliverables/:slug" element={<DeliverableView />} />
            <Route path="/deliverables/:slug/edit" element={<DeliverableEditor />} />
            <Route path="/deliverables/new" element={<DeliverableEditor />} />
          </Routes>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
