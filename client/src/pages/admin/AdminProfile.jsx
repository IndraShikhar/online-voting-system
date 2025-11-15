// src/pages/admin/AdminProfile.jsx

import { Link } from "react-router-dom";

export default function AdminProfile() {
  return (
    <div className="max-w-3xl bg-white p-8 rounded-lg shadow m-5">
      <h2 className="text-2xl font-semibold mb-8">Admin Profile</h2>

      <div className="flex flex-col md:flex-row items-start md:items-center gap-10">

        {/* LEFT SIDE — DETAILS */}
        <div className="flex-1 space-y-3 text-sm">
          <p className="text-lg font-medium">Personal Information</p>

          <div className="space-y-1">
            <p>
              <strong>Name:</strong> Admin User
            </p>
            <p>
              <strong>Email:</strong> admin@example.com
            </p>
            <p>
              <strong>Role:</strong> Super Admin
            </p>
          </div>

          <Link to="/admin/profile/edit" className="mt-4 px-4 py-2 bg-[#FCA311] rounded-lg font-semibold text-black">
            Edit Profile
          </Link>
        </div>

        {/* RIGHT SIDE — PHOTO */}
        <div className="w-40 h-40 rounded-full overflow-hidden border">
          <img
            src="https://via.placeholder.com/150"
            alt="Admin"
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}
