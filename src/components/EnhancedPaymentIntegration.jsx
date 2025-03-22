/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { X, CreditCard, Smartphone, CheckCircle, AlertCircle } from 'lucide-react';
import { toast } from 'react-toastify';
import { placeOrder } from '../utils/UserService';
import useDelayedNavigation from '../utils/useDelayedNavigation';

// Enhanced CheckoutButton component
const CheckoutButton = ({ isLoggedIn, user, deliveryFee, refreshCart, refreshUser }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    const handleCheckoutClick = () => {
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

    const handlePaymentSubmit = async (paymentData) => {
        setIsProcessing(true);

        try {
            // Prepare order data based on payment method
            const orderData = {
                modeOfPayment: paymentData.paymentMode,
                deliveryFee,
                deliveryAddress: user?.address
            };

            // Add payment method details for online payments
            if (paymentData.paymentMode === "Online") {
                orderData.paymentMethod = paymentData.paymentMethod;

                if (paymentData.paymentMethod === "card") {
                    orderData.cardDetails = {
                        cardNumber: paymentData.cardNumber,
                        expiryMonth: paymentData.expiryMonth,
                        expiryYear: paymentData.expiryYear,
                        cvv: paymentData.cvv,
                        nameOnCard: paymentData.nameOnCard
                    };
                } else if (paymentData.paymentMethod === "upi") {
                    orderData.upiDetails = {
                        vpa: paymentData.vpa,
                        payeeName: user?.name
                    };
                }
            }

            const result = await placeOrder(orderData);

            if (result.success) {
                await refreshCart();
                await refreshUser();
                toast.success(`Order placed successfully!`);

                // If order is placed but payment is still processing
                if (result.data && result.data.orderStatus === "Pending" &&
                    result.data.paymentDetails && result.data.paymentDetails.paymentStatus === "processing") {
                    toast.info("Payment is being processed. You'll receive confirmation shortly.");
                }
            } else {
                toast.error(result.message || "Failed to place order.");
            }
        } catch (error) {
            console.error("Order placement error:", error);
            toast.error("An error occurred while placing your order.");
        } finally {
            setIsProcessing(false);
            setIsModalOpen(false);
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

            {/* Enhanced Payment Modal */}
            <EnhancedPaymentModal
                isOpen={isModalOpen}
                onClose={() => !isProcessing && setIsModalOpen(false)}
                onSubmit={handlePaymentSubmit}
                isProcessing={isProcessing}
                user={user}
                total={deliveryFee}  // This should be the actual total with cart items
            />
        </>
    );
};

// Enhanced Payment Modal with support for different payment methods
const EnhancedPaymentModal = ({ isOpen, onClose, onSubmit, isProcessing, user, total }) => {
    const [paymentMode, setPaymentMode] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("");
    const [cardNumber, setCardNumber] = useState("");
    const [expiryMonth, setExpiryMonth] = useState("");
    const [expiryYear, setExpiryYear] = useState("");
    const [cvv, setCvv] = useState("");
    const [nameOnCard, setNameOnCard] = useState("");
    const [vpa, setVpa] = useState("");
    const [currentStep, setCurrentStep] = useState(1);
    const [formErrors, setFormErrors] = useState({});

    useEffect(() => {
        // Reset form when modal opens
        if (isOpen) {
            setPaymentMode("");
            setPaymentMethod("");
            setCardNumber("");
            setExpiryMonth("");
            setExpiryYear("");
            setCvv("");
            setNameOnCard("");
            setVpa("");
            setCurrentStep(1);
            setFormErrors({});
        }
    }, [isOpen]);

    const validateStep1 = () => {
        if (!paymentMode) {
            setFormErrors({ paymentMode: "Please select a payment mode" });
            return false;
        }
        return true;
    };

    const validateStep2 = () => {
        const errors = {};

        if (paymentMode === "Online" && !paymentMethod) {
            errors.paymentMethod = "Please select a payment method";
        }

        if (paymentMethod === "card") {
            if (!cardNumber || cardNumber.length < 14 || cardNumber.length > 16) {
                errors.cardNumber = "Please enter a valid card number";
            }
            if (!expiryMonth || !expiryYear) {
                errors.expiry = "Please enter a valid expiry date";
            }
            if (!cvv || cvv.length !== 3) {
                errors.cvv = "Please enter a valid CVV";
            }
            if (!nameOnCard) {
                errors.nameOnCard = "Please enter the name on your card";
            }
        }

        if (paymentMethod === "upi") {
            if (!vpa || !vpa.includes('@')) {
                errors.vpa = "Please enter a valid UPI ID";
            }
        }

        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleNextStep = () => {
        if (currentStep === 1 && validateStep1()) {
            setCurrentStep(2);
        }
    };

    const handlePrevStep = () => {
        setCurrentStep(1);
    };

    const handleSubmit = () => {
        if (paymentMode === "Cash on Delivery" || validateStep2()) {
            const paymentData = {
                paymentMode,
                ...(paymentMode === "Online" && {
                    paymentMethod,
                    ...(paymentMethod === "card" && {
                        cardNumber,
                        expiryMonth,
                        expiryYear,
                        cvv,
                        nameOnCard
                    }),
                    ...(paymentMethod === "upi" && {
                        vpa
                    })
                })
            };

            onSubmit(paymentData);
        }
    };

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

                        {/* Step indicator */}
                        <div className="flex justify-center mb-5">
                            <div className="flex items-center">
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${currentStep === 1 ? 'bg-[#ffbb00] text-black border-[#ffbb00]' : 'border-white text-white'}`}>
                                    1
                                </div>
                                <div className={`w-10 h-1 ${currentStep === 2 ? 'bg-[#ffbb00]' : 'bg-gray-600'}`}></div>
                                <div className={`h-8 w-8 rounded-full flex items-center justify-center border-2 ${currentStep === 2 ? 'bg-[#ffbb00] text-black border-[#ffbb00]' : 'border-white text-white'}`}>
                                    2
                                </div>
                            </div>
                        </div>

                        {/* Step 1: Select Payment Mode */}
                        {currentStep === 1 && (
                            <>
                                <h2 className="text-2xl font-semibold text-center mb-4 text-[#fff]">
                                    Select Payment Mode
                                </h2>

                                <div className="space-y-3">
                                    <button
                                        className={`w-full py-3 rounded-xl border-[1px] transition-all ${paymentMode === "Online"
                                            ? "bg-[#ffbb00] text-black border-[#ffbb00]"
                                            : "bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00]"
                                            } AddToCartInStore`}
                                        onClick={() => setPaymentMode("Online")}
                                        disabled={isProcessing}
                                    >
                                        Online Payment
                                    </button>

                                    <button
                                        className={`w-full py-3 rounded-xl border-[1px] transition-all ${paymentMode === "Cash on Delivery"
                                            ? "bg-[#ffbb00] text-black border-[#ffbb00]"
                                            : "bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00]"
                                            } AddToCartInStore`}
                                        onClick={() => setPaymentMode("Cash on Delivery")}
                                        disabled={isProcessing}
                                    >
                                        Cash on Delivery
                                    </button>
                                </div>

                                {formErrors.paymentMode && (
                                    <p className="text-red-500 text-sm mt-2">{formErrors.paymentMode}</p>
                                )}

                                <div className="mt-8 flex justify-between">
                                    <button
                                        onClick={onClose}
                                        disabled={isProcessing}
                                        className={`px-5 py-2 text-white border border-gray-500 rounded-lg ${isProcessing ? 'opacity-50' : 'hover:border-[#ffbb00]'} cursor-pointer transition`}
                                    >
                                        Cancel
                                    </button>

                                    {paymentMode === "Cash on Delivery" ? (
                                        <button
                                            onClick={handleSubmit}
                                            disabled={!paymentMode || isProcessing}
                                            className={`px-5 py-2 rounded-lg transition ${paymentMode && !isProcessing
                                                ? "bg-[#ffbb00] text-black hover:bg-[#e6a800] cursor-pointer"
                                                : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            {isProcessing ? "Processing..." : "Confirm"}
                                        </button>
                                    ) : (
                                        <button
                                            onClick={handleNextStep}
                                            disabled={!paymentMode || isProcessing}
                                            className={`px-5 py-2 rounded-lg transition ${paymentMode && !isProcessing
                                                ? "bg-[#ffbb00] text-black hover:bg-[#e6a800] cursor-pointer"
                                                : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                                }`}
                                        >
                                            Next
                                        </button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Step 2: Payment Details (for Online Payment) */}
                        {currentStep === 2 && paymentMode === "Online" && (
                            <>
                                <h2 className="text-2xl font-semibold text-center mb-4 text-[#fff]">
                                    Payment Details
                                </h2>

                                {/* Payment Method Selection */}
                                <div className="space-y-3 mb-4">
                                    <label className="block text-sm font-medium mb-1">Select Payment Method</label>
                                    <div className="flex space-x-3">
                                        <button
                                            className={`flex-1 py-3 rounded-xl border-[1px] transition-all flex items-center justify-center gap-2 ${paymentMethod === "card"
                                                ? "bg-[#ffbb00] text-black border-[#ffbb00]"
                                                : "bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00]"
                                                }`}
                                            onClick={() => setPaymentMethod("card")}
                                            disabled={isProcessing}
                                        >
                                            <CreditCard size={18} />
                                            Card
                                        </button>

                                        <button
                                            className={`flex-1 py-3 rounded-xl border-[1px] transition-all flex items-center justify-center gap-2 ${paymentMethod === "upi"
                                                ? "bg-[#ffbb00] text-black border-[#ffbb00]"
                                                : "bg-[#1f1f1f] text-white border-gray-500 hover:border-[#ffbb00]"
                                                }`}
                                            onClick={() => setPaymentMethod("upi")}
                                            disabled={isProcessing}
                                        >
                                            <Smartphone size={18} />
                                            UPI
                                        </button>
                                    </div>

                                    {formErrors.paymentMethod && (
                                        <p className="text-red-500 text-sm mt-1">{formErrors.paymentMethod}</p>
                                    )}
                                </div>

                                {/* Card Payment Form */}
                                {paymentMethod === "card" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">Card Number</label>
                                            <input
                                                type="text"
                                                placeholder="1234 5678 9012 3456"
                                                value={cardNumber}
                                                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 16))}
                                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                disabled={isProcessing}
                                            />
                                            {formErrors.cardNumber && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.cardNumber}</p>
                                            )}
                                        </div>

                                        <div className="flex space-x-3">
                                            <div className="flex-1">
                                                <label className="block text-sm font-medium mb-1">Expiry</label>
                                                <div className="flex space-x-2">
                                                    <select
                                                        value={expiryMonth}
                                                        onChange={(e) => setExpiryMonth(e.target.value)}
                                                        className="w-1/2 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                        disabled={isProcessing}
                                                    >
                                                        <option value="">MM</option>
                                                        {Array.from({ length: 12 }, (_, i) => {
                                                            const month = i + 1;
                                                            return (
                                                                <option key={month} value={month}>
                                                                    {month.toString().padStart(2, '0')}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                    <select
                                                        value={expiryYear}
                                                        onChange={(e) => setExpiryYear(e.target.value)}
                                                        className="w-1/2 p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                        disabled={isProcessing}
                                                    >
                                                        <option value="">YY</option>
                                                        {Array.from({ length: 10 }, (_, i) => {
                                                            const year = new Date().getFullYear() + i;
                                                            return (
                                                                <option key={year} value={year.toString().slice(-2)}>
                                                                    {year.toString().slice(-2)}
                                                                </option>
                                                            );
                                                        })}
                                                    </select>
                                                </div>
                                                {formErrors.expiry && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors.expiry}</p>
                                                )}
                                            </div>

                                            <div className="w-1/3">
                                                <label className="block text-sm font-medium mb-1">CVV</label>
                                                <input
                                                    type="text"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 3))}
                                                    className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                    disabled={isProcessing}
                                                />
                                                {formErrors.cvv && (
                                                    <p className="text-red-500 text-sm mt-1">{formErrors.cvv}</p>
                                                )}
                                            </div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium mb-1">Name on Card</label>
                                            <input
                                                type="text"
                                                placeholder="John Doe"
                                                value={nameOnCard}
                                                onChange={(e) => setNameOnCard(e.target.value)}
                                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                disabled={isProcessing}
                                            />
                                            {formErrors.nameOnCard && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.nameOnCard}</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* UPI Payment Form */}
                                {paymentMethod === "upi" && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium mb-1">UPI ID</label>
                                            <input
                                                type="text"
                                                placeholder="name@upi"
                                                value={vpa}
                                                onChange={(e) => setVpa(e.target.value)}
                                                className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
                                                disabled={isProcessing}
                                            />
                                            {formErrors.vpa && (
                                                <p className="text-red-500 text-sm mt-1">{formErrors.vpa}</p>
                                            )}
                                        </div>

                                        <div className="mt-2 p-3 bg-gray-800 rounded-lg flex items-start gap-3">
                                            <div className="mt-1 text-yellow-400">
                                                <AlertCircle size={16} />
                                            </div>
                                            <p className="text-sm text-gray-300">
                                                You&apos;ll be prompted to complete the payment using your UPI app after confirmation.
                                            </p>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-6 flex justify-between">
                                    <button
                                        onClick={handlePrevStep}
                                        disabled={isProcessing}
                                        className={`px-5 py-2 text-white border border-gray-500 rounded-lg ${isProcessing ? 'opacity-50' : 'hover:border-[#ffbb00]'} cursor-pointer transition`}
                                    >
                                        Back
                                    </button>

                                    <button
                                        onClick={handleSubmit}
                                        disabled={!paymentMethod || isProcessing}
                                        className={`px-5 py-2 rounded-lg transition ${paymentMethod && !isProcessing
                                            ? "bg-[#ffbb00] text-black hover:bg-[#e6a800] cursor-pointer"
                                            : "bg-gray-500 text-gray-300 cursor-not-allowed"
                                            }`}
                                    >
                                        {isProcessing ? "Processing..." : "Pay Now"}
                                    </button>
                                </div>
                            </>
                        )}

                        {/* Display order total */}
                        <div className="mt-4 pt-3 border-t border-gray-700">
                            <div className="flex justify-between items-center">
                                <span className="text-gray-400">Total Amount:</span>
                                <span className="text-xl font-semibold">₹{Math.round(total)}</span>
                            </div>
                        </div>

                        {/* Processing indicator */}
                        {isProcessing && (
                            <div className="absolute inset-0 bg-black/50 rounded-2xl flex items-center justify-center">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffbb00] mx-auto mb-4"></div>
                                    <p className="text-white">Processing your payment...</p>
                                </div>
                            </div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export { CheckoutButton, EnhancedPaymentModal };