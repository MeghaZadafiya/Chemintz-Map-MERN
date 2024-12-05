// src/components/Profile.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_URL = process.env.REACT_APP_API_URL;


const Profile = ({ user, setUser }) => {
    const [username, setUserName] = useState(user.username ?? '');
    const [homeAddress, setHomeAddress] = useState(user.homeAddress ?? '');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const history = useNavigate();

    const token = localStorage.getItem('token');

    

    useEffect(() => {
        if(!token){
            history('/login');
        }
        const fetchUser = async () => {
            try {
              const token = localStorage.getItem('token');
              if (token) {
                const res = await axios.get(`${API_URL}/api/users/profile`, {
                  headers: { 'authorization': token },
                  data:{
                    userId: localStorage.getItem('userId')
                  }
                });   
                setUserName(res.username);
                setHomeAddress(res.homeAddress);    
              }
            } catch (error) {
              setError(error.message);
            }
          };
        fetchUser();
    }, []);


    const handleUpdate = async () => {
        try {
            if (token) {
                const res = await axios.put(`${API_URL}/api/users/update`, {
                       
                        userId: user._id,
                        username,
                        homeAddress,
                        password,
                  
                });
                setMessage(res.data.message);
                setUser({ ...user, username, homeAddress });
            }
        } catch (error) {
            setError('Failed to update profile');
        }
    };

    const handleDelete = async (e) => {
        e.preventDefault();
        try {
            await axios.delete(`${API_URL}/api/users/delete`, { data: { userId: user._id } });
            setMessage('Account deleted successfully');
            setUser(null); // Clear user data
            localStorage.clear();
            history('/login');
        } catch (error) {
            setError('Failed to delete account');
        }
    };

    const handleLogout = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`${API_URL}/api/users/logout`);
            localStorage.clear();
            setMessage('Logged out successfully');
            setUser(null); // Clear user data
            history('/login');
        } catch (error) {
            setError('Failed to log out');
        }
    };

    return (
        <div className='profileClass'>
            <h2>Profile</h2>
            {message ? <p style={{ color: 'green' }}>{message}</p> : <p style={{ color: 'red' }}>{error}</p>}
            <div>
                <label>Username:</label>
                <input type="text" value={username} onChange={(e) => setUserName(e.target.value)} />
            </div>
            <div>
                <label>Home Address:</label>
                <input type="text" value={homeAddress} onChange={(e) => setHomeAddress(e.target.value)} />
            </div>
            <div>
                <label>Password:</label>
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className='profileButton'>
                <button onClick={handleUpdate}>Update Profile</button>
                <button onClick={handleDelete}>Delete Account</button>
                <button onClick={handleLogout}>Logout</button>
            </div>
        </div>
    );
};

export default Profile;
