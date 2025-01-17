import React from 'react';
import './LogInScreen.css';
import { Navigation, Pagination, Scrollbar, A11y } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

function logoSecret() {
  alert(
    '\nCooking:\n1. Preheat your pan:  Place a heavy-bottomed skillet, over high heat. Let it get screaming hot—you should see a shimmer in the pan. Add a high smoke point oil like canola, vegetable, or avocado oil.  A tablespoon or two should be sufficient.\n2. Sear the steak: Carefully place the steak in the hot pan.  Don\'t overcrowd the pan. Sear for 2-3 minutes per side, undisturbed, to develop a beautiful crust.  You should hear a satisfying sizzle.\n3. Reduce heat: Once seared, reduce the heat to medium or medium-low for even cooking.  If you\'re aiming for a medium-rare or rare steak, you can skip this step for thinner cuts.\n4. Cook to desired doneness:  Continue cooking, flipping occasionally, until the steak reaches your desired internal temperature. Use a meat thermometer for accuracy:\n    * Rare: 125-130°F (52-54°C)\n    * Medium-rare: 130-135°F (54-57°C)\n    * Medium: 135-140°F (57-60°C)\n    * Medium-well: 140-145°F (60-63°C)\n    * Well-done: 145°F+ (63°C+)\n5. Rest the steak: Once cooked, remove the steak from the pan and let it rest on a cutting board or plate for 5-10 minutes. \n10. Slice and serve: Slice the steak against the grain (perpendicular to the muscle fibers) for maximum tenderness. Serve immediately and enjoy!'
  );
}


function LogInScreen() {
  return (
    <div className='container'>
      <div className="title-wrapper">
        <img className="logo" onClick={logoSecret} src="src/assets/highsteaks.png" alt="steak" />
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