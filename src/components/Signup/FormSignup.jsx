/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signupSchema } from "../../utils/Validation";
import useDelayedNavigation from './../../utils/useDelayedNavigation';
import { useAuth } from "../../utils/AuthContext";
import Transition from '../../Transition';
import { registerUser } from './../../utils/AuthService';
import "../../stylesheets/Signup.css"
import { toast } from 'react-toastify';

const FormSignup = () => {
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { LoginUser } = useAuth();
    const [showPassword, setShowPassword] = useState(false);
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState(0);

    const strengthClasses = ["bg-red-500 w-1/5", "bg-orange-500 w-2/5", "bg-yellow-500 w-3/5", "bg-green-500 w-4/5", "bg-blue-500 w-full"];

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(signupSchema),
    });

    const onSubmit = async (data) => {
        setError("");

        const result = await registerUser(data);

        if (result.success) {
            LoginUser(result.user);
            toast.success("User Registered Successfully !")
            handleDelayNavigation("Home");
        } else {
            setError(result.message);
        }
    };
    const evaluateStrength = (value) => {
        let score = -1;
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

            <div className='h-screen z-50 w-screen overflow-hidden'>

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

                                        <input
                                            id='InputLoginPassword'
                                            className='password-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="password"
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
                                            type='submit'
                                            className="bg-gradient-to-r from-[#9181F4] to-[#5038ED] border border-white overflow-hidden relative px-7 py-3 cursor-pointer text-white text-xl font-bold rounded-full min-w-[13vw] hover:brightness-110 active:opacity-75 active:scale-90 outline-none duration-500 group">
                                            <span
                                                className="bg-white shadow-white absolute -top-[150%] left-0 inline-flex w-80 h-[5px] rounded-md opacity-50 group-hover:top-[150%] duration-500 shadow-[0_0_10px_10px_rgba(255,255,255,0.3)] cursor-pointer"></span>
                                            Register Now
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// const WrappedSignup = Transition(FormSignup)
export default FormSignup;
