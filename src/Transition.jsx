/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion";

const Transition = ({ animate, disableEntry, anim }) => {
    return (
        <>
            {/* Initial Cover Animation (Disabled when disableEntry is true) */}
            {!disableEntry && (
                <motion.div
                    className="fixed top-0 right-0 w-screen h-screen bg-[#0f0f0f] origin-top flex items-center justify-center z-[999] select-none pointer-events-none"
                    initial={{ scaleY: 1 }} // Starts fully covering
                    animate={{ scaleY: 0 }} // Shrinks to reveal new page
                    exit={{ scaleY: 0 }} // Stays hidden
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.16 }}
                >
                    <motion.h1
                        initial={{ opacity: 1 }}
                        animate={{ opacity: 0 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl text-white font-black font-[Marcellus]"
                    >
                        Acewalk
                    </motion.h1>
                </motion.div>
            )}

            {/* Page Exit Animation (Always Runs) */}
            {(animate || anim) && (
                <motion.div
                    className="fixed top-0 right-0 w-screen h-screen bg-[#0f0f0f] origin-bottom flex items-center justify-center z-[999] select-none pointer-events-none"
                    initial={{ scaleY: 0 }} // Starts hidden at the bottom
                    animate={{ scaleY: 1 }} // Grows to cover the old page
                    exit={{ scaleY: 1 }}
                    transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.13 }}
                >
                    <motion.h1
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                        className="text-7xl text-white font-black font-[Marcellus]"
                    >
                        Acewalk
                    </motion.h1>
                </motion.div>
            )}
        </>
    );
};

export default Transition;
