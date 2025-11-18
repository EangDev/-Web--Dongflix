import React from 'react';
import logo from '../assets/Logo/mylogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faFileShield, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="w-full fixed rounded-t-xl bottom-0 left-0 bg-[#131313] text-[#cccccc] shadow-md mt-10">
            <div className="flex flex-col gap-6 px-5 py-8 mx-auto max-w-7xl md:flex-row md:justify-between md:items-start">
                <div className="flex flex-col items-center md:items-start">
                    <img 
                        src={logo} 
                        alt="Dongflix Logo" 
                        className="h-12 mb-4 w-36 rounded-xl"
                    />
                    <p className="text-sm text-center text-gray-400 md:max-w-xs md:text-left">
                        &copy; {new Date().getFullYear()} Dongflix – Watch Online: Chinese Anime / Donghua. 
                        <br/>All Rights Reserved
                    </p>
                </div>
                <div className="flex flex-col space-y-3 text-sm text-[#ccccccc] mr-15 md:max-w-lg">
                    <p>
                        Disclaimer: This site Dongflix – Watch Online: Chinese Anime / Donghua does not store any files on its server. 
                        <br/>All contents are provided by non-affiliated third parties.
                    </p>
                    <p className='text-base'>
                        Designed with ❤️ by Dongflix Team.
                    </p>
                </div>
                <div className="flex flex-col items-center space-y-8 text-sm text-[#cccccc] md:items-start">
                    <a href="#" className="transition-colors hover:text-[#cccccc]"><FontAwesomeIcon icon={faShield} /> Privacy Policy</a>
                    <a href="#" className="transition-colors hover:text-[#cccccc]"><FontAwesomeIcon icon={faFileShield} /> Terms of Service</a>
                    <a href="#" className="transition-colors hover:text-[#cccccc]"><FontAwesomeIcon icon={faEnvelope} /> Contact Us</a>
                </div>
            </div>
        </footer>
    );
}
