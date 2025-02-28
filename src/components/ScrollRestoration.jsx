import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const useScrollRestoration = () => {
    const location = useLocation();

    useEffect(() => {
        // Restore the scroll position for the current route
        const savedPosition = localStorage.getItem(`scroll-${location.pathname}`);
        if (savedPosition) {
            window.scrollTo(0, parseInt(savedPosition, 10));
        }

        // Save the scroll position before leaving the page
        const saveScrollPosition = () => {
            localStorage.setItem(`scroll-${location.pathname}`, window.scrollY);
        };

        window.addEventListener("beforeunload", saveScrollPosition);
        window.addEventListener("scroll", saveScrollPosition);

        return () => {
            window.removeEventListener("beforeunload", saveScrollPosition);
            window.removeEventListener("scroll", saveScrollPosition);
        };
    }, [location.pathname]); // Runs when the route changes
};

export default useScrollRestoration;
