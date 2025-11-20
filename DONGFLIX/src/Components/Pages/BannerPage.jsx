import React from "react";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

import pw from '@/assets/Banner/pw.jpg'
import btth from '@/assets/Banner/btth.jpg'
import ri from '@/assets/Banner/ri.jpg'
import sl1 from '@/assets/Banner/sl1.jpg'
import sl2 from '@/assets/Banner/sl2.jpg'
import sw from '@/assets/Banner/sw.jpg'
import ss from '@/assets/Banner/ss.jpg'

import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { faL } from "@fortawesome/free-solid-svg-icons";

export default function BannerPage(){
    return(
        <main className="w-full mx-auto pt-25">
            <Swiper
                spaceBetween={0}
                centeredSlides={true}
                autoplay={{ 
                delay: 2500,
                disableOnInteraction: false,
                }}
                pagination={{ clickable: true }}
                modules={[Autoplay, Pagination]}
                className="overflow-hidden"
            >
                <SwiperSlide>
                <img src={pw} alt="Perfect-World" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={btth} alt="Battle-Through-The-Heavens" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={ri} alt="Renegade-Immortal" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={sl1} alt="Soul-Land-1" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={sl2} alt="Soul-Land-2" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={sw} alt="Sword-Of-Coming" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
                <SwiperSlide>
                <img src={ss} alt="Swallowed-Star" className="w-full h-[500px] object-cover" />
                </SwiperSlide>
            </Swiper>
        </main>
    );
}