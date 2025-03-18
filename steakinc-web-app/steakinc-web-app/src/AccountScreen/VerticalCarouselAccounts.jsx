import React, { useState, useRef, useEffect } from 'react';
import './VerticalCarouselAccounts.css';
import { CustomNextArrow, CustomPrevArrow } from '../JarsScreen/CustomArrows';
 
const VerticalCarouselAccounts = ({ accounts, setSelectedAccount }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef(null);
    const ACCOUNT_HEIGHT = 70;
 
    const handlePrev = () => {
        setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    };
 
    const handleNext = () => {
        setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, accounts.length - 1));
    };
 
    useEffect(() => {
        const carousel = carouselRef.current;
        carousel.style.transform = `translateY(-${currentIndex * ACCOUNT_HEIGHT}px)`;
    }, [currentIndex]);
 
    return (
        <div className="vertical-carousel-wrapper">
            <div className="vertical-carousel-container">
                <CustomPrevArrow onClick={handlePrev} className="custom-arrow" />
                <div className="account-carousel-container vertical-carousel">
                    <div className="account-container" ref={carouselRef}>
                        {accounts.map((account, index) => (
                            <div className='account' key={account.account_id} onClick={() => setSelectedAccount(account)}>
                                <span className="account-name">{account.name}</span>
                                <span className="account-value">£{account.balance.toFixed(2)}</span>
                            </div>
                        ))}
                    </div>
                </div>
                <CustomNextArrow onClick={handleNext} className="custom-arrow" />
            </div>
        </div>
    );
};
 
export default VerticalCarouselAccounts;