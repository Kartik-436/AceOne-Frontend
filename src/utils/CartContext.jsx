/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [isCartMenuOpen, setIsCartMenuOpen] = useState(false);

    return (
        <CartContext.Provider value={{ isCartMenuOpen, setIsCartMenuOpen }}>
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
