/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React from 'react'
import Page4 from './Page4'
import Page5 from './Page5'

const HalfHome2 = ({ Kids, Men, Women }) => {
    return (
        <div>
            <div className='z-[10] rounded-t-xl'>
                <Page4 Kids={Kids} Men={Men} Women={Women} />
            </div>
            <div className='z-[10]'>
                <Page5 />
            </div>
        </div>
    )
}

export default HalfHome2
