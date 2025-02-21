import React from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';

const CustomPrevArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <FaChevronUp
            className={className}
            style={{ ...style, display: 'block', color: 'white' }}
            onClick={onClick}
        />
    );
};

const CustomNextArrow = (props) => {
    const { className, style, onClick } = props;
    return (
        <FaChevronDown
            className={className}
            style={{ ...style, display: 'block', color: 'white' }}
            onClick={onClick}
        />
    );
};

export { CustomPrevArrow, CustomNextArrow };