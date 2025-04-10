/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import OwnerSearch from '../OwnerSearch';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { getAllOrders, getAllUsers } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'motion/react';
import { ShoppingBasket } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';

const OrdersList = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const orderStatuses = ["all", "Awaiting Payment", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Payment Failed"];

    const refreshOrders = async () => {
        try {
            setLoading(true);
            const response = await getAllOrders();
            if (response.success) {
                setAllOrders(response.data);
            } else {
                setError(response.message);
                console.error("getting Orders Error: ", response.message);
                toast.error(`Error fetching orders: ${response.message}`);
            }
        } catch (error) {
            console.error("getting Orders Error: ", error);
            toast.error("Failed to fetch orders. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ; (async () => {
            await refreshOrders();
        })();
    }, []);

    useEffect(() => {
        if (selectedStatus === 'all') {
            setFilteredOrders(allOrders);
        } else {
            setFilteredOrders(allOrders?.filter(order => order.orderStatus === selectedStatus));
        }
    }, [allOrders, selectedStatus]);

    const formatDate = (date) => {
        try {
            return format(new Date(date), 'dd MMM yyyy, hh:mm a');
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };

    return (
        <>
            <Transition animate={animate} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2 }}
                className='w-full flex flex-col gap-5'
            >
                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Orders List</h1>

                        <div className='flex items-center gap-3'>
                            <label htmlFor="orderStatusFilter" className="font-semibold text-gray-700">Filter By Status:</label>
                            <select
                                id="orderStatusFilter"
                                className="w-auto p-2 border rounded-md shadow-sm focus:border-[#ffbb00] focus:ring-[#ffbb00] text-gray-700"
                                value={selectedStatus}
                                onChange={(e) => setSelectedStatus(e.target.value)}
                            >
                                {orderStatuses.map((status) => (
                                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className='w-full overflow-x-auto'>
                        <table className='min-w-full bg-white rounded-md shadow-md'>
                            <thead className='bg-[#323441] text-white'>
                                <tr>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Order ID</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Customer</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Order Date</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Total Amount</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Payment Mode</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Status</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Items</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-6 text-center">
                                            <BarLoader />
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="py-10 text-center text-gray-500">
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
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ duration: 0.1, delay: 0.05 * filteredOrders.indexOf(order) }}
                                            className='hover:bg-gray-50 transition-colors duration-200'
                                        >
                                            <td className='py-3 px-4 font-medium text-gray-800'>
                                                <button
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(order._id);
                                                        toast.success("Order ID copied!");
                                                    }}
                                                    className="hover:underline focus:outline-none"
                                                >
                                                    {order._id}
                                                </button>
                                            </td>
                                            <td className='py-3 px-4 text-gray-700'>{order.customer ? order.customer.firstName + ' ' + order.customer.lastName : 'N/A'}</td>
                                            <td className='py-3 px-4 text-gray-700'>{formatDate(order.orderDate)}</td>
                                            <td className='py-3 px-4 text-gray-700'>₹ {(order.discountedTotalAmount ? order.discountedTotalAmount : order.totalAmount) + order.deliveryFee}</td>
                                            <td className='py-3 px-4 text-gray-700'>{order.modeOfPayment}</td>
                                            <td className={`py-3 px-4 font-medium ${order.orderStatus === "Cancelled" ? "text-red-500" :
                                                order.orderStatus === "Shipped" ? "text-blue-400" :
                                                    order.orderStatus === "Delivered" ? "text-green-500" :
                                                        order.orderStatus === "Awaiting Payment" ? "text-yellow-600" :
                                                            order.orderStatus === "Pending" ? "text-orange-500" :
                                                                order.orderStatus === "Confirmed" ? "text-purple-500" :
                                                                    order.orderStatus === "Processing" ? "text-indigo-500" :
                                                                        order.orderStatus === "Payment Failed" ? "text-red-600" :
                                                                            "text-gray-800"
                                                }`}>{order.orderStatus}</td>
                                            <td className='py-3 px-4 text-gray-700'>
                                                <ul className="list-disc pl-5">
                                                    {order.items.map((item) => (
                                                        <li key={item.product?._id || item._id} className="truncate max-w-xs">
                                                            {item.product?.name} ({item.quantity})
                                                        </li>
                                                    ))}
                                                </ul>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>
        </>
    );
};

export default OrdersList;