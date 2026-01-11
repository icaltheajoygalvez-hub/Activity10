import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Navbar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    // Exact match for paths - check more specific paths first
    if (path === '/events/create' && location.pathname === '/events/create') return true;
    if (path === '/admin/dashboard' && location.pathname === '/admin/dashboard') return true;
    if (path === '/scanner' && location.pathname === '/scanner') return true;
    if (path === '/my-events' && location.pathname === '/my-events') return true;
    if (path === '/my-tickets' && location.pathname === '/my-tickets') return true;
    if (path === '/profile' && location.pathname === '/profile') return true;
    if (path === '/events' && location.pathname === '/events') return true;
    return false;
  };

  return (
    <nav className="bg-gradient-primary shadow-large sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/events" className="flex items-center space-x-2">
              <div className="text-2xl">🎫</div>
              <span className="text-2xl font-bold text-white hidden sm:inline">QRentry</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-1">
            <Link
              to="/events"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/events')
                  ? 'bg-primary-700 text-white'
                  : 'text-white hover:bg-primary-700'
              }`}
            >
              Events
            </Link>
            {user?.role === 'attendee' && (
              <Link
                to="/my-tickets"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/my-tickets')
                    ? 'bg-primary-700 text-white'
                    : 'text-white hover:bg-primary-700'
                }`}
              >
                My Tickets
              </Link>
            )}
            {(user?.role === 'admin' || user?.role === 'organizer') && (
              <>
                <Link
                  to="/my-events"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/my-events')
                      ? 'bg-primary-700 text-white'
                      : 'text-white hover:bg-primary-700'
                  }`}
                >
                  My Events
                </Link>
                <Link
                  to="/events/create"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/events/create')
                      ? 'bg-primary-700 text-white'
                      : 'text-white hover:bg-primary-700'
                  }`}
                >
                  Create Event
                </Link>
                <Link
                  to="/scanner"
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive('/scanner')
                      ? 'bg-primary-700 text-white'
                      : 'text-white hover:bg-primary-700'
                  }`}
                >
                  Scanner
                </Link>
              </>
            )}
            {user?.role === 'admin' && (
              <Link
                to="/admin/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/admin/dashboard')
                    ? 'bg-primary-700 text-white'
                    : 'text-white hover:bg-primary-700'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* User Menu */}
          <div className="flex items-center space-x-4">
            <span className="text-white text-sm hidden sm:inline">
              {user?.name} <span className="text-primary-200">({user?.role})</span>
            </span>
            <Link
              to="/profile"
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/profile')
                  ? 'bg-primary-700 text-white'
                  : 'text-white hover:bg-primary-700'
              }`}
            >
              Profile
            </Link>
            <button
              onClick={handleLogout}
              className="text-white hover:bg-primary-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
