import { useState } from 'react';
import { Outlet, Link } from 'react-router-dom';
import { Menu, X, Plus } from 'lucide-react';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { Button } from './ui/Button';

export default function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background transition-colors duration-200">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="lg:pl-64">
        <Navbar onMenuClick={() => setSidebarOpen(true)} />

        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile FAB */}
      <Link to="/create" className="fixed bottom-6 right-6 lg:hidden">
        <Button size="icon" className="h-14 w-14 rounded-full shadow-lg">
          <Plus className="w-6 h-6" />
        </Button>
      </Link>
    </div>
  );
}
