/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// components/ProfileInfo.jsx
import React, { useEffect, useState } from 'react';
import { Camera } from 'lucide-react';
import { motion } from 'motion/react';
import { getUserDetails, updateProfilePicture, updateUserProfile } from '../../utils/UserService';
import { toast } from "react-toastify";
import BarLoader from '../Loaders/CustomLoader1';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from '../../Transition';

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

        const result = await updateUserProfile(updatedData);

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
            toast.error(result.message);
        }

        setLoading(false);
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
                <div className='overflow-hidden'>
                    <div className="flex justify-between items-center mb-16">
                        <h2 className="text-2xl font-semibold uppercase font-[poppins]">Profile Information</h2>
                        <button
                            id='Shp-Now-Home-Start'
                            className="px-6 py-2 bg-[#ffbb00] text-black rounded-full transition-colors"
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
                        className="flex flex-col justify-between gap-10 px-20"
                    >
                        {/* Profile Image Section */}
                        <motion.div
                            // initial={{ scale: 0 }}
                            // animate={{ scale: 1 }}
                            // transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center"
                        >
                            <div className="relative w-40 h-40 rounded-full overflow-hidden border-2 border-[#ffbb00] ml-10">
                                <img
                                    src={user?.picture}
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
                                    <div className="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50">
                                        <motion.div
                                            initial={{ y: 100, opacity: 0 }}
                                            animate={{ y: 0, opacity: 1 }}
                                            exit={{ y: 100, opacity: 0 }}
                                            className="bg-[#111] text-white px-8 py-6 rounded-2xl shadow-xl w-96 relative"
                                        >
                                            <h2 className="text-xl font-semibold text-center mb-4">Update Profile Picture</h2>

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
                                                    className="px-5 py-2 bg-gray-600 rounded-lg hover:bg-gray-500 transition cursor-pointer"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleUpload}
                                                    disabled={loading}
                                                    id='Save_Changes_Btn_Profile'
                                                    className="px-5 py-2 bg-[#f5f5f5] text-black rounded-lg transition"
                                                >
                                                    {loading ? "Uploading..." : "Upload"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    </div>
                                )}
                            </div>
                        </motion.div>

                        {/* Profile Details Section */}
                        <motion.div
                            className="ml-50"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h3 className="text-sm text-gray-500">Full Name</h3>
                                    <p className="font-medium">{user?.fullName}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">Email Address</h3>
                                    <p className="font-medium">{user?.email}</p>
                                </div>

                                <div>
                                    <h3 className="text-sm text-gray-500">Phone Number</h3>
                                    <p className="font-medium">{user?.contact}</p>
                                </div>

                                <div className="md:col-span-2">
                                    <h3 className="text-sm text-gray-500">Address</h3>
                                    <p className={`font-medium ${user?.address !== "" && user?.address !== undefined && user?.address !== null ? "" : "text-red-500"} `}>{user?.address || "Address is not added"}</p>
                                </div>

                                <div className='md:col-start-2 row-start-2'>
                                    <h3 className="text-sm text-gray-500">Date Of Birth</h3>
                                    <p className="font-medium">{user?.dateOfBirth
                                        ? new Date(user?.dateOfBirth).toDateString()
                                        : "Date of Birth Not Available"}</p>
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
        address: user?.address || "",
        dateOfBirth: user?.dateOfBirth
            ? new Date(user.dateOfBirth).toISOString().split("T")[0]
            : "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm z-20">
            <motion.div
                initial={{ y: 500, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-[#111] text-white px-8 py-16 rounded-2xl shadow-xl max-w-lg w-full relative"
            >
                <h2 className="text-2xl font-semibold text-center mb-6 font-[poppins] uppercase">
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
                        className="w-full bg-[#222] text-white px-6 py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="email"
                        name="email"
                        disabled
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email Address"
                        className="w-full bg-[#222] text-gray-300 px-6 py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="text"
                        name="contact"
                        value={formData.contact}
                        onChange={handleChange}
                        placeholder="Phone Number"
                        className="w-full bg-[#222] text-white px-6 py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        className="w-full bg-[#222] text-white px-6 py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                    <input
                        type="date"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        className="w-full bg-[#222] text-white px-6 py-4 rounded-lg focus:ring-2 focus:ring-[#ffbb00] outline-none"
                    />
                </div>

                {/* Buttons */}
                <div className="flex justify-between mt-6">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 bg-gray-600 rounded-lg hover:bg-gray-500 transition cursor-pointer"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={() => onSave(formData)}
                        id='Save_Changes_Btn_Profile'
                        className="px-6 py-3 bg-[#e9e9e9] text-black rounded-lg transition"
                    >
                        Save Changes
                    </button>
                </div>
            </motion.div>
        </div>
    );
};