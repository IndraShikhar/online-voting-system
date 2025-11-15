// src/pages/admin/AdminProfile.jsx

export default function AdminProfile() {
  return (
    <div className="max-w-xl bg-white p-6 rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Admin Profile</h2>

      <div className="space-y-2 text-sm">
        <p><strong>Name:</strong> Admin User</p>
        <p><strong>Email:</strong> admin@example.com</p>
        <p><strong>Role:</strong> Super Admin</p>
      </div>

      <button className="mt-6 px-4 py-2 bg-[#FCA311] rounded-lg font-semibold">
        Edit Profile
      </button>
    </div>
  );
}
