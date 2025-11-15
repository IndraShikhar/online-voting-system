// src/pages/admin/CandidateList.jsx
import { useEffect, useState } from "react";
import { getCandidates } from "../../services/candidateService";

export default function CandidateList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const data = await getCandidates();
        // normalize to array
        if (Array.isArray(data)) {
          if (mounted) setList(data);
        } else if (Array.isArray(data?.candidates)) {
          if (mounted) setList(data.candidates);
        } else if (Array.isArray(data?.list)) {
          if (mounted) setList(data.list);
        } else {
          if (mounted) setList([]);
        }
      } catch (err) {
        console.error("Failed to load candidates", err);
        if (mounted) setList([]);
      }
    }
    load();
    return () => (mounted = false);
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6 text-white">Candidates</h2>

      <div className="bg-neutral-800 shadow rounded-lg p-4 border border-neutral-700">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-neutral-700">
              <th className="pb-2 text-neutral-300">Name</th>
              <th className="pb-2 text-neutral-300">Party</th>
              <th className="pb-2 text-neutral-300">Election</th>
              <th className="pb-2 text-neutral-300">Votes</th>
            </tr>
          </thead>

          <tbody>
            {(Array.isArray(list) ? list : []).map((c) => (
              <tr key={c.candidate_id} className="border-b border-neutral-700 text-neutral-200">
                <td className="py-3">{c.name}</td>
                <td>{c.party}</td>
                <td>{c.election_id}</td>
                <td>{c.votes ?? 0}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
