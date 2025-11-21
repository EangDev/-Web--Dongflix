import React, {useState, useEffect} from "react";
import HeaderPage from "../../Layouts/Header.jsx";
import FooterPage from "../../Layouts/Footer.jsx";

import pic from "../../assets/Image/founder.png";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc]">
      <HeaderPage />

        <section className="relative px-5 py-20 text-center text-white mt-25 md:px-20 rounded-2xl overflow-hidden bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a]">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] top-[-10%] left-[-10%] animate-pulse"></div>
                <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-10%] right-[-10%] animate-pulse"></div>
            </div>

            <div className="relative z-10">
                <h1 className="mb-4 text-4xl font-bold md:text-5xl font-[Nulshock]">About DongFlix</h1>
                <p className="max-w-2xl mx-auto text-lg md:text-xl">
                    DongFlix is your ultimate platform for discovering and streaming the latest and greatest donghua series and movies. Explore a world of epic adventures, magical realms, and unforgettable stories!
                </p>
            </div>
        </section>

        <section className="px-5 py-16 md:px-20 max-w-4xl mx-auto space-y-4 text-[#cccccc]">
            <p>
                Welcome to DongFlix — your ultimate gateway into the vibrant world of Donghua (Chinese animation)! 🌟 Here, imagination knows no limits, and every story unfolds with breathtaking art, powerful emotion, and epic adventures.
            </p>
            <p>
                At DongFlix, we believe that Donghua deserves the spotlight — from legendary tales like Battle Through the Heavens ⚡ and Soul Land 🌌 to hidden gems waiting to be discovered. Our mission is simple: to bring fans closer to the magic of Chinese animation with high-quality streaming, smooth performance, and zero hassle.
            </p>
            <p>
                💖 Whether you’re a long-time Donghua lover or just starting your journey, we’re here to make every moment unforgettable. 📺 Sit back, explore, and dive deep into worlds filled with heroes, spirits, and timeless legends — only on DongFlix.
            </p>
            <p>
                ✨ DongFlix — Where Legends Come Alive. ✨
            </p>
            <p>
                All of the Videos here belong to Respected Studios. And the Story to Respected Authors/Writers. We are only providing Translation for you to enjoy.
            </p>
            <p>
                We hope you enjoy our Donghua Anime/Chinese Anime as much as we enjoy offering them to you. If you have any questions or comments, please don’t hesitate to contact us.
            </p>

            <p className="mt-8 font-semibold text-[#00c3ff]">Sincerely,</p>
            <p className="font-bold text-[#00c3ff]">[DongFlix]</p>
        </section>

        <section className="px-5 py-16 md:px-20">
            <div className="grid max-w-5xl gap-12 mx-auto md:grid-cols-2">
            <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-[#00c3ff] font-[Nulshock]">Our Mission</h2>
                <p>
                Our mission is to provide anime enthusiasts with a seamless experience for exploring, discovering, and enjoying high-quality donghua content. We aim to connect fans with stories that inspire, entertain, and captivate.
                </p>
            </div>
            <div className="bg-[#1e1e1e] p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow">
                <h2 className="text-2xl font-bold mb-4 text-[#00c3ff] font-[Nulshock]">Our Vision</h2>
                <p>
                We envision a world where every donghua fan can easily access their favorite shows and movies anytime, anywhere. We strive to grow the donghua community while celebrating creativity and passion in animation.
                </p>
            </div>
            </div>
        </section>

        <section className="py-16 px-5 md:px-20 bg-[#1a1a1a]">
            <h2 className="text-3xl font-bold text-center mb-12 text-[#00c3ff] font-[Nulshock]">
                Meet the Team
            </h2>
            <div className="flex justify-center">
                <div className="relative overflow-hidden rounded-2xl p-6 text-center hover:scale-105 transform transition-all flex flex-col items-center px-20 py-15 bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a] shadow-lg border border-[#2b2b2b]">
                    <div className="absolute inset-0 pointer-events-none">
                        <div className="absolute w-[300px] h-[300px] bg-blue-500/20 rounded-full blur-[120px] top-[-15%] left-[-20%] animate-pulse"></div>
                        <div className="absolute w-[250px] h-[250px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-10%] right-[-15%] animate-pulse"></div>
                    </div>

                    <div className="relative z-10 flex flex-col items-center">
                        <div className="flex items-center justify-center w-32 h-32 mb-4 rounded-full">
                            <img
                                className="object-cover min-w-full min-h-full"
                                src={pic}
                                alt="Eang Dev"
                            />
                        </div>

                        <h3 className="mb-3 text-xl font-semibold uppercase font-[Nulshock]">
                            Kimeang Horn
                        </h3>
                        <p className="text-sm text-cyan-500">
                            Founder - Developer - Designer
                        </p>
                    </div>
                </div>
            </div>
        </section>
        
        <section className="relative px-5 py-16 text-center text-white md:px-20 rounded-2xl overflow-hidden bg-linear-to-b from-[#050505] via-[#111] to-[#0a0a0a]">
        <div className="absolute inset-0 pointer-events-none">
            <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] top-[-10%] left-[-10%] animate-pulse"></div>
            <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-10%] right-[-10%] animate-pulse"></div>
        </div>
        <div className="relative z-10">
            <h2 className="mb-4 text-3xl font-bold">Join Our Community</h2>
            <p className="max-w-xl mx-auto mb-6">
                Connect with fellow donghua fans, share your favorite series, and stay updated with the latest releases.
            </p>
            <button className="px-8 py-3 bg-[#00c3ff] text-black font-bold rounded-full hover:bg-[#00a3d9] transition-colors">
                Get Started
            </button>
        </div>
        </section>

      <FooterPage />
    </div>
  );
}
