import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;

// Fix for marker icons not showing correctly
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

const MapComponent = ({ facilities, distance }) => {
  return (
    <MapContainer center={[50.835, 12.92]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      {facilities.map((facility, index) => (
        <Marker key={facility._id} position={[facility.latitude, facility.longitude]}>
          <Popup>
            <b>{facility.name}</b><br />
            {facility.category}<br />
            {facility.address}<br />
            {facility.contact}<br />
            {distance && distance[index] ? `Distance: ${distance[index]} meters` : ''}
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default MapComponent;
