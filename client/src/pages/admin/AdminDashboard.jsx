// src/pages/admin/AdminDashboard.jsx
import { useEffect, useState } from "react";
import axios from "../../api/api.js";
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
      const { data } = await axios.get("/dashboard/stats");
      setStats(data);
    } catch {
      // fallback mock
      setStats({ active: 1, upcoming: 2, ended: 3, candidates: 10 });
    }
  }

  async function loadElections() {
    try {
      const { data } = await axios.get("/elections");
      setElections(data);
    } catch {
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
    <div>
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
            className="bg-white rounded-lg p-5 shadow border border-gray-100"
          >
            <div className="flex justify-between">
              <div>
                <h4 className="text-lg font-semibold">{e.title}</h4>
                <p className="text-sm text-gray-600">
                  {format(new Date(e.start_time), "PPp")} →{" "}
                  {format(new Date(e.end_time), "PPp")}
                </p>
              </div>

              <span
                className={`px-3 py-3 rounded-full text-sm ${
                  e.status === "active"
                    ? "bg-green-100 text-green-700"
                    : e.status === "upcoming"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {e.status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCard({ icon, title, value }) {
  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-100 flex items-center gap-4">
      <div className="p-3 rounded-lg bg-[#FCA311]/20 text-[#FCA311]">{icon}</div>
      <div>
        <p className="text-gray-500">{title}</p>
        <p className="text-2xl font-semibold">{value}</p>
      </div>
    </div>
  );
}
