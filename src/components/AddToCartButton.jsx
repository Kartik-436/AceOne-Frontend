/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";

const AddToCartButton = ({ product, CProduct, onAddToCart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [availableSizes, setavailableSizes] = useState(Array.isArray(CProduct?.color) ? CProduct?.color : []);
    const [availableColors, setavailableColors] = useState(Array.isArray(CProduct?.size) ? CProduct?.size : []);

    console.log(CProduct?.name + "  " + CProduct.color + CProduct.size)

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
                onClick={() => setIsOpen(true)}
                id="Shp-Now-Home-Start"
                className="px-4 py-1.5 text-sm rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide text-nowrap"
            >
                Add to Cart
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2 w-screen h-screen bg-black/60 flex items-center justify-center z-[99]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#1f1f1f] text-white p-6 scale-95 rounded-2xl w-[45vw] shadow-lg relative"
                            initial={{ scale: 0.35, opacity: 0, y: 200 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.35, opacity: 0, y: 200 }}
                            transition={{ duration: 0.4, ease: "easeInOut" }}
                        >
                            <button
                                onClick={() => setIsOpen(false)}
                                className={`absolute top-3 right-3 text-[#fff] cursor-pointer transition`}
                            >
                                <X size={28} />
                            </button>

                            <h2 className="text-xl font-semibold text-center mb-2 text-[#fff]">Select Size & Color for</h2>
                            <h2 className="text-2xl text-nowrap font-bold text-center mb-5 text-[#ffbb00]">{CProduct.name}</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-black text-white"
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    >
                                        <option value="" disabled>Select Size</option>
                                        {availableSizes?.map((size) => (
                                            <option key={size} value={size} className="bg-black text-white">
                                                {size}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Select Color:</h3>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-black text-white"
                                        value={selectedColor}
                                        onChange={(e) => setSelectedColor(e.target.value)}
                                    >
                                        <option value="" disabled>Select Color</option>
                                        {availableColors?.map((color) => (
                                            <option key={color} value={color} className="bg-black text-white">
                                                {color}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="mt-6 pt-3 border-t border-gray-700">
                                <button
                                    onClick={handleAdd}
                                    id="Shp-Now-Home-Start"
                                    className="px-4 py-1.5 text-sm rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide text-nowrap"
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
