// src/pages/ForgotPassword.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email input, 2: OTP verification, 3: Password reset
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [countdown, setCountdown] = useState(0);

  
  // Start countdown timer for OTP resend
  const startCountdown = () => {
    setCountdown(60);
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

const handleSendOtp = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  console.log('Step before sending OTP:', step);
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError('Please enter a valid email address');
    setIsLoading(false);
    return;
  }

  try {
    const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    const result = await response.json();
    console.log('Response received:', response.status, result);

    if (response.ok) {
      setSuccess('OTP sent to your email');
      // Use functional update to ensure we get the latest state
      setStep(prevStep => {
        console.log('Setting step from', prevStep, 'to 2');
        return 2;
      });
      startCountdown();
      
      // Log after state update (but remember state updates are async)
      setTimeout(() => {
        console.log('Step after setStep(2):', step); // This will still show old value due to closure
      }, 0);
    } else {
      setError(result.message || 'Failed to send OTP');
    }
  } catch (error) {
    setError('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setSuccess('OTP resent to your email');
        startCountdown();
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to resend OTP');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // const handleVerifyOtp = async (e) => {
  //   e.preventDefault();
  //   setIsLoading(true);
  //   setError('');
    
  //   if (otp.length !== 6) {
  //     setError('OTP must be 6 digits');
  //     setIsLoading(false);
  //     return;
  //   }
    
  //   try {
  //     const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ email, otp }),
  //     });

  //     if (response.ok) {
  //       setSuccess('OTP verified successfully');
  //       setStep(3);
  //     } else {
  //       const errorText = await response.text();
  //       setError(errorText || 'Invalid OTP');
  //     }
  //   } catch (error) {
  //     setError('Network error. Please try again.');
  //   } finally {
  //     setIsLoading(false);
  //   }
  // };

  const handleVerifyOtp = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  setError('');
  
  if (otp.length !== 6) {
    setError('OTP must be 6 digits');
    setIsLoading(false);
    return;
  }
  
  try {
    const response = await fetch('http://localhost:8080/api/auth/verify-otp', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, otp }),
    });

    const result = await response.json();

    if (response.ok) {
      setSuccess('OTP verified successfully');
      // Use functional update to ensure correct state
      setStep(prevStep => {
        console.log('Moving from step', prevStep, 'to step 3');
        return 3;
      });
    } else {
      setError(result.message || 'Invalid OTP');
    }
  } catch (error) {
    setError('Network error. Please try again.');
  } finally {
    setIsLoading(false);
  }
};

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('http://localhost:8080/api/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, newPassword }),
      });

      if (response.ok) {
        setSuccess('Password reset successfully');
        setTimeout(() => {
          window.location.href = '/signin';
        }, 2000);
      } else {
        const errorText = await response.text();
        setError(errorText || 'Failed to reset password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-card">
        <div className="forgot-password-header">
          <h1>Reset Password</h1>
          <div className="progress-indicator">
            <div className={`progress-step ${step >= 1 ? 'active' : ''}`}>
              <span>1</span>
              <p>Enter Email</p>
            </div>
            <div className={`progress-step ${step >= 2 ? 'active' : ''}`}>
              <span>2</span>
              <p>Verify OTP</p>
            </div>
            <div className={`progress-step ${step >= 3 ? 'active' : ''}`}>
              <span>3</span>
              <p>New Password</p>
            </div>
          </div>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}
        
        {step === 1 && (
          <form onSubmit={handleSendOtp} className="forgot-password-form">
            <div className="input-group">
              <label htmlFor="email">Email Address</label>
              <div className="input-with-icon">
                <i className="fas fa-envelope"></i>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Sending OTP...
                </>
              ) : (
                'Send OTP'
              )}
            </button>
          </form>
        )}
        
        {step === 2 && (
          <form onSubmit={handleVerifyOtp} className="forgot-password-form">
            <div className="input-group">
              <label htmlFor="otp">Verification Code</label>
              <p className="otp-instructions">Enter the 6-digit code sent to {email}</p>
              <div className="otp-input-container">
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => {
                    // Allow only numbers and limit to 6 digits
                    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setOtp(value);
                  }}
                  placeholder="000000"
                  maxLength="6"
                  required
                  className="otp-input"
                />
              </div>
              <div className="resend-otp">
                <p>Didn't receive the code?</p>
                <button 
                  type="button" 
                  onClick={handleResendOtp}
                  disabled={countdown > 0}
                  className="resend-button"
                >
                  {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                </button>
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading || otp.length !== 6}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Verifying...
                </>
              ) : (
                'Verify OTP'
              )}
            </button>
          </form>
        )}
        
        {step === 3 && (
          <form onSubmit={handleResetPassword} className="forgot-password-form">
            <div className="input-group">
              <label htmlFor="newPassword">New Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password"
                  required
                />
              </div>
            </div>
            
            <div className="input-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="input-with-icon">
                <i className="fas fa-lock"></i>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
            </div>
            
            <button 
              type="submit" 
              className={`submit-button ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <div className="spinner"></div>
                  Resetting...
                </>
              ) : (
                'Reset Password'
              )}
            </button>
          </form>
        )}
        
        <div className="forgot-password-footer">
          <p>Remember your password? <Link to="/signin" className="back-to-login">Back to Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;