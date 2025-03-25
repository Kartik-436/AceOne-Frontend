/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { AnimatePresence } from "framer-motion";
import { motion } from 'framer-motion';
import { useEffect, useState } from "react";
import { updateProduct } from "../../utils/OwnerService";
import { toast } from "react-toastify";

const EditProductModal = ({ isOpen, onClose, product, onProductUpdated }) => {
    const [loading, setLoading] = useState(false);
    const [mainImageFile, setMainImageFile] = useState(null);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [additionalImagePreviews, setAdditionalImagePreviews] = useState([]);
    const [errors, setErrors] = useState({});
    const categories = ["kids", "mens", "womens"];

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        size: [],
        color: [],
        category: '',
        stock: '',
    });

    useEffect(() => {
        if (product) {
            setProductData({
                name: product.name || '',
                description: product.description || '',
                price: product.price || '',
                discount: product.discount || '',
                size: Array.isArray(product.size) ? product.size : [product.size].filter(Boolean),
                color: Array.isArray(product.color) ? product.color : [product.color].filter(Boolean),
                category: product.category || '',
                stock: product.stock || '',
            });

            // Set main image preview
            setMainImagePreview(product?.image || null);

            // Set additional images previews
            setAdditionalImagePreviews(product?.additionalImages || []);
        }
    }, [product]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleMultiInputChange = (e, field) => {
        const value = e.target.value.split(',').map(item => item.trim()).filter(item => item);
        setProductData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);

            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setAdditionalImageFiles(files);

        const previews = files.map(file => {
            const reader = new FileReader();
            return new Promise((resolve) => {
                reader.onloadend = () => {
                    resolve(reader.result);
                };
                reader.readAsDataURL(file);
            });
        });

        Promise.all(previews).then(setAdditionalImagePreviews);
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
            const formData = new FormData();

            // Append main image file
            if (mainImageFile) {
                formData.append('image', mainImageFile);
            }

            // Append additional image files
            additionalImageFiles.forEach((file, index) => {
                formData.append(`additionalImages`, file);
            });

            // Append other product data
            formData.append('name', productData.name);
            formData.append('description', productData.description || '');
            formData.append('price', productData.price);
            formData.append('discount', productData.discount || 0);

            // Append arrays for size and color
            productData.size.forEach(size => formData.append('size', size));
            productData.color.forEach(color => formData.append('color', color));

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
                        {/* [Previous modal layout remains the same] */}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Main Image Upload */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2'>
                                    Product Image
                                </label>
                                <div className="flex items-center justify-between px-3">
                                    <div className='flex items-center space-x-4'>
                                        <div
                                            className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-lg overflow-hidden'
                                            style={{ background: mainImagePreview ? 'transparent' : '#2a2a2a' }}
                                        >
                                            {mainImagePreview !== null ? (
                                                <img
                                                    src={typeof mainImagePreview === 'string' && mainImagePreview.startsWith('data:')
                                                        ? mainImagePreview
                                                        : `data:image/jpeg;base64,${mainImagePreview}`}
                                                    alt="Preview"
                                                    className='w-full h-full object-cover'
                                                />
                                            ) : (
                                                <span className='text-[#ffbb00]'>Preview</span>
                                            )}
                                        </div>
                                        <div className='flex-1'>
                                            <div className="relative inline-block cursor-pointer">
                                                <input
                                                    type="file"
                                                    id="mainImageUpdate"
                                                    accept="image/*"
                                                    onChange={handleMainImageChange}
                                                    className='absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer flex items-center justify-center'
                                                />
                                                <div className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore pointer-events-none'>
                                                    Choose Main Image
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Images Upload */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2'>
                                    Additional Images
                                </label>
                                <div className="flex space-x-2">
                                    <input
                                        type="file"
                                        multiple
                                        accept="image/*"
                                        onChange={handleAdditionalImagesChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2"
                                    />
                                </div>
                                {additionalImagePreviews.length > 0 && (
                                    <div className="flex space-x-2 mt-2">
                                        {additionalImagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="w-16 h-16 border rounded overflow-hidden"
                                            >
                                                <img
                                                    src={typeof preview === 'string' && preview.startsWith('data:')
                                                        ? preview
                                                        : `data:image/jpeg;base64,${preview}`}
                                                    alt={`Additional preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Description
                                </label>
                                <textarea
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    placeholder="Enter product description"
                                    rows="3"
                                />
                            </div>

                            {/* Size Field - Now Multiple */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Sizes (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    value={productData.size.join(', ')}
                                    onChange={(e) => handleMultiInputChange(e, 'size')}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    placeholder="e.g. S, M, L, XL"
                                />
                                <p className="text-xs text-gray-400 mt-1">Enter multiple sizes separated by comma</p>
                            </div>

                            {/* Color Field - Now Multiple */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Colors (comma-separated)
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={productData.color.join(', ')}
                                    onChange={(e) => handleMultiInputChange(e, 'color')}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    placeholder="e.g. Red, Blue, Black"
                                />
                                <p className="text-xs text-gray-400 mt-1">Enter multiple colors separated by comma</p>
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