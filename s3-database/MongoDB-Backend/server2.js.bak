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

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('MongoDB connected successfully');
});

// School Schema
const schoolSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, 'School name is required'],
    trim: true
  },
  address: { 
    type: String, 
    required: [true, 'Address is required'],
    trim: true
  },
  principal: { 
    type: String, 
    required: [true, 'Principal name is required'],
    trim: true
  },
  establishedYear: {
    type: Number,
    min: 1800,
    max: new Date().getFullYear()
  },
  studentCount: {
    type: Number,
    default: 0,
    min: 0
  },
  contactEmail: {
    type: String,
    trim: true,
    lowercase: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const School = mongoose.model('School', schoolSchema);

// Course Schema
const courseSchema = new mongoose.Schema({
  courseCode: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: String,
  credits: {
    type: Number,
    min: 1,
    max: 6
  },
  instructor: String,
  department: String,
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const Course = mongoose.model('Course', courseSchema);

// Initialize sample data
const initializeData = async () => {
  try {
    // Check if data already exists
    const schoolCount = await School.countDocuments();
    const courseCount = await Course.countDocuments();
    
    if (schoolCount === 0) {
      await School.insertMany([
        {
          name: 'Greenwood High School',
          address: '123 Maple Street, Springfield',
          principal: 'Mr. John Adams',
          establishedYear: 1995,
          studentCount: 1200,
          contactEmail: 'info@greenwood.edu'
        },
        {
          name: 'Riverside Public School',
          address: '456 Oak Avenue, Riverdale',
          principal: 'Ms. Linda Carter',
          establishedYear: 1980,
          studentCount: 850,
          contactEmail: 'contact@riverside.edu'
        }
      ]);
      console.log('Sample schools added');
    }
    
    if (courseCount === 0) {
      await Course.insertMany([
        {
          courseCode: 'MATH101',
          title: 'Mathematics Fundamentals',
          description: 'Basic mathematics course for beginners',
          credits: 3,
          instructor: 'Dr. Smith',
          department: 'Mathematics'
        },
        {
          courseCode: 'CS201',
          title: 'Computer Science Basics',
          description: 'Introduction to programming and algorithms',
          credits: 4,
          instructor: 'Prof. Johnson',
          department: 'Computer Science'
        }
      ]);
      console.log('Sample courses added');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

// Routes
// Schools routes
app.get('/api/schools', async (req, res) => {
  try {
    const schools = await School.find().sort({ name: 1 });
    res.json({
      success: true,
      count: schools.length,
      data: schools
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post('/api/schools', async (req, res) => {
  try {
    const school = new School(req.body);
    await school.save();
    res.status(201).json({
      success: true,
      message: 'School created successfully',
      data: school
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// Courses routes
app.get('/api/courses', async (req, res) => {
  try {
    const courses = await Course.find({ isActive: true });
    res.json({
      success: true,
      count: courses.length,
      data: courses
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

app.post('/api/courses', async (req, res) => {
  try {
    const course = new Course(req.body);
    await course.save();
    res.status(201).json({
      success: true,
      message: 'Course created successfully',
      data: course
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err.message
    });
  }
});

// Get school by ID
app.get('/api/schools/:id', async (req, res) => {
  try {
    const school = await School.findById(req.params.id);
    if (!school) {
      return res.status(404).json({
        success: false,
        error: 'School not found'
      });
    }
    res.json({
      success: true,
      data: school
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
});

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'School Management System API (MongoDB)',
    version: '1.0.0',
    endpoints: [
      'GET  /api/schools - List all schools',
      'POST /api/schools - Add new school',
      'GET  /api/schools/:id - Get school by ID',
      'GET  /api/courses - List all courses',
      'POST /api/courses - Add new course'
    ]
  });
});

// Initialize data and start server
initializeData().then(() => {
  app.listen(PORT, () => {
    console.log(`MongoDB Backend running on http://localhost:${PORT}`);
    console.log('Database initialized with sample data');
  });
});