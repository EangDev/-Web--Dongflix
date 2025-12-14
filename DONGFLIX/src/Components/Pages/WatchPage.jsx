import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart, faSquare } from "@fortawesome/free-solid-svg-icons";

import HeaderPage from "../../Layouts/Header";
import FooterPage from "../../Layouts/Footer";
import Comments from "../../Layouts/Comment";
import loadingIMG from "@/assets/Loading/loadings.gif";


export default function WatchPage() {
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();

  const initialEp = parseInt(params.get("ep")) || null;
  const initialUrl = params.get("url");
  const initialImage = params.get("image");

  const [loading, setLoading] = useState(true);
  const [titleDetails, setTitleDetails] = useState({
    title: "",
    postedBy: "Dongflix",
    fanSub: "Dongflix",
    series: "",
    image: initialImage || "",
    description: "",
  });

  const [episodes, setEpisodes] = useState([]);
  const [servers, setServers] = useState({});
  const [currentServer, setCurrentServer] = useState(null);
  const [serverCache, setServerCache] = useState({});
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedEpisode, setSelectedEpisode] = useState(null);
  const hasSetDefaultEpisode = useRef(false);

  const [showFullDescription, setShowFullDescription] = useState(false);

  const EPISODES_PER_PAGE = 30;

  // Fetch episodes, details, and stream
  useEffect(() => {
    if (!initialUrl) return;

    setLoading(true);
    hasSetDefaultEpisode.current = false;

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

        const list = (epData.episodes || []).map((ep) => ({
          ...ep,
          episode_number: Number(ep.episode_number),
          url: ep.link
        }));

        setEpisodes(list);

        if (detailData.title) {
          setTitleDetails(prev => ({
            ...prev,
            title: detailData.title,
            chinese_name: detailData.chinese_name,
            release_date: detailData.details?.released,
            series: detailData.series_title,
            genres: detailData.genres,
            image: detailData.image || prev.image,
            description: detailData.description,

            episode_release_date: detailData.release_date,

            // details
            status: detailData.details?.status,
            network: detailData.details?.network,
            duration: detailData.details?.duration,
            country: detailData.details?.country,
            type: detailData.details?.type,
            episodes: detailData.details?.episodes,
            season: detailData.details?.season,
            censor: detailData.details?.censor,
            related_Ep: detailData.related,
          }));
        }

        if (streamData.source) {
          setServers(streamData.source);
          setCurrentServer(Object.values(streamData.source)[0]);
        }
      } catch (err) {
        console.error("Failed to load:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [initialUrl]);

  // Handle episode click
  const handleEpisodeClick = async (ep, isDefault = false) => {
    if (!ep || !ep.link) return;

    const savedUser = JSON.parse(localStorage.getItem("user") || "null");
    if (!savedUser && !isDefault) {
      alert("Please login to watch");
      navigate("/login");
      return;
    }

    if (!isDefault) {
      setSelectedEpisode(ep.episode_number);
    }

    setParams({ url: ep.link, ep: ep.episode_number });

    if (serverCache[ep.episode_number]) {
      setCurrentServer(serverCache[ep.episode_number]);
      return;
    }

    try {
      const res = await fetch(`http://127.0.0.1:8000/api/anime/stream?url=${encodeURIComponent(ep.link)}`);
      const data = await res.json();
      if (data.source) {
        setCurrentServer(data.source);
        setServerCache(prev => ({ ...prev, [ep.episode_number]: data.source }));
      }
    } catch (err) {
      console.error("Error fetching stream:", err);
    }
  };

  // Set default episode on first load
  useEffect(() => {
    if (!episodes.length || hasSetDefaultEpisode.current) return;

    const sorted = [...episodes].sort((a, b) => a.episode_number - b.episode_number);
    
    const defaultEp = initialEp
      ? sorted.find(e => e.episode_number === initialEp) || sorted[sorted.length - 1]
      : sorted[sorted.length - 1];

    handleEpisodeClick(defaultEp, true);
    setSelectedEpisode(defaultEp.episode_number);

    const index = sorted.findIndex(e => e.episode_number === defaultEp.episode_number);
    setPage(Math.floor(index / EPISODES_PER_PAGE) + 1);

    hasSetDefaultEpisode.current = true;
  }, [episodes, initialEp]);

  // Sync page
  useEffect(() => {
    if (!selectedEpisode) return;
    const index = episodes.findIndex(ep => ep.episode_number === selectedEpisode);
    if (index !== -1) setPage(Math.floor(index / EPISODES_PER_PAGE) + 1);
  }, [selectedEpisode, episodes]);

  // Filter episodes
  const filteredEpisodes = useMemo(() => {
    return episodes.filter(ep => ep.episode_number.toString().includes(search));
  }, [episodes, search]);

  // DESC sorted episodes for UI
  const sortedDesc = useMemo(() => {
    return [...filteredEpisodes].sort((a, b) => b.episode_number - a.episode_number);
  }, [filteredEpisodes]);

  const totalPages = Math.ceil(sortedDesc.length / EPISODES_PER_PAGE);
  
  // Display episodes: sort DESCENDING to show latest first
  const displayedEpisodes = useMemo(() => {
    const start = (page - 1) * EPISODES_PER_PAGE;
    return sortedDesc.slice(start, start + EPISODES_PER_PAGE);
  }, [sortedDesc, page]);

  // FIXED EP range dropdown
  const pageOptions = useMemo(() => {
    const options = [];
    for (let i = 0; i < totalPages; i++) {
    const start = i * EPISODES_PER_PAGE;
    const end = Math.min(start + EPISODES_PER_PAGE - 1, sortedDesc.length - 1);


    const maxEp = sortedDesc[start]?.episode_number || 0;
    const minEp = sortedDesc[end]?.episode_number || 0;


    options.push({ value: i + 1, label: `EP ${maxEp} - ${minEp}` });
    }
    return options;
  }, [sortedDesc, totalPages]);
  
  const descriptionPreview = titleDetails.description.slice(0, 200);
  const fullDescription = titleDetails.description;

  return (
    <div className="flex flex-col min-h-screen bg-[#131313] text-[#e5e5e5]">
        {loading && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
                <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
            </div>
        )}

      <HeaderPage />

      {/* Title Section */}
      <section className="w-full mt-35 px-6 py-6 md:px-16 rounded-2xl relative bg-linear-to-b from-[#050505] via-[#111] to-[#0c0c0c] shadow-lg">
        <h3 className="text-3xl font-extrabold">{titleDetails.title || "Loading..."}</h3>
        <p className="pt-2 text-md">
          Released on <span className="text-blue-400">{titleDetails.release_date}</span>. Posted by{" "}
          <Link to="/" className="text-blue-400">{titleDetails.postedBy}</Link>. Series:{" "}
          <span className="text-blue-400">{titleDetails.series}</span>
        </p>
      </section>

      {/* Video & Episodes */}
      <div className="flex flex-col gap-5 p-6 md:flex-row">
        <div className="flex-1">
          <div className="relative w-full pt-[56.25%] rounded-lg overflow-hidden shadow-lg">
            {currentServer ? (
              <iframe
                src={currentServer}
                title="Video Player"
                allowFullScreen
                className="absolute top-0 left-0 w-full h-full border-0"
              />
            ) : (
              <p>Loading video...</p>
            )}
          </div>
        </div>

        {/* Episodes */}
        <div className="w-full md:w-[500px] bg-[#1a1a1a] rounded-lg p-4 max-h-[80vh] overflow-y-auto shadow-lg">
          <h3 className="mb-3 text-lg font-bold">Available Episodes</h3>
          <input
            type="text"
            placeholder="Search episode..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1); }}
            className="w-full p-2 mb-4 rounded-md bg-[#2b2b2b] text-white"
          />
          <select
            value={page}
            onChange={e => setPage(Number(e.target.value))}
            className="w-full p-2 mb-4 rounded-lg bg-[#2b2b2b] text-white"
          >
            {pageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
          </select>

          <div className="grid grid-cols-5 gap-2">
            {displayedEpisodes.map(ep => (
              <button
                key={ep.episode_number}
                onClick={() => handleEpisodeClick(ep)}
                className={`p-2 text-sm text-center rounded-md ${selectedEpisode === ep.episode_number ? "bg-blue-600" : "bg-[#242424] hover:bg-[#333]"}`}
              >
                {ep.episode_number}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Details */}
      <div className="px-6 md:px-16 py-10 bg-[#141414] rounded-lg mt-6">
        <div className="flex flex-col gap-8 md:flex-row">
          <div className="flex flex-col items-center md:w-[220px]">
            <img
              src={titleDetails.image}
              alt={titleDetails.title}
              className="object-cover w-full rounded-lg shadow-md"
            />
            <button className="flex items-center justify-center w-full gap-2 px-4 py-2 mt-4 font-medium bg-blue-600 rounded-md hover:bg-blue-500">
              <FontAwesomeIcon icon={faHeart} /> Bookmark
            </button>
          </div>
          <div className="flex-1 px-5 mt-6 text-left md:mt-0">
            <h2 className="text-3xl font-bold">{titleDetails.title}</h2>
            <h2 className="text-xl">{titleDetails.chinese_name}</h2>
            <div className="grid grid-cols-1 mt-5 text-sm sm:grid-cols-2 gap-y-2 opacity-90">
              <ul className="space-y-2">
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Status: {titleDetails.status}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Released: {titleDetails.release_date || "Unknown"}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Season: {titleDetails.season || "?"}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Type: {titleDetails.type}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Fansub: {titleDetails.fanSub}</li>
              </ul>
              <ul className="space-y-2">
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Network: {titleDetails.network || "Unknown"}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Duration: {titleDetails.duration}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Country: {titleDetails.country}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Episode: {titleDetails.episodes || episodes.length}</li>
                <li><FontAwesomeIcon icon={faSquare} className="px-2 text-green-300"/>Censor: {titleDetails.censor || "Censored"}</li>
              </ul>
              {/*  Genre */}
              <div className="flex flex-wrap gap-2 mt-4">
                {titleDetails.genres?.length > 0 ? (
                  titleDetails.genres.map((genre, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 text-xs text-green-300 transition-all bg-gray-800 border rounded-full cursor-pointer border-green-300/40 hover:bg-green-300 hover:text-black"
                    >
                      {genre}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-400">No genres available</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="px-6 md:px-16 py-6 bg-[#0d0d0d] rounded-lg mt-4 text-sm leading-relaxed">
        {(showFullDescription ? fullDescription : descriptionPreview).split("\n\n").map((p, i) => (
          <p key={i} className="mb-3">{p}</p>
        ))}
        <button
          onClick={() => setShowFullDescription(!showFullDescription)}
          className="mt-2 text-blue-400 hover:text-blue-300"
        >
          {showFullDescription ? "Hide" : "More"}
        </button>
        
        <Comments />
      </div>
      <FooterPage />
    </div>
  );
}
