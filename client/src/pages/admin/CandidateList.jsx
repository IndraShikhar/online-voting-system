// src/pages/admin/CandidateList.jsx
import { useEffect, useState } from "react";
import axios from "../../api/api.js";

export default function CandidateList() {
  const [list, setList] = useState([]);

  useEffect(() => {
    axios.get("/candidates").then((res) => setList(res.data));
  }, []);

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-6">Candidates</h2>

      <div className="bg-white shadow rounded-lg p-6">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="pb-2">Name</th>
              <th className="pb-2">Party</th>
              <th className="pb-2">Election</th>
              <th className="pb-2">Votes</th>
            </tr>
          </thead>

          <tbody>
            {list.map((c) => (
              <tr key={c.candidate_id} className="border-b text-sm">
                <td className="py-3">{c.name}</td>
                <td>{c.party}</td>
                <td>{c.election_id}</td>
                <td>{c.votes}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
