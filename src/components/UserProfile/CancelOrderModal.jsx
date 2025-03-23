/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trash, X } from 'lucide-react';

const CancelOrderModal = ({ isOpen, onClose, onConfirm, orderId, isLoading }) => {
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

                        <p className="text-gray-600">
                            Are you sure you want to cancel this order? This action cannot be undone.
                        </p>

                        <div className="mt-6 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                disabled={isLoading}
                                className="px-4 py-2 bg-gray-200 rounded-lg cursor-pointer active:scale-95 hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Keep Order
                            </button>
                            <button
                                onClick={() => onConfirm(orderId)}
                                disabled={isLoading}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer active:scale-95 hover:bg-red-600 transition-colors flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
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