import React, { useState, useEffect } from 'react';
import { api } from '../lib/api';

const Profile = () => {
  const [user, setUser] = useState({
    username: '',
    email: '',
    avatar: '',
    preferences: {
      theme: 'light',
      notifications: true,
      newsletter: false,
      language: 'en'
    },
    stats: {
      joinedDate: '',
      totalOrders: 0,
      totalSpent: 0,
      reviewsGiven: 0
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/user/profile');
        setUser(response.data);
        setEditForm({
          username: response.data.username,
          email: response.data.email,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (err) {
        setError('Failed to load user profile');
        console.error('Profile data fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditForm(prev => ({
      ...prev,
      username: user.username,
      email: user.email
    }));
  };

  const handlePreferenceChange = async (key) => {
    try {
      const newPreferences = {
        ...user.preferences,
        [key]: !user.preferences[key]
      };
      
      await api.put('/user/preferences', { preferences: newPreferences });
      
      setUser(prev => ({
        ...prev,
        preferences: newPreferences
      }));
      
      setSuccessMessage('Preferences updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update preferences');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    try {
      if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
        setError('New passwords do not match');
        return;
      }

      const response = await api.put('/user/profile', {
        username: editForm.username,
        email: editForm.email,
        currentPassword: editForm.currentPassword,
        newPassword: editForm.newPassword
      });

      setUser(prev => ({
        ...prev,
        username: response.data.username,
        email: response.data.email
      }));

      setIsEditing(false);
      setSuccessMessage('Profile updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
      setTimeout(() => setError(null), 3000);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('avatar', file);

    try {
      const response = await api.post('/user/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setUser(prev => ({
        ...prev,
        avatar: response.data.avatarUrl
      }));

      setSuccessMessage('Avatar updated successfully');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (err) {
      setError('Failed to update avatar');
      setTimeout(() => setError(null), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
          <div className="relative h-32 bg-orange-600">
            <div className="absolute -bottom-12 left-8">
              <div className="relative">
                <img
                  src={user.avatar || 'https://via.placeholder.com/150'}
                  alt={user.username}
                  className="h-24 w-24 rounded-full border-4 border-white object-cover"
                />
                <div className="absolute bottom-0 right-0">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleAvatarUpload}
                    />
                    <div className="bg-orange-500 p-2 rounded-full text-white hover:bg-orange-600">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          </div>
          <div className="pt-16 pb-6 px-8">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{user.username}</h1>
                <p className="text-sm text-gray-500">{user.email}</p>
              </div>
              {!isEditing && (
                <button
                  onClick={handleEdit}
                  className="px-4 py-2 border border-orange-600 text-orange-600 rounded-md hover:bg-orange-50"
                >
                  Edit Profile
                </button>
              )}
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-8 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative">
            <strong className="font-bold">Success!</strong>
            <span className="block sm:inline"> {successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="md:col-span-2">
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Profile Information</h2>
              </div>
              <div className="p-6">
                {isEditing ? (
                  <form onSubmit={handleSave}>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm(prev => ({ ...prev, username: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm(prev => ({ ...prev, email: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Current Password</label>
                        <input
                          type="password"
                          value={editForm.currentPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">New Password</label>
                        <input
                          type="password"
                          value={editForm.newPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, newPassword: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
                        <input
                          type="password"
                          value={editForm.confirmPassword}
                          onChange={(e) => setEditForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-orange-500 focus:ring-orange-500"
                        />
                      </div>
                      <div className="flex justify-end space-x-4">
                        <button
                          type="button"
                          onClick={() => setIsEditing(false)}
                          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-4 py-2 bg-orange-600 text-white rounded-md hover:bg-orange-700"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Username</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.username}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Email</h3>
                      <p className="mt-1 text-sm text-gray-900">{user.email}</p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">Member Since</h3>
                      <p className="mt-1 text-sm text-gray-900">{new Date(user.stats.joinedDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Preferences & Stats */}
          <div className="space-y-8">
            {/* Preferences */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Preferences</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Theme</h3>
                      <p className="text-sm text-gray-500">Choose your preferred theme</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('theme')}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        user.preferences.theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {user.preferences.theme === 'dark' ? 'Dark' : 'Light'}
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Notifications</h3>
                      <p className="text-sm text-gray-500">Receive email notifications</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('notifications')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        user.preferences.notifications ? 'bg-orange-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          user.preferences.notifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Newsletter</h3>
                      <p className="text-sm text-gray-500">Receive marketing emails</p>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('newsletter')}
                      className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                        user.preferences.newsletter ? 'bg-orange-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block w-4 h-4 transform transition-transform bg-white rounded-full ${
                          user.preferences.newsletter ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Stats */}
            <div className="bg-white rounded-lg shadow-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-xl font-semibold text-gray-800">Account Statistics</h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{user.stats.totalOrders}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Total Spent</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">${user.stats.totalSpent.toFixed(2)}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Reviews Given</h3>
                    <p className="mt-1 text-2xl font-semibold text-gray-900">{user.stats.reviewsGiven}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
