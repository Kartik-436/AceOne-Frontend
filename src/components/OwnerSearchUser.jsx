/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import { useState, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import BarLoader from './Loaders/CustomLoader1';
import { Trash2 } from 'lucide-react';
import { toast } from "react-toastify";

const OwnerUserSearch = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [confirmModalOpen, setConfirmModalOpen] = useState(false);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            if (query.trim()) {
                fetchSearchResults(query);
            } else {
                setResults([]);
            }
        }, 200);

        return () => clearTimeout(delayDebounce);
    }, [query]);

    const fetchSearchResults = async (searchTerm) => {
        try {
            setLoading(true);
            console.log("Searching for:", searchTerm);
            const response = await axios.get(`https://aceone-backend-wcgq.onrender.com/user/search?q=${searchTerm}`);
            console.log("Response received:", response.data);
            setResults(response.data.data);
        } catch (error) {
            console.error("Search error:", error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleDeleteUser = async (userId) => {
        try {
            const response = await axios.delete(`https://aceone-backend-wcgq.onrender.com/owner/delete-user/${userId}`);
            if (response.success) {
                setResults(results.filter(user => user._id !== userId));
                toast.success("User deleted successfully");
            }
        } catch (error) {
            console.error("Delete error:", error.message);
            toast.error("Failed to delete user");
        }
    };

    return (
        <div className="relative w-full">
            <input
                className="search-with-icon px-4 py-2 bg-[#fff] md:inline-block hidden outline-none border-2 border-[#111] rounded-full w-full transition-all"
                type="search"
                name="search"
                id="search-with-icon"
                placeholder="Search Users by Name"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
            />
            {loading && <div className="flex items-center justify-center"><BarLoader /></div>}

            <AnimatePresence>
                {results.length > 0 && (
                    <motion.ul
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.5, staggerChildren: 0.5, delay: 0.3, ease: "anticipate" }}
                        className="absolute bg-white border border-gray-300 rounded-lg mt-3 w-full max-h-[40vh] overflow-y-auto p-2 overflow-x-hidden noScrollbar shadow-lg shadow-black z-20"
                    >
                        {results.map((user) => (
                            <motion.li
                                key={user._id}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 10 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-start justify-between p-3 border-b border-gray-300 hover:bg-gray-100 cursor-pointer rounded-lg"
                            >
                                <div className="flex items-start gap-4">
                                    <img
                                        src={user.picture || "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fcreazilla-store.fra1.digitaloceanspaces.com%2Ficons%2F3202933%2Fuser-circle-icon-md.png&f=1&nofb=1&ipt=3c31159b2e0bac086a52351ed5919af4e6936e024f7c3baa351b44782de00eb1&ipo=images"}
                                        alt={user.name}
                                        className="w-16 h-16 rounded-full object-cover border-[1px] border-black"
                                    />
                                    <div className="flex flex-col justify-between h-full">
                                        <h1 className="text-sm font-semibold">{user.fullName} ({user.email})</h1>
                                        <h1 className="text-sm text-gray-500">Orders Made: <span className="text-sm text-gray-600 font-bold">{user.orders.length}</span></h1>
                                    </div>
                                </div>
                                <button
                                    className="p-3.5 text-sm border rounded-full transition-all cursor-pointer"
                                    id="Shp-Now-Home-Start"
                                    onClick={() => {
                                        setConfirmModalOpen(true)
                                    }}
                                >
                                    <Trash2 size={20} />
                                </button>
                                <ConfirmationModal isOpen={confirmModalOpen} onClose={() => { setConfirmModalOpen(false) }} onConfirm={() => { handleDeleteUser(user._id) }} user={user} />
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
};

export default OwnerUserSearch;


const ConfirmationModal = ({ isOpen, onClose, onConfirm, user }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/30 backdrop-blur-sm z-50">
                    <motion.div
                        key="logout-modal"
                        initial={{ opacity: 0, scale: 0.3, y: 200 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.3, y: 200 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="bg-white p-6 rounded-lg shadow-lg border-2 border-black"
                    >
                        <h2 className="text-lg font-semibold">Confirm Deletion</h2>
                        <p className="text-gray-600 mt-2">Are you sure you want to Delete {user.fullName} with {user.orders.length} orders ?</p>
                        <div className="mt-4 flex justify-end gap-3">
                            <button
                                onClick={onClose}
                                className="px-4 py-2 bg-gray-300 rounded-lg cursor-pointer active:scale-95"
                            >
                                No
                            </button>
                            <button
                                onClick={onConfirm}
                                className="px-4 py-2 bg-red-500 text-white rounded-lg cursor-pointer active:scale-95"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </motion.div>
                </div>
            )}
        </AnimatePresence>
    );
};