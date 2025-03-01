/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { getAllOrders, getAllProducts, getAllUsers, getOwnerProfile } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { motion } from 'motion/react';
import { LucidePackage2, Package, Package2, ShoppingBasket, ShoppingCart } from 'lucide-react';

const Dashboard = ({ setActive, setActiveTab }) => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [orders, setOrders] = useState([]);
    const [products, setProducts] = useState([]);
    const [users, setUsers] = useState([]);
    const [Owner, setOwner] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [PendingOrders, setPendingOrders] = useState([]);
    const [CompletedOrders, setCompletedOrders] = useState([]);
    const [CancelledOrders, setCancelledOrders] = useState([]);

    const refreshOwner = async () => {
        try {
            setLoading(true)
            const response = await getOwnerProfile();

            if (response.success) {
                setOwner(response.profile);
            } else {
                setError(response.message);
                console.error("getting Owner Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Owner Error: ", error)
        }
        setLoading(false)
    }

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

    const refreshUsers = async () => {
        try {
            setLoading(true)
            const response = await getAllUsers();

            if (response.success) {
                setUsers(response.users);
            } else {
                setError(response.message);
                console.error("getting Users Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Users Error: ", error)
        }
        setLoading(false)
    }

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
            await refreshOrders();
            await refreshUsers();
            await refreshOwner();
            await refreshProducts();
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
                <div className='w-full flex items-center justify-between pr-3'>
                    <div className='w-full flex gap-3 items-center'>
                        <div>
                            <div className='w-20 h-20 p-1 rounded-full'>
                                <img src={Owner?.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"} alt="OwnerPicture" className='w-full h-full object-cover rounded-full text-white' />
                            </div>
                        </div>

                        <div className='flex flex-col'>
                            <h1 className='font-[nunito] font-semibold text-black'>Hi, {Owner?.fullName}</h1>
                            <h1 className='font-[nunito] font-semibold text-2xl text-black -mt-1'>Welcome Back !</h1>
                        </div>
                    </div>

                    <div className='w-full flex items-center justify-end gap-5'>
                        <div className='w-full'>
                            <OwnerSearch />
                        </div>

                        <div>
                            <button
                                onClick={() => setActiveTab("settings")}
                                id="NavBarButtons"
                                className="px-6 py-2 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90 text-nowrap"
                            >
                                Edit Profile
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex items-center justify-evenly gap-5'>
                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="CompletedOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        {loading && <div className='flex flex-col justify-center' >
                            <BarLoader />
                        </div>}

                        {!loading && <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Completed</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>{CompletedOrders.length}</h1>
                        </div>}
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="PendingOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        {loading && <div className='flex flex-col justify-center' >
                            <BarLoader />
                        </div>}

                        {!loading && <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Pending</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>{PendingOrders.length}</h1>
                        </div>}
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="CencelledOrders.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        {loading && <div className='flex flex-col justify-center' >
                            <BarLoader />
                        </div>}

                        {!loading && <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Orders Cancelled</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>{CancelledOrders.length}</h1>
                        </div>}
                    </div>

                    <div className='h-[16vh] w-[70%] bg-white rounded-lg p-8 flex gap-5'>
                        <div className='h-full flex items-center'>
                            <div className='w-17 h-17 rounded-lg'>
                                <img src="TotalUsers.svg" alt="OwnerPicture" className='w-full h-full object-cover text-white' />
                            </div>
                        </div>

                        {loading && <div className='flex flex-col justify-center' >
                            <BarLoader />
                        </div>}

                        {!loading && <div className='flex flex-col justify-center'>
                            <h1 className='font-[nunito] font-semibold text-sm text-gray-700'>Total Users</h1>
                            <h1 className='font-[nunito] font-bold text-black text-2xl -mt-1'>{users.length}</h1>
                        </div>}
                    </div>
                </div>

                <div className='flex flex-col gap-5'>
                    <div className='flex items-center justify-between w-full'>
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Listed Products</h1>
                        <div className='pr-12'>
                            <button
                                onClick={() => setActiveTab("products")}
                                id="NavBarButtons"
                                className="px-6 py-2 uppercase md:text-base text-sm font-mono font-semibold text-black border-black rounded-full active:scale-90 text-nowrap"
                            >
                                Add New
                            </button>
                        </div>
                    </div>

                    <div className='flex flex-col w-full'>
                        <div className='py-3 pl-5 grid grid-cols-8 bg-[#323441] text-white rounded-md'>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]'>Product</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Stock</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Price</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Discount</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Category</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Size</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Colour</h1>
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
                            <div className='flex flex-col w-full max-h-[46vh] overflow-y-scroll noScrollbar'>
                                {products.map((product, index) => (
                                    <div key={product._id} className='py-3 pl-5 grid grid-cols-8 bg-white hover:bg-[#e6e6e6] border-b-4 border-gray-300 rounded-md'>
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

export default Dashboard
