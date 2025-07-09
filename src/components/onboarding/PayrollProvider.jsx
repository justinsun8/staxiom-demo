import React, { useState, useEffect } from 'react';
import './PayrollProvider.css';
import payrollService from '../../services/payrollService';
import { payrollProviders } from '../../config/payrollProviders';

const PayrollProvider = ({ data, onUpdate, onNext, onBack }) => {
  const [selectedProvider, setSelectedProvider] = useState(data.provider || '');
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [loginData, setLoginData] = useState({ email: '', password: '' });
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState({});
  const [connectedProviders, setConnectedProviders] = useState(data.connectedProviders || []);

  // Convert providers config to array for display
  const providers = Object.values(payrollProviders);

  // Check connection status on mount
  useEffect(() => {
    const checkConnections = {};
    providers.forEach(provider => {
      checkConnections[provider.id] = payrollService.isProviderConnected(provider.id);
    });
    setConnectionStatus(checkConnections);
  }, []);

  const handleProviderClick = async (providerId) => {
    setSelectedProvider(providerId);
    
    // For demo, only show popup for Gusto
    if (providerId === 'gusto') {
      setShowLoginPopup(true);
    } else {
      // For other providers, simulate connection
      try {
        setIsConnecting(true);
        const result = await payrollService.mockOAuthFlow(providerId);
        if (result.success) {
          setConnectionStatus(prev => ({ ...prev, [providerId]: true }));
          const updatedProviders = [...connectedProviders, providerId];
          setConnectedProviders(updatedProviders);
          onUpdate({ 
            provider: providerId, 
            connected: true,
            connectionData: result,
            connectedProviders: updatedProviders
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
      
      // Use the payroll service for authentication
      const result = await payrollService.initiateOAuth('gusto');
      
      if (result.success) {
        // Get company info after successful connection
        const companyInfo = await payrollService.getCompanyInfo('gusto', result.mockToken);
        
        setConnectionStatus(prev => ({ ...prev, gusto: true }));
        const updatedProviders = [...connectedProviders, 'gusto'];
        setConnectedProviders(updatedProviders);
        onUpdate({ 
          provider: 'gusto', 
          connected: true,
          authData: result,
          companyInfo: companyInfo,
          connectedProviders: updatedProviders
        });
        
        setShowLoginPopup(false);
        
        // Don't auto-advance - let user add more providers or click next
        // setTimeout(() => onNext(), 500);
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
    // Allow proceeding if at least one provider is connected or if skipping
    if (connectedProviders.length > 0 || data.skipped) {
      onNext();
    }
  };

  return (
    <div className="payroll-provider-container">
      <h1 className="page-title">
        Connect your Payroll Provider
        <span className="info-icon" title="More information">ⓘ</span>
      </h1>
      <p className="page-subtitle">
        Connect current and prior year's payroll provider to expedite the onboarding process.
        {connectedProviders.length > 0 && (
          <span className="connected-count"> ({connectedProviders.length} connected)</span>
        )}
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
                  // Hide the broken image and show text fallback
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
        <a href="#" className="more-link">More Payroll Providers</a>
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
          disabled={connectedProviders.length === 0 && !data.skipped}
        >
          Next {connectedProviders.length > 0 && `(${connectedProviders.length} connected)`}
        </button>
      </div>

      {/* Gusto Login Popup */}
      {showLoginPopup && (
        <div className="login-popup-overlay" onClick={() => setShowLoginPopup(false)}>
          <div className="login-popup" onClick={(e) => e.stopPropagation()}>
            <div className="popup-header">
              <h2>Connect to Gusto</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowLoginPopup(false)}
              >
                ×
              </button>
            </div>
            
            <form onSubmit={handleLogin} className="login-form">
              <div className="gusto-logo">
                <img src="/images/logo_gusto.png" alt="Gusto" style={{ width: '120px' }} />
              </div>
              
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Email"
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
              
              <button type="submit" className="login-btn" disabled={isConnecting}>
                {isConnecting ? 'Connecting...' : 'Log in to Gusto'}
              </button>
              
              <p className="login-footer">
                Don't have a Gusto account? <a href="#">Sign up</a>
              </p>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PayrollProvider;