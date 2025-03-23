/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { toast } from 'react-toastify';
import { placeOrder, verifyPayment } from '../utils/UserService';
import useDelayedNavigation from '../utils/useDelayedNavigation';

const CheckoutButton = ({ isLoggedIn, user, deliveryFee, refreshCart, refreshUser, cart }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { handleDelayNavigation } = useDelayedNavigation();

    // Calculate actual total amount
    const calculateTotalAmount = () => {
        if (!cart || cart.length === 0) return deliveryFee;

        let total = cart.reduce((sum, item) => {
            const price = item.productId.discount === 0
                ? item.productId.price
                : item.productId.discountPrice;
            return sum + (price * item.quantity);
        }, 0);

        return total + deliveryFee;
    };

    const handleCheckoutClick = () => {
        // Check if cart is empty
        if (!cart || cart.length === 0) {
            toast.error("Your cart is empty. Add some items before checkout!");
            return;
        }

        if (isLoggedIn && user?.address) {
            setIsModalOpen(true);
        } else if (!isLoggedIn) {
            toast.error("Please login to place an order!");
            handleDelayNavigation("login");
        } else {
            toast.error("Add your address to place an order!");
            handleDelayNavigation("userprofile");
        }
    };

    const initializeRazorpayPayment = (orderData) => {
        try {
            // Check if Razorpay is available (it should be if loaded in index.html)
            if (!window.Razorpay) {
                throw new Error("Razorpay not loaded. Please refresh the page and try again.");
            }

            // Validate payment data
            if (!orderData?.payment?.razorpayOrderId) {
                throw new Error("Invalid payment data received from server");
            }

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: orderData.payment.amount,
                currency: orderData.payment.currency || "INR",
                name: "AceOne",
                description: `Payment for order #${orderData.order._id}`,
                order_id: orderData.payment.razorpayOrderId,
                handler: async function (response) {
                    try {
                        // Send payment verification to backend
                        const verificationData = {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderData.order._id
                        };

                        const verificationResult = await verifyPayment(verificationData);

                        if (verificationResult.success) {
                            toast.success("Payment completed successfully!");
                            await refreshCart();
                            await refreshUser();
                        } else {
                            toast.error(verificationResult.message || "Payment verification failed");
                        }
                    } catch (error) {
                        console.error("Payment verification error:", error);
                        toast.error("Payment was processed but verification failed");
                    } finally {
                        setIsProcessing(false);
                        setIsModalOpen(false);
                    }
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || ""
                },
                notes: {
                    address: user?.address || "",
                    userId: user?.ID || ""
                },
                theme: {
                    color: "#ffbb00"
                },
                modal: {
                    ondismiss: function () {
                        setIsProcessing(false);
                        toast.info("Payment cancelled. Your order is saved but not confirmed.");
                        setIsModalOpen(false);
                    }
                }
            };

            // Create and open Razorpay instance
            const razorpayInstance = new window.Razorpay(options);
            razorpayInstance.on('payment.failed', function (response) {
                console.error("Payment failed:", response.error);
                toast.error(`Payment failed: ${response.error.description}`);
                setIsProcessing(false);
                setIsModalOpen(false);
            });

            // Open the payment modal
            razorpayInstance.open();

        } catch (error) {
            console.error("Razorpay initialization error:", error);
            toast.error(`Failed to initialize payment: ${error.message}`);
            setIsProcessing(false);
            setIsModalOpen(false);
        }
    };

    const handlePaymentModeSelection = async (paymentMode) => {
        setIsProcessing(true);

        try {
            // Prepare order data
            const orderData = {
                modeOfPayment: paymentMode,
                deliveryFee,
                deliveryAddress: user?.address
            };

            // Place the order
            const result = await placeOrder(orderData);
            if (result.success) {
                if (paymentMode === "Cash on Delivery") {
                    await refreshCart();
                    await refreshUser();
                    toast.success(`Order placed successfully! You'll pay on delivery.`);
                    setIsModalOpen(false);
                    setIsProcessing(false);
                } else if (paymentMode === "Online") {
                    if (result.payment?.razorpayOrderId) {
                        // Initialize Razorpay payment
                        initializeRazorpayPayment(result); // Pass the whole result object
                    } else {
                        console.error("Missing payment data in response:", result);
                        toast.error("Payment data missing. Please try again.");
                        setIsModalOpen(false);
                        setIsProcessing(false);
                    }
                }
            } else {
                toast.error(result.message || "Failed to place order.");
                setIsModalOpen(false);
                setIsProcessing(false);
            }
        } catch (error) {
            console.error("Order process error:", error);
            toast.error(`An error occurred: ${error.message}`);
            setIsModalOpen(false);
            setIsProcessing(false);
        }
    };

    return (
        <>
            <button
                onClick={handleCheckoutClick}
                disabled={isProcessing}
                id="NavBarButtons"
                className={`px-30 py-2 uppercase md:text-base text-lg font-mono font-semibold text-black border-black rounded-full ${isProcessing ? 'opacity-70' : 'active:scale-90'} mt-4 bg-[#ffbb00]`}
            >
                {isProcessing ? "Processing..." : "Checkout"}
            </button>

            {/* Payment Modal */}
            <PaymentModeModal
                isOpen={isModalOpen}
                onClose={() => !isProcessing && setIsModalOpen(false)}
                onSelectPaymentMode={handlePaymentModeSelection}
                isProcessing={isProcessing}
                total={calculateTotalAmount()}
            />
        </>
    );
};

// Payment Modal Component
const PaymentModeModal = ({ isOpen, onClose, onSelectPaymentMode, isProcessing, total }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                >
                    <motion.div
                        className="bg-[#1f1f1f] text-white p-6 rounded-2xl w-96 shadow-lg relative"
                        initial={{ scale: 0.35, opacity: 0, y: 200 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.35, opacity: 0, y: 200 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={onClose}
                            disabled={isProcessing}
                            className={`absolute top-3 right-3 text-[#fff] ${isProcessing ? 'opacity-50' : 'hover:text-red-500'} cursor-pointer transition`}
                        >
                            <X size={28} />
                        </button>

                        <h2 className="text-2xl font-semibold text-center mb-6 text-[#fff]">
                            Select Payment Mode
                        </h2>

                        <div className="space-y-4">
                            <button
                                className="w-full py-3 rounded-xl border-[1px] transition-all bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00] hover:bg-gray-800 flex items-center justify-center AddToCartInStore"
                                onClick={() => onSelectPaymentMode("Online")}
                                disabled={isProcessing}
                            >
                                <span className="mr-2">💳</span> Pay Online
                                <span className="ml-2 text-sm text-gray-400">(via Razorpay)</span>
                            </button>

                            <button
                                className="w-full py-3 rounded-xl border-[1px] transition-all bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00] hover:bg-gray-800 flex items-center justify-center AddToCartInStore"
                                onClick={() => onSelectPaymentMode("Cash on Delivery")}
                                disabled={isProcessing}
                            >
                                <span className="mr-2">💵</span> Cash on Delivery
                            </button>
                        </div>

                        {/* Display order total */}
                        <div className="mt-6 pt-3 border-t border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Amount:</span>
                                <span className="text-xl font-semibold">₹{Math.round(total)}</span>
                            </div>
                        </div>

                        {/* Processing indicator */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 backdrop-blur-md rounded-2xl flex items-center z-50 justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffbb00] mx-auto mb-4"></div>
                                    <p className="text-white">Processing your request...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { CheckoutButton, PaymentModeModal };