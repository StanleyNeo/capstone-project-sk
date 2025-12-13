import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    users: 0,
    courses: 0,
    enrollments: 0,
    activeEnrollments: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      // Load dashboard stats
      const dashboardRes = await fetch('http://localhost:5000/api/analytics/dashboard');
      const dashboardData = await dashboardRes.json();
      
      if (dashboardData.success) {
        setStats({
          users: dashboardData.data.totals.users,
          courses: dashboardData.data.totals.courses,
          enrollments: dashboardData.data.totals.enrollments,
          activeEnrollments: dashboardData.data.totals.activeEnrollments,
          completionRate: dashboardData.data.metrics.completionRate
        });
      }

      // Load users
      const usersRes = await fetch('http://localhost:5000/api/users');
      const usersData = await usersRes.json();
      if (usersData.success) setUsers(usersData.data);

      // Load courses
      const coursesRes = await fetch('http://localhost:5000/api/courses');
      const coursesData = await coursesRes.json();
      if (coursesData.success) setCourses(coursesData.data);

      // Load enrollments
      const enrollmentsRes = await fetch('http://localhost:5000/api/enrollments');
      const enrollmentsData = await enrollmentsRes.json();
      if (enrollmentsData.success) setEnrollments(enrollmentsData.data);

    } catch (error) {
      console.error('Admin data load error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    navigate('/');
  };

  if (loading) {
    return (
      <div className="container mt-4 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading admin dashboard...</span>
        </div>
        <p className="mt-2">Loading admin dashboard...</p>
      </div>
    );
  }

  return (
    <div className="container-fluid mt-3">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1>🔐 LMS Admin Dashboard</h1>
        <div>
          <button className="btn btn-outline-primary me-2" onClick={loadAdminData}>
            🔄 Refresh
          </button>
          <button className="btn btn-outline-danger" onClick={handleLogout}>
            ← Back to Home
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="row mb-4">
        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-primary shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                    Total Users
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.users}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-users fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-success shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                    Total Courses
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.courses}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-book fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-warning shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                    Total Enrollments
                  </div>
                  <div className="h5 mb-0 font-weight-bold text-gray-800">{stats.enrollments}</div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-graduation-cap fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-xl-3 col-md-6 mb-4">
          <div className="card border-left-info shadow h-100 py-2">
            <div className="card-body">
              <div className="row no-gutters align-items-center">
                <div className="col mr-2">
                  <div className="text-xs font-weight-bold text-info text-uppercase mb-1">
                    Completion Rate
                  </div>
                  <div className="row no-gutters align-items-center">
                    <div className="col-auto">
                      <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                        {stats.completionRate}%
                      </div>
                    </div>
                    <div className="col">
                      <div className="progress progress-sm mr-2">
                        <div 
                          className="progress-bar bg-info" 
                          style={{ width: `${stats.completionRate}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-auto">
                  <i className="fas fa-chart-line fa-2x text-gray-300"></i>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="row mb-4">
        <div className="col-xl-6">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-primary">👥 User Management</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Join Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(user => (
                      <tr key={user._id}>
                        <td>{user.name}</td>
                        <td>{user.email}</td>
                        <td>
                          <span className={`badge bg-${user.role === 'admin' ? 'danger' : user.role === 'instructor' ? 'warning' : 'primary'}`}>
                            {user.role}
                          </span>
                        </td>
                        <td>{new Date(user.joinDate).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted">Showing {users.length} users</small>
              </div>
            </div>
          </div>
        </div>

        {/* Course Management */}
        <div className="col-xl-6">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-success">📚 Course Management</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>Course</th>
                      <th>Category</th>
                      <th>Instructor</th>
                      <th>Enrolled</th>
                      <th>Rating</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map(course => (
                      <tr key={course._id}>
                        <td>{course.title}</td>
                        <td>
                          <span className="badge bg-secondary">{course.category}</span>
                        </td>
                        <td>{course.instructor}</td>
                        <td>
                          <div className="progress" style={{ height: '10px' }}>
                            <div 
                              className="progress-bar bg-warning" 
                              style={{ width: `${(course.enrolledStudents / course.maxStudents) * 100}%` }}
                            ></div>
                          </div>
                          <small>{course.enrolledStudents}/{course.maxStudents}</small>
                        </td>
                        <td>
                          <span className="badge bg-success">
                            {course.rating} ★
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted">Showing {courses.length} courses</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Management */}
      <div className="row">
        <div className="col-xl-12">
          <div className="card shadow">
            <div className="card-header py-3">
              <h6 className="m-0 font-weight-bold text-warning">📝 Enrollment Management</h6>
            </div>
            <div className="card-body">
              <div className="table-responsive">
                <table className="table table-bordered" width="100%" cellSpacing="0">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Course</th>
                      <th>Enrolled Date</th>
                      <th>Status</th>
                      <th>Progress</th>
                    </tr>
                  </thead>
                  <tbody>
                    {enrollments.map(enrollment => (
                      <tr key={enrollment._id}>
                        <td>{enrollment.userName}</td>
                        <td>{enrollment.courseTitle}</td>
                        <td>{new Date(enrollment.enrolledAt).toLocaleDateString()}</td>
                        <td>
                          <span className={`badge bg-${enrollment.status === 'active' ? 'primary' : enrollment.status === 'completed' ? 'success' : 'danger'}`}>
                            {enrollment.status}
                          </span>
                        </td>
                        <td>
                          <div className="progress">
                            <div 
                              className={`progress-bar ${enrollment.progress === 100 ? 'bg-success' : 'bg-warning'}`}
                              style={{ width: `${enrollment.progress}%` }}
                            >
                              {enrollment.progress}%
                            </div>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="text-center mt-2">
                <small className="text-muted">Showing {enrollments.length} enrollments</small>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Actions */}
      <div className="row mt-4">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-body">
              <h5 className="card-title">⚡ Admin Actions</h5>
              <div className="d-flex flex-wrap gap-3">
                <button className="btn btn-primary">
                  <i className="fas fa-user-plus me-2"></i>
                  Add New User
                </button>
                <button className="btn btn-success">
                  <i className="fas fa-book-medical me-2"></i>
                  Add New Course
                </button>
                <button className="btn btn-warning">
                  <i className="fas fa-file-export me-2"></i>
                  Export Data
                </button>
                <button className="btn btn-info">
                  <i className="fas fa-chart-bar me-2"></i>
                  View Reports
                </button>
                <button className="btn btn-danger">
                  <i className="fas fa-cog me-2"></i>
                  System Settings
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;