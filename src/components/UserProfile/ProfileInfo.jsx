/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// components/ProfileInfo.jsx
import React, { useEffect, useRef, useState } from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { getUserDetails, updateProfilePicture, updateUserProfile } from '../../utils/UserService';
import { toast } from "react-toastify";
import BarLoader from '../Loaders/CustomLoader1';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from '../../Transition';
import { Loader } from "@googlemaps/js-api-loader";

const ProfileInfo = () => {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshUser = async () => {
        try {
            const response = await getUserDetails();
            if (response.success) {
                setUser(response.user);
            } else {
                console.error("Failed to refresh User:", response.message);
            }
        } catch (error) {
            console.error("Error refreshing User:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    const handleSave = async (updatedData) => {
        setLoading(true);

        try {
            // Format the data according to your User model schema
            const formattedData = {
                ...updatedData,
                // Format the address object correctly
                address: {
                    formattedAddress: updatedData.address?.formattedAddress || updatedData.address || "",
                    googleMapsLink: updatedData.address?.googleMapsLink || updatedData.googleMapsLink || ""
                }
            };

            // Remove any flattened address properties that might have come from the form
            if (formattedData.googleMapsLink) delete formattedData.googleMapsLink;

            // Fix date format - either send a properly formatted string or null
            if (formattedData.dateOfBirth) {
                // Ensure it's a valid date string in YYYY-MM-DD format
                const dateObj = new Date(formattedData.dateOfBirth);
                if (!isNaN(dateObj.getTime())) {
                    // Format as ISO string and take just the date part
                    formattedData.dateOfBirth = dateObj.toISOString().split('T')[0];
                } else {
                    // If invalid date, don't send this field
                    delete formattedData.dateOfBirth;
                }
            } else {
                // If empty, don't send this field
                delete formattedData.dateOfBirth;
            }

            const result = await updateUserProfile(formattedData);

            if (result.success) {
                toast.success(result.message, {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                });
                setIsEditing(false);
                await refreshUser();
            } else {
                toast.error(result.message || "Failed to update profile");
            }
        } catch (error) {
            console.error("Error updating profile:", error);
            toast.error("An error occurred while updating your profile");
        } finally {
            setLoading(false);
        }
    };

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            toast.error("Please select an image.");
            return;
        }

        setLoading(true);
        const formData = new FormData();
        formData.append("picture", selectedFile);

        const result = await updateProfilePicture(formData);

        if (result.success) {
            toast.success(result.message);
            setIsModalOpen(false);
            await refreshUser();
        } else {
            toast.error(result.message);
        }

        setLoading(false);
    };

    const { animate, handleDelayNavigation } = useDelayedNavigation();

    if (loading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <>
                <Transition />
                <div className='max-h-full overflow-y-scroll hideScrollBar'>
                    {/* Make header responsive with flex-col on small screens */}
                    <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-16 gap-4 sm:gap-0">
                        <h2 className="text-xl sm:text-2xl font-semibold uppercase font-[poppins] text-center sm:text-left">Profile Information</h2>
                        <button
                            className="px-4 sm:px-6 py-2 bg-[#111] text-[#ffbb00] rounded-full transition-colors w-full sm:w-auto AddToCartInStore border-2 border-black uppercase font-medium font-[poppins]"
                            onClick={() => setIsEditing(true)}
                        >
                            Edit Profile
                        </button>
                        {isEditing && (
                            <EditProfileModal
                                user={user}
                                onClose={() => setIsEditing(false)}
                                onSave={handleSave}
                            />
                        )}

                        {loading && <p className="text-center text-gray-500 mt-2">Updating...</p>}
                    </div>

                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.35, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                        className="flex flex-col justify-between gap-10 px-4 sm:px-20"
                    >
                        {/* Profile Image Section - centered on all screens */}
                        <motion.div className="flex flex-col items-center">
                            <div className="relative w-32 h-32 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-[#ffbb00] sm:ml-10">
                                <img
                                    src={user?.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"}
                                    alt="Profile"
                                    className="w-full h-full object-cover"
                                />
                                <div
                                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                                    onClick={() => setIsModalOpen(true)}
                                >
                                    <Camera size={30} className="text-gray-300" />
                                </div>

                                {isModalOpen && (
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50 px-4">
                                        <motion.div
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 100, opacity: 0 }}
                                            className="bg-[#111] text-white px-4 sm:px-8 py-6 rounded-2xl shadow-xl w-full max-w-xs sm:max-w-md sm:w-96 relative"
                                        >
                                            <h2 className="text-lg sm:text-xl font-semibold text-center mb-4">Update Profile Picture</h2>

                                            {/* File Input */}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full bg-[#222] text-white px-4 py-2 rounded-lg mb-4"
                                                name='picture'
                                            />

                                            {/* Buttons */}
                                            <div className="flex justify-between mt-4">
                                                <button
                                                    onClick={() => setIsModalOpen(false)}
                                                    className="px-3 sm:px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpload}
                                                    disabled={loading}
                                                    id='Save_Changes_Btn_Profile'
                                                    className="px-3 sm:px-5 py-2 bg-[#f5f5f5] text-black rounded-lg transition"
                                                >
                                                    {loading ? "Uploading..." : "Upload"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Profile Details Section - stack items vertically on mobile */}
                        <motion.div className="w-full max-h-full overflow-y-scroll noScrollbar">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500">Full Name</h3>
                                    <p className="font-medium break-words">{user?.fullName}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500">Email Address</h3>
                                    <p className="font-medium break-words">{user?.email}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <h3 className="text-sm text-gray-500">Phone Number</h3>
                                    <p className="font-medium break-words">{user?.contact}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg md:col-start-2 md:row-start-2">
                                    <h3 className="text-sm text-gray-500">Date Of Birth</h3>
                                    <p className="font-medium break-words">{user?.dateOfBirth
                                        ? new Date(user?.dateOfBirth).toDateString()
                                        : "Date of Birth Not Available"}</p>
                                </div>

                                <div className="bg-gray-50 p-3 rounded-lg md:col-span-2">
                                    <h3 className="text-sm text-gray-500">Address</h3>
                                    <p className={`font-medium break-words ${user?.address !== "" && user?.address !== undefined && user?.address !== null ? "" : "text-red-500"} `}>{user?.address?.formattedAddress || "Address is not added"}</p>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </div>
            </>
        );
    };
}

export default ProfileInfo;

const EditProfileModal = ({ user, onClose, onSave }) => {
    const [formData, setFormData] = useState({
        fullName: user?.fullName || "",
        email: user?.email || "",
        contact: user?.contact || "",
        address: user?.address?.formattedAddress || "",
        googleMapsLink: user?.address?.googleMapsLink || "",
        dateOfBirth: user?.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
    });

    const [mapLoaded, setMapLoaded] = useState(false);
    const [showMapSelector, setShowMapSelector] = useState(false);
    const mapRef = useRef(null);
    const markerRef = useRef(null);
    const googleMapRef = useRef(null);
    const autocompleteElementRef = useRef(null);

    useEffect(() => {
        const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
        if (!apiKey) {
            console.error("Google Maps API key is missing.");
            return;
        }

        const loader = new Loader({
            apiKey,
            version: "weekly",
            libraries: ["places"]
        });

        loader.load().then(() => {
            setMapLoaded(true);
        }).catch(error => {
            console.error("Error loading Google Maps API:", error);
        });
    }, []);

    useEffect(() => {
        if (mapLoaded && showMapSelector && mapRef.current) {
            initMap();
        }
    }, [mapLoaded, showMapSelector]);

    const initMap = () => {
        if (!window.google) {
            console.error("Google Maps API not loaded correctly.");
            return;
        }

        const google = window.google;
        const defaultLocation = { lat: 40.7128, lng: -74.006 };

        const map = new google.maps.Map(mapRef.current, {
            center: defaultLocation,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
        });
        googleMapRef.current = map;

        const marker = new google.maps.Marker({
            position: defaultLocation,
            map,
            draggable: true,
        });
        markerRef.current = marker;

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const pos = {
                        lat: position.coords.latitude,
                        lng: position.coords.longitude,
                    };
                    map.setCenter(pos);
                    marker.setPosition(pos);
                    updateAddressFromPosition(pos);
                },
                (error) => console.warn("Geolocation failed:", error.message)
            );
        }

        const addressInput = document.getElementById("address-input");
        const autocomplete = new google.maps.places.Autocomplete(addressInput);
        autocomplete.bindTo("bounds", map);

        autocomplete.addListener("place_changed", () => {
            const place = autocomplete.getPlace();
            if (!place.geometry || !place.geometry.location) return;

            map.setCenter(place.geometry.location);
            map.setZoom(17);
            marker.setPosition(place.geometry.location);
            updateAddressFromPlace(place);
        });

        google.maps.event.addListener(marker, "dragend", () => {
            updateAddressFromPosition(marker.getPosition());
        });

        google.maps.event.addListener(map, "click", (e) => {
            marker.setPosition(e.latLng);
            updateAddressFromPosition(e.latLng);
        });
    };

    const updateAddressFromPlace = (place) => {
        const formattedAddress = place.formatted_address;
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const googleMapsLink = `https://www.google.com/maps?q=${lat},${lng}`;

        setFormData(prev => ({ ...prev, address: formattedAddress, googleMapsLink }));
    };

    const updateAddressFromPosition = (position) => {
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ location: position }, (results, status) => {
            if (status === "OK" && results[0]) {
                setFormData(prev => ({
                    ...prev,
                    address: results[0].formatted_address,
                    googleMapsLink: `https://www.google.com/maps?q=${position.lat()},${position.lng()}`
                }));
            }
        });
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSave = () => {
        onSave({
            ...formData,
            address: {
                formattedAddress: formData.address,
                googleMapsLink: formData.googleMapsLink,
            },
        });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20 px-4">
            <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111] text-white px-4 sm:px-8 py-6 sm:py-16 rounded-2xl shadow-xl max-w-2xl w-full relative overflow-y-auto max-h-[90vh]"
            >
                <h2 className="text-xl sm:text-2xl font-semibold text-center mb-6 font-[poppins] uppercase">
                    Edit Profile
                </h2>

                {/* Form Fields */}
                <div className="space-y-4">
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Full Name"
                        className="w-full bg-[#222] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="email"
                        name="email"
                        disabled
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-[#222] text-gray-300 px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full bg-[#222] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />

                    {/* Address with Google Maps integration */}
                    <div className="space-y-2">
                        <div className="relative">
                            <input
                                id="address-input"
                                type="text"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                placeholder="Address"
                                className="w-full bg-[#222] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none pr-12"
                            />
                            <button
                                type="button"
                                // onClick={toggleMapSelector}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#ffbb00] p-2"
                                title="Select location on map"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </button>
                        </div>

                        {/* Map Selector */}
                        {showMapSelector && (
                            <div className="border border-[#333] rounded-lg overflow-hidden transition-all duration-300">
                                <div
                                    ref={mapRef}
                                    className="w-full h-[300px]"
                                ></div>
                                <div className="p-3 bg-[#222] text-sm">
                                    <p>Click on the map or search for an address to select your location</p>
                                </div>
                            </div>
                        )}

                        {/* Display the Google Maps link if available */}
                        {formData.googleMapsLink && (
                            <div className="text-sm text-gray-400 mt-1">
                                <a
                                    href={formData.googleMapsLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#ffbb00] hover:underline"
                                >
                                    View on Google Maps
                                </a>
                            </div>
                        )}
                    </div>

                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full bg-[#222] text-white px-4 sm:px-6 py-3 sm:py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition cursor-pointer order-2 sm:order-1"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        id='Save_Changes_Btn_Profile'
                        className="px-6 py-3 bg-[#e9e9e9] text-black rounded-lg transition order-1 sm:order-2"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};