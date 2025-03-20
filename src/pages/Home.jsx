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
import { getAllProducts, getBestSellingProducts, getDiscountedProducts } from './../utils/ProductService';
import { getOwnerProfile } from '../utils/OwnerService';

const Home = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const { isLoggedIn, loading: authLoading } = useAuthStatus();

    // Product states
    const [productData, setProductData] = useState({
        bestSelling: [],
        discounted: [],
        kidsProducts: [],
        mensProducts: [],
        womensProducts: []
    });
    const [productsLoading, setProductsLoading] = useState(true);
    const [productsError, setProductsError] = useState(null);

    // Fetch all product data
    useEffect(() => {
        const fetchAllProductData = async () => {
            try {
                setProductsLoading(true);

                // Fetch in parallel for better performance
                const [
                    bestSellingResult,
                    discountedResult,
                    kidsResult,
                    mensResult,
                    womensResult
                ] = await Promise.all([
                    getBestSellingProducts(),
                    getDiscountedProducts(),
                    getAllProducts({ category: 'kids' }),
                    getAllProducts({ category: 'mens' }),
                    getAllProducts({ category: 'womens' })
                ]);

                // Update state with fetched data
                setProductData({
                    bestSelling: bestSellingResult.success ? bestSellingResult.products : [],
                    discounted: discountedResult.success ? discountedResult.products : [],
                    kidsProducts: kidsResult.success ? kidsResult.products : [],
                    mensProducts: mensResult.success ? mensResult.products : [],
                    womensProducts: womensResult.success ? womensResult.products : []
                });
            } catch (err) {
                console.error("Error fetching products:", err);
                setProductsError("Failed to load product data");
            } finally {
                setProductsLoading(false);
            }
        };

        fetchAllProductData();

        const handleOwnerLoggedIn = async () => {
            try {
                const response = await getOwnerProfile();

                if (response.success && response.profile) {
                    handleDelayNavigation("ownerProfile")
                }
            } catch (error) {
                console.error("getting Owner Error: ", error)
            }
        }

        handleOwnerLoggedIn();
    }, []);

    // Setup smooth scrolling with Lenis
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
            // Scroll event handling
        });

        return () => {
            lenis.destroy();
            if (window.gsap) {
                window.gsap.ticker.remove();
            }
        };
    }, []);

    // Show loading state if either auth or products are loading
    if (authLoading || productsLoading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    }

    // Show error message if product fetching failed
    if (productsError) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center flex-col gap-4'>
                <p className="text-red-500">{productsError}</p>
                <button
                    className="px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => window.location.reload()}
                >
                    Retry
                </button>
            </div>
        );
    } else {
        return (
            <React.Fragment>
                <Transition animate={animate} />
                {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}
                {/* Add a wrapper div with a data-scroll-container attribute */}
                <div data-scroll-container className='relative'>
                    <HalfHome bestSelling={productData.bestSelling} Discounted={productData.discounted} />
                    <div className='z-[10]'>
                        <Page3 Kids={productData.kidsProducts} />
                    </div>
                    <HalfHome2 Kids={productData.kidsProducts} Men={productData.mensProducts} Women={productData.womensProducts} />
                    <Footer />
                </div>
            </React.Fragment>
        );
    }
}

export default Home;