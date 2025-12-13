import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function Login() {
  const { login, register, checkPasswordStrength, validateEmail, error } = useAuth();
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [formError, setFormError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    // Validation
    if (!validateEmail(formData.email)) {
      setFormError('Please enter a valid email address');
      return;
    }

    if (isLogin) {
      const result = await login(formData.email, formData.password);
      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.error);
      }
    } else {
      if (formData.password !== formData.confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }

      if (passwordStrength.strength === 'Weak') {
        setFormError('Please choose a stronger password');
        return;
      }

      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      if (result.success) {
        navigate('/');
      } else {
        setFormError(result.error);
      }
    }
  };

  return (
    <div className="container mt-4">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">
                {isLogin ? 'Login to AI LMS' : 'Create Account'}
              </h2>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              {formError && (
                <div className="alert alert-danger">{formError}</div>
              )}

              <form onSubmit={handleSubmit}>
                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  
                  {passwordStrength && !isLogin && (
                    <div className="mt-2">
                      <div className="progress mb-2" style={{ height: '5px' }}>
                        <div 
                          className={`progress-bar bg-${passwordStrength.color}`}
                          style={{ width: `${(Object.values(passwordStrength.requirements).filter(Boolean).length / 5) * 100}%` }}
                        ></div>
                      </div>
                      <small className={`text-${passwordStrength.color}`}>
                        Password Strength: {passwordStrength.strength}
                      </small>
                      <div className="mt-1">
                        <small>
                          {!passwordStrength.requirements.length && '✓ '}
                          At least 8 characters<br />
                          {!passwordStrength.requirements.uppercase && '✓ '}
                          Uppercase letter<br />
                          {!passwordStrength.requirements.lowercase && '✓ '}
                          Lowercase letter<br />
                          {!passwordStrength.requirements.number && '✓ '}
                          Number<br />
                          {!passwordStrength.requirements.special && '✓ '}
                          Special character
                        </small>
                      </div>
                    </div>
                  )}
                </div>

                {!isLogin && (
                  <div className="mb-3">
                    <label className="form-label">Confirm Password</label>
                    <input
                      type="password"
                      className="form-control"
                      name="confirmPassword"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      required
                    />
                  </div>
                )}

                <button type="submit" className="btn btn-primary w-100 mb-3">
                  {isLogin ? 'Login' : 'Register'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    className="btn btn-link"
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin 
                      ? "Don't have an account? Register" 
                      : "Already have an account? Login"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;