// src/components/MapComponent.js

import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { LoadScript } from '@react-google-maps/api';
import axios from 'axios';

const center = [50.8333, 12.9167]; // Chemnitz center coordinates

// Define custom icons with online paths
const schoolIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
  const kindergartenIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167746.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
  const socialChildIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
  
  const socialTeenagerIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/167/167707.png',
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  });
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = ({ facilities, homeLocation }) => {
    const [distances, setDistances] = useState(facilities);

    const getIconByCategory = (selectedCategory) => {
        switch (selectedCategory) {
          case 'school' || 'Grundschule' || 'Oberschule'|| 'Förderschule'||'Gymnasium'||'Berufsbildende Schule':
            return schoolIcon;
          case 'Kindertageseinrichtungen':
            return kindergartenIcon;
          case 'Schulsozialarbeit':
            return socialChildIcon;
          case 'Jugendberufshilfe':
            return socialTeenagerIcon;
          default:
            return new L.Icon({
              iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', // Default icon
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowSize: [41, 41],
            });
        }
      };

    useEffect(() => {
        if (facilities.length > 0 && homeLocation) {
            const service = new window.google.maps.DistanceMatrixService();
            const destinations = facilities.map(facility => ({
                lat: facility.latitude,
                lng: facility.longitude,
            }));

            service.getDistanceMatrix(
                {
                    origins: [homeLocation],
                    destinations: destinations,
                    travelMode: 'DRIVING',
                },
                (response, status) => {
                    if (status === 'OK') {
                        const distanceData = response.rows[0].elements.map((element, index) => ({
                            ...facilities[index],
                            distance: element.distance.text,
                            duration: element.duration.text,
                        }));
                        setDistances(distanceData);
                    }
                }
            );
        }
    }, [facilities, homeLocation]);

    
    const markerIcon = new L.Icon({
        iconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
        shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        iconSize: [38, 95],
        shadowSize: [50, 64],
        iconAnchor: [22, 94],
        shadowAnchor: [4, 62],
        popupAnchor: [-3, -76],
    });

    return (
        <LoadScript googleMapsApiKey={process.env.REACT_APP_GOOGLE_MAPS_API_KEY}>
            <MapContainer center={center} zoom={12} style={{ height: '100vh', width: '100%' }}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {distances.map(facility => (
                    <Marker
                        key={facility._id}
                        position={[facility.latitude, facility.longitude]}
                        icon={getIconByCategory(facility.category)}
                    >
                        <Popup>
                            <b>{facility.name}</b><br />
                            {facility.category}<br />
                            {facility.address}<br />
                            {facility.contact}<br />
                            {facility.distance}<br />
                            {facility.duration}<br />
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </LoadScript>
    );
};

export default MapComponent;
