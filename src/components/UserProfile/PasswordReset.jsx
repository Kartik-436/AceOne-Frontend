/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import Transition from './../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { forgotPassword, resetPassword, verifyResetToken } from '../../utils/UserService';
import { toast } from 'react-toastify';
import { resenVerificationOtp } from '../../utils/AuthService';
import { EyeClosed, EyeIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import BarLoader from '../Loaders/CustomLoader1';

const PasswordReset = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [OTP, setOTP] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [password, setPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const strengthClasses = ["bg-red-500 w-1/5", "bg-orange-500 w-2/5", "bg-yellow-500 w-3/5", "bg-green-500 w-4/5", "bg-blue-500 w-full"];

    const evaluateStrength = (value) => {
        let score = -1;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        setStrength(score);
    };

    const ForgotPass = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (!userEmail.trim()) {
            toast.error("Please enter a valid email");
            return;
        }

        const response = await forgotPassword(userEmail);

        if (response.success) {
            toast.success(response.message);
            setEmailSubmitted(true);
        } else {
            setError(response.message);
            toast.error(response.message);
        }

        setIsLoading(false);
    };

    const VerifyToken = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (OTP.length !== 6) {
            toast.error("Please enter a valid 6-digit OTP");
            return;
        }

        const response = await verifyResetToken({ email: userEmail, otp: OTP });

        if (response.success) {
            toast.success(response.message);
            setIsTokenVerified(true);
        } else {
            setError(response.message);
            toast.error(response.message);
        }

        setIsLoading(false);
    };

    const ResetPass = async (e) => {
        setIsLoading(true);
        e.preventDefault();
        if (password.length < 8) {
            toast.error("Password must be at least 8 characters");
            return;
        }

        const response = await resetPassword({ email: userEmail, password });

        if (response.success) {
            toast.success(response.message);
            setEmailSubmitted(false);
            setIsTokenVerified(false);
            handleDelayNavigation("login");
        } else {
            setError(response.message);
            toast.error(response.message);
        }

        setIsLoading(false);
    };

    const resendVerificationOtp = async () => {
        setIsLoading(true);
        const response = await resenVerificationOtp();

        if (response.success) {
            toast.success("Verification code sent successfully!");
        } else {
            setError(response.message);
            toast.error(response.message);
        }

        setIsLoading(false);
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                duration: 0.5,
                staggerChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { y: 100, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { type: "spring", stiffness: 100 }
        }
    };

    const formVariants = {
        hidden: { scale: 0.7, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 100, delay: 0.3 }
        }
    };

    const buttonVariants = {
        hidden: { scale: 0.7, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { type: "spring", stiffness: 200, delay: 0.5 }
        },
        tap: { scale: 0.95 }
    };

    return (
        <>
            <Transition animate={animate} />
            {isLoading && (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20'>
                    <BarLoader />
                </div>
            )}

            <div className={`h-full z-50 w-full overflow-hidden ${isLoading ? "blur-xs pointer-events-none select-none cursor-not-allowed" : "blur-none pointer-events-auto"}`}>

                <motion.div
                    className='w-full h-full items-center justify-center flex'
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                >
                    <motion.div
                        className="bg-white rounded-2xl md:min-h-[47vh] w-full md:w-[40vw] p-2 md:p-5 py-5 md:py-10 flex flex-col items-center justify-between"
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ type: "spring", stiffness: 120, damping: 20 }}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
                        >
                            <h1 className='w-full text-center text-4xl md:text-6xl md:text-nowrap font-[poppins] font-medium'>Reset Your Password !</h1>
                        </motion.div>

                        <motion.form
                            className='w-full'
                            onSubmit={isTokenVerified ? ResetPass : emailSubmitted ? VerifyToken : ForgotPass}
                            variants={formVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            <motion.div
                                className='flex flex-col items-center h-full justify-around gap-12 md:gap-6.5 w-full'
                                variants={containerVariants}
                            >
                                {!isTokenVerified && (
                                    <motion.div
                                        className='flex flex-col items-center justify-around'
                                        variants={itemVariants}
                                    >
                                        {emailSubmitted && (
                                            <motion.div
                                                className='flex flex-col gap-2 items-center'
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 100, duration: 0.3 }}
                                            >
                                                <motion.h1
                                                    className='text-sm font-light font-[poppins] tracking-tight'
                                                >
                                                    Please Enter the OTP you recieved on your entered Mail !
                                                </motion.h1>
                                                <div>
                                                    <OTPInput onChangeOTP={(otp) => setOTP(otp)} />
                                                </div>
                                                <motion.div
                                                    className='flex items-center justify-end w-full'
                                                >
                                                    <motion.h1
                                                        onClick={resendVerificationOtp}
                                                        disabled={isLoading}
                                                        className='tracking-tight text-sm font-[roboto] capitalize px-6 cursor-pointer text-blue-400 hover:underline underline-offset-1'
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Resend Verification code
                                                    </motion.h1>
                                                </motion.div>
                                            </motion.div>
                                        )}

                                        {!emailSubmitted && (
                                            <motion.div
                                                className='flex flex-col w-full overflow-hidden gap-8 md:gap-2 items-start justify-center'
                                                initial={{ height: 0, opacity: 0 }}
                                                animate={{ height: "auto", opacity: 1 }}
                                                transition={{ type: "spring", stiffness: 100, duration: 0.3 }}
                                            >
                                                <motion.h1
                                                    className='text-sm font-light w-full font-[poppins] tracking-tight'
                                                >
                                                    Please Enter your registered email to change your password !
                                                </motion.h1>
                                                <motion.input
                                                    className='email-with-icon inline-block px-2 md:px-6 py-2 md:py-4 text-lg bg-[#021]/10 rounded-full font-semibold font-[nunito] outline-2 md:min-w-[30vw] w-full'
                                                    type="email"
                                                    placeholder='Email'
                                                    name='email'
                                                    required
                                                    autoComplete="off"
                                                    value={userEmail}
                                                    onChange={(e) => { setUserEmail(e.target.value) }}
                                                    variants={itemVariants}
                                                    whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                                                />
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}

                                {isTokenVerified && (
                                    <motion.div
                                        className='flex flex-col gap-2 items-center'
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        transition={{ type: "spring", stiffness: 100, duration: 0.3 }}
                                    >
                                        <motion.h1
                                            className='text-sm font-light font-[poppins] tracking-tight'
                                        >
                                            Please set the new password !
                                        </motion.h1>
                                        <motion.div
                                            className='w-full relative'
                                        >
                                            <motion.input
                                                id='InputLoginPassword'
                                                className='password-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                                type={showPassword ? "text" : "password"}
                                                placeholder='Password'
                                                name='password'
                                                value={password}
                                                onChange={(e) => {
                                                    setPassword(e.target.value);
                                                    evaluateStrength(e.target.value);
                                                }}
                                                required
                                                whileFocus={{ scale: 1.02, boxShadow: "0 0 0 2px rgba(0,0,0,0.1)" }}
                                            />
                                            <motion.button
                                                type="button"
                                                className="absolute inset-y-0 right-6 flex items-center text-gray-600 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                            >
                                                {showPassword ? <EyeClosed /> : <EyeIcon />}
                                            </motion.button>
                                        </motion.div>

                                        {password && (
                                            <div className='w-full'>
                                                <div className='h-1 bg-gray-200 rounded-full overflow-hidden'>
                                                    <div className={`h-full transition-all duration-300 ${strengthClasses[strength]}`}></div>
                                                </div>
                                                <p className='text-sm font-semibold text-end'>
                                                    {["Very Weak", "Weak", "Fair", "Strong", "Very Strong"][strength]}
                                                </p>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                <motion.div
                                    className={`w-full flex items-center justify-center md:px-50`}
                                    variants={itemVariants}
                                >
                                    <motion.button
                                        type='submit'
                                        disabled={isLoading}
                                        id="NavBarButtons"
                                        className="md:px-[100%] w-full flex items-center justify-center py-2.5 bg-[#ffbb00] text-black rounded-2xl border-2 cursor-pointer active:scale-95 tracking-wide font-medium font-[poppins]"
                                        variants={buttonVariants}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap="tap"
                                    >
                                        SUBMIT
                                    </motion.button>
                                </motion.div>
                            </motion.div>
                        </motion.form>
                    </motion.div>
                </motion.div>
            </div>
        </>
    )
}

export default PasswordReset

const OTPInput = ({ length = 6, onChangeOTP }) => {
    const [otp, setOtp] = useState(new Array(length).fill(""));
    const inputRefs = useRef([]);

    const handleChange = (e, index) => {
        const value = e.target.value;
        if (!/^\d*$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);
        onChangeOTP(newOtp.join(""));

        if (value && index < length - 1) {
            inputRefs.current[index + 1].focus();
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    return (
        <div className="flex space-x-2">
            {otp.map((digit, index) => (
                <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 text-center text-xl font-semibold border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
            ))}
        </div>
    );
};
