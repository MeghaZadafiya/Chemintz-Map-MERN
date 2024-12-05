# Chemintz-Map-MERN
Chemnitz-map (Facility Locator) is a MERN stack app that helps users find nearby facilities like hospitals, schools, and clinics. It uses a JSON dataset for MongoDB, Google Maps API for navigation and distance calculation, and provides secure login, profile updates, and favorite facility management. Interactive maps enhance the user experience.

**Facility Locator - MERN Stack Application**
**Overview**
Facility Locator is a web application built using the MERN Stack (MongoDB, Express.js, React.js, Node.js) that helps users locate nearby facilities such as kindergartens, hospitals, universities, clinics, and more. The application uses the Google Maps API to provide real-time distance and navigation details between the user’s current location and selected facilities.

This repository contains all the source code and assets for the project.

**Features**
1. User Authentication
User registration, login, and profile updates.
Secure user sessions with favorites functionality.
2. Facility Search
Search nearby facilities by category (e.g., hospitals, schools).
Facility data is dynamically loaded from a JSON file and stored in MongoDB.
3. Google Maps Integration
Displays facilities on an interactive Google Map.
Calculates and shows the distance and route from the user’s location to the selected facility.
4. Favorites Management
Users can mark facilities as favorites for easy access.
View and manage favorite facilities in a dedicated section.

**Tech Stack**
**Frontend:**
React.js: For building the user interface.
Axios: For API calls to the backend.
**Backend:**
Node.js with Express.js: For handling server-side logic and API endpoints.
Database:
MongoDB: To store facility data, user information, and favorite facilities.
APIs:
Google Maps API: For distance calculation and map integration.

**Installation and Setup**
**Prerequisites:**
Node.js installed on your machine.
MongoDB instance set up locally or on the cloud.
API Key for Google Maps API.
**Steps:**
Clone the Repository:

bash
Copy code
git clone https://github.com/your-username/facility-locator.git
cd facility-locator

**Install Dependencies: 
For backend:**

bash
Copy code
cd backend
npm install
For frontend:

bash
Copy code
cd ../frontend
npm install

**Configure Environment Variables:** Create .env files in the backend and frontend directories with the following values:

**Backend (/backend/.env):**

env
Copy code
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

**Frontend (/frontend/.env):**

env
Copy code
REACT_APP_GOOGLE_MAPS_API_KEY=your_google_maps_api_key
Run the Application: Start the backend:

bash
Copy code
cd backend
npm start
Start the frontend:

bash
Copy code
cd ../frontend
npm start

Access the App: Open your browser and navigate to:

**Frontend: http://localhost:3000
Backend API: http://localhost:5000**

**Folder Structure**
graphql
Copy code
facility-locator/
├── backend/              # Backend code
│   ├── controllers/      # Route controllers
│   ├── models/           # MongoDB models
│   ├── routes/           # API routes
│   ├── config/           # Database and JWT configuration
│   └── server.js         # Entry point for the backend
├── frontend/             # Frontend code
│   ├── src/
│   │   ├── components/   # React components
│   │   ├── pages/        # Pages for different routes
│   │   └── App.js        # Main React app entry point
└── README.md             # Project documentation

**Future Enhancements**
Add filtering and sorting options for facility search results.
Implement real-time notifications for nearby events or offers.
Optimize performance for large datasets.
