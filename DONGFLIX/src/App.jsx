import { useState } from 'react'
import './App.css'

import HeaderPage from './Layouts/Header.jsx';

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <HeaderPage />
      </div>
    </>
  )
}

export default App
