import axios from "axios";

export const getUserOrders = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/user/orders`, {
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
        if (!orderData.modeOfPayment) {
            return {
                success: false,
                message: "Mode of payment is required.",
            };
        }

        if (!["Online", "Cash on Delivery"].includes(orderData.modeOfPayment)) {
            return {
                success: false,
                message: "Invalid payment mode. Choose 'Online' or 'Cash on Delivery'.",
            };
        }

        if (orderData.deliveryFee === undefined || typeof orderData.deliveryFee !== "number" || orderData.deliveryFee < 0) {
            return {
                success: false,
                message: "Invalid delivery fee.",
            };
        }

        const response = await axios.post(`http://localhost:3000/user/order`, orderData, {
            withCredentials: true,
        });

        return response.data.success
            ? {
                success: true,
                order: response.data.data.order,
                payment: response.data.data.payment || null
            }
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

export const verifyPayment = async (paymentData) => {
    try {
        if (!paymentData.razorpay_order_id || !paymentData.razorpay_payment_id || !paymentData.razorpay_signature || !paymentData.orderId) {
            return {
                success: false,
                message: "Missing payment verification parameters.",
            };
        }

        const response = await axios.post(
            `http://localhost:3000/user/order/verify-payment`,
            paymentData,
            { withCredentials: true }
        );

        return response.data.success
            ? {
                success: true,
                order: response.data.data.order,
                payment: response.data.data.payment
            }
            : {
                success: false,
                message: response.data.message || "Payment verification failed.",
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong with payment verification.",
        };
    }
};

export const cancelOrder = async (orderID, reason) => {
    try {
        const response = await axios.post(
            `http://localhost:3000/user/order/cancel`,
            { orderID, reason },
            { withCredentials: true }
        );

        return response.data.success
            ? {
                success: true,
                message: "Order cancelled successfully.",
                order: response.data.data.order,
                refund: response.data.data.refund || null
            }
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
        const response = await axios.get(`http://localhost:3000/user/wishlist`, {
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
            `http://localhost:3000/user/wishlist/add`,
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
        const response = await axios.post(`http://localhost:3000/user/wishlist/remove`, { productID }, { withCredentials: true });

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
        const response = await axios.put(`http://localhost:3000/user/profile`, profileData, {
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
        const response = await axios.put(`http://localhost:3000/user/profile/picture`, formData, {
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

export const getUserDetails = async () => {
    try {
        const response = await axios.get("http://localhost:3000/user/profile", { withCredentials: true });

        if (response.data.success) {
            return { success: true, user: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch user details." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const forgotPassword = async (email) => {
    try {
        const response = await axios.post(`http://localhost:3000/user/forgot-password`, { email }, { withCredentials: true });
        return response.data.success
            ? { success: true, message: "Password reset code sent successfully." }
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

export const verifyResetToken = async (Email_Otp) => {
    try {
        const response = await axios.post(`http://localhost:3000/user/verify-reset-token`, { Email_Otp }, { withCredentials: true });
        return response.data.success
            ? { success: true, message: "Password reset code verified successfully." }
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

export const resetPassword = async (newPass) => {
    try {
        const response = await axios.put(`http://localhost:3000/user/reset-password`, { newPass }, { withCredentials: true });
        return response.data.success
            ? { success: true, message: "Password reset successfully, Please Login with New Password !" }
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

export const addReview = async (productID, rating, comment) => {
    try {
        const response = await axios.post(`http://localhost:3000/user/reviews`,
            { productID, rating, comment },
            { withCredentials: true }
        );

        return response.data.success
            ? {
                success: true,
                message: "Review added successfully.",
                review: response.data.data
            }
            : {
                success: false,
                message: response.data.message || "Failed to add review."
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong while adding review."
        };
    }
};

export const updateReview = async (productID, reviewID, rating, comment) => {
    try {
        const response = await axios.put(`http://localhost:3000/user/reviews`,
            { productID, reviewID, rating, comment },
            { withCredentials: true }
        );

        return response.data.success
            ? {
                success: true,
                message: "Review updated successfully."
            }
            : {
                success: false,
                message: response.data.message || "Failed to update review."
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong while updating review."
        };
    }
};

export const deleteReview = async (productID) => {
    try {
        const response = await axios.delete(`http://localhost:3000/user/reviews`, {
            withCredentials: true,
            data: { productID }
        });

        return response.data.success
            ? {
                success: true,
                message: "Review deleted successfully."
            }
            : {
                success: false,
                message: response.data.message || "Failed to delete review."
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong while deleting review."
        };
    }
};

export const getProductReviews = async (productID) => {
    try {
        const response = await axios.get(`http://localhost:3000/user/${productID}/reviews`, {
            withCredentials: true
        });

        return response.data.success
            ? {
                success: true,
                message: "Product reviews fetched successfully.",
                reviews: response.data.data
            }
            : {
                success: false,
                message: response.data.message || "Failed to fetch product reviews."
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong while fetching product reviews."
        };
    }
};

export const getUserReviews = async () => {
    try {
        const response = await axios.get(`http://localhost:3000/user/reviews`, {
            withCredentials: true
        });

        return response.data.success
            ? {
                success: true,
                message: "User reviews fetched successfully.",
                reviews: response.data.data
            }
            : {
                success: false,
                message: response.data.message || "Failed to fetch user reviews."
            };
    } catch (err) {
        return {
            success: false,
            message: err.response?.data?.message || "Something went wrong while fetching user reviews."
        };
    }
};