/* eslint-disable no-unused-vars */
// components/Orders.jsx
import React, { useEffect, useState } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { getUserOrders } from '../../utils/UserService';
import { motion } from 'motion/react';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';

const Orders = () => {
    const [orders, setOrders] = useState([])
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await getUserOrders();
            if (response.success && Array.isArray(response.orders)) {
                setOrders(response.orders);
            } else {
                setOrders([]); //
                console.error(response.message);
            }
        };

        fetchOrderData();
    }, []);

    return (
        <>
            <Transition animate={animate} />
            <div>
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>

                {orders.length === 0 ? (
                    <motion.div
                        initial={{ opacity: 0, y: 100 }}
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
                            <Package size={48} className="text-[#ffbb00]" />
                        </motion.div>
                        <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">No Orders Yet.</h2>
                        <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                            Items you love can be Ordered within a minute. Start exploring and order some favorites!
                        </p>
                        <button
                            onClick={() => handleDelayNavigation("store")}
                            className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1f1f1f]/90 transition-all cursor-pointer AddToCartInStore"
                        >
                            Discover Products
                        </button>
                    </motion.div>
                ) : (
                    <div className="space-y-4">
                        {orders.map(order => (
                            <div key={order._id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold">{order._id}</span>
                                        </div>
                                        <p className="text-sm text-gray-600 mt-1">Ordered on {order.orderDate}</p>
                                    </div>

                                    <div className="flex items-center gap-6 w-full sm:w-auto">
                                        <div>
                                            <p className="text-sm text-gray-600">Items</p>
                                            <p className="font-medium">{(order.items || []).length}</p>
                                        </div>

                                        <div>
                                            <p className="text-sm text-gray-600">Total</p>
                                            <p className="font-medium">{order.totalAmount}</p>
                                        </div>

                                        <button className="ml-auto sm:ml-6 p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                                            <ChevronRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </>
    );
};

export default Orders;