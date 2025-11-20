import { useState} from 'react'
import './App.css'

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
      </main>

      <FooterPage />

    </div>
  );
}

export default App
