/* eslint-disable no-unused-vars */
import axios from "axios";

export const registerOwner = async (ownerData) => {
    try {
        const response = await axios.post("https://aceone-backend.up.railway.app/owner/register", ownerData);
        return response.data.success ? { success: true, owner: response.data.data } : { success: false, message: response.data.message || "Failed to register owner." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const loginOwner = async (credentials) => {
    try {
        const response = await axios.post("https://aceone-backend.up.railway.app/owner/login", credentials, { withCredentials: true });
        return response.data.success ? { success: true, owner: response.data.data } : { success: false, message: response.data.message || "Login failed." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const logoutOwner = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/logout", { withCredentials: true });
        return response.data.success ? { success: true } : { success: false, message: response.data.message || "Logout failed." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getOwnerProfile = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/profile", { withCredentials: true });
        return response.data.success ? { success: true, profile: response.data.data } : { success: false, message: response.data.message || "Failed to fetch profile." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const updateOwnerProfile = async (formData) => {
    try {
        const response = await axios.put("https://aceone-backend.up.railway.app/owner/profile", formData, { withCredentials: true });
        return response.data.success ? { success: true, profile: response.data.data } : { success: false, message: response.data.message || "Failed to update profile." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const deleteOwner = async () => {
    try {
        const response = await axios.delete("https://aceone-backend.up.railway.app/owner/profile", {
            withCredentials: true,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return response.data.success ? { success: true } : { success: false, message: response.data.message || "Failed to delete owner." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const addProduct = async (productData) => {
    try {
        // If productData contains files, convert to FormData
        const isMultipart = productData.image || productData.additionalImages?.length > 0;

        let submitData = productData;
        submitData = {
            ...productData,
            size: productData.sizes?.join(','),
            color: productData.colors?.join(',')
        };

        const response = await axios.post(
            "https://aceone-backend.up.railway.app/owner/add-product",
            submitData,
            {
                withCredentials: true,
                headers: isMultipart
                    ? { 'Content-Type': 'multipart/form-data' }
                    : { 'Content-Type': 'application/json' }
            }
        );

        return response.data.success
            ? { success: true, product: response.data.data }
            : { success: false, message: response.data.message || "Failed to add product." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const updateProduct = async (id, formData) => {
    try {
        const response = await axios.put(`https://aceone-backend.up.railway.app/owner/update-product/${id}`, formData, { withCredentials: true });
        return response.data.success ? { success: true, product: response.data.data } : { success: false, message: response.data.message || "Failed to update product." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`https://aceone-backend.up.railway.app/owner/delete-product/${id}`, { withCredentials: true });
        return response.data.success ? { success: true } : { success: false, message: response.data.message || "Failed to delete product." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/all-products", { withCredentials: true });
        return response.data.success ? { success: true, products: response.data.data } : { success: false, message: response.data.message || "Failed to fetch products." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`https://aceone-backend.up.railway.app/owner/product/${id}`, { withCredentials: true });
        return response.data.success ? { success: true, product: response.data.data } : { success: false, message: response.data.message || "Failed to fetch product." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/all-users", { withCredentials: true });
        return response.data.success ? { success: true, users: response.data.data } : { success: false, message: response.data.message || "Failed to fetch users." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getSingleUser = async (id) => {
    try {
        const response = await axios.get(`https://aceone-backend.up.railway.app/owner/user/${id}`, { withCredentials: true });
        return response.data.success ? { success: true, user: response.data.data } : { success: false, message: response.data.message || "Failed to fetch user." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`https://aceone-backend.up.railway.app/owner/delete-user/${id}`, { withCredentials: true });
        return response.data.success ? { success: true } : { success: false, message: response.data.message || "Failed to delete user." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const applyDiscount = async (id, discountData) => {
    try {
        const response = await axios.put(`https://aceone-backend.up.railway.app/owner/apply-discount/${id}`, discountData, { withCredentials: true });
        return response.data.success ? { success: true, product: response.data.data } : { success: false, message: response.data.message || "Failed to apply discount." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const removeDiscount = async (id) => {
    try {
        const response = await axios.put(`https://aceone-backend.up.railway.app/owner/remove-discount/${id}`, {}, { withCredentials: true });
        return response.data.success ? { success: true, product: response.data.data } : { success: false, message: response.data.message || "Failed to remove discount." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getAllOrders = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/all-orders", { withCredentials: true });
        return response.data.success ? { success: true, orders: response.data.data } : { success: false, message: response.data.message || "Failed to fetch orders." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getRevenueStats = async () => {
    try {
        const response = await axios.get("https://aceone-backend.up.railway.app/owner/sales", { withCredentials: true });
        return response.data.success ? { success: true, stats: response.data.data } : { success: false, message: response.data.message || "Failed to fetch revenue stats." };
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};
