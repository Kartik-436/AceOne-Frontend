/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Footer from '../components/Footer/Footer';
import { AnimatePresence, motion } from 'motion/react';
import SmallStringAnimation from '../components/StringAnimations/SmallStringAnimation';
import BarLoader from '../components/Loaders/CustomLoader1';
import axios from 'axios';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import AfterSignedInNavBar from '../components/NavBars/AfterSignedInNavBar';
import Transition from '../Transition';
import useDelayedNavigation from '../utils/useDelayedNavigation';

const Cart = () => {
    const [isLoggedIn, setisLoggedIn] = useState(null);
    const [user, setuser] = useState(null);
    const [deliveryFee, setDeliveryFee] = useState(0);
    const { animate, handleDelayNavigation } = useDelayedNavigation();
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

    const total = subtotal + deliveryFee;

    useEffect(() => {
        axios.get('/api/user/profile', { withCredentials: true })
            .then(response => {
                setuser(response.data);
                if (response.success) {
                    setisLoggedIn(true);
                } else setisLoggedIn(false);
            })
            .catch(() => setisLoggedIn(false));
    }, []);

    if (isLoggedIn === null) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <AnimatePresence mode='wait'>
                    <Transition animate={animate} />
                    {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

                    <div className='flex items-start justify-center w-full min-h-screen px-[20vw] pt-[25vh] py-[20vh] gap-10 bg-[#fbffef]'>
                        <div className='w-[65%] h-full flex flex-col'>
                            <div>
                                <div className='text-xl font-[poppins] scale-y-110 text-black mb-5 font-light'>My Cart</div>
                                <hr className='w-full h-2' />
                            </div>

                            <div className='flex flex-col justify-start hideScrollBar max-h-[55vh] overflow-y-scroll'>
                                {products.map(product => (
                                    <div key={product.id} className='flex gap-15 h-[20vh] w-full px-3 py-5 border-b-[1px] border-black'>
                                        <div className='flex gap-4 h-full w-full'>
                                            <div className='border-[1px] border-black h-full w-full rounded-sm'>
                                                <img src={product.imageUrl} className='h-full w-full object-cover' alt="ProductPic" />
                                            </div>
                                            <div className='flex flex-col gap-2'>
                                                <h1 className='text-xl font-[poppins] font-normal max-w-[10vw] text-wrap'>{product.name}</h1>
                                                {product.discount ? (
                                                    <div className="flex gap-1.5 items-center">
                                                        <span className="text-black font-normal text-sm font-[poppins]">₹{product.discountPrice}</span>
                                                        <span className="text-black font-normal font-[poppins] line-through text-xs">₹{product.price}</span>
                                                    </div>
                                                ) : (
                                                    <span className='text-black font-normal text-sm font-[poppins]'>₹{product.price}</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className='flex justify-around w-full'>
                                            <div className="flex items-center border-[1px] border-black rounded-md gap-3 px-2 py-0.5 h-[4vh]">
                                                <span><i className="ri-subtract-line"></i></span>
                                                <span>{product.qty}</span>
                                                <span><i className="ri-add-line"></i></span>
                                            </div>

                                            <div>
                                                <span className="text-black font-medium font-[poppins]">₹{product.price * product.qty}</span>
                                            </div>

                                            <div>
                                                <i className="ri-delete-bin-6-line text-[#252525d2] text-lg cursor-pointer scale-y-125"></i>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className='w-[35%] flex flex-col gap-5'>
                            <div>
                                <div className='text-xl font-[poppins] scale-y-110 text-black mb-[2vh] font-light'>Order Summary</div>
                                <div className='mt-[-6vh]'>
                                    <SmallStringAnimation />
                                </div>
                            </div>

                            <div>
                                <div className="flex items-center justify-between pr-4 mt-[-3.6vh]">
                                    <span className="text-xl font-medium font-[poppins]">
                                        Subtotal
                                    </span>
                                    <span className="font-normal font-[poppins]">
                                        ₹{subtotal}
                                    </span>
                                </div>

                                <div className='mt-[2vh]'>
                                    <div>
                                        <span className='font-normal font-[poppins]'>
                                            Estimate Delivery
                                        </span>
                                    </div>
                                    <div>
                                        <SmallStringAnimation />
                                    </div>
                                </div>

                                <div className="flex items-center justify-between pr-4 mt-[-4vh]">
                                    <span className="text-2xl font-light uppercase font-[poppins]">
                                        Total
                                    </span>
                                    <span className="font-normal text-lg font-[poppins]">
                                        ₹{total}
                                    </span>
                                </div>

                                <div>
                                    <button
                                        onClick={() => {
                                            if (isLoggedIn && user.address) {
                                                handleDelayNavigation("checkout");
                                            } else if(!isLoggedIn) {
                                                handleDelayNavigation("register");
                                            } else {
                                                handleDelayNavigation("profile");
                                            }
                                        }}
                                        id="NavBarButtons"
                                        className="px-30 py-2 uppercase md:text-base text-lg font-mono font-semibold text-black border-black rounded-full active:scale-90 mt-4 bg-[#ffbb00]"
                                    >
                                        Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='z-10'>
                        <Footer />
                    </div>

                </AnimatePresence >
            </React.Fragment >
        )
    }
}

export default Cart
