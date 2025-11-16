import { useEffect, useState } from "react";
import {
  Users,
  Search,
  Filter,
  MoreVertical,
  Shield,
  ShieldOff,
  Trash2,
  Eye,
  Download,
  Upload,
  UserPlus,
  AlertTriangle,
  CheckCircle,
  Ban,
  UserCheck,
  Calendar,
  Mail,
  Phone,
  MapPin,
  Activity,
  Loader2,
  X
} from "lucide-react";
import adminService from "../../services/adminService";

export default function Voters() {
  const [voters, setVoters] = useState([]);
  const [filteredVoters, setFilteredVoters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedVoters, setSelectedVoters] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [voterToDelete, setVoterToDelete] = useState(null);

  useEffect(() => {
    loadVoters();
  }, []);

  useEffect(() => {
    const filterVoters = () => {
      let filtered = voters;

      // Apply search filter
      if (searchTerm) {
        filtered = filtered.filter(
          (voter) =>
            voter.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voter.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            voter.user_id?.toString().includes(searchTerm)
        );
      }

      // Apply status filter
      if (statusFilter !== "all") {
        filtered = filtered.filter((voter) => {
          if (statusFilter === "active") return !voter.is_banned;
          if (statusFilter === "banned") return voter.is_banned;
          return true;
        });
      }

      setFilteredVoters(filtered);
    };

    filterVoters();
  }, [voters, searchTerm, statusFilter]);

  const loadVoters = async () => {
    setLoading(true);
    try {
      const response = await adminService.getAllUsers();
      let votersData = response?.data?.users || response?.users || response?.data || [];

      // Filter only voters
      votersData = votersData.filter((user) => user.role === "voter");
      setVoters(votersData);
    } catch (error) {
      console.error("Failed to load voters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBan = async (voter_id, is_banned) => {
    setActionLoading(prev => ({ ...prev, [voter_id]: true }));

    try {
      if (is_banned) {
        await adminService.unblockUser(voter_id);
      } else {
        await adminService.blockUser(voter_id);
      }

      setVoters((prev) =>
        prev.map((v) =>
          v.user_id === voter_id ? { ...v, is_banned: !is_banned } : v
        )
      );
    } catch (error) {
      console.error("Failed to update voter status:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [voter_id]: false }));
    }
  };

  const confirmDelete = (voter) => {
    setVoterToDelete(voter);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!voterToDelete) return;

    setActionLoading(prev => ({ ...prev, [voterToDelete.user_id]: true }));

    try {
      await adminService.deleteUser(voterToDelete.user_id);
      setVoters((prev) => prev.filter((v) => v.user_id !== voterToDelete.user_id));
      setShowDeleteModal(false);
      setVoterToDelete(null);
    } catch (error) {
      console.error("Failed to delete voter:", error);
    } finally {
      setActionLoading(prev => ({ ...prev, [voterToDelete.user_id]: false }));
    }
  };

  const handleSelectVoter = (voter_id) => {
    setSelectedVoters(prev =>
      prev.includes(voter_id)
        ? prev.filter(id => id !== voter_id)
        : [...prev, voter_id]
    );
  };

  const handleSelectAll = () => {
    if (selectedVoters.length === filteredVoters.length) {
      setSelectedVoters([]);
    } else {
      setSelectedVoters(filteredVoters.map(voter => voter.user_id));
    }
  };

  const getStats = () => {
    const total = voters.length;
    const active = voters.filter(v => !v.is_banned).length;
    const banned = voters.filter(v => v.is_banned).length;

    return { total, active, banned };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const StatCard = ({ icon: Icon, label, value, color = 'bg-blue-600' }) => (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
      <div className={`p-3 ${color} rounded-lg w-fit mb-4`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <div className="text-2xl font-bold text-white mb-1">{value}</div>
      <div className="text-neutral-400 text-sm">{label}</div>
    </div>
  );

  const VoterRow = ({ voter }) => {
    const isSelected = selectedVoters.includes(voter.user_id);
    const isLoading = actionLoading[voter.user_id];

    return (
      <tr className={`border-b border-neutral-700 hover:bg-neutral-700/50 transition-colors ${isSelected ? 'bg-blue-900/20' : ''
        }`}>
        <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
          <input
            type="checkbox"
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation();
              handleSelectVoter(voter.user_id);
            }}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
          />
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-white">{voter.username || 'N/A'}</div>
              <div className="text-sm text-neutral-400">ID: {voter.user_id}</div>
            </div>
          </div>
        </td>
        <td className="px-6 py-4">
          <div className="text-white">{voter.email}</div>
          {voter.phone && (
            <div className="text-sm text-neutral-400 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {voter.phone}
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="text-sm text-neutral-300">
            Joined {formatDate(voter.created_at || voter.createdAt)}
          </div>
          {voter.last_login && (
            <div className="text-xs text-neutral-400 flex items-center gap-1">
              <Activity className="w-3 h-3" />
              Last active {formatDate(voter.last_login)}
            </div>
          )}
        </td>
        <td className="px-6 py-4">
          {voter.is_banned ? (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-900/50 text-red-300 rounded-full text-sm">
              <Ban className="w-3 h-3" />
              Banned
            </span>
          ) : (
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-900/50 text-green-300 rounded-full text-sm">
              <UserCheck className="w-3 h-3" />
              Active
            </span>
          )}
        </td>
        <td className="px-6 py-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleBan(voter.user_id, voter.is_banned)}
              disabled={isLoading}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm transition-colors disabled:opacity-50 ${voter.is_banned
                ? 'bg-green-600 hover:bg-green-700 text-white'
                : 'bg-yellow-600 hover:bg-yellow-700 text-white'
                }`}
            >
              {isLoading ? (
                <Loader2 className="w-3 h-3 animate-spin" />
              ) : voter.is_banned ? (
                <Shield className="w-3 h-3" />
              ) : (
                <ShieldOff className="w-3 h-3" />
              )}
              {voter.is_banned ? 'Unban' : 'Ban'}
            </button>

            <button
              onClick={() => confirmDelete(voter)}
              disabled={isLoading}
              className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm transition-colors disabled:opacity-50"
            >
              <Trash2 className="w-3 h-3" />
              Delete
            </button>
          </div>
        </td>
      </tr>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-96 bg-neutral-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  const stats = getStats();

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white">Voter Management</h1>
            <p className="text-neutral-400 mt-2">
              Manage registered voters and their access permissions
            </p>
          </div>

          <div className="flex gap-3">
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
              <Upload className="w-4 h-4" />
              Import
            </button>
            <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors">
              <UserPlus className="w-4 h-4" />
              Add Voter
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            icon={Users}
            label="Total Voters"
            value={stats.total}
            color="bg-blue-600"
          />
          <StatCard
            icon={UserCheck}
            label="Active Voters"
            value={stats.active}
            color="bg-green-600"
          />
          <StatCard
            icon={Ban}
            label="Banned Voters"
            value={stats.banned}
            color="bg-red-600"
          />
        </div>

        {/* Filters and Search */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  placeholder="Search voters by name, email, or ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="banned">Banned</option>
              </select>
            </div>
          </div>

          {/* Bulk Actions */}
          {selectedVoters.length > 0 && (
            <div className="mt-4 p-3 bg-blue-900/20 border border-blue-700 rounded-lg">
              <div className="flex items-center justify-between">
                <span className="text-blue-300">
                  {selectedVoters.length} voter(s) selected
                </span>
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white text-sm rounded transition-colors">
                    Ban Selected
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded transition-colors">
                    Delete Selected
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Voters Table */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-700 border-b border-neutral-600">
                <tr>
                  <th className="px-6 py-4 text-left" onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedVoters.length === filteredVoters.length && filteredVoters.length > 0}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleSelectAll();
                      }}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 text-blue-600 bg-neutral-700 border-neutral-600 rounded focus:ring-blue-500 focus:ring-2"
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                    Voter
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                    Contact
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                    Activity
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-neutral-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredVoters.map((voter) => (
                  <VoterRow key={voter.user_id} voter={voter} />
                ))}

                {filteredVoters.length === 0 && (
                  <tr>
                    <td colSpan="6" className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center">
                        <Users className="w-16 h-16 text-neutral-500 mb-4" />
                        <h3 className="text-lg font-medium text-neutral-300 mb-2">
                          {searchTerm || statusFilter !== 'all' ? 'No matching voters found' : 'No voters registered'}
                        </h3>
                        <p className="text-neutral-500">
                          {searchTerm || statusFilter !== 'all'
                            ? 'Try adjusting your search or filter criteria'
                            : 'Voters will appear here once they register for the platform'
                          }
                        </p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination could go here */}
        {filteredVoters.length > 0 && (
          <div className="mt-6 flex items-center justify-between text-neutral-400">
            <span className="text-sm">
              Showing {filteredVoters.length} of {voters.length} voters
            </span>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && voterToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <div className="p-3 bg-red-600 rounded-lg mr-4">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Delete Voter</h3>
                <p className="text-neutral-400 text-sm">This action cannot be undone</p>
              </div>
            </div>

            <p className="text-neutral-300 mb-6">
              Are you sure you want to delete voter "<strong>{voterToDelete.username}</strong>"?
              This will permanently remove their account and voting history.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={actionLoading[voterToDelete.user_id]}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {actionLoading[voterToDelete.user_id] ? 'Deleting...' : 'Delete Voter'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
