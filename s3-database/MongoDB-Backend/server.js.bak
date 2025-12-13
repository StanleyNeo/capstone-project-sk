const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/schoolsystem', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// School Schema
const schoolSchema = new mongoose.Schema({
  name: String,
  address: String,
  principal: String
});
const School = mongoose.model('School', schoolSchema);

// Routes
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find();
    res.json(schools);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/schools', async (req, res) => {
  try {
    const newSchool = new School(req.body);
    await newSchool.save();
    res.status(201).json(newSchool);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('MongoDB connected');
});