import axios from "axios";

export const registerUser = async (userData) => {
    try {
        const response = await axios.post("https://aceone-backend-wd1f.onrender.com/user/register", userData, { withCredentials: true });

        if (response.data.success) {
            return { success: true, email: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Registration failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const verifyRegisteredUser = async (OTP_Email) => {
    try {
        const response = await axios.post("https://aceone-backend-wd1f.onrender.com/user/verify-email", { OTP_Email }, { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Registration failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const resenVerificationOtp = async (email) => {
    try {
        const response = await axios.post("https://aceone-backend-wd1f.onrender.com/user/resend-verification", email, { withCredentials: true });

        if (response.data.success) {
            return { success: true, message: response.data.message };
        } else {
            return { success: false, message: response.data.message || "Registration failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post("https://aceone-backend-wd1f.onrender.com/user/login", credentials, { withCredentials: true });

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
        const response = await axios.post("https://aceone-backend-wd1f.onrender.com/owner/login", credentials, { withCredentials: true });

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
        const response = await axios.get("https://aceone-backend-wd1f.onrender.com/user/logout", {
            withCredentials: true, headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            }
        });

        if (response.data.success) {

            if (caches && caches.keys) {
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map(key => caches.delete(key)));
            }

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
        const response = await axios.get("https://aceone-backend-wd1f.onrender.com/owner/logout", {
            withCredentials: true, headers: {
                'Cache-Control': 'no-cache, no-store',
                'Pragma': 'no-cache'
            }
        });

        if (response.data.success) {

            if (caches && caches.keys) {
                const cacheKeys = await caches.keys();
                await Promise.all(cacheKeys.map(key => caches.delete(key)));
            }

            return { success: true, owner: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Logout failed." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong. Try again." };
    }
};