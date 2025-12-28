import React from 'react'
import Navbar from '../components/Navbar'
import { assets } from '../assets/assets'

const Home = () => {
  return (
    <div
      className="h-screen w-full bg-cover bg-center relative"
      style={{ backgroundImage: `url(${assets.homeBG})` }}
    >
      <Navbar />
      {/* Centered Content Overlay */}
      <div className="absolute top-0 left-0 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        {/* Headings */}
        <h2 className="text-white text-2xl font-bold mb-2 pointer-events-auto">
          ALUMNI ASSOCIATION
        </h2>
        <h1 className="text-white text-4xl font-extrabold mb-4 pointer-events-auto">
          ACADEMY OF TECHNOLOGY
        </h1>
        <p className="text-white text-center max-w-xl mb-7 pointer-events-auto">
          Where alumni journeys inspire the next generation, bridging experience with ambition to shape brighter futures.
        </p>

        {/* Stats Banner */}
        <div className="flex flex-row gap-6 mb-7 pointer-events-auto">
          <div className="bg-white/20 backdrop-blur-md border border-white px-6 py-4 rounded-xl text-white text-center min-w-[120px]">
            <div className="text-2xl font-bold">100+</div>
            <div className="text-sm">alumnis connected</div>
          </div>
          <div className="bg-white/20 border border-white backdrop-blur-md px-6 py-4 rounded-xl text-white text-center min-w-[120px]">
            <div className="text-2xl font-bold">10k+</div>
            <div className="text-sm">donated in the last month</div>
          </div>
          <div className="bg-white/20 border border-white backdrop-blur-md px-6 py-4 rounded-xl text-white text-center min-w-[120px]">
            <div className="text-2xl font-bold">50+</div>
            <div className="text-sm">referrals made</div>
          </div>
        </div>

        {/* Explore Button */}
        <button className="bg-white/30 border border-white backdrop-blur-md rounded-xl px-12 py-3 text-xl font-bold text-white pointer-events-auto transition hover:bg-white/50 mt-20">
          EXPLORE
        </button>
      </div>
    </div>
  )
}

export default Home
