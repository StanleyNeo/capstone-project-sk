import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Schools from './pages/Schools';
import Dashboard from './pages/Dashboard';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <div className="App">
            <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
              <div className="container">
                <a className="navbar-brand" href="/">
                  <i className="bi bi-robot me-2"></i>
                  AI-LMS
                </a>
                <div className="collapse navbar-collapse">
                  <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                      <a className="nav-link" href="/">Home</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/courses">Courses</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/schools">Schools</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/dashboard">Dashboard</a>
                    </li>
                  </ul>
                  <ul className="navbar-nav">
                    <li className="nav-item">
                      <a className="nav-link" href="/login">
                        <i className="bi bi-person-circle me-1"></i>
                        Login
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </nav>
            
            <div className="container mt-4">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/dashboard" element={<Dashboard />} />
              </Routes>
            </div>
            
            <footer className="bg-light mt-5 py-3 border-top">
              <div className="container text-center">
                <p className="mb-0 text-muted">
                  AI-Powered Learning Management System © 2024
                </p>
              </div>
            </footer>
          </div>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;