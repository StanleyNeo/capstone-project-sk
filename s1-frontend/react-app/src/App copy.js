import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Courses from './pages/Courses';
import Chatbot from './pages/Chatbot';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <Router>
      <div className="App">
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand" href="/">AI-LMS</a>
            <ul className="navbar-nav me-auto">
              <li className="nav-item"><a className="nav-link" href="/">Home</a></li>
              <li className="nav-item"><a className="nav-link" href="/courses">Courses</a></li>
              <li className="nav-item"><a className="nav-link" href="/login">Login</a></li>
            </ul>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/courses" element={<Courses />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;