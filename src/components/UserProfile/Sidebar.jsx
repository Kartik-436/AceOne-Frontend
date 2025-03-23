/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { User, Package, Heart, ShoppingCart, Key, LogOut, Home, RefreshCcw, Menu, X } from 'lucide-react';
import { getUserDetails } from '../../utils/UserService';

const Sidebar = ({ activeComponent, setActiveComponent, onLogout }) => {
    // Navigation items
    const navItems = [
        { id: 'profile', label: 'My Profile', icon: <User size={20} /> },
        { id: 'orders', label: 'My Orders', icon: <Package size={20} /> },
        { id: 'wishlist', label: 'My Wishlist', icon: <Heart size={20} /> },
        { id: 'cart', label: 'My Cart', icon: <ShoppingCart size={20} /> },
        { id: 'password', label: 'Reset Password', icon: <Key size={20} /> },
        { id: 'Home', label: 'Go To Home', icon: <Home size={20} /> },
    ];
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const refreshUser = async () => {
        setLoading(true);
        try {
            const response = await getUserDetails();
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

    // Close mobile menu if window resizes to desktop size
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setIsMobileMenuOpen(false);
            }
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Prevent scrolling when mobile menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [isMobileMenuOpen]);

    const handleMenuItemClick = (id) => {
        setActiveComponent(id);
        setIsMobileMenuOpen(false);
    };

    const handleLogout = () => {
        setIsMobileMenuOpen(false);
        onLogout();
    };

    return (
        <>
            {/* Burger Menu Button (Mobile Only) */}
            <div className="md:hidden fixed top-4 left-4 z-20">
                <button
                    onClick={() => setIsMobileMenuOpen(true)}
                    className="p-2 rounded-full bg-white shadow-md"
                    aria-label="Open navigation menu"
                >
                    <Menu size={24} />
                </button>
            </div>

            {/* Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileMenuOpen(false)}
                ></div>
            )}

            {/* Sidebar (Desktop: Always visible, Mobile: Conditionally visible) */}
            <div className={`
                fixed md:static inset-y-0 left-0 
                w-64 md:w-auto z-40
                transform transition-transform duration-500 ease-in-out
                ${isMobileMenuOpen ? 'translate-x-0 block' : '-translate-x-full md:translate-x-0 hidden'}
            `}>
                <div className="bg-white h-full rounded-lg shadow-md p-6 relative overflow-y-auto">
                    {/* Close Button (Mobile Only) */}
                    <button
                        className="absolute top-3 right-3 md:hidden p-1 rounded-full hover:bg-gray-100"
                        onClick={() => setIsMobileMenuOpen(false)}
                        aria-label="Close navigation menu"
                    >
                        <X size={24} />
                    </button>

                    <div
                        onClick={async () => { await refreshUser() }}
                        className={`absolute top-3 right-12 md:right-5 cursor-pointer ${isMobileMenuOpen ? "hidden" : "block"}`}
                    >
                        <RefreshCcw size={24} />
                    </div>

                    {/* User profile summary */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-[#1f1f1f]">
                            <img
                                src={user?.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"}
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
                                onClick={() => handleMenuItemClick(item.id)}
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
                            onClick={handleLogout}
                            className="w-full flex items-center px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 mt-8 cursor-pointer"
                        >
                            <span className="mr-3"><LogOut size={20} /></span>
                            <span>Logout</span>
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;