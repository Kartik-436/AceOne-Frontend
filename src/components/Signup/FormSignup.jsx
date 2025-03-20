/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../utils/Validation";
import useDelayedNavigation from './../../utils/useDelayedNavigation';
import { useAuth } from "../../utils/AuthContext";
import Transition from '../../Transition';
import { registerUser, resenVerificationOtp, verifyRegisteredUser } from './../../utils/AuthService';
import "../../stylesheets/Signup.css"
import { toast } from 'react-toastify';
import { AnimatePresence, motion } from 'framer-motion';
import { EyeClosed, EyeIcon } from 'lucide-react';
import BarLoader from './../Loaders/CustomLoader1';

const FormSignup = () => {
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { LoginUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);
    const [isVerifying, setIsVerifying] = useState(false);
    const [userEmail, setUserEmail] = useState(null);
    const [OTP, setOTP] = useState("");
    const [VerificationModalOpen, setVerificationModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const strengthClasses = ["bg-red-500 w-1/5", "bg-orange-500 w-2/5", "bg-yellow-500 w-3/5", "bg-green-500 w-4/5", "bg-blue-500 w-full"];

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        setIsLoading(true)
        setError("");

        const result = await registerUser(data);

        if (result.success) {
            toast.success("Please verify your registered email!");
            setIsVerifying(true);
            setUserEmail(result.email);
            setVerificationModalOpen(true);
        } else {
            setError(result.message);
        }

        setIsLoading(false)
    };

    const onVerification = async () => {
        setIsLoading(true);

        if (!OTP) {
            toast.error("Please enter OTP!");
            return;
        }

        setError("");

        const result = await verifyRegisteredUser({ email: userEmail, otp: OTP });

        if (result.success) {
            LoginUser(result.user);
            setIsVerifying(false);
            toast.success("User Logged In Successfully!");
            setVerificationModalOpen(false);
            handleDelayNavigation("Home");
        } else {
            setError(result.message);
            toast.error(result.message);
        }

        setIsLoading(false);
    };

    const resendVerificationOtp = async () => {
        setIsLoading(true)

        const message = await resenVerificationOtp();

        if (message.success) {
            toast.success("Verification code sent succesfully !")
        } else {
            setError(message.message);
            toast.error(message.message);
        }

        setIsLoading(false);
    }

    const evaluateStrength = (value) => {
        let score = 0;
        if (value.length >= 8) score++;
        if (/[A-Z]/.test(value)) score++;
        if (/[a-z]/.test(value)) score++;
        if (/[0-9]/.test(value)) score++;
        if (/[^A-Za-z0-9]/.test(value)) score++;
        setStrength(score);
    };

    return (
        <>
            <Transition animate={animate} />
            {isLoading && (
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 backdrop-blur-xs -translate-y-1/2 z-20'>
                    <BarLoader />
                </div>
            )}
            <div className={`h-screen z-50 w-screen overflow-hidden ${isLoading ? "blur-xs cursor-not-allowed" : "blur-none"}`}>
                <div>
                    <div className='w-screen h-screen overflow-hidden fixed flex items-center justify-between bg-[#59c0ec] z-[-1] user-select-none'>
                        <img className='md:w-screen z-50 rotate-90' src="LS-Right.svg" alt="" />
                        <div className='max-w-1/2 md:block hidden' ></div>
                    </div>
                </div>

                <div className='w-screen flex items-center justify-center h-screen overflow-hidden'>
                    {/* <Link to="/login"> */}
                    <button
                        id='Login-Instead-SignUp-Route'
                        disabled={isLoading}
                        className='inline-block text-nowrap md:px-7 md:py-4 cursor-pointer bg-[#1f1f1f] md:bg-transparent text-white text-xl font-bold rounded-full md:min-w-[13vw] absolute md:right-10 right-2 top-6 md:top-10 font-[poppins] py-3 px-5'
                        onClick={() => handleDelayNavigation("login")}
                    >
                        Login Instead
                    </button>
                    {/* </Link> */}
                    <div className='md:px-17 md:py-7 px-11 py-7 md:max-w-[37vw] flex items-center justify-center bg-[#fff] rounded-4xl'>
                        <div className='flex flex-col gap-5 md:gap-12'>
                            <div className='flex flex-col'>
                                <h1 className='md:text-[4.7vw] text-3xl uppercase font-[poppins] text-black font-bold text-center'>Sign Up</h1>
                                <h5 className='md:text-[0.9vw] text-sm md:-mt-3 capitalize font-[poppins] text-black text-center'>Register to start buying</h5>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-3 items-center text-black'>
                                    <div className='flex flex-col gap-2 md:gap-3 items-center text-black'>
                                        <input
                                            className='fullName-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="text"
                                            placeholder='Full Name'
                                            name='fullName'
                                            {...register("fullName")}
                                            required
                                            autoComplete="off"
                                        />
                                        <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{errors.fullName?.message}</p>

                                        <input
                                            className='email-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="email"
                                            placeholder='Email'
                                            name='email'
                                            {...register("email")}
                                            required
                                            autoComplete="off"
                                        />
                                        <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{errors.email?.message}</p>

                                        <div className='w-full relative'>
                                            <input
                                                id='InputLoginPassword'
                                                className='password-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                                type={showPassword ? "text" : "password"}
                                                placeholder='Password'
                                                name='password'
                                                {...register("password")}
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
                                        <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{errors.password?.message}</p>

                                        <input
                                            className='contact-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type='tel'
                                            placeholder='Mobile Number'
                                            name='contact'
                                            pattern='[0-9]{10}'
                                            maxLength={10}
                                            {...register("contact")}
                                            required
                                            autoComplete="off"
                                        />
                                        <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{errors.contact?.message}</p>

                                        <input
                                            className='dateOfBirth-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none md:min-w-[30vw] w-full'
                                            type='date'
                                            placeholder='Date Of Birth'
                                            name='dateOfBirth'
                                            {...register("dateOfBirth")}
                                            required
                                            autoComplete="off"
                                        />
                                        <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{errors.dateOfBirth?.message}</p>

                                        {error && <p className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>{error}</p>}
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className={`bg-gradient-to-r from-[#9181F4] to-[#5038ED] border border-white overflow-hidden relative px-7 py-3 cursor-pointer text-white text-xl font-bold rounded-full min-w-[13vw] hover:brightness-110 active:opacity-75 active:scale-90 outline-none duration-500 group
                                            ${isLoading ? "cursor-not-allowed" : ""}`}
                                        >
                                            <span
                                                className="bg-white shadow-white absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(255,255,255,0.3)] cursor-pointer">
                                            </span>
                                            {isLoading ? "Loading..." : "Register Now"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>

                <VerificationModal
                    isOpen={VerificationModalOpen}
                    onClose={() => setVerificationModalOpen(false)}
                    onConfirm={onVerification}
                    setOTP={setOTP}
                    resendVerificationOtp={resendVerificationOtp}
                    isLoading={isLoading}
                />
            </div>
        </>
    );
};

export default FormSignup;

const VerificationModal = ({ isOpen, onClose, onConfirm, setOTP, resendVerificationOtp, isLoading }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.3, y: 400 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.2, y: 800 }}
                    transition={{ duration: 0.3, ease: "backOut" }}
                    style={{ willChange: "transform", translateZ: 0 }}
                    className="fixed inset-0 w-full h-full flex items-center justify-center backdrop-blur-xs bg-[#11111105] transition-all duration-150 z-20"
                >
                    <div className="bg-white border-2 rounded-xl h-fit w-fit md:h-[45vh] md:w-[40vw] flex items-center justify-between flex-col p-5 py-10 relative">

                        <button
                            onClick={onClose}
                            disabled={isLoading}
                            className="text-black hover:text-[#ffbb00] transition-colors cursor-pointer absolute right-8 top-5"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="22" y1="6" x2="6" y2="22"></line>
                                <line x1="6" y1="6" x2="22" y2="22"></line>
                            </svg>
                        </button>

                        <h2 className="text-3xl font-semibold text-center font-[poppins]">Enter OTP</h2>
                        {isLoading
                            ?
                            (
                                <div className='absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2'>
                                    <BarLoader />
                                </div>
                            )
                            :
                            (
                                <div className='flex flex-col gap-7 items-center justify-center'>
                                    <div className='flex flex-col gap-2 items-center'>
                                        <h1 className='text-sm font-light font-[poppins] tracking-tight'>
                                            Please Enter the OTP you recieved on your entered Mail !
                                        </h1>
                                        <OTPInput onChangeOTP={(otp) => setOTP(otp)} />
                                        <div className='flex items-center justify-end w-full'>
                                            <h1
                                                onClick={resendVerificationOtp}
                                                className='tracking-tight text-sm font-[roboto] capitalize px-6 cursor-pointer text-blue-400 hover:underline underline-offset-2'
                                            >
                                                Resend Verification code
                                            </h1>
                                        </div>
                                    </div>
                                    <div className='w-full flex items-center justify-center px-24'>
                                        <button
                                            onClick={onConfirm}
                                            disabled={isLoading}
                                            id="NavBarButtons"
                                            className="px-[100%] flex items-center justify-center py-2.5 bg-[#ffbb00] text-black rounded-lg border-2 cursor-pointer active:scale-95 tracking-wide font-medium font-[poppins]"
                                        >
                                            VERIFY
                                        </button>
                                    </div>
                                </div>
                            )
                        }
                    </div >
                </motion.div >
            )}
        </AnimatePresence >
    );
};

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
