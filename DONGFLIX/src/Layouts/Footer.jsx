import React from 'react';
import logo from '../assets/Logo/mylogo.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShield, faFileShield, faEnvelope } from '@fortawesome/free-solid-svg-icons';

export default function Footer() {
    return (
        <footer className="w-full mt-20 py-5 bg-[#131313] text-[#cccccc] rounded-t-xl">
            <div className="flex flex-col items-center justify-center gap-6 p-5 mx-auto text-center">
                <img
                    src={logo}
                    alt="Dongflix Logo"
                    className="w-auto h-16 rounded-xl"
                />
                <p className="text-sm text-[#ccc] leading-relaxed">
                    <span className='relative text-2xl top-2'>&copy;</span> {new Date().getFullYear()} Dongflix – Watch Online: Chinese Anime / Donghua. All Rights Reserved.
                    <br />
                    Disclaimer: This site Dongflix – Watch Online: Chinese Anime / Donghua does not store any files on its server.
                    <br />
                    All contents are provided by non-affiliated third parties.
                </p>
            </div>
        </footer>
    );
}
