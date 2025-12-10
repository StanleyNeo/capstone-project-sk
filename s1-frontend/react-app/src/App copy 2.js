import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DataProvider } from './contexts/DataContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Chatbot from './pages/Chatbot';
import Dashboard from './pages/Dashboard';
import Schools from './pages/Schools';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <DataProvider>
      <Router>
        <div className="App">
          <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
            <div className="container">
              <a className="navbar-brand" href="/">AI-LMS</a>
              <div className="collapse navbar-collapse">
                <ul className="navbar-nav me-auto">
                  <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
                  <li className="nav-item"><a className="nav-link" href="/dashboard">Dashboard</a></li>
                  <li className="nav-item"><a className="nav-link" href="/courses">Courses</a></li>
                  <li className="nav-item"><a className="nav-link" href="/schools">Schools</a></li>
                  <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
                </ul>
              </div>
            </div>
          </nav>
          
          <div className="container mt-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/courses" element={<Courses />} />
              <Route path="/schools" element={<Schools />} />
              <Route path="/login" element={<Login />} />
              <Route path="/chatbot" element={<Chatbot />} />
            </Routes>
          </div>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;