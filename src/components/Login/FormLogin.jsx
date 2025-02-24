/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { loginSchema } from "../../utils/Validation";
import useDelayedNavigation from './../../utils/useDelayedNavigation';
import { useAuth } from "../../utils/AuthContext";
import Transition from '../../Transition';
import { loginUser } from './../../utils/AuthService';
import "../../stylesheets/Login.css"

const FormLogin = () => {
    const [isTyping, setIsTyping] = useState(false);
    const [error, setError] = useState("");
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { LoginUser } = useAuth();

    const { register, handleSubmit, formState: { errors } } = useForm({
        resolver: yupResolver(loginSchema),
    });

    const onSubmit = async (data) => {
        setError("");

        const result = await loginUser(data);

        if (result.success) {
            LoginUser(result.user);
            handleDelayNavigation("Home");
        } else {
            setError(result.message);
        }
    };

    return (
        <>
            <Transition animate={animate} />

            <div className='h-screen z-50 w-screen overflow-hidden md:bg-transparent bg-[#59c0ec]'>
                <div>
                    <div className='w-screen h-screen overflow-hidden fixed hidden md:flex items-center justify-between bg-[#fff] z-[-1] user-select-none'>
                        <div className='max-w-1/2'></div>
                        <div className='relative w-1/2 h-full flex justify-end items-end'>
                            <img className='min-w-[47vw] z-0' src="LS-Right.svg" alt="" />
                            <div className='w-[25vw] h-[60vh] bg-[#d4d4d45d] rounded-3xl absolute z-50 top-[50%] right-[45%] translate-x-1/2 -translate-y-1/2'></div>
                        </div>
                    </div>
                </div>

                <div className='md:w-1/2 flex items-center justify-center h-screen overflow-hidden'>
                    {/* <Link to="/register"> */}
                    <button id='Signup-Instead-Login-Route'
                        className='inline-block text-nowrap md:px-7 md:py-4 cursor-pointer bg-[#1f1f1f] md:bg-transparent text-white text-xl font-bold rounded-full md:min-w-[13vw] absolute md:right-10 right-2 top-6 md:top-10 font-[poppins] py-3 px-5'
                        onClick={() => handleDelayNavigation("register")}
                    >
                        Signup Instead
                    </button>
                    {/* </Link> */}

                    <div className='md:px-17 md:py-20 px-6 py-14 flex items-center justify-center bg-[#fff] rounded-4xl'>
                        <div className='flex flex-col gap-8 md:gap-18'>
                            <div className='flex flex-col'>
                                <h1 className='md:text-[4.7vw] text-4xl uppercase font-[poppins] text-black font-bold text-center'>login</h1>
                                <h5 className='md:text-[0.9vw] text-sm md:-mt-3 capitalize font-[poppins] text-black text-center'>login to start buying</h5>
                            </div>
                            <div>
                                <form onSubmit={handleSubmit(onSubmit)} className='flex flex-col gap-7 items-center text-black'>
                                    <div className='flex flex-col gap-3 md:gap-5 items-center text-black'>
                                        <input
                                            className='email-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="email"
                                            placeholder='Email'
                                            name='email'
                                            {...register("email")}
                                            required
                                            autoComplete="off"
                                        />
                                        <p id='PassWarn' className='text-red-500 md:tracking-normal tracking-tighter text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw] max-w-[80%]'>
                                            {errors.email?.message}
                                        </p>

                                        <input
                                            id='InputLoginPassword'
                                            className='password-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="password"
                                            placeholder='Password'
                                            name='password'
                                            {...register("password")}
                                            onFocus={() => setIsTyping(true)}
                                            onBlur={(e) => setIsTyping(false)}
                                            required
                                        />
                                        <p id='PassWarn' className='text-red-500 md:tracking-normal tracking-tighter text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw] max-w-[80%]'>
                                            {errors.password?.message}
                                        </p>

                                        {isTyping && (
                                            <p id='PassWarn' className='text-red-500 md:tracking-normal tracking-tighter text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw] max-w-[80%]'>
                                                The password should contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character!
                                            </p>
                                        )}
                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                    </div>
                                    <input
                                        className='inline-block px-7 py-3 cursor-pointer text-white text-xl font-bold bg-gradient-to-r from-[#9181F4] to-[#5038ED] rounded-full min-w-[13vw]'
                                        type="submit"
                                        value="Login Now"
                                    />
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

// const WrappedLogin = Transition(FormLogin)
export default FormLogin;
