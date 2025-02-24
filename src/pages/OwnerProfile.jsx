/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../utils/AuthContext';
import { useNavigate } from 'react-router-dom';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import Transition from './../Transition';
import { logoutOwner } from '../utils/AuthService';

const OwnerProfile = () => {
    const { logout } = useAuth();
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [error, setError] = useState("");

    const handleLogout = async () => {
        setError("");

        const result = await logoutOwner();

        if (result.success) {
            logout();
            handleDelayNavigation('ownerLogin');
        };
    }

    return (
        <>
            <Transition animate={animate} />
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                <h1 className="text-3xl font-bold text-black mb-6">This is OwnerProfile</h1>
                <button
                    onClick={handleLogout}
                    className="px-6 py-3 bg-red-500 text-white font-semibold rounded-lg shadow-md hover:bg-red-600 transition duration-300"
                >
                    Logout
                </button>
            </div>
        </>
    );
};

export default OwnerProfile;
