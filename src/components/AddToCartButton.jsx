/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { toast } from "react-toastify";
import { getProductById } from "../utils/ProductService";

const AddToCartButton = ({ product, onAddToCart }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [CProduct, setCProduct] = useState(null);
    const [availableSizes, setavailableSizes] = useState(null);
    const [availableColors, setavailableColors] = useState(null);

    useEffect(() => {
        const getProduct = async (productId) => {
            try {
                const response = await getProductById(productId);

                if (response.success) {
                    setCProduct(response.product)
                    setavailableSizes(CProduct?.size || "Error Getting Sizes");
                    setavailableColors(CProduct?.color || "Error Getting Colours");
                } else {
                    toast.error("Error getting product !");
                    console.error(response.error)
                }
            } catch (error) {
                console.error(error);
            }
        }

        getProduct(product);
    }, [])

    const handleAdd = () => {
        if (selectedSize && selectedColor) {
            onAddToCart(product._id, selectedColor, selectedSize);
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
                        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="bg-[#1f1f1f] text-white p-6 rounded-2xl w-96 shadow-lg relative"
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

                            <h2 className="text-2xl font-semibold text-center mb-6 text-[#fff]">Select Size & Color</h2>

                            <div className="space-y-4">
                                <div>
                                    <h3 className="text-lg font-semibold mb-2">Select Size:</h3>
                                    <select
                                        className="w-full px-4 py-2 rounded-lg border border-gray-500 bg-black text-white"
                                        value={selectedSize}
                                        onChange={(e) => setSelectedSize(e.target.value)}
                                    >
                                        <option value="" disabled>Select Size</option>
                                        {availableSizes.map((size) => (
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
                                        {availableColors.map((color) => (
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
