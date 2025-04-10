/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnimatedStatusSelector = ({ orderStatuses, selectedStatus, setSelectedStatus }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const toggleDropdown = () => setIsOpen(!isOpen);

    const handleStatusSelect = (status) => {
        setSelectedStatus(status);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Format status name for display
    const formatStatusName = (status) => {
        return status === 'all' ? 'All Orders' : status;
    };

    // Get background color for status pill
    const getStatusColor = (status) => {
        const statusColors = {
            "all": "bg-[#111] text-white",
            "Cancelled": "bg-red-100 text-red-600",
            "Shipped": "bg-blue-100 text-blue-600",
            "Delivered": "bg-green-100 text-green-600",
            "Awaiting Payment": "bg-yellow-100 text-yellow-700",
            "Pending": "bg-orange-100 text-orange-600",
            "Confirmed": "bg-purple-100 text-purple-600",
            "Processing": "bg-indigo-100 text-indigo-600",
            "Payment Failed": "bg-red-100 text-red-700"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <div className="relative flex gap-4" ref={dropdownRef}>
            <label htmlFor="orderStatusFilter" className="block mb-2 font-medium text-gray-700">Status:</label>

            <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={toggleDropdown}
                className="flex items-center overflow-x-hidden cursor-pointer noScrollbar justify-between w-56 px-4 py-2.5 bg-white border border-gray-200 rounded-lg shadow-sm hover:border-[#ffbb00]/50 transition-all duration-200"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls="status-options"
            >
                <div className="flex items-center gap-2">
                    <span className={`h-2.5 w-2.5 rounded-full ${selectedStatus === 'all' ? 'bg-[#ffbb00]' :
                        selectedStatus === 'Delivered' ? 'bg-green-500' :
                            selectedStatus === 'Cancelled' ? 'bg-red-500' :
                                selectedStatus === 'Pending' ? 'bg-orange-500' :
                                    selectedStatus === 'Processing' ? 'bg-indigo-500' :
                                        selectedStatus === 'Shipped' ? 'bg-blue-500' :
                                            selectedStatus === 'Awaiting Payment' ? 'bg-yellow-500' :
                                                selectedStatus === 'Confirmed' ? 'bg-purple-500' :
                                                    selectedStatus === 'Payment Failed' ? 'bg-red-600' : 'bg-gray-400'
                        }`} />
                    <span className="text-gray-700 font-medium truncate">
                        {formatStatusName(selectedStatus)}
                    </span>
                </div>

                <motion.div
                    animate={{ rotate: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                >
                    <ChevronDown size={18} className="text-gray-500" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="absolute z-50 w-56 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden"
                        id="status-options"
                        role="listbox"
                    >
                        <motion.ul className="py-1 max-h-60 overflow-x-hidden noScrollbar overflow-auto">
                            {orderStatuses.map((status, index) => (
                                <motion.li
                                    key={status}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.03 }}
                                    onClick={() => handleStatusSelect(status)}
                                    className={`flex items-center justify-between px-4 py-2.5 cursor-pointer ${selectedStatus === status
                                        ? 'bg-[#ffbb00]/10'
                                        : 'hover:bg-gray-50'
                                        }`}
                                    role="option"
                                    aria-selected={selectedStatus === status}
                                >
                                    <div className="flex items-center gap-2">
                                        <span className={`h-2.5 w-2.5 rounded-full ${status === 'all' ? 'bg-[#ffbb00]' :
                                            status === 'Delivered' ? 'bg-green-500' :
                                                status === 'Cancelled' ? 'bg-red-500' :
                                                    status === 'Pending' ? 'bg-orange-500' :
                                                        status === 'Processing' ? 'bg-indigo-500' :
                                                            status === 'Shipped' ? 'bg-blue-500' :
                                                                status === 'Awaiting Payment' ? 'bg-yellow-500' :
                                                                    status === 'Confirmed' ? 'bg-purple-500' :
                                                                        status === 'Payment Failed' ? 'bg-red-600' : 'bg-gray-400'
                                            }`} />
                                        <span className="text-gray-700">
                                            {formatStatusName(status)}
                                        </span>
                                    </div>

                                    {selectedStatus === status && (
                                        <Check size={16} className="text-[#ffbb00]" />
                                    )}
                                </motion.li>
                            ))}
                        </motion.ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default AnimatedStatusSelector;
