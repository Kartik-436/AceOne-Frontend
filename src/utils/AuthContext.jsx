/* eslint-disable react-refresh/only-export-components */
/* eslint-disable react/prop-types */
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [owner, setOwner] = useState(null);

    useEffect(() => {
        axios.get("https://aceone-backend.up.railway.app/user/profile", { withCredentials: true })
            .then(response => {
                if (response.data.success) setUser(response.data.user);
            })
            .catch(() => setUser(null));

        axios.get("https://aceone-backend.up.railway.app/owner/profile", { withCredentials: true })
            .then(response => {
                if (response.data.success) setOwner(response.data.owner);
            })
            .catch(() => setOwner(null));
    }, []);

    const LoginUser = (userData) => {
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));
    };

    const LoginOwner = (ownerData) => {
        setOwner(ownerData);
        localStorage.setItem("owner", JSON.stringify(ownerData));
    };

    const logout = async () => {
        setUser(null);
        setOwner(null);
        localStorage.removeItem("user");
        localStorage.removeItem("owner");
    };

    return (
        <AuthContext.Provider value={{ user, owner, LoginUser, LoginOwner, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
