import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { Button } from "@/components/ui/button";

export default function Voters() {
  const [voters, setVoters] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadVoters();
  }, []);

  async function loadVoters() {
    try {
      const { data } = await axios.get("/users/all");

      // If your backend returns: { data: { voters: [] } }
        let votersData = data.data?.users || data.users || [];

      votersData = votersData.filter((v) => v.role === "voter"); 
      setVoters(votersData);
    } catch (err) {
      console.error(err);
      alert("Failed to load voters");
    } finally {
      setLoading(false);
    }
  }

  async function handleBan(voter_id, is_banned) {
    try {
      const route = `users/block/${voter_id}`
      await axios.patch(route);

      setVoters((prev) =>
        prev.map((v) =>
          v.user_id === voter_id ? { ...v, is_banned: !is_banned } : v
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update voter status");
    }
  }

  async function handleDelete(voter_id) {
    if (!confirm("Are you sure you want to delete this voter?")) return;

    try {
      await axios.delete(`/users/delete/${voter_id}`);
      setVoters((prev) => prev.filter((v) => v.user_id !== voter_id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete voter");
    }
  }

  if (loading) return <p className="text-center mt-10">Loading voters...</p>;

  return (
    <div className="m-5">
      <h2 className="text-3xl font-semibold mb-6">All Registered Voters</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#14213D] text-white">
            <tr>
              <th className="px-4 py-3 text-left">ID</th>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {voters.map((voter) => (
              <tr
                key={voter.voter_id}
                className="border-b hover:bg-gray-50 text-black transition"
              >
                <td className="px-4 py-3">{voter.user_id}</td>
                <td className="px-4 py-3">{voter.username}</td>
                <td className="px-4 py-3">{voter.email}</td>

                <td className="px-4 py-3">
                  {voter.is_banned ? (
                    <span className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm">
                      Banned
                    </span>
                  ) : (
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      Active
                    </span>
                  )}
                </td>

                <td className="px-4 py-3 text-center flex justify-center gap-3">
                  {/* BAN/UNBAN */}
                  <Button
                    size="sm"
                    variant={voter.is_banned ? "secondary" : "destructive"}
                    onClick={() =>
                      handleBan(voter.user_id, voter.is_banned)
                    }
                  >
                    {voter.is_banned ? "Unban" : "Ban"}
                  </Button>

                  {/* DELETE */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-red-500 text-red-600 hover:bg-red-100"
                    onClick={() => handleDelete(voter.user_id)}
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}

            {/* EMPTY STATE */}
            {voters.length === 0 && (
              <tr>
                <td
                  className="text-center py-5 text-gray-500"
                  colSpan="5"
                >
                  No voters found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
