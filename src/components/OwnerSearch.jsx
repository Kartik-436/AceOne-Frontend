/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BarLoader from './Loaders/CustomLoader1';
import { Heart, Trash2 } from 'lucide-react';
import { toast } from "react-toastify";
import { deleteProduct } from "../utils/OwnerService";

const OwnerSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                fetchSearchResults(query);
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const fetchSearchResults = async (searchTerm) => {
        try {
            setLoading(true);
            const response = await axios.get(`/api/product/search?q=${searchTerm}`);
            setResults(response.data.data);
        } catch (error) {
            console.error("Search error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteProduct = async (Pid) => {
        try {
            const response = await deleteProduct(Pid);
            if (response.success) {
                toast.success("Product deleted successfully");
            } else {
                console.error("product deletion error: ", response.messages)
                toast.error("Failed to delete product")
            }
        } catch (error) {
            console.error("Delete error:", error.message);
            toast.error("Failed to delete product");
        }
    };

    return (
        <div className="relative w-full">
            <input
                className="search-with-icon px-4 py-2 bg-[#fff] md:inline-block hidden outline-none border-2 border-[#111] rounded-full w-full transition-all"
                type="search"
                name="search"
                id="search-with-icon"
                placeholder="Search Products to Edit or Delete"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {loading && <p className="flex items-center justify-center"><BarLoader /></p>}

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5, staggerChildren: 0.5, delay: 0.3, ease: "anticipate" }}
                        className="absolute bg-white border border-gray-300 rounded-lg mt-3 w-[34vw] max-h-[40vh] overflow-y-auto p-2 overflow-x-hidden noScrollbar shadow-lg shadow-black z-20"
                    >
                        {results.map((product) => {
                            const discountPrice =
                                product.discount > 0
                                    ? product.price - (product.price * product.discount) / 100
                                    : null;

                            return (
                                <motion.li
                                    key={product._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-start justify-between p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer rounded-lg"
                                >
                                    <div className="flex items-start gap-4">
                                        <img
                                            src={product.image || "https://via.placeholder.com/50"}
                                            alt={product.name}
                                            className="w-20 h-20 rounded-lg object-cover border-[1px] border-black"
                                        />
                                        <div className="flex flex-col justify-between h-full">
                                            <div className="flex flex-col gap-1">
                                                <p className="text-sm font-semibold">{product.name} ({product.color})</p>
                                                <p className="text-sm font-semibold">{product.category} ({product.size})</p>
                                            </div>
                                            {product.discount > 0 ? (
                                                <p className="text-sm text-black font-semibold">
                                                    ${discountPrice.toFixed(2)}{" "}
                                                    <span className="line-through text-gray-500">${product.price}</span>
                                                </p>
                                            ) : (
                                                <p className="text-sm text-gray-900 font-semibold">${product.price}</p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex gap-2 items-center h-full w-[40%] justify-end">
                                        <button
                                            onClick={() => {
                                                setConfirmModalOpen(true)
                                            }}
                                            id="Shp-Now-Home-Start"
                                            className="p-4 text-sm border border-gray-400 rounded-full hover:bg-gray-300 transition-all"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                    <ConfirmationModal isOpen={confirmModalOpen} onClose={() => { setConfirmModalOpen(false) }} onConfirm={() => { handleDeleteProduct(product._id) }} />
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OwnerSearch;

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50">
                    <motion.div
                        key="logout-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to Delete a product ?</p>
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
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};