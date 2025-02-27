/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
// components/Sidebar.jsx
import React, { useEffect, useState } from 'react';
import { User, Package, Heart, ShoppingCart, Key, LogOut, Home, RefreshCcw } from 'lucide-react';
import { getUserDetails } from '../../utils/UserService';

const Sidebar = ({ activeComponent, setActiveComponent, onLogout }) => {
    // Navigation items
    const navItems = [
        { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
        { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
        { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={20} /> },
        { id: 'cart', label: 'My Cart', icon: <ShoppingCart size={20} /> },
        { id: 'Home', label: 'Go To Home', icon: <Home size={20} /> },
        { id: 'password', label: 'Reset Password', icon: <Key size={20} /> },
    ];
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);

    const refreshUser = async () => {
        try {
            const response = await getUserDetails();
            console.log(response);
            if (response.success) {
                setUser(response.user);
            } else {
                console.error("Failed to refresh User:", response.message);
            }
        } catch (error) {
            console.error("Error refreshing User:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        refreshUser();
    }, []);

    return (
        <div className="bg-white h-full rounded-lg shadow-md p-6 relative">

            <div
                onClick={async () => { await refreshUser() }}
                className='absolute top-3 right-5 cursor-pointer'
            >
                <RefreshCcw size={24} />
            </div>

            {/* User profile summary */}
            <div className="flex flex-col items-center mb-8">
                <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#1f1f1f]">
                    <img
                        src={user?.picture || "PFplaceholder.jpg"}
                        alt="Profile"
                        className="w-full h-full object-cover"
                    />
                </div>
                <h3 className="font-bold text-lg">{user?.fullName}</h3>
                <p className="text-gray-600 text-sm">{user?.email}</p>
            </div>

            {/* Navigation */}
            <div className="space-y-2">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        onClick={() => setActiveComponent(item.id)}
                        className={`w-full flex items-center px-4 py-3 cursor-pointer rounded-lg transition-colors ${activeComponent === item.id
                            ? 'bg-[#1f1f1f] text-[#ffbb00] font-medium'
                            : 'hover:bg-[#eee]'
                            }`}
                    >
                        <span className="mr-3">{item.icon}</span>
                        <span>{item.label}</span>
                    </button>
                ))}

                <button
                    onClick={onLogout}
                    className="w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 mt-8 cursor-pointer"
                >
                    <span className="mr-3"><LogOut size={20} /></span>
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );
};

export default Sidebar;