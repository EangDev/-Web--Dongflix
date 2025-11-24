import React, {useState, useEffect} from "react";
import { Link, useNavigate  } from "react-router-dom";

import logo from "../assets/Logo/mylogo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faMagnifyingGlass, faHouse, faHeart, faBookOpen, 
  faEnvelope, faTelevision, faUser 
} from "@fortawesome/free-solid-svg-icons";
import '../Layouts/HeaderPage.css';

function HeaderPage() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  
  //Search Method
  const [searchQuery, setSearchQuery] = useState("");
  const [allDonghua, setAllDonghua] = useState([]);
  const [filteredDonghua, setFilteredDonghua] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  //Search API
  useEffect(() => {
    const fetchAll = async () =>{
      try{
        const res = await fetch("http://127.0.0.1:8000/api/anime/search");
        const data = await res.json();
        setAllDonghua(data.results || []);
      }catch(err){
        console.error("Failed to fetch combined data:", err);
      }
    };
    fetchAll();
  }, []);

  //Search method
  useEffect(() => {
    if(!searchQuery){
      setFilteredDonghua([]);
      setShowSuggestions(false);
      return;
    }

    const results = allDonghua.filter(item => 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      item.link
    );

    setFilteredDonghua(results);
    setShowSuggestions(results.length > 0);
  }, [searchQuery, allDonghua]);

  //Handle navigate to watch page
  const handleSelectAnime = (item) => {
    if (!item.link) return;
    navigate(`/watch?url=${encodeURIComponent(item.link)}&image=${encodeURIComponent(item.image || item.thumbnail)}`);
    setSearchQuery("");
    setShowSuggestions(false);
  };
  
  return (
    <header className="w-full fixed top-0 left-0 bg-[#131313] text-[#cccccc] z-50 shadow-md">
      <div className="flex items-center justify-between h-20 px-5 mx-auto max-w-7xl">
        <div className="flex items-center cursor-pointer">
          <Link to="/">
            <img
              className="w-40 mr-5 rounded-xl h-14"
              src={logo}
              alt="Dongflix Logo"
            />
          </Link>
        </div>
        <div className="flex items-center flex-1 max-w-md mx-5">
          <input 
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSuggestions(filteredDonghua.length > 0)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            className="w-full h-14 px-3 py-2 text-[#cccc] outline-none rounded-l-md"
          />
          <button className="px-3 py-2 transition-colors bg-gray-700 rounded-r-md hover:bg-gray-600" onClick={() => handleSelectAnime(filteredDonghua[0])}>
            <FontAwesomeIcon icon={faMagnifyingGlass} />
          </button>
          {showSuggestions && (
            <div className="absolute top-20 left-60 w-[280px] bg-[#131313]/90 rounded-md z-1000 overflow-hidden p-2">
              {filteredDonghua.slice(0, 5).map((item, index) => (
                <div
                    key={index}
                    className="flex items-center gap-2.5 px-2 py-3 text-[#ccc] cursor-pointer hover:bg-[#0095c2] hover:text-white scale-[1.02] text-left"
                    onClick={() => handleSelectAnime(item)}
                  >
                  <div className="relative inline-block">
                    <img
                    src={item.image || item.thumbnail} 
                    alt={item.title}
                    className="object-cover w-10 rounded-sm h-14"
                    />
                  </div>
                  <span>{item.title}</span>
                </div>
              ))}
            </div>
          )}
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
              <Link to="/contact" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                <FontAwesomeIcon icon={faEnvelope}/> <span>Contact Us</span>
              </Link>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <Link to="/support" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                <FontAwesomeIcon icon={faHeart}/> <span>Support Us</span>
              </Link>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              <Link to="/bookmark" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                <FontAwesomeIcon icon={faTelevision}/> <span>Bookmark</span>
              </Link>
            </li>
            <li className="flex items-center space-x-1 transition-colors hover:text-white">
              {user ? (
                <li className="flex items-center space-x-2">
                  <div className="w-8 h-8 rounded-full bg-[#00c3ff] flex items-center justify-center text-black font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </div>
                  <Link to="/profile" className="hover:underline">
                    {user.username}
                  </Link> 
                </li>
              ) : (
                <li className="flex items-center space-x-1 transition-colors hover:text-white">
                  <Link to="/login" className="flex items-center space-x-1 text-[#cccccc] hover:text-white">
                    <FontAwesomeIcon icon={faUser}/> <span>Sign Up</span>
                  </Link>
                </li>
              )}
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
