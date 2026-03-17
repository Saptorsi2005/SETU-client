import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { MapContainer, TileLayer, Marker, Popup, Circle, ZoomControl } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaMapMarkerAlt, FaBriefcase, FaGraduationCap, FaArrowLeft } from "react-icons/fa";
import { X } from "lucide-react";
import axios from "axios";

// Fix leaflet default marker icon issue
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Custom marker icons
const userIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-blue.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const connectionIcon = new L.Icon({
    iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
});

const MapPage = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState("check"); // check, input, map
    const [userLocation, setUserLocation] = useState(null);
    const [nearbyConnections, setNearbyConnections] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [manualLat, setManualLat] = useState("");
    const [manualLon, setManualLon] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

const API_URL = import.meta.env.VITE_API_URL + "/api";
    // Check if user has location on mount
    useEffect(() => {
        checkUserLocation();
    }, []);

    const checkUserLocation = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/locations/me`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setUserLocation({
                    latitude: parseFloat(response.data.location.latitude),
                    longitude: parseFloat(response.data.location.longitude),
                });
                setStep("map");
                fetchNearbyConnections();
            }
        } catch (err) {
            if (err.response?.status === 404) {
                setStep("input");
            } else {
                console.error("Error checking location:", err);
                setStep("input");
            }
        }
    };

    const fetchNearbyConnections = async () => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.get(`${API_URL}/locations/nearby?radius=50`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            if (response.data.success) {
                setNearbyConnections(response.data.nearbyUsers);
                setUserLocation({
                    latitude: parseFloat(response.data.userLocation.latitude),
                    longitude: parseFloat(response.data.userLocation.longitude),
                });
            }
        } catch (err) {
            console.error("Error fetching nearby connections:", err);
            setError("Failed to fetch nearby connections");
        }
    };

    const handleGPSLocation = () => {
        if (!navigator.geolocation) {
            setError("Geolocation is not supported by your browser. Please use manual input.");
            return;
        }

        setLoading(true);
        setError("");

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await saveLocation(latitude, longitude, "gps");
            },
            (err) => {
                setLoading(false);

                // Provide specific error messages based on error code
                switch (err.code) {
                    case err.PERMISSION_DENIED:
                        setError("Location access denied. Please enable location permissions in your browser settings and try again, or use manual input.");
                        break;
                    case err.POSITION_UNAVAILABLE:
                        setError("Location information unavailable. Please check your device's location services or use manual input.");
                        break;
                    case err.TIMEOUT:
                        setError("Location request timed out. Please try again or use manual input.");
                        break;
                    default:
                        setError("Unable to retrieve your location. Please use manual input.");
                }

                console.error("Geolocation error:", err.code, err.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    };

    const handleManualLocation = async () => {
        const lat = parseFloat(manualLat);
        const lon = parseFloat(manualLon);

        if (isNaN(lat) || isNaN(lon) || lat < -90 || lat > 90 || lon < -180 || lon > 180) {
            setError("Please enter valid coordinates");
            return;
        }

        setLoading(true);
        setError("");
        await saveLocation(lat, lon, "manual");
    };

    const saveLocation = async (latitude, longitude, type) => {
        try {
            const token = localStorage.getItem("token");
            const response = await axios.post(
                `${API_URL}/locations`,
                {
                    latitude,
                    longitude,
                    location_type: type,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (response.data.success) {
                setUserLocation({ latitude, longitude });
                setStep("map");
                fetchNearbyConnections();
            }
        } catch (err) {
            setError("Failed to save location. Please try again.");
            console.error("Error saving location:", err);
        } finally {
            setLoading(false);
        }
    };

    const renderLocationInput = () => (
        <div className="w-full max-w-4xl mx-auto bg-[#111] rounded-2xl shadow-2xl p-6 md:p-8 border border-gray-800">
            {/* Back button */}
            <button
                onClick={() => navigate("/home")}
                className="mb-5 flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
                <FaArrowLeft />
                <span className="text-sm font-medium">Back to Home</span>
            </button>

            <div className="flex items-center gap-4 mb-2">
                <div className="h-1 w-10 bg-gradient-to-r from-[#C5B239] to-purple-500 rounded-full"></div>
                <h2 className="text-2xl font-bold text-white">
                    Set Your Location
                </h2>
            </div>
            <p className="text-gray-500 text-sm mb-6 pl-14">
                To see nearby connections, please set your location first
            </p>

            {error && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-5 py-3.5 rounded-xl mb-6 text-sm font-medium">
                    {error}
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Get My Location (GPS) */}
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-[#C5B239]/30 transition-all group">
                    <div className="w-12 h-12 bg-[#C5B239]/10 rounded-xl flex items-center justify-center mb-4 mx-auto border border-[#C5B239]/20">
                        <FaMapMarkerAlt className="text-[#C5B239] text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Get My Location</h3>
                    <p className="text-sm text-gray-500 mb-5 text-center">Use your device's GPS</p>
                    <button
                        onClick={handleGPSLocation}
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                    >
                        {loading ? "Getting Location..." : "Use GPS"}
                    </button>
                </div>

                {/* Manual Input */}
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-gray-800 hover:border-[#C5B239]/30 transition-all">
                    <div className="w-12 h-12 bg-purple-500/10 rounded-xl flex items-center justify-center mb-4 mx-auto border border-purple-500/20">
                        <FaMapMarkerAlt className="text-purple-400 text-lg" />
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2 text-center">Manual Input</h3>
                    <p className="text-sm text-gray-500 mb-5 text-center">Enter coordinates manually</p>
                    <div className="space-y-3">
                        <div>
                            <label className="block text-gray-400 font-medium mb-1.5 text-xs uppercase tracking-wider">Latitude</label>
                            <input
                                type="number"
                                step="any"
                                value={manualLat}
                                onChange={(e) => setManualLat(e.target.value)}
                                placeholder="e.g., 19.076"
                                className="w-full px-3.5 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#C5B239]/50 transition-colors text-sm placeholder-gray-600"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-400 font-medium mb-1.5 text-xs uppercase tracking-wider">Longitude</label>
                            <input
                                type="number"
                                step="any"
                                value={manualLon}
                                onChange={(e) => setManualLon(e.target.value)}
                                placeholder="e.g., 72.8777"
                                className="w-full px-3.5 py-2.5 bg-black/40 border border-gray-800 rounded-xl text-white focus:outline-none focus:border-[#C5B239]/50 transition-colors text-sm placeholder-gray-600"
                            />
                        </div>
                        <button
                            onClick={handleManualLocation}
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-[#C5B239] to-[#a89628] hover:from-[#d4c048] hover:to-[#C5B239] text-black py-3 rounded-xl font-bold transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100"
                        >
                            {loading ? "Saving..." : "Set Location"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderMap = () => (
        <div className="h-full w-full relative">
            {/* Back button */}
            <button
                onClick={() => setStep("input")}
                className="absolute top-4 left-4 z-[1001] bg-[#111]/90 backdrop-blur-sm hover:bg-[#1a1a1a] text-white px-4 py-2.5 rounded-xl shadow-lg flex items-center gap-2 transition-all border border-gray-800 hover:border-gray-700 text-sm font-medium"
            >
                <FaArrowLeft className="text-xs" />
                <span>Change Location</span>
            </button>

            {/* Info panel */}
            <div className="absolute top-16 left-4 z-[1000] bg-[#111]/90 backdrop-blur-sm rounded-xl shadow-lg p-3.5 md:p-4 max-w-[200px] md:max-w-xs border border-gray-800">
                <h3 className="font-bold text-white mb-1 text-sm md:text-base">Nearby Connections</h3>
                <p className="text-xs md:text-sm text-gray-400">
                    <span className="text-[#C5B239] font-bold">{nearbyConnections.length}</span> connection{nearbyConnections.length !== 1 ? "s" : ""} within 50km
                </p>
            </div>

            {/* Selected user details - Bottom Sheet on Mobile, Top Right on Desktop */}
            {selectedUser && (
                <div className="absolute bottom-0 left-0 w-full md:top-4 md:right-4 md:bottom-auto md:left-auto md:w-auto z-[1000] bg-[#111]/95 backdrop-blur-sm rounded-t-2xl md:rounded-2xl shadow-2xl p-5 md:p-5 max-w-full md:max-w-sm animate-slide-up border border-gray-800 md:border">
                    <button
                        onClick={() => setSelectedUser(null)}
                        className="absolute top-3 right-4 md:top-3 md:right-3 text-gray-500 hover:text-white bg-gray-800/50 rounded-full p-1.5 transition-colors"
                    >
                        <X size={16} />
                    </button>
                    <div className="flex items-center gap-3 mb-4">
                        {selectedUser.profile_image ? (
                            <img
                                src={selectedUser.profile_image}
                                alt={selectedUser.name}
                                className="w-14 h-14 md:w-16 md:h-16 rounded-full object-cover ring-2 ring-gray-700"
                            />
                        ) : (
                            <div className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-[#C5B239] to-[#a89628] flex items-center justify-center text-black text-xl md:text-2xl font-bold ring-2 ring-[#C5B239]/30">
                                {selectedUser.name.charAt(0)}
                            </div>
                        )}
                        <div>
                            <h3 className="font-bold text-white text-lg">{selectedUser.name}</h3>
                            <p className="text-xs text-[#C5B239] font-bold uppercase tracking-wider">{selectedUser.role}</p>
                        </div>
                    </div>

                    <div className="max-h-[40vh] overflow-y-auto pr-2 space-y-2">
                        {selectedUser.current_position && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-300 bg-gray-900/50 px-3.5 py-2.5 rounded-xl border border-gray-800">
                                <FaBriefcase className="text-[#C5B239] flex-shrink-0 text-xs" />
                                <span>{selectedUser.current_position}</span>
                            </div>
                        )}

                        {selectedUser.current_company && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-300 bg-gray-900/50 px-3.5 py-2.5 rounded-xl border border-gray-800">
                                <FaBriefcase className="text-[#C5B239] flex-shrink-0 text-xs" />
                                <span>{selectedUser.current_company}</span>
                            </div>
                        )}

                        {selectedUser.college && (
                            <div className="flex items-center gap-2.5 text-sm text-gray-300 bg-gray-900/50 px-3.5 py-2.5 rounded-xl border border-gray-800">
                                <FaGraduationCap className="text-[#C5B239] flex-shrink-0 text-xs" />
                                <span>{selectedUser.college}</span>
                            </div>
                        )}

                        {selectedUser.bio && (
                            <p className="text-sm text-gray-400 mt-2 leading-relaxed">{selectedUser.bio}</p>
                        )}
                    </div>

                    <div className="text-xs text-gray-500 mt-4 pt-3 border-t border-gray-800 flex items-center gap-2">
                        <FaMapMarkerAlt className="text-[#C5B239] text-[10px]" />
                        {selectedUser.distance_km?.toFixed(2)} km away
                    </div>
                </div>
            )}

            <MapContainer
                center={[userLocation.latitude, userLocation.longitude]}
                zoom={11}
                className="h-full w-full"
                scrollWheelZoom={true}
                zoomControl={false}
            >
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a>'
                />
                <ZoomControl position="bottomleft" />

                {/* User location marker */}
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={userIcon}>
                    <Popup>
                        <div className="text-center">
                            <strong>You are here</strong>
                        </div>
                    </Popup>
                </Marker>

                {/* Nearby connections markers */}
                {nearbyConnections.map((conn) => (
                    <Marker
                        key={conn.user_id}
                        position={[parseFloat(conn.latitude), parseFloat(conn.longitude)]}
                        icon={connectionIcon}
                        eventHandlers={{
                            click: () => setSelectedUser(conn),
                        }}
                    >
                        <Popup>
                            <div className="text-center">
                                <strong>{conn.name}</strong>
                                <br />
                                <span className="text-sm text-gray-600">{conn.role}</span>
                                <br />
                                <span className="text-xs text-gray-500">
                                    {conn.distance_km?.toFixed(2)} km away
                                </span>
                            </div>
                        </Popup>
                    </Marker>
                ))}

                {/* Nearby radius circle */}
                <Circle
                    center={[userLocation.latitude, userLocation.longitude]}
                    radius={50000} // 50km in meters
                    pathOptions={{
                        color: "#C5B239",
                        fillColor: "#C5B239",
                        fillOpacity: 0.1,
                    }}
                />
            </MapContainer>
        </div>
    );

    return (
        <div className="flex flex-col h-screen">
            <Navbar />

            <div className="pt-20 flex-1 p-4 bg-[#0a0a0a] overflow-auto">
                {step === "check" && (
                    <div className="flex items-center justify-center h-full">
                        <div className="flex flex-col items-center gap-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5B239]"></div>
                            <p className="text-gray-400 font-medium">Checking your location...</p>
                        </div>
                    </div>
                )}

                {step === "input" && renderLocationInput()}

                {step === "map" && userLocation && renderMap()}
            </div>
        </div>
    );
};

export default MapPage;
