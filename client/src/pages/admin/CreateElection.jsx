import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  FileText,
  Save,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Users
} from 'lucide-react';
import axios from '../../api/api.js';
import toast, { Toaster } from 'react-hot-toast';

export default function CreateElection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    start_time: '',
    end_time: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!form.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (form.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    if (!form.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (form.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    }

    if (!form.start_time) {
      newErrors.start_time = 'Start time is required';
    }

    if (!form.end_time) {
      newErrors.end_time = 'End time is required';
    }

    if (form.start_time && form.end_time) {
      const startTime = new Date(form.start_time);
      const endTime = new Date(form.end_time);
      const now = new Date();

      if (startTime <= now) {
        newErrors.start_time = 'Start time must be in the future';
      }

      if (endTime <= startTime) {
        newErrors.end_time = 'End time must be after start time';
      }

      if (endTime - startTime < 60 * 60 * 1000) {
        newErrors.end_time = 'Election must run for at least 1 hour';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  function handleChange(e) {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setSuccess(false);

    try {
      await axios.post('/elections/create', form);
      setSuccess(true);
      toast.success('Election created successfully!');

      // Navigate to elections list after 2 seconds
      setTimeout(() => {
        navigate('/admin/elections');
      }, 2000);
    } catch (error) {
      console.error('Failed to create election:', error);
      setErrors({
        submit: error.response?.data?.message || 'Failed to create election. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate('/admin/elections')}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Elections
          </button>

          <div>
            <h1 className="text-3xl font-bold text-white">Create New Election</h1>
            <p className="text-neutral-400 mt-1">
              Set up a new election with candidates and voting schedule
            </p>
          </div>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-900/20 border border-green-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400" />
              <div>
                <h3 className="font-semibold text-green-400">Election Created Successfully!</h3>
                <p className="text-green-300 text-sm">Redirecting to elections list...</p>
              </div>
            </div>
          </div>
        )}

        {/* Error Message */}
        {errors.submit && (
          <div className="bg-red-900/20 border border-red-600 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <h3 className="font-semibold text-red-400">Error</h3>
                <p className="text-red-300 text-sm">{errors.submit}</p>
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Basic Information
              </h2>

              <div className="grid grid-cols-1 gap-6">
                <FormField
                  label="Election Title"
                  name="title"
                  value={form.title}
                  onChange={handleChange}
                  error={errors.title}
                  placeholder="Enter a clear and descriptive title"
                  required
                />

                <FormField
                  label="Description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  error={errors.description}
                  placeholder="Provide detailed information about this election"
                  textarea
                  rows={4}
                  required
                />
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-6 pt-6 border-t border-neutral-700">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Voting Schedule
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  label="Start Date & Time"
                  name="start_time"
                  type="datetime-local"
                  value={form.start_time}
                  onChange={handleChange}
                  error={errors.start_time}
                  required
                  icon={<Calendar className="w-4 h-4" />}
                />

                <FormField
                  label="End Date & Time"
                  name="end_time"
                  type="datetime-local"
                  value={form.end_time}
                  onChange={handleChange}
                  error={errors.end_time}
                  required
                  icon={<Clock className="w-4 h-4" />}
                />
              </div>

              {form.start_time && form.end_time && (
                <div className="bg-neutral-700 rounded-lg p-4">
                  <h3 className="font-medium text-white mb-2">Election Duration</h3>
                  <p className="text-neutral-300 text-sm">
                    This election will run for approximately {' '}
                    {Math.round((new Date(form.end_time) - new Date(form.start_time)) / (1000 * 60 * 60))} hours
                  </p>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="pt-6 border-t border-neutral-700">
              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => navigate('/admin/elections')}
                  className="flex-1 px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                  disabled={loading}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Creating...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4" />
                      Create Election
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Next Steps Info */}
        <div className="mt-8 bg-blue-900/20 border border-blue-600 rounded-lg p-6">
          <h3 className="font-semibold text-blue-400 mb-2 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Next Steps
          </h3>
          <ul className="text-blue-300 text-sm space-y-1">
            <li>• Add candidates to your election</li>
            <li>• Configure voter eligibility</li>
            <li>• Review and publish the election</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

function FormField({
  label,
  error,
  textarea,
  icon,
  required,
  className = '',
  ...props
}) {
  return (
    <div className={`space-y-2 ${className}`}>
      <label className="block">
        <div className="flex items-center gap-2 mb-2">
          {icon && <span className="text-neutral-400">{icon}</span>}
          <span className="font-medium text-white">
            {label}
            {required && <span className="text-red-400 ml-1">*</span>}
          </span>
        </div>

        {textarea ? (
          <textarea
            {...props}
            className={`w-full px-4 py-3 bg-neutral-700 border transition-colors rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 resize-none ${error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-neutral-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
          />
        ) : (
          <input
            {...props}
            className={`w-full px-4 py-3 bg-neutral-700 border transition-colors rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 ${error
              ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
              : 'border-neutral-600 focus:ring-blue-500 focus:border-blue-500'
              }`}
          />
        )}
      </label>

      {error && (
        <div className="flex items-center gap-2 text-red-400 text-sm">
          <AlertTriangle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
