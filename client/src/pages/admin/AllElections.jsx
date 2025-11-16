// src/pages/admin/AllElections.jsx

import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { Trash2 } from "lucide-react";
import DialogDemo from "./AddnewElectionForm.jsx";

export default function AllElections() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, []);

  async function loadElections() {
    try {
      const { data } = await axios.get("/elections");
      const elec = data.data.elections;
      setElections(elec);
    } catch (err) {
      console.log(err);
    }
  }

  // ------------------- DELETE ELECTION -------------------
  async function handleDelete(id) {
    if (!confirm("Are you sure you want to delete this election?")) return;

    try {
      await axios.delete(`/elections/delete/${id}`);
      setElections((prev) => prev.filter((e) => e.election_id !== id));
    } catch (err) {
      console.log(err);
      alert("Failed to delete election");
    }
  }

  // ------------------- START ELECTION -------------------
  async function handleStartElection(id) {
    try {
      await axios.patch(`/elections/start/${id}`);
      setElections((prev) =>
        prev.map((e) =>
          e.election_id === id ? { ...e, status: "active" } : e
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to start the election");
    }
  }

  // ------------------- END ELECTION -------------------
  async function handleEndElection(id) {
    try {
      await axios.patch(`/elections/end/${id}`);
      setElections((prev) =>
        prev.map((e) =>
          e.election_id === id ? { ...e, status: "ended" } : e
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to end the election");
    }
  }

  // ------------------- DECLARE RESULT -------------------
  async function handleDeclareResult(id) {
    try {
      await axios.patch(`/elections/declare-result/${id}`);
      setElections((prev) =>
        prev.map((e) =>
          e.election_id === id ? { ...e, status: "result_declared" } : e
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to declare result");
    }
  }

  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">All Elections</h2>
        <DialogDemo />
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#14213D] text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {elections.length > 0 &&
              elections.map((e) => (
                <tr
                  key={e.election_id}
                  className="border-b hover:bg-gray-50 text-black transition"
                >
                  <td className="py-3 px-4">{e.election_id}</td>
                  <td className="py-3 px-4 font-semibold">{e.title}</td>
                  <td className="py-3 px-4 text-black">{e.description}</td>

                  <td className="py-3 px-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm ${
                        e.status === "active"
                          ? "bg-green-100 text-green-700"
                          : e.status === "upcoming"
                          ? "bg-yellow-100 text-yellow-700"
                          : e.status === "ended"
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {e.status}
                    </span>
                  </td>

                  {/* ------------ ACTION BUTTONS BASED ON STATUS ------------ */}
                  <td className="py-3 px-4 text-center flex gap-3 justify-center">

                    {/* UPCOMING → Start, Delete */}
                    {e.status === "upcoming" && (
                      <>
                        <button
                          onClick={() => handleStartElection(e.election_id)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                        >
                          Start
                        </button>

                        <button
                          onClick={() => handleDelete(e.election_id)}
                          className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </>
                    )}

                    {/* ACTIVE → End */}
                    {e.status === "active" && (
                      <button
                        onClick={() => handleEndElection(e.election_id)}
                        className="px-3 py-1 bg-orange-100 text-orange-700 rounded-lg hover:bg-orange-200"
                      >
                        End
                      </button>
                    )}

                    {/* ENDED → Declare Result */}
                    {e.status === "ended" && (
                      <button
                        onClick={() => handleDeclareResult(e.election_id)}
                        className="px-3 py-1 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                      >
                        Declare Result
                      </button>
                    )}

                    {/* RESULT DECLARED → No Actions */}
                    {e.status === "result_declared" && (
                      <span className="text-gray-500 text-sm italic">
                        Completed
                      </span>
                    )}
                  </td>
                </tr>
              ))}

            {elections.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-5 text-white-500">
                  No elections found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
