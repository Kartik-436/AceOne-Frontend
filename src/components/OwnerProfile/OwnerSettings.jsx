/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { getOwnerProfile, updateOwnerProfile } from '../../utils/OwnerService';
import { AnimatePresence, motion } from 'motion/react';
import { User, Mail, Phone, Calendar, Briefcase } from 'lucide-react';
import { toast } from 'react-toastify';

const OwnerSettings = ({ setActive, setActiveTab }) => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [owner, setOwner] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [profilePicture, setProfilePicture] = useState(null);
    const [picturePreview, setPicturePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        contact: '',
        dateOfBirth: '',
        gstNo: '',
    });

    const refreshOwner = async () => {
        try {
            setLoading(true);
            const response = await getOwnerProfile();

            if (response.success) {
                setOwner(response.data);
                setProfileData({
                    fullName: response.data.fullName || '',
                    email: response.data.email || '',
                    contact: response.data.contact || '',
                    dateOfBirth: response.data.dateOfBirth ? new Date(response.profile.dateOfBirth).toISOString().split('T')[0] : '',
                    gstNo: response.data.gstNo || '',
                });
                setPicturePreview(response.data.picture || null);
            } else {
                setError(response.message);
                console.error("Getting Owner Error: ", response.message);
            }
        } catch (error) {
            console.error("Getting Owner Error: ", error);
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData({
            ...profileData,
            [name]: value
        });
    };

    const handlePictureChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePicture(file);

            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPicturePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!profileData.fullName.trim()) newErrors.fullName = "Full name is required";
        if (!profileData.email.trim()) newErrors.email = "Email is required";
        if (!profileData.contact.trim()) newErrors.contact = "Contact number is required";

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (profileData.email && !emailRegex.test(profileData.email)) {
            newErrors.email = "Please enter a valid email address";
        }

        // Phone validation
        const phoneRegex = /^\d{10}$/;
        if (profileData.contact && !phoneRegex.test(profileData.contact)) {
            newErrors.contact = "Please enter a valid 10-digit phone number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setConfirmModalOpen(true);
    };

    const handleConfirmUpdate = async () => {
        setLoading(true);
        setConfirmModalOpen(false);

        try {
            // Create FormData to handle file upload
            const formData = new FormData();

            // Append profile picture if selected
            if (profilePicture) {
                formData.append('picture', profilePicture);
            }

            // Append other profile data
            formData.append('fullName', profileData.fullName);
            formData.append('email', profileData.email);
            formData.append('contact', profileData.contact);

            if (profileData.dateOfBirth) {
                formData.append('dateOfBirth', profileData.dateOfBirth);
            }

            if (profileData.gstNo) {
                formData.append('gstNo', profileData.gstNo);
            }

            const response = await updateOwnerProfile(formData);

            if (response.success) {
                toast.success("Profile updated successfully");
                await refreshOwner();
            } else {
                toast.error(response.message || "Failed to update profile");
                console.error('Error updating profile:', response.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error(error.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ; (async () => {
            await refreshOwner();
        })()
    }, []);

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex items-center justify-center min-h-[94vh]'>
                <div className='w-full bg-[#1f1f1f] min-h-[88vh] justify-around flex flex-col text-[#fff] p-6 rounded-lg shadow-xl'>
                    <h2 className='text-4xl font-bold mb-6 text-[#ffbb00]'>Owner Profile Settings</h2>

                    {loading && !owner ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="text-center">
                                <p className="text-[#ffbb00] mb-2">Loading your profile...</p>
                                <div className="loader"></div>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <p>{error}</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className='space-y-12'>
                            {/* Profile Picture Upload */}
                            <div className='mb-10'>
                                <label className='block text-sm font-medium mb-2'>
                                    Profile Picture
                                </label>
                                <div className='flex items-center space-x-4'>
                                    <div
                                        className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-full overflow-hidden'
                                        style={{ background: picturePreview ? 'transparent' : '#2a2a2a' }}
                                    >
                                        {picturePreview ? (
                                            <img src={picturePreview} alt="Preview" className='w-full h-full object-cover' />
                                        ) : (
                                            <User className='text-[#ffbb00]' size={32} />
                                        )}
                                    </div>
                                    <div className='flex-1'>
                                        <input
                                            type="file"
                                            id="picture"
                                            accept="image/*"
                                            className='hidden'
                                            onChange={handlePictureChange}
                                        />
                                        <label
                                            htmlFor="picture"
                                            className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore'
                                        >
                                            Choose Image
                                        </label>
                                    </div>
                                </div>
                            </div>

                            {/* Two column layout for form fields */}
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                {/* Full Name */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>
                                        Full Name <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <User className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={profileData.fullName}
                                            onChange={handleChange}
                                            className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                            placeholder="Enter full name"
                                            required
                                        />
                                    </div>
                                    {errors.fullName && <p className='text-red-500 text-xs mt-1'>{errors.fullName}</p>}
                                </div>

                                {/* Email */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>
                                        Email <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Mail className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="email"
                                            name="email"
                                            value={profileData.email}
                                            onChange={handleChange}
                                            className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                            placeholder="Enter email address"
                                            required
                                        />
                                    </div>
                                    {errors.email && <p className='text-red-500 text-xs mt-1'>{errors.email}</p>}
                                </div>

                                {/* Contact */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>
                                        Contact <span className='text-red-500'>*</span>
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Phone className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="tel"
                                            name="contact"
                                            value={profileData.contact}
                                            onChange={handleChange}
                                            className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                            placeholder="Enter contact number"
                                            required
                                        />
                                    </div>
                                    {errors.contact && <p className='text-red-500 text-xs mt-1'>{errors.contact}</p>}
                                </div>

                                {/* Date of Birth */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>
                                        Date of Birth
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Calendar className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="date"
                                            name="dateOfBirth"
                                            value={profileData.dateOfBirth}
                                            onChange={handleChange}
                                            className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                        />
                                    </div>
                                </div>

                                {/* GST Number */}
                                <div>
                                    <label className='block text-sm font-medium mb-1'>
                                        GST Number
                                    </label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                                            <Briefcase className="text-gray-400" size={18} />
                                        </div>
                                        <input
                                            type="text"
                                            name="gstNo"
                                            value={profileData.gstNo}
                                            onChange={handleChange}
                                            className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 pl-10 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                            placeholder="Enter GST number"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <div className='mt-8'>
                                <button
                                    type="submit"
                                    className='w-full bg-[#fff] text-[#1f1f1f] font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center cursor-pointer AddToCartInStore'
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Updating Profile...</span>
                                    ) : (
                                        "Update Profile"
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>

            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={handleConfirmUpdate}
            />
        </>
    );
};

export default OwnerSettings;

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50">
                    <motion.div
                        key="Confirmation-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Edit</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to update the details ?</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer active:scale-95"
                            >
                                No
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer active:scale-95"
                            >
                                Yes, update
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};