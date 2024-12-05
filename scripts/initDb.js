const axios = require('axios');
const mongoose = require('mongoose');
const Facility = require('../server/models/Facility');
const fs = require('fs');

const MONGODB_URI = 'mongodb://localhost:27017/chemnitz';

// Increase timeout and add debugging
const connectToDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 500000,
      socketTimeoutMS: 4500000,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error('Error connecting to MongoDB', err);
    throw err;
  }
};

const readDataFromFile = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
        return reject(err);
      }
      try {
        const jsonData = JSON.parse(data);
        const facilities = jsonData.features.map(feature => ({
          name: feature.attributes.BEZEICHNUNG,
          category: feature.attributes.ART, // Adjust according to actual category from data
          address: `${feature.attributes.KURZBEZEICHNUNG} ${feature.attributes.STRASSE} ${feature.attributes.PLZ} ${feature.attributes.ORT}`,
          contact: feature.attributes.TELEFON,
          latitude: feature.geometry.y,
          longitude: feature.geometry.x,
        }));
        console.log('Data fetched from API');
        //return facilities;
        resolve(facilities);
      } catch (parseErr) {
        reject(parseErr);
      }
    });
  });
};

// const fetchData = async () => {
//   try {
//     console.log('Fetching data from API...');
//     const res = await axios.get('https://services6.arcgis.com/jiszdsDupTUO3fSM/arcgis/rest/services/Schulen_OpenData/FeatureServer/0/query?where=1%3D1&outFields=*&outSR=4326&f=json');
//     const facilities = res.data.features.map(feature => ({
//       name: feature.attributes.BEZEICHNUNG,
//       category: feature.attributes.ART, // Adjust according to actual category from data
//       address: `${feature.attributes.KURZBEZEICHNUNG} ${feature.attributes.STRASSE} ${feature.attributes.PLZ} ${feature.attributes.ORT}`,
//       contact: feature.attributes.TELEFON,
//       latitude: feature.geometry.y,
//       longitude: feature.geometry.x,
//     }));
//     console.log('Data fetched from API');
//     return facilities;
//   } catch (err) {
//     console.error('Error fetching data from API:', err);
//     throw err;
//   }
// };

const initDB = async (data) => {
  try {
    // await Facility.deleteMany({});
    // console.log('Existing facilities deleted');
    await Facility.insertMany(data);
    console.log('Facilities inserted into database');
  } catch (err) {
    console.error('Error initializing database:', err);
    throw err;
  }
};

const main = async () => {
  try {
    await connectToDB();
    const data = await readDataFromFile('./scripts/facilities.json'); // Adjust path if necessary
    await initDB(data);
    console.log('Database initialization completed successfully');
  } catch (err) {
    console.error('Failed to initialize the database:', err);
  } finally {
    mongoose.connection.close();
  }
};

main();
