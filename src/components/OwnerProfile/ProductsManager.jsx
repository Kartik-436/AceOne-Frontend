/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { addProduct, deleteProduct, getAllProducts } from '../../utils/OwnerService';
import { toast } from 'react-toastify';

const ProductsManager = () => {
    const { animate } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    const [mainImageFile, setMainImageFile] = useState(null);
    const [additionalImageFiles, setAdditionalImageFiles] = useState([]);
    const [mainImagePreview, setMainImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const categories = ["kids", "mens", "womens"];
    const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const [colorInput, setColorInput] = useState('');

    const refreshProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            if (response.success) {
                setProducts(response.products);
            } else {
                setError(response.message);
                console.error("Error fetching products:", response.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
        setLoading(false);
    };

    const [productData, setProductData] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        sizes: [],
        colors: [],
        category: '',
        stock: '',
        brand: 'AceOne'
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({ ...prev, [name]: value }));
    };

    const handleSizeChange = (size) => {
        setProductData(prev => ({
            ...prev,
            sizes: prev.sizes.includes(size)
                ? prev.sizes.filter(s => s !== size)
                : [...prev.sizes, size]
        }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setMainImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => setMainImagePreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e) => {
        const files = Array.from(e.target.files);
        setAdditionalImageFiles(files);
    };

    const validateForm = () => {
        const newErrors = {};
        if (!productData.name.trim()) newErrors.name = "Product name is required";
        if (!productData.description.trim()) newErrors.description = "Product description is required";
        if (!productData.price) newErrors.price = "Price is required";
        if (!productData.category) newErrors.category = "Category is required";
        if (productData.sizes.length === 0) newErrors.sizes = "At least one size is required";
        if (productData.colors.length === 0) newErrors.colors = "At least one color is required";
        if (!productData.stock) newErrors.stock = "Stock quantity is required";
        if (!mainImageFile) newErrors.mainImage = "Main image is required";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setLoading(true);

        try {
            const formData = new FormData();
            formData.append('image', mainImageFile);
            additionalImageFiles.forEach((file) => formData.append('additionalImages', file));
            Object.keys(productData).forEach(key => {
                formData.append(key, Array.isArray(productData[key]) ? JSON.stringify(productData[key]) : productData[key]);
            });

            const response = await addProduct(formData);
            if (response.success) {
                toast.success(`${productData.name} Added Successfully`);
                setProductData({
                    name: '', description: '', price: '', discount: '', sizes: [], colors: [], category: '', stock: '', brand: 'AceOne'
                });
                setMainImageFile(null);
                setAdditionalImageFiles([]);
                setMainImagePreview(null);
                await refreshProducts();
            } else {
                toast.error(response.message || `Failed to add product!`);
            }
        } catch (error) {
            toast.error(error.message || `Failed to add product!`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);

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
                                Main Product Image <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex items-center space-x-4'>
                                <div
                                    className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-lg overflow-hidden'
                                    style={{ background: mainImagePreview ? 'transparent' : '#2a2a2a' }}
                                >
                                    {mainImagePreview ? (
                                        <img src={mainImagePreview} alt="Preview" className='w-full h-full object-cover' />
                                    ) : (
                                        <span className='text-[#ffbb00]'>Preview</span>
                                    )}
                                </div>
                                <div className='flex-1'>
                                    <input
                                        type="file"
                                        id="mainImage"
                                        accept="image/*"
                                        className='hidden'
                                        onChange={handleMainImageChange}
                                        required
                                    />
                                    <label
                                        htmlFor="mainImage"
                                        className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore'
                                    >
                                        Choose Main Image
                                    </label>
                                    {errors.mainImage && <p className='text-red-500 text-xs mt-1'>{errors.mainImage}</p>}
                                </div>
                            </div>

                            {/* Additional Images Upload */}
                            <div className='mt-4'>
                                <label className='block text-sm font-medium mb-2'>
                                    Additional Images (Optional)
                                </label>
                                <input
                                    type="file"
                                    id="additionalImages"
                                    accept="image/*"
                                    multiple
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2'
                                    onChange={handleAdditionalImagesChange}
                                />
                                {additionalImageFiles.length > 0 && (
                                    <p className='text-xs text-gray-400 mt-1'>
                                        {additionalImageFiles.length} additional image(s) selected
                                    </p>
                                )}
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

                            {/* Description */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Description <span className='text-red-500'>*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    className='w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]'
                                    placeholder="Enter product description"
                                    rows="2"
                                    required
                                />
                                {errors.description && <p className='text-red-500 text-xs mt-1'>{errors.description}</p>}
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

                            {/* Sizes */}
                            <div className='flex flex-wrap gap-2'>
                                {sizes.map(size => (
                                    <label key={size} className='flex items-center gap-2'>
                                        <input
                                            type='checkbox'
                                            checked={productData.sizes.includes(size)}
                                            onChange={() => handleSizeChange(size)}
                                        />
                                        {size}
                                    </label>
                                ))}
                            </div>
                            {errors.sizes && <p className='text-red-500 text-xs'>{errors.sizes}</p>}

                            {/* Colors */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Colors <span className='text-red-500'>*</span>
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={colorInput}
                                        onChange={(e) => setColorInput(e.target.value)}
                                        placeholder="Enter a color"
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2"
                                    />
                                    <button
                                        type="button"
                                        className="bg-[#ffbb00] text-black font-bold py-2 px-4 rounded-lg AddToCartInStore"
                                        onClick={() => {
                                            if (colorInput.trim() && !productData.colors.includes(colorInput.trim())) {
                                                setProductData(prev => ({
                                                    ...prev,
                                                    colors: [...prev.colors, colorInput.trim()]
                                                }));
                                                setColorInput('');
                                            }
                                        }}
                                    >
                                        Add Color
                                    </button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {productData.colors.map((color, index) => (
                                        <span key={index} className="bg-[#ffbb00] text-black px-3 py-1 rounded-lg">
                                            {color}
                                            <button
                                                type="button"
                                                className="ml-2 text-black"
                                                onClick={() =>
                                                    setProductData(prev => ({
                                                        ...prev,
                                                        colors: prev.colors.filter(c => c !== color)
                                                    }))
                                                }
                                            >
                                                ×
                                            </button>
                                        </span>
                                    ))}
                                </div>
                                {errors.colors && <p className='text-red-500 text-xs mt-1'>{errors.colors}</p>}
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