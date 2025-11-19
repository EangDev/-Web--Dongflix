import React from 'react';
import logo from '../assets/Logo/mylogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faFileShield, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="w-full fixed bottom-0 left-0 bg-[#131313] text-[#cccccc] shadow-md rounded-t-xl">
            <div className="flex flex-col items-center justify-center gap-4 p-5 mx-auto text-center max-w-7xl">
                <img 
                    src={logo} 
                    alt="Dongflix Logo" 
                    className="w-auto h-16 rounded-xl"
                />
                <p className="text-sm text-[#ccc] leading-relaxed">
                    &copy; {new Date().getFullYear()} Dongflix – Watch Online: Chinese Anime / Donghua. All Rights Reserved.
                    <br />
                    Disclaimer: This site Dongflix – Watch Online: Chinese Anime / Donghua does not store any files on its server.
                    <br />
                    All contents are provided by non-affiliated third parties.
                </p>
            </div>
        </footer>
    );
}
