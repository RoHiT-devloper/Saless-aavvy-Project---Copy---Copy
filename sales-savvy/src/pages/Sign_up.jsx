import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sign_up.css';

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    gender: "",
    dob: "",
    role: "customer" // Set default role
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validatePassword = (password) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!password.match(/[A-Z]/)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!password.match(/[a-z]/)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!password.match(/\d/)) {
      return "Password must contain at least one digit";
    }
    if (!password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/)) {
      return "Password must contain at least one special character";
    }
    return null;
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");

    // Validation
    if (!formData.username || !formData.email || !formData.password || 
        !formData.gender || !formData.dob) {
      setError("Please fill in all fields");
      setIsLoading(false);
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      setIsLoading(false);
      return;
    }

    // Password validation
    const passwordError = validatePassword(formData.password);
    if (passwordError) {
      setError(passwordError);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:8080/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      // Handle different response types
      const contentType = response.headers.get("content-type");
      let result;
      
      if (contentType && contentType.includes("application/json")) {
        result = await response.json();
      } else {
        const text = await response.text();
        throw new Error(text || `Server returned ${response.status}`);
      }

      if (response.ok) {
        if (result.success) {
          setSuccess(result.message || "User registered successfully!");

          // Reset form
          setFormData({
            username: "",
            email: "",
            password: "",
            gender: "",
            dob: "",
            role: "customer"
          });

          // Redirect to SignIn after 2 seconds
          setTimeout(() => {
            navigate("/signin");
          }, 2000);
        } else {
          setError(result.message || "Registration failed");
        }
      } else {
        setError(result.message || `Registration failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Error during sign up:", error);
      setError(error.message || "Failed to sign up. Please check your connection and try again.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Create Account</h1>
          <p>Sign up for Sales Savvy</p>
        </div>
        
        {error && (
          <div className="error-message">
            <strong>Error:</strong> {error}
          </div>
        )}
        {success && (
          <div className="success-message">
            <strong>Success:</strong> {success}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="auth-form">
          {/* Username */}
          <div className="input-group">
            <label htmlFor="username">Username *</label>
            <div className="input-with-icon">
              <i className="fas fa-user"></i>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Choose a username"
                required
                minLength="3"
              />
            </div>
          </div>

          {/* Email */}
          <div className="input-group">
            <label htmlFor="email">Email *</label>
            <div className="input-with-icon">
              <i className="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="input-group">
            <label htmlFor="password">Password *</label>
            <div className="input-with-icon">
              <i className="fas fa-lock"></i>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
                minLength="8"
              />
            </div>
            <div className="password-requirements">
              <small>Password must contain:</small>
              <ul>
                <li className={formData.password.length >= 8 ? 'valid' : ''}>At least 8 characters</li>
                <li className={formData.password.match(/[A-Z]/) ? 'valid' : ''}>One uppercase letter</li>
                <li className={formData.password.match(/[a-z]/) ? 'valid' : ''}>One lowercase letter</li>
                <li className={formData.password.match(/\d/) ? 'valid' : ''}>One number</li>
                <li className={formData.password.match(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/) ? 'valid' : ''}>One special character</li>
              </ul>
            </div>
          </div>

          {/* Gender */}
          <div className="input-group">
            <label>Gender *</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === 'male'}
                  onChange={handleChange}
                  required
                />
                <span>Male</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === 'female'}
                  onChange={handleChange}
                />
                <span>Female</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="gender"
                  value="other"
                  checked={formData.gender === 'other'}
                  onChange={handleChange}
                />
                <span>Other</span>
              </label>
            </div>
          </div>

          {/* DOB */}
          <div className="input-group">
            <label htmlFor="dob">Date of Birth *</label>
            <div className="input-with-icon">
              <i className="fas fa-calendar"></i>
              <input
                type="date"
                id="dob"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
              />
            </div>
          </div>

          {/* Role */}
          <div className="input-group">
            <label>Role</label>
            <div className="radio-group">
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleChange}
                />
                <span>Admin</span>
              </label>
              <label className="radio-option">
                <input
                  type="radio"
                  name="role"
                  value="customer"
                  checked={formData.role === 'customer'}
                  onChange={handleChange}
                />
                <span>Customer</span>
              </label>
            </div>
            <small>Note: Admin accounts require special permissions</small>
          </div>

          {/* Submit */}
          <button 
            type="submit" 
            className={`auth-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Creating account...
              </>
            ) : (
              'SIGN UP'
            )}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/signin" className="auth-link">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
};

export default SignUp;