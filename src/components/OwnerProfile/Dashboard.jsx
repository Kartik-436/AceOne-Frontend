/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { deleteProduct, getAllOrders, getAllProducts, getAllUsers, getOwnerProfile, updateProduct } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { AnimatePresence, motion } from 'motion/react';
import { LucidePackage2, Package, Package2, Pencil, ShoppingBasket, ShoppingCart, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';
import EditProductModal from './EditProductModal';

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
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editModalOpen, setEditModalOpen] = useState(false);

    const handleselectedProduct = (product) => {
        setSelectedProduct(product);
    };

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const [ordersRes, usersRes, ownerRes, productsRes] = await Promise.all([
                    getAllOrders(),
                    getAllUsers(),
                    getOwnerProfile(),
                    getAllProducts(),
                ]);

                if (ordersRes.success) {
                    const orders = ordersRes.data;
                    setOrders(orders);
                    setPendingOrders(orders.filter(order => order.orderStatus === "Pending"));
                    setCompletedOrders(orders.filter(order => order.orderStatus === "Delivered"));
                    setCancelledOrders(orders.filter(order => order.orderStatus === "Cancelled"));
                }

                if (usersRes.success) setUsers(usersRes.data);
                if (ownerRes.success) setOwner(ownerRes.data);
                if (productsRes.success) setProducts(productsRes.data);
            } catch (error) {
                console.error("Error fetching dashboard data:", error);
            }
            setLoading(false);
        })();
    }, []);

    const refreshProducts = async () => {
        try {
            setLoading(true)
            const response = await getAllProducts();

            if (response.success) {
                setProducts(response.data);
            } else {
                setError(response.message);
                console.error("getting Products Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Products Error: ", error)
        }
        setLoading(false)
    }

    const handleDeleteProduct = async (Pid) => {
        try {
            const response = await deleteProduct(Pid);
            if (response.success) {
                await refreshProducts();
                toast.success("Product deleted successfully");
            } else {
                toast.error("Failed to delete product");
            }
        } catch (error) {
            console.error("Delete error:", error.message);
            toast.error("Failed to delete product");
        } finally {
            setConfirmModalOpen(false);
            setSelectedProduct(null);
        }
    };

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
                        <h1 className='text-3xl font-[nunito] text-black font-bold'>Listed Products ({products.length})</h1>
                        <div className='pr-5'>
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
                        <div className='py-3 pl-5 grid grid-cols-9 bg-[#323441] text-white rounded-md'>
                            <h1 className='col-span-2 text-lg font-semibold font-[poppins]'>Product</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Stock</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Price</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Discount</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Category</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Sizes</h1>
                            <h1 className='text-lg font-semibold font-[poppins]' >Colours</h1>
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
                                        <div className='col-span-2 flex items-start justify-start gap-5'>
                                            <div className='w-18 h-18 rounded-lg border-[1px] '>
                                                <img src={product.image || "https://icon-library.com/images/products-icon-png/products-icon-png-12.jpg"} alt={product.name} className='w-full h-full object-cover rounded-lg' />
                                            </div>

                                            <div className='flex flex-col items-start h-full'>
                                                <h1 className='text-black font-[poppins] font-medium max-w-[85%]'>{product.name}</h1>
                                            </div>
                                        </div>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.stock}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>₹ {product.price.toFixed(2)}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.discount}</h1>
                                        <h1 className='text-black font-[poppins] font-medium'>{product.category}</h1>
                                        <div className='flex flex-col gap-2'>
                                            {product.size.map((sz) => (
                                                <h1 key={sz} className='text-black font-[poppins] font-medium'>{sz}</h1>
                                            ))}
                                        </div>
                                        <div className='flex flex-col gap-2'>
                                            {product.color.map((clr) => (
                                                <h1 key={clr} className='text-black font-[poppins] font-medium'>{clr}</h1>
                                            ))}
                                        </div>
                                        <div className='text-black font-[poppins] font-medium flex flex-col items-end justify-center w-full gap-3 pr-5'>
                                            <button
                                                id="Shp-Now-Home-Start"
                                                onClick={() => {
                                                    handleselectedProduct(product)
                                                    setEditModalOpen(true)
                                                }}
                                                title="Edit Product"
                                                className="px-5 py-3 w-fit h-fit text-sm text-nowrap bg-[#fff] text-black rounded-full transition-all flex items-center gap-2 justify-center active:scale-90 "
                                            >
                                                <Pencil size={16} />Edit Product
                                            </button>
                                            <button
                                                onClick={() => {
                                                    handleselectedProduct(product)
                                                    setConfirmModalOpen(true)
                                                }}
                                                id="Shp-Now-Home-Start"
                                                className="p-3 flex items-center justify-center text-sm w-fit h-fit border text-nowrap rounded-full transition-all active:scale-90"
                                            >
                                                <Trash2 size={15} />
                                            </button>

                                            <ConfirmationModal
                                                isOpen={confirmModalOpen}
                                                onClose={() => { setConfirmModalOpen(false) }}
                                                onConfirm={() => { handleDeleteProduct(selectedProduct?._id) }}
                                                product={selectedProduct}
                                            />

                                            <EditProductModal
                                                isOpen={editModalOpen}
                                                onClose={() => setEditModalOpen(false)}
                                                product={selectedProduct}
                                                onProductUpdated={refreshProducts}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        }
                    </div>
                </div>
            </div >
        </>
    )
}

export default Dashboard

const ConfirmationModal = ({ isOpen, onClose, onConfirm, product }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ willChange: "transform", translateZ: 0 }} className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-[#1111111c] transition-all duration-150 z-20">
                    <motion.div
                        key="delete-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 400 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.2, y: 800 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        style={{ willChange: "transform", translateZ: 0 }}
                        className="bg-white p-6 rounded-lg shadow-sm border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to Delete <span className='text-black font-bold'>&quot;{product.name}&quot;</span> ?</p>
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
