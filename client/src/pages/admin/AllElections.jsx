

// src/pages/admin/AllElections.jsx

import { useEffect, useState } from "react";
import axios from "../../api/api.js";
import { useNavigate } from "react-router-dom";
import { Trash2, PlusCircle } from "lucide-react";
import DialogDemo from "./Addnew.jsx";

export default function AllElections() {
  const [elections, setElections] = useState([]);

  useEffect(() => {
    loadElections();
  }, []);

  async function loadElections() {
    try {
      const {data} = await axios.get("/elections");
      const elec = data.data.elections;
      setElections(elec);
      console.log(elec)
    } catch (err) {
      console.log(err);
    }
  }

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

  console.log("electioens", elections)

  return (
    <div className="m-5">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-semibold">All Elections</h2>
        
        <DialogDemo/>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-[#14213D] text-white">
            <tr>
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Title</th>
              <th className="py-3 px-4 text-left">Description</th>
              <th className="py-3 px-4 text-left">Status</th>
              <th className="py-3 px-4 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {elections.length > 0 &&  elections.map((e) => (
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
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {e.status}
                  </span>
                </td>

                <td className="py-3 px-4 text-center">
                  <button
                    onClick={() => handleDelete(e.election_id)}
                    className="p-2 rounded-lg bg-red-100 text-red-700 hover:bg-red-200 transition"
                  >
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}

            {elections.length === 0 && (
              <tr>
                <td
                  colSpan={5}
                  className="text-center py-5 text-white-500"
                >
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
