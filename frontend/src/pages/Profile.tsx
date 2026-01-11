import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { authService } from '../services/auth.service';
import ErrorMessage from '../components/common/ErrorMessage';

const Profile: React.FC = () => {
  const { user, updateUser } = useAuthStore();
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    company: user?.company || '',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        company: user.company || '',
      });
    }
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSaving(true);

    try {
      // Don't send email - it cannot be changed
      const { email, ...profileData } = formData;
      const response = await authService.updateProfile(profileData);
      // Response is { message, user }, so extract the user object
      updateUser(response.user || response);
      setSuccess('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Update profile error:', err);
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setSaving(true);

    try {
      await authService.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });
      setSuccess('Password changed successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
      setShowPasswordForm(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      console.error('Change password error:', err);
      setError(err.response?.data?.message || 'Failed to change password');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-secondary-50 py-10 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-heading-lg font-bold text-secondary-900 mb-2">My Profile</h1>
          <p className="text-body-md text-secondary-700">Manage your account information</p>
        </div>

        {error && <ErrorMessage message={error} />}
        {success && (
          <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 p-4 rounded-lg">
            <p className="text-green-700 font-medium text-body-sm">{success}</p>
          </div>
        )}

        {/* Profile Information Card */}
        <div className="bg-white rounded-lg shadow-soft p-6 mb-6 border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-heading-sm font-bold text-secondary-900">Profile Information</h2>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-gradient-primary text-white rounded-lg hover:shadow-soft transition-all text-body-sm"
              >
                Edit Profile
              </button>
            )}
          </div>

          {!isEditing ? (
            <div className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-body-xs text-secondary-700 mb-1">Name</p>
                  <p className="text-body-sm font-semibold text-secondary-900">{user?.name}</p>
                </div>
                <div>
                  <p className="text-body-xs text-secondary-700 mb-1">Email</p>
                  <p className="text-body-sm font-semibold text-secondary-900">{user?.email}</p>
                </div>
                <div>
                  <p className="text-body-xs text-secondary-700 mb-1">Role</p>
                  <span className="inline-block px-2 py-1 bg-secondary-100 text-secondary-800 rounded text-body-xs font-semibold capitalize border border-secondary-300">
                    {user?.role}
                  </span>
                </div>
                <div>
                  <p className="text-body-xs text-secondary-700 mb-1">Phone</p>
                  <p className="text-body-sm font-semibold text-secondary-900">{user?.phone || 'Not provided'}</p>
                </div>
                <div>
                  <p className="text-body-xs text-secondary-700 mb-1">Company</p>
                  <p className="text-body-sm font-semibold text-secondary-900">{user?.company || 'Not provided'}</p>
                </div>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                    required
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg bg-secondary-50 text-secondary-900 text-body-sm"
                    required
                    disabled
                  />
                  <p className="text-body-xs text-secondary-600 mt-1">Email cannot be changed</p>
                </div>

                <div>
                  <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                    disabled={saving}
                  />
                </div>

                <div>
                  <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                    Company
                  </label>
                  <input
                    type="text"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                    disabled={saving}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData({
                      name: user?.name || '',
                      email: user?.email || '',
                      phone: user?.phone || '',
                      company: user?.company || '',
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-900 font-medium rounded-lg hover:bg-secondary-50 transition-all text-body-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-gradient-primary text-white py-2 rounded-lg font-medium hover:shadow-soft transition-all disabled:opacity-50 text-body-sm"
                >
                  {saving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-lg shadow-soft p-6 mt-6 border border-white/30">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-heading-sm font-bold text-secondary-900">Security</h2>
              <p className="text-body-xs text-secondary-700 mt-1">Manage your password</p>
            </div>
            {!showPasswordForm && (
              <button
                onClick={() => setShowPasswordForm(true)}
                className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:shadow-soft transition-all text-body-sm"
              >
                Change Password
              </button>
            )}
          </div>

          {showPasswordForm && (
            <form onSubmit={handlePasswordSubmit} className="space-y-4">
              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  Current Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                  required
                  disabled={saving}
                />
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                  required
                  minLength={6}
                  disabled={saving}
                />
                <p className="text-body-xs text-secondary-600 mt-1">Minimum 6 characters</p>
              </div>

              <div>
                <label className="block text-body-xs font-semibold text-secondary-900 mb-1">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  className="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white text-secondary-900 text-body-sm"
                  required
                  disabled={saving}
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowPasswordForm(false);
                    setPasswordData({
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  className="flex-1 px-4 py-2 border border-secondary-300 text-secondary-900 font-medium rounded-lg hover:bg-secondary-50 transition-all text-body-sm"
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 bg-primary-600 text-white py-2 rounded-lg font-medium hover:shadow-soft transition-all disabled:opacity-50 text-body-sm"
                >
                  {saving ? 'Changing...' : 'Change Password'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

