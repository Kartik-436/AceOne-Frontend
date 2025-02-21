/* eslint-disable no-unused-vars */
import React, { useState } from 'react'
import "./Btn7.css"
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Btn7 = (props) => {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <Link to={`/${props.routeTo}`}>
            <button
                id="Btn7"
                className="transition duration-300 active:scale-90" // For smooth transition effect
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                style={{
                    boxShadow: isHovered ? props.shadow : 'none',
                    border: `${isHovered ? props.border : props.border}`,
                    borderColor: `${isHovered ? props.borderC : 'black'}`,
                    fontWeight: `${isHovered ? props.bold : '400'}`,
                    padding: props.padding ,
                    backgroundColor: `${props.bgColor}`
                }}
            >
                {props.name}
            </button>
        </Link>
    )
}

Btn7.propTypes = {
    name: PropTypes.string.isRequired,
    shadow: PropTypes.string,
    borderC: PropTypes.string,
    border: PropTypes.string,
    bold: PropTypes.string,
    padding: PropTypes.string,
    routeTo: PropTypes.string,
    bgColor: PropTypes.string,
};

export default Btn7
