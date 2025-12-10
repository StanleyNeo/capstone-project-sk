import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import ApiService from '../services/api';

function Courses() {
  const { currentUser, isAuthenticated } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCourses();
    if (currentUser?.enrolledCourses) {
      setEnrolledCourses(currentUser.enrolledCourses);
    }
  }, [currentUser]);

  const loadCourses = async () => {
    setLoading(true);
    const data = await ApiService.getCourses();
    setCourses(data);
    setLoading(false);
  };

  const handleEnroll = async (courseId) => {
    if (!isAuthenticated) {
      alert('Please login to enroll in courses');
      return;
    }

    const result = await ApiService.enrollCourse(currentUser.id, courseId);
    if (result.success) {
      alert(result.message);
      // Refresh enrolled courses
      if (currentUser?.enrolledCourses) {
        setEnrolledCourses([...currentUser.enrolledCourses, {
          courseId,
          progress: 0
        }]);
      }
    } else {
      alert(result.error || 'Enrollment failed');
    }
  };

  const handleProgressUpdate = async (courseId, progress) => {
    if (!isAuthenticated) return;
    
    const result = await ApiService.updateProgress(currentUser.id, courseId, progress);
    if (result.success) {
      alert('Progress updated!');
      // Update local state
      const updated = enrolledCourses.map(course => 
        course.courseId === courseId 
          ? { ...course, progress } 
          : course
      );
      setEnrolledCourses(updated);
    }
  };

  const filteredCourses = filter === 'all' 
    ? courses 
    : courses.filter(course => course.category === filter);

  const categories = ['all', ...new Set(courses.map(c => c.category))];

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
      <h1 className="mb-4">Course Catalog</h1>
      
      {/* Course Filter */}
      <div className="mb-4">
        <div className="btn-group" role="group">
          {categories.map(category => (
            <button
              key={category}
              type="button"
              className={`btn ${filter === category ? 'btn-primary' : 'btn-outline-primary'}`}
              onClick={() => setFilter(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Course Grid */}
      <div className="row">
        {filteredCourses.map(course => {
          const isEnrolled = enrolledCourses.some(ec => ec.courseId === course.id);
          const enrolledCourse = enrolledCourses.find(ec => ec.courseId === course.id);
          
          return (
            <div className="col-md-4 mb-4" key={course.id}>
              <div className="card h-100 shadow-sm">
                <div className="card-img-top" style={{
                  height: '200px',
                  background: `linear-gradient(135deg, #667eea 0%, #764ba2 100%)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '24px',
                  fontWeight: 'bold'
                }}>
                  {course.name.split(' ').map(word => word[0]).join('')}
                </div>
                <div className="card-body">
                  <h5 className="card-title">{course.name}</h5>
                  <p className="card-text">{course.description}</p>
                  
                  <div className="mb-2">
                    <span className="badge bg-primary me-2">{course.level}</span>
                    <span className="badge bg-secondary me-2">{course.duration}</span>
                    <span className="badge bg-success">{course.rating} ★</span>
                  </div>
                  
                  <div className="mb-3">
                    <small className="text-muted">
                      <i className="bi bi-person me-1"></i>
                      {course.students.toLocaleString()} students • 
                      <i className="bi bi-book ms-2 me-1"></i>
                      {course.modules} modules
                    </small>
                  </div>
                  
                  {isEnrolled ? (
                    <div>
                      <div className="progress mb-2">
                        <div 
                          className="progress-bar" 
                          style={{ width: `${enrolledCourse?.progress || 0}%` }}
                        >
                          {enrolledCourse?.progress || 0}%
                        </div>
                      </div>
                      <button 
                        className="btn btn-outline-primary btn-sm me-2"
                        onClick={() => handleProgressUpdate(course.id, (enrolledCourse?.progress || 0) + 10)}
                      >
                        Update Progress
                      </button>
                      <button className="btn btn-success btn-sm" disabled>
                        Enrolled
                      </button>
                    </div>
                  ) : (
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now - {course.price}
                    </button>
                  )}
                </div>
                <div className="card-footer">
                  <small className="text-muted">
                    Instructor: {course.instructor}
                  </small>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Course Details Modal */}
      {selectedCourse && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{selectedCourse.name}</h5>
                <button 
                  type="button" 
                  className="btn-close"
                  onClick={() => setSelectedCourse(null)}
                ></button>
              </div>
              <div className="modal-body">
                <h6>Syllabus:</h6>
                <ul>
                  {selectedCourse.syllabus?.map((item, index) => (
                    <li key={index}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Courses;