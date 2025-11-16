import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Vote, CheckCircle, Clock, TrendingUp, Users, BarChart } from 'lucide-react';
import voterService from '../../services/voterService';
import { useAuth } from '../../auth/AuthContext';

const VoterDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalElections: 0,
    votedElections: 0,
    upcomingElections: 0,
    completedElections: 0
  });
  const [recentElections, setRecentElections] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const [statsData, electionsData] = await Promise.all([
        voterService.getVoterStats(),
        voterService.getAvailableElections()
      ]);

      setStats(statsData);
      setRecentElections(electionsData.slice(0, 5)); // Show 5 most recent
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ icon: Icon, title, value, subtitle, color = 'blue' }) => {
    const colorClasses = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      yellow: 'from-yellow-500 to-yellow-600',
      purple: 'from-purple-500 to-purple-600'
    };

    return (
      <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700 hover:border-neutral-600 transition-all duration-200">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-neutral-400 text-sm font-medium">{title}</p>
            <p className="text-white text-3xl font-bold mt-1">{value}</p>
            {subtitle && (
              <p className="text-neutral-500 text-xs mt-1">{subtitle}</p>
            )}
          </div>
          <div className={`p-3 rounded-xl bg-gradient-to-br ${colorClasses[color]} bg-opacity-20`}>
            <Icon className={`w-6 h-6 text-${color}-400`} />
          </div>
        </div>
      </div>
    );
  };

  const getElectionStatus = (election) => {
    const now = new Date();
    const startTime = new Date(election.start_time);
    const endTime = new Date(election.end_time);

    if (now < startTime) return { status: 'upcoming', color: 'yellow' };
    if (now > endTime) return { status: 'ended', color: 'gray' };
    return { status: 'active', color: 'green' };
  };

  if (loading) {
    return (
      <div className="min-h-screen overflow-auto bg-neutral-900 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-neutral-700 rounded-xl"></div>
              ))}
            </div>
            <div className="h-64 bg-neutral-700 rounded-xl"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {user?.name || 'Voter'}!
          </h1>
          <p className="text-neutral-400">
            Stay updated with the latest elections and cast your votes
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={Vote}
            title="Total Elections"
            value={stats.totalElections}
            subtitle="Available for voting"
            color="blue"
          />
          <StatCard
            icon={CheckCircle}
            title="Voted"
            value={stats.votedElections}
            subtitle="Elections participated"
            color="green"
          />
          <StatCard
            icon={Clock}
            title="Upcoming"
            value={stats.upcomingElections}
            subtitle="Elections to participate"
            color="yellow"
          />
          <StatCard
            icon={TrendingUp}
            title="Completed"
            value={stats.completedElections}
            subtitle="Past elections"
            color="purple"
          />
        </div>

        {/* Recent Elections */}
        <div className="bg-neutral-800 rounded-xl border border-neutral-700">
          <div className="p-6 border-b border-neutral-700">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-white">Recent Elections</h2>
              <Link
                to="/voter/elections"
                className="text-blue-400 hover:text-blue-300 text-sm font-medium transition-colors"
              >
                View all →
              </Link>
            </div>
          </div>

          <div className="p-6">
            {recentElections.length > 0 ? (
              <div className="space-y-4">
                {recentElections.map((election) => {
                  const { status, color } = getElectionStatus(election);
                  return (
                    <div key={election.election_id} className="flex items-center justify-between p-4 bg-neutral-700 rounded-lg hover:bg-neutral-600 transition-colors">
                      <div className="flex items-center space-x-4">
                        <div className="p-2 bg-neutral-600 rounded-lg">
                          <Calendar className="w-5 h-5 text-neutral-300" />
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{election.title}</h3>
                          <p className="text-sm text-neutral-400">
                            {new Date(election.start_time).toLocaleDateString()} - {new Date(election.end_time).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${status === 'active' ? 'bg-green-800 text-green-300' :
                          status === 'upcoming' ? 'bg-yellow-800 text-yellow-300' :
                            'bg-gray-800 text-gray-300'
                          }`}>
                          {status.toUpperCase()}
                        </span>
                        {status === 'active' && (
                          <Link
                            to={`/voter/elections/${election.election_id}`}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                          >
                            View Details
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-12">
                <Users className="w-12 h-12 text-neutral-500 mx-auto mb-4" />
                <p className="text-neutral-400">No elections available at the moment</p>
                <p className="text-neutral-500 text-sm mt-2">Check back later for new voting opportunities</p>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-8">
          <Link
            to="/voter/elections"
            className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl p-6 hover:from-blue-700 hover:to-blue-800 transition-all duration-200"
          >
            <Vote className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Browse Elections</h3>
            <p className="text-blue-100 text-sm">View all available elections and cast your votes</p>
          </Link>

          <Link
            to="/voter/results"
            className="bg-gradient-to-r from-yellow-600 to-orange-700 rounded-xl p-6 hover:from-yellow-700 hover:to-orange-800 transition-all duration-200"
          >
            <BarChart className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Election Results</h3>
            <p className="text-yellow-100 text-sm">View results from completed elections</p>
          </Link>

          <Link
            to="/voter/profile"
            className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-xl p-6 hover:from-purple-700 hover:to-purple-800 transition-all duration-200"
          >
            <Users className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Manage Profile</h3>
            <p className="text-purple-100 text-sm">Update your personal information and settings</p>
          </Link>

          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6">
            <TrendingUp className="w-8 h-8 text-white mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">Participation Rate</h3>
            <p className="text-green-100 text-sm">
              {stats.totalElections > 0
                ? `${Math.round((stats.votedElections / stats.totalElections) * 100)}% of elections voted`
                : 'No voting history yet'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VoterDashboard;