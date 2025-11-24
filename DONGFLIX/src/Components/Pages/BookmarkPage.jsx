import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

import HeaderPage from "../../Layouts/Header.jsx";
import FooterPage from "../../Layouts/Footer.jsx";

import loadingIMG from "@/assets/Loading/loadings.gif";

export default function BookmarkPage() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [bookmarks, setBookmarks] = useState([]);

  const [user] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // Fetch bookmarks if logged in
  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchBookmarks = async () => {
      try {
        const res = await fetch(
          `http://127.0.0.1:8000/api/bookmarks/${user.user_id}`
        );
        const data = await res.json();
        setBookmarks(data || []);
      } catch (err) {
        console.error("Failed to fetch bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [user]);

  const handleWatch = (item) => {
    if (!item?.link) return;
    navigate(
      `/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(
        item.image || item.thumbnail
      )}`
    );
  };

  return (
    <>
        {loading && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
                <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
            </div>
        )}
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc] overflow-x-hidden">
            <HeaderPage />

            {/* Hero Section */}
            <section className="relative px-6 py-20 overflow-hidden text-center text-white mt-30 md:px-20 rounded-2xl">
                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[500px] h-[500px] bg-blue-500/20 blur-[120px] top-[-10%] left-[-10%] animate-pulse"></div>
                <div className="absolute w-[450px] h-[450px] bg-purple-500/20 blur-[130px] bottom-[-10%] right-[-10%] animate-pulse"></div>
                </div>

                <div className="relative z-10">
                <h1 className="text-4xl md:text-5xl font-bold font-[Nulshock]">
                    Your Bookmarks
                </h1>
                <p className="max-w-2xl mx-auto mt-3 text-lg text-gray-300">
                    Quickly access all the donghua you’ve saved to watch later.
                </p>
                </div>
            </section>

            {/* Content Section */}
            <section className="relative flex-1 max-w-6xl px-6 py-16 mx-auto md:px-20">
                {/* Background Glow */}
                <div className="absolute inset-0 pointer-events-none">
                <div className="absolute w-[350px] h-[350px] bg-blue-500/15 blur-[120px] top-[10%] left-[-5%] animate-pulse"></div>
                <div className="absolute w-[350px] h-[350px] bg-purple-500/15 blur-[130px] bottom-[10%] right-[-5%] animate-pulse"></div>
                </div>

                {/* Not logged in */}
                {!loading && !user && (
                <div className="relative z-10 text-center py-20 bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold text-red-400">
                    Please Log In
                    </h2>
                    <p className="max-w-md mx-auto mb-6 text-gray-400">
                    You must be signed in to view your bookmarks.
                    </p>

                    <Link
                    to="/login"
                    className="px-6 py-2 font-bold transition bg-blue-600 rounded-lg hover:bg-blue-700"
                    >
                    Log In
                    </Link>
                </div>
                )}

                {/* No bookmarks */}
                {!loading && user && bookmarks.length === 0 && (
                <div className="relative z-10 text-center py-20 bg-[#1b1b1b] border border-white/10 rounded-2xl shadow-lg">
                    <h2 className="mb-4 text-2xl font-bold text-cyan-400">
                    No Bookmarks Yet
                    </h2>
                    <p className="max-w-md mx-auto text-gray-400">
                    Bookmark shows will appear here. Start adding your favorite donghua!
                    </p>
                </div>
                )}

                {/* Bookmarks Grid */}
                {!loading && user && bookmarks.length > 0 && (
                <div className="relative z-10 grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {bookmarks.map((item, index) => (
                    <div
                        key={index}
                        className="bg-[#1b1b1b] border border-[#2c2c2c] rounded-2xl shadow-lg overflow-hidden hover:border-blue-500 transition"
                    >
                        <img
                        src={item.image || item.thumbnail}
                        alt={item.title}
                        className="object-cover w-full h-48"
                        />

                        <div className="p-4">
                        <h3 className="mb-3 text-lg font-bold text-white line-clamp-2">
                            {getCleanTitle(item.title)}
                        </h3>

                        <button
                            onClick={() => handleWatch(item)}
                            className="w-full py-2 font-semibold transition bg-blue-600 rounded-lg hover:bg-blue-700"
                        >
                            Watch
                        </button>
                        </div>
                    </div>
                    ))}
                </div>
                )}
            </section>

            <FooterPage />
        </div>
    </>
  );
}
