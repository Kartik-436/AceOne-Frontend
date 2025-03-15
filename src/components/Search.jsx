/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BarLoader from './Loaders/CustomLoader1';
import { Heart } from 'lucide-react';
import { addToWishlist } from "../utils/UserService";
import { toast } from "react-toastify";
import { addToCart } from "../utils/CartService";
import { useCart } from "../utils/CartContext";

const SearchProducts = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

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

    const { setIsCartMenuOpen } = useCart();

    const handleAddToCart = async (product) => {
        setIsCartMenuOpen(false);
        setLoading(true);

        const response = await addToCart(product, 1);

        if (response.success) {
            window.location.reload();
            toast.success("Item Added to your Cart !", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
            setIsCartMenuOpen(true)
        } else {
            toast.error("Error adding item to your Cart !", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            })
        }

        setLoading(false);
    };

    const handleAddToWishlist = async (product) => {
        try {
            const response = await addToWishlist(product);
            if (response.success) {
                toast.success("Item Added to your Wishlist !", {
                    position: "top-right",
                    autoClose: 3000,
                    hideProgressBar: false,
                    closeOnClick: true,
                    pauseOnHover: true,
                    draggable: true,
                    progress: undefined,
                    theme: "dark",
                })
            } else {
                toast.error(response.message)
            }
        } catch (error) {
            console.error("adding to wishlist error : ", error.message)
        }
    };

    return (
        <div className="relative w-full">
            <input
                className="search-with-icon px-4 py-2 bg-[#fff] md:inline-block hidden outline-none border-2 border-[#111] rounded-full w-full transition-all"
                type="search"
                name="search"
                id="search-with-icon"
                placeholder="Search Items"
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
                        className="absolute bg-white border border-gray-300 rounded-lg mt-3 w-[27vw] max-h-[40vh] overflow-y-auto p-2 overflow-x-hidden noScrollbar shadow-lg shadow-black"
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
                                            <p className="text-sm font-semibold max-w-[80%]">{product.name}</p>

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
                                    <div className="flex gap-2">
                                        <button
                                            id="Shp-Now-Home-Start"
                                            className="px-3 py-1 text-sm bg-[#fff] text-black rounded-full transition-all text-nowrap"
                                            onClick={() => handleAddToCart(product._id)}
                                        >
                                            Add to Cart
                                        </button>
                                        <button
                                            id="Shp-Now-Home-Start"
                                            className="px-2 py-1.5 text-sm border border-gray-400 rounded-full hover:bg-gray-200 transition-all text-nowrap"
                                            onClick={() => handleAddToWishlist(product._id)}
                                        >
                                            <Heart size={15} />
                                        </button>
                                    </div>
                                </motion.li>
                            );
                        })}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default SearchProducts;
