/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import useDelayedNavigation from '../utils/useDelayedNavigation';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import Transition from '../Transition';
import AfterSignedInNavBar from './../components/NavBars/AfterSignedInNavBar';
import axios from 'axios';
import BarLoader from './../components/Loaders/CustomLoader1';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
import Footer from './../components/Footer/Footer';
import StringAnimation from '../components/StringAnimations/StringAnimation';
import SmallStringAnimation from '../components/StringAnimations/SmallStringAnimation';
import FlipLink from './../components/MenuLinks';
import Lenis from '@studio-freight/lenis';
import "../stylesheets/Store.css"

const Store = (props) => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isLoggedIn, setisLoggedIn] = useState(null);
    const lenisRef = useRef(null);
    const productContainerRef = useRef(null);

    // Motion values for scroll tracking
    const scrollY = useMotionValue(0);
    const lastScrollY = useRef(0);
    const scrollDirection = useRef(0); // 1 for down, -1 for up
    const skewX = useSpring(0, { stiffness: 500, damping: 90 });

    // Sample product data
    const [products, setProducts] = useState([
        { id: 1, name: "Classic T-Shirt", price: 499, category: "Male_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 2, name: "Summer Dress", price: 899, category: "Female_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 3, name: "Kids Hoodie", price: 599, category: "Kids_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 4, name: "Denim Jeans", price: 1299, category: "Male_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 5, name: "Floral Blouse", price: 799, category: "Female_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 6, name: "Sport Shoes", price: 1599, category: "Male_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 7, name: "Winter Jacket", price: 1899, discount: true, discountPrice: 1499, category: "Male_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 8, name: "Summer Shorts", price: 499, discount: true, discountPrice: 399, category: "Kids_Collection", imageUrl: "/api/placeholder/300/300" },
        { id: 9, name: "Casual Dress", price: 999, category: "Female_Collection", imageUrl: "/api/placeholder/300/300" },
    ]);

    const isMobile = window.innerWidth <= 768;

    // Initialize Lenis for smooth scrolling
    useEffect(() => {
        lenisRef.current = new Lenis({
            duration: isMobile ? 3 : 2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true,
            touchMultiplier: isMobile ? 0.3 : 1,
            // Track scroll for skew effect
            wrapper: window,
            content: document.documentElement,
            lerp: isMobile ? 0.05 : 0.1,
            wheelMultiplier: isMobile ? 0.5 : 1,
            syncTouch: false,
        });

        // Configure Lenis to update our scroll tracking
        lenisRef.current.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            scrollY.set(scroll);

            // Determine scroll direction and speed
            const currentScroll = scroll;
            const scrollDifference = currentScroll - lastScrollY.current;
            scrollDirection.current = scrollDifference > 0 ? 1 : -1;

            // Calculate skew based on scroll velocity (clamping for stability)
            const skewAmount = Math.max(-15, Math.min(15, scrollDifference * 0.1 * scrollDirection.current));
            skewX.set(skewAmount);

            lastScrollY.current = currentScroll;
        });

        function raf(time) {
            lenisRef.current?.raf(time);
            requestAnimationFrame(raf);
        }
        requestAnimationFrame(raf);

        return () => {
            lenisRef.current?.destroy();
        };
    }, []);

    useEffect(() => {
        const handleRouteChange = () => {
            lenisRef.current?.scrollTo(0, { immediate: true });
            skewX.set(0); // Reset skew on route change
        };

        return () => { };
    }, []);

    useEffect(() => {
        axios.get('/api/user/profile', { withCredentials: true })
            .then(response => {
                const user = response.data;
                if (response.success) {
                    setisLoggedIn(true);
                } else setisLoggedIn(false);
            })
            .catch(() => setisLoggedIn(false));
    }, []);

    const [value, setValue] = useState(0);
    const rangeRef = useRef(null);

    useEffect(() => {
        updateRangeBackground();
    }, [value]);

    const updateRangeBackground = () => {
        const min = rangeRef.current?.min || 0;
        const max = rangeRef.current?.max || 100;
        const percentage = ((value - min) / (max - min)) * 100;

        if (rangeRef.current) {
            rangeRef.current.style.background = `linear-gradient(to right, #1f1f1f ${percentage}%, #1f1f1f40 ${percentage}%)`;
        }
    };

    const scrollToSection = (sectionId) => {
        const section = document.getElementById(sectionId);
        if (section && lenisRef.current) {
            lenisRef.current.scrollTo(section);
        }
    };

    const [dynamicStyle, setDynamicStyle] = useState({
        skewX,
        transformOrigin: "right top",
    });

    useEffect(() => {
        const updateStyle = () => {
            if (window.innerWidth < 768) {
                setDynamicStyle({}); // Remove styles on small screens
            } else {
                setDynamicStyle({
                    skewX,
                    transformOrigin: "right top",
                });
            }
        };

        updateStyle(); // Run on mount
        window.addEventListener("resize", updateStyle);

        return () => window.removeEventListener("resize", updateStyle);
    }, []);

    // Variants for staggered animation
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const productCardVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: 0.3
            }
        }
    };

    if (isLoggedIn === null) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <AnimatePresence mode='wait'>
                    <div data-scroll-container>
                        <motion.div>
                            <Transition animate={animate} disableEntry={true} />

                            {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

                            <div className='min-h-screen w-full text-white mt-[10.6svh] bg-[#fbffef] flex'>
                                <div className='min-h-full w-[25vw] bg-[#f1f5e5] relative hidden md:flex flex-col gap-10'>
                                    <div className='pl-10 pt-7'>
                                        <h1 className='text-[1.83vw] font-light text-black font-[poppins]'>
                                            All Products <i className="ri-arrow-right-long-line"></i>
                                        </h1>
                                    </div>
                                    <div className='w-[25vw] flex-col flex gap-5'>
                                        <div className='w-full px-5 pt-5'>
                                            <h1 className='text-[1.13vw] font-light text-black font-[poppins]'>
                                                Browse By
                                            </h1>
                                            <div>
                                                <SmallStringAnimation />
                                            </div>
                                            <div className='w-full pl-5 flex flex-col items-start gap-2'>
                                                <div>
                                                    <FlipLink size="text-[1.2vw]" color="text-[#111]" font="font-light font-mono">All_Products</FlipLink>
                                                </div>

                                                <div>
                                                    <FlipLink size="text-[1.2vw]" color="text-[#111]" font="font-light font-mono">Discounted</FlipLink>
                                                </div>

                                                <div>
                                                    <FlipLink size="text-[1.2vw]" color="text-[#111]" font="font-light font-mono">Male_Collection</FlipLink>
                                                </div>

                                                <div>
                                                    <FlipLink size="text-[1.2vw]" color="text-[#111]" font="font-light font-mono">Female_Collection</FlipLink>
                                                </div>

                                                <div>
                                                    <FlipLink size="text-[1.2vw]" color="text-[#111]" font="font-light font-mono">Kids_Collection</FlipLink>
                                                </div>
                                            </div>
                                        </div>

                                        <div className='w-full px-5 pt-5'>
                                            <h1 className='text-[1.13vw] font-light text-black font-[poppins]'>
                                                Filter By
                                            </h1>
                                            <div>
                                                <SmallStringAnimation />
                                            </div>

                                            <div className='w-full mb-5 mt-[-3vh]'>
                                                <div className='w-full flex flex-col gap-4'>
                                                    <div className='w-full'>
                                                        <h1 className='text-[1.13vw] font-light text-black font-[poppins]'>Price</h1>
                                                    </div>
                                                    <div className='w-full px-4 pb-3'>
                                                        <input
                                                            ref={rangeRef}
                                                            className="w-full appearance-none h-2 bg-gray-300 rounded-lg outline-none transition-all"
                                                            type="range"
                                                            min="0"
                                                            max="100"
                                                            value={value}
                                                            onChange={(e) => setValue(e.target.value)}
                                                            name="range"
                                                            id="PriceRange"
                                                            data-lenis-prevent
                                                        />
                                                        <div className='flex w-full items-center justify-between'>
                                                            <h1 className='text-[1.1vw] font-light text-black font-mono'>200</h1>
                                                            <h1 className='text-[1.1vw] font-light text-black font-mono'>2000</h1>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div>
                                                <SmallStringAnimation />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className='min-h-full w-full bg-[#fbffef] text-black p-8'>
                                    {/* Product Grid Section */}
                                    <div className='w-full'>
                                        <div className='mb-8'>
                                            <h2 className='text-3xl font-light text-black font-[poppins]'>Featured Products</h2>
                                            <div className='w-24 h-0.5 bg-black mt-2'></div>
                                        </div>

                                        {/* Product Grid - 3 items per row */}
                                        <motion.div
                                            ref={productContainerRef}
                                            className='grid grid-cols-1 md:grid-cols-3 gap-8'
                                            variants={containerVariants}
                                            initial="hidden"
                                            animate="visible"
                                            style={{
                                                willChange: "transform",
                                                perspective: "5000px",
                                            }}
                                        >
                                            {products.map(product => (
                                                <motion.div
                                                    key={product.id}
                                                    className='bg-[#1f1f1f] rounded-lg overflow-hidden shadow-lg'
                                                    variants={productCardVariants}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    style={isMobile ? "" : dynamicStyle}
                                                >
                                                    <div className='relative'>
                                                        <img
                                                            src={product.imageUrl}
                                                            alt={product.name}
                                                            className='w-full h-64 object-cover'
                                                        />
                                                        {product.discount && (
                                                            <div className='absolute top-2 right-2 bg-[#ffbb00] text-white px-2 py-0.5 rounded-full font-medium font-[poppins] uppercase text-sm'>
                                                                SALE
                                                            </div>
                                                        )}
                                                    </div>

                                                    <div className='md:p-5 p-3 bg-[#fff] text-black'>
                                                        <h3 className='text-xl font-semibold mb-2'>{product.name}</h3>
                                                        <div className='flex justify-between items-center'>
                                                            <div>
                                                                {product.discount ? (
                                                                    <div className='flex items-center gap-2'>
                                                                        <span className='text-lg font-bold'>₹{product.discountPrice}</span>
                                                                        <span className='text-sm line-through opacity-70'>₹{product.price}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className='text-lg font-bold'>₹{product.price}</span>
                                                                )}
                                                                <p className='text-xs mt-1 text-black opacity-80'>{product.category.replace('_', ' ')}</p>
                                                            </div>
                                                            <button className='bg-[#1f1f1f] font-semibold text-white py-2 px-5 rounded-full text-sm AddToCartInStore'>
                                                                Add to Cart
                                                            </button>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </div>
                                </div>
                            </div>

                            <div className='z-10'>
                                <Footer />
                            </div>
                        </motion.div>
                    </div>
                </AnimatePresence>
            </React.Fragment>
        )
    }
}

export default Store