import axios from "axios";

export const getUserOrders = async () => {
    try {
        const response = await axios.get(`/api/user/orders`, {
            withCredentials: true,
        });
        return response.data.success
            ? { success: true, orders: response.data.data }
            : {
                success: false,
                message: response.data.message || "Failed to fetch orders.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const placeOrder = async (orderData) => {
    try {
        const response = await axios.post(`/api/user/order/place`, orderData, {
            withCredentials: true,
        });
        return response.data.success
            ? { success: true, order: response.data.data }
            : {
                success: false,
                message: response.data.message || "Failed to place order.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const cancelOrder = async (orderId) => {
    try {
        const response = await axios.post(
            `/api/user/order/cancel`,
            { orderId },
            { withCredentials: true }
        );
        return response.data.success
            ? { success: true, message: "Order canceled successfully." }
            : {
                success: false,
                message: response.data.message || "Failed to cancel order.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const getWishlist = async () => {
    try {
        const response = await axios.get(`/api/user/wishlist`, {
            withCredentials: true,
        });
        return response.data.success
            ? { success: true, wishlist: response.data.data }
            : {
                success: false,
                message: response.data.message || "Failed to fetch wishlist.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const addToWishlist = async (productID) => {
    try {
        const response = await axios.post(
            `/api/user/wishlist/add`,
            { productID },
            { withCredentials: true }
        );
        return response.data.success
            ? { success: true, message: "Product added to wishlist." }
            : {
                success: false,
                message:
                    response.data.message || "Failed to add product to wishlist.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const removeFromWishlist = async (productID) => {
    try {
        const response = await axios.post(`/api/user/wishlist/remove`, { productID }, { withCredentials: true });

        return response.data.success
            ? { success: true, message: "Product removed from wishlist." }
            : {
                success: false,
                message: response.data.message || "Failed to remove product from wishlist.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};


export const updateUserProfile = async (profileData) => {
    try {
        const response = await axios.put(`/api/user/profile`, profileData, {
            withCredentials: true,
        });
        return response.data.success
            ? { success: true, message: "Profile updated successfully.", updatedUser: response.data.data }
            : {
                success: false,
                message: response.data.message || "Failed to update profile.",
            };
    } catch (err) {
        return {
            success: false,
            message: console.error("Axios Error:", err.response?.data || err.message),
        };
    }
};

export const updateProfilePicture = async (formData) => {
    try {
        const response = await axios.put(`/api/user/profile/picture`, formData, {
            withCredentials: true,
            headers: { "Content-Type": "multipart/form-data" },
        });
        return response.data.success
            ? { success: true, message: "Profile picture updated successfully.", ProfilePicture: response.data.data }
            : {
                success: false,
                message: response.data.message || "Failed to update profile picture.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const resetPassword = async (token, oldPassword, newPassword) => {
    try {
        const response = await axios.put(`/api/user/reset-password`, { oldPassword, newPassword }, { withCredentials: true });
        return response.data.success
            ? { success: true, message: "Password reset successfully." }
            : {
                success: false,
                message: response.data.message || "Failed to reset password.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong.",
        };
    }
};

export const getUserDetails = async () => {
    try {
        const response = await axios.get("/api/user/profile", { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch user details." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};
