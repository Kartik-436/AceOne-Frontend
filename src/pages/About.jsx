/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import useDelayedNavigation from '../utils/useDelayedNavigation';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import Transition from '../Transition';
import AfterSignedInNavBar from './../components/NavBars/AfterSignedInNavBar';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import useAuthStatus from '../utils/IsLoggedInChecker';
import { useCart } from '../utils/CartContext';
import Footer from './../components/Footer/Footer';
import AboutEnlargeOnScroll from './../components/AboutEnlargeOnScroll';
import Lenis from '@studio-freight/lenis';

const About = () => {
    const targetRef = useRef(null);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();
    const { animate, handleDelayNavigation } = useDelayedNavigation()
    const [error, setError] = useState(null);

    const { scrollYProgress } = useScroll({
        target: targetRef,
        offset: ["start end", "end start"],
    });

    const y = useTransform(scrollYProgress, [0, 1], ["20%", "-26%"]);
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

    const { isLoggedIn, loading } = useAuthStatus();

    // Setup smooth scrolling with Lenis
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
        });

        if (window.gsap) {
            window.gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
        } else {
            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }

        lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {
            // Scroll event handling
        });

        return () => {
            lenis.destroy();
            if (window.gsap) {
                window.gsap.ticker.remove();
            }
        };
    }, []);

    return (
        <React.Fragment>
            <Transition animate={animate} />

            {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

            <div data-scroll-container>
                <div ref={targetRef} className='relative w-screen md:w-full min-h-[130vh] overflow-hidden bg-transparent'>

                    <motion.div
                        style={{ y, opacity }}
                        className='fixed md:top-0 top-[5%] left-[-60%] md:left-0 w-[340vw] md:w-full h-[110vh] md:h-[115vh] z-[-1]'
                    >
                        <img className='w-full h-full object-fill' src="/About_BG.jpg" alt="Background" />
                    </motion.div>

                    <div ref={containerRef} className='relative z-[2] h-screen md:h-[125vh] w-full flex flex-col items-start justify-between pt-[16vh] md:pt-[22vh] px-8.5 pr-20 text-white'>
                        <motion.div
                            initial='hidden'
                            ref={Head}
                            animate={isHeadInView ? 'visible' : 'hidden'}
                            variants={fadeSideCome}
                            className='md:h-[32vh] h-[25vh] flex flex-col items-start justify-between'
                        >
                            <h1 className='md:text-8xl text-5xl text-black font-semibold font-[Roboto]'>
                                About Us
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
                            <motion.div
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeInCome}
                                className='w-[32vw] h-[36vh] bg-[#000]/50 rounded-md flex items-center justify-between px-3.5 p-5 backdrop-blur-sm'>
                                <div className='flex flex-col items-start justify-between h-full w-full'>
                                    <h1 className='text-lg font-mono font-bold'>EMPOWER YOUR ELEGANCE</h1>
                                    <div className='flex flex-col gap-4'>
                                        <div className='flex flex-col gap-2'>
                                            <p className='text-sm tracking-tight font-[poppins]'>At AceOne Footwear, we create stylish, comfortable shoes that exude confidence. Blending timeless elegance with modern innovation, our designs ensure you never compromise on fashion or function.</p>
                                            <p className='text-sm tracking-tight font-[poppins]'>More than just a brand, AceOne is a statement. Whether you&apos;re stepping into success or embracing everyday moments, our footwear supports your journey in style.</p>
                                        </div>
                                        <h1 className='text-xl font-mono text-[#ffbb00] font-bold'>Walk Bold. Walk Ace.</h1>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>
                </div>

                <div>
                    <AboutEnlargeOnScroll />
                </div>

                <div className='z-20'>
                    <Footer />
                </div>
            </div>
        </React.Fragment>
    );
}

export default About;
