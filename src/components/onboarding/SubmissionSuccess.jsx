import React, { useState } from 'react';
import './SubmissionSuccess.css';

const SubmissionSuccess = ({ creditAmount = 125000, formData = {} }) => {
  const [showUpsell, setShowUpsell] = useState(false);

  const handleDownload = () => {
    // Simulate download
    console.log('Downloading R&D tax credit package...');
    // Show upsell services after a brief delay
    setTimeout(() => {
      setShowUpsell(true);
    }, 1000);
  };

  return (
    <div className="submission-success-container">
      <div className="success-content">
        <div className="success-icon">🎉</div>
        
        <h1 className="success-title">Congratulations!</h1>
        <p className="success-subtitle">Your R&D credit is ready for download</p>

        {/* Tax Credit Preview */}
        <div className="credit-preview">
          <div className="preview-header">
            <h3>R&D Tax Credit Summary</h3>
            <span className="preview-badge">READY ✓</span>
          </div>
          
          <div className="preview-content">
            <div className="credit-amount">
              <span className="amount-label">ESTIMATED CREDIT AMOUNT</span>
              <span className="amount-value">${creditAmount.toLocaleString()}</span>
            </div>
            
            <div className="preview-details">
              <div className="detail-row">
                <span className="detail-label">Tax Year</span>
                <span className="detail-value">2020</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Credit Type</span>
                <span className="detail-value">Federal R&D Tax Credit</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Form</span>
                <span className="detail-value">IRS Form 6765</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Status</span>
                <span className="detail-value status-ready">✓ Ready to File</span>
              </div>
            </div>

            <div className="preview-footer">
              <p className="preview-note">
                📎 Includes all supporting documentation and calculations
              </p>
            </div>
          </div>
        </div>

        {/* Download CTA */}
        <button className="download-cta" onClick={handleDownload}>
          <span className="cta-icon">💰</span>
          <span className="cta-text">Give me my money</span>
          <span className="cta-arrow">→</span>
        </button>

        <p className="additional-info">
          Your complete R&D tax credit package includes Form 6765, supporting documentation, 
          and detailed calculations. Our team will contact you within 24 hours to guide you 
          through the filing process.
        </p>

        {/* Upsell Section */}
        {showUpsell && (
          <div className="upsell-section">
            <div className="upsell-divider"></div>
            <h3 className="upsell-title">Based on your data, we've identified additional opportunities:</h3>
            
            <div className="upsell-cards">
              <div className="upsell-card">
                <div className="upsell-icon">🏢</div>
                <div className="upsell-content">
                  <h4>Entity Structure Optimization</h4>
                  <p>We see you're an LLC. You may benefit from converting to a C-Corp for additional tax advantages and R&D credit optimization.</p>
                  <button className="upsell-btn">Learn More →</button>
                </div>
              </div>
              
              <div className="upsell-card">
                <div className="upsell-icon">📊</div>
                <div className="upsell-content">
                  <h4>Bookkeeping Compliance</h4>
                  <p>Your QuickBooks categories are not standard for your industry. We can refer an accounting/bookkeeping agency for better compliance.</p>
                  <button className="upsell-btn">Get Connected →</button>
                </div>
              </div>
              
              <div className="upsell-card">
                <div className="upsell-icon">💰</div>
                <div className="upsell-content">
                  <h4>Additional Tax Credits</h4>
                  <p>Based on your profile, you may qualify for Work Opportunity Tax Credits (WOTC) and other incentives.</p>
                  <button className="upsell-btn">Explore Credits →</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SubmissionSuccess;