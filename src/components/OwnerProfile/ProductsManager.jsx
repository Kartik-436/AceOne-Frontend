/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { addProduct, getAllProducts } from '../../utils/OwnerService';
import { toast } from 'react-toastify';

const ProductsManager = () => {
    const refreshProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            if (response.success) {
                setProducts(response.data);
            } else {
                toast.error(response.message || "Failed to fetch products");
            }
        } catch (error) {
            toast.error("Error fetching products");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshProducts();
    }, []);


    const { animate } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const categories = ["kids", "mens", "womens"];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxImageSize = 5 * 1024 * 1024; // 5MB in bytes

    const validateImage = (file) => {
        if (!file) return null;

        if (!allowedImageTypes.includes(file.type)) {
            return "Invalid image type. Only JPEG, PNG, and GIF are allowed.";
        }

        if (file.size > maxImageSize) {
            return "Image size should be less than 5MB.";
        }

        return null;
    };

    const handleImageChange = (e, type = 'main') => {
        if (type === 'main') {
            const file = e.target.files[0];

            if (file) {
                const error = validateImage(file);

                if (error) {
                    setFormState(prev => ({
                        ...prev,
                        errors: { ...prev.errors, mainImage: error }
                    }));
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = () => {
                    setFormState(prev => ({
                        ...prev,
                        mainImageFile: file,
                        mainImagePreview: reader.result,
                        errors: { ...prev.errors, mainImage: '' }
                    }));
                };
                reader.readAsDataURL(file);
            }
        } else if (type === 'additional') {
            const files = Array.from(e.target.files);
            let hasErrors = false;
            let errorMsg = "";

            for (const file of files) {
                const error = validateImage(file);
                if (error) {
                    hasErrors = true;
                    errorMsg = error;
                    break;
                }
            }

            if (hasErrors) {
                setFormState(prev => ({
                    ...prev,
                    errors: { ...prev.errors, additionalImages: errorMsg }
                }));
            } else {
                setFormState(prev => ({
                    ...prev,
                    additionalImageFiles: files,
                    errors: { ...prev.errors, additionalImages: '' }
                }));
            }
        }
    };

    const handleColorManagement = (action, color = '') => {
        switch (action) {
            case 'add':
                const newColor = formState.colorInput?.trim();
                if (newColor && !formState.colors.includes(newColor)) {
                    setFormState(prev => ({
                        ...prev,
                        colors: [...prev.colors, newColor],
                        colorInput: '',
                        errors: { ...prev.errors, colors: '' }
                    }));
                }
                break;
            case 'remove':
                setFormState(prev => ({
                    ...prev,
                    colors: prev.colors.filter(c => c !== color)
                }));
                break;
            default:
                break;
        }
    };

    const handleSizeToggle = (size) => {
        setFormState(prev => {
            const currentSizes = prev.sizes || [];
            const newSizes = currentSizes.includes(size)
                ? currentSizes.filter(s => s !== size)
                : [...currentSizes, size];

            return {
                ...prev,
                sizes: newSizes,
                errors: { ...prev.errors, sizes: '' }
            };
        });
    };

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        sizes: [],
        colors: [],
        category: '',
        stock: '',
        mainImageFile: null,
        mainImagePreview: null,
        additionalImageFiles: [],
        colorInput: '',
        errors: {}
    });

    const calculateDiscountedPrice = (price, discountPercentage) => {
        if (!price || !discountPercentage) return '';

        const numPrice = parseFloat(price);
        const numDiscount = parseFloat(discountPercentage);

        if (isNaN(numPrice) || isNaN(numDiscount)) return '';

        const discountedPrice = numPrice * (1 - numDiscount / 100);
        return discountedPrice.toFixed(2);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Special validation for discount
        if (name === 'discount') {
            const numValue = parseFloat(value);
            if (value && !isNaN(numValue) && (numValue < 0 || numValue > 100)) {
                setFormState(prev => ({
                    ...prev,
                    [name]: value.replace(/[^0-9.]/g, ''),
                    errors: { ...prev.errors, [name]: 'Discount must be between 0 and 100' }
                }));
                return;
            }
        }

        setFormState(prev => ({
            ...prev,
            [name]: name === 'price' || name === 'discount'
                ? value.replace(/[^0-9.]/g, '')
                : value,
            errors: { ...prev.errors, [name]: '' }
        }));
    };

    const validateForm = () => {
        const errors = {};

        // Required fields
        if (!formState.name.trim()) errors.name = "Product name is required";
        if (!formState.description.trim()) errors.description = "Description is required";
        if (!formState.price.trim()) errors.price = "Price is required";
        if (!formState.category) errors.category = "Category is required";
        if (!formState.stock) errors.stock = "Stock is required";
        if (formState.sizes.length === 0) errors.sizes = "At least one size must be selected";
        if (formState.colors.length === 0) errors.colors = "At least one color must be selected";
        if (!formState.mainImageFile) errors.mainImage = "Main product image is required";

        // Number validations
        if (formState.price && isNaN(parseFloat(formState.price))) {
            errors.price = "Price must be a valid number";
        }

        if (formState.discount && isNaN(parseFloat(formState.discount))) {
            errors.discount = "Discount must be a valid number";
        }

        if (formState.discount) {
            const discount = parseFloat(formState.discount);
            if (discount < 0 || discount > 100) {
                errors.discount = "Discount must be between 0 and 100";
            }
        }

        if (formState.stock && isNaN(parseInt(formState.stock))) {
            errors.stock = "Stock must be a valid number";
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate form
        const errors = validateForm();
        if (Object.keys(errors).length > 0) {
            setFormState(prev => ({
                ...prev,
                errors: errors
            }));

            // Show the first error
            const firstError = Object.values(errors)[0];
            toast.error(firstError);
            return;
        }

        const productData = {
            name: formState.name,
            description: formState.description,
            price: parseFloat(formState.price),
            discount: formState.discount ? parseFloat(formState.discount) : null,
            category: formState.category,
            stock: parseInt(formState.stock),
            size: formState.sizes,
            color: formState.colors,
            image: formState.mainImageFile,
            additionalImages: formState.additionalImageFiles,
        };

        try {
            setLoading(true);
            const response = await addProduct(productData);
            if (response.success) {
                toast.success('Product added successfully');
                refreshProducts();
                setFormState({
                    name: '',
                    description: '',
                    price: '',
                    discount: '',
                    sizes: [],
                    colors: [],
                    category: '',
                    stock: '',
                    mainImageFile: null,
                    mainImagePreview: null,
                    additionalImageFiles: [],
                    colorInput: '',
                    errors: {}
                });
            } else {
                toast.error(response.message || 'Failed to add product');
            }
        } catch (error) {
            toast.error('Error adding product');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Transition animate={animate} />
            <div className='w-full flex items-center justify-center min-h-[94vh] bg-[#1f1f1f] p-4'>
                <div className='w-full max-w-4xl bg-[#2a2a2a] text-white p-8 rounded-2xl shadow-2xl'>
                    <h2 className='text-3xl font-bold mb-8 text-[#ffbb00] text-center'>
                        Add New Product
                    </h2>

                    <form onSubmit={handleSubmit} className='space-y-6'>
                        {/* Image Upload Section */}
                        <div className='grid md:grid-cols-2 gap-6'>
                            {/* Main Image Upload */}
                            <div>
                                <label className='block text-sm font-medium mb-2'>
                                    Main Product Image <span className='text-red-500'>*</span>
                                </label>
                                <div className='relative group'>
                                    <input
                                        type="file"
                                        id="mainImage"
                                        accept="image/jpeg,image/png,image/gif"
                                        className='hidden'
                                        onChange={(e) => handleImageChange(e, 'main')}
                                    />
                                    <label
                                        htmlFor="mainImage"
                                        className='block w-full h-64 border-2 border-dashed border-[#ffbb00] rounded-lg cursor-pointer overflow-hidden'
                                    >
                                        {formState.mainImagePreview ? (
                                            <img
                                                src={formState.mainImagePreview}
                                                alt="Preview"
                                                className='w-full h-full object-cover group-hover:opacity-70 transition-opacity'
                                            />
                                        ) : (
                                            <div className='flex flex-col items-center justify-center h-full text-[#ffbb00]'>
                                                <span>Click to Upload Main Image</span>
                                                <span className='text-xs mt-2'>(JPEG, PNG, GIF, max 5MB)</span>
                                            </div>
                                        )}
                                    </label>
                                </div>
                                {formState.errors.mainImage && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.mainImage}
                                    </p>
                                )}
                            </div>

                            {/* Additional Images Upload */}
                            <div>
                                <label className='block text-sm font-medium mb-2'>
                                    Additional Images (Optional)
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif"
                                    className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-3'
                                    onChange={(e) => handleImageChange(e, 'additional')}
                                />
                                <p className='text-xs text-gray-400 mt-1'>
                                    JPEG, PNG, GIF only, max 5MB each
                                </p>
                                {formState.additionalImageFiles.length > 0 && (
                                    <p className='text-xs text-green-400 mt-1'>
                                        {formState.additionalImageFiles.length} additional image(s) selected
                                    </p>
                                )}
                                {formState.errors.additionalImages && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.additionalImages}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Product Details Grid */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            {/* Product Name */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Product Name <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                    placeholder="Enter product name"
                                />
                                {formState.errors.name && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.name}
                                    </p>
                                )}
                            </div>

                            {/* Category Dropdown */}
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Category <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formState.category}
                                    onChange={handleInputChange}
                                    className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {formState.errors.category && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.category}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Sizes Selection */}
                        <div>
                            <label className='block text-sm font-medium mb-2'>
                                Available Sizes <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex flex-wrap gap-2'>
                                {sizeOptions.map(size => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => handleSizeToggle(size)}
                                        className={`
                                            px-3 py-1 rounded-lg transition-all duration-200
                                            ${formState.sizes.includes(size)
                                                ? 'bg-[#ffbb00] text-black'
                                                : 'bg-[#3a3a3a] text-white hover:bg-[#4a4a4a]'
                                            }
                                        `}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {formState.errors.sizes && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {formState.errors.sizes}
                                </p>
                            )}
                        </div>

                        {/* Colors Management */}
                        <div>
                            <label className='block text-sm font-medium mb-2'>
                                Colors <span className='text-red-500'>*</span>
                            </label>
                            <div className='flex gap-2 mb-2'>
                                <input
                                    type="text"
                                    value={formState.colorInput || ''}
                                    onChange={(e) => setFormState(prev => ({
                                        ...prev,
                                        colorInput: e.target.value,
                                        errors: { ...prev.errors, colors: '' }
                                    }))}
                                    placeholder="Enter color name"
                                    className='flex-grow bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                />
                                <button
                                    type="button"
                                    onClick={() => handleColorManagement('add')}
                                    className='bg-[#ffbb00] text-black px-4 py-2 rounded-lg'
                                >
                                    Add Color
                                </button>
                            </div>

                            {/* Color Tags */}
                            <div className='flex flex-wrap gap-2'>
                                {formState.colors.map(color => (
                                    <span
                                        key={color}
                                        className='bg-[#4a4a4a] text-white px-3 py-1 rounded-full flex items-center'
                                    >
                                        {color}
                                        <button
                                            type="button"
                                            onClick={() => handleColorManagement('remove', color)}
                                            className='ml-2 text-red-400 hover:text-red-600'
                                        >
                                            ×
                                        </button>
                                    </span>
                                ))}
                            </div>
                            {formState.errors.colors && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {formState.errors.colors}
                                </p>
                            )}
                        </div>

                        {/* Price and Stock */}
                        <div className='grid md:grid-cols-2 gap-4'>
                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Price <span className='text-red-500'>*</span>
                                </label>
                                <input
                                    type="text"
                                    name="price"
                                    value={formState.price}
                                    onChange={handleInputChange}
                                    className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                    placeholder="Enter price"
                                />
                                {formState.errors.price && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.price}
                                    </p>
                                )}
                            </div>

                            <div>
                                <label className='block text-sm font-medium mb-1'>
                                    Discount (%)
                                </label>
                                <input
                                    type="text"
                                    name="discount"
                                    value={formState.discount}
                                    onChange={handleInputChange}
                                    className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                    placeholder="Enter discount percentage (0-100)"
                                />
                                {formState.errors.discount && (
                                    <p className='text-red-500 text-xs mt-1'>
                                        {formState.errors.discount}
                                    </p>
                                )}
                                {formState.price && formState.discount && (
                                    <p className='text-xs text-gray-400 mt-1'>
                                        Discounted Price: ${calculateDiscountedPrice(formState.price, formState.discount)}
                                    </p>
                                )}
                            </div>
                        </div>
                        <div>
                            <label className='block text-sm font-medium mb-1'>
                                Stock <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type="number"
                                name="stock"
                                value={formState.stock}
                                onChange={handleInputChange}
                                className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                placeholder="Enter stock quantity"
                                min="0"
                            />
                            {formState.errors.stock && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {formState.errors.stock}
                                </p>
                            )}
                        </div>

                        {/* Description */}
                        <div>
                            <label className='block text-sm font-medium mb-1'>
                                Description <span className='text-red-500'>*</span>
                            </label>
                            <textarea
                                name="description"
                                value={formState.description}
                                onChange={handleInputChange}
                                className='w-full bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2 h-24'
                                placeholder="Enter product description"
                            />
                            {formState.errors.description && (
                                <p className='text-red-500 text-xs mt-1'>
                                    {formState.errors.description}
                                </p>
                            )}
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className='w-full bg-[#ffbb00] text-black font-bold py-3 rounded-lg transition-colors duration-300 hover:bg-yellow-500 disabled:opacity-50'
                        >
                            {loading ? 'Adding Product...' : 'Add Product'}
                        </button>
                    </form >
                </div >
            </div >
        </>
    );
};

export default ProductsManager;