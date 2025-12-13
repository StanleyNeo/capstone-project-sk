import React, { useState, useEffect } from 'react';
import PasswordStrength from '../components/PasswordStrength';
import CourseToggle from '../components/CourseToggle';
import Chatbot from '../components/Chatbot';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

function Home() {
  const { currentUser, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState(null);
  const [interest, setInterest] = useState('');
  const [level, setLevel] = useState('beginner');
  const [stats, setStats] = useState({
    totalCourses: 0,
    activeStudents: 0,
    completionRate: 0
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    const data = await ApiService.getCourses();
    setCourses(data);
    setStats({
      totalCourses: data.length,
      activeStudents: data.reduce((sum, course) => sum + course.students, 0),
      completionRate: 78 // Simulated
    });
    setLoading(false);
  };

  const handleGetRecommendation = async () => {
    if (interest.trim()) {
      const result = await ApiService.getRecommendations(interest, level);
      setRecommendation(result);
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-primary">AI-Powered Learning Management System</h1>
      
      {isAuthenticated && currentUser && (
        <div className="alert alert-success">
          Welcome back, <strong>{currentUser.name}</strong>! 
          {currentUser.enrolledCourses?.length > 0 && 
            ` You're enrolled in ${currentUser.enrolledCourses.length} courses.`
          }
        </div>
      )}

      {/* Stats Dashboard */}
      <div className="row mb-4">
        <div className="col-md-4">
          <div className="card text-white bg-primary">
            <div className="card-body">
              <h5 className="card-title">Total Courses</h5>
              <p className="card-text display-6">{stats.totalCourses}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-success">
            <div className="card-body">
              <h5 className="card-title">Active Students</h5>
              <p className="card-text display-6">
                {(stats.activeStudents / 1000).toFixed(1)}K
              </p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Success Rate</h5>
              <p className="card-text display-6">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation Engine */}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">AI Course Recommender</h3>
          <p className="card-text">
            Tell us your interests and we'll recommend the perfect course for you!
          </p>
          
          <div className="row mb-3">
            <div className="col-md-6">
              <label className="form-label">What are you interested in?</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g., Web Development, AI, Data Science, Design"
                value={interest}
                onChange={(e) => setInterest(e.target.value)}
              />
            </div>
            <div className="col-md-4">
              <label className="form-label">Your Skill Level</label>
              <select 
                className="form-select"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button 
                className="btn btn-primary w-100"
                onClick={handleGetRecommendation}
              >
                Get Recommendations
              </button>
            </div>
          </div>

          {recommendation && (
            <div className="alert alert-info">
              <h5>AI Recommendations:</h5>
              <p>{recommendation.message}</p>
              {recommendation.recommendations && recommendation.recommendations.length > 0 && (
                <div className="row mt-3">
                  {recommendation.recommendations.slice(0, 2).map(course => (
                    <div className="col-md-6" key={course.id}>
                      <div className="card">
                        <div className="card-body">
                          <h6>{course.name}</h6>
                          <p className="small">{course.description.substring(0, 100)}...</p>
                          <span className="badge bg-primary">{course.level}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Featured Courses */}
      <div className="card mb-4">
        <div className="card-body">
          <h3 className="card-title">Featured Courses</h3>
          <div className="row">
            {courses.slice(0, 3).map(course => (
              <div className="col-md-4" key={course.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description.substring(0, 100)}...</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="badge bg-secondary">{course.level}</span>
                      <span className="text-primary fw-bold">{course.price}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Practice Components */}
      <div className="row mb-4">
        <div className="col-md-6">
          <PasswordStrength />
        </div>
        <div className="col-md-6">
          <CourseToggle />
        </div>
      </div>

      {/* Chatbot */}
      <Chatbot />
    </div>
  );
}

export default Home;