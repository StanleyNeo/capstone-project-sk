const express = require('express');
const router = express.Router();
const School = require('../models/schoolModel');

router.get('/', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;