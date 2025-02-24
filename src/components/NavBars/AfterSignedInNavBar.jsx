/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import Transition from "../../Transition";
import useDelayedNavigation from "../../utils/useDelayedNavigation";
import "../../stylesheets/NavBars.css";
import { AnimatePresence, delay, motion } from "framer-motion"; // Use framer-motion instead of motion/react
import FlipLink from "../MenuLinks";
import StaggeredDropDown from './../DropDownShopMenu';
import SmallStringAnimation from './../StringAnimations/SmallStringAnimation';
import { useCart } from "../../utils/CartContext";

const AfterSignedInNavBar = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const { isCartMenuOpen, setIsCartMenuOpen } = useCart();

    const [products, setProducts] = useState([
        { id: 1, name: "Classic T-Shirt", price: 499, category: "Male_Collection", imageUrl: "/api/placeholder/300/300", qty: 1 },
        { id: 2, name: "Summer Dress", price: 899, category: "Female_Collection", imageUrl: "/api/placeholder/300/300", qty: 4 },
        { id: 3, name: "Kids Hoodie", price: 599, category: "Kids_Collection", imageUrl: "/api/placeholder/300/300", qty: 1 },
        { id: 4, name: "Denim Jeans", price: 1299, category: "Male_Collection", imageUrl: "/api/placeholder/300/300", qty: 1 },
        { id: 5, name: "Floral Blouse", price: 799, category: "Female_Collection", imageUrl: "/api/placeholder/300/300", qty: 2 },
        { id: 6, name: "Sport Shoes", price: 1599, category: "Male_Collection", imageUrl: "/api/placeholder/300/300", qty: 1 },
        { id: 7, name: "Winter Jacket", price: 1899, discount: true, discountPrice: 1499, category: "Male_Collection", imageUrl: "/api/placeholder/300/300", qty: 5 },
        { id: 8, name: "Summer Shorts", price: 499, discount: true, discountPrice: 399, category: "Kids_Collection", imageUrl: "/api/placeholder/300/300", qty: 1 },
        { id: 9, name: "Casual Dress", price: 999, category: "Female_Collection", imageUrl: "/api/placeholder/300/300", qty: 3 },
    ]);

    const subtotal = products.reduce((acc, product) => {
        const totalPrice = (product.discount ? product.discountPrice : product.price) * product.qty;
        return acc + totalPrice;
    }, 0);

    return (
        <>
            <AnimatePresence>
                {isMenuOpen && (
                    <motion.div
                        className="md:w-1/2 w-screen h-screen bg-[#1b1c1e] z-[15] fixed right-0 top-0 origin-right"
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
                                onClick={() => { handleDelayNavigation("") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">HOME</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={1}
                                onClick={() => { handleDelayNavigation("about") }}
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">ABOUT</FlipLink>
                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={1}
                                onClick={() => { handleDelayNavigation("cart") }}
                                className="md:hidden inline-block"
                            >
                                <FlipLink size="text-7xl" color="text-[#fcf8db]" font="font-black">Cart</FlipLink>
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

            <AnimatePresence>
                {isCartMenuOpen && (
                    <motion.div
                        className="md:w-1/4 w-screen h-screen bg-[#fbffef] border-l-2 border-black py-10 z-[15] fixed right-0 top-0 origin-right"
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
                            onClick={() => setIsCartMenuOpen(false)}
                            className="absolute top-4 right-5 rounded-full cursor-pointer active:scale-90 z-20"
                        >
                            <i className="ri-close-large-line text-black text-2xl font-bold hover:text-red-500 transition-all duration-250 ease-in-out"></i>
                        </motion.button>
                        <div
                            className="w-full h-full flex flex-col items-center justify-between gap-1.5"
                        >
                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={0}
                                className="flex flex-col gap-3"
                            >
                                <div>
                                    <span className="font-[poppins] font-semibold uppercase">My Cart</span>
                                    <span className="font-[poppins] font-light uppercase">({products.length} {products.length > 1 ? "items" : "item"})</span>
                                </div>

                                <div className="w-full items-center justify-center flex">
                                    <SmallStringAnimation />
                                </div>

                                <motion.div
                                    variants={slide}
                                    animate="enter"
                                    exit="exit"
                                    initial="initial"
                                    custom={1}
                                    className="max-h-[52vh] overflow-y-scroll flex flex-col gap-10 justify-start noScrollbar"
                                >
                                    {products.length === 0 ? <p className='text-xl font-semibold font-[nunito] text-black'>No items in Cart.</p> : products.map(product => (
                                        <div key={product.id} className="border-b-[1px] border-[#1f1f1f60] py-4">
                                            <div className="flex gap-2 w-full h-full">
                                                <div className="w-[30%] h-[75%] border-[1px] border-black rounded-md">
                                                    <img src={product.imageUrl} alt="shoepic" />
                                                </div>

                                                <div className="flex flex-col w-full h-full gap-1">
                                                    <div className="flex items-start justify-between w-full pr-3">
                                                        <span className="font-[poppins] font-semibold uppercase text-sm">{product.name}</span>
                                                        <i className="ri-delete-bin-6-line text-lg cursor-pointer scale-y-125"></i>
                                                    </div>

                                                    {product.discount ? (
                                                        <div className="flex gap-1.5 items-center">
                                                            <span className="text-black font-light font-mono">₹{product.discountPrice}</span>
                                                            <span className="text-black font-light font-mono line-through text-sm">₹{product.price}</span>
                                                        </div>
                                                    ) : (
                                                        <span className='text-black font-light font-mono'>₹{product.price}</span>
                                                    )}
                                                    <div className="flex items-start justify-between w-full pr-8">
                                                        <div className="flex items-center border-[1px] border-black rounded-md gap-3 px-2 py-0.5">
                                                            <span><i className="ri-subtract-line"></i></span>
                                                            <span>{product.qty}</span>
                                                            <span><i className="ri-add-line"></i></span>
                                                        </div>
                                                        <span className="text-black font-light font-mono">₹{product.price * product.qty}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>

                            </motion.div>

                            <motion.div
                                variants={slide}
                                animate="enter"
                                exit="exit"
                                initial="initial"
                                custom={2}
                                className="flex flex-col gap-5"
                            >
                                <div className="flex flex-col gap-2">
                                    <div className="w-full flex items-center justify-center"><SmallStringAnimation /></div>
                                    <div className="flex items-center justify-between pr-4 mt-[-6vh]">
                                        <span className="text-lg">
                                            Subtotal
                                        </span>
                                        <span>
                                            ₹{subtotal}
                                        </span>
                                    </div>
                                    <div className="text-sm">Taxes and shipping are calculated at checkout.</div>
                                </div>

                                <div className="w-full items-center justify-center flex">
                                    <button
                                        onClick={() => {
                                            handleDelayNavigation("cart");
                                        }}
                                        id="NavBarButtons"
                                        className="px-30 py-2 uppercase md:text-base text-lg font-mono font-semibold text-black border-black rounded-full active:scale-90"
                                    >
                                        View Cart
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>

                )}
            </AnimatePresence>

            <Transition animate={animate} />

            <div className="w-full h-[10.6vh] bg-[#fbffef] fixed top-0 left-0 z-[10]">
                <div className="flex items-center justify-between w-full h-full px-4 md:px-10">
                    <div>
                        <h1 onClick={() => { handleDelayNavigation("") }} className="text-2xl md:text-3xl font-black font-[Marcellus] select-none cursor-pointer text-transparent bg-clip-text bg-gradient-to-r from-[#ffbb00] from-45% to-45% to-[#1f1f1f]">AceOne.</h1>
                    </div>

                    <div className="flex items-center gap-1 md:gap-5 h-full">
                        <input
                            className="search-with-icon px-4 py-1 bg-[#fff] md:inline-block hidden outline-none border-[1.6px] border-[#111] rounded-full"
                            type="search"
                            name="search"
                            id="search-with-icon"
                            placeholder="Search Items"
                        />
                        <div className="md:flex hidden items-center gap-2 h-full">
                            <span>
                                <i className="ri-heart-line text-3xl text-black cursor-pointer"></i>
                            </span>
                            <span className="relative cursor-pointer active:scale-90" onClick={() => setIsCartMenuOpen(true)}>
                                <p className="w-3.5 h-5 bg-white rounded-full flex items-center justify-center font-bold absolute right-2 bottom-5">
                                    {products.length}
                                </p>
                                <i className="ri-shopping-cart-line text-3xl text-black"></i>
                            </span>
                        </div>
                        <div className="flex items-center gap-2 h-full">
                            <button onClick={() => { handleDelayNavigation("userprofile") }}
                                id='NavBarButtons'
                                className='px-9 py-1 uppercase font-mono font-semibold text-black border-[1px] border-black rounded-full active:scale-90'>
                                Profile
                            </button>
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                id="NavBarButtons"
                                className="px-6 py-1 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90"
                            >
                                Menu
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AfterSignedInNavBar;

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