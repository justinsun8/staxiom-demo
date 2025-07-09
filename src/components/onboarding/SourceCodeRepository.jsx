import React, { useState, useEffect } from 'react';
import './SourceCodeRepository.css';
import repositoryService from '../../services/repositoryService';
import { repositoryProviders } from '../../config/repositoryProviders';

const SourceCodeRepository = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedProvider, setSelectedProvider] = useState(data.provider || '');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // Convert providers config to array for display
  const providers = Object.values(repositoryProviders);

  // Check connection status on mount
  useEffect(() => {
    const checkConnections = {};
    providers.forEach(provider => {
      checkConnections[provider.id] = repositoryService.isProviderConnected(provider.id);
    });
    setConnectionStatus(checkConnections);
  }, []);

  const handleProviderClick = async (providerId) => {
    setSelectedProvider(providerId);
    
    // For demo, only show popup for GitHub
    if (providerId === 'github') {
      setShowLoginPopup(true);
    } else {
      // For other providers, simulate connection
      try {
        setIsConnecting(true);
        const result = await repositoryService.mockOAuthFlow(providerId);
        if (result.success) {
          setConnectionStatus(prev => ({ ...prev, [providerId]: true }));
          onUpdate({ 
            provider: providerId, 
            connected: true,
            connectionData: result 
          });
        }
      } catch (error) {
        console.error('Connection failed:', error);
      } finally {
        setIsConnecting(false);
      }
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      setIsConnecting(true);
      
      // Use the repository service for authentication
      const result = await repositoryService.initiateOAuth('github');
      
      if (result.success) {
        // Get user info and repositories after successful connection
        const userInfo = await repositoryService.getUserInfo('github', result.mockToken);
        const repositories = await repositoryService.getRepositories('github', result.mockToken);
        
        setConnectionStatus(prev => ({ ...prev, github: true }));
        onUpdate({ 
          provider: 'github', 
          connected: true,
          authData: result,
          userInfo: userInfo,
          repositories: repositories
        });
        
        setShowLoginPopup(false);
        
        // Auto-advance after successful connection
        setTimeout(() => onNext(), 500);
      }
    } catch (error) {
      console.error('Login failed:', error);
      alert('Connection failed. Please try again.');
    } finally {
      setIsConnecting(false);
    }
  };

  const handleSkip = () => {
    onUpdate({ provider: null, skipped: true });
    onNext();
  };

  const handleNext = () => {
    if (selectedProvider) {
      onNext();
    }
  };

  return (
    <div className="repository-provider-container">
      <h1 className="page-title">
        Connect your Source Code Repository
        <span className="info-icon" title="More information">ⓘ</span>
      </h1>
      <p className="page-subtitle">
        Connect to your source code repository to expedite the onboarding process.
      </p>

      <div className="providers-grid">
        {providers.map(provider => (
          <div
            key={provider.id}
            className={`provider-card ${selectedProvider === provider.id ? 'selected' : ''} ${connectionStatus[provider.id] ? 'connected' : ''}`}
            onClick={() => handleProviderClick(provider.id)}
          >
            {connectionStatus[provider.id] && (
              <div className="connection-badge">✓ Connected</div>
            )}
            <div className="provider-logo">
              <img 
                src={provider.logo} 
                alt={provider.name}
                style={{ maxHeight: '40px', maxWidth: '120px', objectFit: 'contain' }}
                onError={(e) => {
                  console.error(`Failed to load logo for ${provider.name}:`, provider.logo);
                  e.target.style.display = 'none';
                  const textFallback = document.createElement('div');
                  textFallback.textContent = provider.name;
                  textFallback.style.fontSize = '16px';
                  textFallback.style.fontWeight = '600';
                  textFallback.style.color = provider.color || '#333';
                  e.target.parentNode.appendChild(textFallback);
                }}
              />
            </div>
            <div className="provider-name">{provider.name}</div>
          </div>
        ))}
      </div>

      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button onClick={handleSkip} className="skip-btn">
          Skip
        </button>
        <button 
          onClick={handleNext} 
          className="next-btn"
          disabled={!selectedProvider}
        >
          Next
        </button>
      </div>

      {/* GitHub Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Sign in to GitHub</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowLoginPopup(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="github-logo">
                <img src="/images/logo_github.png" alt="GitHub" style={{ width: '48px' }} />
              </div>
              
              <div className="form-group">
                <label htmlFor="username">Username or email address</label>
                <input
                  type="text"
                  id="username"
                  value={loginData.username}
                  onChange={(e) => setLoginData({...loginData, username: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  Password
                  <a href="#" className="forgot-password">Forgot password?</a>
                </label>
                <input
                  type="password"
                  id="password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <button type="submit" className="login-btn" disabled={isConnecting}>
                {isConnecting ? 'Signing in...' : 'Sign in'}
              </button>
              
              <div className="login-footer">
                <p>New to GitHub? <a href="#">Create an account</a></p>
              </div>
              
              <div className="login-terms">
                <p>
                  By clicking "Sign in", you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Statement</a>.
                </p>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SourceCodeRepository;