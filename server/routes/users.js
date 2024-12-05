const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET; // Use a strong secret key

// Register user
router.post('/register', async (req, res) => {
  const { username, password } = req.body;
  try {

    let userExist = await User.findOne({ username });
    if (userExist) {
      return res.status(400).json({ error: 'This Username is already existed. Try with another username!' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ username: username, password: hashedPassword });
    const userData = await user.save();
    const data = {
            'status':'201',
            'message':'User registered successfully!',
            'user' : userData
          };
    res.status(201).json(data);
  } catch (err) {
    res.status(500).json({'error': 'Error Registered User!'});
  }
});

// Authenticate user
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    
    const user = await User.findOne({ username:username, deleted:"false" });
    if (!user) return res.status(400).json({ error: 'This Username is not existed. Try with another username!' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid password' });
    
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ 'token':token,'userId':user._id });
  } catch (err) {
    res.status(500).json({ error: 'Error logging in' });
  }
});

// Middleware to verify token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) return res.status(403).json({ error: 'No token provided' });

  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).json({ error: 'Failed to authenticate token' });
    req.userId = decoded.id;
    next();
  });
};

// Example protected route
router.get('/profile', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching user profile' });
  }
});

// Set favorite facility
router.put('/favorite', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.favoriteFacility = req.body.favoriteFacility;
    await user.save();
    res.json({ message: 'Favorite facility updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating favorite facility' });
  }
});

// Favorite a facility
router.post('/favorite/:id', verifyToken, async (req, res) => {
  try {
      const facilityId = req.params.id;
      const user = await User.findById(req.userId);
      
      if (!user?.favoriteFacility?.includes(facilityId)) {
        if(user.favoriteFacility === undefined){
          user.favoriteFacility = facilityId;
        }else{
          user.favoriteFacility.push(facilityId);
        }        
        console.log(user);
        await user.save();
      }

      res.status(200).json({user, message:'Facility Favourite Successfully!'});
  } catch (e) {
      res.status(500).json({ error: 'Error updating favorite facility' });
  }
});

// Unfavorite a facility
router.post('/unfavorite/:id', verifyToken, async (req, res) => {
  try {
      const facilityId = req.params.id;
      const user = req.user;

      user.favoriteFacility = user.favoriteFacility.filter(fav => fav.toString() !== facilityId);
      await user.save();

      res.status(200).send(user);
  } catch (e) {
      res.status(500).json({ error: 'Error updating favorite facility' });
  }
});

// Set home address
router.put('/home', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    user.homeAddress = req.body.homeAddress;
    await user.save();
    res.json({ message: 'Home address updated' });
  } catch (err) {
    res.status(500).json({ error: 'Error updating home address' });
  }
});


// Update user
router.put('/update', async (req, res) => {
  const { userId, name, homeAddress, password } = req.body;
  try {
      const user = await User.findById(userId);
      
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.name = name || user.name;
      user.homeAddress = homeAddress || user.homeAddress;
      user.favoriteFacility = user.favoriteFacility
      const hashedPassword = await bcrypt.hash(password, 10);
      if (password) user.password = hashedPassword || user.password; // Hash password before saving

      await user.save();
      res.json({ message: 'User updated successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});

// Delete user (soft delete)
router.delete('/delete', async (req, res) => {
  const { userId } = req.body;
  try {
      const user = await User.findById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.deleted = true; // Assuming you have an 'isDeleted' field in your User model
      await user.save();
      res.json({ message: 'User deleted successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Server error' });
  }
});

// Logout user
router.post('/logout', (req, res) => {
  res.json({ message: 'Logged out successfully' });
});


module.exports = router;
