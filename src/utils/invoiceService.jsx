// src/services/invoiceService.js
import axios from 'axios';

// Base URL for invoice-related endpoints
const BASE_URL = 'https://aceone-backend-wd1f.onrender.com/inv';

const getHeaders = () => ({
    'Content-Type': 'application/json'
});

export const getInvoicePdf = async (invoiceId) => {
    try {
        const response = await axios.get(`${BASE_URL}/invoices/${invoiceId}`, {
            headers: getHeaders(),
            responseType: 'blob',
            withCredentials: true // This ensures cookies are sent with the request
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching invoice PDF:', error);
        throw error;
    }
};

export const getUserInvoices = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/user/invoices`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching user invoices:', error);
        throw error;
    }
};

export const getInvoiceByOrderId = async (orderId) => {
    try {
        const response = await axios.get(`${BASE_URL}/orders/${orderId}/invoice`, {
            headers: getHeaders(),
            withCredentials: true
        });
        return response.data.data;
    } catch (error) {
        console.error('Error fetching invoice by order ID:', error);
        throw error;
    }
};

export const downloadInvoice = async (invoiceId, invoiceNumber) => {
    try {
        const pdfBlob = await getInvoicePdf(invoiceId);
        const url = window.URL.createObjectURL(pdfBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `invoice-${invoiceNumber}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
    } catch (error) {
        console.error('Error downloading invoice:', error);
        throw error;
    }
};

export const viewInvoice = async (invoiceId) => {
    try {
        const pdfBlob = await getInvoicePdf(invoiceId);
        const url = window.URL.createObjectURL(pdfBlob);
        window.open(url, '_blank');
    } catch (error) {
        console.error('Error viewing invoice:', error);
        throw error;
    }
};

// Export all functions as named exports
export default {
    getInvoicePdf,
    getUserInvoices,
    getInvoiceByOrderId,
    downloadInvoice,
    viewInvoice
};