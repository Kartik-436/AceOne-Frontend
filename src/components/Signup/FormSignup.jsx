/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import for navigation
import "../../stylesheets/Signup.css";
import { Link } from 'react-router-dom';
import Transition from '../../Transition';
import { motion } from 'motion/react'
import useDelayedNavigation from './../../utils/useDelayedNavigation';

const FormSignup = () => {
    const [isTyping, setIsTyping] = useState(false);
    const [formData, setFormData] = useState({ email: "", password: "", fullName: "", contact: Number, dateOfBirth: Date });
    const [error, setError] = useState("");
    const navigate = useNavigate(); // Initialize useNavigate

    const { animate, handleDelayNavigation } = useDelayedNavigation();

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        try {
            const response = await fetch("http://localhost:3000/user/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error("Failed to register. Please check your details.");
            }

            const data = await response.json();

            if (data.success) {
                navigate("/Home")
            } else {
                setError(data.message || "Invalid credentials!");
            }
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
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

                <div className='w-screen flex items-center justify-center h-screen overflow-hidden'>
                    {/* <Link to="/login"> */}
                    <button id='Login-Instead-SignUp-Route'
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
                                <form onSubmit={handleSubmit} className='flex flex-col gap-7 items-center text-black'>
                                    <div className='flex flex-col gap-2 md:gap-5 items-center text-black'>
                                        <input
                                            className='fullName-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="text"
                                            placeholder='Full Name'
                                            name='fullName'
                                            value={formData.fullName}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="off"
                                        />

                                        <input
                                            className='email-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="email"
                                            placeholder='Email'
                                            name='email'
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="off"
                                        />

                                        <input
                                            id='InputLoginPassword'
                                            className='password-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type="password"
                                            placeholder='Password'
                                            name='password'
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            onFocus={() => setIsTyping(true)}
                                            onBlur={(e) => !e.target.value && setIsTyping(false)}
                                            required
                                        />

                                        {isTyping && (
                                            <p id='PassWarn' className='text-red-500 tracking-tighter md:tracking-normal text-xs md:text-sm md:-mt-3 text-wrap md:max-w-[40vw]'>
                                                The password should contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character!
                                            </p>
                                        )}

                                        <input
                                            className='contact-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none min-w-[30vw]'
                                            type='tel'
                                            placeholder='Mobile Number'
                                            name='contact'
                                            pattern='[0-9]{10}'
                                            maxLength={10}
                                            value={formData.contact}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="off"
                                        />

                                        <input
                                            className='dateOfBirth-with-icon inline-block px-6 py-4 text-lg bg-[#F0EDFF] rounded-full font-semibold font-[nunito] outline-none md:min-w-[30vw] w-full'
                                            type='date'
                                            placeholder='Date Of Birth'
                                            name='dateOfBirth'
                                            value={formData.dateOfBirth}
                                            onChange={handleInputChange}
                                            required
                                            autoComplete="off"
                                        />

                                        {error && <p className="text-red-500 text-sm">{error}</p>}
                                    </div>
                                    <div className='flex items-center justify-center'>
                                        <input
                                            className='inline-block px-7 py-3 cursor-pointer text-white text-xl font-bold bg-gradient-to-r from-[#9181F4] to-[#5038ED] rounded-full min-w-[13vw]'
                                            type="submit"
                                            value="Register Now"
                                        />
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
