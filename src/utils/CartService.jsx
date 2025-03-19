import axios from "axios";

export const getUserCart = async () => {
    try {
        const response = await axios.get("/api/user/cart", { withCredentials: true });
        // console.log("Full API response:", response); // Debugging
        // console.log("Data response:", response.data.data); // Debugging
        if (response.data.success) {
            return { success: true, cart: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch cart." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const addToCart = async (productID, quantity = 1) => {
    try {
        const response = await axios.post("/api/user/cart/add", { productID, quantity }, { withCredentials: true });

        if (response.data.success) {
            return { success: true, cart: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to add product to cart." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const updateCartQuantity = async (productID, change) => {
    try {
        const response = await axios.put("/api/user/cart/update", { productID, change }, { withCredentials: true });
        if (response.data.success) {
            return { success: true, cart: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to update cart." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const removeFromCart = async (productID) => {
    try {
        const response = await axios.delete("/api/user/cart/remove", { data: { productID }, withCredentials: true });

        if (response.data.success) {
            return { success: true, cart: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to remove product from cart." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const clearCart = async () => {
    try {
        const response = await axios.delete("/api/user/cart/clear", { withCredentials: true });

        if (response.data.success) {
            return { success: true, cart: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to remove product from cart." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};
