import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Map from './components/Map';
import Register from './components/Register';
import Home from './components/Home';
import Login from './components/Login';
import './App.css';
import './css/Common.css';
import Header from './components/Header';
import axios from 'axios';
import avatar from './images/avatar.png';
import Profile from './components/Profile';

const API_URL = process.env.REACT_APP_API_URL;

function App() {

  const [error, setError] = useState('');

  const [user, setUser] = useState({
    username: 'JohnDoe',
    profilePicture: avatar, // Placeholder image
  });

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const res = await axios.get(`${API_URL}/api/users/profile`, {
          headers: { authorization: token },
          data:{
            userId: localStorage.getItem('userId')
          }
        });
        const userData = { ...res.data, profilePicture: avatar }                     
        setUser(userData);        
      }
    } catch (error) {
      setError(error.message);
    }
  };

  useEffect(() =>{
    fetchUser();
  },[]);

 
  return (
    <Router>
      <Header user={user} />
      <div className="content">
      
        <Routes>
            <Route path="/" exact element={<Home />} />
            <Route path="/map" element={<Map />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/profile" element={<Profile user={user} />} />
        </Routes>
      
      </div>
    </Router>
  );
}

export default App;
