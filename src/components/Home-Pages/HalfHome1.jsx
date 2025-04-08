/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import Page1 from './Page1';
import Page2 from './Page2';

const HalfHome = ({ bestSelling, Discounted, CartChange, setCartChange }) => {
    return (
        <div>
            <Page1 Discounted={Discounted} CartChange={CartChange} setCartChange={setCartChange} />
            <div className='z-[10] mt-[18.6vh] rounded-t-xl'>
                <Page2 bestSelling={bestSelling} Discounted={Discounted} CartChange={CartChange} setCartChange={setCartChange} />
            </div>
        </div>
    )
}

export default HalfHome
