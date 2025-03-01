/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Transition from "../../Transition";
import useDelayedNavigation from "../../utils/useDelayedNavigation";
import "../../stylesheets/NavBars.css";
import { AnimatePresence, delay, motion } from "framer-motion"; // Use framer-motion instead of motion/react
import FlipLink from "../MenuLinks";
import StaggeredDropDown from './../DropDownShopMenu';
import SmallStringAnimation from './../StringAnimations/SmallStringAnimation';
import { useCart } from "../../utils/CartContext";
import { getUserCart, removeFromCart, updateCartQuantity } from "../../utils/CartService";
import BarLoader from "../Loaders/CustomLoader1";
import { toast } from 'react-toastify';
import { Heart, ShoppingBasket } from "lucide-react";
import SearchProducts from "../Search";

const BeforeSignedInNavBar = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();

    const [products, setProducts] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);

    const increaseQuantity = async (productId) => {
        try {
            const response = await updateCartQuantity(productId, 1);
            if (response.success) {
                await refreshCart(); // Fetch updated cart from backend
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error increasing quantity:", error);
        }
    };

    const decreaseQuantity = async (productId) => {
        try {
            const response = await updateCartQuantity(productId, -1);
            if (response.success) {
                await refreshCart(); // Fetch updated cart from backend
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error decreasing quantity:", error);
        }
    };

    const removeProduct = async (productId) => {
        try {
            const response = await removeFromCart(productId);
            if (response.success) {
                setProducts(prevProducts =>
                    prevProducts.filter(product => product.productId !== productId)
                );
                await refreshCart(); // Ensure latest cart is fetched
                toast.success("Item removed from your Cart !", {
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
                console.error(response.message);
                toast.success("Error removing item from your Cart !", {
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
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    // Fetch latest cart data
    const refreshCart = async () => {
        try {
            const response = await getUserCart();
            if (response.success) {
                setProducts(response.cart);
            } else {
                console.error("Failed to refresh cart:", response.message);
            }
        } catch (error) {
            console.error("Error refreshing cart:", error);
        }
        setLoadingCart(false);
    };

    useEffect(() => {
        refreshCart();
    }, []); // Fetch cart on mount

    const subtotal = products.reduce((acc, product) => {
        const totalPrice = (product.productId.discount ? product.productId.discountPrice : product.productId.price) * product.quantity;
        return acc + totalPrice;
    }, 0);

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:w-1/2 w-screen h-screen bg-[#1b1c1e] z-[15] fixed right-0 top-0 origin-right"
                        variants={menuSlide}
                        animate="enter"
                        exit="exit"
                        initial="initial"
                    >
                        <motion.button
                            variants={slide}
                            animate="enter"
                            exit="exit"
                            initial="initial"
                            custom={2}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-6 right-6 px-3 py-2 bg-[#f8ffe5] rounded-full cursor-pointer active:scale-90"
                        >
                            <i className="ri-close-large-line text-black text-2xl font-bold"></i>
                        </motion.button>
                        <div
                            className="w-full h-full px-[8.6vw] py-[26vh] flex flex-col items-start justify-start gap-1.5"
                        >
                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={0}
                                onClick={() => { handleDelayNavigation("") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">HOME</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={1}
                                onClick={() => { handleDelayNavigation("about") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">ABOUT</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={1}
                                onClick={() => { handleDelayNavigation("cart") }}
                                className="md:hidden inline-block"
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">Cart</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={2}
                            >
                                <StaggeredDropDown></StaggeredDropDown>
                            </motion.div>
                        </div>
                    </motion.div>

                )}
            </AnimatePresence>

            <AnimatePresence>
                {isCartMenuOpen && (
                    <motion.div
                        className="md:w-1/4 w-screen h-screen bg-[#fbffef] border-l-2 border-black py-10 z-[15] fixed right-0 top-0 origin-right"
                        variants={menuSlide}
                        animate="enter"
                        exit="exit"
                        initial="initial"
                    >
                        <motion.button
                            variants={slide}
                            animate="enter"
                            exit="exit"
                            initial="initial"
                            custom={2}
                            onClick={() => setIsCartMenuOpen(false)}
                            className="absolute top-4 right-5 rounded-full cursor-pointer active:scale-90 z-20"
                        >
                            <i className="ri-close-large-line text-black text-2xl font-bold hover:text-red-500 transition-all duration-250 ease-in-out"></i>
                        </motion.button>
                        <div
                            className="w-full h-full flex flex-col items-center justify-between gap-1.5"
                        >
                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={0}
                                className="flex flex-col gap-3"
                            >
                                <div className="text-center">
                                    <span className="font-[poppins] font-semibold uppercase">My Cart</span>
                                    <span className="font-[poppins] font-light uppercase">({products.length} {products.length > 1 ? "items" : "item"})</span>
                                </div>

                                <div className="w-full items-center justify-center flex">
                                    <SmallStringAnimation />
                                </div>

                                <motion.div
                                    variants={slide}
                                    animate="enter"
                                    exit="exit"
                                    initial="initial"
                                    custom={1}
                                    className="max-h-[52vh] overflow-y-scroll flex flex-col gap-10 justify-start noScrollbar"
                                >
                                    {loadingCart &&
                                        <div className='h-full w-full flex items-center justify-center'>
                                            <BarLoader />
                                        </div>
                                    }
                                    {products.length === 0 ? (
                                        <motion.div
                                            initial={{ opacity: 0, y: 100 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                                            className="flex flex-col items-center justify-center h-96 rounded-3xl p-8"
                                        >
                                            <motion.div
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                                className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                            >
                                                <ShoppingBasket size={48} className="text-[#ffbb00]" />
                                            </motion.div>
                                            <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">Your Cart is Empty</h2>
                                            <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                                                Items you love can be Added to Cart. Start exploring and add some favorites!
                                            </p>
                                            <button
                                                onClick={() => {
                                                    handleDelayNavigation("store");
                                                    setIsCartMenuOpen(false)
                                                }}
                                                className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1f1f1f]/90 transition-all cursor-pointer AddToCartInStore"
                                            >
                                                Discover Products
                                            </button>
                                        </motion.div>
                                    ) : products.map(product => (
                                        <div key={product.productId._id} data-key={product.productId._id} className="border-b-[1px] px-3 border-[#1f1f1f60] py-4">
                                            <div className="flex gap-2 w-full h-full">
                                                <div className="w-[30%] h-[75%] border-[1px] border-black rounded-md">
                                                    <img src={product.productId.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"} alt="shoepic" />
                                                </div>

                                                <div className="flex flex-col w-full h-full gap-1">
                                                    <div className="flex items-start justify-between w-full pr-3">
                                                        <div className="flex flex-col h-full mb-2">
                                                            <span className="font-[poppins] font-semibold uppercase text-sm">{product.productId.name} ({product.productId.color})</span>
                                                            <span className="font-[poppins] font-normal uppercase text-xs">{product.productId.category} ({product.productId.size})</span>
                                                        </div>
                                                        <span className="cursor-pointer" onClick={() => removeProduct(product.productId._id)}><i className="ri-delete-bin-6-line text-lg cursor-pointer scale-y-125 hover:text-red-500 transition-colors duration-200"></i></span>
                                                    </div>

                                                    {product.productId.discount ? (
                                                        <div className="flex gap-1.5 items-center">
                                                            <span className="text-black font-light font-mono">₹{Math.round(product.productId.discountPrice)}</span>
                                                            <span className="text-black font-light font-mono line-through text-sm">₹{product.productId.price}</span>
                                                        </div>
                                                    ) : (
                                                        <span className='text-black font-light font-mono'>₹{product.productId.price}</span>
                                                    )}
                                                    <div className="flex items-start justify-between w-full pr-8">
                                                        <div className="flex items-center border-[1px] border-black rounded-md gap-3 px-2 py-0.5">
                                                            <button
                                                                disabled={product.quantity <= 1}
                                                                className={`cursor-pointer ${product.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                onClick={() => decreaseQuantity(product.productId._id)}
                                                            >
                                                                <i className="ri-subtract-line"></i>
                                                            </button>
                                                            <span>{product.quantity}</span>
                                                            <button
                                                                disabled={product.productId.stock <= product.quantity}
                                                                className={`cursor-pointer ${product.productId.stock <= product.quantity ? "opacity-50 cursor-not-allowed" : ""}`}
                                                                onClick={() => increaseQuantity(product.productId._id)}
                                                            >
                                                                <i className="ri-add-line"></i>
                                                            </button>
                                                        </div>
                                                        <span className="text-black font-light font-mono">₹{(product.productId.discount ? Math.round(product.productId.discountPrice) : product.productId.price) * product.quantity}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={2}
                                className="flex flex-col gap-5"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex items-center justify-center"><SmallStringAnimation /></div>
                                    <div className="flex items-center justify-between pr-4 mt-[-6vh]">
                                        <span className="text-lg">
                                            Subtotal
                                        </span>
                                        <span>
                                            ₹{Math.round(subtotal)}
                                        </span>
                                    </div>
                                    <div className="text-sm">Taxes and shipping are calculated at checkout.</div>
                                </div>

                                <div className="w-full items-center justify-center flex">
                                    <button
                                        onClick={() => {
                                            handleDelayNavigation("cart");
                                            setIsCartMenuOpen(false)
                                        }}
                                        id="NavBarButtons"
                                        className="px-30 py-2 uppercase md:text-base text-lg font-mono font-semibold text-black border-black rounded-full active:scale-90"
                                    >
                                        View Cart
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                )}
            </AnimatePresence>

            <Transition animate={animate} />

            <div className="w-full h-[10.6vh] bg-[#fbffef] fixed top-0 left-0 z-[10]">
                <div className="flex items-center justify-between w-full h-full px-4 md:px-10">
                    <div>
                        <h1 onClick={() => { handleDelayNavigation("") }} className="text-2xl md:text-3xl font-black font-[Marcellus] select-none cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-[#ffbb00] from-45% to-45% to-[#1f1f1f]">AceOne.</h1>
                    </div>

                    <div className="flex items-center gap-1 md:gap-5 h-full">
                        <SearchProducts />
                        <div className="md:flex hidden items-center gap-2 h-full">
                            <span
                                onClick={() => {
                                    handleDelayNavigation("login")
                                    toast.error("Login to add items to your Wishlist !", {
                                        position: "top-right",
                                        autoClose: 3000,
                                        hideProgressBar: false,
                                        closeOnClick: true,
                                        pauseOnHover: true,
                                        draggable: true,
                                        progress: undefined,
                                        theme: "dark",
                                    })
                                }}
                                className="relative cursor-pointer active:scale-90 flex items-center justify-center"
                            >
                                <Heart size={34} stroke="#1f1f1f" />
                            </span>
                            <span className="relative cursor-pointer active:scale-90" onClick={() => setIsCartMenuOpen(true)}>
                                <p className="w-3.5 h-5 bg-white rounded-full flex items-center justify-center font-bold absolute right-2 bottom-5">
                                    {products.length}
                                </p>
                                <i className="ri-shopping-cart-line text-3xl text-black"></i>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 h-full">
                            <button
                                onClick={() => {
                                    handleDelayNavigation("ownerLogin");
                                }}
                                id="NavBarButtons"
                                className="md:px-5 px-2 py-1 md:text-base text-sm text-nowrap uppercase font-mono font-semibold text-black border-black rounded-full active:scale-90 md:block hidden"
                            >
                                Login as Owner
                            </button>
                            <button
                                onClick={() => {
                                    handleDelayNavigation("register");
                                }}
                                id="NavBarButtons"
                                className="md:px-9 px-4 py-1 md:text-base text-sm text-nowrap uppercase font-mono font-semibold text-black border-black rounded-full active:scale-90"
                            >
                                Sign Up
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                id="NavBarButtons"
                                className="px-6 py-1 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90"
                            >
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BeforeSignedInNavBar;

const menuSlide = {
    initial: {
        x: "calc(100% + 100px)",
        borderBottomLeftRadius: 500,
        borderTopLeftRadius: 500,
    },
    enter: {
        x: "0%",
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
        x: "calc(100% + 50px)",
        borderBottomLeftRadius: 500,
        borderTopLeftRadius: 500,
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    }
}

const slide = {
    initial: {
        x: "150px"
    },
    enter: (i) => ({
        x: "0px",
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.095 * i }
    }),
    exit: (i) => ({
        x: "150px",
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.095 * i }
    })
}