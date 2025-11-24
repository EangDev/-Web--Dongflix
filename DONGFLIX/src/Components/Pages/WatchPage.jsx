import React, { useState, useEffect } from "react";

import HeaderPage from "../../Layouts/Header";
import FooterPage from "../../Layouts/Footer";

export default function WatchPage(){

    // Example dummy data – replace with your own API data
    const [anime, setAnime] = useState({
        title: "Battle Through The Heavens",
        description: "A young man starts his journey to become powerful.",
        genres: ["Action", "Adventure", "Fantasy"],
        episodes: Array.from({ length: 20 }, (_, i) => `Episode ${i + 1}`)
    });

    const [selectedEpisode, setSelectedEpisode] = useState(1);

    return (
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#cccccc]">
            <HeaderPage />

            <div className="flex flex-col flex-1 w-full p-4 mx-auto space-y-6 max-w-7xl mt-35">
                <div className="flex w-full h-[100px] bg-amber-50 rounded-2xl">
                    
                </div>
                <div className="flex flex-col gap-5 lg:flex-row">
                    <div className="flex-1 overflow-hidden bg-black border border-gray-600 rounded-lg">
                        <iframe
                            className="w-full h-[400px] md:h-[500px]"
                            src={`https://example.com/episode/${selectedEpisode}`}
                            allowFullScreen
                        ></iframe>
                    </div>

                    {/* RIGHT – EPISODE SELECTOR */}
                    <div className="w-full lg:w-64 bg-[#1e1e1e] rounded-lg border border-gray-600 p-4 space-y-2">
                        <h2 className="text-lg font-bold mb-2 text-[#00c3ff]">Episodes</h2>

                        <div className="max-h-[500px] overflow-y-auto space-y-2 pr-1">
                            {anime.episodes.map((ep, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedEpisode(index + 1)}
                                    className={`w-full px-3 py-2 rounded text-left text-sm 
                                        ${selectedEpisode === index + 1 
                                            ? "bg-[#00c3ff] text-black font-bold" 
                                            : "bg-[#2b2b2b] hover:bg-[#3a3a3a]"}`}
                                >
                                    {ep}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="bg-[#1e1e1e] border border-gray-600 rounded-lg p-5 space-y-3">

                    <div className="flex flex-col gap-5 sm:flex-row">
                        <div className="w-full sm:w-40">
                            <img
                                src="https://example.com/anime-cover.jpg"
                                alt={anime.title}
                                className="object-cover w-full rounded-lg"
                            />
                        </div>

                        {/* RIGHT: TEXT DETAIL */}
                        <div className="flex-1 space-y-3">
                            <h1 className="text-2xl font-bold text-[#00c3ff]">
                                {anime.title}
                            </h1>

                            <p className="text-sm text-gray-300">
                                {anime.description}
                            </p>

                            <div className="flex flex-wrap gap-2">
                                {anime.genres.map((g, i) => (
                                    <span
                                        key={i}
                                        className="px-2 py-1 bg-[#2b2b2b] text-xs rounded"
                                    >
                                        {g}
                                    </span>
                                ))}
                            </div>
                        </div>

                    </div>
                </div>

            </div>

            <FooterPage />
        </div>
    );
}
