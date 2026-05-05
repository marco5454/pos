import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import POS from './pages/POS';
import Expenses from './pages/Expenses';
import SalesHistory from './pages/SalesHistory';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';

/**
 * Main App Component
 * Sets up routing and layout structure for the Ice Crumble POS application
 * All routes use the Layout component which includes header and bottom navigation
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          {/* Default route redirects to POS */}
          <Route index element={<Navigate to="/pos" replace />} />
          
          {/* Main application routes */}
          <Route path="pos" element={<POS />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="history" element={<SalesHistory />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="settings" element={<Settings />} />
          
          {/* Catch-all route for 404 */}
          <Route path="*" element={<Navigate to="/pos" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;