/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react'
import Transition from './../Transition';
import useDelayedNavigation from '../utils/useDelayedNavigation';
import useAuthStatus from '../utils/IsLoggedInChecker';
import BarLoader from '../components/Loaders/CustomLoader1';
import AfterSignedInNavBar from '../components/NavBars/AfterSignedInNavBar';
import BeforeSignedInNavBar from '../components/NavBars/BeforeSignedInNavBar';
import { useParams } from 'react-router-dom';
import { getProductById } from '../utils/ProductService';
import { motion } from 'framer-motion';
import { Package2Icon } from 'lucide-react';

const StarIcon = ({ filled, onClick, size = 20 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={size}
        height={size}
        fill={filled ? '#FFD700' : '#E0E0E0'}
        onClick={onClick}
        className="cursor-pointer"
    >
        <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
    </svg>
);

const CustomModal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-600 hover:text-gray-900"
                    >
                        ✕
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

const ProductPage = () => {
    const { animate, handleDelayedNavigation } = useDelayedNavigation();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [newReview, setNewReview] = useState({
        rating: 0,
        comment: ''
    });

    const { id } = useParams();
    const { isLoggedIn, loading: authLoading } = useAuthStatus();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await getProductById(id);
                if (response.success) {
                    setProduct(response.product);
                    setSelectedImage(response.product.image);
                }
            } catch (error) {
                console.error('Failed to fetch product', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const handleAddToCart = () => {
        // TODO: Implement add to cart functionality
        console.log('Add to cart', { product, size: selectedSize, color: selectedColor, quantity });
    };

    const handleReviewSubmit = () => {
        // TODO: Implement review submission logic
        if (!isLoggedIn) {
            alert('Please log in to submit a review');
            return;
        }
        console.log('Submit review', newReview);
        setReviewModalOpen(false);
    };

    const renderStars = (rating) => {
        return [...Array(5)].map((_, index) => (
            <StarIcon
                key={index}
                filled={index < rating}
            />
        ));
    };

    if (loading || authLoading) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <BarLoader />
            </div>
        );
    }

    if (!product) {
        return (
            <div className='h-screen w-screen bg-[#fbffef] flex items-center justify-center'>
                <motion.div
                    initial={{ opacity: 0, y: 100 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                    className="flex flex-col items-center justify-center h-96 rounded-3xl p-8 col-span-3"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                        className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                    >
                        <Package2Icon size={48} className="text-[#ffbb00]" />
                    </motion.div>
                    <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2">No Product Found !</h2>
                    <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                        There might be an issue in fetching Product...
                    </p>
                </motion.div>
            </div>
        );
    }

    return (
        <>
            <Transition animate={animate} />
            {isLoggedIn ? <AfterSignedInNavBar /> : <BeforeSignedInNavBar />}

            <div className=" mt-[10.6vh] mx-auto px-4 py-8 grid md:grid-cols-2 gap-8">
                {/* Image Gallery */}
                <div className="flex flex-col">
                    <div className="mb-4 border rounded-lg overflow-hidden">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-[500px] object-cover"
                        />
                    </div>
                    <div className="flex space-x-2">
                        {/* Main Image */}
                        <img
                            src={product?.image}
                            alt={product.name}
                            className="w-20 h-20 object-cover cursor-pointer border rounded"
                            onClick={() => setSelectedImage(product.image)}
                        />
                        {/* Additional Images */}
                        {product.additionalImages?.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`${product.name} - Additional ${index + 1}`}
                                className="w-20 h-20 object-cover cursor-pointer border rounded"
                                onClick={() => setSelectedImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
                    <p className="text-gray-600 mb-4">{product.description}</p>

                    {/* Pricing */}
                    <div className="flex items-center mb-4">
                        <span className="text-2xl font-bold text-green-600 mr-4">
                            ${product.discountPrice || product.price}
                        </span>
                        {product.discountPrice && (
                            <span className="line-through text-gray-400">
                                ${product.price}
                            </span>
                        )}
                        {product.discount > 0 && (
                            <span className="ml-4 bg-red-500 text-white px-2 py-1 rounded text-sm">
                                {product.discount}% OFF
                            </span>
                        )}
                    </div>

                    {/* Size Selection */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Select Size</h3>
                        <div className="flex space-x-2">
                            {product.size.map((size) => (
                                <button
                                    key={size}
                                    className={`px-4 py-2 border rounded ${selectedSize === size
                                        ? 'bg-black text-white'
                                        : 'bg-white text-black'
                                        }`}
                                    onClick={() => setSelectedSize(size)}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Color Selection */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Select Color</h3>
                        <div className="flex space-x-2">
                            {product.color.map((color) => (
                                <button
                                    key={color}
                                    className={`w-10 h-10 rounded-full border ${selectedColor === color
                                        ? 'ring-2 ring-black'
                                        : ''
                                        }`}
                                    style={{ backgroundColor: color }}
                                    onClick={() => setSelectedColor(color)}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Quantity */}
                    <div className="mb-4">
                        <h3 className="font-semibold mb-2">Quantity</h3>
                        <div className="flex items-center">
                            <button
                                className="px-3 py-1 border"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                -
                            </button>
                            <span className="px-4">{quantity}</span>
                            <button
                                className="px-3 py-1 border"
                                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                            >
                                +
                            </button>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">
                            {product.stock} items available
                        </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <button
                            id="Shp-Now-Home-Start"
                            className="AddToCartInStore w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors"
                            onClick={handleAddToCart}
                        >
                            Add to Cart
                        </button>
                    </div>

                    {/* Reviews Section */}
                    <div className="mt-8">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Reviews</h2>
                            <button
                                className="px-4 py-2 border rounded"
                                onClick={() => setReviewModalOpen(true)}
                            >
                                Write a Review
                            </button>
                        </div>

                        {/* Existing Reviews */}
                        {product.reviews && product.reviews.length > 0 ? (
                            <div className="space-y-4">
                                {product.reviews.map((review, index) => (
                                    <div key={index} className="border-b pb-4">
                                        <div className="flex items-center mb-2">
                                            {renderStars(review.rating)}
                                        </div>
                                        <p className="text-gray-600">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500">No reviews yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            <CustomModal
                isOpen={reviewModalOpen}
                onClose={() => setReviewModalOpen(false)}
                title="Add a Review"
            >
                <div className="flex justify-center mb-4">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <StarIcon
                            key={star}
                            size={30}
                            filled={star <= newReview.rating}
                            onClick={() => setNewReview({ ...newReview, rating: star })}
                        />
                    ))}
                </div>
                <div className="mb-4">
                    <label htmlFor="review" className="block mb-2">Your Review</label>
                    <textarea
                        id="review"
                        className="w-full border rounded p-2"
                        placeholder="Write your review here"
                        value={newReview.comment}
                        onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
                        rows={4}
                    />
                </div>
                <button
                    className="w-full px-4 py-2 bg-black text-white rounded hover:bg-gray-800"
                    onClick={handleReviewSubmit}
                >
                    Submit Review
                </button>
            </CustomModal>
        </>
    );
}

export default ProductPage;