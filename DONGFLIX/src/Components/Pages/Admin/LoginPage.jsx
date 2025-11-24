import React, { useState } from "react";

import HeaderPage from "../../../Layouts/Header.jsx";
import FooterPage from "../../../Layouts/Footer.jsx";

import loadingIMG from "@/assets/Loading/loadings.gif";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Validation state
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Reset previous errors
    setEmailError("");
    setPasswordError("");

    try {
      const res = await fetch("http://localhost:8000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        // Show errors based on API response
        if (data.detail.includes("email")) {
          setEmailError(data.detail);
        } else if (data.detail.includes("password")) {
          setPasswordError(data.detail);
        } else {
          alert(data.detail || "Login failed");
        }
      } else {
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/profile";
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
          <img
            className="w-[150px] h-[150px] object-cover"
            src={loadingIMG}
            alt="Loading..."
          />
        </div>
      )}

      <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
        <HeaderPage />

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
            <form className="flex flex-col gap-5" onSubmit={handleLogin}>
              {/* Email */}
              <div className="flex flex-col text-left">
                <label className="mb-1 text-sm">Email</label>
                {emailError && (
                  <p className="mb-1 text-sm text-red-500">{emailError}</p>
                )}
                <input
                  type="email"
                  className={`w-full px-4 py-3 bg-[#0e0e0e] border rounded-lg outline-none focus:border-[#00c3ff] transition ${
                    emailError ? "border-red-500 focus:border-red-500" : "border-[#2c2c2c]"
                  }`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>

              {/* Password */}
              <div className="relative flex flex-col text-left">
                <label className="mb-1 text-sm">Password</label>
                {passwordError && (
                  <p className="mb-1 text-sm text-red-500">{passwordError}</p>
                )}
                <input
                  type={showPassword ? "text" : "password"}
                  className={`w-full px-4 py-3 bg-[#0e0e0e] border rounded-lg outline-none focus:border-[#00c3ff] transition pr-10 ${
                    passwordError ? "border-red-500 focus:border-red-500" : "border-[#2c2c2c]"
                  }`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                />
                <span
                  className="absolute right-3 top-[38px] cursor-pointer text-gray-400"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                </span>
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
    </>
  );
}
