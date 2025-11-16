import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    BarChart3,
    Calendar,
    Clock,
    CheckCircle,
    AlertTriangle,
    Eye,
    Download,
    Trophy,
    Vote,
    Search,
    RefreshCw,
    TrendingUp
} from 'lucide-react';
import adminService from '../../services/adminService';

const ResultsList = () => {
    const [elections, setElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [filteredElections, setFilteredElections] = useState([]);

    useEffect(() => {
        loadElections();
    }, []);

    useEffect(() => {
        const filterElections = () => {
            let filtered = elections;

            // Apply search filter
            if (searchTerm) {
                filtered = filtered.filter((election) =>
                    election.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    election.description?.toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Apply status filter
            if (statusFilter !== 'all') {
                filtered = filtered.filter((election) => {
                    const status = getElectionStatus(election);
                    return status === statusFilter;
                });
            }

            setFilteredElections(filtered);
        };

        filterElections();
    }, [elections, searchTerm, statusFilter]);

    const loadElections = async () => {
        setLoading(true);
        try {
            const response = await adminService.getAllElections();
            const electionsData = response?.data || response || [];

            // Fetch results for each election to get vote counts
            const electionsWithResults = await Promise.all(
                electionsData.map(async (election) => {
                    try {
                        const resultsResponse = await adminService.getElectionResults(election.election_id);
                        const results = resultsResponse?.data || resultsResponse || [];
                        const totalVotes = results.reduce((sum, result) => sum + (result.vote_count || 0), 0);

                        return {
                            ...election,
                            totalVotes,
                            candidateCount: results.length,
                            hasResults: results.length > 0,
                            results
                        };
                    } catch {
                        return {
                            ...election,
                            totalVotes: 0,
                            candidateCount: 0,
                            hasResults: false,
                            results: []
                        };
                    }
                })
            );

            setElections(electionsWithResults);
        } catch (error) {
            console.error('Failed to load elections:', error);
        } finally {
            setLoading(false);
        }
    };

    const getElectionStatus = (election) => {
        const { status } = election;
        return status;
    };

    const getStatusDisplay = (status) => {
        const statusConfig = {
            active: {
                label: 'Active',
                color: 'bg-green-600 text-white',
                icon: <Clock className="w-4 h-4" />
            },
            upcoming: {
                label: 'Upcoming',
                color: 'bg-blue-600 text-white',
                icon: <Calendar className="w-4 h-4" />
            },
            ended: {
                label: 'Ended',
                color: 'bg-yellow-600 text-white',
                icon: <AlertTriangle className="w-4 h-4" />
            },
            result_declared: {
                label: 'Results Declared',
                color: 'bg-purple-600 text-white',
                icon: <CheckCircle className="w-4 h-4" />
            }
        };

        return statusConfig[status] || statusConfig.upcoming;
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const StatCard = ({ icon, label, value, color = 'bg-blue-600' }) => {
        const IconComponent = icon;
        return (
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <div className={`p-3 ${color} rounded-lg w-fit mb-4`}>
                    <IconComponent className="w-6 h-6 text-white" />
                </div>
                <div className="text-2xl font-bold text-white mb-1">{value}</div>
                <div className="text-neutral-400 text-sm">{label}</div>
            </div>
        );
    };

    const ElectionCard = ({ election }) => {
        const status = getElectionStatus(election);
        const statusDisplay = getStatusDisplay(status);
        const canViewResults = status === 'ended' || status === 'declared';

        // Get winner for declared results
        const winner = election.results?.length > 0
            ? election.results.reduce((prev, current) =>
                (current.vote_count > prev.vote_count) ? current : prev
            )
            : null;

        return (
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-neutral-600 transition-colors">
                <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">{election.title}</h3>
                        <p className="text-neutral-400 text-sm line-clamp-2 mb-3">
                            {election.description || 'No description available'}
                        </p>

                        <div className="flex items-center gap-2 mb-3">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${statusDisplay.color}`}>
                                {statusDisplay.icon}
                                {statusDisplay.label}
                            </span>
                        </div>

                        {/* Winner Display for Declared Elections */}
                        {/* {status === 'result_declared' && winner && (
                            <div className="bg-linear-to-r from-yellow-600 to-orange-600 rounded-lg p-3 mb-3">
                                <div className="flex items-center gap-2 text-white">
                                    <Trophy className="w-4 h-4" />
                                    <span className="text-sm font-medium">Winner</span>
                                </div>
                                <div className="text-white font-semibold">{winner.candidate_name}</div>
                                <div className="text-yellow-100 text-sm">
                                    {winner.vote_count.toLocaleString()} votes ({((winner.vote_count / election.totalVotes) * 100).toFixed(1)}%)
                                </div>
                            </div>
                        )} */}
                    </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{election.candidateCount || 0}</div>
                        <div className="text-xs text-neutral-400">Candidates</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{election.totalVotes?.toLocaleString() || 0}</div>
                        <div className="text-xs text-neutral-400">Total Votes</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">
                            {election.voter_count ? Math.round((election.totalVotes / election.voter_count) * 100) : 0}%
                        </div>
                        <div className="text-xs text-neutral-400">Turnout</div>
                    </div>
                    <div className="text-center">
                        <div className="text-xl font-bold text-white">{election.voter_count || 0}</div>
                        <div className="text-xs text-neutral-400">Eligible Voters</div>
                    </div>
                </div>

                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-neutral-300">
                        <Calendar className="w-4 h-4 mr-2 text-neutral-400" />
                        <span>Start: {formatDate(election.start_time)}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-300">
                        <Clock className="w-4 h-4 mr-2 text-neutral-400" />
                        <span>End: {formatDate(election.end_time)}</span>
                    </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-neutral-700">
                    <Link
                        to={`/admin/elections/${election.election_id}`}
                        className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                    >
                        <Eye className="w-4 h-4" />
                        View Details
                    </Link>

                    {canViewResults ? (
                        <Link
                            to={`/admin/elections/${election.election_id}/results`}
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                        >
                            <BarChart3 className="w-4 h-4" />
                            View Results
                        </Link>
                    ) : (
                        <button
                            disabled
                            className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-neutral-600 text-neutral-400 rounded-lg cursor-not-allowed"
                        >
                            <BarChart3 className="w-4 h-4" />
                            {status === 'active' ? 'Voting Active' : 'No Results Yet'}
                        </button>
                    )}
                </div>
            </div>
        );
    };

    const getOverallStats = () => {
        const total = elections.length;
        const completed = elections.filter(e => getElectionStatus(e) === 'declared').length;
        const active = elections.filter(e => getElectionStatus(e) === 'active').length;
        const totalVotes = elections.reduce((sum, e) => sum + (e.totalVotes || 0), 0);

        return { total, completed, active, totalVotes };
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 p-6">
                <div className="max-w-7xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="h-32 bg-neutral-700 rounded-xl"></div>
                            ))}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {[...Array(6)].map((_, i) => (
                                <div key={i} className="h-64 bg-neutral-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    const stats = getOverallStats();

    return (
        <div className="min-h-screen bg-neutral-900 text-white p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white">Election Results</h1>
                        <p className="text-neutral-400 mt-2">
                            View and manage results for all elections
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={loadElections}
                            className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition-colors">
                            <Download className="w-4 h-4" />
                            Export All
                        </button>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <StatCard
                        icon={BarChart3}
                        label="Total Elections"
                        value={stats.total}
                        color="bg-blue-600"
                    />
                    <StatCard
                        icon={Trophy}
                        label="Results Declared"
                        value={stats.completed}
                        color="bg-purple-600"
                    />
                    <StatCard
                        icon={Clock}
                        label="Active Elections"
                        value={stats.active}
                        color="bg-green-600"
                    />
                    <StatCard
                        icon={Vote}
                        label="Total Votes Cast"
                        value={stats.totalVotes.toLocaleString()}
                        color="bg-orange-600"
                    />
                </div>

                {/* Filters */}
                <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="flex-1">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-neutral-400" />
                                <input
                                    type="text"
                                    placeholder="Search elections by title or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                />
                            </div>
                        </div>

                        <div className="md:w-48">
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="w-full px-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            >
                                <option value="all">All Status</option>
                                <option value="upcoming">Upcoming</option>
                                <option value="active">Active</option>
                                <option value="ended">Ended</option>
                                <option value="declared">Results Declared</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Elections Grid */}
                {filteredElections.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filteredElections.map((election) => (
                                <ElectionCard key={election.election_id} election={election} />
                            ))}
                        </div>

                        <div className="mt-8 flex items-center justify-between text-neutral-400">
                            <span className="text-sm">
                                Showing {filteredElections.length} of {elections.length} elections
                            </span>
                        </div>
                    </>
                ) : (
                    <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-12 text-center">
                        <BarChart3 className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                        <h2 className="text-xl font-semibold text-white mb-2">
                            {searchTerm || statusFilter !== 'all' ? 'No matching elections found' : 'No elections available'}
                        </h2>
                        <p className="text-neutral-400 mb-6">
                            {searchTerm || statusFilter !== 'all'
                                ? 'Try adjusting your search or filter criteria'
                                : 'Elections will appear here once they are created and completed'
                            }
                        </p>
                        {!searchTerm && statusFilter === 'all' && (
                            <Link
                                to="/admin/elections/create"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                            >
                                <Vote className="w-5 h-5" />
                                Create First Election
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsList;
