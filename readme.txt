#initial start application
npm init -y

#Run command for MongoDB setup
node ./scripts/initDb.js

#install packages in client
cd client
npm install


#install packages in server
cd server
npm install

#For run the application
#in client
npm start
#in server
node server.js
