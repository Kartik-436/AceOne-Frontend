/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { delay, motion, useInView, useScroll, useTransform } from 'framer-motion';
import { useCart } from '../../utils/CartContext';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';

const Page1 = () => {
    const targetRef = useRef(null);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();
    const { animate, handleDelayNavigation } = useDelayedNavigation()

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const opacity = useTransform(scrollYProgress, [0.999, 1], [1, 0]);

    const containerRef = useRef(null);
    const Head = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.1 });
    const isHeadInView = useInView(Head, { once: false, amount: 0.2 });

    const fadeSideGo = {
        hidden: { opacity: 0, x: 50 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.35,
            }
        })
    };

    const fadeSideCome = {
        hidden: { opacity: 0, x: -50 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                delay: 0.35,
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
                delay: 0.35,
            }
        })
    };

    return (
        <React.Fragment>
            <Transition animate={animate} />
            <div ref={targetRef} className='relative w-screen md:w-full overflow-hidden bg-transparent'>
                {/* Background Image */}
                <motion.div
                    style={{ y, opacity }}
                    className='fixed md:top-0 top-[-2%] left-[-90%] md:left-0 w-[320vw] md:w-full h-[110vh] z-[-1]'
                >
                    <img className='w-full h-full object-fill' src="ShoeBG-1.jpg" alt="Background" />
                </motion.div>

                {/* Content Section */}
                <div ref={containerRef} className='relative z-[2] h-screen md:h-[125vh] w-full flex flex-col items-start justify-between pt-[22vh] px-8.5 pr-20 text-white'>
                    <motion.div
                        initial='hidden'
                        ref={Head}
                        animate={isHeadInView ? 'visible' : 'hidden'}
                        variants={fadeSideCome}
                        className='md:h-[32vh] h-[26vh] flex flex-col items-start justify-between'
                    >
                        <h1 className='md:text-8xl text-5xl text-black font-semibold font-[Roboto]'>
                            Step-Up Your Stride
                        </h1>
                        <div className='flex flex-col items-start justify-center gap-1'>
                            <h1 className='text-2xl text-black font-light font-[Poppins]'>Premium Footwear</h1>
                            <button
                                onClick={() => handleDelayNavigation("store")}
                                id='Shp-Now-Home-Start'
                                className='px-4 py-1 rounded-full bg-[#ffbb00] uppercase font-mono text-black font-bold tracking-wide'>
                                Shop Now
                            </button>
                        </div>
                    </motion.div>

                    <motion.div
                        initial='hidden'
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={fadeInCome}
                        className='w-full md:flex items-center justify-end hidden'
                    >
                        <motion.div className='w-[32vw] h-[34vh] bg-[#ffffff4e] rounded-md flex items-center justify-between px-2.5'>
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
                                    className='absolute top-2 left-3 px-3 py-0.5 bg-[#ffbb00] text-white rounded-md uppercase font-mono font-medium text-xs'>Sale</motion.div
                                >

                                <img className='w-full h-full object-cover rounded-md' src="https://static.wixstatic.com/media/c837a6_f4b16c06d8b5449c954a72eb34be2b4b~mv2.jpg" alt="Product" />
                            </motion.div>
                            <motion.div
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeSideGo}
                                className="flex flex-col items-start justify-between h-full py-6 px-3"
                            >
                                <div className="flex flex-col items-start justify-center gap-1.5">
                                    <h1 className="text-black font-bold font-mono text-xl">Name of Product</h1>
                                    <div className="flex items-center gap-1.5">
                                        <span className="text-black font-light font-mono">$499</span>
                                        <span className="text-black font-light font-mono line-through">$599</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setIsCartMenuOpen(true)}
                                    id="Shp-Now-Home-Start"
                                    className="px-4 py-1.5 text-sm rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide mb-4">
                                    Add to Cart
                                </button>
                            </motion.div
                            >

                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page1;