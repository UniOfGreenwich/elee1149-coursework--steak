import React from 'react';
import './LogInScreen.css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function LogInScreen() {
  return (
    <div className='container'>
      <div className="title-wrapper">
        <img className="logo" src="src/assets/highsteaks.png" alt="steak" />
        <h1 className='title-text'>High Steaks</h1>
      </div>
      <Swiper
        modules={[Navigation, Pagination, Scrollbar, A11y]}
        spaceBetween={50}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        onSwiper={(swiper) => console.log(swiper)}
        onSlideChange={() => console.log('slide change')}
      >
        <SwiperSlide>
          <div className="slide-content">
            <img src="\src\assets\image1.png" alt="" />
            <p>Image 1 Text</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="\src\assets\image2.png" alt="" />
            <p>Image 2 Text</p>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="slide-content">
            <img src="\src\assets\image3.png" alt="" />
            <p>Image 3 Text</p>
          </div>
        </SwiperSlide>
        ...
      </Swiper>
      <div className="login-wrapper">
        <div className="button-wrapper">
          <button type='Button' className="login-button">Log In</button>
          <button type='Button' className="signup-button">Sign Up</button>
        </div>
        <button type='Button' className="password-button">Forgot Password?</button>
      </div>
    </div>
  );
}

export default LogInScreen;