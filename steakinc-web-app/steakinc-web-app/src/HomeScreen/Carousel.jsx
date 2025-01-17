import React, { useState } from 'react';
import './Carousel.css'; // Remember to create this CSS file
import image1 from '../assets/image1.png';
import image2 from '../assets/image2.png';
import image3 from '../assets/image3.png';

const Carousel = () => {
  const images = [
    { src: image1, alt: 'Carousel Image 1' },
    { src: image2, alt: 'Carousel Image 2' },
    { src: image3, alt: 'Carousel Image 3' },
  ];

  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handlePrevClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNextClick = () => {
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentImageIndex(index);
  };

  const getPrevIndex = () => (currentImageIndex === 0 ? images.length - 1 : currentImageIndex - 1);
  const getNextIndex = () => (currentImageIndex === images.length - 1 ? 0 : currentImageIndex + 1);

  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        <button className="carousel-button prev" onClick={handlePrevClick}>
          &lt;
        </button>
        <div className="carousel-images">
          <img
            className="carousel-image small"
            src={images[getPrevIndex()].src}
            alt={images[getPrevIndex()].alt}
          />
          <img
            className="carousel-image large"
            src={images[currentImageIndex].src}
            alt={images[currentImageIndex].alt}
          />
          <img
            className="carousel-image small"
            src={images[getNextIndex()].src}
            alt={images[getNextIndex()].alt}
          />
        </div>
        <button className="carousel-button next" onClick={handleNextClick}>
          &gt;
        </button>
      </div>
      <div className="carousel-dots">
        {images.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentImageIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;