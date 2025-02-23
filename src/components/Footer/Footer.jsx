/* eslint-disable no-unused-vars */
import React, { useRef } from 'react';
import { delay, motion, useInView } from 'framer-motion';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from '../../Transition';
import StringAnimation from '../StringAnimations/StringAnimation';

const Footer = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const footerRef = useRef(null);
    const formRef = useRef(null);
    const socialIconsRef = useRef(null);

    const isInView = useInView(footerRef, { amount: 0.2, once: false });
    const isSocialIconsInView = useInView(socialIconsRef, { amount: 0.2, once: false });

    const itemVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
        }
    };

    const staggerContainer = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                staggerChildren: 0.5,
                delayChildren: 0.4,
                transition: { duration: 0.8, ease: [0.6, -0.05, 0.01, 0.99] }
            }
        }
    };

    return (
        <>
            <Transition animate={animate} />
            <motion.div
                ref={footerRef}
                className='z-[10]'
            >
                <div className='w-full min-h-screen bg-[#131313] flex flex-col gap-4 p-10 overflow-hidden'>
                    <motion.div initial="hidden" animate={isInView ? "visible" : "hidden"} variants={itemVariants} className='w-full'>
                        <h1 onClick={() => { handleDelayNavigation("") }} className="text-3xl font-black font-[Marcellus] select-none cursor-pointer text-white w-fit">AceOne.</h1>
                    </motion.div>

                    <motion.div
                        initial='hidden'
                        animate={isInView ? 'visible' : 'hidden'}
                        variants={{
                            hidden: { opacity: 0, y: 200 },
                            visible: {
                                opacity: 1,
                                y: 0,
                                transition: {
                                    duration: 0.4,
                                    ease: "easeOut"
                                }
                            }
                        }}
                        className='md:block hidden'
                    >
                        <StringAnimation />
                    </motion.div>

                    <div className='w-full h-full flex flex-col md:items-end gap-15 md:gap-10'>
                        <motion.div
                            ref={formRef}
                            className='bg-[#efbe35] md:w-[57vw] md:h-[38vh] rounded-lg p-6 flex flex-col gap-8 md:gap-[9vh]'
                            initial='hidden'
                            animate={isInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: { opacity: 0, x: 70 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        duration: 0.4,
                                        ease: "easeOut",
                                        staggerChildren: 0.5,
                                    }
                                }
                            }}
                        >
                            <motion.div>
                                <h1 className='text-xl font-[poppins] font-light'>Stay updated, sign up to receive exclusive updates and offers.</h1>
                            </motion.div>
                            <motion.div className='h-full'>
                                <form className='flex flex-col justify-between h-full pb-5 gap-5' action="">
                                    <motion.div className='flex flex-col gap-0.5'>
                                        <label className='uppercase font-medium text-sm font-[poppins]' htmlFor="Email">Email</label>
                                        <input type="text" name='email' className='font-[poppins] px-5 py-2 bg-transparent outline-none border-[1px] border-black rounded-lg' autoComplete='off' required />
                                    </motion.div>
                                    <motion.div className='flex md:flex-row flex-col items-center justify-between md:gap-0 gap-2.5'>
                                        <motion.div className='flex items-center gap-2'>
                                            <input type="checkbox" className='w-5 h-5 appearance-none border-[1px] border-black rounded-md cursor-pointer bg-transparent relative checked:bg-black' required />
                                            <label className='uppercase font-light text-sm font-[poppins]' htmlFor="checkbox">subscribe to newsletter.</label>
                                        </motion.div>
                                        <motion.div>
                                            <button type='submit' id="Shp-Now-Home-Start" className="px-15 py-1 rounded-md bg-transparent uppercase font-mono text-black font-bold tracking-wide">
                                                Submit
                                            </button>
                                        </motion.div>
                                    </motion.div>
                                </form>
                            </motion.div>
                        </motion.div>

                        <motion.div
                            ref={socialIconsRef}
                            initial='hidden'
                            animate={isSocialIconsInView ? 'visible' : 'hidden'}
                            variants={staggerContainer}
                            className='h-full md:w-[57vw] flex md:flex-row flex-col items-start justify-center gap-12 md:gap-4'
                        >
                            <motion.div
                                initial='hidden'
                                animate={isSocialIconsInView ? 'visible' : 'hidden'}
                                variants={staggerContainer}
                                className='flex flex-col gap-2 w-full h-full'
                            >
                                <motion.div className='w-full px-6 py-1 bg-white text-black rounded-lg font-semibold uppercase'>
                                    <h1>Contact</h1>
                                </motion.div>

                                <a href="mailto:gargkartik503@gmail.com">
                                    <motion.div className='w-full px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                        <h1>gargkartik503@gmail.com</h1>
                                    </motion.div>
                                </a>

                                <motion.div className='w-full px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg'>
                                    <h1>1234567890</h1>
                                </motion.div>

                                <motion.div className='w-full px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg'>
                                    <h1>Address...</h1>
                                </motion.div>

                                <motion.div className='w-full px-6 py-1 bg-white text-black rounded-lg font-semibold uppercase'>
                                    <h1>Social Media</h1>
                                </motion.div>

                                <motion.div
                                    initial='hidden'
                                    animate={isSocialIconsInView ? 'visible' : 'hidden'}
                                    variants={staggerContainer}
                                    className='w-full bg-transparent rounded-lg py-1 flex gap-2'
                                >
                                    {['instagram', 'facebook', 'linkedin'].map((platform, index) => (
                                        <motion.div
                                            key={index}
                                            className='px-4 py-1 w-full bg-transparent text-white border-[1px] border-white uppercase rounded-lg text-center hover:bg-black hover:text-[#ffbb00] transition-all duration-200 cursor-pointer'
                                        >
                                            <i className={`ri-${platform}-line text-xl`}></i>
                                        </motion.div>
                                    ))}
                                </motion.div>
                            </motion.div>

                            <motion.div
                                initial='hidden'
                                animate={isSocialIconsInView ? 'visible' : 'hidden'}
                                variants={staggerContainer}
                                className='flex flex-col gap-2 w-full h-full'
                            >
                                <motion.div className='w-full px-6 py-1 bg-white text-black rounded-lg font-semibold uppercase'>
                                    <h1>Shop</h1>
                                </motion.div>

                                <motion.div onClick={() => { handleDelayNavigation("store") }} className='w-full  px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                    <h1>All Products</h1>
                                </motion.div>

                                <motion.div onClick={() => { handleDelayNavigation("store") }} className='w-full  px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                    <h1>BestSellers</h1>
                                </motion.div>

                                <motion.div onClick={() => { handleDelayNavigation("store") }} className='w-full  px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                    <h1>Male Collection</h1>
                                </motion.div>

                                <motion.div onClick={() => { handleDelayNavigation("store") }} className='w-full  px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                    <h1>Female Collection</h1>
                                </motion.div>

                                <motion.div onClick={() => { handleDelayNavigation("store") }} className='w-full  px-6 py-1 bg-transparent text-white border-[1px] border-white rounded-lg cursor-pointer'>
                                    <h1>Kids Collection</h1>
                                </motion.div>

                            </motion.div>
                        </motion.div>
                    </div>

                    <div className='w-full h-22'>
                        <motion.div
                            initial='hidden'
                            animate={isSocialIconsInView ? 'visible' : 'hidden'}
                            variants={{
                                hidden: { opacity: 0, x: 70 },
                                visible: {
                                    opacity: 1,
                                    x: 0,
                                    transition: {
                                        duration: 0.6,
                                        ease: "easeOut",
                                        staggerChildren: 0.5,
                                        delayChildren: 0.3
                                    }
                                }
                            }}
                            className='flex justify-center items-center w-full h-full px-5 py-2 text-white font-semibold uppercase'
                        >
                            <h1 className='text-sm text-nowrap'>&copy; 2025 Kartik Garg. All rights reserved.</h1>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default Footer;