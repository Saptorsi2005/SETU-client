import React from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative font-sans"
      style={{ backgroundImage: `url(${assets.homeBG})` }}
    >
      {/* Dark Overlay for better text readability */}
      <div className="absolute inset-0 bg-black/50"></div>

      <Navbar />

      {/* Main Content */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center px-4 text-center pt-32">

        {/* Headings */}
        <h2 className="text-gray-300 text-sm md:text-xl font-bold tracking-widest mb-2 uppercase drop-shadow-md">
          Alumni Association
        </h2>
        <h1 className="text-white text-4xl md:text-6xl font-extrabold mb-6 drop-shadow-lg tracking-tight">
          Academy of Technology
        </h1>
        <p className="text-gray-200 text-center max-w-2xl mb-10 text-base md:text-lg leading-relaxed drop-shadow-md">
          Where alumni journeys inspire the next generation, bridging experience with ambition to shape brighter futures.
        </p>

        {/* Stats Banner */}
        <div className="flex flex-col md:flex-row justify-center gap-4 md:gap-8 mb-12 w-full max-w-4xl px-4">
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl text-white text-center w-full hover:bg-white/20 transition-all duration-300 shadow-xl group">
            <div className="text-3xl md:text-4xl font-bold text-[#C5B239] group-hover:scale-110 transition-transform">100+</div>
            <div className="text-gray-300 text-sm md:text-base font-medium mt-1">Alumni Connected</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl text-white text-center w-full hover:bg-white/20 transition-all duration-300 shadow-xl group">
            <div className="text-3xl md:text-4xl font-bold text-[#C5B239] group-hover:scale-110 transition-transform">10k+</div>
            <div className="text-gray-300 text-sm md:text-base font-medium mt-1">Donated Last Month</div>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 px-8 py-6 rounded-2xl text-white text-center w-full hover:bg-white/20 transition-all duration-300 shadow-xl group">
            <div className="text-3xl md:text-4xl font-bold text-[#C5B239] group-hover:scale-110 transition-transform">50+</div>
            <div className="text-gray-300 text-sm md:text-base font-medium mt-1">Referrals Made</div>
          </div>
        </div>

        {/* Explore Button */}
        <button className="bg-[#C5B239] text-black rounded-full px-10 py-3 text-lg font-bold transition-all duration-300 hover:bg-[#b9a531] hover:scale-105 shadow-[0_0_20px_rgba(197,178,57,0.5)]">
          EXPLORE
        </button>
      </div>
    </div>
  )
}

export default Home
