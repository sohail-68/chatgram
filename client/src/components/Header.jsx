// src/components/Header.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiSearch, FiHeart, FiMessageCircle, FiUser } from 'react-icons/fi';
import { useEffect } from 'react';
import img from "../images/img.jpg"
const getprfrofile = JSON.parse(sessionStorage.getItem('profile')) || {};
const Header = () => {
  
  const [scroll,setScroll]=useState(false)
  const navigate=useNavigate()
  useEffect(() => {
    // Define the scroll event handler
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setScroll(true);
      } else {
        setScroll(false);
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // Empty dependency array ensures this only runs once on mount

  return (
<header
  className={`bg-white shadow-md p-4 flex items-center justify-between z-50 ${
    scroll ? "fixed top-0 left-0 right-0" : "sticky top-0"
  } h-20`} // Fixed height
>
  <div className="max-md:ml-10 text-amber-950 text-2xl font-bold">
    <img src={img} alt="Logo" className=" bg-none w-20 h-20" onClick={()=>navigate("/")} />
  </div>

  <div className=''>
    {/* <img src={getprfrofile.profilePicture} className='w-8' alt="" /> */}
  </div>
</header>

  
  );
};

export default Header;  