import { useState} from 'react'
import './App.css'

import UpcomingPage from './Components/Pages/UpcomingPage.jsx';
import MoviePage from './Components/Pages/MoviePage.jsx';
import LatestSeriesPage from "./Components/Pages/LatestPage.jsx";
import PopularTodayPage from './Components/Pages/PopularToday.jsx';
import BannerPage from './Components/Pages/BannerPage.jsx';

{/*Header and Footer Page*/}
import HeaderPage from './Layouts/Header.jsx';
import FooterPage from './Layouts/Footer.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex flex-col min-h-screen">

      <HeaderPage />
      <BannerPage />
      
      <main className="grow">
        <PopularTodayPage />
        <UpcomingPage />
        <LatestSeriesPage />
        <MoviePage />
      </main>

      <FooterPage />

    </div>
  );
}

export default App
