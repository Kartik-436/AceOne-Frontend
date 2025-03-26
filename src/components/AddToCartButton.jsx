/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const AddToCartButton = ({ product, Name, Color, Size, onAddToCart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState("");
    const [selectedColor, setSelectedColor] = useState("");

    // Modify state initialization to handle different input types
    const [availableSizes, setAvailableSizes] = useState([]);
    const [availableColors, setAvailableColors] = useState([]);

    // Add useEffect to properly set sizes and colors
    useEffect(() => {
        // Handle cases where Size or Color might be a string or an array
        const processOptions = (option) => {
            // If it's already an array, return it
            if (Array.isArray(option)) return option;

            // If it's a string, split it by comma and trim
            if (typeof option === 'string') {
                return option.split(',').map(item => item.trim());
            }

            // If no valid option, return empty array
            return [];
        };

        // Set sizes
        const processedSizes = processOptions(Size);
        setAvailableSizes(processedSizes);

        // Set colors
        const processedColors = processOptions(Color);
        setAvailableColors(processedColors);
    }, [Size, Color]);

    const handleAdd = () => {
        if (selectedSize && selectedColor) {
            onAddToCart(product, selectedColor, selectedSize);
            setIsOpen(false);
        } else {
            toast.error("Please select size and color!");
        }
    };

    return (
        <>
            <button
                onClick={() => {
                    // Reset selections when opening
                    setSelectedSize("");
                    setSelectedColor("");
                    setIsOpen(true);
                }}
                id="Shp-Now-Home-Start"
                className="px-4 py-1.5 text-sm rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide text-nowrap"
            >
                Add to Cart
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/60 flex items-center backdrop-blur-sm justify-center z-[9999] p-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#1f1f1f] text-white p-6 rounded-2xl w-full max-w-md shadow-lg relative"
                            initial={{ scale: 0.35, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.35, opacity: 0 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`absolute top-3 right-3 text-[#fff] cursor-pointer transition`}
                            >
                                <X size={28} />
                            </button>

                            <h2 className="text-xl font-semibold text-center mb-2 text-[#fff]">Select Size & Color for</h2>
                            <h2 className="text-2xl text-nowrap font-bold text-center mb-5 text-[#ffbb00]">{Name}</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-black selection:bg-[#ffbb00] text-white"
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    >
                                        <option value="" disabled>Select Size</option>
                                        {availableSizes?.map((size) => (
                                            <option key={size} value={size} className="bg-black text-white selection:bg-[#ffbb00]">
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Select Color:</h3>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-500 selection:bg-[#ffbb00] bg-black text-white"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                    >
                                        <option value="" disabled>Select Color</option>
                                        {availableColors?.map((color) => (
                                            <option key={color} value={color} className="bg-black text-white selection:bg-[#ffbb00]">
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 pt-3 border-t border-gray-700 flex justify-center">
                                <button
                                    onClick={handleAdd}
                                    id="Shp-Now-Home-Start"
                                    className="px-4 py-2 text-sm rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide text-nowrap"
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default AddToCartButton;