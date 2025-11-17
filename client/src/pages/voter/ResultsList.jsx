import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Calendar, BarChart, Trophy, Users, TrendingUp, Eye } from 'lucide-react';
import voterService from '../../services/voterService';
import api from "../../api/api.js";
import toast from 'react-hot-toast';

const ResultsList = () => {
    const [elections, setElections] = useState([]);
    const [filteredElections, setFilteredElections] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        loadElectionsWithResults();
    }, []);

    useEffect(() => {
        const filterElections = () => {
            let filtered = elections;

            // Search filter
            if (searchTerm) {
                filtered = filtered.filter(election =>
                    election.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (election.description || '').toLowerCase().includes(searchTerm.toLowerCase())
                );
            }

            // Sort by end date (most recent first)
            filtered = filtered.sort((a, b) => new Date(b.end_time) - new Date(a.end_time));

            setFilteredElections(filtered);
        };

        filterElections();
    }, [elections, searchTerm]);

    const loadElectionsWithResults = async () => {
        setLoading(true);
        try {
            const data = await voterService.getElectionsWithResults();
            console.log(data)
            toast.success('Elections loaded successfully');
            await Promise.all(data.map(async (election) => {
                console.log(election);
                const { data: { data: d } } = await api.get(`/votes/count/${election.election_id}`);
                console.log(d)
                const totalVotes = d.reduce((sum, item) => {
                    if (item.candidate_id === election.winner_id) {
                        election.winner_votes = item.vote_count;
                    }
                    return sum + item.total_votes
                }, 0);
                election.total_votes = totalVotes;
                election.percentage = ((d[0].vote_count / totalVotes) * 100).toFixed(2);
                election.total_candidates = d.length;
            }));
            setElections(data);
        } catch (error) {
            console.error('Failed to load elections with results:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatDateTime = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const ElectionResultCard = ({ election }) => {
        return (
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 hover:border-neutral-600 transition-all duration-200 overflow-hidden">
                <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                            <div className="flex items-center mb-2">
                                <Trophy className="w-5 h-5 text-yellow-400 mr-2" />
                                <span className="text-xs font-medium text-yellow-400 bg-yellow-900/20 px-2 py-1 rounded-full">
                                    Results Declared
                                </span>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">{election.title}</h3>
                            <p className="text-neutral-400 text-sm mb-3 line-clamp-2">
                                {election.description || 'No description available'}
                            </p>
                        </div>
                    </div>

                    {/* Election Stats */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{election.total_votes || 0}</div>
                            <div className="text-xs text-neutral-400">Total Votes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-white">{election.total_candidates || 0}</div>
                            <div className="text-xs text-neutral-400">Candidates</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-green-400">
                                {election.winner_votes || 0}
                            </div>
                            <div className="text-xs text-neutral-400">Winner Votes</div>
                        </div>
                        <div className="text-center">
                            <div className="text-lg font-bold text-blue-400">
                                {election.total_votes > 0
                                    ? `${Math.round((election.winner_votes || 0) / election.total_votes * 100)} % `
                                    : '0%'
                                }
                            </div>
                            <div className="text-xs text-neutral-400">Win Margin</div>
                        </div>
                    </div>

                    {/* Winner Information */}
                    {election.winner_name && (
                        <div className="bg-neutral-700 rounded-lg p-4 mb-4">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center">
                                    <Trophy className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <div className="text-sm text-neutral-300">Election Winner</div>
                                    <div className="text-white font-semibold">{election.winner_name}</div>
                                    {election.winner_party && (
                                        <div className="text-neutral-400 text-sm">{election.winner_party}</div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Election Timeline */}
                    <div className="flex items-center text-neutral-400 text-sm space-x-4 mb-4">
                        <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            <span>
                                {formatDateTime(election.start_time)} - {formatDateTime(election.end_time)}
                            </span>
                        </div>
                    </div>

                    {/* Action Button */}
                    <div className="flex justify-end">
                        <Link
                            to={`/voter/results/${election.election_id}`}
                            className="flex items-center px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            View Detailed Results
                        </Link>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-neutral-900 p-6">
                <div className="max-w-6xl mx-auto">
                    <div className="animate-pulse">
                        <div className="h-8 bg-neutral-700 rounded w-64 mb-8"></div>
                        <div className="h-16 bg-neutral-700 rounded mb-6"></div>
                        <div className="space-y-4">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="h-64 bg-neutral-700 rounded-xl"></div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen overflow-auto bg-neutral-900 text-white p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-3 mb-4">
                        <BarChart className="w-8 h-8 text-blue-400" />
                        <h1 className="text-3xl font-bold text-white">Election Results</h1>
                    </div>
                    <p className="text-neutral-400">
                        View results from completed elections where outcomes have been officially declared
                    </p>
                </div>

                {/* Search */}
                <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-8">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
                        <input
                            type="text"
                            placeholder="Search election results..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 bg-neutral-700 border border-neutral-600 rounded-lg text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                    </div>
                </div>

                {/* Results Grid */}
                {filteredElections.length > 0 ? (
                    <div className="space-y-6">
                        {filteredElections.map((election) => (
                            <ElectionResultCard key={election.election_id} election={election} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16">
                        {elections.length === 0 ? (
                            <>
                                <BarChart className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-neutral-300 mb-2">
                                    No Election Results Available
                                </h3>
                                <p className="text-neutral-500">
                                    There are currently no elections with declared results to display
                                </p>
                            </>
                        ) : (
                            <>
                                <Search className="w-16 h-16 text-neutral-500 mx-auto mb-4" />
                                <h3 className="text-xl font-medium text-neutral-300 mb-2">
                                    No Results Match Your Search
                                </h3>
                                <p className="text-neutral-500 mb-4">
                                    Try adjusting your search criteria
                                </p>
                                <button
                                    onClick={() => setSearchTerm('')}
                                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                                >
                                    Clear Search
                                </button>
                            </>
                        )}
                    </div>
                )}

                {/* Summary Statistics */}
                {elections.length > 0 && (
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
                            <div className="p-3 bg-blue-600 rounded-lg w-fit mx-auto mb-3">
                                <BarChart className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">{elections.length}</div>
                            <div className="text-neutral-400 text-sm">Elections with Results</div>
                        </div>

                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
                            <div className="p-3 bg-green-600 rounded-lg w-fit mx-auto mb-3">
                                <Users className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">
                                {elections.reduce((sum, election) => sum + (election.total_votes || 0), 0)}
                            </div>
                            <div className="text-neutral-400 text-sm">Total Votes Cast</div>
                        </div>

                        <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 text-center">
                            <div className="p-3 bg-purple-600 rounded-lg w-fit mx-auto mb-3">
                                <TrendingUp className="w-6 h-6 text-white" />
                            </div>
                            <div className="text-2xl font-bold text-white mb-2">
                                {elections.reduce((sum, election) => sum + (election.total_candidates || 0), 0)}
                            </div>
                            <div className="text-neutral-400 text-sm">Total Candidates</div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ResultsList;