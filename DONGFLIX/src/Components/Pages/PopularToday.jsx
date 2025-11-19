import React, {useState, useEffect} from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight, faCirclePlay, faL } from '@fortawesome/free-solid-svg-icons';

function PopularToday() {
    const [popularDong, setPopularDong] = useState([]);
    

    useEffect(() => {
        const fetchPopular = async () => {
            try {
                const res = await fetch("http://127.0.0.1:8000/api/anime/popular");
                const json = await res.json();
                setPopularDong(json.results || []);
            } catch (error){
                console.error("Error fetching Popular Page API", error);
            }
        };

        fetchPopular();
    }, []);

  return (
    <section className="pt-32 bg-[#000000FF]">
        <div className="flex items-center gap-2 mb-8 ml-9">
            <ul className="p-0 m-0 list-none">
                <li className="text-[#ccc] font-bold text-xl flex items-center gap-2">
                    <span className="bg-[#bbefff] text-black px-5 py-2 rounded-tl-2xl rounded-br-2xl">
                        Popular
                    </span>
                    Today
                    <FontAwesomeIcon icon={faChevronRight}/>
                </li>
            </ul>
        </div>

        <div className="w-[90%] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-12">
            {popularDong.map((item, index) => (
                <div key={index} className="relative flex flex-col items-center cursor-pointer">
                    <div className="relative w-[200px] h-[250px] overflow-hidden rounded-md bg-[#111] group">
                        <img className="object-cover w-full h-full transition-all duration-300 group-hover:opacity-50 group-hover:scale-105" 
                            src={item.image} 
                            alt={item.title}
                        />
                        <FontAwesomeIcon 
                            icon={faCirclePlay} 
                            className="absolute text-5xl text-[#00c3ff] opacity-0 group-hover:opacity-100 transition-all duration-300 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
                        />
                        <p className="absolute top-2 right-2 bg-[#0093c2e6] text-white font-bold text-xs px-2 py-1 rounded-md">
                            EP {item.episode || "?"}
                        </p>
                        <p className="absolute top-2 left-2 bg-[#fd8700e6] text-white font-bold text-xs px-2 py-1 rounded-md">
                            {item.type || "?"}
                        </p>
                    </div>
                    <p className="mt-2 text-center text-sm text-[#ccc] transition-colors duration-300 group-hover:text-[#00c3ff] w-[200px]">
                        {item.title}
                    </p>
                </div>
            ))}
        </div>
    </section>
  );
}

export default PopularToday;