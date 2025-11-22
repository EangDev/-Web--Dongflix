import React from "react";

import HeaderPage from "../../../Layouts/Header";
import FoooterPage from "../../../Layouts/Footer";

export default function RegisterPage(){
    return(
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
            <HeaderPage />

            <div className="flex items-center justify-center px-6 py-20 grow mt-30">
                <div className="relative w-full max-w-md bg-[#1a1a1a] p-8 rounded-2xl shadow-xl border border-white/10">

                    {/* Title */}
                    <h2 className="mb-6 text-2xl font-bold text-center text-white">Create Account</h2>

                    {/* Form */}
                    <form className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block mb-1 text-sm">Username</label>
                            <input 
                                type="text" 
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="Pick a username"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block mb-1 text-sm">Email</label>
                            <input 
                                type="email" 
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="you@example.com"
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block mb-1 text-sm">Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="Create password"
                            />
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label className="block mb-1 text-sm">Confirm Password</label>
                            <input 
                                type="password" 
                                className="w-full px-4 py-2 rounded-lg bg-[#111] border border-white/10 text-white focus:border-blue-500 outline-none"
                                placeholder="Re-enter password"
                            />
                        </div>

                        {/* Terms */}
                        <div className="flex items-center mt-2 space-x-2">
                            <input type="checkbox" className="w-4 h-4" />
                            <span className="text-sm text-gray-300">
                                I agree to the Terms & Conditions
                            </span>
                        </div>

                        {/* Submit Button */}
                        <button className="w-full py-2 mt-4 font-medium text-white transition bg-blue-600 rounded-lg hover:bg-blue-700">
                            Register
                        </button>

                        {/* Link */}
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
