import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

const Analytics: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await adminService.getStatistics();
      setStats(data);
      setError('');
    } catch (err: any) {
      console.error('Fetch analytics error:', err);
      setError(err.response?.data?.message || 'Failed to load analytics');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner />;

  if (!stats) return <ErrorMessage message={error || 'No data available'} />;

  const COLORS = ['#4F46E5', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

  const userRoleData = stats.usersByRole.map((role: any) => ({
    name: role._id.charAt(0).toUpperCase() + role._id.slice(1),
    value: role.count,
  }));

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">
            Analytics & Reports
          </h1>
          <p className="text-body-md text-secondary-600">
            Detailed analytics and performance metrics
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Registration Trend */}
          <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
            <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Registration Trend (7 Days)</h2>
            {stats.registrationsTrend && stats.registrationsTrend.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <LineChart data={stats.registrationsTrend}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="_id" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="#9333ea"
                    strokeWidth={2}
                    dot={{ fill: '#9333ea' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-body-xs text-secondary-700">No trend data available</p>
            )}
          </div>

          {/* User Distribution by Role */}
          <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
            <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Users by Role</h2>
            {userRoleData.length > 0 ? (
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={userRoleData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, value }) => `${name}: ${value}`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {userRoleData.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-body-xs text-secondary-700">No user data available</p>
            )}
          </div>

          {/* System Overview */}
          <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30 lg:col-span-2">
            <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">System Overview</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-primary-50 rounded-lg border border-white/30">
                <p className="text-body-xs text-secondary-700 mb-1">Total Users</p>
                <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalUsers}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg border border-white/30">
                <p className="text-body-xs text-secondary-700 mb-1">Total Events</p>
                <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalEvents}</p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg border border-white/30">
                <p className="text-body-xs text-secondary-700 mb-1">Total Registrations</p>
                <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalRegistrations}</p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg border border-white/30">
                <p className="text-body-xs text-secondary-700 mb-1">Total Check-ins</p>
                <p className="text-heading-md font-bold text-secondary-900">{stats.overview.totalCheckIns}</p>
              </div>
            </div>
          </div>

          {/* Recent Users */}
          {stats.recentUsers && stats.recentUsers.length > 0 && (
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Recent Users</h2>
              <div className="space-y-2">
                {stats.recentUsers.slice(0, 5).map((user: any) => (
                  <div key={user._id} className="flex items-center justify-between p-2 border border-gray-200 rounded">
                    <div className="flex-1">
                      <p className="text-body-xs font-medium text-secondary-900">{user.name}</p>
                      <p className="text-body-xs text-secondary-700">{user.email}</p>
                    </div>
                    <span className="px-2 py-1 rounded text-xs font-semibold bg-indigo-100 text-indigo-800 ml-2 whitespace-nowrap">
                      {user.role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Upcoming Events */}
          {stats.upcomingEvents && stats.upcomingEvents.length > 0 && (
            <div className="bg-white rounded-lg shadow-soft p-5 border border-white/30">
              <h2 className="text-heading-sm font-bold text-secondary-900 mb-4">Upcoming Events</h2>
              <div className="space-y-2">
                {stats.upcomingEvents.slice(0, 5).map((event: any) => {
                  const registrationRate = event.capacity > 0
                    ? ((event.registeredCount / event.capacity) * 100).toFixed(0)
                    : '0';
                  return (
                    <div key={event._id} className="p-3 border border-gray-200 rounded">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          <p className="text-body-xs font-medium text-secondary-900">{event.title}</p>
                          <p className="text-body-xs text-secondary-700">{event.location}</p>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div
                          className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 rounded-full"
                          style={{ width: `${Math.min(100, parseInt(registrationRate))}%` }}
                        />
                      </div>
                      <p className="text-body-xs text-secondary-700">
                        {event.registeredCount} / {event.capacity} registered ({registrationRate}%)
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Analytics;
