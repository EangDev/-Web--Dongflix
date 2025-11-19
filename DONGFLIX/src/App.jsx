import { useState} from 'react'
import './App.css'

import PopularTodayPage from './Components/Pages/PopularToday.jsx';
{/*Header and Footer Page*/}
import HeaderPage from './Layouts/Header.jsx';
import FooterPage from './Layouts/Footer.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <HeaderPage />
      </div>
      <div>
        <PopularTodayPage />
      </div>
      {/* <div>
        <FooterPage />
      </div>   */}
    </>
  )
}

export default App
