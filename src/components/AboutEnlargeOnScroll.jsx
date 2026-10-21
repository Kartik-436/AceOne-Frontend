/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react'
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import { PlusIcon } from 'lucide-react';

const AboutEnlargeOnScroll = () => {
    const containerRef = useRef(null);
    const HeadViewRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });
    const HeadView = useInView(HeadViewRef, { once: false, amount: 0.05 });
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    const fadeInUp = {
        hidden: { opacity: 0, y: 100 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                delay: i * 0.08,
                ease: "easeOut"
            }
        })
    };

    const collections = [
        { title: "Male Collection", src: "https://static.wixstatic.com/media/c837a6_6338c1580bc8405f8ddf87c1238f41fb~mv2.jpg/v1/fill/w_603,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_6338c1580bc8405f8ddf87c1238f41fb~mv2.jpg", head: "SUSTAINABILITY", para: "At Acewalk Footwear, we prioritize eco-friendly materials and responsible production, ensuring our footwear supports a greener future.. Walk with confidence, knowing your style supports a greener future." },

        { title: "Female Collection", src: "https://static.wixstatic.com/media/c837a6_a45b871f1d734afc93f0a4f31ecc3a2f~mv2.jpg/v1/fill/w_604,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_a45b871f1d734afc93f0a4f31ecc3a2f~mv2.jpg", head: "QUALITY", para: "Crafted with precision and premium materials, our footwear ensures lasting comfort and durability. Every pair is designed to provide the perfect balance of elegance and reliability, making each step effortless." },

        { title: "Kids Collection", src: "https://static.wixstatic.com/media/c837a6_5d5cdc139d32469b98e76598e97f79f1~mv2.jpg/v1/fill/w_604,h_700,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_5d5cdc139d32469b98e76598e97f79f1~mv2.jpg", head: "INNOVATION", para: "We merge cutting-edge design with advanced technology to create footwear that enhances both performance and style. Experience the future of comfort with Acewalk’s innovative approach to shoemaking." }
    ];

    const imgContainerRef = useRef(null);
    const [offset, setOffset] = useState(["start 130%", "60% 60%"]);
    const [smallscreen, setsmallscreen] = useState(false);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOffset(["-180% end", "-80% end"]);
                setsmallscreen(true);
            } else {
                setOffset(["start 100%", "center 40%"]);
                setsmallscreen(false);
            }
        };

        handleResize();
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const { scrollYProgress } = useScroll({
        target: imgContainerRef,
        offset: offset
    });

    const scale = useTransform(scrollYProgress, [0, 1], [2.6, 1]);

    return (
        <>
            <div ref={containerRef} className='w-full min-h-screen overflow-hidden bg-[#fff]'>
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
                        <h1 className='md:text-3xl text-2xl font-lighter uppercase font-[poppins] text-black'>WHAT WE STAND FOR</h1>
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

                    <div className='flex md:flex-row flex-col items-center'>
                        {collections.map((collection, index) => (
                            <motion.div
                                key={index}
                                className='h-[75vh] md:w-full w-[80vw] flex flex-col items-start px-4 py-2 rounded-sm'
                            >
                                <motion.div
                                    ref={imgContainerRef}
                                    className='h-[70vh] md:w-full w-[80vw] bg-[#aeaeaeec] relative flex items-center justify-center overflow-hidden'
                                >
                                    <div className='absolute bottom-0 right-0 md:bottom-4 md:right-4 bg-[#ffffff]/50 w-full md:w-[15vw] z-[2] backdrop-blur-sm rounded-md'>
                                        <div ref={HeadViewRef} className='h-full w-full flex flex-col items-start gap-2 justify-between p-3 py-4 overflow-hidden'>
                                            <motion.h1
                                                className='font-semibold font-[poppins] flex items-center justify-center gap-2 overflow-hidden'
                                            >
                                                <motion.div
                                                    initial={{ rotate: 640 }}
                                                    animate={(HeadView ? { rotate: 0 } : {})}
                                                    transition={{
                                                        duration: 2.2,
                                                        ease: "backOut",
                                                        delay: 0.2
                                                    }}
                                                >
                                                    <PlusIcon size={18} />
                                                </motion.div>
                                                <motion.span
                                                    initial={{ y: 100 }}
                                                    animate={(HeadView ? { y: 0 } : {})}
                                                    transition={{
                                                        duration: 1.6,
                                                        ease: "backOut",
                                                        delay: 0.2
                                                    }}
                                                >
                                                    {collection.head}
                                                </motion.span>
                                            </motion.h1>
                                            <p className='text-sm font-[roboto]'>{collection.para}</p>
                                        </div>
                                    </div>

                                    <motion.img style={{ scale }} className='absolute inset-0' src={collection.src} alt={collection.title} />
                                </motion.div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </div >

        </>
    )
}

export default AboutEnlargeOnScroll
