import React, { useState, useEffect } from "react";
import { FaUser, FaCalendarAlt, FaTimes } from "react-icons/fa";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import { eventsAPI } from "../services/api";
import { useUser } from "../context/UserContext";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useUser();

  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAddEvent, setShowAddEvent] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(null);

  const [newEvent, setNewEvent] = useState({
    title: "",
    date: "",
    max_capacity: "",
    description: "",
    location: "",
  });

  const [registrationData, setRegistrationData] = useState({
    name: "",
    department: "",
    roll_number: "",
    year: "",
  });

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventsAPI.getAll({ upcoming: true });
      if (response.success) {
        setEvents(response.data.events);
      }
    } catch (err) {
      console.error("Error fetching events:", err);
      setError("Failed to load events. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId) => {
    // Check if user is logged in and is a student
    if (!user) {
      alert("Please login to register for events.");
      return;
    }

    // Open registration modal
    setShowRegisterModal(eventId);
  };

  const handleSubmitRegistration = async (e) => {
    e.preventDefault();

    try {
      const response = await eventsAPI.register(showRegisterModal, registrationData);

      if (response.success) {
        alert("Registered successfully!");
        // Refresh events to update registration count
        fetchEvents();
        // Close modal and reset form
        setShowRegisterModal(null);
        setRegistrationData({
          name: "",
          department: "",
          roll_number: "",
          year: "",
        });
      }
    } catch (err) {
      console.error("Registration error:", err);
      alert(err.response?.data?.message || "Registration failed. Please try again.");
    }
  };

  const handleAddEvent = async (e) => {
    e.preventDefault();

    if (!newEvent.title || !newEvent.date || !newEvent.max_capacity) {
      alert("Please fill in all required fields.");
      return;
    }

    // Check if user can create events
    if (!user || (user.role !== "admin" && user.role !== "alumni")) {
      alert("Only admins and alumni can create events.");
      return;
    }

    try {
      const response = await eventsAPI.create({
        ...newEvent,
        max_capacity: parseInt(newEvent.max_capacity),
      });

      if (response.success) {
        alert("Event created successfully!");
        fetchEvents();
        setNewEvent({ title: "", date: "", max_capacity: "", description: "", location: "" });
        setShowAddEvent(false);
      }
    } catch (err) {
      console.error("Error creating event:", err);
      alert(err.response?.data?.message || "Failed to create event. Please try again.");
    }
  };

  const EventCard = ({
    id,
    title,
    current_registrations,
    max_capacity,
    date,
    user,
  }) => (
    <div className="bg-[#111] rounded-2xl border border-gray-800 overflow-hidden hover:border-[#C5B239]/40 transition-all duration-300 shadow-lg flex flex-col group h-full">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={assets.event}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          alt={title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent opacity-60"></div>
        <div className="absolute top-3 right-3 bg-black/70 backdrop-blur-sm text-[#C5B239] px-3 py-1.5 rounded-lg text-xs font-bold border border-[#C5B239]/20 flex items-center gap-1.5">
          <FaUser className="text-[10px]" />
          {current_registrations || 0} / {max_capacity}
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <div className="flex items-center gap-2 text-[#C5B239] text-xs font-bold mb-2 uppercase tracking-wider">
          <FaCalendarAlt />
          {new Date(date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' })}
        </div>

        <h3 className="text-white text-xl font-bold mb-3 line-clamp-2 leading-tight flex-grow group-hover:text-[#C5B239] transition-colors">
          {title}
        </h3>

        <div className="pt-4 mt-auto border-t border-gray-800 flex gap-3">
          {user && user.role === "student" && (
            <button
              onClick={() => handleRegister(id)}
              className="flex-1 px-4 py-2.5 bg-gradient-to-r from-[#C5B239] to-[#a89628] text-black rounded-xl text-sm font-bold hover:from-[#d4c048] hover:to-[#C5B239] transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              Register
            </button>
          )}

          <button
            onClick={() => setSelectedEvent(events.find((ev) => ev.id === id))}
            className="flex-1 px-4 py-2.5 bg-gray-800/60 border border-gray-700 text-gray-300 rounded-xl text-sm font-medium hover:bg-gray-700/60 hover:text-white hover:border-gray-600 transition-all"
          >
            Details
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-[#0a0a0a] px-8 pt-24 pb-8 flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5B239]"></div>
            <p className="text-gray-400 font-medium">Loading events...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-[#0a0a0a] px-4 md:px-8 pt-24 pb-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 border-b border-gray-800 pb-6">
          <div className="flex items-center gap-4">
            <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
            <h1 className="text-white text-3xl font-bold tracking-tight">UPCOMING EVENTS</h1>
          </div>

          <div className="flex gap-3">
            <button
              onClick={() => setShowCalendar(true)}
              className="flex items-center gap-2 bg-gray-800/60 hover:bg-gray-700/60 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all border border-gray-700 hover:border-gray-600"
            >
              <FaCalendarAlt className="text-[#C5B239]" />
              Calendar
            </button>
            {user && (user.role === "admin" || user.role === "alumni") && (
              <button
                onClick={() => setShowAddEvent(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg hover:shadow-[#C5B239]/20 hover:scale-[1.02] active:scale-[0.98]"
              >
                + Add Event
              </button>
            )}
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-3.5 rounded-xl mb-6 text-center text-sm font-medium">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 xl:gap-8">
          {events.map((ev) => (
            <EventCard key={ev.id} {...ev} user={user} />
          ))}
        </div>

        {!loading && events.length === 0 && (
          <div className="text-center py-20 bg-[#111] rounded-2xl border border-gray-800 border-dashed">
            <FaCalendarAlt className="mx-auto text-4xl text-gray-600 mb-4" />
            <h3 className="text-xl text-gray-300 font-bold">No upcoming events</h3>
            <p className="text-gray-500 mt-2 text-sm">Check back later for new events.</p>
          </div>
        )}
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111] p-6 rounded-2xl w-full max-w-md relative border border-gray-800 shadow-2xl">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-xl font-bold mb-4">
              Select Event Date
            </h2>
            <input
              type="date"
              className="w-full p-3.5 bg-black/40 text-white rounded-xl border border-gray-800 focus:border-[#C5B239]/50 outline-none transition-colors"
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] px-8 py-2.5 rounded-xl text-black font-bold transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-lg relative border border-gray-800 shadow-2xl">
            <button
              onClick={() => setShowAddEvent(false)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-bold mb-6">
              Add New Event
            </h2>
            <form onSubmit={handleAddEvent} className="space-y-4">
              <input
                type="text"
                placeholder="Event Title"
                value={newEvent.title}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newEvent.max_capacity}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, max_capacity: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Location (Optional)"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
              />
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500 resize-none"
                rows={3}
              ></textarea>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] py-3 rounded-xl text-black font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-lg relative border border-gray-800 shadow-2xl">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-bold mb-5">
              {selectedEvent.title}
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-gray-300 bg-gray-900/50 px-4 py-2.5 rounded-xl border border-gray-800">
                <span>📅</span>
                <span className="text-sm font-medium">Date: {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}</span>
              </div>
              {selectedEvent.location && (
                <div className="flex items-center gap-3 text-gray-300 bg-gray-900/50 px-4 py-2.5 rounded-xl border border-gray-800">
                  <span>📍</span>
                  <span className="text-sm font-medium">Location: {selectedEvent.location}</span>
                </div>
              )}
              <div className="flex items-center gap-3 text-gray-300 bg-gray-900/50 px-4 py-2.5 rounded-xl border border-gray-800">
                <span>👥</span>
                <span className="text-sm font-medium">{selectedEvent.current_registrations || 0} / {selectedEvent.max_capacity} Registered</span>
              </div>
            </div>
            <p className="text-gray-300 mt-5 leading-relaxed text-sm">{selectedEvent.description || 'No description available.'}</p>
          </div>
        </div>
      )}

      {/* Student Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
          <div className="bg-[#111] p-8 rounded-2xl w-full max-w-lg relative border border-gray-800 shadow-2xl">
            <button
              onClick={() => {
                setShowRegisterModal(null);
                setRegistrationData({
                  name: "",
                  department: "",
                  roll_number: "",
                  year: "",
                });
              }}
              className="absolute top-4 right-4 text-gray-500 hover:text-white transition-colors"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-bold mb-6">
              Event Registration
            </h2>
            <form onSubmit={handleSubmitRegistration} className="space-y-4">
              <input
                type="text"
                placeholder="Full Name"
                value={registrationData.name}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, name: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={registrationData.department}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, department: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={registrationData.roll_number}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, roll_number: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={registrationData.year}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, year: e.target.value })
                }
                className="w-full bg-black/40 p-3.5 rounded-xl text-white outline-none border border-gray-800 focus:border-[#C5B239]/50 transition-colors placeholder-gray-500"
                required
                min="1"
                max="5"
              />
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] py-3 rounded-xl text-black font-bold transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg"
              >
                Submit Registration
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;
