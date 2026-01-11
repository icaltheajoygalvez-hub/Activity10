 import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import adminService, { SystemStats } from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStatistics();
  }, []);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStatistics();
      setStats(data);
      setError('');
    } catch (err: any) {
      console.error('Fetch statistics error:', err);
      setError(err.response?.data?.message || 'Failed to load statistics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-body-md text-secondary-600">
            System overview and statistics
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {stats && (
          <>
            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {/* Users Card */}
              <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30 hover:shadow-medium transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-xs text-secondary-600 font-medium mb-1">Total Users</p>
                    <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalUsers}</p>
                    <p className="text-body-xs text-secondary-600 mt-1">Platform members</p>
                  </div>
                  <div className="bg-gradient-primary p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Events Card */}
              <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30 hover:shadow-medium transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-xs text-secondary-600 font-medium mb-1">Total Events</p>
                    <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalEvents}</p>
                    <p className="text-body-xs text-secondary-600 mt-1">Active & past</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-400 to-green-600 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Registrations Card */}
              <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30 hover:shadow-medium transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-xs text-secondary-600 font-medium mb-1">Total Registrations</p>
                    <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalRegistrations}</p>
                    <p className="text-body-xs text-secondary-600 mt-1">Event sign-ups</p>
                  </div>
                  <div className="bg-gradient-to-br from-blue-400 to-blue-600 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Check-ins Card */}
              <div className="bg-white rounded-lg shadow-soft p-4 border border-white/30 hover:shadow-medium transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-body-xs text-secondary-600 font-medium mb-1">Total Check-ins</p>
                    <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalCheckIns}</p>
                    <p className="text-body-xs text-secondary-600 mt-1">Event attendances</p>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-400 to-indigo-600 p-3 rounded-lg">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Users by Role */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-8">
              <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
                <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Users by Role</h2>
                <div className="space-y-3">
                  {stats.usersByRole.map((role) => {
                    const total = stats.overview.totalUsers;
                    const percentage = total > 0 ? ((role.count / total) * 100).toFixed(1) : 0;
                    const colors: any = {
                      admin: 'bg-red-500',
                      organizer: 'bg-blue-500',
                      attendee: 'bg-green-500',
                    };
                    return (
                      <div key={role._id}>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-body-xs font-medium text-secondary-900 capitalize">{role._id}</span>
                          <span className="text-body-xs text-secondary-700">{role.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full bg-secondary-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${colors[role._id] || 'bg-primary-500'}`}
                            style={{ width: `${percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Registration Trend */}
              <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
                <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Registration Trend (Last 7 Days)</h2>
                {stats.registrationsTrend.length > 0 ? (
                  <div className="space-y-2">
                    {stats.registrationsTrend.map((day) => (
                      <div key={day._id} className="flex items-center">
                        <span className="text-body-xs text-secondary-700 w-20">{day._id}</span>
                        <div className="flex-1 ml-2">
                          <div className="bg-gray-200 rounded-full h-4 relative">
                            <div
                              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-4 rounded-full flex items-center justify-end pr-1"
                              style={{ width: `${Math.min((day.count / 10) * 100, 100)}%` }}
                            >
                              <span className="text-body-xs text-white font-semibold">{day.count}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-body-sm text-secondary-700 text-center py-4">No registration data available</p>
                )}
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30 mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-heading-sm font-bold text-secondary-900">Recent Users</h2>
                <Link
                  to="/admin/users"
                  className="text-secondary-700 hover:text-secondary-900 font-semibold text-body-xs"
                >
                  View All →
                </Link>
              </div>
              <div className="space-y-3">
                {stats.recentUsers.map((user) => (
                  <div key={user._id} className="flex items-center justify-between pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                    <div>
                      <p className="text-body-xs font-medium text-secondary-900">{user.name}</p>
                      <p className="text-body-xs text-secondary-600">{user.email}</p>
                    </div>
                    <span className={`px-2 py-1 text-body-xs font-semibold rounded ${
                      user.role === 'admin' ? 'bg-red-100 text-red-800' :
                      user.role === 'organizer' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Events */}
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-heading-sm font-bold text-secondary-900">Upcoming Events</h2>
                <Link
                  to="/events"
                  className="text-secondary-700 hover:text-secondary-900 font-semibold text-body-xs"
                >
                  View All →
                </Link>
              </div>
              {stats.upcomingEvents.length > 0 ? (
                <div className="space-y-3">
                  {stats.upcomingEvents.map((event) => (
                    <div key={event._id} className="border border-gray-200 rounded-lg p-3 hover:shadow-soft transition-shadow">
                      <p className="text-body-xs font-semibold text-secondary-900 mb-1">{event.title}</p>
                      <div className="space-y-1 text-body-xs text-secondary-700">
                        <p>{new Date(event.date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}</p>
                        <p>{event.location}</p>
                        <p className="flex justify-between">
                          <span>{event.registeredCount || 0} registrations</span>
                          <span>{new Date(event.date) < new Date() ? 'Ended' : 'Upcoming'}</span>
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-body-xs text-secondary-700 text-center py-4">No upcoming events</p>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
