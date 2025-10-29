import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Landing.css'; // Custom CSS
import NavbarComp from './NavbarComp';
import background from "../assets/background.png";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-body">
      <img src={background} className='bg' alt="Background"/>
      <NavbarComp />
      <div className="landing-bg">
        <div className="landing-content">
          <h1>Welcome to ElectroMart – Your Gadget Universe!</h1>
          <p>Mobiles, Laptops, Chargers & more! 🎉 Up to 50% Off</p>
          <button
            className="landing-btn"
            onClick={() => navigate('/login')}
          >
            Login to Explore All
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;