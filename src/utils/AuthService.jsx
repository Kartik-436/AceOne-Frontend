import axios from "axios";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post("/api/user/register", userData, { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Registration failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post("/api/user/login", credentials, { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Login failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const loginOwner = async (credentials) => {
    try {
        const response = await axios.post("/api/owner/login", credentials, { withCredentials: true });

        if (response.data.success) {
            return { success: true, owner: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Login failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const logoutUser = async () => {
    try {
        const response = await axios.get("/api/user/logout", { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Logout failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const logoutOwner = async () => {
    try {
        const response = await axios.get("/api/owner/logout", { withCredentials: true });

        if (response.data.success) {
            return { success: true, owner: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Logout failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};