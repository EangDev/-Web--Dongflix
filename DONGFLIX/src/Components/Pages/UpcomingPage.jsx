import React, { useState, useEffect } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronRight, faCirclePlay } from '@fortawesome/free-solid-svg-icons';

import loadingIMG from "@/assets/Loading/loadings.gif";

export default function UpcomingPage() {
  const [upcomingDong, setUpcomingDong] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUpcoming = async () => {
      try {
        const res = await fetch("http://127.0.0.1:8000/api/anime/upcoming");
        if (!res.ok) throw new Error("Network response was not ok");
        const json = await res.json();
        setUpcomingDong(json.results || []);
      } catch (error) {
        console.error("Error fetching Upcoming Page API", error);
      } finally {
        setLoading(false);
      }
    };
    fetchUpcoming();
  }, []);

  return (
    <>
        {loading && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
                <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
            </div>
        )}

      <section className="w-full min-h-screen pt-15 bg-linear-to-b from-black via-gray-900 to-black">
        <div className="max-w-6xl mx-auto">
            <ul className="p-0 m-0 list-none">
                <li className="text-[#ccc] font-bold text-xl flex items-center gap-2">
                    <span className="bg-[#bbefff] text-black px-5 py-2 rounded-tl-2xl rounded-br-2xl font-[Nulshock]">
                        Upcoming
                    </span>
                        Series
                    <FontAwesomeIcon icon={faChevronRight}/>
                </li>
            </ul>

          <Swiper
            modules={[Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3000 }}
            spaceBetween={40}
            slidesPerView={1}
          >
            {upcomingDong.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="flex flex-col items-center gap-10 px-6 py-10 shadow-md lg:flex-row bg-gray-900/30 rounded-xl ">
                    <div className="relative w-[250px] h-[330px] rounded-md overflow-hidden shadow-xl cursor-pointer group hover:shadow-[0_0_15px_#00c3ff55]">
                        <img
                        src={item.image}
                         className="object-cover w-full h-full transition-all duration-300 group-hover:opacity-50 group-hover:scale-105 "
                        alt={item.title}
                        />
                        <FontAwesomeIcon
                            icon={faCirclePlay}
                             className="absolute text-5xl text-[#00c3ff] opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                    </div>

                  {/* Details */}
                  <div className="max-w-xl mb-20 text-white">
                    <h2 className="mb-2 text-3xl font-extrabold text-left">
                      {item.title}
                    </h2>
                    <h2 className="mb-2 text-xl text-left">
                      {item.chinese}
                    </h2>
                    
                    <p className="mt-3 text-sm leading-relaxed text-left text-gray-300">
                      Status:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.status || "Unknown"}
                      </span>
                    </p>

                    <p className="mt-1 text-sm text-left text-gray-300">
                      Type:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.type || "?"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-left text-gray-300">
                      Genres:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.genres || "?"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-left text-gray-300">
                      Studio:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.studio || "?"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-left text-gray-300">
                      Duration:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.duration || "?"}
                      </span>
                    </p>
                    <p className="mt-1 text-sm text-left text-gray-300 max-h-5">
                      Description:{" "}
                      <span className="font-semibold text-cyan-400">
                        {item.description || "?"}
                      </span>
                    </p>
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>
    </>
  );
}
