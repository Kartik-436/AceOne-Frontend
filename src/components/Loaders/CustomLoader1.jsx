import { motion } from "framer-motion";

const variants = {
    initial: {
        scaleY: 0.5,
        opacity: 0,
    },
    animate: {
        scaleY: 1,
        opacity: 1,
        transition: {
            repeat: Infinity,
            repeatType: "mirror",
            duration: 0.85,
            ease: "circIn",
        },
    },
};

const BarLoader = () => {
    return (
        <motion.div
            transition={{
                staggerChildren: 0.25,
            }}
            initial="initial"
            animate="animate"
            className="flex gap-1"
        >
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
            <motion.div variants={variants} className="h-26 w-3.5 bg-[#f21d90]" />
        </motion.div>
    );
};

export default BarLoader;