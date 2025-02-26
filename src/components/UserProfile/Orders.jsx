/* eslint-disable no-unused-vars */
// components/Orders.jsx
import React, { useEffect, useState } from 'react';
import { Package, ChevronRight } from 'lucide-react';
import { getUserOrders } from '../../utils/UserService';

const Orders = () => {
    const [orders, setOrders] = useState([])

    useEffect(() => {
        const fetchOrderData = async () => {
            const response = await getUserOrders();
            if (response.success && Array.isArray(response.orders)) {
                setOrders(response.orders);
            } else {
                setOrders([]); //
                console.error(response.message);
            }
        };

        fetchOrderData();
    }, []);

    return (
        <div>
            <h2 className="text-2xl font-bold mb-6">My Orders</h2>

            {orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                    <Package size={48} className="text-gray-400 mb-4" />
                    <h3 className="text-xl font-medium text-gray-600">No orders yet</h3>
                    <p className="text-gray-500 mt-2">Your order history will appear here</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {orders.map(order => (
                        <div key={order._id} className="bg-gray-50 rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                <div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold">{order._id}</span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">Ordered on {order.orderDate}</p>
                                </div>

                                <div className="flex items-center gap-6 w-full sm:w-auto">
                                    <div>
                                        <p className="text-sm text-gray-600">Items</p>
                                        <p className="font-medium">{(order.items || []).length}</p>
                                    </div>

                                    <div>
                                        <p className="text-sm text-gray-600">Total</p>
                                        <p className="font-medium">{order.totalAmount}</p>
                                    </div>

                                    <button className="ml-auto sm:ml-6 p-2 hover:bg-gray-200 rounded-full cursor-pointer">
                                        <ChevronRight size={20} />
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

export default Orders;