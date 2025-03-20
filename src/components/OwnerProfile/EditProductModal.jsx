/* eslint-disable react/prop-types */
import { AnimatePresence } from "framer-motion";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { updateProduct } from "../../utils/OwnerService";
import { toast } from "react-toastify";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});
    const categories = ["kids", "mens", "womens"];

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        discount: '',
        size: '',
        color: '',
        category: '',
        stock: '',
    });

    useEffect(() => {
        if (product) {
            setProductData({
                name: product.name || '',
                price: product.price || '',
                discount: product.discount || '',
                size: product.size || '',
                color: product.color || '',
                category: product.category || '',
                stock: product.stock || '',
            });
            // Fix 1: Ensure image preview is set correctly
            setImagePreview(product?.image || null);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData({
            ...productData,
            [name]: value
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!productData.name.trim()) newErrors.name = "Product name is required";
        if (!productData.price) newErrors.price = "Price is required";
        if (!productData.category) newErrors.category = "Category is required";
        if (!productData.stock) newErrors.stock = "Stock quantity is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        setLoading(true);

        try {
            // Create FormData to handle file upload
            const formData = new FormData();

            // Append image file if a new one was selected
            if (imageFile) {
                formData.append('image', imageFile);
            }

            // Append other product data
            formData.append('name', productData.name);
            formData.append('price', productData.price);
            formData.append('discount', productData.discount || 0);
            formData.append('size', productData.size || '');
            formData.append('color', productData.color || '');
            formData.append('category', productData.category);
            formData.append('stock', productData.stock);

            const response = await updateProduct(product._id, formData);

            if (response.success) {
                toast.success("Product updated successfully");
                onProductUpdated();
                onClose();
            } else {
                toast.error(response.message || "Failed to update product");
                console.error('Error updating product:', response.message);
            }
        } catch (error) {
            console.error('Error updating product:', error);
            toast.error(error.message || "Failed to update product");
        } finally {
            setLoading(false);
        }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 w-full h-full flex items-center justify-center backdrop-blur-xs bg-[#11111105] transition-all duration-150 z-20">
                    <motion.div
                        key="edit-product-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 400 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 400 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        style={{ willChange: "transform", translateZ: 0 }}
                        className="bg-[#1f1f1f] text-[#fff] p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    >
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#ffbb00]">Edit Product</h2>
                            <button
                                onClick={onClose}
                                className="text-white hover:text-[#ffbb00] transition-colors cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
                                    <line x1="22" y1="6" x2="6" y2="22"></line>
                                    <line x1="6" y1="6" x2="22" y2="22"></line>
                                </svg>
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Image Upload */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2'>
                                    Product Image
                                </label>
                                <div className="flex items-center justify-between px-3">
                                    <div className='flex items-center space-x-4'>
                                        <div
                                            className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-lg overflow-hidden'
                                            style={{ background: imagePreview ? 'transparent' : '#2a2a2a' }}
                                        >
                                            {imagePreview !== null ? (
                                                <img src={imagePreview} alt="Preview" className='w-full h-full object-cover' />
                                            ) : (
                                                <span className='text-[#ffbb00]'>Preview</span>
                                            )}
                                        </div>
                                        <div className='flex-1'>
                                            <div className="relative inline-block cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="imageupdate"
                                                    accept="image/*"
                                                    onChange={handleImageChange}
                                                    className='absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer flex items-center justify-center'
                                                    onClick={(e) => {
                                                        if (e.target.value) {
                                                            e.target.value = '';
                                                        }
                                                    }}
                                                />
                                                <div className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore pointer-events-none'>
                                                    Choose Image
                                                </div>
                                            </div>
                                            {errors.image && <p className='text-red-500 text-xs mt-1'>{errors.image}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Two column layout for form fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {/* Product Name */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Product Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={productData.name}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Enter product name"
                                        required
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                {/* Category */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Category <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="category"
                                        value={productData.category}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        required
                                    >
                                        <option value="">Select Category</option>
                                        {categories.map((cat) => (
                                            <option
                                                key={cat}
                                                value={cat.toLowerCase()}
                                                selected={productData.category && productData.category.toLowerCase() === cat.toLowerCase()}
                                            >
                                                {cat}
                                            </option>
                                        ))}
                                    </select>
                                    {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={productData.price}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Enter price"
                                        min="0"
                                        step="0.1"
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>

                                {/* Discount Percentage */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="number"
                                        name="discount"
                                        value={productData.discount}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Enter discount percentage"
                                        min="0"
                                        max="100"
                                    />
                                    <p className="text-xs text-gray-400 mt-1">Discount price will be calculated automatically</p>
                                </div>

                                {/* Stock */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Stock <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        name="stock"
                                        value={productData.stock}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Available stock"
                                        min="0"
                                        required
                                    />
                                    {errors.stock && <p className="text-red-500 text-xs mt-1">{errors.stock}</p>}
                                </div>

                                {/* Size */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Size
                                    </label>
                                    <input
                                        type="text"
                                        name="size"
                                        value={productData.size}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="e.g. S, M, L, XL, etc."
                                    />
                                </div>

                                {/* Color */}
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Color
                                    </label>
                                    <input
                                        type="text"
                                        name="color"
                                        value={productData.color}
                                        onChange={handleChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="e.g. Red, Blue, Black, etc."
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={onClose}
                                    className="bg-[#3a3a3a] text-white py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-[#5a5a5a]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#fff] text-[#1f1f1f] font-bold py-2 px-6 rounded-lg flex items-center justify-center cursor-pointer AddToCartInStore"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className="animate-pulse">Updating...</span>
                                    ) : (
                                        "Update Product"
                                    )}
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};

export default EditProductModal;