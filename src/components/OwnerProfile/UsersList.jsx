/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import OwnerSearch from '../OwnerSearch';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { deleteUser, getAllOrders, getAllProducts, getAllUsers, getOwnerProfile } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'framer-motion';
import { User, Trash2, Copy, RefreshCw, Clipboard, ShoppingBasket, X, Eye } from 'lucide-react';
import { toast } from 'react-toastify';
import OwnerUserSearch from '../OwnerSearchUser';

const UsersList = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [showOrdersModal, setShowOrdersModal] = useState(false);
    const [selectedUserOrders, setSelectedUserOrders] = useState(null);

    const refreshUsers = async () => {
        try {
            setLoading(true);
            setIsRefreshing(true);
            const response = await getAllUsers();

            if (response.success) {
                setUsers(response.data);
            } else {
                setError(response.message);
                console.error("getting Users Error: ", response.message);
                toast.error(`Error fetching users: ${response.message}`);
            }
        } catch (error) {
            console.error("getting Users Error: ", error);
            toast.error("Failed to fetch users. Please try again.");
        } finally {
            setLoading(false);
            setTimeout(() => setIsRefreshing(false), 500); // Give visual feedback even for fast operations
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if (response.success) {
                await refreshUsers();
                toast.success("User deleted successfully");
            } else {
                console.error("user deletion error: ", response.message);
                toast.error("Failed to delete user");
            }
        } catch (error) {
            console.error("Delete error:", error);
            toast.error("Failed to delete user");
        }
        setConfirmModalOpen(false);
    };

    useEffect(() => {
        ; (async () => {
            await refreshUsers();
        })();
    }, []);

    const formatDate = (date) => {
        try {
            return new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
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
                transition={{ duration: 0.3, ease: "easeOut" }}
                className='w-full flex flex-col gap-6'
            >
                <div className='flex flex-col gap-6'>
                    <div className='flex flex-col sm:flex-row sm:items-center justify-between w-full gap-4 bg-white p-5 rounded-xl shadow-sm'>
                        <div className="flex items-center gap-3">
                            <div className="bg-[#ffbb00]/10 p-2 rounded-lg">
                                <User size={32} className="text-[#ffbb00]" />
                            </div>
                            <h1 className='text-2xl sm:text-3xl font-[nunito] text-[#111] font-bold'>Users List</h1>
                        </div>

                        <div className='flex flex-col sm:flex-row sm:items-center gap-4'>
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={refreshUsers}
                                className="flex items-center cursor-pointer justify-center gap-2 px-4 py-2 bg-[#ffbb00]/10 hover:bg-[#ffbb00]/20 rounded-lg text-[#111] font-semibold font-[poppins] transition-all duration-200"
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

                            <div className='w-64 sm:w-[40vw]'>
                                <OwnerUserSearch />
                            </div>
                        </div>
                    </div>

                    <div className='w-full overflow-x-auto overflow-y-hidden h-full rounded-xl shadow-sm'>
                        <table className='min-w-full bg-white rounded-xl'>
                            <thead className='bg-[#111] rounded-t-xl text-white'>
                                <tr>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins] rounded-tl-xl'>User</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Email</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Contact</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Address</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Orders</th>
                                    <th className='py-3 px-4 text-left font-semibold font-[poppins]'>Registered On</th>
                                    <th className='py-3 px-4 text-center font-semibold font-[poppins] rounded-tr-xl'>Actions</th>
                                </tr>
                            </thead>
                            <tbody className='overflow-y-hidden'>
                                {loading ? (
                                    <tr>
                                        <td colSpan="7" className="py-12 text-center flex items-center justify-center">
                                            <BarLoader />
                                        </td>
                                    </tr>
                                ) : users.length === 0 ? (
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
                                                    <User size={48} className="text-[#ffbb00]" />
                                                </motion.div>
                                                <h2 className="text-2xl font-bold text-[#111] mb-2">No users found</h2>
                                                <p className="text-gray-500 max-w-md text-center">
                                                    There are currently no registered users in the system.
                                                </p>
                                            </motion.div>
                                        </td>
                                    </tr>
                                ) : (
                                    users.map((user, index) => (
                                        <motion.tr
                                            key={user._id}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ duration: 0.2, delay: 0.05 * (index % 10) }}
                                            className='hover:bg-gray-100 border-b border-gray-100 last:border-b-0'
                                        >
                                            <td className='py-4 px-4'>
                                                <div className='flex items-center gap-3'>
                                                    <div className='w-10 h-10 rounded-full overflow-hidden border border-gray-200'>
                                                        <img
                                                            src={user.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"}
                                                            alt={user.fullName}
                                                            className='w-full h-full object-cover'
                                                        />
                                                    </div>
                                                    <div>
                                                        <p className='font-medium text-gray-800'>{user.fullName}</p>
                                                        <motion.button
                                                            whileHover={{ scale: 1.02 }}
                                                            whileTap={{ scale: 0.98 }}
                                                            onClick={() => {
                                                                navigator.clipboard.writeText(user._id);
                                                                toast.success("User ID copied to clipboard!");
                                                            }}
                                                            className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#ffbb00] transition-colors duration-200 focus:outline-none group cursor-pointer"
                                                        >
                                                            <span className="truncate max-w-[80px] sm:max-w-[120px]">
                                                                {user._id}
                                                            </span>
                                                            <Copy size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                                        </motion.button>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <div className='max-w-[180px] overflow-hidden'>
                                                    <p
                                                        className='text-gray-700 truncate hover:overflow-visible hover:whitespace-normal hover:bg-white hover:shadow-md hover:p-1 hover:rounded hover:z-10 hover:absolute hover:max-w-[300px]'
                                                        title={user.email}
                                                        style={{ position: 'relative' }} // Ensure relative positioning for absolute hover
                                                    >
                                                        {user.email}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <p className='text-gray-700'>{user.contact || 'N/A'}</p>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <div className='max-w-[200px] overflow-hidden'>
                                                    <p
                                                        className='text-gray-700 truncate hover:overflow-visible hover:whitespace-normal hover:bg-white hover:shadow-md hover:p-1 hover:rounded hover:z-10 hover:absolute hover:max-w-[300px]'
                                                        title={user?.address?.formattedAddress || 'Address not provided'}
                                                        style={{ position: 'relative' }} // Ensure relative positioning for absolute hover
                                                    >
                                                        {user?.address?.formattedAddress || 'Address not provided'}
                                                    </p>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <div className="flex flex-col items-center gap-3">
                                                    <span className="px-3 py-1 bg-[#ffbb00]/10 text-[#ffbb00] rounded-full text-xs font-medium">
                                                        {user.orders.length} orders
                                                    </span>
                                                    <span
                                                        className="text-gray-500 cursor-pointer hover:text-[#ffbb00] transition-colors flex items-center gap-1 font-[poppins] font-semibold uppercase"
                                                        onClick={() => {
                                                            setSelectedUserOrders(user);
                                                            setShowOrdersModal(true);
                                                        }}
                                                    >
                                                        View <Eye size={17} />
                                                    </span>
                                                </div>
                                            </td>
                                            <td className='py-4 px-4'>
                                                <p className='text-gray-700 text-sm'>{formatDate(user.createdAt)}</p>
                                            </td>
                                            <td className='py-4 px-4 text-center'>
                                                <motion.button
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={() => {
                                                        setSelectedUser(user);
                                                        setConfirmModalOpen(true);
                                                    }}
                                                    id="Shp-Now-Home-Start"
                                                    className="inline-flex items-center justify-center p-2 rounded-full transition-all duration-200 border-2"
                                                >
                                                    <Trash2 size={18} />
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </motion.div>

            <ConfirmationModal
                isOpen={confirmModalOpen}
                onClose={() => setConfirmModalOpen(false)}
                onConfirm={() => handleDeleteUser(selectedUser?._id)}
                user={selectedUser}
            />

            <OrdersModal
                isOpen={showOrdersModal}
                onClose={() => setShowOrdersModal(false)}
                user={selectedUserOrders}
            />
        </>
    );
};

const ConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4 overflow-hidden"
            >
                <div className="bg-red-50 p-4 flex items-center gap-3">
                    <div className="bg-red-100 p-2 rounded-full">
                        <Trash2 size={24} className="text-red-500" />
                    </div>
                    <h2 className="text-lg font-semibold text-gray-800">Confirm User Deletion</h2>
                </div>

                <div className="p-6">
                    <p className="text-gray-600">
                        Are you sure you want to delete the user <span className="font-medium text-gray-800">{user.fullName}</span>?
                    </p>

                    <div className="mt-2 text-sm text-gray-500">
                        <p>• User has <span className="font-medium">{user.orders.length}</span> orders</p>
                        <p>• Email: {user.email}</p>
                        {user.contact && <p>• Contact: {user.contact}</p>}
                    </div>

                    <div className="mt-6 flex justify-end gap-3">
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={onConfirm}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-white font-medium transition-colors"
                        >
                            Delete User
                        </motion.button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

const OrdersModal = ({ isOpen, onClose, user }) => {
    if (!isOpen || !user) return null;

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

    const formatDate = (date) => {
        try {
            return new Date(date).toLocaleString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
                hour12: true
            });
        } catch (error) {
            console.error("Error formatting date:", error);
            return 'N/A';
        }
    };

    return (
        <div className="fixed inset-0 w-full h-full flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="bg-white rounded-xl shadow-lg w-11/12 max-w-4xl h-[80vh] overflow-hidden flex flex-col"
            >
                <div className="bg-[#ffbb00]/10 p-4 flex items-center justify-between sticky top-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-[#ffbb00]/20 p-2 rounded-full">
                            <ShoppingBasket size={24} className="text-[#ffbb00]" />
                        </div>
                        <div>
                            <h2 className="text-lg font-semibold text-gray-800">Orders for {user.fullName}</h2>
                            <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
                    >
                        <X size={24} />
                    </button>
                </div>

                <div className="overflow-y-auto noScrollbar p-4 flex-1">
                    {user.orders.length === 0 ? (
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
                                No orders found for this user.
                            </p>
                        </motion.div>
                    ) : (
                        <div className="space-y-6">
                            {user.orders.map((order, index) => (
                                <motion.div
                                    key={order._id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05, duration: 0.2 }}
                                    className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden"
                                >
                                    <div className="border-b border-gray-100 p-4 flex justify-between items-center">
                                        <div>
                                            <motion.button
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => {
                                                    navigator.clipboard.writeText(order._id);
                                                    toast.success("Order ID copied to clipboard!");
                                                }}
                                                className="flex items-center gap-2 text-sm hover:text-[#ffbb00] transition-colors duration-200 focus:outline-none group cursor-pointer"
                                            >
                                                <span className="font-medium text-gray-700">Order ID:</span>
                                                <span className="text-gray-500 group-hover:text-[#ffbb00]">{order._id}</span>
                                                <Copy size={14} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                                            </motion.button>
                                            <p className="text-sm text-gray-500 mt-1">{formatDate(order.orderDate)}</p>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                            <p className="font-medium text-gray-700">
                                                ₹ {((order?.discountedTotalAmount !== undefined ? order?.discountedTotalAmount : order?.totalAmount) + order.deliveryFee)?.toFixed(2)}
                                            </p>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <h3 className="text-sm font-medium text-gray-700 mb-3">Items</h3>
                                        <div className="space-y-3">
                                            {order.items.map((item, itemIndex) => (
                                                <div key={item.product?._id || itemIndex} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-b-0 last:pb-0">
                                                    <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                                        <img
                                                            src={item.product?.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                                                            alt={item.product?.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium text-gray-800">{item.product?.name}</p>
                                                        <div className="flex items-center justify-between mt-1">
                                                            <div className="text-sm text-gray-500">
                                                                {item.selectedColor} • {item.selectedSize} • Qty: {item.quantity}
                                                            </div>
                                                            <div className="text-sm font-medium">
                                                                ₹ {(item.price)?.toFixed(2)}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="bg-gray-50 p-4">
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-500">Payment Method</span>
                                            <span className="font-medium text-gray-700">{order.modeOfPayment}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mt-1">
                                            <span className="text-gray-500">Delivery Fee</span>
                                            <span className="font-medium text-gray-700">₹ {order.deliveryFee?.toFixed(2)}</span>
                                        </div>
                                        {order.discountedTotalAmount !== undefined && order.discountedTotalAmount !== null && (
                                            <div className="flex justify-between text-sm mt-1">
                                                <span className="text-gray-500">Discount Applied</span>
                                                <span className="font-medium text-green-600">
                                                    - ₹ {(order.totalAmount - order.discountedTotalAmount)?.toFixed(2)}
                                                </span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-medium text-gray-900 mt-2 pt-2 border-t border-gray-200">
                                            <span>Total</span>
                                            <span>₹ {((order?.discountedTotalAmount !== undefined ? order?.discountedTotalAmount : order?.totalAmount) + order.deliveryFee)?.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};


export default UsersList;