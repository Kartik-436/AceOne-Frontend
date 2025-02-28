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
import { motion } from "framer-motion";
import { Home, ShoppingCart, PackageSearch, UserRoundCog, LineChart, LogOut } from "lucide-react";

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
                <Sidebar handleLogout={handleLogout} setActiveTab={setActiveTab} />

                {/* Main Content */}
                <div className='w-[92%] h-full bg-[#f0efe7] text-black'>
                    {activeTab === 'dashboard' && <Dashboard />}
                    {activeTab === 'users' && <UsersList />}
                    {activeTab === 'orders' && <OrdersList />}
                    {activeTab === 'products' && <ProductsManager />}
                    {activeTab === 'analytics' && <Analytics />}
                </div>
            </div>
        </>
    );
};

export default OwnerProfile;

const Sidebar = ({ handleLogout, setActiveTab }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [active, setActive] = useState('dashboard');

    const sidebarItems = [
        { icon: <Home size={24} />, text: 'Dashboard', id: 'dashboard' },
        { icon: <ShoppingCart size={24} />, text: 'Orders', id: 'orders' },
        { icon: <PackageSearch size={24} />, text: 'Products', id: 'products' },
        { icon: <UserRoundCog size={24} />, text: 'Users', id: 'users' },
        { icon: <LineChart size={24} />, text: 'Analytics', id: 'analytics' },
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
                            className={`flex items-center rounded-lg w-full pl-4 cursor-pointer py-3 ${active === item.id ? 'bg-[#ffbb00] text-black' : 'hover:bg-[rgba(255,255,255,0.2)]'}`}
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
                onClick={handleLogout}
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
        </motion.div>
    );
};
