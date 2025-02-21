/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion, useScroll, useTransform, stagger, useInView } from 'framer-motion';

const Page2 = () => {
    const containerRef = useRef(null);
    const headerRef = useRef(null);
    const productsRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });

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

    const productCard = (tag, showStrike, index) => (
        <motion.div
            className='md:h-[65vh] h-[70vh] w-[80vw] md:w-[24vw] flex flex-col items-center md:items-start gap-4 md:px-4 py-2 rounded-xl'
            variants={staggerChildren}
            custom={index}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
        >
            <motion.div
                className='md:h-[54vh] h-[60vh] md:w-[20vw] w-[75vw] rounded-xl bg-[#aeaeaeec] relative flex items-center justify-center overflow-hidden'
                variants={{
                    hidden: { opacity: 0, y: 50 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: { duration: 0.7, ease: "easeOut" }
                    }
                }}
            >
                <motion.div
                    className='absolute top-3 left-3 px-3 py-0.5 bg-[#ffbb00] text-white rounded-md uppercase font-mono font-medium text-xs'
                    variants={{
                        hidden: { opacity: 0, x: -30 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.4,
                                delay: 0.6 + (index * 0.1),
                                ease: "backOut"
                            }
                        }
                    }}
                >
                    {tag}
                </motion.div>
                <img src="" alt="" />
            </motion.div>

            <motion.div
                className='flex flex-col items-start justify-center gap-0 pl-1'
                variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: {
                        opacity: 1,
                        y: 0,
                        transition: {
                            duration: 0.5,
                            delay: 0.7 + (index * 0.1)
                        }
                    }
                }}
            >
                <h1 className='text-black font-bold font-mono text-lg'>Name of Product</h1>
                <div className='flex items-center gap-1.5'>
                    <span className='text-black font-light font-mono text-md'>$499</span>
                    {showStrike && <span className='text-black font-medium font-mono text-sm line-through'>$599</span>}
                </div>
            </motion.div>
        </motion.div>
    );

    return (
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
                    >
                        View All
                    </motion.button>
                </motion.div>

                <motion.div
                    ref={productsRef}
                    className='flex md:flex-row flex-col w-full items-center justify-center gap-4'
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
                    {productCard("BestSeller", false, 0)}
                    {productCard("Sale", true, 1)}
                    {productCard("BestSeller", false, 2)}
                    {productCard("Sale", true, 3)}
                </motion.div>
            </div>
        </div>
    );
};

export default Page2;