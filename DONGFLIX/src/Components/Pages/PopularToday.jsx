import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import loadingIMG from "@/assets/Loading/loadings.gif";

function PopularToday() {
  const [popularDong, setPopularDong] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/anime/popular");
        const json = await res.json();
        setPopularDong(json.results || []);
      } catch (error) {
        console.error("Error fetching Popular Page API", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <>
      {loading && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
          <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
        </div>
      )}
      <section className="relative h-[520px] mx-auto pt-25 bg-linear-to-b from-black via-gray-900 to-gray-800 rounded-2xl max-w-7xl">
        <div className="absolute inset-0 bg-[url('/pattern.png')] opacity-10 pointer-events-none"></div>

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-8 ml-9">
            <ul className="p-0 m-0 list-none">
              <li className="text-[#ccc] font-bold text-xl flex items-center gap-2">
                <span className="bg-[#bbefff] text-black px-5 py-2 rounded-tl-2xl rounded-br-2xl font-[Nulshock]">
                  Popular
                </span>
                Today
                <FontAwesomeIcon icon={faChevronRight} />
              </li>
            </ul>
          </div>
          <div className="w-[90%] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {popularDong.map((item, index) => (
              <div key={index} className="relative flex flex-col items-center cursor-pointer group">
                <div className="relative w-[200px] h-[250px] overflow-hidden rounded-md bg-[#111]">
                  <img
                    className="object-cover w-full h-full transition-all duration-300 group-hover:opacity-50 group-hover:scale-105"
                    src={item.image}
                    alt={item.title}
                  />
                  <FontAwesomeIcon
                    icon={faCirclePlay}
                    className="absolute text-5xl text-[#00c3ff] opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  />
                  <p className="absolute top-2 right-2 bg-[#0093c2e6] text-white font-bold text-xs px-2 py-1 rounded-md">
                    EP {item.episode || "?"}
                  </p>
                  <p className="absolute top-2 left-2 bg-[#fd8700e6] text-white font-bold text-xs px-2 py-1 rounded-md">
                    {item.type || "?"}
                  </p>
                </div>
                <p className="mt-2 text-center text-sm text-[#ccc] transition-colors duration-300 group-hover:text-[#00c3ff] w-[200px]">
                  {item.title}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default PopularToday;
