/* eslint-disable no-case-declarations */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Transition from '../../Transition'
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { addProduct, getAllProducts } from '../../utils/OwnerService';
import { toast } from 'react-toastify';

const ProductsManager = () => {
    const { animate } = useDelayedNavigation();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fixed size options for all categories
    const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    const categories = ["kids", "mens", "womens"];

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
        errors: {}
    });

    const refreshProducts = async () => {
        try {
            setLoading(true);
            const response = await getAllProducts();
            if (response.success) {
                setProducts(response.products);
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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormState(prev => ({
            ...prev,
            [name]: value,
            errors: { ...prev.errors, [name]: '' }
        }));
    };

    const handleImageChange = (e, type = 'main') => {
        const file = type === 'main' ? e.target.files[0] : Array.from(e.target.files);

        if (type === 'main' && file) {
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
        } else if (type === 'additional') {
            setFormState(prev => ({
                ...prev,
                additionalImageFiles: file
            }));
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

    const validateForm = () => {
        const errors = {};
        const requiredFields = ['name', 'description', 'price', 'category', 'stock'];

        requiredFields.forEach(field => {
            if (!formState[field]?.toString().trim()) {
                errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`;
            }
        });

        if (!formState.mainImageFile) errors.mainImage = "Main image is required";
        if (formState.sizes.length === 0) errors.sizes = "At least one size is required";
        if (formState.colors.length === 0) errors.colors = "At least one color is required";

        setFormState(prev => ({ ...prev, errors }));
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const formData = new FormData();

            // Append main image
            formData.append('image', formState.mainImageFile);

            // Append additional images
            formState.additionalImageFiles.forEach(file => {
                formData.append('additionalImages', file);
            });

            // Append other form data
            const productDataToSubmit = {
                name: formState.name,
                description: formState.description,
                price: formState.price,
                discount: formState.discount || 0,
                sizes: JSON.stringify(formState.sizes),
                colors: JSON.stringify(formState.colors),
                category: formState.category,
                stock: formState.stock,
                brand: 'AceOne'
            };

            Object.entries(productDataToSubmit).forEach(([key, value]) => {
                formData.append(key, value);
            });

            const response = await addProduct(formData);

            if (response.success) {
                toast.success(`${formState.name} Added Successfully`);
                // Reset form
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
                    errors: {}
                });
                await refreshProducts();
            } else {
                toast.error(response.message || "Failed to add product");
            }
        } catch (error) {
            toast.error("Error adding product");
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
                        {/* Previous code for image upload remains the same */}

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

                        {/* Rest of the code remains the same */}

                        {/* Category Dropdown remains the same */}
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

                        {/* Remaining form code stays the same */}
                    </form>
                </div>
            </div>
        </>
    );
};

export default ProductsManager;