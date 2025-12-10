// s2-backend/server.js - COMPLETE FILE
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');

// Initialize Express app - MUST BE AT THE TOP
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB for user data
mongoose.connect('mongodb://localhost:27017/lms_users', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to User Database');
});

// Define User Model Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  enrolledCourses: [{
    courseId: Number,
    courseName: String,
    progress: { type: Number, default: 0 },
    enrolledAt: { type: Date, default: Date.now }
  }]
});

const UserModel = mongoose.model('User', userSchema);

// Simulated course database
const courses = [
  { 
    id: 1, 
    name: 'React for Beginners',
    description: 'Learn React fundamentals and build your first application.',
    duration: '4 weeks',
    level: 'Beginner',
    category: 'Web Development',
    instructor: 'Sarah Johnson',
    price: '$49.99',
    rating: 4.8,
    students: 1250,
    modules: 12
  },
  { 
    id: 2, 
    name: 'Intro to Data Science',
    description: 'Introduction to data analysis and machine learning concepts',
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Data Science',
    instructor: 'Michael Chen',
    price: '$69.99',
    rating: 4.7,
    students: 890,
    modules: 16
  },
  { 
    id: 3, 
    name: 'AI Fundamentals',
    description: 'Understand artificial intelligence and machine learning',
    duration: '8 weeks',
    level: 'Advanced',
    category: 'AI/ML',
    instructor: 'Dr. Emily Wilson',
    price: '$89.99',
    rating: 4.9,
    students: 540,
    modules: 20
  }
];

// Password validation middleware function
const validatePassword = (password) => {
  const requirements = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/.test(password),
    noSpaces: !/\s/.test(password)
  };

  const failedRequirements = Object.entries(requirements)
    .filter(([_, met]) => !met)
    .map(([key]) => key);

  return {
    valid: failedRequirements.length === 0,
    failedRequirements,
    score: (Object.values(requirements).filter(Boolean).length / 6) * 100
  };
};

// =================== ROUTES ===================

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'AI LMS Backend API',
    version: '1.0.0',
    endpoints: [
      'GET  /courses - List all courses',
      'POST /api/register - Register new user',
      'POST /api/login - Login user',
      'GET  /api/user/:id - Get user profile',
      'POST /enroll - Enroll in course'
    ]
  });
});

// Get all courses
app.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

// Get course by ID
app.get('/courses/:id', (req, res) => {
  const course = courses.find(c => c.id === parseInt(req.params.id));
  if (!course) {
    return res.status(404).json({ 
      success: false, 
      error: 'Course not found' 
    });
  }
  
  res.json({
    success: true,
    data: course
  });
});

// AI Recommendation endpoint
app.get('/recommend', (req, res) => {
  const interest = (req.query.interest || '').toLowerCase();
  const level = req.query.level || 'beginner';
  
  let recommendations = [];
  
  // AI Logic based on interest and level
  if (interest.includes('web') || interest.includes('react')) {
    recommendations = courses.filter(c => 
      c.category === 'Web Development' && 
      c.level.toLowerCase() === level
    );
  } else if (interest.includes('data') || interest.includes('python')) {
    recommendations = courses.filter(c => 
      (c.category === 'Data Science' || c.category === 'Programming') && 
      c.level.toLowerCase() === level
    );
  } else if (interest.includes('ai') || interest.includes('machine')) {
    recommendations = courses.filter(c => 
      c.category === 'AI/ML' && 
      c.level.toLowerCase() === level
    );
  } else {
    // Default: recommend popular courses
    recommendations = courses
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 3);
  }
  
  res.json({
    success: true,
    data: {
      interest,
      level,
      recommendations,
      message: `Found ${recommendations.length} courses for you`
    }
  });
});

// Registration endpoint
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate password
    const passwordValidation = validatePassword(password);
    if (!passwordValidation.valid) {
      return res.status(400).json({ 
        success: false, 
        error: 'Password does not meet security requirements',
        failedRequirements: passwordValidation.failedRequirements,
        score: passwordValidation.score
      });
    }
    
    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email already registered' 
      });
    }
    
    // Create new user
    const user = new UserModel({
      name,
      email,
      password, // Note: In production, use bcrypt.hash(password, 10)
      enrolledCourses: []
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: 'Registration successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      },
      passwordStrength: {
        score: passwordValidation.score,
        level: passwordValidation.score >= 70 ? 'Strong' : 
               passwordValidation.score >= 40 ? 'Medium' : 'Weak'
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Login endpoint
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    // Simple password check (in production, use bcrypt.compare())
    if (user.password !== password) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }
    
    res.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        enrolledCourses: user.enrolledCourses
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Get user profile
app.get('/api/user/:id', async (req, res) => {
  try {
    const user = await UserModel.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        enrolledCourses: user.enrolledCourses
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Enroll in course
app.post('/enroll', async (req, res) => {
  try {
    const { userId, courseId } = req.body;
    
    if (!userId || !courseId) {
      return res.status(400).json({
        success: false,
        error: 'Missing userId or courseId'
      });
    }
    
    const course = courses.find(c => c.id === parseInt(courseId));
    if (!course) {
      return res.status(404).json({
        success: false,
        error: 'Course not found'
      });
    }
    
    // Update user's enrolled courses
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if already enrolled
    const alreadyEnrolled = user.enrolledCourses.some(c => c.courseId === parseInt(courseId));
    if (alreadyEnrolled) {
      return res.status(400).json({
        success: false,
        error: 'Already enrolled in this course'
      });
    }
    
    user.enrolledCourses.push({
      courseId: parseInt(courseId),
      courseName: course.name,
      progress: 0,
      enrolledAt: new Date()
    });
    
    await user.save();
    
    res.json({
      success: true,
      message: `Successfully enrolled in "${course.name}"`,
      data: {
        courseId,
        courseName: course.name,
        enrolledAt: new Date()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Update progress
app.post('/progress', async (req, res) => {
  try {
    const { userId, courseId, progress } = req.body;
    
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const courseIndex = user.enrolledCourses.findIndex(c => c.courseId === parseInt(courseId));
    if (courseIndex === -1) {
      return res.status(404).json({
        success: false,
        error: 'Course not found in enrolled courses'
      });
    }
    
    user.enrolledCourses[courseIndex].progress = Math.min(100, Math.max(0, progress));
    await user.save();
    
    res.json({
      success: true,
      message: 'Progress updated',
      data: user.enrolledCourses[courseIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Password validation endpoint
app.post('/api/validate-password', (req, res) => {
  const { password } = req.body;
  const validation = validatePassword(password);
  
  res.json({
    success: true,
    data: {
      valid: validation.valid,
      score: validation.score,
      failedRequirements: validation.failedRequirements,
      level: validation.score >= 70 ? 'Strong' : 
             validation.score >= 40 ? 'Medium' : 'Weak'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: 'Something went wrong on the server'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
    message: `Cannot ${req.method} ${req.url}`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Enhanced Express Backend running on http://localhost:${PORT}`);
  console.log('User database connected and ready');
});