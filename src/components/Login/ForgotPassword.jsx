/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react'
import Transition from './../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { forgotPassword, resetPassword, verifyResetToken } from '../../utils/UserService';
import { toast } from 'react-toastify';
import { resenVerificationOtp } from '../../utils/AuthService';
import { EyeClosed, EyeIcon } from 'lucide-react';

const ForgotPassword = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [emailSubmitted, setEmailSubmitted] = useState(false);
    const [isTokenVerified, setIsTokenVerified] = useState(false);
    const [userEmail, setUserEmail] = useState("");
    const [OTP, setOTP] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [password, setPassword] = useState("");

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
    };

    const VerifyToken = async (e) => {
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
    };

    const ResetPass = async (e) => {
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
    };

    const resendVerificationOtp = async () => {
        const response = await resenVerificationOtp();

        if (response.success) {
            toast.success("Verification code sent successfully!");
        } else {
            setError(response.message);
            toast.error(response.message);
        }
    };

    return (
        <>
            <Transition animate={animate} />

            <div className='h-screen z-50 w-screen overflow-hidden'>

                <div>
                    <div className='w-screen h-screen overflow-hidden fixed flex items-center justify-between bg-[#59c0ec] z-[-1] user-select-none'>
                        <img className='md:w-screen z-50 rotate-90' src="LS-Right.svg" alt="" />
                        <div className='max-w-1/2 md:block hidden' ></div>
                    </div>
                </div>

                <div className='w-screen h-screen items-center justify-center flex'>
                    <div className="bg-white rounded-2xl min-h-[47vh] w-[40vw] p-5 py-10 flex flex-col items-center justify-between">
                        <div>
                            <h1 className='w-full text-center text-4xl font-[poppins] font-medium'>Forgot Password !</h1>
                        </div>
                        <form className='w-full' onSubmit={isTokenVerified ? ResetPass : emailSubmitted ? VerifyToken : ForgotPass}>
                            <div className='flex flex-col items-center justify-around gap-6.5 w-full'>

                                {!isTokenVerified && (
                                    <div className='flex flex-col items-center justify-around'>
                                        {emailSubmitted && (
                                            <div className='flex flex-col gap-2 items-center'>
                                                <h1 className='text-sm font-light font-[poppins] tracking-tight'>
                                                    Please Enter the OTP you recieved on your entered Mail !
                                                </h1>
                                                <OTPInput onChangeOTP={(otp) => setOTP(otp)} />
                                                <div className='flex items-center justify-end w-full'>
                                                    <h1
                                                        onClick={resendVerificationOtp}
                                                        className='tracking-tight text-sm font-[roboto] capitalize px-6 cursor-pointer text-blue-400 hover:underline underline-offset-1'
                                                    >
                                                        Resend Verification code
                                                    </h1>
                                                </div>
                                            </div>
                                        )}
                                        {!emailSubmitted && (
                                            <div className='flex flex-col gap-2 items-start justify-center'>
                                                <h1 className='text-sm font-light font-[poppins] tracking-tight'>
                                                    Please Enter your registered email to change your password !
                                                </h1>
                                                <input
                                                    className='email-with-icon inline-block px-6 py-4 text-lg bg-[#021]/10 rounded-full font-semibold font-[nunito] outline-2 min-w-[30vw] '
                                                    type="email"
                                                    placeholder='Email'
                                                    name='email'
                                                    required
                                                    autoComplete="off"
                                                    value={userEmail}
                                                    onChange={(e) => { setUserEmail(e.target.value) }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                )}

                                {isTokenVerified && (
                                    <div className='flex flex-col gap-2 items-center'>
                                        <h1 className='text-sm font-light font-[poppins] tracking-tight'>
                                            Please set the new password !
                                        </h1>
                                        <div className='w-full relative'>
                                            <input
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
                                            />
                                            <button
                                                type="button"
                                                className="absolute inset-y-0 right-6 flex items-center text-gray-600 cursor-pointer"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? <EyeClosed /> : <EyeIcon />}
                                            </button>
                                        </div>
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
                                    </div>
                                )}
                                <div className={`w-full flex items-center justify-center px-50`}>
                                    <button
                                        type='submit'
                                        id="NavBarButtons"
                                        className="px-[100%] flex items-center justify-center py-2.5 bg-[#ffbb00] text-black rounded-2xl border-2 cursor-pointer active:scale-95 tracking-wide font-medium font-[poppins]"
                                    >
                                        SUBMIT
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ForgotPassword

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
