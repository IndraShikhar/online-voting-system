import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  BarChart3,
  Users,
  Vote,
  FileText,
  TrendingUp,
  Calendar,
  Clock,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Settings,
  Activity
} from 'lucide-react';
import adminService from '../../services/adminService';
import { useAuth } from '../../auth/AuthContext';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalElections: 0,
    totalVoters: 0,
    totalCandidates: 0,
    totalVotes: 0,
    activeElections: 0,
    completedElections: 0,
    pendingElections: 0,
    voterTurnout: 0
  });
  const [recentElections, setRecentElections] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, electionsData, activityData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getRecentElections(3),
        adminService.getRecentActivity(10)
      ]);

      setStats(statsData);
      setRecentElections(electionsData);
      setRecentActivity(activityData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color, trend }) => (
    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-neutral-600 transition-all duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 ${color} rounded-lg`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {trend && (
          <div className="flex items-center text-green-400 text-sm">
            <TrendingUp className="w-4 h-4 mr-1" />
            {trend}
          </div>
        )}
      </div>
      <div className="space-y-1">
        <h3 className="text-2xl font-bold text-white">{value}</h3>
        <p className="text-sm font-medium text-neutral-300">{title}</p>
        {subtitle && <p className="text-xs text-neutral-500">{subtitle}</p>}
      </div>
    </div>
  );

  const QuickActionCard = ({ icon: Icon, title, description, href, color }) => (
    <Link
      to={href}
      className="block bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-neutral-600 hover:bg-neutral-750 transition-all duration-200 group"
    >
      <div className={`p-3 ${color} rounded-lg mb-4 w-fit group-hover:scale-105 transition-transform`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-neutral-400 text-sm">{description}</p>
    </Link>
  );

  const ElectionCard = ({ election }) => {
    const getStatusColor = (status) => {
      switch (status) {
        case 'active': return 'bg-green-600 text-white';
        case 'upcoming': return 'bg-blue-600 text-white';
        case 'completed': return 'bg-gray-600 text-white';
        default: return 'bg-neutral-600 text-white';
      }
    };

    const getStatusIcon = (status) => {
      switch (status) {
        case 'active': return <Clock className="w-4 h-4" />;
        case 'upcoming': return <Calendar className="w-4 h-4" />;
        case 'completed': return <CheckCircle className="w-4 h-4" />;
        default: return <AlertCircle className="w-4 h-4" />;
      }
    };

    return (
      <div className="bg-neutral-700 rounded-lg border border-neutral-600 p-4 hover:border-neutral-500 transition-all duration-200">
        <div className="flex justify-between items-start mb-3">
          <h4 className="font-medium text-white truncate mr-2">{election.title}</h4>
          <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusColor(election.status)}`}>
            {getStatusIcon(election.status)}
            {election.status}
          </span>
        </div>
        <div className="space-y-2 text-sm text-neutral-300">
          <div className="flex justify-between">
            <span>Candidates:</span>
            <span className="text-white">{election.candidateCount || 0}</span>
          </div>
          <div className="flex justify-between">
            <span>Votes Cast:</span>
            <span className="text-white">{election.voteCount || 0}</span>
          </div>
          <div className="flex justify-between items-center mt-3 pt-2 border-t border-neutral-600">
            <span className="text-xs text-neutral-400">
              {new Date(election.createdAt || election.start_time).toLocaleDateString()}
            </span>
            <Link
              to={`/admin/elections/${election.id || election.election_id}`}
              className="text-blue-400 hover:text-blue-300 text-xs font-medium flex items-center gap-1"
            >
              <Eye className="w-3 h-3" />
              View
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const ActivityItem = ({ activity }) => (
    <div className="flex items-center space-x-3 p-3 hover:bg-neutral-800 rounded-lg transition-colors">
      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0"></div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white truncate">{activity.description || activity.action}</p>
        <p className="text-xs text-neutral-400">{activity.timestamp ? new Date(activity.timestamp).toLocaleString() : 'Just now'}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="h-64 bg-neutral-700 rounded-xl"></div>
              <div className="h-64 bg-neutral-700 rounded-xl"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Welcome back, {user?.name || 'Admin'}!
            </h1>
            <p className="text-neutral-400">
              Here's what's happening with your voting system today.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              to="/admin/elections/create"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4" />
              Create Election
            </Link>
            <Link
              to="/admin/settings"
              className="flex items-center gap-2 bg-neutral-700 hover:bg-neutral-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Vote}
            title="Total Elections"
            value={stats.totalElections}
            subtitle={`${stats.activeElections} active`}
            color="bg-blue-600"
            trend="+12%"
          />
          <StatCard
            icon={Users}
            title="Registered Voters"
            value={stats.totalVoters.toLocaleString()}
            subtitle="Verified users"
            color="bg-green-600"
            trend="+8%"
          />
          <StatCard
            icon={FileText}
            title="Total Candidates"
            value={stats.totalCandidates}
            subtitle="Across all elections"
            color="bg-purple-600"
            trend="+15%"
          />
          <StatCard
            icon={BarChart3}
            title="Total Votes Cast"
            value={stats.totalVotes.toLocaleString()}
            subtitle={`${stats.voterTurnout}% turnout`}
            color="bg-orange-600"
            trend="+25%"
          />
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <QuickActionCard
              icon={Plus}
              title="Create Election"
              description="Set up a new election with candidates and voting periods"
              href="/admin/elections/create"
              color="bg-blue-600"
            />
            <QuickActionCard
              icon={Users}
              title="Manage Voters"
              description="Add, edit, or remove registered voters"
              href="/admin/voters"
              color="bg-green-600"
            />
            <QuickActionCard
              icon={FileText}
              title="Manage Candidates"
              description="Add candidates to elections and manage profiles"
              href="/admin/candidates"
              color="bg-purple-600"
            />
            <QuickActionCard
              icon={BarChart3}
              title="View Results"
              description="Monitor election results and declare winners"
              href="/admin/results"
              color="bg-orange-600"
            />
          </div>
        </div>

        {/* Recent Elections and Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Elections */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Elections</h2>
              <Link
                to="/admin/elections"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                View All
              </Link>
            </div>
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {recentElections.length > 0 ? (
                <div className="space-y-4">
                  {recentElections.map((election, index) => (
                    <ElectionCard key={election.id || index} election={election} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  <Vote className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No elections found</p>
                  <p className="text-sm mt-1">Create your first election to get started</p>
                </div>
              )}
            </div>
          </div>

          {/* Activity Feed */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-white">Recent Activity</h2>
              <Activity className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              {recentActivity.length > 0 ? (
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {recentActivity.map((activity, index) => (
                    <ActivityItem key={activity.id || index} activity={activity} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-neutral-400">
                  <Activity className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p>No recent activity</p>
                  <p className="text-sm mt-1">Activity will appear here as you use the system</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* System Status */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">System Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400 mb-1">{stats.activeElections}</div>
              <div className="text-sm text-neutral-300">Active Elections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400 mb-1">{stats.pendingElections}</div>
              <div className="text-sm text-neutral-300">Upcoming Elections</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400 mb-1">{stats.completedElections}</div>
              <div className="text-sm text-neutral-300">Completed Elections</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
