import React from 'react';
import './HomeScreen.css';
import { useNavigate } from 'react-router-dom';
import Carousel from './Carousel';

function logoSecret() {
  alert(
    '\nCooking:\n1. Preheat your pan:  Place a heavy-bottomed skillet, over high heat. Let it get screaming hot—you should see a shimmer in the pan. Add a high smoke point oil like canola, vegetable, or avocado oil.  A tablespoon or two should be sufficient.\n2. Sear the steak: Carefully place the steak in the hot pan.  Don\'t overcrowd the pan. Sear for 2-3 minutes per side, undisturbed, to develop a beautiful crust.  You should hear a satisfying sizzle.\n3. Reduce heat: Once seared, reduce the heat to medium or medium-low for even cooking.  If you\'re aiming for a medium-rare or rare steak, you can skip this step for thinner cuts.\n4. Cook to desired doneness:  Continue cooking, flipping occasionally, until the steak reaches your desired internal temperature. Use a meat thermometer for accuracy:\n    * Rare: 125-130°F (52-54°C)\n    * Medium-rare: 130-135°F (54-57°C)\n    * Medium: 135-140°F (57-60°C)\n    * Medium-well: 140-145°F (60-63°C)\n    * Well-done: 145°F+ (63°C+)\n5. Rest the steak: Once cooked, remove the steak from the pan and let it rest on a cutting board or plate for 5-10 minutes. \n10. Slice and serve: Slice the steak against the grain (perpendicular to the muscle fibers) for maximum tenderness. Serve immediately and enjoy!'
  );
}


function HomeScreen() {
  
  const navigate = useNavigate();
  return (
    <div className='container'>
      <div className="title-wrapper">
        <img
          className="logo-home"
          onClick={logoSecret}
          src="src/assets/highsteaks.png"
          alt="steak"
        />
        <h1 className='title-text'>Steak</h1>
      </div>
      <Carousel />
      <div className="login-wrapper">
        <div className="button-wrapper">
          <button type='button' className="register-button-home" onClick={() => navigate('/register')}>Sign Up</button>
          <button type='button' className="login-button-home" onClick={() => navigate('/login')}>Log In</button>
        </div>
      </div>
    </div>
  );
}

export default HomeScreen;
