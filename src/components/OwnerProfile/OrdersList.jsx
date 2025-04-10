/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import OwnerSearch from '../OwnerSearch';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { getAllOrders, getAllUsers } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'framer-motion';
import { ShoppingBasket, Copy, RefreshCw } from 'lucide-react';
import { toast } from 'react-toastify';
import { format } from 'date-fns';
import AnimatedStatusSelector from '../AnimatedStatusSelector';

const OrdersList = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [allOrders, setAllOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [isRefreshing, setIsRefreshing] = useState(false);
    const orderStatuses = ["all", "Awaiting Payment", "Pending", "Confirmed", "Processing", "Shipped", "Delivered", "Cancelled", "Payment Failed"];

    const refreshOrders = async () => {
        try {
            setLoading(true);
            setIsRefreshing(true);
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
            setTimeout(() => setIsRefreshing(false), 500); // Give visual feedback even for fast operations
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

    const getStatusColor = (status) => {
        const statusColors = {
            "Cancelled": "bg-red-100 text-red-600",
            "Shipped": "bg-blue-100 text-blue-600",
            "Delivered": "bg-green-100 text-green-600",
            "Awaiting Payment": "bg-yellow-100 text-yellow-700",
            "Pending": "bg-orange-100 text-orange-600",
            "Confirmed": "bg-purple-100 text-purple-600",
            "Processing": "bg-indigo-100 text-indigo-600",
            "Payment Failed": "bg-red-100 text-red-700"
        };

        return statusColors[status] || "bg-gray-100 text-gray-800";
    };

    return (
        <>
            <Transition animate={animate} />

            <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
                className='w-full flex flex-col gap-6'
            >
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 bg-white p-5 rounded-xl shadow-sm'>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#ffbb00]/10 p-2 rounded-lg">
                                <ShoppingBasket size={32} className="text-[#ffbb00]" />
                            </div>
                            <h1 className='text-2xl sm:text-3xl font-[nunito] text-[#111] font-bold'>Orders List</h1>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={refreshOrders}
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-[#ffbb00]/10 hover:bg-[#ffbb00]/20 rounded-lg text-[#111] font-semibold font-[poppins] transition-all duration-200"
                                disabled={loading}
                            >
                                <motion.div
                                    animate={isRefreshing ? { rotate: 360 } : { rotate: 0 }}
                                    transition={{ duration: 1, ease: "linear", repeat: isRefreshing ? Infinity : 0 }}
                                >
                                    <RefreshCw size={18} className="text-[#111]" />
                                </motion.div>
                                Refresh
                            </motion.button>

                            <div className='flex items-center gap-3'>
                                <AnimatedStatusSelector
                                    orderStatuses={orderStatuses}
                                    selectedStatus={selectedStatus}
                                    setSelectedStatus={setSelectedStatus}
                                />
                            </div>
                        </div>
                    </div>

                    <div className='w-full overflow-x-auto overflow-y-hidden h-full rounded-xl shadow-sm'>
                        <table className='min-w-full bg-white rounded-xl'>
                            <thead className='bg-[#111] rounded-t-xl text-white'>
                                <tr>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins] rounded-tl-xl'>Order ID</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Customer</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Order Date</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Total Amount</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Payment Mode</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Status</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins] rounded-tr-xl'>Items</th>
                                </tr>
                            </thead>
                            <tbody className='overflow-y-hidden'>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center flex items-center justify-center">
                                            <BarLoader />
                                        </td>
                                    </tr>
                                ) : filteredOrders.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center text-gray-500">
                                            <motion.div
                                                initial={{ opacity: 0, y: 50 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2, type: "spring", stiffness: 100, damping: 12 }}
                                                className="flex flex-col items-center justify-center h-80 rounded-xl p-8 border-2 border-dashed border-gray-200"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.4, type: "spring", stiffness: 200 }}
                                                    className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                                                >
                                                    <ShoppingBasket size={48} className="text-[#ffbb00]" />
                                                </motion.div>
                                                <h2 className="text-2xl font-bold text-[#111] mb-2">No orders found</h2>
                                                <p className="text-gray-500 max-w-md text-center">
                                                    No orders found with the selected status filter.
                                                </p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredOrders.map((order, index) => (
                                        <motion.tr
                                            key={order._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 * (index % 10) }}
                                            className='hover:bg-gray-200 border-b border-gray-100 last:border-b-0'
                                        >
                                            <td className='py-4 px-4 font-medium text-gray-800'>
                                                <motion.button
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    onClick={() => {
                                                        navigator.clipboard.writeText(order._id);
                                                        toast.success("Order ID copied to clipboard!");
                                                    }}
                                                    className="flex items-center gap-2 text-sm hover:text-[#ffbb00] transition-colors duration-200 focus:outline-none group cursor-pointer"
                                                >
                                                    <span className="truncate max-w-[100px] sm:max-w-[150px] md:max-w-[200px]">
                                                        {order._id}
                                                    </span>
                                                    <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                </motion.button>
                                            </td>
                                            <td className='py-4 px-4 text-gray-700 font-medium'>{order.customer ? order.customer.firstName + ' ' + order.customer.lastName : 'N/A'}</td>
                                            <td className='py-4 px-4 text-gray-700'>{formatDate(order.orderDate)}</td>
                                            <td className='py-4 px-4 text-gray-700 font-medium'>
                                                ₹ {order.discountedTotalAmount !== undefined && order.discountedTotalAmount !== null
                                                    ? (order.discountedTotalAmount + order.deliveryFee)?.toFixed(2)
                                                    : (order.totalAmount + order.deliveryFee)?.toFixed(2)}
                                            </td>
                                            <td className='py-4 px-4 text-gray-700'>{order.modeOfPayment}</td>
                                            <td className='py-4 px-4'>
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    {order.orderStatus}
                                                </span>
                                            </td>
                                            <td className='py-4 px-4 text-gray-700'>
                                                <ul className="space-y-1">
                                                    {order.items.map((item) => (
                                                        <li key={item.product?._id || item._id} className="flex items-center gap-2 text-sm">
                                                            <span className="w-1.5 h-1.5 rounded-full bg-[#ffbb00]"></span>
                                                            <span className="truncate max-w-xs">
                                                                {item.product?.name} ({item.quantity})
                                                            </span>
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