import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

import HeaderPage from "../../../Layouts/Header";
import FooterPage from "../../../Layouts/Footer";

export default function ProfilePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen text-white">
        Please login first.
      </div>
    );
  }

  return (
  <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
    <HeaderPage />

    <div className="flex flex-1 gap-6 px-4 py-10">
      <section className="w-full md:w-1/3 bg-[#1e1e1e] p-6 rounded-lg shadow-lg flex flex-col items-center mt-35">
        <h1 className="text-3xl font-bold text-[#00c3ff] mb-6">
          Welcome, {user.username}!
        </h1>

        <div className="w-20 h-20 rounded-full bg-[#00c3ff] flex items-center justify-center text-black font-bold text-4xl mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>

        <p className="text-lg">{user.email}</p>

        <button
          onClick={handleLogout}
          className="px-4 py-2 mt-6 text-white bg-red-600 rounded hover:bg-red-500"
        >
          Logout
        </button>
      </section>
      <section className="w-full md:w-2/3 bg-[#1e1e1e] p-6 rounded-lg shadow-lg mt-35">
        <h2 className="text-2xl font-bold text-[#00c3ff] mb-4">
          Recently Watched
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">

          {/* Sample display cards – Replace with dynamic map */}
          {[1, 2, 3, 4].map((item, i) => (
            <div key={i} className="bg-[#2a2a2a] p-3 rounded-lg shadow hover:bg-[#333] cursor-pointer transition">
              <div className="w-full mb-2 bg-gray-700 rounded h-50"></div>
              <p className="text-sm text-center">Episode {i + 1}</p>
            </div>
          ))}

        </div>
      </section>
    </div>

    <FooterPage />
  </div>
);

}
