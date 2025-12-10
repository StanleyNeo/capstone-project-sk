const express = require('express');
const app = express();
const PORT = 5001;

app.use(express.json());

// Home route
app.get('/', (req, res) => {
  res.send('Welcome to the LMS backend!');
});

// GET courses
app.get('/courses', (req, res) => {
  const courses = [
    { id: 1, name: 'React for Beginners' },
    { id: 2, name: 'Intro to Data Science' },
    { id: 3, name: 'AI Fundamentals' }
  ];
  res.json(courses);
});

// POST enroll
app.post('/enroll', (req, res) => {
  if (!req.body.userId || !req.body.courseId) {
    return res.status(400).json({
      error: 'Missing userId or courseId in request.'
    });
  }
  
  const { userId, courseId } = req.body;
  res.json({
    message: `User ${userId} successfully enrolled in course ${courseId}.`
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});