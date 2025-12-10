import React from 'react';
import { useData } from '../contexts/DataContext';

function Dashboard() {
  const { userCourses, courses, loading, enrollInCourse, trackProgress } = useData();

  const handleEnroll = async (courseId) => {
    const result = await enrollInCourse(courseId);
    alert(result.message);
  };

  const handleProgress = async (courseId) => {
    const progress = Math.floor(Math.random() * 100);
    const score = Math.floor(Math.random() * 100);
    await trackProgress(courseId, progress, score);
    alert(`Progress updated: ${progress}%, Score: ${score}`);
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Learning Dashboard</h1>
      
      {/* Enrolled Courses */}
      <div className="card mb-4">
        <div className="card-body">
          <h3>My Courses ({userCourses.length})</h3>
          {userCourses.length === 0 ? (
            <p className="text-muted">You haven't enrolled in any courses yet.</p>
          ) : (
            <div className="row">
              {userCourses.map((course, index) => (
                <div className="col-md-6 mb-3" key={index}>
                  <div className="card">
                    <div className="card-body">
                      <h5 className="card-title">{course.courseName}</h5>
                      <div className="progress mb-2">
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{ width: `${course.progress || 0}%` }}
                        >
                          {course.progress || 0}%
                        </div>
                      </div>
                      <button 
                        className="btn btn-sm btn-success"
                        onClick={() => handleProgress(course.courseId)}
                      >
                        Update Progress
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Available Courses */}
      <div className="card">
        <div className="card-body">
          <h3>Available Courses ({courses.length})</h3>
          <div className="row">
            {courses.map(course => (
              <div className="col-md-4 mb-3" key={course.id}>
                <div className="card h-100">
                  <div className="card-body">
                    <h5 className="card-title">{course.name}</h5>
                    <p className="card-text">{course.description || 'No description available'}</p>
                    <p className="card-text">
                      <small className="text-muted">
                        Duration: {course.duration || 'N/A'} | Level: {course.level || 'Beginner'}
                      </small>
                    </p>
                    <button 
                      className="btn btn-primary"
                      onClick={() => handleEnroll(course.id)}
                    >
                      Enroll Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;