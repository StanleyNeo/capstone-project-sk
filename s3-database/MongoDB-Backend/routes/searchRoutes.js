const express = require('express');
const router = express.Router();

// Try to load Course model, but have fallback
let Course;
try {
  Course = require('../models/Course');
  console.log('✅ Course model loaded successfully');
} catch (error) {
  console.log('⚠️ Course model not found, using sample data');
  Course = null;
}

// Sample course data for fallback
const sampleCourses = [
  {
    _id: "1",
    title: "Python Programming",
    description: "Learn Python programming from scratch. Perfect for beginners who want to start coding.",
    category: "Programming",
    level: "Beginner",
    instructor: "John Smith",
    duration: "7 weeks",
    rating: 4.5,
    enrolledStudents: 52,
    price: "$39.99",
    tags: ["python", "programming", "beginner", "coding"]
  },
  {
    _id: "2",
    title: "Web Development Fundamentals",
    description: "Learn HTML, CSS, and JavaScript to build modern websites.",
    category: "Web Development",
    level: "Beginner",
    instructor: "Sarah Johnson",
    duration: "6 weeks",
    rating: 4.7,
    enrolledStudents: 45,
    price: "$49.99",
    tags: ["web", "html", "css", "javascript", "beginner"]
  },
  {
    _id: "3",
    title: "Data Science with Python",
    description: "Introduction to data science, analysis, and visualization using Python.",
    category: "Data Science",
    level: "Intermediate",
    instructor: "Michael Chen",
    duration: "8 weeks",
    rating: 4.7,
    enrolledStudents: 32,
    price: "$59.99",
    tags: ["data", "python", "analysis", "visualization"]
  },
  {
    _id: "4",
    title: "React for Beginners",
    description: "Learn React.js to build modern web applications with reusable components.",
    category: "Web Development",
    level: "Beginner",
    instructor: "Emma Wilson",
    duration: "6 weeks",
    rating: 4.7,
    enrolledStudents: 41,
    price: "$54.99",
    tags: ["react", "javascript", "frontend", "web"]
  },
  {
    _id: "5",
    title: "Machine Learning Fundamentals",
    description: "Introduction to AI and machine learning concepts and algorithms.",
    category: "AI/ML",
    level: "Intermediate",
    instructor: "Dr. AI Expert",
    duration: "10 weeks",
    rating: 4.6,
    enrolledStudents: 28,
    price: "$69.99",
    tags: ["ai", "ml", "machine learning", "algorithms"]
  }
];

// Helper function to get courses (from DB or sample)
const getCourses = async () => {
  if (Course) {
    try {
      const courses = await Course.find({});
      return courses;
    } catch (error) {
      console.error('Error fetching courses from DB:', error);
      return sampleCourses;
    }
  }
  return sampleCourses;
};

// ========== ENHANCED AI ALGORITHMS FOR PHASE 2 ==========

// Enhanced search patterns with weights
const enhancedSearchPatterns = {
  'web': { 
    terms: ['web', 'website', 'frontend', 'backend', 'fullstack', 'javascript', 'react', 'html', 'css', 'node', 'vue', 'angular'],
    weight: 3,
    categories: ['Web Development', 'Programming']
  },
  'ai': { 
    terms: ['ai', 'artificial intelligence', 'machine learning', 'neural', 'deep learning', 'ml', 'chatgpt', 'llm'],
    weight: 3,
    categories: ['AI/ML', 'Data Science']
  },
  'data': { 
    terms: ['data', 'analytics', 'python', 'statistics', 'analysis', 'data science', 'visualization', 'pandas', 'numpy'],
    weight: 2.5,
    categories: ['Data Science', 'Programming']
  },
  'design': { 
    terms: ['design', 'ui', 'ux', 'interface', 'user experience', 'figma', 'prototype', 'wireframe'],
    weight: 2,
    categories: ['Design']
  },
  'programming': { 
    terms: ['programming', 'coding', 'software', 'developer', 'code', 'algorithm', 'debug'],
    weight: 2,
    categories: ['Programming', 'Web Development']
  },
  'python': { 
    terms: ['python', 'django', 'flask', 'fastapi', 'pandas', 'numpy', 'matplotlib'],
    weight: 2.5,
    categories: ['Programming', 'Data Science']
  },
  'javascript': { 
    terms: ['javascript', 'js', 'ecmascript', 'typescript', 'node', 'express'],
    weight: 2,
    categories: ['Web Development', 'Programming']
  },
  'beginner': { 
    terms: ['beginner', 'starter', 'fundamentals', 'basics', 'intro', 'getting started', 'newbie'],
    weight: 1.5,
    levels: ['Beginner']
  },
  'advanced': { 
    terms: ['advanced', 'expert', 'master', 'pro', 'professional', 'senior'],
    weight: 1.5,
    levels: ['Advanced', 'Intermediate']
  }
};

// Enhanced smart search algorithm
const performEnhancedSmartSearch = (courses, query) => {
  const queryLower = query.toLowerCase();
  const words = queryLower.split(' ').filter(w => w.length > 2);
  
  // Find matched patterns with their weights
  const matchedPatterns = [];
  Object.entries(enhancedSearchPatterns).forEach(([pattern, data]) => {
    if (data.terms.some(term => queryLower.includes(term))) {
      matchedPatterns.push({ 
        pattern, 
        weight: data.weight,
        categories: data.categories || [],
        levels: data.levels || []
      });
    }
  });

  // Calculate scores for each course
  const results = courses.map(course => {
    const courseData = course.toObject ? course.toObject() : course;
    let score = 0;
    let matchReasons = [];
    
    // 1. Title match (highest priority)
    if (courseData.title?.toLowerCase().includes(queryLower)) {
      score += 5;
      matchReasons.push('exact title match');
    } else {
      // Partial title matches
      words.forEach(word => {
        if (courseData.title?.toLowerCase().includes(word)) {
          score += 2;
          matchReasons.push(`title contains "${word}"`);
        }
      });
    }
    
    // 2. Description match
    if (courseData.description?.toLowerCase().includes(queryLower)) {
      score += 3;
      matchReasons.push('exact description match');
    } else {
      words.forEach(word => {
        if (courseData.description?.toLowerCase().includes(word)) {
          score += 1;
          matchReasons.push(`description contains "${word}"`);
        }
      });
    }
    
    // 3. Category match
    if (courseData.category?.toLowerCase().includes(queryLower)) {
      score += 4;
      matchReasons.push('exact category match');
    } else {
      words.forEach(word => {
        if (courseData.category?.toLowerCase().includes(word)) {
          score += 2;
          matchReasons.push(`category contains "${word}"`);
        }
      });
    }
    
    // 4. Pattern-based scoring
    matchedPatterns.forEach(({ pattern, weight, categories, levels }) => {
      if (categories.includes(courseData.category)) {
        score += weight * 2;
        matchReasons.push(`pattern "${pattern}" matches category`);
      }
      if (courseData.title?.toLowerCase().includes(pattern)) {
        score += weight;
        matchReasons.push(`pattern "${pattern}" in title`);
      }
      if (courseData.description?.toLowerCase().includes(pattern)) {
        score += weight * 0.5;
        matchReasons.push(`pattern "${pattern}" in description`);
      }
      if (courseData.tags && courseData.tags.some(tag => tag.toLowerCase().includes(pattern))) {
        score += weight * 0.8;
        matchReasons.push(`pattern "${pattern}" in tags`);
      }
      if (levels.includes(courseData.level)) {
        score += weight * 0.7;
        matchReasons.push(`pattern "${pattern}" matches level`);
      }
    });
    
    // 5. Level matching
    if (words.some(word => courseData.level?.toLowerCase().includes(word))) {
      score += 1.5;
      matchReasons.push('level match');
    }
    
    // 6. Rating boost
    if (courseData.rating) {
      const ratingBoost = (courseData.rating - 4) * 0.8;
      score += ratingBoost;
      if (ratingBoost > 0) matchReasons.push('high rating');
    }
    
    // 7. Popularity boost
    if (courseData.enrolledStudents) {
      const popularityBoost = Math.log10(courseData.enrolledStudents + 1) * 0.5;
      score += popularityBoost;
      if (popularityBoost > 0.3) matchReasons.push('popular course');
    }
    
    // 8. Duration bonus (shorter courses preferred for beginners)
    if (queryLower.includes('beginner') && courseData.duration?.includes('week')) {
      const weeks = parseInt(courseData.duration);
      if (weeks <= 6) {
        score += 1;
        matchReasons.push('short duration for beginners');
      }
    }

    // 9. Instructor match
    if (courseData.instructor?.toLowerCase().includes(queryLower)) {
      score += 2;
      matchReasons.push('instructor match');
    }

    return {
      ...courseData,
      relevanceScore: Math.min(100, Math.round(score * 2)),
      matchReasons: [...new Set(matchReasons)].slice(0, 3) // Top 3 reasons
    };
  })
  .filter(course => course.relevanceScore > 15) // Higher threshold
  .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
};

// Basic keyword search
const performKeywordSearch = (courses, query) => {
  const queryLower = query.toLowerCase();
  return courses.filter(course => {
    const courseData = course.toObject ? course.toObject() : course;
    return (
      courseData.title?.toLowerCase().includes(queryLower) ||
      courseData.description?.toLowerCase().includes(queryLower) ||
      courseData.category?.toLowerCase().includes(queryLower) ||
      courseData.level?.toLowerCase().includes(queryLower) ||
      courseData.instructor?.toLowerCase().includes(queryLower) ||
      (courseData.tags && courseData.tags.some(tag => tag.toLowerCase().includes(queryLower)))
    );
  });
};

// Smart search with basic NLP
const performSmartSearch = (courses, query) => {
  const queryLower = query.toLowerCase();
  
  // Define search patterns
  const searchPatterns = {
    'web': ['web', 'website', 'frontend', 'backend', 'fullstack', 'javascript', 'react', 'html', 'css', 'node'],
    'ai': ['ai', 'artificial intelligence', 'machine learning', 'neural', 'deep learning', 'ml'],
    'data': ['data', 'analytics', 'python', 'statistics', 'analysis', 'data science'],
    'design': ['design', 'ui', 'ux', 'interface', 'user experience'],
    'programming': ['programming', 'coding', 'software', 'developer', 'code'],
    'python': ['python', 'django', 'flask'],
    'beginner': ['beginner', 'starter', 'fundamentals', 'basics', 'intro'],
    'advanced': ['advanced', 'expert', 'master', 'pro']
  };

  // Find matching patterns
  const matchedPatterns = [];
  Object.entries(searchPatterns).forEach(([pattern, synonyms]) => {
    if (synonyms.some(synonym => queryLower.includes(synonym))) {
      matchedPatterns.push(pattern);
    }
  });

  // Search courses with scoring
  const results = courses.map(course => {
    const courseData = course.toObject ? course.toObject() : course;
    let score = 0;
    
    // Exact matches
    if (courseData.title?.toLowerCase().includes(queryLower)) score += 3;
    if (courseData.description?.toLowerCase().includes(queryLower)) score += 2;
    
    // Category and level matches
    if (courseData.category?.toLowerCase().includes(queryLower)) score += 2;
    if (courseData.level?.toLowerCase().includes(queryLower)) score += 1;
    
    // Pattern-based scoring
    matchedPatterns.forEach(pattern => {
      if (courseData.category?.toLowerCase().includes(pattern)) score += 2;
      if (courseData.title?.toLowerCase().includes(pattern)) score += 1;
      if (courseData.description?.toLowerCase().includes(pattern)) score += 1;
      if (courseData.tags && courseData.tags.some(tag => tag.toLowerCase().includes(pattern))) score += 1;
    });
    
    // Rating boost
    if (courseData.rating) score += (courseData.rating - 4) * 0.5;
    
    // Popularity boost
    if (courseData.enrolledStudents) score += Math.log10(courseData.enrolledStudents + 1) * 0.3;

    return {
      ...courseData,
      relevanceScore: Math.min(100, Math.round(score * 3))
    };
  })
  .filter(course => course.relevanceScore > 10)
  .sort((a, b) => b.relevanceScore - a.relevanceScore);

  return results;
};

// ========== ROUTES ==========

// Unified search endpoint
router.post('/', async (req, res) => {
  try {
    const { query, type = 'smart' } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        results: [],
        message: 'Please enter at least 2 characters'
      });
    }

    console.log(`🎯 ${type} search: "${query}"`);
    
    // Get courses (from DB or sample)
    const courses = await getCourses();
    
    let results;
    if (type === 'keyword') {
      results = performKeywordSearch(courses, query);
    } else {
      results = performSmartSearch(courses, query);
    }

    res.json({
      success: true,
      results: results.slice(0, 10),
      count: results.length,
      query,
      searchType: type,
      source: Course ? 'database' : 'sample data'
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      results: []
    });
  }
});

// Basic search endpoint
router.post('/basic', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        results: [],
        message: 'Please enter at least 2 characters'
      });
    }

    console.log(`🔍 Basic search: "${query}"`);
    const courses = await getCourses();
    const results = performKeywordSearch(courses, query);

    res.json({
      success: true,
      results: results.slice(0, 10),
      count: results.length,
      query,
      searchType: 'keyword'
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Search failed',
      results: []
    });
  }
});

// Smart search endpoint
router.post('/smart', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        results: [],
        message: 'Please enter at least 2 characters'
      });
    }

    console.log(`🤖 Smart search: "${query}"`);
    const courses = await getCourses();
    const results = performSmartSearch(courses, query);

    res.json({
      success: true,
      results: results.slice(0, 10),
      count: results.length,
      query,
      searchType: 'smart',
      source: Course ? 'database' : 'sample data'
    });

  } catch (error) {
    console.error('Smart search error:', error);
    res.status(500).json({
      success: false,
      error: 'Smart search failed',
      results: []
    });
  }
});

// Test endpoint
router.get('/test', async (req, res) => {
  const courses = await getCourses();
  res.json({
    success: true,
    message: 'Search API is working',
    totalCourses: courses.length,
    source: Course ? 'MongoDB Database' : 'Sample Data',
    endpoints: {
      'POST /api/search': 'Unified search (defaults to smart)',
      'POST /api/search/basic': 'Keyword search',
      'POST /api/search/smart': 'AI-enhanced search',
      'GET /api/search/test': 'Test endpoint'
    }
  });
});

// Health check - GET endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    status: 'healthy',
    timestamp: new Date().toISOString(),
    version: '2.0',
    features: {
      smartSearch: 'AI-powered natural language search',
      enhancedSearch: 'Weighted pattern matching with insights',
      keywordSearch: 'Traditional exact matching',
      suggestions: 'Real-time search suggestions'
    },
    endpoints: {
      'POST /': 'Unified search (defaults to smart)',
      'POST /basic': 'Keyword search', 
      'POST /smart': 'AI search',
      'POST /enhanced': 'Enhanced AI search (NEW)',
      'GET /suggestions?q=query': 'Search suggestions',
      'GET /test': 'Test endpoint',
      'GET /health': 'Health check'
    },
    modelStatus: Course ? '✅ MongoDB connected' : '⚠️ Using sample data',
    sampleData: sampleCourses.length + ' courses available'
  });
});

// ========== ENHANCED SEARCH ENDPOINT ==========
router.post('/enhanced', async (req, res) => {
  try {
    const { query } = req.body;
    
    if (!query || query.trim().length < 2) {
      return res.json({
        success: true,
        results: [],
        message: 'Please enter at least 2 characters'
      });
    }

    console.log(`🚀 ENHANCED search: "${query}"`);
    const courses = await getCourses();
    const results = performEnhancedSmartSearch(courses, query);

    // Generate search insights
    const uniqueCategories = [...new Set(results.map(r => r.category))];
    const matchedPatterns = [];
    
    Object.entries(enhancedSearchPatterns).forEach(([pattern, data]) => {
      if (data.terms.some(term => query.toLowerCase().includes(term))) {
        matchedPatterns.push(pattern);
      }
    });

    const insights = {
      totalCourses: courses.length,
      matchedCourses: results.length,
      matchedPatterns: matchedPatterns,
      categoriesFound: uniqueCategories,
      averageScore: results.length > 0 ? 
        Math.round(results.reduce((sum, r) => sum + r.relevanceScore, 0) / results.length) : 0,
      topCategory: results.length > 0 ? results[0].category : 'None',
      searchComplexity: query.split(' ').length > 3 ? 'complex' : 'simple'
    };

    res.json({
      success: true,
      results: results.slice(0, 15),
      count: results.length,
      query,
      searchType: 'enhanced',
      insights,
      algorithm: 'AI-powered with weighted patterns',
      source: Course ? 'MongoDB Database' : 'Sample Data'
    });

  } catch (error) {
    console.error('Enhanced search error:', error);
    res.status(500).json({
      success: false,
      error: 'Enhanced search failed',
      results: []
    });
  }
});

// Get search suggestions
router.get('/suggestions', async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.length < 2) {
      return res.json({
        success: true,
        suggestions: []
      });
    }

    const queryLower = q.toLowerCase();
    const courses = await getCourses();
    
    // Get unique categories
    const categories = [...new Set(courses.map(c => {
      const courseData = c.toObject ? c.toObject() : c;
      return courseData.category;
    }))];
    
    // Get popular search terms
    const popularTerms = [
      ...categories,
      'Python',
      'JavaScript',
      'React',
      'AI',
      'Machine Learning',
      'Data Science',
      'Web Development',
      'Beginner',
      'Advanced',
      'Design',
      'Programming',
      'Full Stack',
      'UI/UX',
      'Database',
      'Node.js'
    ];

    // Filter suggestions
    const suggestions = popularTerms
      .filter(term => term.toLowerCase().includes(queryLower))
      .slice(0, 8);

    // Add course title suggestions
    const courseSuggestions = courses
      .filter(course => {
        const courseData = course.toObject ? course.toObject() : course;
        return courseData.title?.toLowerCase().includes(queryLower);
      })
      .map(course => {
        const courseData = course.toObject ? course.toObject() : course;
        return courseData.title;
      })
      .slice(0, 4);

    const allSuggestions = [...new Set([...suggestions, ...courseSuggestions])];

    res.json({
      success: true,
      suggestions: allSuggestions.slice(0, 10),
      total: allSuggestions.length
    });

  } catch (error) {
    console.error('Suggestions error:', error);
    res.status(500).json({
      success: false,
      suggestions: []
    });
  }
});

// Test endpoint
router.get('/test', async (req, res) => {
  const courses = await getCourses();
  res.json({
    success: true,
    message: 'Search API is working',
    totalCourses: courses.length,
    source: Course ? 'MongoDB Database' : 'Sample Data',
    endpoints: {
      'POST /api/search': 'Unified search (defaults to smart)',
      'POST /api/search/basic': 'Keyword search',
      'POST /api/search/smart': 'AI-enhanced search',
      'POST /api/search/enhanced': 'Enhanced AI search',
      'GET /api/search/suggestions?q=query': 'Search suggestions',
      'GET /api/search/test': 'Test endpoint',
      'GET /api/search/health': 'Health check'
    },
    sampleQuery: {
      method: 'POST',
      url: '/api/search/enhanced',
      body: { query: 'learn python for beginners' }
    }
  });
});



module.exports = router;