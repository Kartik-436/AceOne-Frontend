/* eslint-disable no-unused-vars */

import React, { useEffect, useRef, useState } from 'react';
import Lenis from '@studio-freight/lenis';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import Transition from '../Transition';
import AfterSignedInNavBar from './../components/NavBars/AfterSignedInNavBar';
import axios from 'axios';
import BarLoader from '../components/Loaders/CustomLoader1';
import "../stylesheets/HomePage.css";
import Page3 from './../components/Home-Pages/Page3';
import HalfHome from '../components/Home-Pages/HalfHome1';
import HalfHome2 from '../components/Home-Pages/HalfHome2';
import Footer from './../components/Footer/Footer';
import useAuthStatus from '../utils/IsLoggedInChecker';

const Home = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    useEffect(() => {

        const lenis = new Lenis({
            duration: 1.8,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            direction: 'vertical',
            gestureDirection: 'vertical',
            smooth: true,
            smoothTouch: true,
            touchMultiplier: 2,
        });

        if (window.gsap) {
            window.gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
        } else {

            function raf(time) {
                lenis.raf(time);
                requestAnimationFrame(raf);
            }
            requestAnimationFrame(raf);
        }


        lenis.on('scroll', ({ scroll, limit, velocity, direction, progress }) => {

        });

        return () => {
            lenis.destroy();
            if (window.gsap) {
                window.gsap.ticker.remove();
            }
        };
    }, []);

    const { isLoggedIn, loading } = useAuthStatus();

    if (loading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <Transition animate={animate} />
                {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}
                {/* Add a wrapper div with a data-scroll-container attribute */}
                <div data-scroll-container>
                    <HalfHome />
                    <div className='z-[10]'>
                        <Page3 />
                    </div>
                    <HalfHome2 />
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}

export default Home;