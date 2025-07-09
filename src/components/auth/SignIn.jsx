import React, { useState } from 'react';
import './SignIn.css';

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log('Sign in with:', { email, password });
    onSignIn();
  };

  const handleGoogleSignIn = () => {
    // Handle Google sign in logic here
    console.log('Sign in with Google');
    onSignIn();
  };

  return (
    <div className="signin-container">
      <div className="signin-left">
        <div className="logo-section">
          <div className="logo">
            <img src="https://cdn.prod.website-files.com/679ef02de8b79a9716efc818/679f281372adefd0878d72fe_staxiom-logo.svg" alt="Staxiom" />
          </div>
        </div>
        
        <div className="facts-section">
          <h1 className="facts-title">R&D Facts</h1>
          <p className="facts-text">
            Every penny counts. It's time to capture your share of
            the $50 Billion Federal R&D tax credits. Rest assured
            with our risk-free pricing.
          </p>
        </div>
        
        <div className="dots-decoration">
          {[...Array(36)].map((_, i) => (
            <div key={i} className="dot"></div>
          ))}
        </div>
        
        <div className="corner-decoration"></div>
      </div>

      <div className="signin-right">
        <div className="signin-form-container">
          <h2 className="signin-title">Welcome back to Staxiom!</h2>
          
          <button onClick={handleGoogleSignIn} className="google-signin-btn">
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" className="google-icon" />
            Sign in with Google
          </button>
          
          <div className="divider">Or</div>
          
          <form onSubmit={handleSubmit} className="signin-form">
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="form-input"
            />
            
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="form-input"
            />
            
            <button type="submit" className="signin-btn">
              Sign In
            </button>
          </form>
          
          <p className="register-text">
            Not a member? <a href="/register" className="register-link">Register here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignIn;