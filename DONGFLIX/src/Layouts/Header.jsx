import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";

import logo from "../assets/Logo/mylogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMagnifyingGlass, faHouse, faHeart, faBookOpen, 
  faEnvelope, faTelevision, faUser 
} from "@fortawesome/free-solid-svg-icons";
import '../Layouts/HeaderPage.css';

function HeaderPage() {
  return (
    <header className="w-full fixed top-0 left-0 bg-[#131313] text-[#cccccc] z-50 shadow-md">
      <div className="flex items-center justify-between h-20 px-5 mx-auto max-w-7xl">
        <div className="flex items-center cursor-pointer">
          <img
            className="w-40 mr-5 rounded-xl h-14"
            src={logo}
            alt="Dongflix Logo"
          />
        </div>
        <div className="flex items-center flex-1 max-w-md mx-5">
          <input 
            type="text"
            placeholder="Search..."
            className="w-full h-14 px-3 py-2 text-[#cccc] outline-none rounded-l-md"
          />
          <button className="px-3 py-2 transition-colors bg-gray-700 rounded-r-md hover:bg-gray-600">
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
        </div>
        <nav>
          <ul className="flex items-center space-x-5 cursor-pointer">
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <Link to="/" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                <FontAwesomeIcon icon={faHouse}/> <span>Home</span>
              </Link>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <Link to="/about" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                <FontAwesomeIcon icon={faBookOpen}/> <span>About Us</span>
              </Link>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faEnvelope}/> <span>Contact Us</span>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faHeart}/> <span>Support Us</span>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faTelevision}/> <span>Bookmark</span>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <FontAwesomeIcon icon={faUser}/> <span>Sign In</span>
            </li>
          </ul>
        </nav>
      </div>
      <div className="w-full overflow-hidden bg-[#0095c2]">
        <div className="animate-marquee whitespace-nowrap py-2 px-5 text-[#fffffff] text-lg font-semibold">
          💖 Welcome to DongFlix — Your ultimate world of donghua! From the fiery battles of Battle Through the Heavens ⚔️ to the mystical realms of Soul Land 💥 and Perfect World 🌏, get ready to embark on endless adventures 🌈 that will leave you inspired!
        </div>
      </div>
    </header>
  );
}

export default HeaderPage;
