/* eslint-disable no-unused-vars */
import axios from "axios";

// Base URL for consistency
const BASE_URL = import.meta.env.VITE_BASE_URL_OWNER;

// Utility function to handle responses
const handleResponse = (response) =>
    response.data.success
        ? { success: true, data: response.data.data }
        : { success: false, message: response.data.message || "Operation failed." };

// Utility function to handle errors
const handleError = (err) =>
    ({ success: false, message: err.response?.data?.message || "Something went wrong." });

export const registerOwner = async (ownerData) => {
    try {
        const response = await axios.post(`${BASE_URL}/register`, ownerData);
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const loginOwner = async (credentials) => {
    try {
        const response = await axios.post(`${BASE_URL}/login`, credentials, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const logoutOwner = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/logout`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getOwnerProfile = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/profile`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const updateOwnerProfile = async (profileData) => {
    try {
        // Ensure proper FormData for file upload
        const formData = new FormData();

        // Append text fields
        Object.keys(profileData).forEach(key => {
            if (key !== 'picture' && profileData[key] !== undefined) {
                formData.append(key, profileData[key]);
            }
        });

        // Append picture if exists
        if (profileData.picture instanceof File) {
            formData.append('picture', profileData.picture);
        }

        const response = await axios.put(`${BASE_URL}/profile`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const deleteOwner = async () => {
    try {
        const response = await axios.delete(`${BASE_URL}/profile`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const addProduct = async (productData) => {
    try {
        // Validate required fields
        if (!productData.name || productData.name.trim() === '') {
            return { success: false, message: "Product name is required" };
        }

        if (productData.discount !== undefined && productData.discount !== null) {
            if (productData.discount < 0 || productData.discount > 100) {
                return { success: false, message: "Discount must be between 0 and 100" };
            }
        }

        // Create FormData for file uploads
        const formData = new FormData();

        // Append text fields
        Object.keys(productData).forEach(key => {
            if (key !== 'image' && key !== 'additionalImages') {
                // Handle array fields like size and color
                if (Array.isArray(productData[key])) {
                    formData.append(key, productData[key].join(','));
                } else {
                    formData.append(key, productData[key]);
                }
            }
        });

        // Validate and append main image
        if (productData.image instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(productData.image.type)) {
                return { success: false, message: "Invalid image type" };
            }

            if (productData.image.size > maxSize) {
                return { success: false, message: "Image size should be less than 5MB" };
            }

            formData.append('image', productData.image);
        }

        // Validate and append additional images
        if (productData.additionalImages && productData.additionalImages.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            for (const image of productData.additionalImages) {
                if (!allowedTypes.includes(image.type)) {
                    return { success: false, message: "Invalid additional image type" };
                }

                if (image.size > maxSize) {
                    return { success: false, message: "Additional image size should be less than 5MB" };
                }

                formData.append('additionalImages', image);
            }
        }

        const response = await axios.post(`${BASE_URL}/products`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const updateProduct = async (id, productData) => {
    try {
        // Validate required fields
        if (productData.name !== undefined && productData.name.trim() === '') {
            return { success: false, message: "Product name cannot be empty" };
        }

        if (productData.discount !== undefined && productData.discount !== null) {
            if (productData.discount < 0 || productData.discount > 100) {
                return { success: false, message: "Discount must be between 0 and 100" };
            }
        }

        // Create FormData for file uploads
        const formData = new FormData();

        // Append text fields
        Object.keys(productData).forEach(key => {
            if (key !== 'image' && key !== 'additionalImages') {
                // Handle array fields like size and color
                if (Array.isArray(productData[key])) {
                    formData.append(key, productData[key].join(','));
                } else if (productData[key] !== undefined) {
                    formData.append(key, productData[key]);
                }
            }
        });

        // Validate and append main image
        if (productData.image instanceof File) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(productData.image.type)) {
                return { success: false, message: "Invalid image type" };
            }

            if (productData.image.size > maxSize) {
                return { success: false, message: "Image size should be less than 5MB" };
            }

            formData.append('image', productData.image);
        }

        // Validate and append additional images
        if (productData.additionalImages && productData.additionalImages.length > 0) {
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            for (const image of productData.additionalImages) {
                if (!allowedTypes.includes(image.type)) {
                    return { success: false, message: "Invalid additional image type" };
                }

                if (image.size > maxSize) {
                    return { success: false, message: "Additional image size should be less than 5MB" };
                }

                formData.append('additionalImages', image);
            }
        }

        const response = await axios.put(`${BASE_URL}/products/${id}`, formData, {
            withCredentials: true,
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const deleteProduct = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/products/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getAllProducts = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/products`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/products/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getAllUsers = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getSingleUser = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/users/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getAllOrders = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/orders`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getSingleOrder = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/orders/${id}`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const applyDiscount = async (id, discountData) => {
    try {
        // Validate discount value
        if (discountData.discount < 0 || discountData.discount > 100) {
            return { success: false, message: "Discount must be between 0 and 100" };
        }

        const response = await axios.put(`${BASE_URL}/products/${id}/apply-discount`, discountData, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const removeDiscount = async (id) => {
    try {
        const response = await axios.put(`${BASE_URL}/products/${id}/remove-discount`, {}, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};

export const getRevenueStats = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/sales`, {
            withCredentials: true
        });
        return handleResponse(response);
    } catch (err) {
        return handleError(err);
    }
};