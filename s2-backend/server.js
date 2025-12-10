const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

// Simulated database
const courses = [
  { 
    id: 1, 
    name: 'React for Beginners',
    description: 'Learn React fundamentals and build your first application',
    duration: '4 weeks',
    level: 'Beginner',
    category: 'Web Development'
  },
  { 
    id: 2, 
    name: 'Intro to Data Science',
    description: 'Introduction to data analysis and machine learning concepts',
    duration: '6 weeks',
    level: 'Intermediate',
    category: 'Data Science'
  },
  { 
    id: 3, 
    name: 'AI Fundamentals',
    description: 'Understand the basics of artificial intelligence and machine learning',
    duration: '8 weeks',
    level: 'Advanced',
    category: 'AI/ML'
  },
  { 
    id: 4, 
    name: 'Full Stack Web Development',
    description: 'Build complete web applications with React, Node.js, and MongoDB',
    duration: '12 weeks',
    level: 'Intermediate',
    category: 'Web Development'
  },
  { 
    id: 5, 
    name: 'Python Programming',
    description: 'Master Python programming from basics to advanced topics',
    duration: '5 weeks',
    level: 'Beginner',
    category: 'Programming'
  }
];

const enrollments = [];
const userProgress = {};

// Home route
app.get('/', (req, res) => {
  res.json({
    message: 'AI LMS Backend API',
    version: '1.0.0',
    endpoints: [
      'GET  /courses - List all courses',
      'GET  /recommend?interest=ai - Get AI recommendations',
      'POST /enroll - Enroll in a course',
      'GET  /user/:id/courses - Get user courses',
      'POST /track-progress - Track learning progress'
    ]
  });
});

// GET all courses
app.get('/courses', (req, res) => {
  res.json({
    success: true,
    data: courses,
    count: courses.length
  });
});

// AI Recommendation endpoint
app.get('/recommend', (req, res) => {
  const interest = (req.query.interest || '').toLowerCase();
  let recommendation = 'Explore our full course catalog';
  
  const interestMap = {
    'web': 'Full Stack Web Development',
    'react': 'React for Beginners',
    'data': 'Intro to Data Science',
    'ai': 'AI Fundamentals',
    'python': 'Python Programming',
    'machine': 'AI Fundamentals',
    'javascript': 'React for Beginners'
  };

  for (const [key, courseName] of Object.entries(interestMap)) {
    if (interest.includes(key)) {
      const course = courses.find(c => c.name === courseName);
      recommendation = course ? `${course.name}: ${course.description}` : courseName;
      break;
    }
  }

  res.json({
    success: true,
    data: {
      interest,
      recommendation,
      timestamp: new Date().toISOString()
    }
  });
});

// POST enroll in course
app.post('/enroll', (req, res) => {
  if (!req.body.userId || !req.body.courseId) {
    return res.status(400).json({
      success: false,
      error: 'Missing userId or courseId in request.',
      message: 'Both userId and courseId are required fields'
    });
  }
  
  const { userId, courseId } = req.body;
  const course = courses.find(c => c.id === parseInt(courseId));
  
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
      message: `Course with ID ${courseId} does not exist`
    });
  }
  
  // Simulate enrollment
  const enrollmentId = enrollments.length + 1;
  const enrollmentDate = new Date().toISOString();
  
  enrollments.push({
    enrollmentId,
    userId,
    courseId: parseInt(courseId),
    enrollmentDate,
    status: 'enrolled'
  });
  
  // Initialize progress tracking
  const userKey = `${userId}-${courseId}`;
  if (!userProgress[userKey]) {
    userProgress[userKey] = {
      progress: 0,
      score: 0,
      lastUpdated: enrollmentDate
    };
  }
  
  res.json({
    success: true,
    data: {
      enrollmentId,
      userId,
      courseId,
      courseName: course.name,
      enrollmentDate,
      status: 'enrolled'
    },
    message: `User ${userId} successfully enrolled in "${course.name}"`
  });
});

// GET user courses
app.get('/user/:id/courses', (req, res) => {
  const userId = req.params.id;
  const userEnrollments = enrollments.filter(e => e.userId === userId);
  
  const userCourses = userEnrollments.map(enrollment => {
    const course = courses.find(c => c.id === enrollment.courseId);
    const userKey = `${userId}-${enrollment.courseId}`;
    const progress = userProgress[userKey] || { progress: 0, score: 0 };
    
    return {
      courseId: enrollment.courseId,
      courseName: course?.name || 'Unknown Course',
      enrollmentDate: enrollment.enrollmentDate,
      status: enrollment.status,
      progress: progress.progress,
      score: progress.score,
      lastUpdated: progress.lastUpdated
    };
  });
  
  res.json({
    success: true,
    data: {
      userId,
      courses: userCourses,
      totalCourses: userCourses.length
    }
  });
});

// POST track progress
app.post('/track-progress', (req, res) => {
  const { userId, courseId, progress, score } = req.body;
  
  if (!userId || !courseId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'userId and courseId are required'
    });
  }
  
  const userKey = `${userId}-${courseId}`;
  const course = courses.find(c => c.id === parseInt(courseId));
  
  if (!course) {
    return res.status(404).json({
      success: false,
      error: 'Course not found',
      message: `Course with ID ${courseId} does not exist`
    });
  }
  
  userProgress[userKey] = {
    progress: Math.min(100, Math.max(0, progress || 0)),
    score: Math.min(100, Math.max(0, score || 0)),
    lastUpdated: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: {
      userId,
      courseId,
      courseName: course.name,
      ...userProgress[userKey],
      message: 'Progress updated successfully'
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
  console.log(`Express Backend running on http://localhost:${PORT}`);
  console.log('Simulated data loaded successfully');
});