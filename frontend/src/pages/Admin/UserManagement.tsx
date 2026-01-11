import React, { useState, useEffect } from 'react';
import adminService from '../../services/admin.service';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import ErrorMessage from '../../components/common/ErrorMessage';

interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'organizer' | 'attendee';
  createdAt: Date;
}

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers(page, 10, searchTerm);
      setUsers(data.users);
      setTotalPages(data.pagination.totalPages);
      setError('');
    } catch (err: any) {
      console.error('Fetch users error:', err);
      setError(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdating(userId);
      await adminService.updateUserRole(userId, { role: newRole as 'admin' | 'organizer' | 'attendee' });
      // Update local state
      setUsers(users.map(u => u._id === userId ? { ...u, role: newRole as 'admin' | 'organizer' | 'attendee' } : u));
      setError('');
    } catch (err: any) {
      console.error('Update role error:', err);
      setError(err.response?.data?.message || 'Failed to update user role');
    } finally {
      setUpdating(null);
    }
  };

  const handleDeactivateUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to deactivate this user?')) {
      return;
    }

    try {
      setUpdating(userId);
      await adminService.deleteUser(userId);
      setUsers(users.filter(u => u._id !== userId));
      setError('');
    } catch (err: any) {
      console.error('Delete user error:', err);
      setError(err.response?.data?.message || 'Failed to deactivate user');
    } finally {
      setUpdating(null);
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading && users.length === 0) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">
            User Management
          </h1>
          <p className="text-body-md text-secondary-600">
            Manage user roles and permissions
          </p>
        </div>

        {error && <ErrorMessage message={error} />}

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              className="w-full px-4 py-2 pl-12 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent shadow-soft text-body-sm"
            />
            <svg
              className="absolute left-4 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white rounded-lg shadow-soft border border-white/30 overflow-hidden">
          {users.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-body-sm text-secondary-700">No users found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="px-4 py-3 text-left text-body-xs font-semibold text-secondary-900">Name</th>
                    <th className="px-4 py-3 text-left text-body-xs font-semibold text-secondary-900">Email</th>
                    <th className="px-4 py-3 text-left text-body-xs font-semibold text-secondary-900">Role</th>
                    <th className="px-4 py-3 text-left text-body-xs font-semibold text-secondary-900">Joined</th>
                    <th className="px-4 py-3 text-left text-body-xs font-semibold text-secondary-900">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 text-body-xs text-secondary-900">{user.name}</td>
                      <td className="px-4 py-3 text-body-xs text-secondary-700">{user.email}</td>
                      <td className="px-4 py-3">
                        <select
                          value={user.role}
                          onChange={(e) => handleRoleChange(user._id, e.target.value)}
                          disabled={updating === user._id}
                          className="px-2 py-1 border border-gray-300 rounded text-body-xs font-medium focus:ring-2 focus:ring-primary-500 focus:border-transparent disabled:opacity-50"
                        >
                          <option value="attendee">Attendee</option>
                          <option value="organizer">Organizer</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td className="px-4 py-3 text-body-xs text-secondary-700">{formatDate(user.createdAt)}</td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleDeactivateUser(user._id)}
                          disabled={updating === user._id}
                          className="px-2 py-1 text-body-xs font-medium text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                        >
                          {updating === user._id ? 'Processing...' : 'Deactivate'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-6 flex justify-center gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded border border-gray-300 text-body-xs font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-body-xs font-medium text-secondary-700">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage(Math.min(totalPages, page + 1))}
              disabled={page === totalPages}
              className="px-3 py-2 rounded border border-gray-300 text-body-xs font-medium disabled:opacity-50 hover:bg-gray-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserManagement;
