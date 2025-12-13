import React, { useState } from 'react';

function PasswordStrength() {
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const checkStrength = () => {
    if (password.length < 6) {
      setMessage('Weak password');
    } else if (/\d/.test(password)) {
      setMessage('Strong password');
    } else {
      setMessage('Medium password');
    }
  };

  return (
    <div className="card">
      <div className="card-body">
        <h3>Password Strength Checker</h3>
        <input
          type="password"
          className="form-control mb-2"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn btn-primary mb-2" onClick={checkStrength}>
          Check Strength
        </button>
        {message && <div className="alert alert-info">{message}</div>}
      </div>
    </div>
  );
}
export default PasswordStrength;