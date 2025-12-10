import React, {useState} from "react";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";


export default function Components(){
    return(
        <section className="justify-center w-full p-5 text-center">
            <div className="flex justify-center w-full h-12 text-center bg-[#00a6c7] rounded-md py-3">
                <FontAwesomeIcon icon={faCircleExclamation} className="px-1 py-1 text-gray-700"/><span className="font-extrabold text-gray-700">Notice: </span><p className="px-2 text-gray-700"> Comments are currently unavailable on our website. We are working on a solution and appreciate your patience.</p>
            </div>
        </section>
    );
}