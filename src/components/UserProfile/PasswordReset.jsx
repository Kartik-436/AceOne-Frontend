/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { Eye, EyeOff, Check } from 'lucide-react';
import { resetPassword } from '../../utils/UserService';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { motion } from 'framer-motion';

const PasswordReset = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrent, setShowCurrent] = useState(false);
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [success, setSuccess] = useState(false);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState('');

    // Password validation
    const validatePassword = () => {
        const newErrors = {};

        if (!currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }

        if (!newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (newPassword.length < 8) {
            newErrors.newPassword = 'Password must be at least 8 characters';
        }

        if (newPassword !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validatePassword()) return;

        setLoading(true);
        setApiError('');
        setSuccess(false);

        try {
            const response = await resetPassword(null, currentPassword, newPassword);

            if (response.success) {
                setSuccess(true);
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                setApiError(response.message);
            }
        } catch (error) {
            setApiError('Failed to reset password.');
        } finally {
            setLoading(false);
        }
    };

    const getPasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) strength++;
        return strength;
    };

    const strength = getPasswordStrength(newPassword);
    const strengthClasses = [
        "w-1/6 bg-red-500",
        "w-2/6 bg-orange-500",
        "w-3/6 bg-yellow-500",
        "w-5/6 bg-blue-500",
        "w-full bg-green-500",
    ];

    const { animate, handleDelayNavigation } = useDelayedNavigation();

    return (
        <>
            <Transition />
            <div>
                <h2 className="text-2xl font-bold mb-6">Reset Password</h2>

                {success ? (
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                        className="bg-green-100 border border-green-200 text-green-800 rounded-lg p-4 flex items-center"
                    >
                        <Check size={20} className="mr-2" />
                        <span>Your password has been updated successfully!</span>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="max-w-md">
                        <motion.div
                            initial={{ opacity: 0, x: 100 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.35, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                            className="space-y-6"
                        >
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Current Password</label>
                                <div className="relative">
                                    <input
                                        type={showCurrent ? "text" : "password"}
                                        value={currentPassword}
                                        onChange={(e) => setCurrentPassword(e.target.value)}
                                        className={`w-full p-3 border ${errors.currentPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#ffbb00] focus:outline-none pr-10`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowCurrent(!showCurrent)}
                                    >
                                        {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.currentPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                                )}
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">New Password</label>
                                <div className="relative">
                                    <input
                                        type={showNew ? "text" : "password"}
                                        value={newPassword}
                                        onChange={(e) => setNewPassword(e.target.value)}
                                        className={`w-full p-3 border ${errors.newPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#ffbb00] focus:outline-none pr-10`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowNew(!showNew)}
                                    >
                                        {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.newPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                                )}

                                {/* Password strength indicator */}
                                {newPassword && (
                                    <div className="mt-2">
                                        <div className="h-2 mt-2 w-full bg-gray-200 rounded-md overflow-hidden">
                                            <div className={`h-full transition-all duration-300 ${strengthClasses[strength]}`}></div>
                                        </div>
                                        <p className="text-sm font-semibold mt-2">
                                            {["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength]}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {/* Confirm Password */}
                            <div>
                                <label className="block text-sm font-medium mb-1">Confirm New Password</label>
                                <div className="relative">
                                    <input
                                        type={showConfirm ? "text" : "password"}
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className={`w-full p-3 border ${errors.confirmPassword ? 'border-red-300' : 'border-gray-300'} rounded-lg focus:ring-2 focus:ring-[#ffbb00] focus:outline-none pr-10`}
                                    />
                                    <button
                                        type="button"
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                                        onClick={() => setShowConfirm(!showConfirm)}
                                    >
                                        {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                {errors.confirmPassword && (
                                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                                )}
                            </div>

                            {apiError && <p className="text-red-500 text-sm">{apiError}</p>}

                            <button
                                type="submit"
                                id='Shp-Now-Home-Start'
                                className="w-full py-3 bg-[#ffbb00] text-[#1f1f1f] rounded-lg transition-colors font-medium mt-4"
                                disabled={loading}
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </motion.div>
                    </form>
                )}
            </div>
        </>
    );
};

export default PasswordReset;
