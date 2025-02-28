import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";

const sortOptions = [
    { label: "Newest First", value: "date-desc" },
    { label: "Oldest First", value: "date-asc" },
    { label: "Highest Total", value: "amount-desc" },
    { label: "Lowest Total", value: "amount-asc" },
];

export default function SortByMenu() {
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState(sortOptions[0]);

    return (
        <div className="relative inline-block">
            <button
                className="font-[nunito] font-medium py-2 px-4 border-[1px] border-dashed cursor-pointer flex items-center gap-2"
                onClick={() => setIsOpen(!isOpen)}
            >
                Sort by: {selected.label}
                <ChevronDown className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"} duration-300 ease-in-outs`} size={16} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.ul
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.6, ease: "anticipate" }}
                        className="absolute left-0 w-full bg-white border border-gray-300 shadow-lg mt-1 rounded-md overflow-hidden"
                    >
                        {sortOptions.map((option, index) => (
                            <motion.li
                                key={option.value}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -50 }}
                                transition={{ delay: index * 0.11, ease: "easeInOut", duration: 0.3 }}
                                className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                                onClick={() => {
                                    setSelected(option);
                                    setIsOpen(false);
                                }}
                            >
                                {option.label}
                            </motion.li>
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    );
}
