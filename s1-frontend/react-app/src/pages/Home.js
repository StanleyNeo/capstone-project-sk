import React from 'react';
import PasswordStrength from '../components/PasswordStrength';
import CourseToggle from '../components/CourseToggle';

function Home() {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">AI-Powered LMS</h1>
      <div className="row">
        <div className="col-md-6"><PasswordStrength /></div>
        <div className="col-md-6"><CourseToggle /></div>
      </div>
    </div>
  );
}
export default Home;