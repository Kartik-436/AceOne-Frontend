/* eslint-disable no-unused-vars */
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Heart, X } from "lucide-react";
import AfterSignedInNavBar from '../components/NavBars/AfterSignedInNavBar'
import useDelayedNavigation from '../utils/useDelayedNavigation';
import useAuthStatus from '../utils/IsLoggedInChecker';
import BarLoader from '../components/Loaders/CustomLoader1';
import Footer from './../components/Footer/Footer';
import { getWishlist, removeFromWishlist } from "../utils/UserService";
import { toast } from "react-toastify";
import { addToCart } from "../utils/CartService";
import { useCart } from "../utils/CartContext";
import Transition from './../Transition';
import AddToCartButton from "../components/AddToCartButton";

const Wishlist = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { isLoggedIn, loading } = useAuthStatus();
    const [wishlistLoading, setWishlistLoading] = useState(true);
    const [wishlist, setWishlist] = useState(null);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();

    const refreshWishlist = async () => {
        try {
            const response = await getWishlist();
            if (response.success) {
                setWishlist(response.wishlist);
                setWishlistLoading(false);
            } else {
                console.error("wishlist error : ", response.message);
                setWishlistLoading(false);
            }
        } catch (error) {
            setWishlistLoading(false);
            console.error("wishlist error : ", error.message);
        }
    }

    useEffect(() => {
        refreshWishlist();
    }, []);

    const moveToCart = async (productId, selectedColor, selectedSize) => {
        setIsCartMenuOpen(false);
        setWishlistLoading(true);

        const response = await addToCart(productId, 1, selectedColor, selectedSize);

        if (response.success) {
            await handleRemoveFromWishlist(productId);
            toast.success("Item Added to your Cart !", {
                position: "top-right",
                autoClose: 3000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined,
                theme: "dark",
            });
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
            });
        }

        setWishlistLoading(false);
    };

    const handleRemoveFromWishlist = async (productID) => {
        try {
            const response = await removeFromWishlist(productID);

            if (response.success) {
                await refreshWishlist();
                toast.success(response.message, { theme: "dark" });
            } else {
                toast.error(response.message);
                await refreshWishlist();
            }
        } catch (error) {
            console.error("remove Wishlist error :", error.message);
        }
    }

    if (!isLoggedIn || loading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <div>
                <Transition animate={animate} />
                <AfterSignedInNavBar />

                <div className="bg-[#fbffef] min-h-screen w-full pt-[10.6vh] px-4 md:px-8 lg:px-16 pb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                        className="max-w-7xl mx-auto"
                    >
                        <div className="flex items-center justify-between py-8">
                            <h1 className="text-3xl md:text-4xl font-bold text-[#1f1f1f]">My Wishlist</h1>
                            <div className="bg-[#ffbb00] p-2 rounded-full">
                                <Heart size={24} className="text-[#1f1f1f]" />
                            </div>
                        </div>

                        {wishlistLoading ? (
                            <div className="flex justify-center items-center h-64">
                                <BarLoader />
                            </div>
                        ) : wishlist.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 100 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                                className="flex flex-col items-center justify-center h-96 rounded-3xl border-2 border-dashed border-[#1f1f1f]/20 p-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                >
                                    <Heart size={48} className="text-[#ffbb00]" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">Your Wishlist is Empty</h2>
                                <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                                    Items you love can be saved for later. Start exploring and add some favorites!
                                </p>
                                <button
                                    onClick={() => handleDelayNavigation("store")}
                                    className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1f1f1f]/90 transition-all cursor-pointer AddToCartInStore"
                                >
                                    Discover Products
                                </button>
                            </motion.div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {wishlist.map((product, index) => (
                                    <motion.div
                                        key={product.product._id || index}
                                        initial={{ opacity: 0, y: 60 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: index * 0.1 }}
                                        className="bg-[#1f1f1f] rounded-xl overflow-hidden shadow-xl flex flex-col justify-between"
                                    >
                                        <div className='relative'>
                                            <img
                                                src={product.product.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                                                alt={product.product.name}
                                                className='w-full h-64 object-cover text-white'
                                            />
                                            {product.product.discount && (
                                                <div className='absolute top-2 right-2 bg-[#ffbb00] text-white px-2 py-0.5 rounded-full font-medium font-[poppins] uppercase text-sm'>
                                                    SALE
                                                </div>
                                            )}
                                        </div>

                                        <div className='md:p-5 p-3 bg-[#fff] text-black'>
                                            <h3 className='text-xl font-semibold mb-2'>{product.product.name}</h3>
                                            <div className='flex justify-between items-center'>
                                                <div>
                                                    {product.product.discount ? (
                                                        <div className='flex items-center gap-2'>
                                                            <span className='text-lg font-bold'>₹{Math.round(product.product.discountPrice)}</span>
                                                            <span className='text-sm line-through opacity-70'>₹{product.product.price}</span>
                                                        </div>
                                                    ) : (
                                                        <span className='text-lg font-bold'>₹{product.product.price}</span>
                                                    )}
                                                    <p className='text-xs mt-1 text-black opacity-80'>{product.product.category}</p>
                                                </div>
                                                <div className='flex items-center justify-center gap-2'>
                                                    <div>
                                                        <AddToCartButton product={product?._id} CProduct={product.product} onAddToCart={moveToCart} />
                                                    </div>
                                                    <span
                                                        onClick={() => {
                                                            handleRemoveFromWishlist(product.product._id)
                                                        }}
                                                        id="Shp-Now-Home-Start"
                                                        className='bg-white rounded-full px-1 py-1 border-[1px] border-black text-black'
                                                    >
                                                        <X size={30} />
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>
                </div>

                <Footer />
            </div>
        );
    }
}

export default Wishlist;