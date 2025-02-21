/* eslint-disable react/prop-types */
import { motion } from "framer-motion";
import { useState } from "react";
import FlipLink from './MenuLinks';
import useDelayedNavigation from "../utils/useDelayedNavigation";
import Transition from './../Transition';

const StaggeredDropDown = () => {
    const [open, setOpen] = useState(false);
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    return (
        <div>
            <Transition animate={animate} disableEntry={true} />
            <motion.div
                animate={open ? "open" : "closed"}
                className="relative"
            >
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-end justify-between w-[27vw] cursor-pointer"
                >
                    <span className="font-black text-[#f8ffe5] text-7xl">SHOP</span>
                    <motion.div
                        variants={iconVariants}
                        className="ri-arrow-down-s-line text-[#f8ffe5] font-bold text-5xl inline-block"
                    />
                </button>

                <motion.div
                    initial="closed"
                    animate={open ? "open" : "closed"}
                    variants={wrapperVariants}
                    style={{ originY: "top", translateX: "-50%" }}
                    className="flex flex-col items-start justify-center gap-2 absolute top-[130%] left-[48%] w-fit"
                >
                    <div className="flex items-center justify-center gap-4" onClick={() => { handleDelayNavigation("store") }}>
                        <motion.span
                            // variants={itemVariants}
                            className="w-4 h-4 rounded-full bg-white"></motion.span>
                        <Option setOpen={setOpen} text="All_Products" />
                    </div>
                    <div className="flex items-center justify-center gap-4" onClick={() => { handleDelayNavigation("store") }}>
                        <motion.span
                            // variants={itemVariants}
                            className="w-4 h-4 rounded-full bg-white"></motion.span>
                        <Option setOpen={setOpen} text="BestSellers" />
                    </div>
                    <div className="flex items-center justify-center gap-4" onClick={() => { handleDelayNavigation("store") }}>
                        <motion.span
                            // variants={itemVariants}
                            className="w-4 h-4 rounded-full bg-white"></motion.span>
                        <Option setOpen={setOpen} text="Discounted" />
                    </div>
                </motion.div>
            </motion.div>
        </div>
    );
};

const Option = ({ text, setOpen }) => {

    return (
        <>
            <motion.div
                variants={itemVariants}
                onClick={
                    () => {
                        setOpen(false)
                    }
                }
            >
                <FlipLink size="text-[2.8vw]" color="text-[#f8ffe5]">{text}</FlipLink>
            </motion.div>
        </>
    );
};

export default StaggeredDropDown;

const wrapperVariants = {
    open: {
        scaleY: 1,
        transition: {
            when: "beforeChildren",
            staggerChildren: 0.08,
        },
    },
    closed: {
        scaleY: 0,
        transition: {
            when: "afterChildren",
            staggerChildren: 0.08,
        },
    },
};

const itemVariants = {
    open: {
        opacity: 1,
        y: 0,
        transition: {
            when: "beforeChildren",
        },
    },
    closed: {
        opacity: 0,
        y: -20,
        transition: {
            when: "afterChildren",
        },
    },
};

const iconVariants = {
    open: { rotate: 180 },
    closed: { rotate: 0 },
};