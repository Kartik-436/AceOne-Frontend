/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useEffect, useState } from 'react';
import Transition from '../../Transition';
import useDelayedNavigation from '../../utils/useDelayedNavigation';
import { getRevenueStats, getDailyRevenueStats } from '../../utils/OwnerService';
import { AnimatePresence, motion } from 'motion/react';
import {
    User, Mail, Phone, Calendar, Briefcase,
    TrendingUp, DollarSign, ShoppingCart, Package,
    Loader, AlertTriangle, Activity
} from 'lucide-react';
import { toast } from 'react-toastify';
import {
    LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const Analytics = () => {
    const { animate, handleDelayNavigation } = useDelayedNavigation();
    const [revenue, setRevenue] = useState(0);
    const [sales, setSales] = useState(0);
    const [dailyStats, setDailyStats] = useState([]);
    const [statusStats, setStatusStats] = useState({});
    const [totalOrders, setTotalOrders] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Color theme
    const colors = {
        primary: '#ffbb00',
        dark: '#111',
        light: '#fff',
        accent: '#f8d353',
        success: '#4CAF50',
        info: '#2196F3',
        warning: '#FF9800',
        danger: '#F44336',
    };

    // For pie chart
    const COLORS = [colors.primary, colors.info, colors.success, colors.warning, colors.danger];

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            // Fetch total revenue stats
            const revenueResponse = await getRevenueStats();
            if (revenueResponse.success) {
                setRevenue(revenueResponse.data.revenue);
                setSales(revenueResponse.data.sales);
            } else {
                toast.error(revenueResponse.message);
            }

            // Fetch daily stats
            const dailyResponse = await getDailyRevenueStats();
            if (dailyResponse.success) {
                setDailyStats(dailyResponse.data.dailyStats);
                setStatusStats(dailyResponse.data.statusStats);
                setTotalOrders(dailyResponse.data.totalOrders);
            } else {
                toast.error(dailyResponse.message);
            }
        } catch (err) {
            setError("Failed to load analytics data");
            toast.error("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0
        }).format(amount);
    };

    // Format date for chart
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}`;
    };

    // Process data for order status pie chart
    const getOrderStatusData = () => {
        if (!statusStats) return [];

        return Object.entries(statusStats).map(([status, count]) => ({
            name: status,
            value: count
        }));
    };

    // Process daily data for charts (last 7 days)
    const getLast7DaysData = () => {
        if (!dailyStats || dailyStats.length === 0) return [];
        return dailyStats.slice(-7).map(day => ({
            ...day,
            date: formatDate(day.date)
        }));
    };

    // Custom tooltip for recharts
    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white p-2 border border-solid border-yellow-400 rounded">
                    <p className="m-0"><strong>{label}</strong></p>
                    {payload.map((entry, index) => (
                        <p key={index} className="m-0" style={{ color: entry.color }}>
                            {entry.name}: {entry.name.includes('Revenue')
                                ? formatCurrency(entry.value)
                                : entry.value}
                        </p>
                    ))}
                </div>
            );
        }
        return null;
    };

    // Loading state
    if (loading) {
        return (
            <>
                <Transition animate={animate} />
                <div className="flex flex-col items-center justify-center h-screen bg-white">
                    <Loader size={50} color={colors.primary} className="animate-spin" />
                    <p className="text-[#111] mt-5 text-lg">
                        Loading analytics data...
                    </p>
                </div>
            </>
        );
    }

    // Error state
    if (error) {
        return (
            <>
                <Transition animate={animate} />
                <div className="flex flex-col items-center justify-center h-screen bg-white">
                    <AlertTriangle size={50} color={colors.danger} />
                    <p className="text-[#111] mt-5 text-lg">
                        {error}
                    </p>
                    <button
                        id="Shp-Now-Home-Start"
                        onClick={fetchData}
                        className="mt-5 py-2 px-5 rounded cursor-pointer"
                    >
                        Try Again
                    </button>
                </div>
            </>
        );
    }

    return (
        <>
            <Transition animate={animate} />

            <div className="p-5 bg-white min-h-screen">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 className="text-[#111] text-2xl font-bold mb-5 flex items-center gap-2 font-[poppins]">
                        <Activity size={28} color={colors.primary} />
                        Business Analytics
                    </h1>
                </motion.div>

                {/* Stats Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="bg-[#111] rounded-lg p-5 shadow-md flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute right-5 top-5 bg-opacity-10 bg-white rounded-full w-12 h-12 flex items-center justify-center">
                            <DollarSign size={25} color={colors.primary} />
                        </div>
                        <h3 className="text-white text-base mb-4 font-[poppins]">
                            Total Revenue
                        </h3>
                        <p className="text-yellow-400 text-2xl font-bold mb-2">
                            {formatCurrency(revenue)}
                        </p>
                        <div className="flex items-center text-white">
                            <TrendingUp size={16} color={colors.success} />
                            <span className="ml-1 text-sm">
                                From {totalOrders} orders
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="bg-yellow-400 rounded-lg p-5 shadow-md flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute right-5 top-5 bg-black bg-opacity-10 rounded-full w-12 h-12 flex items-center justify-center">
                            <ShoppingCart size={25} color={colors.primary} />
                        </div>
                        <h3 className="text-[#111] text-base mb-4 font-[poppins]">
                            Total Sales
                        </h3>
                        <p className="text-[#111] text-2xl font-bold mb-2">
                            {sales} items
                        </p>
                        <div className="flex items-center text-[#111]">
                            <TrendingUp size={16} color={colors.success} />
                            <span className="ml-1 text-sm">
                                {(sales / totalOrders).toFixed(1)} items per order
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="bg-white border-2 border-yellow-400 rounded-lg p-5 shadow-md flex flex-col relative overflow-hidden"
                    >
                        <div className="absolute right-5 top-5 bg-yellow-400 rounded-full w-12 h-12 flex items-center justify-center">
                            <Package size={25} color={colors.dark} />
                        </div>
                        <h3 className="text-[#111] text-base mb-4 font-[poppins]">
                            Total Orders
                        </h3>
                        <p className="text-[#111] text-2xl font-bold mb-2">
                            {totalOrders}
                        </p>
                        <div className="flex items-center text-[#111]">
                            <TrendingUp size={16} color={colors.success} />
                            <span className="ml-1 text-sm">
                                Avg value: {formatCurrency(revenue / totalOrders)}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Charts Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="bg-white rounded-lg p-5 shadow-md min-h-96"
                    >
                        <h2 className="text-[#111] text-lg mb-5 flex items-center gap-2 font-[poppins]">
                            <DollarSign size={20} color={colors.primary} />
                            Daily Revenue (Last 7 Days)
                        </h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <LineChart
                                data={getLast7DaysData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                                <XAxis dataKey="date" />
                                <YAxis
                                    tickFormatter={(value) => `₹${value / 1000}k`}
                                    domain={['auto', 'auto']}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Line
                                    type="monotone"
                                    dataKey="revenue"
                                    name="Revenue"
                                    stroke={colors.primary}
                                    strokeWidth={3}
                                    activeDot={{ r: 8 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex justify-center">
                            <button
                                id="Shp-Now-Home-Start"
                                onClick={fetchData}
                                className="flex items-center gap-2 py-2 px-4 rounded-lg border-2 border-black cursor-pointer"
                            >
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                    </motion.div>

                    {/* Sales Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="bg-[#111] rounded-lg p-5 shadow-md min-h-96"
                    >
                        <h2 className="text-white text-lg mb-5 flex items-center gap-2 font-[poppins]">
                            <ShoppingCart size={20} color={colors.primary} />
                            Daily Sales (Last 7 Days)
                        </h2>
                        <ResponsiveContainer width="100%" height={350}>
                            <BarChart
                                data={getLast7DaysData()}
                                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                            >
                                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                                <XAxis dataKey="date" stroke={colors.light} />
                                <YAxis stroke={colors.light} />
                                <Tooltip content={<CustomTooltip />} />
                                <Legend />
                                <Bar
                                    dataKey="sales"
                                    name="Items Sold"
                                    fill={colors.primary}
                                    radius={[4, 4, 0, 0]}
                                />
                                <Bar
                                    dataKey="orderCount"
                                    name="Order Count"
                                    fill={colors.accent}
                                    radius={[4, 4, 0, 0]}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                        <div className="mt-2 flex justify-center">
                            <button
                                className="AddToCartInStore flex items-center gap-2 py-2 px-4 bg-white text-[#111] rounded cursor-pointer font-bold border-2"
                                onClick={fetchData}
                            >
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Order Status Section */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mb-8">
                    {/* Order Status Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="bg-white rounded-lg p-5 shadow-md min-h-96"
                    >
                        <h2 className="text-[#111] text-lg mb-5 flex items-center gap-2 font-[poppins]">
                            <Package size={20} color={colors.primary} />
                            Order Status Distribution
                        </h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={getOrderStatusData()}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                                    outerRadius={100}
                                    fill="#8884d8"
                                    dataKey="value"
                                >
                                    {getOrderStatusData().map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </motion.div>

                    {/* Order Status Summary */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="bg-[#111] rounded-lg p-5 shadow-md min-h-96"
                    >
                        <h2 className="text-white text-lg mb-5 flex items-center gap-2 font-[poppins]">
                            <ClipboardList size={20} color={colors.primary} />
                            Order Status Summary
                        </h2>

                        <div className="flex flex-col gap-4">
                            {Object.entries(statusStats || {}).map(([status, count], index) => (
                                <div
                                    key={status}
                                    className="bg-white bg-opacity-10 rounded-lg p-4 flex justify-between items-center"
                                >
                                    <div className="flex items-center gap-2">
                                        <div
                                            className="w-3 h-3 rounded-full"
                                            style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                        />
                                        <span className="text-black">{status}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className="text-yellow-400 font-bold px-5 py-2 rounded-full bg-[#111]">
                                            {count}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Export & Actions Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 }}
                    className="flex justify-center gap-5 mt-8"
                >
                    <button
                        id="Shp-Now-Home-Start"
                        onClick={() => toast.info("This feature is coming soon!")}
                        className="flex items-center gap-2 py-3 px-6 rounded border-2 border-black cursor-pointer text-base"
                    >
                        <FileCsv size={20} />
                        Export Report
                    </button>

                    <button
                        className="AddToCartInStore flex items-center gap-2 py-3 px-6 bg-[#111] text-white rounded border-2 cursor-pointer text-base"
                        onClick={() => toast.info("Print functionality coming soon!")}
                    >
                        <Printer size={20} />
                        Print Analytics
                    </button>
                </motion.div>
            </div>
        </>
    );
};

// Missing icon components
const RefreshCw = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.color || "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"></path>
            <path d="M21 3v5h-5"></path>
            <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"></path>
            <path d="M3 21v-5h5"></path>
        </svg>
    );
};

const FileCsv = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.color || "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"></path>
            <polyline points="14 2 14 8 20 8"></polyline>
            <path d="M8 13h2"></path>
            <path d="M8 17h2"></path>
            <path d="M14 13h2"></path>
            <path d="M14 17h2"></path>
        </svg>
    );
};

const Printer = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.color || "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="6 9 6 2 18 2 18 9"></polyline>
            <path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path>
            <rect x="6" y="14" width="12" height="8"></rect>
        </svg>
    );
};

const ClipboardList = (props) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={props.size || 24}
            height={props.size || 24}
            viewBox="0 0 24 24"
            fill="none"
            stroke={props.color || "currentColor"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
            <line x1="12" y1="11" x2="16" y2="11"></line>
            <line x1="12" y1="16" x2="16" y2="16"></line>
            <line x1="8" y1="11" x2="8" y2="11"></line>
            <line x1="8" y1="16" x2="8" y2="16"></line>
        </svg>
    );
};

export default Analytics;