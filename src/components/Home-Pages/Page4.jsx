/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';

const Page4 = () => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });
    const { animate, handleDelayNavigation } = useDelayedNavigation();

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
        <React.Fragment>
            <Transition animate={animate} />
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
                        <h1 className='md:text-3xl text-2xl font-lighter uppercase font-[poppins] text-black'>Shop By Collection</h1>
                        <motion.button
                            id='Shp-Now-Home-Start'
                            className='md:px-5 md:py-2 px-3 py-1 rounded-full bg-[#fff] uppercase font-mono text-black font-bold tracking-wide'
                            whileHover={{ scale: 1.05, backgroundColor: "#f8f8f8" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => { handleDelayNavigation("store") }}
                        >
                            Go to shop
                        </motion.button>
                    </motion.div>

                    <div className='flex md:flex-row flex-col items-center justify-center gap-4'>
                        {["Male Collection", "Female Collection", "Kids Collection"].map((title, index) => (
                            <motion.div
                                key={index}
                                className='h-[75vh] md:w-[33vw]  w-[80vw] flex flex-col items-start gap-4 px-4 py-2 rounded-xl'
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeInUp}
                                custom={index}
                            >
                                <motion.div
                                    className='h-[70vh] md:w-[28vw] w-[80vw] rounded-xl bg-[#aeaeaeec] relative flex items-center justify-center'
                                    variants={fadeInUp}
                                    custom={index + 1}
                                >
                                    <div className='absolute bottom-4 left-4'>
                                        <motion.button
                                            id='Shp-Now-Home-Start'
                                            className='md:px-7 md:py-1 px-5 bg-[#fff] text-black rounded-full uppercase font-mono font-medium text-lg'
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => { handleDelayNavigation("store") }}
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
                                    <img src={null} alt="collections" />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Page4;
