// src/components/SearchPanel.js

import React, { useState } from 'react';
import axios from 'axios';

const categories = [
    'All',
    'Grundschule',
    'Oberschule',
    'Förderschule',
    'Gymnasium',
    'Berufsbildende Schule',
    'Kindertageseinrichtungen',
    'Schulsozialarbeit',
    'Jugendberufshilfe',
];

const SearchPanel = ({ onCategoryChange, onHomeLocationChange }) => {
    const [address, setAddress] = useState('');

    const handleSelectChange = (e) => {
        const selectedCategory = e.target.value;
        onCategoryChange(selectedCategory === 'All' ? '' : selectedCategory);
    };

    const handleAddressChange = (e) => {
        setAddress(e.target.value);
    };

    const handleAddressSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
            );
            const location = response.data.results[0].geometry.location;
            onHomeLocationChange(location);
        } catch (err) {
            console.error('Error fetching location:', err);
        }
    };

    return (
        <div className="filter-panel">
            <p>Filter by Category</p>
            <select onChange={handleSelectChange}>
                {categories.map((category) => (
                    <option key={category} value={category}>
                        {category}
                    </option>
                ))}
            </select>
            <p>Enter Home Address</p>
            <form onSubmit={handleAddressSubmit}>
                <input type="text" value={address} onChange={handleAddressChange} placeholder="Enter your home address" />
                <button type="submit">Set</button>
            </form>
        </div>
    );
};

export default SearchPanel;
