import React, { useState } from "react";
import HeaderPage from "../../../Layouts/Header";
import FoooterPage from "../../../Layouts/Footer";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPW, setConfirmPW] = useState("");
    const [termsAccepted, setTermsAccepted] = useState(false);

    // Toggle password visibility
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPW, setShowConfirmPW] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        if (!username || !email || !password || !confirmPW) {
            alert("Please fill in all fields.");
            return;
        }

        if (password !== confirmPW) {
            alert("Passwords do not match.");
            return;
        }

        if (!termsAccepted) {
            alert("You must accept the Terms & Conditions.");
            return;
        }

        try {
            const res = await fetch("http://127.0.0.1:8000/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username, email, password }),
            });

            const data = await res.json();

            if (res.ok) {
                alert(data.message || "Account created successfully!");
                window.location.href = "/login";
            } else {
                alert(data.detail || "Registration failed!");
            }
        } catch (err) {
            console.error("Registration error:", err);
            alert("Unable to connect to server.");
        }
    };

    return (
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
            <HeaderPage />

            <div className="flex items-center justify-center px-6 py-20 grow mt-30">
                <div className="relative w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-white/10">

                    <h2 className="mb-6 text-2xl font-bold text-center text-white">Create Account</h2>

                    <form className="space-y-4" onSubmit={handleRegister}>
                        {/* Username */}
                        <div>
                            <label className="block px-2 mb-1 text-sm text-left">Username</label>
                            <input
                                type="text"
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block px-2 mb-1 text-sm text-left">Email</label>
                            <input
                                type="email"
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>

                        {/* Password */}
                        <div className="relative">
                            <label className="block px-2 mb-1 text-sm text-left">Password</label>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="Create password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <span
                                className="absolute text-gray-400 cursor-pointer right-3 top-8"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        {/* Confirm Password */}
                        <div className="relative">
                            <label className="block px-2 mb-1 text-sm text-left">Confirm Password</label>
                            <input
                                type={showConfirmPW ? "text" : "password"}
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="Re-enter password"
                                value={confirmPW}
                                onChange={(e) => setConfirmPW(e.target.value)}
                            />
                            <span
                                className="absolute text-gray-400 cursor-pointer right-3 top-8"
                                onClick={() => setShowConfirmPW(!showConfirmPW)}
                            >
                                <FontAwesomeIcon icon={showConfirmPW ? faEyeSlash : faEye} />
                            </span>
                        </div>

                        {/* Terms */}
                        <div className="flex items-center mt-2 space-x-2">
                            <input
                                type="checkbox"
                                className="w-4 h-4"
                                checked={termsAccepted}
                                onChange={(e) => setTermsAccepted(e.target.checked)}
                            />
                            <span className="text-sm text-gray-300">
                                I agree to the Terms & Conditions
                            </span>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 mt-4 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Register
                        </button>

                        <p className="mt-4 text-sm text-center text-gray-400">
                            Already have an account?{" "}
                            <a href="/login" className="text-blue-400 hover:underline">
                                Login
                            </a>
                        </p>
                    </form>
                </div>
            </div>

            <FoooterPage />
        </div>
    );
}
