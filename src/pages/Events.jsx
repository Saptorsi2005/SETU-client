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

    <div className="bg-gray-800 rounded-xl border border-gray-600 p-6 flex flex-col items-center gap-6 min-h-[340px] w-full shadow-lg hover:shadow-2xl transition-shadow duration-300">
      <img src={assets.event} className="w-full h-55 " />
      <div className="text-white text-xl font-semibold text-center tracking-wide">
        {title}
      </div>
      <div className="text-gray-400 text-sm mb-2 flex items-center gap-2">
        <FaCalendarAlt className="text-amber-400" /> {new Date(date).toLocaleDateString()}
      </div>

      <div className="bg-gray-900 border border-gray-600 rounded-lg text-white px-8 py-2 flex items-center gap-3 justify-center mb-4 drop-shadow-md">
        <FaUser className="text-gray-300" />
        <span className="text-sm font-medium">
          {current_registrations || 0} / {max_capacity}
        </span>
      </div>

      <div className="flex w-full gap-4">
        {user && user.role === "student" && (
          <button
            onClick={() => handleRegister(id)}
            className="flex-1 px-6 py-3 bg-transparent border border-gray-600 text-white rounded-lg text-lg font-medium hover:bg-gray-700 hover:border-amber-400 transition-colors duration-300"
          >
            Register
          </button>
        )}

        <button
          onClick={() => setSelectedEvent(events.find((ev) => ev.id === id))}
          className="flex-1 px-6 py-3 bg-transparent border border-gray-600 text-white rounded-lg text-lg font-medium hover:bg-gray-700 hover:border-amber-400 transition-colors duration-300"
        >
          Event Details
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="min-h-screen bg-black px-8 pt-24 pb-8 flex items-center justify-center">
          <div className="text-white text-xl">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />
      <div className="min-h-screen bg-black px-8 pt-24 pb-8">
        <h1 className="text-white text-3xl font-bold mb-6">UPCOMING EVENTS</h1>

        {error && (
          <div className="bg-red-500/80 text-white px-4 py-3 rounded-xl mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-4 mb-8">
          <button
            onClick={() => setShowCalendar(true)}
            className="bg-transparent border border-gray-400 rounded-full px-8 py-2 text-white font-medium hover:bg-gray-700 transition"
          >
            CALENDAR
          </button>
          {user && (user.role === "admin" || user.role === "alumni") && (
            <button
              onClick={() => setShowAddEvent(true)}
              className="bg-transparent border border-gray-400 rounded-full px-8 py-2 text-white font-medium hover:bg-gray-700 transition"
            >
              ADD EVENT
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {events.map((ev) => (
            <EventCard key={ev.id} {...ev} user={user} />
          ))}

        </div>
      </div>

      {/* Calendar Modal */}
      {showCalendar && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl w-full max-w-md relative">
            <button
              onClick={() => setShowCalendar(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-xl font-semibold mb-4">
              Select Event Date
            </h2>
            <input
              type="date"
              className="w-full p-3 bg-gray-800 text-white rounded-md"
            />
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowCalendar(false)}
                className="bg-[#F0D41D] hover:bg-[#DCBE05] px-6 py-2 rounded-md text-white"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Event Modal */}
      {showAddEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg relative">
            <button
              onClick={() => setShowAddEvent(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-semibold mb-6">
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
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="date"
                value={newEvent.date}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, date: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="number"
                placeholder="Capacity"
                value={newEvent.max_capacity}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, max_capacity: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="text"
                placeholder="Location (Optional)"
                value={newEvent.location}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, location: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
              />
              <textarea
                placeholder="Event Description"
                value={newEvent.description}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
              ></textarea>
              <button
                type="submit"
                className="w-full bg-[#F0D41D] hover:bg-[#DCBE05] py-3 rounded-md text-white font-semibold transition-colors"
              >
                Add Event
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Event Details Modal */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg relative">
            <button
              onClick={() => setSelectedEvent(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-semibold mb-4">
              {selectedEvent.title}
            </h2>
            <p className="text-gray-400 mb-2">
              📅 Date: {selectedEvent.date ? new Date(selectedEvent.date).toLocaleDateString() : 'N/A'}
            </p>
            {selectedEvent.location && (
              <p className="text-gray-400 mb-2">
                📍 Location: {selectedEvent.location}
              </p>
            )}
            <p className="text-gray-400 mb-4">
              👥 {selectedEvent.current_registrations || 0} / {selectedEvent.max_capacity} Registered
            </p>
            <p className="text-gray-300">{selectedEvent.description || 'No description available.'}</p>
          </div>
        </div>
      )}

      {/* Student Registration Modal */}
      {showRegisterModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-8 rounded-xl w-full max-w-lg relative">
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
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <FaTimes />
            </button>
            <h2 className="text-white text-2xl font-semibold mb-6">
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
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="text"
                placeholder="Department"
                value={registrationData.department}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, department: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="text"
                placeholder="Roll Number"
                value={registrationData.roll_number}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, roll_number: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
              />
              <input
                type="number"
                placeholder="Year"
                value={registrationData.year}
                onChange={(e) =>
                  setRegistrationData({ ...registrationData, year: e.target.value })
                }
                className="w-full bg-gray-800 p-3 rounded-md text-white outline-none"
                required
                min="1"
                max="5"
              />
              <button
                type="submit"
                className="w-full bg-[#F0D41D] hover:bg-[#DCBE05] py-3 rounded-md text-white font-semibold transition-colors"
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
