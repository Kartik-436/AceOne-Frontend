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
import AddToCartButton from "./AddToCartButton";
import useDelayedNavigation from "../utils/useDelayedNavigation";

const SearchProducts = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    const { animate, handleDelayNavigation } = useDelayedNavigation();

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
            const response = await axios.get(`http://localhost:3000/product/search?q=${searchTerm}`);
            setResults(response.data.data);
        } catch (error) {
            console.error("Search error:", error.message);
        } finally {
            setLoading(false);
        }
    };

    const { setIsCartMenuOpen } = useCart();

    const handleAddToCart = async (productId, selectedColor, selectedSize) => {
        setIsCartMenuOpen(false);
        setLoading(true);

        const response = await addToCart(productId, 1, selectedColor, selectedSize);

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
                className="search-with-icon px-4 py-1 bg-[#fff] md:inline-block hidden outline-none border-2 border-[#111] rounded-full w-full transition-all"
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
                        className="absolute bg-white border border-gray-300 rounded-lg mt-3 w-[27vw] max-h-[50vh] overflow-y-auto p-2 overflow-x-hidden noScrollbar shadow-lg shadow-black"
                    >
                        {results.map((product) => {
                            const discountPrice =
                                product.discount > 0
                                    ? product.price - (product.price * product.discount) / 100
                                    : null;

                            return (
                                <motion.li
                                    onClick={() => { handleDelayNavigation(`product/${product?._id}`) }}
                                    key={product._id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.3 }}
                                    className="flex items-center justify-between p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer rounded-lg"
                                >
                                    <div className="flex items-start gap-4 w-full">
                                        <img
                                            src={product.image || "https://via.placeholder.com/50"}
                                            alt={product.name}
                                            className="w-20 h-20 rounded-lg object-cover border-[1px] border-black"
                                        />
                                        <div className="flex justify-between h-full">
                                            <p className="text-sm font-semibold max-w-[80%]">{product.name}</p>
                                        </div>
                                        <div className="flex items-center justify-end w-full text-end h-full">
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
