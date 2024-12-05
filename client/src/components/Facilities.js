import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useMediaQuery } from 'react-responsive';
import '../css/Common.css';
import { experimentalStyled as styled } from '@mui/material/styles';
import {IconButton} from '@mui/material';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import FavoriteIcon from '@mui/icons-material/Favorite';

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  color: theme.palette.text.secondary,
}));

const API_URL = process.env.REACT_APP_API_URL;


const Facilities = ({ facilities, onFavorite, onUnfavorite }) => {
    const [user ,setUser] = useState([]);
    const [error ,setError] = useState('');
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
                                 
            setUser(res);        
          }
        } catch (error) {
          setError(error.message);
        }
      };
    
      useEffect(() =>{
        fetchUser();
      },[]);
    

    const isFavorited = (facilityId) => {
        return user && user?.favoriteFacility?.includes(facilityId);
    };
    return (
        <>
            <h3>List of facilities</h3>
            <Box sx={{ flexGrow: 1, height: '75vh', overflowY: 'auto' }}>
                
                <Grid container direction="row" justifyContent="center"  alignItems="stretch" spacing={{ xs: 2, sm: 4, md:3 }} columns={{ xs: 2, sm: 4, md: 8 }} >
                {facilities.map((facility,index) => (
                    <Grid item xs={2} sm={4} md={4} key={index}>
                        <Item>
                            <p><b>{facility.name}</b></p>
                            <p> 
                            {facility.category}<br />
                            {facility.address}<br />
                            {facility.contact}<br />
                            </p>
                            <IconButton
                                color={isFavorited(facility._id) ? 'secondary' : 'default'}
                                onClick={() => isFavorited(facility._id) ? onUnfavorite(facility._id) : onFavorite(facility._id)}
                            >
                                <FavoriteIcon />
                            </IconButton>
                        </Item>
                        
                    </Grid>
                ))}
                </Grid>
            </Box>
        </>
    );
};

export default Facilities;