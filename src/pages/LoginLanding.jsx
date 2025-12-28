import React from "react";
import { assets } from "../assets/assets";
import './LoginLanding.css';
import { useNavigate } from "react-router-dom";

const LoginLanding = () => {
    const navigate = useNavigate();
    return (
        
        <div
            className="h-screen w-full bg-cover bg-center flex flex-col items-center justify-center relative"
            style={{ backgroundImage: `url(${assets.landingBG})` }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40"></div>  {/* <-- Tailwind shorthand for bg-opacity-40 */}

            {/* Content */}
            <div className="relative z-10 flex flex-col items-center mb-10 animate-slide-up">
                <div className="flex flex-row items-center">
                    <div className=" text-white">
                        <h1 className="font-bold text-9xl md:text-9xl leading-none drop-shadow-lg">
                            SETU
                        </h1>
                        <p className="text-sm md:text-sm  drop-shadow-md pl-10">
                            Sharing Experience To Undergrads
                        </p>
                    </div>
                    <img
                        src={assets.logo}
                        alt="Setu Logo"
                        className="w-32 md:w-38 drop-shadow-xl"
                    />
                </div>
            </div>

            {/* Login As */}
            <p className="relative z-10 text-lg md:text-xl mb-4 font-medium drop-shadow-md animate-slide-up">
                Login as
            </p>

            {/* Buttons */}
            <div className="flex flex-col md:flex-row gap-4 relative z-10 animate-slide-up">
                <button onClick={() => navigate("/alumniLogin")} className="border border-white text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white hover:text-black transition-colors duration-300 font-semibold backdrop-blur-sm">
                    Alumni
                </button>
                <button onClick={() => navigate("/studentLogin")} className="border border-white text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white hover:text-black transition-colors duration-300 font-semibold backdrop-blur-sm">
                    Student
                </button>
                <button onClick={() => navigate("/adminLogin")} className="border border-white text-white px-6 py-3 rounded-2xl shadow-lg hover:bg-white hover:text-black transition-colors duration-300 font-semibold backdrop-blur-sm">
                    Admin
                </button>
            </div>

        </div>

    );
};

export default LoginLanding;
