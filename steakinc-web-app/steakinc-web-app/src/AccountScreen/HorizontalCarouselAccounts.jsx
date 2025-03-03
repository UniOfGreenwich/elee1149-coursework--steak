import React from 'react';
import Slider from 'react-slick';
import './HorizontalCarouselAccounts.css';
import { CustomNextArrow, CustomPrevArrow } from '../JarsScreen/CustomArrows';

const HorizontalCarouselAccounts = ({ accounts, setSelectedAccount }) => {
    const settings = {
        dots: false,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: false
    };

    return (
        <div className="horizontal-carousel-wrapper">
            <Slider {...settings}>
                {accounts.map((account) => (
                    <div className='horizontal-account-container' key={account.account_id} onClick={() => setSelectedAccount(account)}>
                        <p className="horizontal-account-name">{account.name}</p>
                        <p className="horizontal-account-value">£{account.balance.toFixed(2)}</p>
                    </div>
                ))}
            </Slider>
        </div>
    );
};

export default HorizontalCarouselAccounts;