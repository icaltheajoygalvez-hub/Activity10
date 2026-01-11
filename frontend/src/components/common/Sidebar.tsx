import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import {
  DiscoverIcon,
  CalendarIcon,
  CreateIcon,
  TicketsIcon,
  ScannerIcon,
  DashboardIcon,
  AnalyticsIcon,
  UsersIcon,
  LogoutIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
} from '../icons/IconSystem';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    // Exact match only - check more specific paths first to avoid partial matches
    if (path === '/events/create' && location.pathname === '/events/create') return true;
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (path === '/scanner' && location.pathname === '/scanner') return true;
    if (path === '/my-events' && location.pathname === '/my-events') return true;
    if (path === '/my-tickets' && location.pathname === '/my-tickets') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path === '/events' && location.pathname === '/events') return true;
    return false;
  };

  const NavLink: React.FC<{
    to: string;
    icon: React.ReactNode;
    label: string;
  }> = ({ to, icon, label }) => (
    <Link
      to={to}
      className={`flex items-center space-x-3 px-4 py-2.5 rounded-lg transition-all duration-200 group relative ${
        isActive(to)
          ? 'bg-primary-600 text-white shadow-elevation'
          : 'text-secondary-600 hover:text-secondary-900 hover:bg-primary-50'
      }`}
    >
      <span className={`flex-shrink-0 transition-colors ${
        isActive(to) ? 'text-white' : 'text-secondary-500 group-hover:text-primary-600'
      }`}>
        {icon}
      </span>
      <span className={`text-sm font-medium truncate ${isOpen ? 'block' : 'hidden'}`}>{label}</span>
    </Link>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 lg:hidden z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen bg-gradient-sidebar border-r border-primary-100 transition-all duration-300 z-40 shadow-soft flex flex-col ${
          isOpen ? 'w-280px' : 'w-sidebar-width-collapsed'
        }`}
      >
        {/* Logo Section */}
        <div className="border-b border-primary-200 px-4 py-6">
          <Link to="/events" className="flex items-center space-x-3 group">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center text-white font-bold shadow-elevation group-hover:shadow-card transition-shadow">
              QR
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="font-bold text-secondary-900 text-base leading-tight">QRentry</div>
                <div className="text-xs text-secondary-500 font-medium">Pro</div>
              </div>
            )}
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto scrollbar-thin scrollbar-thumb-primary-200 scrollbar-track-transparent">
          {/* Main Navigation */}
          <div className="space-y-1">
            {isOpen && <div className="text-xs font-label text-secondary-500 uppercase tracking-wider px-4 mb-4 mt-2">Navigation</div>}
            <NavLink to="/events" icon={<DiscoverIcon className="w-5 h-5" />} label="Discover" />
            
            {user?.role === 'attendee' && (
              <NavLink to="/my-tickets" icon={<TicketsIcon className="w-5 h-5" />} label="My Tickets" />
            )}

            {(user?.role === 'organizer' || user?.role === 'admin') && (
              <>
                <NavLink to="/my-events" icon={<CalendarIcon className="w-5 h-5" />} label="My Events" />
                <NavLink to="/events/create" icon={<CreateIcon className="w-5 h-5" />} label="Create Event" />
              </>
            )}

            {user?.role === 'organizer' && (
              <NavLink to="/scanner" icon={<ScannerIcon className="w-5 h-5" />} label="Check-in" />
            )}
          </div>

          {/* Admin Section */}
          {user?.role === 'admin' && (
            <div className="pt-6 border-t border-primary-200">
              {isOpen && <div className="text-xs font-label text-secondary-500 uppercase tracking-wider px-4 mb-4">Admin</div>}
              <NavLink to="/admin/dashboard" icon={<DashboardIcon className="w-5 h-5" />} label="Dashboard" />
              <NavLink to="/admin/analytics" icon={<AnalyticsIcon className="w-5 h-5" />} label="Analytics" />
              <NavLink to="/admin/users" icon={<UsersIcon className="w-5 h-5" />} label="Users" />
            </div>
          )}
        </nav>

        {/* User Section */}
        <div className="border-t border-primary-200 bg-primary-50 bg-opacity-50 p-4 space-y-3">
          <Link
            to="/profile"
            className="flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-primary-100 transition-colors group"
          >
            <div className="w-9 h-9 bg-gradient-primary rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            {isOpen && (
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-secondary-900 truncate">{user?.name}</div>
                <div className="text-xs text-secondary-500 truncate capitalize">{user?.role}</div>
              </div>
            )}
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-secondary-600 hover:text-red-600 hover:bg-red-50 transition-colors font-medium text-sm group"
          >
            <LogoutIcon className="w-5 h-5 flex-shrink-0 text-secondary-500 group-hover:text-red-600" />
            {isOpen && <span>Logout</span>}
          </button>
        </div>

        {/* Toggle Button */}
        <div className="border-t border-primary-200 px-3 py-3">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="w-full flex items-center justify-center p-2 rounded-lg hover:bg-primary-100 text-secondary-500 hover:text-primary-700 transition-colors"
            title={isOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {isOpen ? <ChevronLeftIcon className="w-5 h-5" /> : <ChevronRightIcon className="w-5 h-5" />}
          </button>
        </div>
      </aside>

      {/* Main Content Offset */}
      <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-sidebar-width' : 'lg:ml-sidebar-width-collapsed'}`} />
    </>
  );
};

export default Sidebar;
