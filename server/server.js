require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 5000;
const cors = require('cors');
const dotenv = require('dotenv');

const userRoutes = require('./routes/users');
const facilityRoutes = require('./routes/facilities');

// Load environment variables from .env file
dotenv.config();

app.use(cors());
app.use(express.json());

// Middleware
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/chemnitz', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/', (req, res) => res.send('Hello World!'));

app.use('/api/users', userRoutes);
app.use('/api/facilities', facilityRoutes);


// Start server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
