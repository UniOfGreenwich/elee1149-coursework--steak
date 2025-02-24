import React, { useState, useRef, useEffect } from 'react';
import './VerticalCarousel.css';
import Lid from './Lid';
import { CustomNextArrow, CustomPrevArrow } from './CustomArrows';

const VerticalCarousel = ({ jars, setSelectedJar }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const JAR_HEIGHT = 180;

    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };

    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, jars.length - 1));
    };

    useEffect(() => {
        const carousel = carouselRef.current;
        carousel.style.transform = `translateY(-${currentIndex * JAR_HEIGHT}px)`;
    }, [currentIndex]);

    return (
        <div className="vertical-carousel-wrapper">
            <div className="vertical-carousel-container">
                <CustomPrevArrow onClick={handlePrev} className="custom-arrow" />
                <div className="jar-carousel-container vertical-carousel">
                    <div className="jar-container" ref={carouselRef}>
                        {jars.map((jar, index) => (
                            <div className='jar' key={jar.jar_id} onClick={() => setSelectedJar(jar)}>
                                <Lid />
                                <span className="jar-name">{jar.jar_name}</span>
                                <span className="jar-value">£{jar.current_balance.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <CustomNextArrow onClick={handleNext} className="custom-arrow" />
            </div>
        </div>
    );
};

export default VerticalCarousel;