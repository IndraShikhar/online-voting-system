// // src/pages/admin/AdminProfile.jsx

// import { Link } from "react-router-dom";

// export default function AdminProfile() {
//   return (
//     <div className="max-w-3xl text-black bg-white p-8 rounded-lg shadow m-5">
//       <h2 className="text-2xl font-semibold mb-8">Admin Profile</h2>

//       <div className="flex flex-col md:flex-row items-start md:items-center gap-10">

//         {/* LEFT SIDE — DETAILS */}
//         <div className="flex-1 space-y-3 text-sm">
//           <p className="text-lg font-medium">Personal Information</p>

//           <div className="space-y-1">
//             <p>
//               <strong>Name:</strong> Admin User
//             </p>
//             <p>
//               <strong>Email:</strong> admin@example.com
//             </p>
//             <p>
//               <strong>Role:</strong> Super Admin
//             </p>
//           </div>

//           <Link to="/admin/profile/edit" className="mt-4 px-4 py-2 bg-[#FCA311] rounded-lg font-semibold text-black">
//             Edit Profile
//           </Link>
//         </div>

//         {/* RIGHT SIDE — PHOTO */}
//         <div className="w-40 h-40 rounded-full overflow-hidden border">
//           <img
//             src="https://via.placeholder.com/150"
//             alt="Admin"
//             className="w-full h-full object-cover"
//           />
//         </div>
//       </div>
//     </div>
//   );
// }

// VoterProfile.jsx   (pure JavaScript – keep the file as .jsx)
import { useEffect, useState, useRef } from 'react';
import {
  User, Mail, Calendar, Edit3, Save, X, CheckCircle, Pencil, Shield, Key
} from 'lucide-react';
import { useAuth } from '../../auth/AuthContext';
import authService from '../../services/authService';
import voterService from '../../services/voterService';
import axios from '../../api/api.js';               // <-- your axios instance

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import toast, { ToastIcon } from 'react-hot-toast';

const AdminProfile = () => {
  const { user, login } = useAuth();
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    username: '',
    avatar_url: '',
  });
  const [originalProfile, setOriginalProfile] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // ---- image upload states ----
  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  /* --------------------------------------------------------------------- */
  /*  Load profile                                                         */
  /* --------------------------------------------------------------------- */
  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    setLoading(true);
    try {
      const { data } = await authService.getProfile();
      const userData = data.user;
      const profileData = {
        name: userData.name || '',
        email: userData.email || '',
        username: userData.username || '',
        avatar_url: userData.avatar_url || '',
      };
      toast.success('Profile loaded successfully');
      setProfile(profileData);
      setOriginalProfile(profileData);
    } catch (err) {
      console.error('Failed to load profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  /* --------------------------------------------------------------------- */
  /*  Save name / email / username                                         */
  /* --------------------------------------------------------------------- */
  const handleSave = async () => {
    setSaving(true);
    setError('');
    setMessage('');
    toast.success('Saving profile...');
    try {
      const { data } = await voterService.updateProfile(profile);
      const updatedUser = { ...user, name: data.user.name };
      login(updatedUser);

      setOriginalProfile(profile);
      setMessage('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setProfile(originalProfile);
    toast.success('Edits canceled');
    setIsEditing(false);
    setError('');
    setMessage('');
  };

  const handleChange = (field, value) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  /* --------------------------------------------------------------------- */
  /*  PROFILE PICTURE UPLOAD – MATCHES YOUR BACKEND                        */
  /* --------------------------------------------------------------------- */

  const openFilePicker = () => fileInputRef.current?.click();

  const handleFileSelect = file => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setError('Please select a valid image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Image must be smaller than 5 MB');
      return;
    }
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setError('');
  };

  const uploadAvatar = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setError('');
    setMessage('');

    const form = new FormData();
    // ---- these fields are read by your controller ----
    form.append('avatar', selectedFile);      // <-- Multer field name
    if (profile.name) form.append('name', profile.name);
    if (profile.email) form.append('email', profile.email);
    // (username is not editable on your route – you can add it if you want)

    try {
      // ---- YOUR EXACT ROUTE ----
      const { data } = await axios.put('/users/profile', form, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      console.log(data);

      // ---- your API returns: data.user.avatar_url ----
      const newAvatarUrl = data.data.user.avatar_url;

      const updated = { ...profile, avatar_url: newAvatarUrl };
      setProfile(updated);
      setOriginalProfile(updated);
      login({ ...user, avatar_url: newAvatarUrl });

      setMessage('Profile picture updated!');
      setTimeout(() => setMessage(''), 3000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to upload image');
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleChangePicture = () => {
    if (selectedFile) uploadAvatar();
    else openFilePicker();
  };

  /* --------------------------------------------------------------------- */
  /*  Render                                                               */
  /* --------------------------------------------------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-900 via-neutral-900 to-slate-900 p-6">
        <div className="max-w-3xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-neutral-700 rounded w-64"></div>
            <div className="bg-neutral-800 rounded-2xl h-96 border border-neutral-700"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-900 via-neutral-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Header */}
        <div className="text-left">
          <h1 className="text-4xl font-bold text-white mb-2">Profile Settings</h1>
          <p className="text-neutral-400">Manage your voter account and personal information</p>
        </div>

        {/* Messages */}
        {message && (
          <Alert className="bg-green-900/20 border-green-700 text-green-400">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>{message}</AlertDescription>
          </Alert>
        )}
        {error && (
          <Alert className="bg-red-900/20 border-red-700 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Profile Card */}
        <Card className="bg-neutral-800/50 backdrop-blur border-neutral-700 shadow-2xl">
          <CardHeader className="border-b border-neutral-700 pb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                {/* AVATAR WITH PREVIEW + EDIT */}
                <div className="relative group">
                  <Avatar className="h-20 w-20 ring-4 ring-neutral-700 shadow-xl">
                    <AvatarImage src={previewUrl || profile.avatar_url} alt={profile.name} />
                    <AvatarFallback className="bg-linear-to-br from-blue-500 to-purple-600 text-white text-xl font-bold">
                      {profile.name?.[0]?.toUpperCase() || <User className="h-8 w-8" />}
                    </AvatarFallback>
                  </Avatar>

                  <button
                    onClick={handleChangePicture}
                    disabled={uploading}
                    className={`
                      absolute inset-0 flex items-center justify-center rounded-full
                      bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-200
                      ${uploading ? 'cursor-not-allowed' : ''}
                    `}
                    title={selectedFile ? 'Upload image' : 'Change profile picture'}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
                    ) : selectedFile ? (
                      <Save className="h-5 w-5 text-white" />
                    ) : (
                      <Pencil className="h-5 w-5 text-white" />
                    )}
                  </button>

                  {previewUrl && !uploading && (
                    <button
                      onClick={e => {
                        e.stopPropagation();
                        setSelectedFile(null);
                        setPreviewUrl(null);
                      }}
                      className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      title="Discard"
                    >
                      <X className="h-3 w-3 text-white" />
                    </button>
                  )}
                </div>

                <div>
                  <CardTitle className="text-2xl text-white">{profile.name || 'Voter'}</CardTitle>
                  <CardDescription className="text-neutral-400 flex items-center gap-1">
                    @{profile.username}
                    <Badge variant="secondary" className="ml-2 text-xs bg-blue-900 text-blue-300">
                      Verified
                    </Badge>
                  </CardDescription>
                </div>
              </div>

              {/* Edit / Save buttons */}
              <div className="flex gap-2">
                {isEditing ? (
                  <>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleCancel}
                      disabled={saving}
                      className="border-neutral-600 text-neutral-300 hover:bg-neutral-700"
                    >
                      <X className="h-4 w-4 mr-1" />
                      Cancel
                    </Button>
                    <Button
                      size="sm"
                      onClick={handleSave}
                      disabled={saving}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Save className="h-4 w-4 mr-1" />
                      {saving ? 'Saving...' : 'Save'}
                    </Button>
                  </>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => setIsEditing(true)}
                    className="bg-blue-600 hover:bg-blue-700"
                  >
                    <Edit3 className="h-4 w-4 mr-1" />
                    Edit Profile
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6 space-y-6">
            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-neutral-300">Full Name</Label>
              {isEditing ? (
                <Input
                  id="name"
                  value={profile.name}
                  onChange={e => handleChange('name', e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-blue-500"
                  placeholder="Enter your full name"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-700 rounded-lg">
                  <User className="h-5 w-5 text-neutral-400" />
                  <span className="text-white">{profile.name || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Username – not editable on your route */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Username</Label>
              <div className="flex items-center gap-3 px-4 py-3 bg-neutral-700 rounded-lg">
                <span className="text-neutral-400">@</span>
                <span className="text-white">{profile.username || 'Not provided'}</span>
              </div>
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-neutral-300">Email Address</Label>
              {isEditing ? (
                <Input
                  id="email"
                  type="email"
                  value={profile.email}
                  onChange={e => handleChange('email', e.target.value)}
                  className="bg-neutral-700 border-neutral-600 text-white placeholder-neutral-400 focus:ring-blue-500"
                  placeholder="Enter your email"
                />
              ) : (
                <div className="flex items-center gap-3 px-4 py-3 bg-neutral-700 rounded-lg">
                  <Mail className="h-5 w-5 text-neutral-400" />
                  <span className="text-white">{profile.email || 'Not provided'}</span>
                </div>
              )}
            </div>

            {/* Role */}
            <div className="space-y-2">
              <Label className="text-neutral-300">Role</Label>
              <div className="flex items-center justify-between px-4 py-3 bg-neutral-700 rounded-lg">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-neutral-400" />
                  <span className="text-white capitalize">{user?.role || 'voter'}</span>
                </div>
                <Badge className="bg-emerald-900 text-emerald-300">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Information */}
        <Card className="bg-neutral-800/50 backdrop-blur border-neutral-700">
          <CardHeader>
            <CardTitle className="text-lg text-white flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-400" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-neutral-400">User ID</p>
                <p className="text-white font-mono">{user?.id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-neutral-400">Account Type</p>
                <p className="text-white">Voter Account</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Security Note */}
        <Alert className="bg-amber-900/20 border-amber-700 text-amber-300">
          <Key className="h-4 w-4" />
          <AlertDescription>
            <strong>Security Notice:</strong> To change your password or update security settings, please contact the system administrator.
          </AlertDescription>
        </Alert>

        {/* HIDDEN FILE INPUT */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={e => handleFileSelect(e.target.files?.[0])}
        />
      </div>
    </div>
  );
};

export default AdminProfile;