const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const User = require('./models/userModel'); // We'll create this

const app = express();
const PORT = 5002;

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

// Simulated course database (enhanced)
const courses = [
  { 
    id: 1, 
    name: 'React for Beginners',
    description: 'Learn React fundamentals and build your first application. Covering components, props, state, and hooks.',
    duration: '4 weeks',
    level: 'Beginner',
    category: 'Web Development',
    instructor: 'Sarah Johnson',
    price: '$49.99',
    rating: 4.8,
    students: 1250,
    modules: 12,
    image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400',
    syllabus: ['JSX Fundamentals', 'Components & Props', 'State Management', 'React Hooks', 'Routing', 'API Integration']
  },
  { 
    id: 2, 
    name: 'Intro to Data Science',
    description: 'Master data analysis and machine learning concepts with Python. Perfect for beginners.',
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Data Science',
    instructor: 'Michael Chen',
    price: '$69.99',
    rating: 4.7,
    students: 890,
    modules: 16,
    image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w-400',
    syllabus: ['Python Basics', 'Pandas & NumPy', 'Data Visualization', 'Machine Learning', 'Statistical Analysis']
  },
  { 
    id: 3, 
    name: 'AI Fundamentals',
    description: 'Understand artificial intelligence and machine learning from ground up.',
    duration: '8 weeks',
    level: 'Advanced',
    category: 'AI/ML',
    instructor: 'Dr. Emily Wilson',
    price: '$89.99',
    rating: 4.9,
    students: 540,
    modules: 20,
    image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=400',
    syllabus: ['Neural Networks', 'Deep Learning', 'NLP', 'Computer Vision', 'Reinforcement Learning']
  },
  { 
    id: 4, 
    name: 'Full Stack Web Development',
    description: 'Build complete web applications with React, Node.js, and MongoDB.',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'Web Development',
    instructor: 'David Lee',
    price: '$99.99',
    rating: 4.6,
    students: 2100,
    modules: 24,
    image: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?w=400',
    syllabus: ['Frontend Development', 'Backend APIs', 'Database Design', 'Authentication', 'Deployment']
  },
  { 
    id: 5, 
    name: 'Python Programming',
    description: 'Master Python programming from basics to advanced topics.',
    duration: '5 weeks',
    level: 'Beginner',
    category: 'Programming',
    instructor: 'Robert Smith',
    price: '$39.99',
    rating: 4.5,
    students: 3100,
    modules: 14,
    image: 'https://images.unsplash.com/photo-1526379879527-8559ecfcaec6?w=400',
    syllabus: ['Python Syntax', 'Functions & Modules', 'OOP', 'File Handling', 'Web Scraping']
  },
  { 
    id: 6, 
    name: 'UI/UX Design',
    description: 'Learn user interface and user experience design principles.',
    duration: '6 weeks',
    level: 'Beginner',
    category: 'Design',
    instructor: 'Lisa Wang',
    price: '$59.99',
    rating: 4.8,
    students: 980,
    modules: 15,
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400',
    syllabus: ['Design Principles', 'Figma Tools', 'Wireframing', 'Prototyping', 'User Testing']
  }
];

// User Model for Express (simple version)
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  enrolledCourses: [{
    courseId: Number,
    progress: Number,
    enrolledAt: Date
  }]
});

const UserModel = mongoose.model('User', userSchema);

// AUTHENTICATION ENDPOINTS

// Register user
app.post('/api/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
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
      password, // In production, hash this!
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
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Login user
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
    
    // Simple password check (in production, use bcrypt)
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

// EXISTING ENDPOINTS (enhanced)

app.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

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

// Enhanced AI Recommendation
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
  } else if (interest.includes('design') || interest.includes('ui')) {
    recommendations = courses.filter(c => 
      c.category === 'Design' && 
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

// Enhanced enroll endpoint
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

app.listen(PORT, () => {
  console.log(`Enhanced Express Backend on http://localhost:${PORT}`);
});