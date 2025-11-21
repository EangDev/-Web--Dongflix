import React from "react";

import HeaderPage from "../../Layouts/Header.jsx";
import FooterPage from "../../Layouts/Footer.jsx";

export default function SupportPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
      <HeaderPage />

      {/* Support Section */}
      <section className="relative flex-1 px-6 py-20 md:px-20 mt-30">
        {/* Background glowing visuals */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-[400px] h-[400px] bg-blue-500/20 rounded-full blur-[120px] top-[-5%] left-[-5%] animate-pulse max-w-full"></div>
          <div className="absolute w-[350px] h-[350px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-5%] right-[-5%] animate-pulse max-w-full"></div>
        </div>

        {/* Main Content */}
        <div className="relative z-10 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-[#00c3ff] font-[Nulshock] mb-6">
            Support DongFlix
          </h1>
          <p className="mb-10 text-lg text-gray-300">
            If you enjoy DongFlix and want to support future development,
            server hosting, and improvements, consider buying us a coffee!
            Your support means a lot and helps us keep the platform running.
          </p>

          {/* Card */}
          <div className="relative bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a] rounded-2xl p-8 md:p-10 shadow-lg border border-white/10 flex flex-col items-center overflow-hidden">
            {/* Glowing elements inside the card */}
            <div className="absolute inset-0 pointer-events-none">
              <div className="absolute w-[200px] h-[200px] bg-blue-500/20 rounded-full blur-[100px] top-[-10%] left-[-10%] animate-pulse max-w-full"></div>
              <div className="absolute w-[180px] h-[180px] bg-purple-500/20 rounded-full blur-[110px] bottom-[-10%] right-[-10%] animate-pulse max-w-full"></div>
            </div>

            {/* Buy Me a Coffee Button */}
            <a
              href="https://buymeacoffee.com/dongflix"
              target="_blank"
              rel="noopener noreferrer"
              className="px-8 py-4 rounded-lg bg-[#f7c56b] hover:bg-[#e3b059] text-black font-bold text-lg transition-all shadow-md hover:shadow-xl z-10"
            >
              ☕ Buy Me a Coffee
            </a>

            {/* Small description */}
            <p className="z-10 max-w-md mt-6 text-sm text-gray-400">
              We run a small ads and we want to keep DongFlix clean and enjoyable.
              Supporting helps us maintain the project and keep improving it.
            </p>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}
