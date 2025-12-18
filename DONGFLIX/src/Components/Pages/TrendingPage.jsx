import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCirclePlay } from "@fortawesome/free-solid-svg-icons";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import loadingIMG from "@/assets/Loading/loadings.gif";

export default function TrendingPage() {
  const navigate = useNavigate();
  const [slider, setSlider] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [resSlider, resTrending] = await Promise.all([
          fetch("http://127.0.0.1:8000/api/anime/slider"),
          fetch("http://127.0.0.1:8000/api/anime/trending"),
        ]);

        const sliderData = await resSlider.json();
        const trendingData = await resTrending.json();

        setSlider(sliderData.data || []);
        setTrending(trendingData.data || []);
      } catch (err) {
        console.error("Trending page error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
        {loading && (
            <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-linear-to-r from-cyan-500 to-blue-500 z-9999">
                <img className="w-[150px] h-[150px] object-cover" src={loadingIMG} alt="Loading..." />
            </div>
        )}
        <section className="grid grid-cols-5 gap-5 px-10 pt-10 pb-10">
            <div className="col-span-4">
                <Swiper
                modules={[Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000 }}
                spaceBetween={40}
                slidesPerView={1}
                >
                    {slider.map((item, idx) => (
                        <SwiperSlide key={idx}>
                            <div
                            className="relative h-[380px] rounded-xl overflow-hidden"
                            style={{
                            backgroundImage: `url(${item.background})`,
                            backgroundSize: "cover",
                            backgroundPosition: "center",
                            }}
                        >
                            <div className="absolute inset-0 bg-linear-to-r from-black via-black/70 to-transparent"/>

                            <div className="relative z-10 grid h-full grid-cols-1 gap-8 px-8 lg:grid-cols-3">
                            <div className="flex flex-col justify-center col-span-2 space-y-2 text-white">
                                <div className="flex items-center gap-3 text-yellow-400">
                                    ⭐ <span className="font-bold">{item.rating}</span>
                                    <span className="text-sm text-gray-300">
                                        {item.release_date}
                                    </span>
                                </div>

                                <h2 className="text-2xl font-extrabold leading-tight text-left">
                                    {item.title}
                                </h2>

                                <div className="flex flex-wrap gap-2">
                                {item.genres?.slice(0, 6).map((genre, i) => (
                                    <span
                                    key={i}
                                    className="px-3 py-1 text-xs font-semibold rounded-full text-cyan-400 bg-cyan-400/10"
                                    >
                                    {genre}
                                    </span>
                                ))}
                                </div>

                                <p className="max-w-xl text-sm leading-relaxed text-left text-gray-300 line-clamp-4">
                                    {item.summary}
                                </p>
                                <div className="text-sm text-left text-gray-300">
                                    <p>
                                        Status:{" "}
                                        <span className="text-cyan-400">{item.status}</span>
                                    </p>
                                    <p>
                                        Type:{" "}
                                        <span className="text-cyan-400">{item.type}</span>
                                    </p>
                                </div>
                                <div className="flex items-center gap-6 mt-4">
                                    <button
                                        onClick={() =>
                                        navigate(
                                            item.url.replace(
                                            "https://donghuastream.org/anime/",
                                            "/anime/"
                                            )
                                        )
                                        }
                                        className="flex items-center gap-2 px-6 py-3 font-semibold text-black bg-yellow-400 rounded-full hover:bg-yellow-300"
                                    >
                                    <FontAwesomeIcon icon={faCirclePlay} />
                                    Watch Now
                                    </button>
                                </div>
                            </div>
                            <div className="items-center justify-end hidden lg:flex">
                                <img
                                src={item.poster}
                                alt={item.title}
                                className="w-[220px] h-[330px] rounded-xl shadow-2xl"
                                />
                            </div>
                            </div>
                        </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
            <div className="col-span-1">
                {trending.map((item, idx) => (
                    <div key={idx}>
                        <div className="relative h-[380px] group hover:shadow-[0_0_15px_#00c3ff55] overflow-hidden cursor-pointer">
                            <img 
                                src={item.image}
                                alt={item.title}
                                className="object-cover w-full h-full transition-all duration-300 rounded-md opacity-60 group-hover:opacity-50"
                            />
                            <FontAwesomeIcon
                                icon={faCirclePlay}
                                className="absolute text-5xl text-[#00c3ff] opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                            />
                            <span className="absolute text-4xl shadow-2xl top-2 right-2">
                                👑
                            </span>
                            <span className="absolute text-3xl font-bold text-left text-yellow-400 left-4 bottom-20">
                            DONGFLIX TRENDING THIS WEEK
                            </span>
                            <h3 className="absolute text-xl text-left bottom-2 left-5">
                                {item.title}
                            </h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    </>
  );
}
