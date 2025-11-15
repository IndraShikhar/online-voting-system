import { useState } from "react";

export default function EditProfile() {

  const [form, setForm] = useState({
    name: "Admin User",
    email: "admin@example.com",
    password: "",
    photo: "",
  });

  const [preview, setPreview] = useState(
    "https://via.placeholder.com/150"
  );

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function handlePhotoChange(e) {
    const file = e.target.files[0];
    if (!file) return;

    const url = URL.createObjectURL(file);
    setPreview(url);

    setForm({ ...form, photo: file });
  }

  function handleSubmit(e) {
    e.preventDefault();
    console.log("Saving profile...", form);

    // Here you will do:
    // const formData = new FormData();
    // formData.append("photo", form.photo);
    // formData.append("name", form.name);
    // formData.append("email", form.email);
    // formData.append("password", form.password);
    //
    // axios.put("/admin/profile", formData);

    alert("Profile updated successfully!");
  }

  return (
    <div className="max-w-3xl bg-white p-8 rounded-lg shadow m-5">
      <h2 className="text-2xl font-semibold mb-8">Edit Profile</h2>

      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-10">

        {/* LEFT SIDE — FORM */}
        <div className="flex-1 space-y-5">

          {/* NAME */}
          <div>
            <label className="font-medium block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* EMAIL */}
          <div>
            <label className="font-medium block mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* PASSWORD */}
          <div>
            <label className="font-medium block mb-1">New Password</label>
            <input
              type="password"
              name="password"
              placeholder="Leave blank to keep same"
              onChange={handleChange}
              className="w-full border p-2 rounded-lg"
            />
          </div>

          {/* SAVE BUTTON */}
          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-[#FCA311] rounded-lg font-semibold text-black"
            >
              Save Changes
            </button>

            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 border rounded-lg font-medium"
            >
              Cancel
            </button>
          </div>
        </div>

        {/* RIGHT SIDE — PHOTO UPLOAD */}
        <div className="w-40 flex flex-col items-center">

          <div className="w-40 h-40 rounded-full overflow-hidden border shadow">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
          </div>

          <label className="mt-4 w-full">
            <div className="px-4 py-2 bg-[#14213D] text-white text-center rounded-lg cursor-pointer">
              Change Photo
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handlePhotoChange}
            />
          </label>
        </div>
      </form>
    </div>
  );
}
