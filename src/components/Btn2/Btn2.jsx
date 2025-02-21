/* eslint-disable no-unused-vars */
import React from 'react'
import "./Btn2.css";
import { useRef } from 'react';
import PropTypes from 'prop-types';

const Btn2 = (props) => {
    const btnRef = useRef(null);

    const handleMouseMove = (e) => {
        const btn = btnRef.current;

        const x = e.pageX - btn.offsetLeft;
        const y = e.pageY - btn.offsetTop;

        btn.style.setProperty("--x", `${x}px`);
        btn.style.setProperty("--y", `${y}px`);
    };

    return (
        <div>
            <a 
                onMouseMove={handleMouseMove} 
                ref={btnRef} 
                id='Btn2' 
                href="/">
                <span className='text-black'>{`${props.name}`}</span>
            </a>
        </div>
    )
}

Btn2.propTypes = {
    name: PropTypes.string.isRequired,
};

export default Btn2
