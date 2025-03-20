/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useRef, useState } from 'react';
import { motion, useInView, useScroll, useTransform } from 'framer-motion';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';

const Page4 = ({ Kids, Men, Women }) => {
    const containerRef = useRef(null);
    const isInView = useInView(containerRef, { once: false, amount: 0.2 });
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
        { title: "Male Collection", src: "https://static.wixstatic.com/media/c837a6_7407d6560448416a996712cac8ce5c9c~mv2.jpg/v1/fill/w_601,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_7407d6560448416a996712cac8ce5c9c~mv2.jpg", href: "store?category=mens" },
        { title: "Female Collection", src: "https://static.wixstatic.com/media/c837a6_a5a5863d6d7341958148ce678ac1a49a~mv2.jpg/v1/fill/w_604,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_a5a5863d6d7341958148ce678ac1a49a~mv2.jpg", href: "store?category=womens" },
        { title: "Kids Collection", src: "https://static.wixstatic.com/media/c837a6_d70089b44d104fc59d5366f6ff53851b~mv2.jpg/v1/fill/w_604,h_650,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/c837a6_d70089b44d104fc59d5366f6ff53851b~mv2.jpg", href: "store?category=kids" }
    ];

    const imgContainerRef = useRef(null);
    const [offset, setOffset] = useState(["start 130%", "60% 60%"]);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setOffset(["-180% end", "-80% end"]);
            } else {
                setOffset(["start 130%", "60% 40%"]);
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
                        {collections.map((collection, index) => (
                            <motion.div
                                key={index}
                                className='h-[75vh] md:w-[33vw]  w-[80vw] flex flex-col items-start gap-4 px-4 py-2 rounded-xl'
                                initial='hidden'
                                animate={isInView ? 'visible' : 'hidden'}
                                variants={fadeInUp}
                                custom={index}
                            >
                                <motion.div
                                    ref={imgContainerRef}
                                    className='h-[70vh] md:w-[28vw] w-[80vw] rounded-xl bg-[#aeaeaeec] relative flex items-center justify-center overflow-hidden'
                                    variants={fadeInUp}
                                    custom={index + 1}
                                >
                                    <div className='absolute bottom-4 left-4'>
                                        <motion.button
                                            id='Shp-Now-Home-Start'
                                            className='md:px-7 md:py-1 px-5 bg-[#fff] text-black rounded-full uppercase font-mono font-medium text-lg'
                                            whileHover={{ scale: 1.05 }}
                                            onClick={() => { handleDelayNavigation(collection.href) }}
                                        >
                                            {collection.title}
                                        </motion.button>
                                    </div>
                                    <motion.img style={{ scale }} src={collection.src} alt={collection.title} />
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
