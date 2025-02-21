/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from "react";
import { motion } from "framer-motion"; // Use framer-motion instead of motion/react
import useDelayedNavigation from "../utils/useDelayedNavigation";
import Transition from "../Transition";

const DURATION = 0.3;
const STAGGER = 0.03;

const FlipLink = ({ children, size, color, font }) => {
    // const { animate, handleDelayNavigation } = useDelayedNavigation();

    return (
        <>
            {/* <Transition anim={anim} animate={animate} disableEntry={true} /> */}

            <div className="flex items-center justify-center gap-5">
                {/* <div className="h-6 w-6 rounded-full bg-white"></div> */}
                <motion.a
                    initial="initial"
                    whileHover="hovered"
                    // onClick={() => { handleDelayNavigation(href) }}
                    className={`relative inline-block overflow-hidden whitespace-nowrap ${font} uppercase ${color} select-none cursor-pointer ${size}`}
                    style={{
                        lineHeight: 0.75,
                    }}
                >
                    <div>
                        {children.split("").map((l, i) => (
                            <motion.span
                                variants={{
                                    initial: {
                                        y: 0,
                                    },
                                    hovered: {
                                        y: "-130%",
                                    },
                                }}
                                transition={{
                                    duration: DURATION,
                                    ease: "easeInOut",
                                    delay: STAGGER * i,
                                }}
                                className="inline-block"
                                key={i}
                            >
                                {l}
                            </motion.span>
                        ))}
                    </div>
                    <div className="absolute inset-0">
                        {children.split("").map((l, i) => (
                            <motion.span
                                variants={{
                                    initial: {
                                        y: "130%",
                                    },
                                    hovered: {
                                        y: 0,
                                    },
                                }}
                                transition={{
                                    duration: DURATION,
                                    ease: "easeInOut",
                                    delay: STAGGER * i,
                                }}
                                className="inline-block"
                                key={i}
                            >
                                {l}
                            </motion.span>
                        ))}
                    </div>
                </motion.a>
            </div>

        </>
    );
};

export default FlipLink;