import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import './App.css'

import HomePage from './Components/Pages/HomePage.jsx';
import AboutPage from './Components/Pages/AboutPage.jsx';
import ContactPage from './Components/Pages/ContactPage.jsx';
import SupportPage from './Components/Pages/SupportPage.jsx';
import BookmarkPage from './Components/Pages/BookmarkPage.jsx';
import LoginPage from './Components/Pages/Admin/LoginPage.jsx';
import RegisterPage from './Components/Pages/Admin/RegisterPage.jsx';

function App() {
  return (
    <Router future={{ v7_startTransition: true }}>
      <Routes>
        <Route path='/' element={<HomePage />} />
        <Route path='/about' element={<AboutPage />} />
        <Route path='/contact' element={<ContactPage />} />
        <Route path='/support' element={<SupportPage />} />
        <Route path='/bookmark' element={<BookmarkPage />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
      </Routes>
    </Router>
  )
}

export default App
