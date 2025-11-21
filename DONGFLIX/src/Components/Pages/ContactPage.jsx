import React from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTelegram, faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";

import HeaderPage from "../../Layouts/Header.jsx";
import FooterPage from "../../Layouts/Footer.jsx";

export default function ContactPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc]">
      <HeaderPage />

      {/* Hero Section */}
      <section className="relative px-5 py-20 text-center text-white md:px-20 rounded-2xl overflow-hidden bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a] mt-30">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] top-[-10%] left-[-10%] animate-pulse"></div>
          <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-10%] right-[-10%] animate-pulse"></div>
        </div>

        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-bold font-[Nulshock] mb-4">
            Contact Us
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl">
            Have questions, suggestions, or need support? We’d love to hear from you!
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="max-w-4xl px-5 py-16 mx-auto md:px-20">
        <div className="relative overflow-hidden bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a] rounded-2xl p-10 border border-[#2b2b2b] shadow-md">
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[400px] h-[400px] bg-blue-500/15 rounded-full blur-[130px] top-[-20%] left-[-20%] animate-pulse"></div>
            <div className="absolute w-[350px] h-[350px] bg-purple-500/15 rounded-full blur-[140px] bottom-[-20%] right-[-20%] animate-pulse"></div>
          </div>

          <form className="relative z-10 space-y-5">
            <div>
              <label className="block mb-2 font-semibold">Your Name</label>
              <input
                type="text"
                placeholder="Enter your name"
                className="w-full p-3 bg-[#1e1e1e] rounded-lg border border-[#333] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Email Address</label>
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full p-3 bg-[#1e1e1e] rounded-lg border border-[#333] focus:border-cyan-400 focus:outline-none"
              />
            </div>

            <div>
              <label className="block mb-2 font-semibold">Message</label>
              <textarea
                rows="5"
                placeholder="Write your message..."
                className="w-full p-3 bg-[#1e1e1e] rounded-lg border border-[#333] focus:border-cyan-400 focus:outline-none"
              ></textarea>
            </div>

            <button
              type="submit"
              className="px-8 py-3 bg-[#00c3ff] text-black font-bold rounded-full hover:bg-[#00a3d9] transition-colors w-full md:w-auto"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Contact Info Section */}
      <section className="max-w-5xl px-5 pb-20 mx-auto md:px-20">
        <div className="grid gap-8 text-center md:grid-cols-3">
          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2b2b2b]">
            <button className="mb-5 bg-[#00c3ff] text-black font-bold hover:bg-[#00a3d9] transition-colors">
                <FontAwesomeIcon icon={faEnvelope} /> Email
            </button>
            <p>support@dongflix.com</p>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2b2b2b]">
            <button className="mb-5 bg-[#00c3ff] text-black font-bold hover:bg-[#00a3d9] transition-colors" onClick={() => window.open("https://t.me/+YZzeqRMCP_oxODg1", "_blank")}>
                <FontAwesomeIcon icon={faTelegram} /> Telegram
            </button>
            <p>@DongFlix</p>
          </div>

          <div className="bg-[#1e1e1e] p-6 rounded-xl border border-[#2b2b2b]">
            <button className="mb-5 bg-[#00c3ff] text-black font-bold hover:bg-[#00a3d9] transition-colors" onClick={() => window.open("https://www.facebook.com/EangDev", "_blank")}>
                < FontAwesomeIcon icon={faFacebook} /> Facebook
            </button>
            <p>facebook.com/DongFlix</p>
          </div>
        </div>
      </section>

      <FooterPage />
    </div>
  );
}
