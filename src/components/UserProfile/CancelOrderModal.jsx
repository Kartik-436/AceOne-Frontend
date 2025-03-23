/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash, X, ChevronDown } from 'lucide-react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId, isLoading }) => {
    const [selectedReason, setSelectedReason] = useState('');
    const [otherReason, setOtherReason] = useState('');

    const cancelReasons = [
        "Changed my mind",
        "Found a better price elsewhere",
        "Ordered by mistake",
        "Shipping takes too long",
        "Payment issues",
        "Other"
    ];

    const handleConfirm = () => {
        const reason = selectedReason === 'Other' ? otherReason : selectedReason;
        onConfirm(orderId, reason);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <motion.div
                        key="cancel-order-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black max-w-md w-full mx-4"
                    >
                        <div className="flex items-center mb-4">
                            <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                                <Trash size={18} className="text-red-600" />
                            </div>
                            <h2 className="text-lg font-semibold">Cancel Order</h2>
                        </div>

                        <p className="text-gray-600 mb-4">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Please select a reason for cancellation:
                            </label>
                            <div className="relative">
                                <select
                                    value={selectedReason}
                                    onChange={(e) => setSelectedReason(e.target.value)}
                                    className="w-full p-2 pr-10 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                                >
                                    <option value="" disabled>Select a reason...</option>
                                    {cancelReasons.map((reason) => (
                                        <option key={reason} value={reason}>
                                            {reason}
                                        </option>
                                    ))}
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                    <ChevronDown size={16} className="text-gray-500" />
                                </div>
                            </div>
                        </div>

                        {selectedReason === 'Other' && (
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Please specify:
                                </label>
                                <textarea
                                    value={otherReason}
                                    onChange={(e) => setOtherReason(e.target.value)}
                                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-20"
                                    placeholder="Tell us why you're cancelling this order..."
                                />
                            </div>
                        )}

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer active:scale-95 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={handleConfirm}
                                disabled={isLoading || (selectedReason === '' || (selectedReason === 'Other' && otherReason.trim() === ''))}
                                id='Shp-Now-Home-Start'
                                className="px-4 py-2 text-black rounded-lg cursor-pointer active:scale-95 bg-[#ffbb00] disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center text-nowrap"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                                        Cancelling...
                                    </>
                                ) : (
                                    "Yes, Cancel Order"
                                )}
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default CancelOrderModal;