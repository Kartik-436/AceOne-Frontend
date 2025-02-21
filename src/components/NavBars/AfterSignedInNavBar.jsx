/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import "../../stylesheets/NavBars.css"
import StaggeredDropDown from '../DropDownShopMenu';
import { AnimatePresence, motion } from 'motion/react';
import FlipLink from '../MenuLinks';

const AfterSignedInNavBar = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="w-1/2 h-screen bg-[#1b1c1e] z-[15] fixed right-0 top-0 origin-right"
                        // initial={{ scaleX: 0, borderTopLeftRadius: 500, borderBottomLeftRadius: 500, x: 50 }}
                        // animate={{ scaleX: 1, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, x: 0 }}
                        // exit={{ scaleX: 0, borderTopLeftRadius: 500, borderBottomLeftRadius: 500 }}
                        // transition={{ duration: 1.1, ease: "anticipate" }}
                        variants={menuSlide}
                        animate="enter"
                        exit="exit"
                        initial="initial"
                    >
                        <motion.button
                            variants={slide}
                            animate="enter"
                            exit="exit"
                            initial="initial"
                            custom={2}
                            onClick={() => setIsMenuOpen(false)}
                            className="absolute top-6 right-6 px-3 py-2 bg-[#f8ffe5] rounded-full cursor-pointer active:scale-90"
                        >
                            <i className="ri-close-large-line text-black text-2xl font-bold"></i>
                        </motion.button>
                        <div
                            className="w-full h-full px-[8.6vw] py-[26vh] flex flex-col items-start justify-start gap-1.5"
                        >
                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={0}
                                onClick={() => { handleDelayNavigation("Home") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]">HOME</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={1}
                                onClick={() => { handleDelayNavigation("about") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]">ABOUT</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={2}
                            >
                                <StaggeredDropDown></StaggeredDropDown>
                            </motion.div>
                        </div>
                    </motion.div>

                )}
            </AnimatePresence>
            <Transition animate={animate} />
            <div className='w-full h-[10.6vh] bg-[#fbffef] fixed top-0 left-0 z-[10]'>
                <div className='flex items-center justify-between w-full h-full px-10'>
                    <div>
                    <h1 onClick={() => { handleDelayNavigation("Home") }} className="text-3xl text-black font-black font-[Marcellus] select-none cursor-pointer">AceOne.</h1>
                    </div>

                    <div className='flex items-center gap-5 h-full'>
                        <input className='search-with-icon px-4 py-1 bg-amber-50 outline-none border-[1px] border-[#111] rounded-full' type="search" name="search" id="search-with-icon" placeholder='Search Items' />
                        <div className='flex items-center gap-2 h-full'>
                            <span><i className="ri-heart-line text-3xl text-black cursor-pointer"></i></span>
                            <span><i className="ri-shopping-cart-line text-3xl text-black cursor-pointer"></i></span>
                        </div>
                        <div className='flex items-center gap-2 h-full'>
                            <button onClick={() => { handleDelayNavigation("userprofile") }}
                                id='NavBarButtons'
                                className='px-9 py-1 uppercase font-mono font-semibold text-black border-[1px] border-black rounded-full active:scale-90'>
                                Profile
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                id='NavBarButtons'
                                className='px-6 py-1 uppercase font-mono font-semibold text-black border-[1px] border-black rounded-full active:scale-90'>
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default AfterSignedInNavBar

const menuSlide = {
    initial: {
        x: "calc(100% + 100px)",
        borderBottomLeftRadius: 500,
        borderTopLeftRadius: 500,
    },
    enter: {
        x: "0%",
        borderBottomLeftRadius: 0,
        borderTopLeftRadius: 0,
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
        x: "calc(100% + 50px)",
        borderBottomLeftRadius: 500,
        borderTopLeftRadius: 500,
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1] }
    }
}

const slide = {
    initial: {
        x: "150px"
    },
    enter: (i) => ({
        x: "0px",
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.095 * i }
    }),
    exit: (i) => ({
        x: "150px",
        transition: { duration: 1, ease: [0.76, 0, 0.24, 1], delay: 0.095 * i }
    })
}