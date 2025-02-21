/* eslint-disable no-unused-vars */
import React from 'react'
import Page1 from './Page1';
import Page2 from './Page2';

const HalfHome = () => {
    return (
        <div>
            <Page1 />
            <div className='z-[10] mt-[18.6vh] rounded-t-xl'>
                <Page2 />
            </div>
        </div>
    )
}

export default HalfHome
