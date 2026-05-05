import { Outlet } from 'react-router-dom';
import BottomNav from './BottomNav';

/**
 * Layout Component
 * Main layout wrapper with header and bottom navigation
 * Provides consistent structure across all pages
 */
const Layout = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-primary text-white shadow-md sticky top-0 z-40">
        <div className="max-w-screen-xl mx-auto px-4 py-4">
          <h1 className="text-2xl font-bold text-center">🧊 Ice Crumble POS</h1>
        </div>
      </header>
      
      {/* Main content area with padding for bottom nav */}
      <main className="flex-1 pb-20 overflow-y-auto">
        <div className="max-w-screen-xl mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
      
      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
};

export default Layout;