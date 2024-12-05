// src/pages/Map.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MapComponent from '../components/MapComponent';
import SearchPanel from '../components/SearchPanel';
import { useMediaQuery } from 'react-responsive';
import '../css/Common.css';
import Facilities from './Facilities';
//import mapboxgl from 'mapbox-gl';

const API_URL = process.env.REACT_APP_API_URL;

const Map = () => {
  const [facilities, setFacilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [homeLocation, setHomeLocation] = useState(null);

  const token = localStorage.getItem("token");

  const fetchFacilities = async (category = '') => {
    try {
      const response = await axios.get(`${API_URL}/api/facilities${category ? `?category=${category}` : ''}`);
      setFacilities(response.data);
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

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
        setUser(res.data);
      }
      setLoading(false);
    } catch (error) {
      setError(error.message);
      setLoading(false);
    }
  };

  useEffect(() => {    
    fetchFacilities();
    fetchUser();
  }, []);

  const handleCategoryChange = async (category) => {
    setSelectedCategory(category);
    await fetchFacilities(category);
  };

  const handleHomeLocationChange = (location) => {
    setHomeLocation(location);
  };

  const isTabletOrMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    // if (user && user.homeAddress && facilities.length > 0) {
    //   const fetchDistance = async () => {
        // const mapboxClient = new mapboxgl.MapboxClient('your_mapbox_access_token');
        // const coordinates = facilities.map(facility => [facility.longitude, facility.latitude]);
        // const homeCoordinates = await getCoordinates(user.homeAddress);

        // if (homeCoordinates) {
        //   const responses = await Promise.all(coordinates.map(coordinate =>
        //     mapboxClient.getDirections({
        //       profile: 'driving',
        //       geometries: 'geojson',
        //       steps: false,
        //       waypoints: [
        //         { coordinates: homeCoordinates },
        //         { coordinates: coordinate },
        //       ],
        //     })
        //   ));

        //   const distances = responses.map(response => response.routes[0].distance);
        //   setDistance(distances);
        // }

    //     const service = new window.google.maps.DistanceMatrixService();
    //     const destinations = facilities.map(facility => ({
    //         lat: facility.latitude,
    //         lng: facility.longitude,
    //     }));

    //     service.getDistanceMatrix(
    //         {
    //             origins: [user.homeAddress],
    //             destinations: destinations,
    //             travelMode: 'DRIVING',
    //         },
    //         (response, status) => {
    //             if (status === 'OK') {
    //                 const distanceData = response.rows[0].elements.map((element, index) => ({
    //                     ...facilities[index],
    //                     distance: element.distance.text,
    //                     duration: element.duration.text,
    //                 }));
    //                 console.log(distanceData);
    //                 setDistance(distanceData);
    //             }
    //         }
    //     );

    //   };

    //   fetchDistance();
    // }
  }, [user, facilities]);

  const getCoordinates = async (address) => {
    const response = await axios.get(`https://nominatim.openstreetmap.org/search?q=${address}&format=json`);
    if (response.data.length > 0) {
      return [response.data[0].lon, response.data[0].lat];
    }
    return null;
  };

  const handleFavorite = async (facilityId) => {
    try {
        await axios.post(`${API_URL}/api/users/favorite/${facilityId}`, {user}, {
            headers: {
              authorization: token
            }
        });
        // Update user context or state
    } catch (error) {
        console.error('Error favoriting facility', error);
    }
};

const handleUnfavorite = async (facilityId) => {
    try {
        await axios.post(`${API_URL}/api/users/unfavorite/${facilityId}`, {user}, {
            headers: {
              authorization: token
            }
        });
        // Update user context or state
    } catch (error) {
        console.error('Error unfavoriting facility', error);
    }
};

  return (
    <>
    {loading ? (
      <div>Loading...</div>
    ) : error ? (
      <div>Error: {error}</div>
    ) : (
      
        <div className="app">
          <div className={`search-panel ${isTabletOrMobile ? 'mobile-search-panel' : ''}`}>
            <SearchPanel onCategoryChange={handleCategoryChange} onHomeLocationChange={handleHomeLocationChange} />
            <Facilities facilities={facilities} onFavorite={handleFavorite} onUnfavorite={handleUnfavorite}  />
          </div>
          <div className={`map-view ${isTabletOrMobile ? 'mobile-map' : ''}`}>
            <MapComponent facilities={facilities} homeLocation={homeLocation} />
          </div>
        </div>        
     
    )}
  </>
  
  );
};

export default Map;
