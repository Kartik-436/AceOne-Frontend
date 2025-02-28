/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer';
import { AnimatePresence, easeInOut, motion } from 'motion/react';
import SmallStringAnimation from '../components/StringAnimations/SmallStringAnimation';
import BarLoader from '../components/Loaders/CustomLoader1';
import axios from 'axios';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import AfterSignedInNavBar from '../components/NavBars/AfterSignedInNavBar';
import Transition from '../Transition';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import useAuthStatus from '../utils/IsLoggedInChecker';
import { getUserCart, removeFromCart, updateCartQuantity } from '../utils/CartService';
import { addToWishlist } from '../utils/UserService';
import { toast } from 'react-toastify';
import { Heart, ShoppingBasket } from 'lucide-react';

const Cart = () => {
    const [user, setuser] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [loadingCart, setLoadingCart] = useState(true);
    const [cartUpdated, setCartUpdated] = useState(false);

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
                await refreshCart();
            } else {
                console.error(response.message);
            }
        } catch (error) {
            console.error("Error removing product:", error);
        }
    };

    const moveToWishlist = async (Pid) => {
        try {
            const response = await addToWishlist(Pid);

            if (response.success) {
                await removeProduct(Pid);
                toast.success("Added item to your wishlist !");
            }
        } catch (error) {
            console.error("Error moving to wishlist:", error);
        }
    }

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
    }, []);

    const subtotal = products.reduce((acc, product) => {
        const totalPrice = (product.productId.discount ? product.productId.discountPrice : product.productId.price) * product.quantity;
        return acc + totalPrice;
    }, 0);

    const total = subtotal + deliveryFee;

    const { isLoggedIn, loading } = useAuthStatus();

    if (loading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <AnimatePresence mode='sync'>
                    <Transition animate={animate} />
                    {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

                    <div className='flex flex-col md:flex-row items-start justify-center w-full px-5 md:px-[20vw] md:pt-[25vh] py-[10vh] pt-[15vh] md:py-[20vh] gap-16 md:gap-10 bg-[#fbffef]'>
                        <div className='md:w-[65%] w-full h-full flex gap-2 flex-col'>
                            <div className='flex flex-col items-center justify-center'>
                                <div className='w-full h-full flex items-center justify-between mb-5'>
                                    <div className='text-xl font-[poppins] scale-y-110 text-black font-light'>My Cart</div>
                                    <div onClick={refreshCart} className='cursor-pointer'><i className="ri-restart-line text-2xl font-[poppins] scale-y-110 text-black font-light cursor-pointer"></i></div>
                                </div>
                                <hr className='w-full h-[1px]' />
                            </div>

                            <div className='flex flex-col md:justify-start md:gap-0 gap-5 hideScrollBar max-h-[55vh] overflow-y-scroll'>
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
                                            onClick={() => handleDelayNavigation("store")}
                                            className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1f1f1f]/90 transition-all cursor-pointer AddToCartInStore"
                                        >
                                            Discover Products
                                        </button>
                                    </motion.div>
                                ) : products.map(product => (
                                    <div key={product.productId._id} data-key={product.productId._id} className='flex justify-between md:gap-15 h-[24vh] w-full px-2 py-5 border-b-[1px] border-black'>
                                        <div className='flex gap-2 items-start md:gap-4 h-full w-full'>
                                            <div className='border-[1px] border-black h-full min-w-[50%] rounded-sm'>
                                                <img src={product.productId.image !== "" ? product.productId.image : "placeholder.jpg"} className='h-full w-full object-cover' alt={product.productId.name} />
                                            </div>
                                            <div className='flex flex-col h-full w-full justify-between gap-2'>
                                                <div className='flex flex-col items-start justify-center gap-2'>
                                                    <h1 className='text-lg font-[poppins] font-normal md:max-w-[5vw] text-wrap'>{product.productId.name}</h1>
                                                    <div>
                                                        <h1 className='text-xs font-[poppins] font-medium text-wrap'>{product.productId.category} ({product.productId.size})</h1>
                                                        <h1 className='text-xs font-[poppins] font-medium mt-[-0.3vh] text-wrap'>{product.productId.color}</h1>
                                                    </div>
                                                </div>
                                                {product.productId.discount ? (
                                                    <div className="flex gap-1.5 items-center">
                                                        <span className="text-black font-normal text-sm font-[poppins]">₹{Math.round(product.productId.discountPrice)}</span>
                                                        <span className="text-black font-normal font-[poppins] line-through text-xs">₹{product.productId.price}</span>
                                                    </div>
                                                ) : (
                                                    <span className='text-black font-normal text-sm font-[poppins]'>₹{product.productId.price}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex flex-col items-center md:justify-between '>
                                            <div className='flex md:flex-row flex-col justify-around w-fit md:w-full h-full'>
                                                <div className="flex items-center border-[1px] border-black rounded-md gap-1 md:gap-3 px-2 py-0.5 h-[4vh]">

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

                                                <div>
                                                    <span className="text-black font-medium font-[poppins]">₹{(product.productId.discount ? Math.round(product.productId.discountPrice) : product.productId.price) * product.quantity}</span>
                                                </div>

                                                <div onClick={() => removeProduct(product.productId._id)}>
                                                    <i className="ri-delete-bin-6-line text-[#252525d2] text-lg cursor-pointer scale-y-125 hover:text-red-500 transition-colors duration-200"></i>
                                                </div>
                                            </div>

                                            <div>
                                                <button
                                                    onClick={() => {
                                                        if (isLoggedIn) {
                                                            moveToWishlist(product.productId._id);
                                                        } else {
                                                            toast.error("Please Login to add item to your wishlist !")
                                                            handleDelayNavigation("login");
                                                        }
                                                    }}
                                                    id="NavBarButtons"
                                                    className="md:px-7 md:py-1.5 text-nowrap py-1 px-2 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90 mt-4 bg-transparent md:block hidden"
                                                >
                                                    Move to Wishlist
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='md:w-[35%] w-full flex flex-col gap-5'>
                            <div>
                                <div className='text-xl font-[poppins] scale-y-110 text-black mb-[2vh] font-light'>Order Summary</div>
                                <div className='mt-[-6vh] md:block hidden'>
                                    <SmallStringAnimation />
                                </div>
                                <hr className='w-full h-[1px] bg-black md:hidden' />
                            </div>

                            <div>
                                <div className="flex items-center justify-between pr-4 md:mt-[-3.6vh]">
                                    <span className="text-xl text-[#1f1f1f] font-medium font-[poppins]">
                                        Subtotal
                                    </span>
                                    <span className="font-normal font-[poppins]">
                                        ₹{Math.round(subtotal)}
                                    </span>
                                </div>

                                <div className='mt-[2vh]'>
                                    <div>
                                        <span className='font-normal font-[poppins]'>
                                            Estimate Delivery
                                        </span>
                                    </div>
                                    <div className='md:block hidden'>
                                        <SmallStringAnimation />
                                    </div>
                                    <hr className='w-full h-[1px] bg-black md:hidden' />
                                </div>

                                <div className="flex items-center mt-5 justify-between pr-4 md:mt-[-4vh]">
                                    <span className="text-2xl font-light text-[#1f1f1f] uppercase font-[poppins]">
                                        Total
                                    </span>
                                    <span className="font-normal text-lg font-[poppins]">
                                        ₹{Math.round(total)}
                                    </span>
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if (isLoggedIn && user?.address) {
                                                toast.error("Cannot Place an Order Right Now!");
                                            } else if (!isLoggedIn && user?.address) {
                                                toast.error("Please Login to Place any order!")
                                                handleDelayNavigation("login");
                                            } else {
                                                toast.error("Add your Address to place any order!")
                                                handleDelayNavigation("userprofile");
                                            }
                                        }}
                                        id="NavBarButtons"
                                        className="px-30 py-2 uppercase md:text-base text-lg font-mono font-semibold text-black border-black rounded-full active:scale-90 mt-4 bg-[#ffbb00]"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='z-10'>
                        <Footer />
                    </div>

                </AnimatePresence >
            </React.Fragment >
        )
    }
}

export default Cart
