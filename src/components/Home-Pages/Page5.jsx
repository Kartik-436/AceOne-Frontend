/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';

const Page5 = () => {
    const targetRef = useRef(null);
    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-20%"]);
    const opacity = useTransform(scrollYProgress, [0.9, 1], [1, 0]);

    const containerRef = useRef(null);
    const Head = useRef(null);
    const Card = useRef(null);
    const isHeadInView = useInView(Head, { once: false, amount: 0.2 });
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

    return (
        <div ref={targetRef} className="relative w-full overflow-hidden bg-transparent">
            {/* Background Image with Motion */}
            <motion.div
                style={{ y, opacity }}
                className="fixed top-0 left-0 w-[100vw] md:w-full h-[110vh] z-[-3]"
            >
                <img className="w-full h-full object-cover" src="ShoeBG-3.jpg" alt="Background" />
            </motion.div>

            {/* Content Section */}
            <div ref={containerRef} className="relative z-[2] h-[140vh] w-full flex flex-col items-start justify-between pt-[22vh] pb-[10vh] px-8.5 pr-20 text-white">
                <motion.div
                    initial='hidden'
                    ref={Head}
                    animate={isHeadInView ? 'visible' : 'hidden'}
                    variants={fadeSideCome}
                    className="md:h-[42vh] h-[27vh] max-w-[40vw] flex flex-col items-start justify-between"
                >
                    <h1 className="md:text-8xl text-5xl text-black font-semibold font-[Roboto] text-wrap">
                        Commited to Sustainability
                    </h1>
                    <div className="flex flex-col items-start justify-center gap-1">
                        <h1 className="text-2xl text-black md:font-light font-[Poppins]">Go To Shop</h1>
                        <button id="Shp-Now-Home-Start" className="px-4 py-1 rounded-full bg-[#ffbb00] uppercase font-mono text-black font-bold tracking-wide">
                            Shop Now
                        </button>
                    </div>
                </motion.div>

                <div className="w-full flex items-center justify-end">
                    <motion.div
                        initial='hidden'
                        animate={isCardInView ? 'visible' : 'hidden'}
                        variants={fadeInCome}
                        ref={Card}
                        className="md:w-[28vw] w-[70vw] h-[50vh] md:h-[36vh] bg-[#111111a9] rounded-md flex items-center justify-center"
                    >
                        <motion.div
                            className="md:w-[26vw] w-[70vw] h-[50vh] md:h-[32vh] bg-transparent rounded-md flex items-center justify-center relative"
                        >
                            <motion.div
                                className='w-full h-full p-3 flex flex-col items-start justify-between'
                            >
                                <motion.h1
                                    initial='hidden'
                                    animate={isCardInView ? 'visible' : 'hidden'}
                                    variants={fadeSideCome}
                                    className='text-wrap max-w-[70%] text-white uppercase font-bold font-[nunito]'
                                >
                                    WALK WITH US TOWARDS A GREENER PLANET, ONE STEP AT A TIME
                                </motion.h1>
                                <div className='flex flex-col items-start gap-4'>
                                    <motion.p
                                        initial='hidden'
                                        animate={isCardInView ? 'visible' : 'hidden'}
                                        variants={fadeSideCome}
                                        className='text-wrap text-sm text-white font-normal font-[roboto]'
                                    >
                                        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Reiciendis nesciunt laboriosam at doloribus facilis in officiis aliquid sequi aliquam optio.
                                    </motion.p>
                                    <motion.button id="Shp-Now-Home-Start" className="px-5 py-2 rounded-full bg-[#ffbb00] uppercase font-mono text-black font-bold tracking-wide">
                                        Read more
                                    </motion.button>
                                </div>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Page5;
