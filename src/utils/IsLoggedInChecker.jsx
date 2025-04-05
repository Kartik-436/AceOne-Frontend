import { useEffect, useState } from "react";
import axios from "axios";

const useAuthStatus = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;

        const checkAuth = async () => {
            try {
                const response = await axios.get("https://aceone-backend-vx5o.onrender.com/user/profile", { withCredentials: true });

                if (isMounted) {
                    if (response.data.success) {
                        localStorage.setItem("user", JSON.stringify(response.data.data));
                        setIsLoggedIn(true);
                    } else {
                        setIsLoggedIn(false);
                    }
                }
            } catch (err) {
                if (isMounted) {
                    setIsLoggedIn(false);
                    setError(err.message);
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        checkAuth();

        return () => {
            isMounted = false;
        };
    }, []);

    return { isLoggedIn, loading, error };
};

export default useAuthStatus;
