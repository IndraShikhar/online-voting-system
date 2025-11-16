import { useEffect, useState } from 'react';
import { User, Mail, Calendar, Edit3, Save, X, CheckCircle } from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import authService from '../../services/authService';
import voterService from '../../services/voterService';

const VoterProfile = () => {
  const { user, login } = useAuth();
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authService.getProfile();
      const userData = data.user;
      setProfile({
        name: userData.name || '',
        email: userData.email || '',
        username: userData.username || ''
      });
    } catch (error) {
      console.error('Failed to load profile:', error);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');

    try {
      const { data } = await voterService.updateProfile(profile);

      // Update auth context with new data
      const updatedUser = { ...user, name: data.user.name };
      login(updatedUser);

      setMessage('Profile updated successfully!');
      setIsEditing(false);

      // Clear message after 3 seconds
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update profile:', error);
      setError(error.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
    setMessage('');
    // Reset form to original values
    loadProfile();
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-48 mb-8"></div>
            <div className="bg-neutral-700 rounded-xl h-96"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-neutral-400">
            Manage your account information and preferences
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="mb-6 p-4 bg-green-800/20 border border-green-700 rounded-lg flex items-center">
            <CheckCircle className="w-5 h-5 text-green-400 mr-3" />
            <span className="text-green-400">{message}</span>
          </div>
        )}

        {error && (
          <div className="mb-6 p-4 bg-red-800/20 border border-red-700 rounded-lg">
            <span className="text-red-400">{error}</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700">
          {/* Card Header */}
          <div className="p-6 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                {/* {candidate.avatar_url ?
                  (<div>
                    <img src={candidate.avatar_url} alt={candidate.name} className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0" />
                  </div>)
                  : */}
                (<div className="w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shrink-0">
                  <User className="w-8 h-8 text-white" />
                </div>)
                {/* } */}
                <div>
                  <h2 className="text-xl font-semibold text-white">{profile.name || 'Voter'}</h2>
                  <p className="text-neutral-400">@{profile.username}</p>
                </div>
              </div>

              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </button>
              ) : (
                <div className="flex space-x-2">
                  <button
                    onClick={handleCancel}
                    className="flex items-center px-4 py-2 bg-neutral-600 hover:bg-neutral-700 text-white rounded-lg transition-colors"
                    disabled={saving}
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                    disabled={saving}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    {saving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-6">
            <div className="space-y-6">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center px-4 py-3 bg-neutral-700 rounded-lg">
                    <User className="w-5 h-5 text-neutral-400 mr-3" />
                    <span className="text-white">{profile.name || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Username
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={profile.username}
                    onChange={(e) => handleChange('username', e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your username"
                  />
                ) : (
                  <div className="flex items-center px-4 py-3 bg-neutral-700 rounded-lg">
                    <span className="text-neutral-400 mr-3">@</span>
                    <span className="text-white">{profile.username || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter your email address"
                  />
                ) : (
                  <div className="flex items-center px-4 py-3 bg-neutral-700 rounded-lg">
                    <Mail className="w-5 h-5 text-neutral-400 mr-3" />
                    <span className="text-white">{profile.email || 'Not provided'}</span>
                  </div>
                )}
              </div>

              {/* Role */}
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-2">
                  Role
                </label>
                <div className="flex items-center px-4 py-3 bg-neutral-700 rounded-lg">
                  <Calendar className="w-5 h-5 text-neutral-400 mr-3" />
                  <span className="text-white capitalize">{user?.role || 'voter'}</span>
                  <span className="ml-auto px-3 py-1 bg-blue-800 text-blue-300 rounded-full text-xs font-medium">
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Information */}
        <div className="mt-8 bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="text-sm text-neutral-400 mb-1">User ID</div>
              <div className="text-white font-mono text-sm">{user?.id || 'N/A'}</div>
            </div>
            <div>
              <div className="text-sm text-neutral-400 mb-1">Account Type</div>
              <div className="text-white">Voter Account</div>
            </div>
          </div>
        </div>

        {/* Security Note */}
        <div className="mt-8 p-4 bg-yellow-900/20 border border-yellow-700 rounded-lg">
          <h4 className="text-yellow-400 font-medium mb-2">Security Notice</h4>
          <p className="text-yellow-200 text-sm">
            To change your password or update security settings, please contact the system administrator.
          </p>
        </div>
      </div>
    </div>
  );
};

export default VoterProfile;