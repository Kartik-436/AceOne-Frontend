import axios from "axios";

export const getAllProducts = async (filters = {}) => {
    try {
        const query = new URLSearchParams(filters).toString();
        const response = await axios.get(`http://localhost:3000/product?${query}`);

        if (response.data.success) {
            return { success: true, products: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch products." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getProductById = async (productId) => {
    try {
        const response = await axios.get(`http://localhost:3000/product/${productId}`);

        if (response.data.success) {
            return { success: true, product: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Product not found." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getBestSellingProducts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/product/bestSelling");

        if (response.data.success) {
            return { success: true, products: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch best-selling products." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const getDiscountedProducts = async () => {
    try {
        const response = await axios.get("http://localhost:3000/product/discounted");

        if (response.data.success) {
            return { success: true, products: response.data.data };
        } else {
            return { success: false, message: response.data.message || "Failed to fetch discounted products." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};

export const searchProducts = async (query) => {
    try {
        if (!query) {
            return { success: false, message: "Search query is required." };
        }

        const response = await axios.get(`http://localhost:3000/product/search?q=${encodeURIComponent(query)}`);

        if (response.data.success) {
            return { success: true, products: response.data.data };
        } else {
            return { success: false, message: response.data.message || "No products found." };
        }
    } catch (err) {
        return { success: false, message: err.response?.data?.message || "Something went wrong." };
    }
};
