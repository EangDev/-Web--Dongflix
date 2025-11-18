import React from "react";
import logo from "../assets/Logo/mylogo.png";

export default function HeaderPage() {
    return(
        <header className="w-full">
            <div className="">
                <div className="">
                    <img className="rounded-xl" src={logo} alt="" />
                </div>
                <div className="flex justify-center items-center">
                    <ul>
                        <li className="inline-block px-4 font-bold font-space text-lg text-white">Home</li>
                        <li className="inline-block px-4 font-bold text-lg text-amber-950">Donglfix</li>
                        <li className="inline-block px-4 font-bold text-lg text-amber-950">TV Shows</li>
                        <li className="inline-block px-4 font-bold text-lg text-amber-950">My List</li>
                    </ul>
                </div>
            </div>
        </header>
    );
}
