/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { deleteUser, getAllOrders, getAllProducts, getAllUsers, getOwnerProfile } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { AnimatePresence, motion } from 'motion/react';
import { LucidePackage2, ShoppingBasket, Trash2, User } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import OwnerUserSearch from '../OwnerSearchUser';

const UsersList = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [users, setUsers] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [PendingOrders, setPendingOrders] = useState([]);
    const [CompletedOrders, setCompletedOrders] = useState([]);
    const [CancelledOrders, setCancelledOrders] = useState([]);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    const refreshUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUsers();

            if (response.success) {
                setUsers(response.data);
            } else {
                setError(response.message);
                console.error("getting Users Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Users Error: ", error)
        }
        setLoading(false)
    }

    const handleDeleteUser = async (userId) => {
        try {
            const response = await deleteUser(userId);
            if (response.success) {
                await refreshUsers();
                toast.success("User deleted successfully");
            } else {
                console.error("user deletion error: ", response.message)
                toast.error("Failed to delete user")
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
        })()
    }, [])

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex flex-col gap-5'>

                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>All Users</h1>
                        <div className='pr-5 w-[50%]'>
                            <OwnerUserSearch />
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className='py-3 pl-5 grid grid-cols-11 bg-[#323441] text-white rounded-md'>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]'>User</h1>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]' >Email</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Contact</h1>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]' >Address</h1>
                            <h1 className='col-span-3 text-lg font-semibold font-[poppins]' >Orders</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Delete User</h1>
                        </div>

                        {loading && <div className='flex flex-col justify-center items-center' >
                            <BarLoader />
                        </div>}

                        {!loading && users.length === 0 ?
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
                                    <User size={48} className="text-[#ffbb00]" />
                                </motion.div>
                                <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">No Users Registered</h2>
                            </motion.div>
                            :
                            <div className='flex flex-col w-full max-h-[78vh] overflow-y-scroll noScrollbar'>
                                {users.map((user, index) => (
                                    <div key={user._id} className='py-5 pl-5 grid grid-cols-11 bg-white hover:bg-[#e6e6e6] border-b-4 border-gray-300 rounded-md'>
                                        <div className='col-span-2 flex items-start justify-start gap-5'>
                                            <div className='w-18 h-18 rounded-lg border-[1px] '>
                                                <img src={user.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"} alt={user.name} className='w-full h-full object-cover rounded-lg' />
                                            </div>

                                            <div className='flex flex-col items-start h-full'>
                                                <h1 className='text-black font-[poppins] font-medium'>{user.fullName}</h1>
                                                <h1 className='text-black font-[poppins] text-sm font-light'>Orders Made: {user.orders.length}</h1>
                                            </div>
                                        </div>
                                        <h1 className='col-span-2 text-black font-[poppins] font-medium h-full max-w-[90%] break-words break-before-right'>{user.email}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{user.contact}</h1>
                                        <h1 className='col-span-2 text-black font-[poppins] font-medium w-ful'>{user.address}</h1>
                                        <div className='col-span-3 text-black font-[poppins] font-medium w-full'>
                                            {
                                                user.orders.length === 0 ?
                                                    (<div className=' text-black font-[poppins] font-medium w-full'>No orders Made...</div>)
                                                    :
                                                    (<div className='flex flex-col w-full max-h-[40vh] gap-5 overflow-y-scroll noScrollbar'>
                                                        {user.orders.map((order, index) => (
                                                            <div key={order._id} className="border-b-2 border-gray-400 py-4 px-2 space-y-2">
                                                                {order.items.map((item, itemIndex) => (
                                                                    <div key={item.product?._id || itemIndex} className="flex items-start gap-2.5">
                                                                        {/* Product Image */}
                                                                        <div className="w-18 h-18 rounded-lg border-[1px]">
                                                                            <img
                                                                                src={item.product?.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"}
                                                                                alt={item.product?.name}
                                                                                className="w-full h-full object-cover rounded-lg"
                                                                            />
                                                                        </div>

                                                                        {/* Product Details */}
                                                                        <div className="flex flex-col items-start h-full">
                                                                            <div className="w-full flex justify-between">
                                                                                <h1 className="text-black font-[poppins] font-medium">{item.product?.name} ({item.quantity})</h1>
                                                                            </div>
                                                                            <h1 className="text-black font-[poppins] font-light">
                                                                                {item.product?.category} ({item.selectedSize})
                                                                            </h1>
                                                                        </div>
                                                                    </div>
                                                                ))}

                                                                {/* Order-Level Details */}
                                                                <div className="flex flex-col items-start mt-2">
                                                                    <h1 className="text-black font-[poppins] font-medium">Total: ₹ {((order?.discountedTotalAmount ? order?.discountedTotalAmount : order?.totalAmount) + order.deliveryFee).toFixed(2)}</h1>
                                                                    <h1 className="text-black font-[poppins] font-medium">{order.orderStatus}</h1>
                                                                    <h1 className="text-black font-[poppins] font-medium">
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
                                                                    <h1
                                                                        onClick={() => {
                                                                            navigator.clipboard.writeText(order._id);
                                                                            toast.success("Order ID copied!");
                                                                        }}
                                                                        className="text-black font-[poppins] font-medium select-all"
                                                                    >
                                                                        Order Id - {order._id}
                                                                    </h1>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>)
                                            }
                                        </div>
                                        <div className='text-black font-[poppins] font-medium flex items-start justify-end w-full pr-2'>
                                            <button
                                                onClick={() => {
                                                    setSelectedUser(user); // Set the selected user
                                                    setConfirmModalOpen(true);
                                                }}
                                                id="Shp-Now-Home-Start"
                                                className="p-4 flex items-center justify-center text-sm w-fit h-fit border text-nowrap rounded-full transition-all active:scale-90 gap-1 cursor-pointer"
                                            >
                                                <Trash2 size={21} />
                                            </button>

                                            <ConfirmationModal
                                                isOpen={confirmModalOpen}
                                                onClose={() => setConfirmModalOpen(false)}
                                                onConfirm={() => handleDeleteUser(selectedUser?._id)}
                                                user={selectedUser}
                                            />

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

export default UsersList

const ConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 w-full h-full flex items-center justify-center backdrop-blur-sm bg-[#11111116] transition-all duration-150 z-20">
                    <motion.div
                        key="delete-user-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 400 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 800 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        style={{ willChange: "transform", translateZ: 0 }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to Delete the user <span className='text-black font-bold'>&quot;{user.fullName}&quot;</span> with <span className='text-black font-bold'>{user.orders.length}</span> orders ?</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer active:scale-95"
                            >
                                No
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer active:scale-95"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};