import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faHeart, faL} from "@fortawesome/free-solid-svg-icons";

import HeaderPage from "../../Layouts/Header";
import FooterPage from "../../Layouts/Footer";

import loadingIMG from "@/assets/Loading/loadings.gif";

export default function WatchPage() {
    const navigate = useNavigate();
    const  [loading, setLoading] = useState(true);
    const [params, setParams] = useSearchParams();
    const initialEp = parseInt(params.get("ep")) || null;
    const initialUrl = params.get("url");
    const initialImage = params.get("image");
    
    const [titleDetails, setTitleDetails] = useState({
        title: "",
        releaseDate: "",
        postedBy: "Dongflix",
        series: "",
        image: initialImage || "",
        description: "",
    });

    const descriptionPreview = titleDetails.description.slice(0, 200);
    const fullDescription = titleDetails.description;
    const [showFullDescription, setShowFullDescription] = useState(false);
    
    const [servers, setServers] = useState({});
    const [currentServer, setCurrentServer] = useState(null);
    const [episodes, setEpisodes] = useState([]);
    const [serverCache, setServerCache] = useState({});
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState("");

    const EPISODES_PER_PAGE = 30;
    
    const [selectedEpisode, setSelectedEpisode] = useState(null);

    const hasSetDefaultEpisode = useRef(false);

    const [user, setUser] = useState(() => {
        const savedUser = localStorage.getItem("user");
        return savedUser ? JSON.parse(savedUser) : null;
    });
    
    const handleEpisodeClick = async (ep, isDefault = false) => {
        if (!ep.link) return;

        const savedUser = JSON.parse(localStorage.getItem("user"));
        if (!savedUser && !isDefault) {
            alert("Please login to watch");
            navigate("/login");
            return;
        }

        // Only user clicks update the selected state
        if (!isDefault) {
            setSelectedEpisode(ep.episode_number);
            navigate(`?url=${encodeURIComponent(ep.link)}&ep=${ep.episode_number}`, { replace: true });
        }

        setParams({ url: ep.link, ep: ep.episode_number });

        // Cached stream?
        if (serverCache[ep.episode_number]) {
            setCurrentServer(serverCache[ep.episode_number]);
            return;
        }

        try {
            const res = await fetch(`http://127.0.0.1:8000/api/anime/stream?url=${encodeURIComponent(ep.link)}`);
            const data = await res.json();
            if (data.source) {
                setCurrentServer(data.source);
                setServerCache(prev => ({
                    ...prev,
                    [ep.episode_number]: data.source
                }));
            }
        } catch (err) {
            console.error("Error fetching stream:", err);
        }
    };

    const currentAnime = {
        title: titleDetails.title,
        link: initialUrl,
        image: titleDetails.image,
    }
    
    useEffect(() => {
        if (!initialUrl) return;

        setLoading(true);

        async function loadData() {
            try {
                const [epRes, detailRes, streamRes] = await Promise.all([
                    fetch(`http://127.0.0.1:8000/api/anime/episodes?url=${encodeURIComponent(initialUrl)}`),
                    fetch(`http://127.0.0.1:8000/api/anime/detail?url=${encodeURIComponent(initialUrl)}`),
                    fetch(`http://127.0.0.1:8000/api/anime/stream?url=${encodeURIComponent(initialUrl)}`)
                ]);

                const epData = await epRes.json();
                const detailData = await detailRes.json();
                const streamData = await streamRes.json();

                // --- Set Episodes ---
                const list = (epData.episodes || []).map((ep, idx) => ({
                    ...ep,
                    episode_number: ep.episode_number || idx + 1,
                    url: ep.link,
                }));
                setEpisodes(list);

                // --- Episode Page Calculation ---
                const currentEp = list.findIndex(ep =>
                    initialUrl.includes(ep.link.split("/").pop())
                );
                if (currentEp !== -1) {
                    const currentPage = Math.floor(currentEp / EPISODES_PER_PAGE) + 1;
                    setPage(currentPage);
                }

                // --- Set Details ---
                if (detailData.title) {
                    setTitleDetails(prev => ({
                        ...prev,
                        title: detailData.title,
                        releaseDate: detailData.release_date,
                        series: detailData.series_title,
                        image: detailData.image || prev.image,
                        description: detailData.description,
                        status: detailData.details?.status,
                        type: detailData.details?.type,
                        episodes: detailData.details?.episodes,
                        studio: detailData.details?.studio,
                        duration: detailData.details?.duration
                    }));
                }

                // --- Set Stream ---
                if (streamData.source) {
                    setServers(streamData.source);
                    setCurrentServer(Object.values(streamData.source)[0]);
                }
            } catch (err) {
                console.error("Failed to load:", err);
            }

            // ALL API DONE → STOP LOADING
            setLoading(false);
        }

        loadData();
    }, [initialUrl]);

    
    useEffect(() => {
        if (!initialUrl || episodes.length === 0 || hasSetDefaultEpisode.current) return;

        const sorted = [...episodes].sort((a, b) => a.episode_number - b.episode_number);

        let defaultEp;
        if (initialEp) {
            defaultEp = sorted.find(e => e.episode_number === initialEp) || sorted[sorted.length - 1];
        } else {
            defaultEp = sorted[sorted.length - 1];
        }

        handleEpisodeClick(defaultEp, true);
        setSelectedEpisode(defaultEp.episode_number);

        // Now page based on index, not episode number
        const index = sorted.findIndex(e => e.episode_number === defaultEp.episode_number);
        setPage(Math.floor(index / EPISODES_PER_PAGE) + 1);

        hasSetDefaultEpisode.current = true;
    }, [episodes, initialUrl]);


    useEffect(() => {
        if (!selectedEpisode || episodes.length === 0) return;

        const index = episodes.findIndex(ep => ep.episode_number === selectedEpisode);
        if (index === -1) return;

        const newPage = Math.floor(index / EPISODES_PER_PAGE) + 1;
        if (newPage !== page) setPage(newPage);
    }, [selectedEpisode, episodes]);

    // Filter episodes by search
    const filteredEpisodes = useMemo(() => {
        return episodes.filter(ep =>
            ep.episode_number.toString().includes(search)
        );
    }, [episodes, search]);

    const totalPages = Math.ceil(filteredEpisodes.length / EPISODES_PER_PAGE);
    const displayedEpisodes = useMemo(() => {
        const start = (page - 1) * EPISODES_PER_PAGE;
        return filteredEpisodes
            .slice(start, start + EPISODES_PER_PAGE)
            .sort((a, b) => (a.episode_number || 0) - (b.episode_number || 0));
    }, [filteredEpisodes, page]);

    return (
        <div className="flex flex-col min-h-screen bg-[#131313] text-[#e5e5e5]">
            {loading && (
                <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
                    <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
                </div>
            )}

            <HeaderPage />

            <section className="w-full mt-35 px-6 py-6 md:px-16 rounded-2xl relative overflow-hidden bg-linear-to-b from-[#050505] via-[#111] to-[#0c0c0c] shadow-lg">
                {/* Glow Effects */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-[120px] top-[-20%] left-[-10%]"></div>
                    <div className="absolute w-[400px] h-[400px] bg-purple-500/20 rounded-full blur-[130px] bottom-[-20%] right-[-10%]"></div>
                </div>

                <h3 className="relative z-10 text-3xl font-extrabold">
                    {titleDetails.title || "Loading..."}
                </h3>

                <p className="relative z-10 pt-2 text-md">
                    Released on <span className="text-blue-400">{titleDetails.releaseDate}</span> . Posted by{" "}
                    <Link to="/" className="text-blue-400 hover:text-blue-300">{titleDetails.postedBy}</Link> . Series:{" "}
                    <a href="#" className="text-blue-400 hover:text-blue-300">{titleDetails.series}</a>
                </p>
            </section>
            
            <div className="flex flex-col gap-5 p-6 md:flex-row">
                <div className="flex-1">
                    <div className="relative w-[900px] pt-[56.25%] rounded-lg overflow-hidden shadow-lg">
                        {currentServer ? (
                            <iframe
                                src={currentServer}
                                frameBorder="0"
                                allowFullScreen
                                title="Video Player"
                                className="absolute top-0 left-0 w-full h-full border-0"
                            />
                        ) : (
                            <p>Loading video...</p>
                        )}
                    </div>
                </div>
                {/* Episode List */}
                <div className="w-full md:w-[500px] bg-[#1a1a1a] rounded-lg p-4 max-h-[80vh] overflow-y-auto shadow-lg">
                    <h3 className="mb-3 text-lg font-bold">Available Episodes</h3>

                    {/* Search */}
                    <input
                        type="text"
                        placeholder="Search episode..."
                        className="w-full bg-[#2b2b2b] text-white p-2 rounded-md mb-4"
                        value={search}
                        onChange={e => {
                            setSearch(e.target.value);
                            setPage(1);
                        }}
                    />

                    {/* Episode Page Selector */}
                    <select
                        className="w-full bg-[#2b2b2b] text-white p-2 rounded-lg mb-4"
                        value={page}
                        onChange={(e) => setPage(Number(e.target.value))}
                    >
                        {Array.from({ length: totalPages }, (_, i) => (
                            <option key={i} value={i + 1}>
                                EP {(i * EPISODES_PER_PAGE) + 1} - {Math.min((i + 1) * EPISODES_PER_PAGE, filteredEpisodes.length)}
                            </option>
                        ))}
                    </select>
                    {/* Episodes Grid */}
                    <div className="grid grid-cols-5 gap-2">
                        {displayedEpisodes.map((ep, index) => {
                            if (!ep.link) return null;
                            const isActive = selectedEpisode === ep.episode_number;
                            return(
                              <button
                                    key={index}
                                    onClick={() => handleEpisodeClick(ep)}
                                    className={`p-2 rounded-md text-center text-sm 
                                    ${isActive
                                        ? "bg-blue-600" 
                                        : "bg-[#242424] hover:bg-[#333]"}`}
                                >
                                    {ep.episode_number || index + 1}
                                </button>  
                            );
                        })}
                    </div>
                </div>

            </div>
            {/* Detail Section */}
            <div className="px-6 md:px-16 py-10 bg-[#141414] rounded-lg mt-6">

            <div className="gap-8 md:flex">
                <div className="flex flex-col items-center md:w-[220px]">
                <img 
                    src={titleDetails.image || "Loading..."}
                    alt={titleDetails.title}
                    className="object-cover w-full rounded-lg shadow-md"
                />

                <button className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 font-medium bg-blue-600 rounded-md hover:bg-blue-500">
                    <FontAwesomeIcon icon={faHeart}/>
                    Bookmark
                </button>
                </div>

                {/* Right: All metadata */}
                <div className="flex-1 px-5 mt-6 text-left md:mt-0">
                
                {/* Title */}
                <h2 className="text-3xl font-bold">{titleDetails.title || "Loading..."}</h2>
                <p className="text-gray-400">{titleDetails.title || "Loading..."}</p>

                {/* Rows of info */}
                <div className="grid grid-cols-1 mt-10 text-sm sm:grid-cols-2 gap-y-2 opacity-90">
                    <ul className="space-y-5">
                    <li>Status: {titleDetails.status || "Loading..."}</li>
                    <li>Release: {titleDetails.releaseDate || "Loading..."}</li>
                    <li>Type: {titleDetails.type || "Loading..."}</li>
                    </ul>

                    <ul className="space-y-5">
                    <li>Studio: {titleDetails.studio || "Loading..."}</li>
                    <li>Duration: {titleDetails.duration || "Loading..."}</li>
                    <li>Episodes: {titleDetails.episodes || episodes.length || "Loading..."}</li>
                    </ul>
                </div>
                </div>
            </div>
            </div>

            {/* Description Section (moved below everything) */}
            <div className="px-6 md:px-16 py-6 bg-[#0d0d0d] rounded-lg mt-4 text-sm leading-relaxed">

            {(showFullDescription ? fullDescription : descriptionPreview || "Loading...")
                .split("\n\n")
                .map((para, idx) => (
                <p key={idx} className="mb-3">
                    {para.trim()}
                </p>
                ))}

            <button
                onClick={() => setShowFullDescription(!showFullDescription)}
                className="mt-2 text-blue-400 hover:text-blue-300"
            >
                {showFullDescription ? "Hide" : "More"}
            </button>
            </div>

            <FooterPage />
        </div>
    );
}
