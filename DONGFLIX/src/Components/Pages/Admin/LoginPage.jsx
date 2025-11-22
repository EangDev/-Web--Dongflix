import React, { useState } from "react";

import HeaderPage from "../../../Layouts/Header.jsx";
import FooterPage from "../../../Layouts/Footer.jsx";

import loadingIMG from "@/assets/Loading/loadings.gif";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
      <HeaderPage />

      {/* Login Section */}
      <section className="relative flex items-center justify-center flex-1 px-6 py-16 mt-30 md:px-20">
        {/* Glowing background effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] left-[-10%] top-[-10%] animate-pulse"></div>
          <div className="absolute w-[500px] h-[500px] bg-purple-500/20 blur-[130px] bottom-[-10%] right-[-10%] animate-pulse"></div>
        </div>

        {/* Card */}
        <div className="relative z-10 w-full max-w-md p-8 bg-[#1b1b1b]/80 border border-white/10 rounded-2xl backdrop-blur-xl shadow-xl">
          <h1 className="mb-6 text-3xl font-bold text-center text-[#00c3ff] font-[Nulshock]">
            Login
          </h1>

          {/* Form */}
          <form className="flex flex-col gap-5">
            {/* Email */}
            <div className="flex flex-col text-left">
              <label className="mb-1 text-sm">Email</label>
              <input
                type="email"
                className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2c2c2c] rounded-lg outline-none focus:border-[#00c3ff] transition"
                placeholder="Enter your email"
              />
            </div>

            {/* Password */}
            <div className="flex flex-col text-left">
              <label className="mb-1 text-sm">Password</label>
              <input
                type="password"
                className="w-full px-4 py-3 bg-[#0e0e0e] border border-[#2c2c2c] rounded-lg outline-none focus:border-[#00c3ff] transition"
                placeholder="Enter your password"
              />
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 font-bold text-black bg-[#f7c56b] hover:bg-[#e0b05a] rounded-lg transition-all shadow-md hover:shadow-xl flex justify-center items-center"
            >
              {loading ? (
                <img src={loadingIMG} alt="loading" className="h-6" />
              ) : (
                "Login"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-white/10"></div>

          {/* Redirect Links */}
          <p className="text-center text-gray-400">
            Don’t have an account?{" "}
            <a
              href="/register"
              className="text-[#00c3ff] hover:text-[#00eaff] transition"
            >
              Register
            </a>
          </p>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}
