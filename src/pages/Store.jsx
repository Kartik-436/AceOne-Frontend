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
import { useCart } from "./../utils/CartContext";
import useAuthStatus from '../utils/IsLoggedInChecker';
import { getAllProducts, getDiscountedProducts } from '../utils/ProductService';
import { addToCart } from '../utils/CartService';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { StoreIcon } from 'lucide-react';
import { addToWishlist } from './../utils/UserService';
import { Heart } from 'lucide-react';
import SortMenuStore from '../components/SortOptionsStore';

const Store = (props) => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();
    const lenisRef = useRef(null);
    const productContainerRef = useRef(null);

    const [searchParams, setSearchParams] = useSearchParams();
    const category = searchParams.get("category");

    // Motion values for scroll tracking
    const scrollY = useMotionValue(0);
    const lastScrollY = useRef(0);
    const scrollDirection = useRef(0); // 1 for down, -1 for up
    const skewX = useSpring(0, { stiffness: 500, damping: 90 });

    const [selectedSort, setSelectedSort] = useState(searchParams.get("sort") || "name:asc");
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "All_Products");
    const [priceRange, setPriceRange] = useState([
        parseFloat(searchParams.get("minPrice")) || 200,
        parseFloat(searchParams.get("maxPrice")) || 20000
    ]);
    const [products, setProducts] = useState([]);
    const [storeLoading, setStoreLoading] = useState(false);
    const [error, setError] = useState(null);

    // Handle category change and update URL
    const handleCategoryChange = (category) => {
        setSelectedCategory(category);
        setSearchParams({ category, sort: selectedSort, minPrice: priceRange[0], maxPrice: priceRange[1] });
    };

    // Handle sorting change and update URL
    const handleSortChange = (sortOption) => {
        setSelectedSort(sortOption);
        setSearchParams({ category: selectedCategory, sort: sortOption, minPrice: priceRange[0], maxPrice: priceRange[1] });
    };

    // Sync category & sorting with URL when the component mounts
    useEffect(() => {
        if (searchParams.get("category")) {
            setSelectedCategory(searchParams.get("category"));
        }
        if (searchParams.get("sort")) {
            setSelectedSort(searchParams.get("sort"));
        }
        if (searchParams.get("minPrice") || searchParams.get("maxPrice")) {
            setPriceRange([
                parseFloat(searchParams.get("minPrice")) || 200,
                parseFloat(searchParams.get("maxPrice")) || 20000
            ]);
        }
    }, [searchParams]);



    // Function to fetch products based on selected filters
    const fetchSortedProducts = async () => {
        setStoreLoading(true);

        const filters = {
            minPrice: priceRange[0],
            maxPrice: priceRange[1]
        };

        const sortOptions = selectedSort ? { sort: selectedSort } : {}; // Example: "price:asc"

        let response;
        if (selectedCategory === "All_Products") {
            response = await getAllProducts({ ...filters, ...sortOptions });
        } else if (selectedCategory === "Discounted") {
            response = await getDiscountedProducts();
        } else {
            response = await getAllProducts({ category: selectedCategory, ...filters, ...sortOptions });
        }

        if (response.success) {
            setProducts(response.products);
        } else {
            console.error(response.message);
        }

        setStoreLoading(false);
    };

    // Fetch products when category or price changes
    useEffect(() => {
        fetchSortedProducts();
    }, [selectedCategory, priceRange, selectedSort]);

    // Handle Price Change
    const handlePriceChange = (e) => {
        const newValue = Number(e.target.value);
        setPriceRange([priceRange[0], newValue]);
    };

    const handleAddToCart = async (productId) => {
        setIsCartMenuOpen(false); // Close cart menu before request
        setStoreLoading(true); // Show loading indicator

        const response = await addToCart(productId, 1);

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
            setError(response.message);
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

        setStoreLoading(false);
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
            touchMultiplier: isMobile ? 0.3 : 1.5,
            // Track scroll for skew effect
            wrapper: window,
            content: document.documentElement,
            lerp: isMobile ? 0.05 : 0.15,
            wheelMultiplier: isMobile ? 0.5 : 1.2,
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
                <AnimatePresence mode='wait'>
                    <div data-scroll-container>
                        <motion.div>
                            <Transition animate={animate} disableEntry={true} />

                            {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

                            <div className='min-h-screen w-full text-white mt-[10.6svh] bg-[#fbffef] flex'>
                                <div className='min-h-full w-[25vw] bg-[#fbffef] relative hidden md:flex flex-col gap-10'>
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
                                                {["All_Products", "Discounted", "Men", "Women", "Kids"].map((category) => (
                                                    <div key={category} onClick={() => handleCategoryChange(category)}>
                                                        <FlipLink
                                                            size="text-[1.2vw]"
                                                            color={selectedCategory === category ? "text-[#ffbb00]" : "text-[#111]"}
                                                            font="font-light font-mono"
                                                        >
                                                            {category}
                                                        </FlipLink>
                                                    </div>
                                                ))}
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
                                                            min="200"
                                                            max="20000"
                                                            value={priceRange[1]}
                                                            onChange={handlePriceChange}
                                                            name="range"
                                                            id="PriceRange"
                                                        />
                                                        <div className="flex w-full items-center justify-between">
                                                            <h1 className="text-[1.1vw] font-light text-black font-mono">{priceRange[0]}</h1>
                                                            <h1 className="text-[1.1vw] font-light text-black font-mono">{priceRange[1]}</h1>
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
                                        <div className='w-full flex items-center justify-between'>
                                            <div className='mb-8'>
                                                <h2 className='text-3xl font-light text-black font-[poppins]'>Featured Products</h2>
                                                <div className='w-24 h-0.5 bg-black mt-2'></div>
                                            </div>
                                            <div>
                                                <SortMenuStore setselectedSort={setSelectedSort} selectedSort={selectedSort} handleSortChange={handleSortChange} />
                                            </div>
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
                                            {storeLoading &&
                                                <div className='w-full h-full flex items-center justify-center'>
                                                    <BarLoader />
                                                </div>
                                            }
                                            {!storeLoading && products.length === 0 ? (
                                                <motion.div
                                                    initial={{ opacity: 0, y: 100 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                                                    className="flex flex-col items-center justify-center h-96 rounded-3xl p-8 col-span-3"
                                                >
                                                    <motion.div
                                                        initial={{ scale: 0 }}
                                                        animate={{ scale: 1 }}
                                                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                                        className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                                    >
                                                        <StoreIcon size={48} className="text-[#ffbb00]" />
                                                    </motion.div>
                                                    <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">Store is Empty.</h2>
                                                    <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                                                        There might be an issue in fetching store items...
                                                    </p>
                                                </motion.div>
                                            ) : products.map(product => (
                                                <motion.div
                                                    key={product._id}
                                                    data-key={product._id}
                                                    className='rounded-xl bg-gray-500 overflow-hidden shadow-xl flex flex-col justify-between'
                                                    variants={productCardVariants}
                                                    whileHover={{
                                                        scale: 1.05,
                                                        transition: { duration: 0.2 }
                                                    }}
                                                    style={isMobile ? "" : dynamicStyle}
                                                >
                                                    <div className='relative'>
                                                        <img
                                                            src={product.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                                                            alt={product.name}
                                                            className='w-full h-64 object-cover text-white'
                                                        />
                                                        {product.discount > 0 ? (
                                                            <div className='absolute top-2 right-2 bg-[#ffbb00] text-white px-2 py-0.5 rounded-full font-medium font-[poppins] uppercase text-sm'>
                                                                SALE
                                                            </div>
                                                        ) : <div />}
                                                    </div>

                                                    <div className='md:p-5 p-3 bg-[#fff] text-black'>
                                                        <h3 className='text-xl tracking-tight font-semibold mb-3.5'>{product.name} ( {product.color} )</h3>
                                                        <div className='flex justify-between items-center'>
                                                            <div>
                                                                {product.discount ? (
                                                                    <div className='flex items-center gap-2'>
                                                                        <span className='text-lg font-bold'>₹{Math.round(product.discountPrice)}</span>
                                                                        <span className='text-sm line-through opacity-70'>₹{product.price}</span>
                                                                    </div>
                                                                ) : (
                                                                    <span className='text-lg font-bold'>₹{product.price}</span>
                                                                )}
                                                                <div>
                                                                    <p className='text-xs mt-1 text-black opacity-80'>{product.category}  ( {product.size} )</p>
                                                                </div>
                                                            </div>
                                                            <div className='flex items-center justify-center gap-2'>
                                                                <button
                                                                    onClick={() => {
                                                                        handleAddToCart(product._id);
                                                                    }}
                                                                    className='bg-[#1f1f1f] font-semibold text-white py-2 px-5 rounded-full text-sm AddToCartInStore border-[1.7px]'>
                                                                    Add to Cart
                                                                </button>
                                                                <span
                                                                    onClick={async () => {
                                                                        if (isLoggedIn) {
                                                                            await addToWl(product._id)
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

export default Store;