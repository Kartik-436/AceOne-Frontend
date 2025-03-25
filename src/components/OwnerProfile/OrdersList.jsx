/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { getAllOrders, getAllUsers } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'motion/react';
import { ShoppingBasket } from 'lucide-react';

const OrdersList = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [orders, setOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [PendingOrders, setPendingOrders] = useState([]);
    const [CompletedOrders, setCompletedOrders] = useState([]);
    const [CancelledOrders, setCancelledOrders] = useState([]);

    const refreshOrders = async () => {
        try {
            setLoading(true)
            const response = await getAllOrders();
            if (response.success) {
                setOrders(response.orders);
            } else {
                setError(response.message);
                console.error("getting Orders Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Orders Error: ", error)
        }
        setLoading(false)
    }

    useEffect(() => {
        ; (async () => {
            await refreshOrders()
        })()
    }, [])

    useEffect(() => {
        setPendingOrders(orders?.filter(order => order.orderStatus === "Pending"));
        setCompletedOrders(orders?.filter(order => order.orderStatus === "Delivered"));
        setCancelledOrders(orders?.filter(order => order.orderStatus === "Cancelled"));
    }, [orders]);

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex flex-col gap-5'>
                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Orders Stats</h1>
                        <div className='pr-12'>
                            <SortByMenu />
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        {/* Table Header */}
                        <div className='py-3 pl-5 grid grid-cols-8 bg-[#323441] text-white rounded-md'>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]'>Product</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Quantity</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Status</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Date & Time</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Total Amount</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Payment</h1>
                            <h1 className='text-lg font-semibold font-[poppins]'>Order Id</h1>
                        </div>

                        {/* Loading Indicator */}
                        {loading && (
                            <div className='flex flex-col justify-center items-center'>
                                <BarLoader />
                            </div>
                        )}

                        {/* Empty Orders Message */}
                        {!loading && orders.length === 0 ? (
                            <motion.div
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                                className="flex flex-col items-center justify-center h-96 rounded-3xl p-8 border-2 border-dashed mt-5"
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                    className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                >
                                    <ShoppingBasket size={48} className="text-[#ffbb00]" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">No Orders Yet</h2>
                            </motion.div>
                        ) : (
                            <div className='flex flex-col w-full h-[78vh] overflow-y-scroll noScrollbar'>
                                {orders.map((order, orderIndex) => (
                                    <div key={order._id} className="py-3 pl-5 bg-white hover:bg-[#e6e6e6] border-b-4 border-gray-300 rounded-md">
                                        {order.items.map((item, itemIndex) => (
                                            <div key={item.product?._id || itemIndex} className="grid grid-cols-8 py-2">
                                                {/* Product Details */}
                                                <div className="col-span-2 flex items-center justify-start gap-5 row-span-full">
                                                    <div className="w-18 h-18 rounded-lg border-[1px]">
                                                        <img
                                                            src={item.product?.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover rounded-lg"
                                                        />
                                                    </div>
                                                    <div className="flex flex-col items-start">
                                                        <h1 className="text-black font-[poppins] font-medium">{item.product?.name} ({item.selectedColor})</h1>
                                                        <h1 className="text-black font-[poppins] font-light">{item.product?.category} ({item.selectedSize})</h1>
                                                    </div>
                                                </div>

                                                {/* Order Item Quantity */}
                                                <h1 className="text-black font-[poppins] font-medium row-span-full">{item.quantity}</h1>

                                                {/* Display Order Info ONLY ONCE per order using rowSpan */}
                                                {itemIndex === 0 && (
                                                    <>
                                                        <h1 className="text-black font-[poppins] font-medium row-span-full" rowSpan={order.items.length}>{order.orderStatus}</h1>
                                                        <h1 className="text-black font-[poppins] font-medium row-span-full max-w-[60%]" rowSpan={order.items.length}>
                                                            {new Date(order.orderDate).toLocaleString("en-US", {
                                                                year: "numeric",
                                                                month: "long",
                                                                day: "numeric",
                                                                hour: "2-digit",
                                                                minute: "2-digit",
                                                                second: "2-digit",
                                                                hour12: true
                                                            })}
                                                        </h1>
                                                        <h1 className="text-black font-[poppins] font-medium row-span-full" rowSpan={order.items.length}>₹ {order.totalAmount.toFixed(2)}</h1>
                                                        <h1 className="text-black font-[poppins] font-medium row-span-full" rowSpan={order.items.length}>{order.modeOfPayment}</h1>
                                                        <h1 className="text-black font-[poppins] text-wrap max-w-[80%] overflow-x-scroll font-medium row-span-full noScrollbar" rowSpan={order.items.length}>{order._id}</h1>
                                                    </>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

        </>
    )
}

export default OrdersList
