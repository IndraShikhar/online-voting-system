// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import { getStats, getElections } from "../../services/electionService";
import { Calendar, BarChart2, Users, CheckSquare } from "lucide-react";
import { format } from "date-fns";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    active: 0,
    upcoming: 0,
    ended: 0,
    candidates: 0,
  });

  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadStats();
    loadElections();
  }, []);

  async function loadStats() {
    // backend stats route
    try {
      const data = await getStats();
      setStats(data);
    } catch {
      // fallback mock
      console.error("loadStats failed");
      setStats({ active: 1, upcoming: 2, ended: 3, candidates: 10 });
    }
  }

  async function loadElections() {
    try {
      const data = await getElections();
      // normalize response to an array. backend may return either
      // - an array directly:  [{...}, ...]
      // - or an object: { elections: [...] }
      if (Array.isArray(data)) setElections(data);
      else if (Array.isArray(data?.elections)) setElections(data.elections);
      else setElections([]);
    } catch {
      console.error("loadElections failed");
      setElections([
        {
          election_id: 1,
          title: "Student Council Election",
          status: "active",
          start_time: "2025-11-10T10:00:00",
          end_time: "2025-11-11T18:00:00",
        },
      ]);
    }
  }

  return (
    <div className="min-h-screen p-6 bg-neutral-900 text-white">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold mb-6">Dashboard Overview</h2>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <StatCard icon={<BarChart2 size={24} />} title="Active" value={stats.active} />
          <StatCard icon={<Calendar size={24} />} title="Upcoming" value={stats.upcoming} />
          <StatCard icon={<CheckSquare size={24} />} title="Ended" value={stats.ended} />
          <StatCard icon={<Users size={24} />} title="Candidates" value={stats.candidates} />
        </div>

        {/* Elections */}
        <h3 className="mt-10 mb-4 text-xl font-semibold">Recent Elections</h3>

        <div className="space-y-4">
          {elections.map((e) => (
            <div
              key={e.election_id}
              className="bg-neutral-800 rounded-lg p-5 shadow border border-neutral-700"
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                <div>
                  <h4 className="text-lg font-semibold text-white">{e.title}</h4>
                  <p className="text-sm text-neutral-300">
                    {format(new Date(e.start_time), "PPp")} → {format(new Date(e.end_time), "PPp")}
                  </p>
                </div>

                <span
                  className={`px-3 py-1 rounded-full text-sm ${e.status === "active"
                    ? "bg-green-800 text-green-300"
                    : e.status === "upcoming"
                      ? "bg-yellow-800 text-yellow-300"
                      : "bg-neutral-700 text-neutral-300"
                    }`}
                >
                  {e.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-neutral-800 p-6 rounded-lg shadow border border-neutral-700 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-[#FCA311]/20 text-[#FCA311]">{icon}</div>
      <div>
        <p className="text-neutral-300">{title}</p>
        <p className="text-2xl font-semibold text-white">{value}</p>
      </div>
    </div>
  );
}
