import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/authStore';
import { UserRole } from './types/user.types';
import { ToastProvider } from './contexts/ToastContext';

// Auth Pages
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

// Event Pages
import EventList from './pages/Events/EventList';
import EventDetails from './pages/Events/EventDetails';
import CreateEvent from './pages/Events/CreateEvent';
import EditEvent from './pages/Events/EditEvent';
import ViewAttendees from './pages/Events/ViewAttendees';
import MyEvents from './pages/Events/MyEvents';

// Registration Pages
import RegisterForEvent from './pages/Registrations/RegisterForEvent';
import MyTickets from './pages/Registrations/MyTickets';
import TicketDetails from './pages/Registrations/TicketDetails';

// Check-in Pages
import Scanner from './pages/CheckIn/Scanner';
import CheckInHistory from './pages/CheckIn/CheckInHistory';

// Admin Pages
import Dashboard from './pages/Admin/Dashboard';
import UserManagement from './pages/Admin/UserManagement';
import Analytics from './pages/Admin/Analytics';

// Components
import ProtectedRoute from './routes/ProtectedRoute';
import RoleBasedRoute from './routes/RoleBasedRoute';
import Sidebar from './components/common/Sidebar';

function App() {
  const { isAuthenticated } = useAuthStore();

  return (
    <ToastProvider>
      <Router>
        <div className={`min-h-screen bg-secondary-50 ${isAuthenticated ? 'lg:ml-sidebar-width' : ''}`}>
          {isAuthenticated && <Sidebar />}
          
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/profile" element={<Profile />} />
              
              {/* Event Routes */}
              <Route path="/events" element={<EventList />} />
              <Route path="/events/:id" element={<EventDetails />} />
              
              {/* Registration Routes */}
              <Route path="/events/:id/register" element={<RegisterForEvent />} />
              <Route path="/my-tickets" element={<MyTickets />} />
              <Route path="/tickets/:id" element={<TicketDetails />} />
              
              {/* Organizer Routes */}
              <Route element={<RoleBasedRoute allowedRoles={[UserRole.ADMIN, UserRole.ORGANIZER]} />}>
                <Route path="/my-events" element={<MyEvents />} />
                <Route path="/events/create" element={<CreateEvent />} />
                <Route path="/events/:id/edit" element={<EditEvent />} />
                <Route path="/events/:id/attendees" element={<ViewAttendees />} />
                <Route path="/check-in/scanner" element={<Scanner />} />
                <Route path="/scanner" element={<Scanner />} />
                <Route path="/check-in/history/:eventId" element={<CheckInHistory />} />
              </Route>
              
              {/* Admin Routes */}
              <Route element={<RoleBasedRoute allowedRoles={[UserRole.ADMIN]} />}>
                <Route path="/admin/dashboard" element={<Dashboard />} />
                <Route path="/admin/users" element={<UserManagement />} />
                <Route path="/admin/analytics" element={<Analytics />} />
              </Route>
            </Route>
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/events" replace />} />
            <Route path="*" element={<Navigate to="/events" replace />} />
          </Routes>
        </div>
      </Router>
    </ToastProvider>
  );
}

export default App;
