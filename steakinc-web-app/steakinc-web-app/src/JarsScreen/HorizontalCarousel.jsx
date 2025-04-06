import React, { useState, useRef, useEffect } from 'react';
import './VerticalCarousel.css';
import Lid from './Lid';
import Slider from "react-slick";

const HorizontalCarousel = ({ jars, setSelectedJar }) => {
    const horizontalSettings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 3,
        slidesToScroll: 1,
        arrows: false
    };
    return (
        <div className="jar-carousel-container horizontal-carousel">
            <Slider {...horizontalSettings} className="jar-container">
                {jars.map(jar => (
                    <div className='jar' key={jar.jar_id} onClick={() => setSelectedJar(jar)}>
                        <Lid />
                        <span className="jar-name">{jar.jar_name}</span>
                        <span className="jar-value">£{jar.current_balance.toFixed(2)}</span>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HorizontalCarousel;