import React, { useState, useEffect, useRef } from 'react';
import './Carousel.css';
import image1 from '../assets/Sign Up.png';
import image2 from '../assets/Login.png';
import image3 from '../assets/Home.png';
import promoVideo from '../assets/promo.mp4';

const Carousel = () => {
  const items = [
    { type: 'video', src: promoVideo, alt: 'Promo Video' },
    { type: 'image', src: image1, alt: 'Carousel Image 1' },
    { type: 'image', src: image2, alt: 'Carousel Image 2' },
    { type: 'image', src: image3, alt: 'Carousel Image 3' },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (items[currentIndex].type === 'video' && videoRef.current) {
      videoRef.current.play();
      videoRef.current.onended = () => nextSlide();
    } else {
      startAutoPlay();
    }

    return () => clearInterval(intervalRef.current);
  }, [currentIndex]);

  const startAutoPlay = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      nextSlide();
    }, 3000);
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? items.length - 1 : prevIndex - 1
    );
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
    }
  };

  const getPrevIndex = () => (currentIndex === 0 ? items.length - 1 : currentIndex - 1);
  const getNextIndex = () => (currentIndex === items.length - 1 ? 0 : currentIndex + 1);

  return (
    <div className="carousel-container">
      <div className="carousel-inner">
        <div className="carousel-images">
          {items[getPrevIndex()].type === 'video' ? (
            <div className="video-container small" onClick={prevSlide}>
              <video
                className="carousel-video small"
                src={items[getPrevIndex()].src}
                muted
                autoPlay={false}
                playsInline
              />
            </div>
          ) : (
            <img
              className="carousel-image small"
              src={items[getPrevIndex()].src}
              alt={items[getPrevIndex()].alt}
              onClick={prevSlide}
            />
          )}

          {items[currentIndex].type === 'video' ? (
            <div className="video-container large">
              <video
                ref={videoRef}
                className="carousel-video large"
                src={items[currentIndex].src}
                autoPlay
                playsInline
                muted={isMuted}
                onClick={toggleMute}
              />
              <div className="mute-overlay" onClick={toggleMute}>
                {isMuted ? '🔇' : '🔊'}
              </div>
            </div>
          ) : (
            <img
              className="carousel-image large"
              src={items[currentIndex].src}
              alt={items[currentIndex].alt}
            />
          )}

          {items[getNextIndex()].type === 'video' ? (
            <div className="video-container small" onClick={nextSlide}>
              <video
                className="carousel-video small"
                src={items[getNextIndex()].src}
                muted
                autoPlay={false}
                playsInline
              />
            </div>
          ) : (
            <img
              className="carousel-image small"
              src={items[getNextIndex()].src}
              alt={items[getNextIndex()].alt}
              onClick={nextSlide}
            />
          )}
        </div>
      </div>
      <div className="carousel-dots">
        {items.map((_, index) => (
          <span
            key={index}
            className={`dot ${index === currentIndex ? 'active' : ''}`}
            onClick={() => handleDotClick(index)}
          ></span>
        ))}
      </div>
    </div>
  );
};

export default Carousel;
