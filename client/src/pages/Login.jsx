import React, { useEffect } from "react";
import LoginForm from "../components/LoginForm";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
export default function LoginPage() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === 'admin') navigate('/admin/dashboard');
      else navigate('/voter/dashboard');
    }
  }, [user, navigate]);
  return (
    <div className="dark min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">

      {/* LEFT COOL SECTION */}
      <div className="relative hidden lg:flex items-center justify-center bg-gradient-to-br 
        from-indigo-600 via-purple-600 to-blue-600 text-white overflow-hidden 
        dark:from-indigo-700 dark:via-purple-700 dark:to-blue-700 p-10">

        {/* Floating gradient blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-10 -left-10 h-48 w-48 rounded-full bg-white/10 blur-2xl animate-pulse"></div>
          <div className="absolute bottom-0 right-0 h-64 w-64 rounded-full bg-white/10 blur-3xl animate-bounce"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-lg text-center space-y-6">
          <h1 className="text-5xl font-extrabold drop-shadow-lg leading-tight">
            Welcome Back to
            <span className="block text-yellow-300">SmartVote</span>
          </h1>

          <p className="text-lg text-white/90 font-light">
            Secure • Fast • Transparent
            Experience the future of digital voting.
          </p>

          <div className="flex justify-center mt-6">
            <div className="h-44 w-44 rounded-2xl bg-white/10 backdrop-blur-md border 
              border-white/20 shadow-xl flex items-center justify-center">
              <span className="text-6xl">🗳️</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT LOGIN FORM - always visible */}
      <div className="flex items-center justify-center p-6 sm:p-10">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </div>

    </div>
  );
}
