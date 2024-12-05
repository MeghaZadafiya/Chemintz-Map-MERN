// src/components/Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../css/Header.css'; // For styling

const Header = ({ user }) => {
  const token = localStorage.getItem("token");
  return (
    <header className="header">
      <h1>Chemnitz Facilities Map</h1>
      <nav>
        {token && user && user._id ? 
        <>
          <Link to="/">Home</Link> | 
          <Link to="/map">Map</Link> | 
          <Link to="/profile"> 
            <div className="profile-menu">
              <img src={user.profilePicture} alt="Profile" className="profile-picture" />
              <span>{user.username}</span>
            </div>
          </Link>
          </>
         :
         <>
        <Link to="/register">Register</Link> | 
        <Link to="/login">Login</Link>
        </>
        }
        
      </nav>
    </header>
  );
};

export default Header;
