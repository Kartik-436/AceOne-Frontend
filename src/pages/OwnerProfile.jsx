/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import Transition from './../Transition';
import { logoutOwner } from '../utils/AuthService';
import Analytics from '../components/OwnerProfile/Analytics';
import ProductsManager from '../components/OwnerProfile/ProductsManager';
import OrdersList from '../components/OwnerProfile/OrdersList';
import UsersList from '../components/OwnerProfile/UsersList';
import Dashboard from '../components/OwnerProfile/Dashboard';
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from "framer-motion";
import { Home, ShoppingCart, PackageSearch, UserRoundCog, LineChart, LogOut, Cog } from "lucide-react";
import OwnerSettings from '../components/OwnerProfile/OwnerSettings';

const OwnerProfile = () => {
    const { logout } = useAuth();
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [error, setError] = useState("");
    const [activeTab, setActiveTab] = useState('dashboard');

    const handleLogout = async () => {
        setError("");
        const result = await logoutOwner();
        if (result.success) {
            toast.success("Owner Logged Out Successfully !")
            logout();
            handleDelayNavigation('ownerLogin');
        }
    };

    return (
        <>
            <Transition animate={animate} />
            <div className="min-h-screen w-full bg-[#f0efe7] text-black md:p-5 p-2 flex items-start justify-end">
                {/* Side Bar */}
                <Sidebar handleLogout={handleLogout} setActiveTab={setActiveTab} activeTab={activeTab} />

                {/* Main Content */}
                <div className='w-[92%] h-full bg-[#f0efe7] text-black'>
                    {activeTab === 'dashboard' && <Dashboard setActiveTab={setActiveTab} />}
                    {activeTab === 'users' && <UsersList />}
                    {activeTab === 'orders' && <OrdersList />}
                    {activeTab === 'products' && <ProductsManager />}
                    {activeTab === 'analytics' && <Analytics />}
                    {activeTab === 'settings' && <OwnerSettings />}
                </div>
            </div>
        </>
    );
};

export default OwnerProfile;

const Sidebar = ({ handleLogout, setActiveTab, activeTab }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState('dashboard');
    const [logOut, setLogOut] = useState(false);

    const sidebarItems = [
        { icon: <Home size={24} />, text: 'Dashboard', id: 'dashboard' },
        { icon: <ShoppingCart size={24} />, text: 'Orders', id: 'orders' },
        { icon: <PackageSearch size={24} />, text: 'Products', id: 'products' },
        { icon: <UserRoundCog size={24} />, text: 'Users', id: 'users' },
        { icon: <LineChart size={24} />, text: 'Analytics', id: 'analytics' },
        { icon: <Cog size={24} />, text: 'Settings', id: 'settings' },
    ];

    const handleTabChange = (tabId) => {
        setActive(tabId);
        setActiveTab(tabId);
    };

    return (
        <motion.div
            className='fixed left-4 top-6.5 h-[93vh] bg-[#323441] z-20 flex px-2 flex-col items-center justify-between rounded-xl'
            initial={{ width: '5%' }}
            animate={{ width: isExpanded ? '16%' : '4.6%' }}
            transition={{ duration: 0.3, ease: [0.6, 0.05, 0.01, 0.9] }}
            onHoverStart={() => setIsExpanded(true)}
            onHoverEnd={() => setIsExpanded(false)}
        >
            <div className='flex flex-col items-center gap-12 w-full pt-5'>
                <motion.h1
                    className={`text-3xl font-semibold text-white ${isExpanded ? 'border-0' : 'border-2'}  font-[Marcellus] py-1 px-3 flex items-center justify-center border-white rounded-full cursor-pointer transition-all duration-100 ease-in-out`}
                    whileHover={{ scale: 1.05 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
                >
                    A <motion.span
                        animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? 'auto' : "0px" }}
                        transition={{ duration: isExpanded ? 0.4 : 0.1, delay: isExpanded ? 0.3 : 0, ease: "easeInOut" }}
                    >ceOne.</motion.span>
                </motion.h1>

                <div className='text-white flex flex-col items-center gap-2 w-full'>
                    {sidebarItems.map((item, index) => (
                        <motion.div
                            key={item.id}
                            className={`flex items-center rounded-lg w-full pl-4 cursor-pointer py-3 ${activeTab === item.id ? 'bg-[#ffbb00] text-black' : 'hover:bg-[rgba(255,255,255,0.2)]'}`}
                            onClick={() => handleTabChange(item.id)}
                            whileTap={{ scale: 0.96 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 15 }}
                        >
                            <div className={`flex `}>
                                {item.icon}
                            </div>
                            <motion.span
                                className={`ml-4 font-medium whitespace-nowrap overflow-hidden`}
                                animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? '50%' : 0 }}
                                transition={{ duration: isExpanded ? 0.4 : 0.1, delay: isExpanded ? index * 0.08 : 0, ease: "easeInOut" }}
                            >
                                {item.text}
                            </motion.span>
                        </motion.div>
                    ))}
                </div>
            </div>

            <motion.button
                onClick={() => { setLogOut(true) }}
                className={`text-red-600 bg-[#f8f8f8] p-3 pr-0 w-full rounded-lg mb-2 flex items-center cursor-pointer`}
                whileTap={{ scale: 0.96 }}
                transition={{ type: 'spring', stiffness: 300, damping: 15 }}
            >
                <LogOut size={27} />
                <motion.span
                    className={`ml-2 text-lg font-medium whitespace-nowrap overflow-hidden w-full`}
                    animate={{ opacity: isExpanded ? 1 : 0, width: isExpanded ? '28%' : 0 }}
                    transition={{ duration: isExpanded ? 0.4 : 0.1, delay: isExpanded ? 0.2 : 0, ease: "easeInOut" }}
                >
                    Logout
                </motion.span>
            </motion.button>

            <LogoutModal isOpen={logOut} onClose={() => { setLogOut(false) }} onConfirm={handleLogout} />
        </motion.div >
    );
};

const LogoutModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <motion.div
                        key="logout-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Logout</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to log out?</p>
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
                                Yes, Logout
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};