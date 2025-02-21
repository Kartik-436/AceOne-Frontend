/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import useDelayedNavigation from '../utils/useDelayedNavigation';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import Transition from '../Transition';
import AfterSignedInNavBar from './../components/NavBars/AfterSignedInNavBar';
import axios from 'axios';
import BarLoader from './../components/Loaders/CustomLoader1';
import { motion } from 'framer-motion';
import { AnimatePresence } from 'motion/react';
import Footer from './../components/Footer/Footer';

const Store = (props) => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [isLoggedIn, setisLoggedIn] = useState(null);

    useEffect(() => {
        axios.get('/api/user/profile', { withCredentials: true })
            .then(response => {
                const user = response.data;
                if (response.success) {
                    setisLoggedIn(true);
                } else setisLoggedIn(false);
            })
            .catch(() => setisLoggedIn(false)); // Make it Null in final
    }, []);

    if (isLoggedIn === null) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <AnimatePresence mode='wait'>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.6, ease: "easeInOut" }}
                    >
                        <Transition animate={animate} disableEntry={true} />

                        {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}
                        <div className='min-h-screen w-full relative text-white mt-[10.6svh] bg-[#fbffef]'>
                            <div className=''>
                                <h1 className='text-black'>This is store Route</h1>
                            </div>
                        </div>
                        <div className='z-20'>
                            <Footer />
                        </div>
                    </motion.div>
                </AnimatePresence>
            </React.Fragment>
        )
    }
}

export default Store
