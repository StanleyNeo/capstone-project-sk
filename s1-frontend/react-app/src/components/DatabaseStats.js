import React, { useState, useEffect } from 'react';

function DatabaseStats() {
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    loading: true
  });
  const [recentEnrollments, setRecentEnrollments] = useState([]);
  const [topCourses, setTopCourses] = useState([]);
  const [topStudents, setTopStudents] = useState([]);
  const [userDistribution, setUserDistribution] = useState({});
  const [enrollmentStatus, setEnrollmentStatus] = useState([]);
  const [categories, setCategories] = useState([]);
  const [metrics, setMetrics] = useState({});

  useEffect(() => {
    loadDatabaseStats();
  }, []);

  const loadDatabaseStats = async () => {
    setStats(prev => ({ ...prev, loading: true }));
    
    try {
      // Load analytics summary
      const response = await fetch('http://localhost:5000/api/analytics/summary');
      const data = await response.json();
      
      if (data.success) {
        const analytics = data.data;
        setStats({
          users: analytics.totals.users,
          courses: analytics.totals.courses,
          enrollments: analytics.totals.enrollments,
          loading: false
        });
        
        setRecentEnrollments(analytics.recentEnrollments || []);
        setTopCourses(analytics.topCourses || []);
        setTopStudents(analytics.topStudents || []);
        setUserDistribution(analytics.distribution?.users || {});
        setEnrollmentStatus(analytics.distribution?.enrollmentStatus || []);
        setCategories(analytics.distribution?.categories || []);
        setMetrics(analytics.metrics || {});
      }
    } catch (error) {
      console.error('Failed to load database stats:', error);
      setStats(prev => ({ ...prev, loading: false }));
    }
  };

  const getEnrollmentStatusColor = (status) => {
    switch(status) {
      case 'active': return 'primary';
      case 'completed': return 'success';
      case 'dropped': return 'danger';
      default: return 'secondary';
    }
  };

  if (stats.loading) {
    return (
      <div className="card">
        <div className="card-body text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading database stats...</span>
          </div>
          <p className="mt-2">Loading database statistics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card shadow-lg">
      <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
        <h5 className="card-title mb-0">📊 Database Analytics Dashboard</h5>
        <button 
          className="btn btn-sm btn-light"
          onClick={loadDatabaseStats}
          title="Refresh data"
        >
          🔄 Refresh
        </button>
      </div>
      <div className="card-body">
        
        {/* Summary Cards */}
        <div className="row mb-4">
          <div className="col-md-3 mb-3">
            <div className="card border-primary">
              <div className="card-body text-center">
                <div className="display-6 text-primary">{stats.users}</div>
                <div className="card-title">Total Users</div>
                <div className="small text-muted">
                  Students: {userDistribution.students || 0} | 
                  Instructors: {userDistribution.instructors || 0} | 
                  Admins: {userDistribution.admins || 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card border-success">
              <div className="card-body text-center">
                <div className="display-6 text-success">{stats.courses}</div>
                <div className="card-title">Courses</div>
                <div className="small text-muted">
                  {categories.length} categories | {metrics.averageEnrollments || 0} avg enrollment
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card border-warning">
              <div className="card-body text-center">
                <div className="display-6 text-warning">{stats.enrollments}</div>
                <div className="card-title">Enrollments</div>
                <div className="small text-muted">
                  Active: {enrollmentStatus.find(e => e._id === 'active')?.count || 0} | 
                  Completed: {enrollmentStatus.find(e => e._id === 'completed')?.count || 0}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-3 mb-3">
            <div className="card border-info">
              <div className="card-body text-center">
                <div className="display-6 text-info">{metrics.completionRate || 0}%</div>
                <div className="card-title">Completion Rate</div>
                <div className="small text-muted">
                  {topStudents.filter(s => s.completedCourses > 0).length} students completed courses
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* User Distribution & Enrollment Status */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">👥 User Distribution</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  <div className="col-4">
                    <div className="p-3">
                      <div className="text-primary fs-3">{userDistribution.students || 0}</div>
                      <small className="text-muted">Students</small>
                      <div className="small">{Math.round(userDistribution.students / stats.users * 100)}%</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3">
                      <div className="text-warning fs-3">{userDistribution.instructors || 0}</div>
                      <small className="text-muted">Instructors</small>
                      <div className="small">{Math.round(userDistribution.instructors / stats.users * 100)}%</div>
                    </div>
                  </div>
                  <div className="col-4">
                    <div className="p-3">
                      <div className="text-danger fs-3">{userDistribution.admins || 0}</div>
                      <small className="text-muted">Admins</small>
                      <div className="small">{Math.round(userDistribution.admins / stats.users * 100)}%</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card">
              <div className="card-header">
                <h6 className="mb-0">🎯 Enrollment Status</h6>
              </div>
              <div className="card-body">
                <div className="row text-center">
                  {enrollmentStatus.map((item, index) => (
                    <div className="col-4" key={index}>
                      <div className="p-3">
                        <div className={`fs-3 text-${getEnrollmentStatusColor(item._id)}`}>
                          {item.count}
                        </div>
                        <small className="text-muted">{item._id}</small>
                        <div className="small">{Math.round(item.count / stats.enrollments * 100)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Courses & Top Students */}
        <div className="row mb-4">
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">🏆 Top Courses</h6>
              </div>
              <div className="card-body">
                <div className="list-group">
                  {topCourses.slice(0, 5).map((course, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{course.title}</strong>
                          <div className="small text-muted">
                            {course.category} • {course.duration} • ⭐ {course.rating}
                          </div>
                        </div>
                        <span className="badge bg-primary">
                          {course.enrolledStudents} students
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="col-md-6">
            <div className="card h-100">
              <div className="card-header">
                <h6 className="mb-0">🌟 Top Students</h6>
              </div>
              <div className="card-body">
                <div className="list-group">
                  {topStudents.slice(0, 5).map((student, index) => (
                    <div key={index} className="list-group-item">
                      <div className="d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{student.name}</strong>
                          <div className="small text-muted">{student.email}</div>
                        </div>
                        <div className="text-end">
                          <div className="badge bg-info me-2">
                            {student.enrolledCourses} enrolled
                          </div>
                          <div className="badge bg-success">
                            {student.completedCourses} completed
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="card mb-4">
          <div className="card-header">
            <h6 className="mb-0">📝 Recent Enrollments</h6>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-sm table-hover">
                <thead>
                  <tr>
                    <th>Student</th>
                    <th>Course</th>
                    <th>Status</th>
                    <th>Progress</th>
                    <th>Enrolled At</th>
                  </tr>
                </thead>
                <tbody>
                  {recentEnrollments.map((enrollment, index) => (
                    <tr key={index}>
                      <td>{enrollment.userName}</td>
                      <td>{enrollment.courseTitle}</td>
                      <td>
                        <span className={`badge bg-${getEnrollmentStatusColor(enrollment.status)}`}>
                          {enrollment.status}
                        </span>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="progress flex-grow-1 me-2" style={{ height: '6px' }}>
                            <div 
                              className="progress-bar" 
                              style={{ width: `${enrollment.progress}%` }}
                            ></div>
                          </div>
                          <small>{enrollment.progress}%</small>
                        </div>
                      </td>
                      <td>
                        {new Date(enrollment.enrolledAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Course Categories */}
        <div className="card">
          <div className="card-header">
            <h6 className="mb-0">📚 Course Categories</h6>
          </div>
          <div className="card-body">
            <div className="row">
              {categories.map((category, index) => (
                <div className="col-md-4 mb-3" key={index}>
                  <div className="card border-secondary h-100">
                    <div className="card-body">
                      <h6 className="card-title">{category._id}</h6>
                      <div className="d-flex justify-content-between">
                        <div>
                          <span className="badge bg-secondary">
                            {category.count} courses
                          </span>
                        </div>
                        <div>
                          <span className="badge bg-info">
                            {category.totalEnrolled} students
                          </span>
                        </div>
                      </div>
                      <div className="mt-2 small text-muted">
                        Avg: {Math.round(category.totalEnrolled / category.count)} students per course
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="mt-4 pt-3 border-top">
          <div className="d-flex flex-wrap gap-2">
            <a 
              href="http://localhost:5000/api/users" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-primary btn-sm"
            >
              👤 Users API
            </a>
            <a 
              href="http://localhost:5000/api/courses" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-success btn-sm"
            >
              📚 Courses API
            </a>
            <a 
              href="http://localhost:5000/api/enrollments" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-warning btn-sm"
            >
              🎯 Enrollments API
            </a>
            <a 
              href="http://localhost:5000/api/analytics/summary" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline-info btn-sm"
            >
              📊 Analytics API
            </a>
          </div>
        </div>
      </div>
      <div className="card-footer text-muted text-center">
        <small>Last updated: {new Date().toLocaleString()}</small>
      </div>
    </div>
  );
}

export default DatabaseStats;