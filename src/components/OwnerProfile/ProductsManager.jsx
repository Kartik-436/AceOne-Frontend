/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import OwnerSearch from '../OwnerSearch'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import SortByMenu from './../SortOptions';
import { addProduct, deleteProduct, getAllOrders, getAllProducts, getAllUsers, getOwnerProfile } from '../../utils/OwnerService';
import BarLoader from './../Loaders/CustomLoader1';
import { AnimatePresence, motion } from 'motion/react';
import { LucidePackage2, ShoppingBasket, Trash2 } from 'lucide-react';
import { toast } from 'react-toastify';

const ProductsManager = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = ["Kids", "Mens", "Womens"];

    const refreshProducts = async () => {
        try {
            setLoading(true)
            const response = await getAllProducts();

            if (response.success) {
                setProducts(response.products);
            } else {
                setError(response.message);
                console.error("getting Products Error: ", response.message)
            }
        } catch (error) {
            console.error("getting Products Error: ", error)
        }
        setLoading(false)
    }

    const handleDeleteProduct = async (Pid) => {
        try {
            const response = await deleteProduct(Pid);
            if (response.success) {
                await refreshProducts();
                toast.success("Product deleted successfully");
            } else {
                console.error("product deletion error: ", response.messages)
                toast.error("Failed to delete product")
            }
        } catch (error) {
            console.error("Delete error:", error.message);
            toast.error("Failed to delete product");
        }
    };

    const [productData, setProductData] = useState({
        name: '',
        price: '',
        discount: '',
        size: '',
        color: '',
        category: '',
        stock: '',
    });


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

            // Create preview
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
        if (!imageFile) newErrors.image = "Product image is required";

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

            // Append image file
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

            const response = await addProduct(formData);
            console.log(response)
            if (response.success) {
                toast.success(`${formData.name} Added Succesfully`)
                setProductData({
                    name: '',
                    price: '',
                    discount: '',
                    size: '',
                    color: '',
                    category: '',
                    stock: '',
                });
                setImageFile(null);
                setImagePreview(null);
            } else {
                toast.error(response.message || `Failed to add product !`)
                console.error('Error adding product:', response.message);
            }
        } catch (error) {
            console.error('Error adding product:', error);
            toast.success(error.message || `Failed to add product !`)
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        ; (async () => {
            await refreshProducts();
        })()
    }, [])

    return (
        <>
            <Transition animate={animate} />

            <div className='w-full flex items-center justify-center min-h-[94vh]'>
                <div className='w-full bg-[#1f1f1f] text-[#fff] p-6 rounded-lg shadow-xl'>
                    <h2 className='text-2xl font-bold mb-6 text-[#ffbb00]'>Add New Product</h2>

                    <form onSubmit={handleSubmit} className='space-y-4'>
                        {/* Image Upload */}
                        <div className='mb-6'>
                            <label className='block text-sm font-medium mb-2'>
                                Product Image <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex items-center space-x-4'>
                                <div
                                    className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-lg overflow-hidden'
                                    style={{ background: imagePreview ? 'transparent' : '#2a2a2a' }}
                                >
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className='w-full h-full object-cover' />
                                    ) : (
                                        <span className='text-[#ffbb00]'>Preview</span>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <input
                                        type="file"
                                        id="image"
                                        accept="image/*"
                                        className='hidden'
                                        onChange={handleImageChange}
                                        required
                                    />
                                    <label
                                        htmlFor="image"
                                        className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore'
                                    >
                                        Choose Image
                                    </label>
                                    {errors.image && <p className='text-red-500 text-xs mt-1'>{errors.image}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Two column layout for form fields */}
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                            {/* Product Name */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Product Name <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="Enter product name"
                                    required
                                />
                                {errors.name && <p className='text-red-500 text-xs mt-1'>{errors.name}</p>}
                            </div>

                            {/* Category */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Category <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat.toLowerCase()}>{cat}</option>
                                    ))}
                                </select>
                                {errors.category && <p className='text-red-500 text-xs mt-1'>{errors.category}</p>}
                            </div>

                            {/* Price */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Price <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="number"
                                    name="price"
                                    value={productData.price}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="Enter price"
                                    min="0"
                                    step="0.1"
                                    required
                                />
                                {errors.price && <p className='text-red-500 text-xs mt-1'>{errors.price}</p>}
                            </div>

                            {/* Discount Percentage */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Discount (%)
                                </label>
                                <input
                                    type="number"
                                    name="discount"
                                    value={productData.discount}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="Enter discount percentage"
                                    min="0"
                                    max="100"
                                    required
                                />
                                <p className='text-xs text-gray-400 mt-1'>Discount price will be calculated automatically</p>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Stock <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={productData.stock}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="Available stock"
                                    min="0"
                                    required
                                />
                                {errors.stock && <p className='text-red-500 text-xs mt-1'>{errors.stock}</p>}
                            </div>

                            {/* Size */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Size
                                </label>
                                <input
                                    type="text"
                                    name="size"
                                    value={productData.size}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="e.g. S, M, L, XL, etc."
                                    required
                                />
                            </div>

                            {/* Color */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Color
                                </label>
                                <input
                                    type="text"
                                    name="color"
                                    value={productData.color}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="e.g. Red, Blue, Black, etc."
                                    required
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className='mt-8'>
                            <button
                                type="submit"
                                className='w-full bg-[#fff] text-[#1f1f1f] font-bold py-3 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center cursor-pointer AddToCartInStore'
                                disabled={loading}
                            >
                                {loading ? (
                                    <span className="animate-pulse">Adding Product...</span>
                                ) : (
                                    "Add Product"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    )
}

export default ProductsManager

const ConfirmationModal = ({ isOpen, onClose, onConfirm }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center backdrop-blur-sm z-50">
                    <motion.div
                        key="logout-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to Delete a product ?</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer active:scale-95"
                            >
                                No
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer active:scale-95"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};