import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Toaster } from 'sonner';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AppProvider } from '@/context/AppContext';
import Layout from '@/components/Layout';
import Dashboard from '@/pages/Dashboard';
import CreateTicket from '@/pages/CreateTicket';
import Customers from '@/pages/Customers';
import Reports from '@/pages/Reports';
import Settings from '@/pages/Settings';
import TicketDetail from '@/pages/TicketDetail';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="crm-theme">
      <AppProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<Dashboard />} />
              <Route path="create" element={<CreateTicket />} />
              <Route path="customers" element={<Customers />} />
              <Route path="reports" element={<Reports />} />
              <Route path="settings" element={<Settings />} />
              <Route path="tickets/:id" element={<TicketDetail />} />
            </Route>
          </Routes>
          <Toaster position="top-right" richColors closeButton />
        </BrowserRouter>
      </AppProvider>
    </ThemeProvider>
  );
}

export default App;
