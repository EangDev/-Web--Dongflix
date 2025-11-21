import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'

import HomePage from './Components/Pages/HomePage.jsx';
import AboutPage from './Components/Pages/AboutPage.jsx';

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
      </Routes>
    </Router>
  )
}

export default App
