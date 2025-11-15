// src/pages/admin/AddCandidate.jsx
import { useEffect, useState } from "react";
import axios from "../../api/api.js";

export default function AddCandidate() {
  const [elections, setElections] = useState([]);
  const [form, setForm] = useState({
    election_id: "",
    name: "",
    party: "",
    avatar_url: "",
  });

  useEffect(() => {
    axios.get("/elections").then((res) => setElections(res.data));
  }, []);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function submit(e) {
    e.preventDefault();
    await axios.post("/candidates", form);
    alert("Candidate added!");
  }

  return (
    <div className="max-w-xl bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Add Candidate</h2>

      <form onSubmit={submit} className="space-y-4">
        <label>
          <p className="mb-1 font-medium">Select Election</p>
          <select
            name="election_id"
            value={form.election_id}
            onChange={handleChange}
            className="w-full border p-2 rounded-lg"
          >
            <option value="">Choose...</option>
            {/* {elections.map((e) => (
              <option key={e.election_id} value={e.election_id}>
                {e.title}
              </option>
            ))} */}
          </select>
        </label>

        <Input label="Candidate Name" name="name" onChange={handleChange} />
        <Input label="Party" name="party" onChange={handleChange} />
        <Input label="Avatar URL" name="avatar_url" onChange={handleChange} />

        <button className="w-full py-2 bg-[#FCA311] text-black font-semibold rounded-lg mt-4">
          Add Candidate
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <label className="block">
      <p className="mb-1 font-medium">{label}</p>
      <input {...props} className="w-full border p-2 rounded-lg" />
    </label>
  );
}
