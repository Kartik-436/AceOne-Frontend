/* eslint-disable no-unused-vars */


import React, { useEffect, useState } from 'react';
import { Package, ChevronRight, X, Calendar, CreditCard, Truck, Trash, DownloadIcon } from 'lucide-react';
import { getUserOrders, cancelOrder } from '../../utils/UserService';
import { motion } from 'motion/react';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import Transition from './../../Transition';
import CancelOrderModal from './CancelOrderModal';
import { toast } from 'react-toastify';
import { downloadInvoice, getInvoiceByOrderId } from '../../utils/invoiceService';

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [cancelingOrderId, setCancelingOrderId] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);
    const { animate, handleDelayNavigation } = useDelayedNavigation();

    useEffect(() => {
        const fetchOrderData = async () => {
            setLoading(true);
            const response = await getUserOrders();
            if (response.success && Array.isArray(response.orders)) {
                setOrders(response.orders);
            } else {
                setOrders([]);
                console.error(response.message);
            }
            setLoading(false);
        };

        fetchOrderData();
    }, []);

    const openCancelModal = (orderId) => {
        setOrderToCancel(orderId);
        setShowCancelModal(true);
    };

    const closeCancelModal = () => {
        setShowCancelModal(false);
        setOrderToCancel(null);
    };

    const handleCancelOrder = async (orderId, reason) => {
        setCancelingOrderId(orderId);
        const response = await cancelOrder(orderId, reason);

        if (response.success) {

            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order._id === orderId
                        ? {
                            ...order,
                            orderStatus: 'Cancelled',
                            cancelledAt: new Date(),
                            cancellationReason: reason
                        }
                        : order
                )
            );
            setSelectedOrder(null);
            toast.success(response.message || "Order cancelled successfully");
        } else {
            toast.error(response.message || 'Failed to cancel order');
        }
        setCancelingOrderId(null);
        setShowCancelModal(false);
    };


    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            case 'processing':
                return 'bg-blue-100 text-blue-800';
            case 'shipped':
                return 'bg-indigo-100 text-indigo-800';
            case 'delivered':
                return 'bg-green-100 text-green-800';
            case 'cancelled':
                return 'bg-red-100 text-red-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const handleDownloadInvoice = async (orderID) => {
        try {

            const invoiceDetails = await getInvoiceByOrderId(orderID);

            if (invoiceDetails && invoiceDetails._id) {
                await downloadInvoice(invoiceDetails._id, invoiceDetails.invoiceNumber);
            } else {
                console.error('Invoice details not found or incomplete');

                alert('Unable to find invoice for this order');
            }
        } catch (error) {
            console.error('Error downloading invoice:', error);

            alert('Failed to download invoice. Please try again later.');
        }
    };

    return (
        <>
            <Transition animate={animate} />
            <div className="h-full min-w-full flex flex-col">
                <h2 className="text-2xl font-bold mb-6">My Orders</h2>

                <div className="flex-1 min-w-full overflow-y-auto noScrollbar max-h-full">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#ffbb00]"></div>
                        </div>
                    ) : orders.length === 0 ? (
                        <motion.div
                            initial={{ opacity: 0, y: 100 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, delayChildren: 0.5, type: "spring", stiffness: 200 }}
                            className="flex flex-col items-center justify-center h-96 rounded-3xl p-8 px-4 sm:px-8"
                        >
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.5, type: "spring", stiffness: 200 }}
                                className="w-24 h-24 bg-[#ffbb00]/10 rounded-full flex items-center justify-center mb-6"
                            >
                                <Package size={48} className="text-[#ffbb00]" />
                            </motion.div>
                            <h2 className="text-2xl font-bold text-[#1f1f1f] mb-2 text-center">No Orders Yet.</h2>
                            <p className="text-[#1f1f1f]/70 text-center max-w-md mb-6">
                                Items you love can be Ordered within a minute. Start exploring and order some favorites!
                            </p>
                            <button
                                onClick={() => handleDelayNavigation("store")}
                                className="bg-[#1f1f1f] text-white px-6 py-3 rounded-full font-medium hover:bg-[#1f1f1f]/90 transition-all cursor-pointer AddToCartInStore"
                            >
                                Discover Products
                            </button>
                        </motion.div>
                    ) : (
                        <div className="space-y-4">
                            {orders.map(order => (
                                <div key={order._id} className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-shadow">
                                    <div
                                        className="p-4 cursor-pointer"
                                        onClick={() => setSelectedOrder(selectedOrder === order._id ? null : order._id)}
                                    >
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="w-full sm:w-auto">
                                                <div className="flex flex-wrap items-center gap-3">
                                                    <span className="font-bold text-sm text-gray-600 break-all">Order #{order._id}</span>
                                                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(order.orderStatus)}`}>
                                                        {order.orderStatus || 'Processing'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 mt-1">
                                                    <Calendar size={14} className="inline mr-1" />
                                                    Ordered on {formatDate(order.orderDate || order.createdAt)}
                                                </p>
                                            </div>

                                            <div className="flex items-center gap-4 sm:gap-6 w-full sm:w-auto justify-between sm:justify-end">
                                                <div>
                                                    <p className="text-xs text-gray-600">Items</p>
                                                    <p className="font-medium">{(order.items || []).length}</p>
                                                </div>

                                                <div>
                                                    <p className="text-xs text-gray-600">Total</p>
                                                    <p className="font-medium">₹{order.totalAmount.toFixed(2) || 0}</p>
                                                </div>

                                                <ChevronRight
                                                    size={20}
                                                    className={`transform transition-transform ${selectedOrder === order._id ? 'rotate-90' : ''}`}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {selectedOrder === order._id && (
                                        <div className="px-4 pb-4 border-t border-gray-200 pt-3">
                                            <div className="bg-white rounded-lg p-4 border border-gray-100">
                                                <div className="mb-4">
                                                    <h3 className="font-semibold text-gray-800 mb-2">Order Details</h3>
                                                    <div className="grid grid-cols-1 xs:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                                                        <div className="mb-2 xs:mb-0">
                                                            <p className="text-gray-600">Order ID:</p>
                                                            <p className="font-medium break-all">{order._id}</p>
                                                        </div>
                                                        <div className="mb-2 xs:mb-0">
                                                            <p className="text-gray-600">Payment Method:</p>
                                                            <p className="font-medium flex items-center">
                                                                <CreditCard size={14} className="mr-1 flex-shrink-0" />
                                                                <span className="truncate">{order.modeOfPayment || 'N/A'}</span>
                                                            </p>
                                                        </div>
                                                        <div className="mb-2 xs:mb-0">
                                                            <p className="text-gray-600">Status:</p>
                                                            <p className={`font-medium ${order.orderStatus?.toLowerCase() === 'cancelled' ? 'text-red-600' : ''}`}>
                                                                {order.orderStatus || 'Processing'}
                                                            </p>
                                                        </div>
                                                        <div className="mb-2 xs:mb-0">
                                                            <p className="text-gray-600">Delivery Fee:</p>
                                                            <p className="font-medium">₹{order.deliveryFee || 0}</p>
                                                        </div>
                                                    </div>
                                                </div>

                                                {order.address && (
                                                    <div className="mb-4">
                                                        <h3 className="font-semibold text-gray-800 mb-2">Shipping Address</h3>
                                                        <div className="flex items-start gap-2 text-sm">
                                                            <Truck size={16} className="text-gray-500 mt-0.5 flex-shrink-0" />
                                                            <p className="text-gray-700 break-words">
                                                                {order.address.street || ''},
                                                                {order.address.city || ''},
                                                                {order.address.state || ''}
                                                                {order.address.pincode || 'N/A'}
                                                            </p>
                                                        </div>
                                                    </div>
                                                )}

                                                <div>
                                                    <h3 className="font-semibold text-gray-800 mb-2">Items</h3>
                                                    <div className="space-y-3 max-h-60 overflow-y-auto NoScrollbar">
                                                        {(order.items || []).map((item, index) => (
                                                            <div key={index} className="flex items-center gap-3 bg-gray-50 p-2 rounded-lg flex-wrap sm:flex-nowrap">
                                                                <div className="w-12 h-12 bg-gray-200 rounded-md flex items-center justify-center overflow-hidden flex-shrink-0">
                                                                    {item.product?.image ? (
                                                                        <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                                                                    ) : (
                                                                        <Package size={20} />
                                                                    )}
                                                                </div>
                                                                <div className="flex-1 min-w-0">
                                                                    <p className="font-medium text-sm truncate">{item.product?.name || 'Product Name'}</p>
                                                                    <div className="flex flex-wrap items-center text-xs text-gray-600 gap-1">
                                                                        <span>Qty: {item.quantity} ×</span>
                                                                        {item.product?.discount > 0 ? (
                                                                            <span className="flex flex-wrap items-center">
                                                                                <span className="line-through text-gray-400 mr-1">₹{item.product?.price || 0}</span>
                                                                                <span className="text-green-600 font-medium">₹{item.product?.discountPrice.toFixed(2) || 0}</span>
                                                                                <span className="ml-1 bg-green-100 text-green-700 px-1 rounded text-xxs">
                                                                                    {item.product?.discount}% OFF
                                                                                </span>
                                                                            </span>
                                                                        ) : (
                                                                            <span>₹{item.product?.price || 0}</span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right ml-auto">
                                                                    {item.product?.discount > 0 ? (
                                                                        <>
                                                                            <p className="font-medium">
                                                                                ₹{(item.product?.discountPrice * item.quantity).toFixed(2)}
                                                                            </p>
                                                                            <p className="text-xs text-gray-400 line-through">
                                                                                ₹{(item.quantity * (item.product?.price || 0)).toFixed(2)}
                                                                            </p>
                                                                        </>
                                                                    ) : (
                                                                        <p className="font-medium">₹{(item.quantity * (item.product?.price || 0)).toFixed(2)}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-gray-100 pt-3">
                                                    <div className="flex justify-between font-medium">
                                                        <span>Subtotal:</span>
                                                        <span>₹{order.totalAmount.toFixed(2) ? (order.totalAmount - (order.deliveryFee || 0)).toFixed(2) : 0}</span>
                                                    </div>
                                                    <div className="flex justify-between text-sm text-gray-600 mt-1">
                                                        <span>Delivery Fee:</span>
                                                        <span>₹{order.deliveryFee || 0}</span>
                                                    </div>
                                                    <div className="flex justify-between font-bold text-lg mt-2">
                                                        <span>Total:</span>
                                                        <span>₹{order.totalAmount.toFixed(2) || 0}</span>
                                                    </div>
                                                </div>

                                                <div className="mt-4 border-t border-gray-100 pt-3">
                                                    <button
                                                        id='Shp-Now-Home-Start'
                                                        onClick={() => handleDownloadInvoice(order._id)}
                                                        className="w-full bg-white text-black py-2 rounded-md text-sm flex items-center justify-center"
                                                    >
                                                        <DownloadIcon size={16} className="mr-1" />
                                                        Download Invoice
                                                    </button>
                                                </div>

                                                {order.orderStatus?.toLowerCase() !== 'cancelled' &&
                                                    order.orderStatus?.toLowerCase() !== 'delivered' &&
                                                    order.orderStatus?.toLowerCase() !== 'shipped' && (
                                                        <div className="mt-4 border-t border-gray-100 pt-3">
                                                            <button
                                                                onClick={() => openCancelModal(order._id)}
                                                                className="w-full bg-red-600 text-white py-2 rounded-md hover:bg-red-700 transition-colors text-sm flex items-center justify-center"
                                                            >
                                                                <Trash size={16} className="mr-1" />
                                                                Cancel Order
                                                            </button>
                                                        </div>
                                                    )}

                                                {order.orderStatus?.toLowerCase() === 'cancelled' && order.cancellationReason && (
                                                    <div className="mt-4 border-t border-gray-100 pt-3">
                                                        <div className="bg-red-50 p-3 rounded-md">
                                                            <p className="text-sm font-medium text-red-800">Cancellation Reason:</p>
                                                            <p className="text-sm text-red-700">{order.cancellationReason}</p>
                                                            {order.cancelledAt && (
                                                                <p className="text-xs text-red-600 mt-1">
                                                                    Cancelled on {formatDate(order.cancelledAt)}
                                                                </p>
                                                            )}
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Cancel Order Confirmation Modal */}
            <CancelOrderModal
                isOpen={showCancelModal}
                onClose={closeCancelModal}
                onConfirm={handleCancelOrder}
                orderId={orderToCancel}
                isLoading={cancelingOrderId === orderToCancel}
            />
        </>
    );
};

export default Orders;