/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { getAllOrders, getAllProducts, getAllUsers, getOwnerProfile } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'motion/react';
import { LucidePackage2, ShoppingBasket, Trash2 } from 'lucide-react';

const ProductsManager = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [PendingOrders, setPendingOrders] = useState([]);
    const [CompletedOrders, setCompletedOrders] = useState([]);
    const [CancelledOrders, setCancelledOrders] = useState([]);

    const refreshProducts = async () => {
        try {
            setLoading(true)
            const response = await getAllProducts();

            if (response.success) {
                setProducts(response.products);
            } else {
                setError(response.message);
                console.error("getting Products Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Products Error: ", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        ; (async () => {
            await refreshProducts();
        })()
    }, [])

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex flex-col gap-5'>

                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Listed Products</h1>
                        <div className='pr-5'>
                            <button
                                id="NavBarButtons"
                                className="px-6 py-2 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90 text-nowrap"
                            >
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className='py-3 pl-5 grid grid-cols-9 bg-[#323441] text-white rounded-md'>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]'>Product</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Stock</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Price</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Discount</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Category</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Size</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Colour</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Edit / Delete</h1>
                        </div>

                        {loading && <div className='flex flex-col justify-center items-center' >
                            <BarLoader />
                        </div>}

                        {!loading && products.length === 0 ?
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                                className="flex flex-col items-center justify-center h-96 rounded-3xl p-8"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                >
                                    <LucidePackage2 size={48} className="text-[#ffbb00]" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">No Products Yet</h2>
                            </motion.div>
                            :
                            <div className='flex flex-col w-full max-h-[78vh] overflow-y-scroll noScrollbar'>
                                {products.map((product, index) => (
                                    <div key={product._id} className='py-5 pl-5 grid grid-cols-9 bg-white hover:bg-[#e6e6e6] border-b-4 border-gray-300 rounded-md'>
                                        <div className='col-span-2 flex items-center justify-start gap-5'>
                                            <div className='w-18 h-18 rounded-lg border-[1px] '>
                                                <img src={product.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"} alt={product.name} className='w-full h-full object-cover rounded-lg' />
                                            </div>

                                            <div className='flex flex-col items-start h-full'>
                                                <h1 className='text-black font-[poppins] font-medium'>{product.name}</h1>
                                                <h1 className='text-black font-[poppins] font-light'>{product.category} ({product.size})</h1>
                                            </div>
                                        </div>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.stock}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>₹ {product.price}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.discount}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.category}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.size}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.color}</h1>
                                        <div className='text-black font-[poppins] font-medium flex flex-col items-end justify-center w-full gap-3 pr-5'>
                                            <button
                                                id="Shp-Now-Home-Start"
                                                className="px-5 py-3 w-fit h-fit text-sm text-nowrap bg-[#fff] text-black rounded-full transition-all flex items-center justify-center active:scale-90 "
                                            >
                                                Edit Product
                                            </button>
                                            <button
                                                id="Shp-Now-Home-Start"
                                                className="p-3 flex items-center justify-center text-sm w-fit h-fit border text-nowrap rounded-full transition-all active:scale-90 "
                                            >
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    )
}

export default ProductsManager
