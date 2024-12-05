const express = require('express');
const Facility = require('../models/Facility');
const router = express.Router();

// Get all facilities
router.get('/', async (req, res) => {
  const category = req.query.category;
  try {
    const query = category ? { category } : {};
    const facilities = await Facility.find(query);
    res.json(facilities);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get facility by ID
router.get('/:id', async (req, res) => {
  try {
    const facility = await Facility.findById(req.params.id);
    res.json(facility);
  } catch (err) {
    res.status(500).send('Error fetching facility');
  }
});

module.exports = router;
