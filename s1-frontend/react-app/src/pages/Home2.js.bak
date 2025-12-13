import React, { useState, useEffect } from 'react';
import PasswordStrength from '../components/PasswordStrength';
import CourseToggle from '../components/CourseToggle';
import ApiService from '../services/api';
import { useData } from '../contexts/DataContext';

function Home() {
  const { courses, loading, getRecommendations } = useData();
  const [recommendation, setRecommendation] = useState('');
  const [interest, setInterest] = useState('');
  const [stats, setStats] = useState({
    totalCourses: 0,
    enrolledCourses: 0,
    completionRate: 0
  });

  useEffect(() => {
    if (courses.length > 0) {
      setStats({
        totalCourses: courses.length,
        enrolledCourses: Math.floor(courses.length * 0.3),
        completionRate: 65
      });
    }
  }, [courses]);

  const handleGetRecommendation = async () => {
    if (interest.trim()) {
      const result = await getRecommendations(interest);
      setRecommendation(result.data?.recommendation || result.recommendation || 'No recommendation available');
    }
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-2">Loading data from backend...</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4 text-primary">AI-Powered Learning Management System</h1>
      <p className="lead mb-4">Live integration with backend APIs and databases</p>
      
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
              <h5 className="card-title">Enrolled</h5>
              <p className="card-text display-6">{stats.enrolledCourses}</p>
            </div>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card text-white bg-warning">
            <div className="card-body">
              <h5 className="card-title">Completion Rate</h5>
              <p className="card-text display-6">{stats.completionRate}%</p>
            </div>
          </div>
        </div>
      </div>

      {/* AI Recommendation */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>AI Course Recommender</h3>
          <div className="input-group mb-3">
            <input
              type="text"
              className="form-control"
              placeholder="Enter your interest (e.g., AI, Web, Data)"
              value={interest}
              onChange={(e) => setInterest(e.target.value)}
            />
            <button className="btn btn-primary" onClick={handleGetRecommendation}>
              Get Recommendation
            </button>
          </div>
          {recommendation && (
            <div className="alert alert-info">
              <strong>AI Suggests:</strong> {recommendation}
            </div>
          )}
        </div>
      </div>

      {/* Course Preview */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>Available Courses (From Backend)</h3>
          <div className="row">
            {courses.slice(0, 2).map(course => (
              <div className="col-md-6 mb-3" key={course.id}>
                <div className="card">
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description || 'Learn essential skills'}</p>
                    <p className="card-text">
                      <small className="text-muted">Level: {course.level || 'Beginner'}</small>
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Original Components */}
      <div className="row">
        <div className="col-md-6">
          <PasswordStrength />
        </div>
        <div className="col-md-6">
          <CourseToggle />
        </div>
      </div>
    </div>
  );
}

export default Home;