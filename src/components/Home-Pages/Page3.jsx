/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../../utils/CartContext';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';
import { addToCart } from '../../utils/CartService';
import { toast } from 'react-toastify';
import useAuthStatus from './../../utils/IsLoggedInChecker';
import { Heart } from 'lucide-react';
import { addToWishlist } from '../../utils/UserService';
import AddToCartButton from '../AddToCartButton';

const Page3 = ({ Kids }) => {
    const targetRef = useRef(null);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [error, setError] = useState(null);

    const handleAddToCart = async (productId, selectedColor, selectedSize) => {
        setIsCartMenuOpen(false);

        const response = await addToCart(productId, 1, selectedColor, selectedSize);

        if (response.success) {
            window.location.reload();
        } else {
            setError(response.message);
        }
    };

    const addToWl = async (Pid) => {
        try {
            const response = await addToWishlist(Pid);
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
    }

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

    const containerRef = useRef(null);
    const Head = useRef(null);
    const Card = useRef(null);
    const isHeadInView = useInView(Head, { once: false, amount: 0.1 });
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });
    const isCardInView = useInView(containerRef, { once: false, amount: 0.2 });

    const fadeSideGo = {
        hidden: { opacity: 0, x: 100 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            }
        })
    };

    const fadeSideCome = {
        hidden: { opacity: 0, x: -100 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            }
        })
    };

    const fadeInCome = {
        hidden: { opacity: 0, y: 100 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
            }
        })
    };

    const { isLoggedIn, loading } = useAuthStatus();

    return (
        <React.Fragment>
            <Transition animate={animate} />
            <div ref={targetRef} className="relative w-full overflow-hidden bg-transparent">
                {/* Background Image with Motion */}
                <motion.div
                    style={{ y, opacity }}
                    className="fixed top-0 left-0 w-full h-[125vh] z-[-2]"
                >
                    <img className="w-full h-full object-cover" src="ShoeBG-2.jpg" alt="Background" />
                </motion.div>

                {/* Content Section */}
                <div ref={containerRef} className="relative z-[2] h-[140vh] w-full flex flex-col items-start justify-between pt-[22vh] pb-[10vh] px-8.5 pr-20 text-white">
                    <motion.div
                        initial='hidden'
                        ref={Head}
                        animate={isHeadInView ? 'visible' : 'hidden'}
                        variants={fadeSideCome}
                        className="h-[42vh] max-w-[32vw] flex flex-col items-start justify-between"
                    >
                        <h1 className="md:text-8xl text-5xl text-black font-semibold font-[Roboto] md:text-wrap">
                            20% Off Kids Styles
                        </h1>
                        <div className="flex flex-col items-start justify-center gap-1">
                            <h1 className="text-2xl text-nowrap text-black font-light font-[Poppins]">Limited Time Offer</h1>
                            <button
                                onClick={() => { handleDelayNavigation("store") }}
                                id="Shp-Now-Home-Start"
                                className="px-4 py-1 rounded-full bg-[#ffbb00] uppercase font-mono text-black font-bold tracking-wide">
                                Shop Now
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="w-full hidden md:flex items-center justify-end"
                    >
                        <motion.div key={Kids[0]?._id} className='w-[32vw] h-[34vh] bg-[#ffffff4e] rounded-md flex items-center justify-between px-2.5'>
                            <motion.div
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeInCome}
                                className='w-[20vw] h-[31vh] bg-[#f5f4f4e1] rounded-md flex items-center justify-center relative'
                            >
                                <motion.div
                                    initial='hidden'
                                    animate={isInView ? 'visible' : 'hidden'}
                                    variants={fadeSideCome}
                                    className='absolute top-2 left-3 px-3 py-0.5 bg-[#ffbb00] text-white rounded-md uppercase font-mono font-medium text-xs'>Sale</motion.div>

                                <img className='w-full h-full object-cover rounded-md text-black' src={Kids[0]?.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"} alt="Kids Image" />
                            </motion.div>
                            <motion.div
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeSideGo}
                                className="flex flex-col items-start justify-between h-full py-6 px-3"
                            >
                                <div className="flex flex-col items-start justify-center gap-1.5">
                                    <div className='flex flex-col items-start gap-2'>
                                        <h1 className="text-black font-bold font-mono text-xl">{Kids[0]?.name}</h1>
                                        <div className='flex items-start flex-col w-full'>
                                            <h1 className="text-black font-lighter font-mono">{Kids[0]?.category}</h1>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-black font-light font-mono">₹{Math.round(Kids[0]?.discountPrice)}</span>
                                        <span className="text-black font-light font-mono line-through">₹{Kids[0]?.price}</span>
                                    </div>
                                </div>
                                <div className='flex items-center justify-center gap-2'>
                                    <div>
                                        <AddToCartButton product={Kids[0]?._id} CProduct={Kids[0]} onAddToCart={handleAddToCart} />
                                    </div>
                                    <span
                                        onClick={async () => {
                                            if (isLoggedIn) {
                                                await addToWl(Kids[0]?._id)
                                            } else {
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
                                            }
                                        }}
                                        id="Shp-Now-Home-Start"
                                        className='bg-white rounded-full px-2 py-2 border-[1px] border-black text-black'
                                    >
                                        <Heart size={25} />
                                    </span>
                                </div>
                            </motion.div>

                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page3;
