import { Link, useLocation } from 'react-router-dom';

/**
 * BottomNav Component
 * Mobile-first bottom navigation bar for main app sections
 * Uses locked color palette and Verdana font
 */
const BottomNav = () => {
  const location = useLocation();
  
  // Navigation items configuration
  const navItems = [
    {
      path: '/pos',
      label: 'POS',
      icon: '🛒',
    },
    {
      path: '/expenses',
      label: 'Expenses',
      icon: '💰',
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: '📊',
    },
    {
      path: '/settings',
      label: 'Settings',
      icon: '⚙️',
    },
  ];
  
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-accent shadow-lg z-50">
      <div className="flex justify-around items-center h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive
                  ? 'text-primary border-t-2 border-primary'
                  : 'text-gray-600 hover:text-primary'
              }`}
            >
              <span className="text-2xl mb-1">{item.icon}</span>
              <span className="text-xs font-semibold">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;