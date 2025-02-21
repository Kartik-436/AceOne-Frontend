/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useRef, useEffect, useState } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { gsap } from "gsap";
import OwnerLogin from "./pages/OwnerLogin";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import { AnimatePresence } from "motion/react";
import Home from "./pages/Home";
import Store from "./pages/Store";
import About from "./pages/About";

const PageTransition = ({ children }) => {
    const containerRef = useRef(null);
    const location = useLocation(); // Track route changes

    useEffect(() => {
        const tl = gsap.timeline();
        tl.set(containerRef.current, { opacity: 0 });

        tl.to(containerRef.current, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: "power1.inOut",
        });

    }, [location.pathname]); // Runs when the route changes

    return <div ref={containerRef}>{children}</div>;
};

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/Home" replace="true" />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/ownerLogin" element={<OwnerLogin />} />
                <Route path="/store" element={<Store />} />
                <Route path="/userProfile" element={<Profile />} />
            </Routes>
        </AnimatePresence>
    );
}

const App = () => {
    return (
        <AnimatedRoutes />
    );
};

export default App;
