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
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const allowedImageTypes = ['image/jpeg', 'image/png', 'image/gif'];
    const maxImageSize = 5 * 1024 * 1024; // 5MB in bytes

    const [formState, setFormState] = useState({
        name: '',
        description: '',
        price: '',
        discount: '',
        sizes: [],
        colors: [],
        category: '',
        stock: '',
        colorInput: '',
    });

    useEffect(() => {
        if (product) {
            setFormState({
                name: product.name || '',
                description: product.description || '',
                price: product.price ? String(product.price) : '', // Convert to string
                discount: product.discount ? String(product.discount) : '', // Convert to string
                sizes: Array.isArray(product.size) ? product.size : [product.size].filter(Boolean),
                colors: Array.isArray(product.color) ? product.color : [product.color].filter(Boolean),
                category: product.category || '',
                stock: product.stock ? String(product.stock) : '', // Convert to string
                colorInput: '',
            });

            // Set main image preview
            setMainImagePreview(product?.image || null);

            // Set additional images previews
            setAdditionalImagePreviews(product?.additionalImages || []);
        }
    }, [product]);

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
        }));
        setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleColorManagement = (action, color = '') => {
        switch (action) {
            case 'add':
                const newColor = formState.colorInput ? formState.colorInput.trim() : '';
                if (newColor && !formState.colors.includes(newColor)) {
                    setFormState(prev => ({
                        ...prev,
                        colors: [...prev.colors, newColor],
                        colorInput: '',
                    }));
                    setErrors(prev => ({ ...prev, colors: '' }));
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
            };
        });
        setErrors(prev => ({ ...prev, sizes: '' }));
    };

    const handleMainImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const error = validateImage(file);

            if (error) {
                setErrors(prev => ({ ...prev, mainImage: error }));
                return;
            }

            setMainImageFile(file);
            setErrors(prev => ({ ...prev, mainImage: '' }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setMainImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAdditionalImagesChange = (e) => {
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
            setErrors(prev => ({ ...prev, additionalImages: errorMsg }));
        } else {
            setAdditionalImageFiles(files);
            setErrors(prev => ({ ...prev, additionalImages: '' }));

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
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Required fields
        if (!formState.name.trim()) newErrors.name = "Product name is required";
        if (!formState.description.trim()) newErrors.description = "Description is required";
        if (!formState.price.trim()) newErrors.price = "Price is required";
        if (!formState.category) newErrors.category = "Category is required";
        if (!formState.stock) newErrors.stock = "Stock quantity is required";
        if (formState.sizes.length === 0) newErrors.sizes = "At least one size must be selected";
        if (formState.colors.length === 0) newErrors.colors = "At least one color must be selected";

        // Number validations
        if (formState.price && isNaN(parseFloat(formState.price))) {
            newErrors.price = "Price must be a valid number";
        }

        if (formState.discount && isNaN(parseFloat(formState.discount))) {
            newErrors.discount = "Discount must be a valid number";
        }

        if (formState.discount) {
            const discount = parseFloat(formState.discount);
            if (discount < 0 || discount > 100) {
                newErrors.discount = "Discount must be between 0 and 100";
            }
        }

        if (formState.stock && isNaN(parseInt(formState.stock))) {
            newErrors.stock = "Stock must be a valid number";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            // Show the first error
            const firstError = Object.values(errors)[0];
            if (firstError) toast.error(firstError);
            return;
        }

        setLoading(true);

        try {
            const productData = {
                name: formState.name,
                description: formState.description,
                price: parseFloat(formState.price),
                discount: formState.discount ? parseFloat(formState.discount) : 0,
                size: formState.sizes,
                color: formState.colors,
                category: formState.category,
                stock: parseInt(formState.stock),
            };

            // Add image if a new one was selected
            if (mainImageFile) {
                productData.image = mainImageFile;
            }

            // Add additional images if new ones were selected
            if (additionalImageFiles.length > 0) {
                productData.additionalImages = additionalImageFiles;
            }

            const response = await updateProduct(product._id, productData);

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

    const calculateDiscountedPrice = (price, discountPercentage) => {
        if (!price || !discountPercentage) return '';

        const numPrice = parseFloat(price);
        const numDiscount = parseFloat(discountPercentage);

        if (isNaN(numPrice) || isNaN(numDiscount)) return '';

        const discountedPrice = numPrice * (1 - numDiscount / 100);
        return discountedPrice.toFixed(2);
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <div style={{ willChange: "transform", translateZ: 0 }} className="fixed top-0 left-0 h-screen w-full flex items-center justify-center bg-[#1111111c] transition-all duration-150 z-20 noScrollbar">
                    <motion.div
                        key="edit-product-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 400 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.5, y: 400 }}
                        transition={{ duration: 0.6, ease: "backOut" }}
                        style={{ willChange: "transform", translateZ: 0 }}
                        className="bg-[#1f1f1f] text-[#fff] p-6 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto noScrollbar"
                    >
                        <h2 className="text-2xl font-bold mb-4 text-[#ffbb00]">Edit Product</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Main Image Upload */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2'>
                                    Product Image
                                </label>
                                <div className="flex items-center space-x-4">
                                    <div
                                        className='w-24 h-24 border-2 border-dashed border-[#ffbb00] flex items-center justify-center rounded-lg overflow-hidden'
                                        style={{ background: mainImagePreview ? 'transparent' : '#2a2a2a' }}
                                    >
                                        {mainImagePreview !== null ? (
                                            <img
                                                loading="lazy"
                                                src={typeof mainImagePreview === 'string'
                                                    ? (mainImagePreview.startsWith('data:')
                                                        ? mainImagePreview
                                                        : `data:image/jpeg;base64,${mainImagePreview}`)
                                                    : ''}
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
                                                accept="image/jpeg,image/png,image/gif"
                                                onChange={handleMainImageChange}
                                                className='absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer flex items-center justify-center'
                                            />
                                            <div className='cursor-pointer border-2 border-gray-500 text-[#fff] py-2 px-4 rounded-lg inline-block AddToCartInStore pointer-events-none'>
                                                Choose Main Image
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {errors.mainImage && (
                                    <p className='text-red-500 text-xs mt-1'>{errors.mainImage}</p>
                                )}
                            </div>

                            {/* Additional Images Upload */}
                            <div className='mb-6'>
                                <label className='block text-sm font-medium mb-2'>
                                    Additional Images
                                </label>
                                <input
                                    type="file"
                                    multiple
                                    accept="image/jpeg,image/png,image/gif"
                                    onChange={handleAdditionalImagesChange}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2"
                                />
                                <p className='text-xs text-gray-400 mt-1'>
                                    JPEG, PNG, GIF only, max 5MB each
                                </p>
                                {additionalImageFiles.length > 0 && (
                                    <p className='text-xs text-green-400 mt-1'>
                                        {additionalImageFiles.length} additional image(s) selected
                                    </p>
                                )}
                                {additionalImagePreviews.length > 0 && (
                                    <div className="flex space-x-2 mt-2">
                                        {additionalImagePreviews.map((preview, index) => (
                                            <div
                                                key={index}
                                                className="w-16 h-16 border rounded overflow-hidden"
                                            >
                                                {console.log(preview)}
                                                {isOpen && <img
                                                    loading="lazy"
                                                    src={typeof preview === 'string'
                                                        ? (preview.startsWith('data:')
                                                            ? preview
                                                            : `data:image/jpeg;base64,${preview}`)
                                                        : ''}
                                                    alt={`Additional preview ${index + 1}`}
                                                    className="w-full h-full object-cover"
                                                />}
                                            </div>
                                        ))}
                                    </div>
                                )}
                                {errors.additionalImages && (
                                    <p className='text-red-500 text-xs mt-1'>{errors.additionalImages}</p>
                                )}
                            </div>

                            {/* Product name */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Product Name <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formState.name}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    placeholder="Enter product name"
                                    required
                                />
                                {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                            </div>

                            {/* Description Field */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-1">
                                    Description <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    name="description"
                                    value={formState.description}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    placeholder="Enter product description"
                                    rows="3"
                                    required
                                />
                                {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
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
                                {errors.sizes && (
                                    <p className='text-red-500 text-xs mt-1'>{errors.sizes}</p>
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
                                            colorInput: e.target.value
                                        }))}
                                        placeholder="Enter color name"
                                        className='flex-grow bg-[#3a3a3a] border border-[#4a4a4a] rounded-lg p-2'
                                    />
                                    <button
                                        type="button"
                                        id="NavBarButtons"
                                        onClick={() => handleColorManagement('add')}
                                        className='bg-[#ffbb00] text-black px-4 py-2 rounded-lg cursor-pointer'
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
                                {errors.colors && (
                                    <p className='text-red-500 text-xs mt-1'>{errors.colors}</p>
                                )}
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Category <span className="text-red-500">*</span>
                                </label>
                                <select
                                    name="category"
                                    value={formState.category}
                                    onChange={handleInputChange}
                                    className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map((cat) => (
                                        <option
                                            key={cat}
                                            value={cat.toLowerCase()}
                                        >
                                            {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                        </option>
                                    ))}
                                </select>
                                {errors.category && <p className="text-red-500 text-xs mt-1">{errors.category}</p>}
                            </div>

                            {/* Price and Discount */}
                            <div className='grid md:grid-cols-2 gap-4'>
                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Price <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="price"
                                        value={formState.price}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Enter price"
                                        required
                                    />
                                    {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-1">
                                        Discount (%)
                                    </label>
                                    <input
                                        type="text"
                                        name="discount"
                                        value={formState.discount}
                                        onChange={handleInputChange}
                                        className="w-full bg-[#2a2a2a] border border-[#3a3a3a] rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#ffbb00]"
                                        placeholder="Enter discount percentage"
                                    />
                                    {errors.discount && <p className="text-red-500 text-xs mt-1">{errors.discount}</p>}
                                    {formState.price && formState.discount && (
                                        <p className='text-xs text-gray-400 mt-1'>
                                            Discounted Price: ${calculateDiscountedPrice(formState.price, formState.discount)}
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Stock */}
                            <div>
                                <label className="block text-sm font-medium mb-1">
                                    Stock <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="number"
                                    name="stock"
                                    value={formState.stock}
                                    onChange={handleInputChange}
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
                                    className="bg-[#3a3a3a] text-white py-2 px-4 rounded-lg transition-colors duration-300 cursor-pointer hover:bg-[#797979]"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-[#fff] text-[#1f1f1f] font-bold py-2 px-6 rounded-lg flex items-center justify-center cursor-pointer AddToCartInStore border-2"
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