import React, { useState, useRef, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { Menu, X } from "lucide-react";

const Navbar = () => {
  const { user } = useUser();
  const isAdmin = user?.role === "admin";
  const navigate = useNavigate();

  const navLinks = isAdmin
    ? [
        { name: "Directory", path: "/directory" },
        { name: "Dashboard", path: "/dashboard" },
        { name: "Events", path: "/events" },
        { name: "Jobs", path: "/admin-jobs" },
      ]
    : [
        { name: "Home", path: "/home" },
        { name: "Posts", path: "/post" },
        user?.role === "alumni" && { name: "Donations", path: "/donations" },
        { name: "Event", path: "/events" },
        { name: "Messages", path: "/messages" },
        user?.role === "student" && { name: "Redeem", path: "/redeem" },
        { name: "Map", path: "/map" },
      ].filter(Boolean);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setDropdownOpen(false);
      }

      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target) &&
        !event.target.closest('button[aria-label="Toggle menu"]')
      ) {
        setMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () =>
      document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  return (
    <nav className="w-full bg-black/70 backdrop-blur-md shadow-md px-6 py-4 fixed top-0 left-0 z-[2000] flex items-center justify-between">
      
      {/* Logo */}
      <div
        onClick={() => navigate(isAdmin ? "/dashboard" : "/home")}
        className="flex items-center flex-shrink-0 cursor-pointer"
      >
        <span className="text-3xl font-bold text-white select-none">
          SETU
        </span>
        <img
          src={assets.logo}
          alt="App Logo"
          className="w-10 h-10 object-contain ml-3"
        />
      </div>

      {/* Desktop Navigation */}
      <div className="hidden md:flex flex-grow justify-center">
        <ul className="flex space-x-8 text-gray-200 font-medium">
          {navLinks.map((link) => {
            if (!link || !link.name || !link.path) return null;
            return (
              <li key={link.name}>
                <NavLink
                  to={link.path}
                  className={({ isActive }) =>
                    isActive
                      ? "text-amber-400 border-b-2 border-amber-400 pb-1"
                      : "hover:text-amber-400 transition"
                  }
                >
                  {link.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        {/* Profile Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="focus:outline-none rounded-full"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-label="Account menu"
          >
            <img
              src={assets.profile}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-amber-400 transition"
            />
          </button>

          {dropdownOpen && (
            <ul className="absolute right-0 mt-2 w-44 bg-black/90 rounded-md shadow-lg ring-1 ring-white ring-opacity-20 text-white z-[3000]">
              {!isAdmin && (
                <>
                  <li>
                    <NavLink
                      to="/profile"
                      className="block px-4 py-2 hover:bg-amber-400 hover:text-black transition"
                    >
                      Profile
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 hover:bg-amber-400 hover:text-black transition"
                    >
                      Settings
                    </NavLink>
                  </li>
                </>
              )}
              <li>
                <button
                  onClick={() => {
                    try {
                      localStorage.removeItem("user");
                    } catch (e) {}
                    navigate("/");
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-amber-400 hover:text-black transition"
                >
                  Logout
                </button>
              </li>
            </ul>
          )}
        </div>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div
          ref={mobileMenuRef}
          className="absolute top-full left-0 w-full bg-black/95 backdrop-blur-xl border-t border-gray-800 shadow-2xl md:hidden flex flex-col items-center py-6 space-y-4 z-[1900]"
        >
          {navLinks.map((link) => {
            if (!link || !link.name || !link.path) return null;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-amber-400 text-lg font-semibold border-b-2 border-amber-400 pb-1"
                    : "text-gray-200 text-lg font-medium hover:text-amber-400 transition"
                }
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>
      )}
    </nav>
  );
};

export default Navbar;