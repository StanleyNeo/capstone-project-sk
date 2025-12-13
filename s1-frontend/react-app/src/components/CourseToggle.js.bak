import React, { useState } from 'react';

function CourseToggle() {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <div className="card">
      <div className="card-body">
        <h3>React Fundamentals Course</h3>
        <button 
          className="btn btn-primary mb-3"
          onClick={() => setIsVisible(!isVisible)}
        >
          {isVisible ? 'Hide Description' : 'Show Description'}
        </button>
        {isVisible && (
          <div className="alert alert-info">
            This course covers React fundamentals including components, JSX, and props.
          </div>
        )}
      </div>
    </div>
  );
}
export default CourseToggle;