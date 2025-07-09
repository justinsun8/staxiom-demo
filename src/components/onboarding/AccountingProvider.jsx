import React, { useState, useEffect } from 'react';
import './AccountingProvider.css';
import accountingService from '../../services/accountingService';
import { accountingProviders } from '../../config/accountingProviders';

const AccountingProvider = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedProvider, setSelectedProvider] = useState(data.provider || '');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});

  // Convert providers config to array for display
  const providers = Object.values(accountingProviders);

  // Check connection status on mount
  useEffect(() => {
    const checkConnections = {};
    providers.forEach(provider => {
      checkConnections[provider.id] = accountingService.isProviderConnected(provider.id);
    });
    setConnectionStatus(checkConnections);
  }, []);

  const handleProviderClick = async (providerId) => {
    setSelectedProvider(providerId);
    
    // For demo, only show popup for QuickBooks Online
    if (providerId === 'quickbooksOnline') {
      setShowLoginPopup(true);
    } else {
      // For other providers, simulate connection
      try {
        setIsConnecting(true);
        const result = await accountingService.mockOAuthFlow(providerId);
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
      
      // Use the accounting service for authentication
      const result = await accountingService.initiateOAuth('quickbooksOnline');
      
      if (result.success) {
        // Get organization info after successful connection
        const orgInfo = await accountingService.getOrganizationInfo('quickbooksOnline', result.mockToken);
        
        setConnectionStatus(prev => ({ ...prev, quickbooksOnline: true }));
        onUpdate({ 
          provider: 'quickbooksOnline', 
          connected: true,
          authData: result,
          organizationInfo: orgInfo
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
    <div className="accounting-provider-container">
      <h1 className="page-title">
        Connect your Accounting Provider
        <span className="info-icon" title="More information">ⓘ</span>
      </h1>
      <p className="page-subtitle">
        Connect current and prior year's accounting provider to expedite the onboarding process.
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

      <div className="more-providers">
        <a href="#" className="more-link">More Accounting Providers</a>
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

      {/* QuickBooks Online Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Connect to QuickBooks Online</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowLoginPopup(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="qb-logo">
                <img src="/images/logo_quickbooks.png" alt="QuickBooks" style={{ width: '150px' }} />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email or User ID"
                  value={loginData.email}
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="form-group">
                <input
                  type="password"
                  placeholder="Password"
                  value={loginData.password}
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="form-input"
                  required
                />
              </div>
              
              <div className="remember-me">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
              </div>
              
              <button type="submit" className="login-btn" disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Sign In'}
              </button>
              
              <p className="login-footer">
                <a href="#">I forgot my user ID or password</a>
              </p>
              
              <div className="login-divider">
                <span>New to QuickBooks?</span>
              </div>
              
              <button type="button" className="create-account-btn">
                Create an account
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountingProvider;