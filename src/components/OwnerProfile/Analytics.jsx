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
                <div className="custom-tooltip" style={{
                    backgroundColor: colors.light,
                    padding: '10px',
                    border: `1px solid ${colors.primary}`,
                    borderRadius: '4px'
                }}>
                    <p style={{ margin: 0 }}><strong>{label}</strong></p>
                    {payload.map((entry, index) => (
                        <p key={index} style={{ color: entry.color, margin: 0 }}>
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
                <div className="analytics-loading" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh',
                    backgroundColor: colors.light
                }}>
                    <Loader size={50} color={colors.primary} className="animate-spin" />
                    <p style={{ color: colors.dark, marginTop: '20px', fontSize: '18px' }}>
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
                <div className="analytics-error" style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '70vh',
                    backgroundColor: colors.light
                }}>
                    <AlertTriangle size={50} color={colors.danger} />
                    <p style={{ color: colors.dark, marginTop: '20px', fontSize: '18px' }}>
                        {error}
                    </p>
                    <button
                        id="Shp-Now-Home-Start"
                        onClick={fetchData}
                        style={{
                            marginTop: '20px',
                            padding: '10px 20px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer'
                        }}
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

            <div className="analytics-container" style={{
                padding: '20px',
                backgroundColor: colors.light,
                minHeight: '100vh'
            }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <h1 style={{
                        color: colors.dark,
                        fontSize: '28px',
                        fontWeight: 'bold',
                        marginBottom: '20px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        <Activity size={28} color={colors.primary} />
                        Dashboard Analytics
                    </h1>
                </motion.div>

                {/* Stats Summary Cards */}
                <div className="stats-cards" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="stat-card"
                        style={{
                            backgroundColor: colors.dark,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <DollarSign size={25} color={colors.primary} />
                        </div>
                        <h3 style={{ color: colors.light, fontSize: '16px', marginBottom: '15px' }}>
                            Total Revenue
                        </h3>
                        <p style={{
                            color: colors.primary,
                            fontSize: '28px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            {formatCurrency(revenue)}
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: colors.light
                        }}>
                            <TrendingUp size={16} color={colors.success} />
                            <span style={{ marginLeft: '5px', fontSize: '14px' }}>
                                From {totalOrders} orders
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        className="stat-card"
                        style={{
                            backgroundColor: colors.primary,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            backgroundColor: 'rgba(0,0,0,0.1)',
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <ShoppingCart size={25} color={colors.dark} />
                        </div>
                        <h3 style={{ color: colors.dark, fontSize: '16px', marginBottom: '15px' }}>
                            Total Sales
                        </h3>
                        <p style={{
                            color: colors.dark,
                            fontSize: '28px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            {sales} items
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: colors.dark
                        }}>
                            <TrendingUp size={16} />
                            <span style={{ marginLeft: '5px', fontSize: '14px' }}>
                                {(sales / totalOrders).toFixed(1)} items per order
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="stat-card"
                        style={{
                            backgroundColor: colors.light,
                            border: `2px solid ${colors.primary}`,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            display: 'flex',
                            flexDirection: 'column',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                    >
                        <div style={{
                            position: 'absolute',
                            right: '20px',
                            top: '20px',
                            backgroundColor: colors.primary,
                            borderRadius: '50%',
                            width: '50px',
                            height: '50px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <Package size={25} color={colors.dark} />
                        </div>
                        <h3 style={{ color: colors.dark, fontSize: '16px', marginBottom: '15px' }}>
                            Total Orders
                        </h3>
                        <p style={{
                            color: colors.dark,
                            fontSize: '28px',
                            fontWeight: 'bold',
                            marginBottom: '10px'
                        }}>
                            {totalOrders}
                        </p>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            color: colors.dark
                        }}>
                            <TrendingUp size={16} color={colors.success} />
                            <span style={{ marginLeft: '5px', fontSize: '14px' }}>
                                Avg value: {formatCurrency(revenue / totalOrders)}
                            </span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Charts Section */}
                <div className="charts-section" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    {/* Revenue Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.4 }}
                        className="chart-card"
                        style={{
                            backgroundColor: colors.light,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minHeight: '400px'
                        }}
                    >
                        <h2 style={{
                            color: colors.dark,
                            fontSize: '18px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
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
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <button
                                id="Shp-Now-Home-Start"
                                onClick={fetchData}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer'
                                }}
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
                        className="chart-card"
                        style={{
                            backgroundColor: colors.dark,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minHeight: '400px'
                        }}
                    >
                        <h2 style={{
                            color: colors.light,
                            fontSize: '18px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
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
                        <div style={{
                            marginTop: '10px',
                            display: 'flex',
                            justifyContent: 'center'
                        }}>
                            <button
                                className="AddToCartInStore"
                                onClick={fetchData}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '8px 16px',
                                    backgroundColor: colors.primary,
                                    color: colors.dark,
                                    borderRadius: '4px',
                                    border: 'none',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                <RefreshCw size={16} />
                                Refresh Data
                            </button>
                        </div>
                    </motion.div>
                </div>

                {/* Order Status Section */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    marginBottom: '30px'
                }}>
                    {/* Order Status Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        style={{
                            backgroundColor: colors.light,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minHeight: '400px'
                        }}
                    >
                        <h2 style={{
                            color: colors.dark,
                            fontSize: '18px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
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
                        style={{
                            backgroundColor: colors.dark,
                            borderRadius: '8px',
                            padding: '20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            minHeight: '400px'
                        }}
                    >
                        <h2 style={{
                            color: colors.light,
                            fontSize: '18px',
                            marginBottom: '20px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            <ClipboardList size={20} color={colors.primary} />
                            Order Status Summary
                        </h2>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '15px'
                        }}>
                            {Object.entries(statusStats || {}).map(([status, count], index) => (
                                <div
                                    key={status}
                                    style={{
                                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '8px',
                                        padding: '15px',
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center'
                                    }}
                                >
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <div style={{
                                            width: '12px',
                                            height: '12px',
                                            borderRadius: '50%',
                                            backgroundColor: COLORS[index % COLORS.length]
                                        }} />
                                        <span style={{ color: colors.light }}>{status}</span>
                                    </div>
                                    <div style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px'
                                    }}>
                                        <span style={{
                                            color: colors.primary,
                                            fontWeight: 'bold'
                                        }}>
                                            {count}
                                        </span>
                                        <span style={{
                                            color: colors.light,
                                            fontSize: '14px'
                                        }}>
                                            ({totalOrders ? ((count / totalOrders) * 100).toFixed(1) : 0}%)
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
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                        gap: '20px',
                        marginTop: '30px'
                    }}
                >
                    <button
                        id="Shp-Now-Home-Start"
                        onClick={() => toast.info("This feature is coming soon!")}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
                    >
                        <FileCsv size={20} />
                        Export Report
                    </button>

                    <button
                        className="AddToCartInStore"
                        onClick={() => toast.info("Print functionality coming soon!")}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            padding: '12px 24px',
                            backgroundColor: colors.dark,
                            color: colors.light,
                            borderRadius: '4px',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '16px'
                        }}
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