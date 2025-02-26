/* eslint-disable no-unused-vars */
// components/UserWishlist.jsx
import React, { useState } from 'react';
import { Heart, ShoppingCart, X, AlertCircle } from 'lucide-react';

const UserWishlist = () => {
    // Mock UserWishlist data
    const [UserWishlistItems, setUserWishlistItems] = useState([
        {
            id: 1,
            name: 'Wireless Noise-Cancelling Headphones',
            price: '$199.99',
            image: '/api/placeholder/100/100'
        },
        {
            id: 2,
            name: 'Smart Watch Series 7',
            price: '$289.99',
            image: '/api/placeholder/100/100'
        },
        {
            id: 3,
            name: 'Ultra HD 4K Monitor 27"',
            price: '$349.99',
            image: '/api/placeholder/100/100'
        }
    ]);

    // Remove item from UserWishlist
    const removeItem = (id) => {
        setUserWishlistItems(UserWishlistItems.filter(item => item.id !== id));
    };

    // Add to cart (in a real app, this would interact with a cart state/API)
    const addToCart = (id) => {
        alert(`Item ${id} added to cart!`);
    };

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My UserWishlist</h2>

            {UserWishlistItems.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Heart size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">Your UserWishlist is empty</h3>
                    <p className="text-gray-500 mt-2">Save items you love to your UserWishlist</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {UserWishlistItems.map(item => (
                        <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-center gap-4">
                                <div className="w-20 h-20 rounded-md overflow-hidden bg-white border border-gray-200">
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="flex-1">
                                    <h3 className="font-medium">{item.name}</h3>
                                    <p className="text-lg font-bold text-[#1f1f1f] mt-1">{item.price}</p>
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        onClick={() => addToCart(item.id)}
                                        className="p-2 bg-[#ffbb00] text-[#1f1f1f] rounded-lg hover:bg-[#e6a800] transition-colors"
                                        title="Add to cart"
                                    >
                                        <ShoppingCart size={20} />
                                    </button>

                                    <button
                                        onClick={() => removeItem(item.id)}
                                        className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                        title="Remove"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserWishlist;