/* eslint-disable no-unused-vars */
import React, { useRef } from "react";
import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence } from "motion/react";
import { ToastContainer } from "react-toastify";

// Page Imports
import OwnerLogin from "./pages/OwnerLogin";
import LogIn from "./pages/LogIn";
import SignUp from "./pages/SignUp";
import Profile from "./pages/Profile";
import Home from "./pages/Home";
import Store from "./pages/Store";
import About from "./pages/About";
import Wishlist from "./pages/Wishlist";
import Cart from "./pages/Cart";
import OwnerProfile from "./pages/OwnerProfile";
import ForgotPassword from "./components/Login/ForgotPassword";
import ProductPage from "./pages/ProductPage";

// Context Providers
import { CartProvider } from "./utils/CartContext";
import { AuthProvider } from "./utils/AuthContext";

function AnimatedRoutes() {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<Navigate to="/Home" replace />} />
                <Route path="/Home" element={<Home />} />
                <Route path="/About" element={<About />} />
                <Route path="/ForgotPassword" element={<ForgotPassword />} />

                <Route path="/register" element={<SignUp />} />
                <Route path="/login" element={<LogIn />} />
                <Route path="/ownerLogin" element={<OwnerLogin />} />
                <Route path="/ownerProfile" element={<OwnerProfile />} />

                <Route path="/store" element={<Store />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/wishlist" element={<Wishlist />} />

                <Route path="/product/:id" element={<ProductPage />} />
                <Route path="/userProfile" element={<Profile />} />
            </Routes>
        </AnimatePresence>
    );
}

const CompleteApp = () => {
    return (
        <AuthProvider>
            <CartProvider>
                <ToastContainer
                    position="top-right"
                    autoClose={3000}
                    limit={3}
                    newestOnTop={true}
                    closeOnClick
                    pauseOnHover
                />
                <AnimatedRoutes />
            </CartProvider>
        </AuthProvider>
    );
};

const App = () => {
    return (
        <div className='w-full overflow-hidden h-full'>
            <CompleteApp />
        </div>
    );
};

export default App;