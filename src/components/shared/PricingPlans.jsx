import React from 'react';
import './PricingPlans.css';

const PricingPlans = ({ onSelectPlan, onLogoClick }) => {
  const handleBasePlan = () => {
    onSelectPlan('base');
  };

  const handleProPlan = () => {
    onSelectPlan('pro');
  };

  return (
    <div className="pricing-container">
      <div className="pricing-sidebar">
        <div className="logo" onClick={onLogoClick} style={{cursor: 'pointer'}}>
          <img src="https://cdn.prod.website-files.com/679ef02de8b79a9716efc818/679f281372adefd0878d72fe_staxiom-logo.svg" alt="Staxiom" style={{height: '32px', width: 'auto'}} />
        </div>
        
        <div className="estimation-steps">
          <h2 className="sidebar-title">Estimation</h2>
          <div className="step completed">
            <span className="step-icon">✓</span>
            <span className="step-text">Sign-Up</span>
          </div>
          <div className="step completed">
            <span className="step-icon">✓</span>
            <span className="step-text">Company Information</span>
          </div>
          <div className="step completed">
            <span className="step-icon">✓</span>
            <span className="step-text">Get R&D Tax Credit Estimate</span>
          </div>
        </div>
      </div>

      <div className="pricing-content">
        <div className="pricing-header">
          <h1 className="pricing-title">Flexible Pricing Plan for Every Company</h1>
          <p className="pricing-subtitle">Customized plans made for your needs</p>
        </div>

        <div className="pricing-cards">
          <div className="pricing-card base-card">
            <h2 className="plan-name">Staxiom Base</h2>
            <div className="plan-price">
              <span className="price-amount">$500</span>
              <span className="price-period">per tax filing</span>
            </div>
            <p className="plan-description">
              For start-ups who has less than five employees and has profit yet.
            </p>
            <ul className="plan-features">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
            <button onClick={handleBasePlan} className="plan-button base-button">
              Choose Base Plan
            </button>
          </div>

          <div className="pricing-card pro-card">
            <h2 className="plan-name">Staxiom Pro</h2>
            <div className="plan-price">
              <span className="price-amount">20%</span>
              <span className="price-period">total credits used</span>
            </div>
            <p className="plan-description">
              For a business who has more than five employees and made profit.
            </p>
            <ul className="plan-features">
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
              <li>Lorem ipsum</li>
            </ul>
            <button onClick={handleProPlan} className="plan-button pro-button">
              Choose Staxiom Pro
            </button>
          </div>
        </div>

        <div className="partnership-link">
          Looking for partnership? <a href="#" className="link">Click Here</a>
        </div>
      </div>
    </div>
  );
};

export default PricingPlans;