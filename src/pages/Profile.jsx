/* eslint-disable react/prop-types */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-else-if */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Transition from "../Transition";
import useDelayedNavigation from "../utils/useDelayedNavigation";
import BarLoader from "../components/Loaders/CustomLoader1";
import useAuthStatus from "../utils/IsLoggedInChecker";
import { useAuth } from "../utils/AuthContext";
import { logoutUser } from "../utils/AuthService";
import Sidebar from "../components/UserProfile/Sidebar";
import ProfileInfo from "../components/UserProfile/ProfileInfo";
import Orders from "../components/UserProfile/Orders";
import PasswordReset from "../components/UserProfile/PasswordReset";
import { getUserDetails } from "../utils/UserService";
import { AnimatePresence, motion } from 'framer-motion';
import "../stylesheets/Profile.css"
import { getOwnerProfile } from "../utils/OwnerService";

const Profile = () => {
    const { logout } = useAuth();
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { isLoggedIn, loading } = useAuthStatus();
    const [error, setError] = useState("");

    const [activeComponent, setActiveComponent] = useState('profile');
    const [isLogoutModalOpen, setLogoutModalOpen] = useState(false);

    const [userData, setUserData] = useState({});

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

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await getUserDetails();
            if (response.success) {
                setUserData(response.user);
            }
            else if (response.success && response.user?.dateOfBirth) {
                setUserData((prev) => ({
                    ...prev,
                    dateOfBirth: new Date(response.user.dateOfBirth).toISOString(),
                }));
            }
            else {
                console.error(response.message);
            }
        };

        fetchUserData();
    }, []);

    useEffect(() => {
        if (activeComponent === "wishlist" || activeComponent === "cart" || activeComponent === "Home") {
            handleDelayNavigation(activeComponent);
        }
    }, [activeComponent]);

    // Render the appropriate component based on activeComponent state
    const renderContent = () => {
        switch (activeComponent) {
            case 'profile':
                return <ProfileInfo />;
            case 'orders':
                return <Orders />;
            case 'password':
                return <PasswordReset />;
            default:
                return <ProfileInfo />;
        }
    };

    useEffect(() => {
        const handleOwnerLoggedIn = async () => {
            try {
                const response = await getOwnerProfile();

                if (response.success && response.data) {
                    handleDelayNavigation("ownerProfile")
                }
            } catch (error) {
                console.error("getting Owner Error: ", error)
            }
        }

        handleOwnerLoggedIn();
    }, [])

    const handleLogout = async () => {
        setError("");
        setLogoutModalOpen(false);

        const result = await logoutUser();

        if (result.success) {
            logout();
            handleDelayNavigation('Home');
        };
    }

    if (!isLoggedIn || loading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <>
                <Transition animate={animate} />

                <div className="h-screen bg-[#fbffef] text-[#1f1f1f] relative">
                    <div className="container h-full mx-auto px-4 py-8">
                        <div className="flex h-full gap-0 md:gap-6">
                            {/* Sidebar */}
                            <div className="min-h-full md:w-1/4">
                                <Sidebar
                                    activeComponent={activeComponent}
                                    setActiveComponent={setActiveComponent}
                                    onLogout={() => setLogoutModalOpen(true)}
                                />
                            </div>

                            {/* Main Content */}
                            <div className="w-full md:w-3/4 bg-white rounded-lg shadow-md p-6">
                                {renderContent()}
                            </div>
                        </div>
                    </div>
                </div>

                <LogoutModal isOpen={isLogoutModalOpen} onClose={() => { setLogoutModalOpen(false) }} onConfirm={() => { handleLogout() }} />
            </>
        );
    }
};

export default Profile;
