/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, stagger, useInView } from 'framer-motion';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { addToCart } from '../../utils/CartService';
import { useCart } from '../../utils/CartContext';
import { toast } from 'react-toastify';
import useAuthStatus from '../../utils/IsLoggedInChecker';
import { Heart } from 'lucide-react';
import { addToWishlist } from '../../utils/UserService';
import AddToCartButton from '../AddToCartButton';

const Page2 = ({ bestSelling, Discounted }) => {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const productsRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });
    const { animate, handleDelayNavigation } = useDelayedNavigation()
    const [error, setError] = useState(null);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();
    const { isLoggedIn, loading } = useAuthStatus();

    const handleAddToCart = async (productId, selectedColor, selectedSize) => {
        setIsCartMenuOpen(false);

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
            });
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

    const imgContainerRef = useRef(null);
    const [offset, setOffset] = useState(["start end", "center 55%"]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOffset(["-180% end", "-80% end"]);
            } else {
                setOffset(["start end", "center center"]);
            }
        };

        handleResize(); // Call on mount
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: imgContainerRef,
        offset: offset
    });

    const scale = useTransform(scrollYProgress, [0, 1], [3, 1]);

    // Slice animation variants
    const sliceVariants = {
        hidden: i => ({
            opacity: 0,
            rotateY: 90,
            x: i % 2 === 0 ? -50 : 50,
            scale: 0.9,
            filter: "blur(10px)"
        }),
        visible: i => ({
            opacity: 1,
            rotateY: 0,
            x: 0,
            scale: 1,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                delay: i * 0.1,
                ease: [0.25, 0.1, 0.25, 1]
            }
        })
    };

    const staggerChildren = {
        hidden: { opacity: 0, y: 30 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const verticalSlice = (element, numSlices = 5) => {
        const slices = [];
        for (let i = 0; i < numSlices; i++) {
            slices.push(
                <motion.div
                    key={i}
                    custom={i}
                    variants={sliceVariants}
                    style={{
                        position: "absolute",
                        left: `${(i / numSlices) * 100}%`,
                        width: `${100 / numSlices}%`,
                        height: "100%",
                        overflow: "hidden"
                    }}
                >
                    <div
                        style={{
                            position: "absolute",
                            width: `${numSlices * 100}%`,
                            height: "100%",
                            left: `${-i * 100}%`,
                            backgroundPosition: "center",
                            willChange: "transform"
                        }}
                    >
                        {React.cloneElement(element, {
                            style: {
                                ...element.props.style,
                                width: "100%",
                                height: "100%",
                                willChange: "transform"
                            }
                        })}
                    </div>
                </motion.div>
            );
        }
        return slices;
    };

    const productCard = (product, index) => (
        <motion.div
            onClick={() => { handleDelayNavigation(`product/${product?._id}`) }}
            key={product?._id}
            className='min-h-[60vh] w-[80vw] md:w-full flex flex-col items-center md:items-start gap-4 md:px-4 py-2 rounded-xl'
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                        staggerChildren: 0.1,
                        delayChildren: 0.3 + index * 0.1
                    }
                }
            }}
        >
            <motion.div
                ref={imgContainerRef}
                className='min-h-[53vh] md:w-full w-[75vw] rounded-xl bg-[#e8e8e848] relative flex items-center justify-center overflow-hidden'
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, ease: "easeOut" }
                    }
                }}
            >
                <img
                    src={product?.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                    alt={product?.name}
                    className="scale-200 rounded-xl"
                />

                <motion.div
                    className='absolute top-3 left-3 px-3 py-0.5 bg-[#ffbb00] text-black rounded-sm uppercase font-mono font-medium text-xs'
                    variants={{
                        hidden: { opacity: 0, x: -30 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.4,
                                delay: 0.6 + index * 0.1,
                                ease: "backOut"
                            }
                        }
                    }}
                >
                    {product?.discountPrice ? "Sale" : "BestSeller"}
                </motion.div>
            </motion.div>

            <div className='flex w-full items-start justify-between px-2 gap-3 pr-5'>
                <motion.div
                    className='flex flex-col items-start justify-center gap-0 pl-1'
                    variants={{
                        hidden: { opacity: 0, y: 20 },
                        visible: {
                            opacity: 1,
                            y: 0,
                            transition: {
                                duration: 0.5,
                                delay: 0.7 + index * 0.1
                            }
                        }
                    }}
                >
                    <h1 className='text-black font-bold font-mono mb-2'>{product?.name}</h1>
                    <h1 className="text-black font-light font-mono text-sm -mt-1">{product?.category}</h1>
                    <div className='flex items-center gap-1.5'>
                        <span className='text-black font-light font-mono text-md'>${Math.round(product?.discountPrice) || Math.round(product?.price)}</span>
                        {product?.discountPrice && <span className='text-black font-medium font-mono text-sm line-through'>${Math.round(product?.price)}</span>}
                    </div>
                </motion.div>

                <div className='flex items-center justify-center gap-2'>
                    <div>
                        <AddToCartButton product={product?._id} Name={product?.name} Color={product?.color} Size={product?.size} onAddToCart={handleAddToCart} />
                    </div>
                    <span
                        onClick={async () => {
                            if (isLoggedIn) {
                                await addToWl(product?._id)
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
                        <Heart size={17} />
                    </span>
                </div>
            </div>

        </motion.div>
    );

    const bestSellingCount = bestSelling.length;
    const neededFromDiscounted = Math.max(0, 4 - bestSellingCount);

    const displayedProducts = [
        ...bestSelling.slice(0, 4),
        ...Discounted.slice(0, neededFromDiscounted)
    ];

    return (
        <React.Fragment>
            <Transition animate={animate} />
            <div ref={containerRef} className='w-full min-h-screen bg-[#fbffef] rounded-t-xl'>
                <div className='w-full py-[22vh] px-[2vw] flex flex-col justify-center gap-10'>
                    <motion.div
                        ref={headerRef}
                        className='flex items-center justify-between pr-8'
                        initial={{ opacity: 0, x: -70 }}
                        animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -70 }}
                        transition={{
                            duration: 1.1,
                            ease: [0.16, 1, 0.3, 1]
                        }}
                    >
                        <h1 className='md:text-3xl text-2xl font-lighter uppercase font-[poppins] text-black'>Best sellers</h1>
                        <motion.button
                            id='Shp-Now-Home-Start'
                            className='md:px-5 px-3 md:py-2 py-1 rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide'
                            whileHover={{ scale: 1.05, backgroundColor: "#f8f8f8" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { handleDelayNavigation("store?category=Discounted") }}
                        >
                            View All
                        </motion.button>
                    </motion.div>

                    <motion.div
                        ref={productsRef}
                        className='flex md:flex-row flex-col w-full items-center justify-center md:gap-5 gap-10'
                        initial="hidden"
                        animate={isInView ? "visible" : "hidden"}
                        variants={{
                            visible: {
                                transition: {
                                    staggerChildren: 0.15,
                                    delayChildren: 0.2
                                }
                            }
                        }}
                    >
                        {displayedProducts?.map((product, index) => productCard(product, index))}
                    </motion.div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page2;