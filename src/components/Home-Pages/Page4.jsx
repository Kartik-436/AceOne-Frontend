/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const Page4 = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });

    const fadeInUp = {
        hidden: { opacity: 0, y: 50 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                delay: i * 0.1,
                ease: "easeOut"
            }
        })
    };

    return (
        <div ref={containerRef} className='w-full min-h-screen bg-[#fbffef] rounded-t-xl'>
            <div className='w-full py-[22vh] px-[2vw] flex flex-col justify-center gap-7'>
                <motion.div
                    className='flex items-center justify-between pr-8'
                    initial='hidden'
                    animate={isInView ? 'visible' : 'hidden'}
                    variants={{
                        hidden: { opacity: 0, x: -50 },
                        visible: {
                            opacity: 1,
                            x: 0,
                            transition: {
                                duration: 0.7,
                                ease: "backOut"
                            }
                        }
                    }}
                >
                    <h1 className='text-3xl font-lighter uppercase font-[poppins] text-black'>Shop By Collection</h1>
                    <motion.button
                        id='Shp-Now-Home-Start'
                        className='px-5 py-2 rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide'
                        whileHover={{ scale: 1.05, backgroundColor: "#f8f8f8" }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Go to shop
                    </motion.button>
                </motion.div>

                <div className='flex items-center justify-center gap-4'>
                    {["Male Collection", "Female Collection", "Kids Collection"].map((title, index) => (
                        <motion.div
                            key={index}
                            className='h-[75vh] w-[33vw] flex flex-col items-start gap-4 px-4 py-2 rounded-xl'
                            initial='hidden'
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={fadeInUp}
                            custom={index}
                        >
                            <motion.div
                                className='h-[70vh] w-[28vw] rounded-xl bg-[#aeaeaeec] relative flex items-center justify-center'
                                variants={fadeInUp}
                                custom={index + 1}
                            >
                                <div className='absolute bottom-4 left-4'>
                                    <motion.button
                                        id='Shp-Now-Home-Start'
                                        className='px-7 py-1 bg-[#fff] text-black rounded-full uppercase font-mono font-medium text-lg'
                                        whileHover={{ scale: 1.05 }}
                                        initial='hidden'
                                        animate={isInView ? 'visible' : 'hidden'}
                                        variants={{
                                            hidden: { opacity: 0, x: -50 },
                                            visible: {
                                                opacity: 1,
                                                x: 0,
                                                transition: {
                                                    duration: 0.3,
                                                    ease: "easeOut"
                                                }
                                            }
                                        }}
                                    >
                                        {title}
                                    </motion.button>
                                </div>
                                <img src="" alt="" />
                            </motion.div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Page4;
