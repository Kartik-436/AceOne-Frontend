/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import Transition from "../Transition";
import useDelayedNavigation from "../utils/useDelayedNavigation";
import axios from "axios";
import BarLoader from "../components/Loaders/CustomLoader1";
import useAuthStatus from "../utils/IsLoggedInChecker";
import { useAuth } from "../utils/AuthContext";
import { logoutUser } from "../utils/AuthService";

const Profile = () => {
    const { logout } = useAuth();
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { isLoggedIn, loading } = useAuthStatus();
    const [error, setError] = useState("");

    const handleLogout = async () => {
        setError("");

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

                <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                    <h1 className="text-3xl font-bold text-black mb-6">This is User Profile</h1>
                    <button
                        onClick={handleLogout}
                        className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                    >
                        Logout
                    </button>
                </div>
            </>
        );
    }
};

export default Profile;
