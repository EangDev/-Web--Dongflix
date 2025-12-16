import React, { useState, useEffect } from "react";

import UpcomingPage from './UpcomingPage.jsx';
import MoviePage from './MoviePage.jsx';
import LatestSeriesPage from "./LatestPage.jsx";
import PopularTodayPage from './PopularToday.jsx';
import BannerPage from './BannerPage.jsx';
import TrendingPage from "./TrendingPage.jsx";
import TwoDPage from "./TwoDPage.jsx";

{/*Header and Footer Page*/}
import HeaderPage from '../../Layouts/Header.jsx';
import FooterPage from '../../Layouts/Footer.jsx';

export default function HomePage(){
    return(
        <div className="flex flex-col min-h-screen">
            <HeaderPage />
            <BannerPage />
            
            <main className="grow">
                <TrendingPage />
                <PopularTodayPage />
                <UpcomingPage />
                <LatestSeriesPage />
                <MoviePage />
                <TwoDPage />
            </main>

            <FooterPage />
        </div>
    );
}

