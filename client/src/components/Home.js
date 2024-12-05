import React, { useEffect } from 'react';

const Home = () => {

  useEffect(() => {
    console.log('Home component rendered');
  }, []);

  return (
    <div>
      <h2>Welcome to the Chemnitz Facilities Map</h2>
      <p>Use the navigation to explore the map, register, or log in.</p>
    </div>
  );
};

export default Home;