// src/pages/admin/CreateElection.jsx
import { useState } from "react";
import axios from "../../api/api.js";

export default function CreateElection() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    start_time: "",
    end_time: "",
  });

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    await axios.post("/elections", form);
    alert("Election created successfully!");
  }

  return (
    <div className="max-w-xl bg-white p-6 shadow rounded-lg">
      <h2 className="text-2xl font-semibold mb-6">Create New Election</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input label="Title" name="title" value={form.title} onChange={handleChange} />
        <Input
          label="Description"
          name="description"
          textarea
          value={form.description}
          onChange={handleChange}
        />

        <Input label="Start Time" name="start_time" type="datetime-local" onChange={handleChange} />
        <Input label="End Time" name="end_time" type="datetime-local" onChange={handleChange} />

        <button className="w-full py-2 bg-[#FCA311] text-black font-semibold rounded-lg mt-4">
          Create Election
        </button>
      </form>
    </div>
  );
}

function Input({ label, textarea, ...props }) {
  return (
    <label className="block">
      <p className="mb-1 font-medium">{label}</p>
      {textarea ? (
        <textarea
          {...props}
          className="w-full border p-2 rounded-lg resize-none"
          rows={3}
        />
      ) : (
        <input
          {...props}
          className="w-full border p-2 rounded-lg"
        />
      )}
    </label>
  );
}
