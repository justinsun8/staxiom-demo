import React, { useState, useEffect } from 'react';
import './EstimationResults.css';

const EstimationResults = ({ formData, onAssignToAccount, onNext, onBack, onLogoClick }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);
  // Calculate estimated R&D tax credit based on form data
  const calculateTaxCredit = () => {
    const { numberOfEmployees, avgSalary } = formData;
    const totalPayroll = parseInt(numberOfEmployees) * parseInt(avgSalary);
    
    // Simplified calculation: ~8-10% of technical staff payroll
    // This is a rough estimate for demo purposes
    const technicalStaffPercentage = 0.3; // Assume 30% are technical staff
    const rdCreditRate = 0.065; // 6.5% credit rate
    
    const estimatedCredit = totalPayroll * technicalStaffPercentage * rdCreditRate;
    
    // Round to nearest thousand
    return Math.round(estimatedCredit / 1000) * 1000;
  };

  const estimatedAmount = calculateTaxCredit();
  const formattedAmount = estimatedAmount.toLocaleString();

  useEffect(() => {
    // Simulate loading progress
    const progressInterval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => {
            setIsLoading(false);
          }, 500);
          return 100;
        }
        return prev + 5; // Faster progress for estimate generation
      });
    }, 100);

    return () => {
      clearInterval(progressInterval);
    };
  }, []);

  return (
    <div className="estimation-container">
      <div className="estimation-sidebar">
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
          <div className="step active">
            <span className="step-icon">○</span>
            <span className="step-text">Get R&D Tax Credit Estimate</span>
          </div>
        </div>
      </div>

      <div className="estimation-content">
        {isLoading ? (
          <div className="results-container">
            <div className="loading-state">
              <div className="loading-icon">💰</div>
              <h2 className="loading-title">Calculating Your R&D Tax Credit...</h2>
              <p className="loading-subtitle">
                Analyzing your company data to maximize your credit
              </p>
              <div className="progress-container">
                <div className="progress-bar">
                  <div 
                    className="progress-fill" 
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <span className="progress-text">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        ) : (
          <>
            <div className="results-container">
              <h1 className="results-title">Congratulations!</h1>
              
              <div className="credit-amount">
                You can claim up to <span className="amount">${formattedAmount}</span> in Federal R&D Credits
              </div>

          <div className="next-steps">
            <h2 className="steps-title">Next Steps</h2>
            
            <div className="step-item">
              <div className="step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 8V16C21 18.76 18.76 21 16 21H8C5.24 21 3 18.76 3 16V8C3 5.24 5.24 3 8 3H16C18.76 3 21 5.24 21 8Z" stroke="#4db8a8" strokeWidth="2"/>
                  <path d="M12 8V16M8 12H16" stroke="#4db8a8" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Connect</h3>
                <p>Connect current and prior year's payroll provider to expediate the onboarding process.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M9 22H15C20 22 22 20 22 15V9C22 4 20 2 15 2H9C4 2 2 4 2 9V15C2 20 4 22 9 22Z" stroke="#4db8a8" strokeWidth="2"/>
                  <path d="M7 2V22M17 2V22M2 12H7M17 12H22" stroke="#4db8a8" strokeWidth="2"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Upload</h3>
                <p>Upload wages, tax returns, expenses, and research-related files to prove your R&D process.</p>
              </div>
            </div>

            <div className="step-item">
              <div className="step-icon-wrapper">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 12C22 17.52 17.52 22 12 22C6.48 22 2 17.52 2 12C2 6.48 6.48 2 12 2" stroke="#4db8a8" strokeWidth="2" strokeLinecap="round"/>
                  <path d="M19 3V7H15" stroke="#4db8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M22 2L19 7" stroke="#4db8a8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="step-content">
                <h3>Generate Report</h3>
                <p>Sit back and we will generate your R&D credit for you on the spot for your download.</p>
              </div>
            </div>
          </div>

          <div className="action-buttons">
            <button onClick={onBack} className="back-btn">
              Back
            </button>
            <div className="right-actions">
              <button onClick={onAssignToAccount} className="assign-btn">
                Assign to your Accountant
              </button>
              <span className="or-text">or</span>
              <button onClick={onNext} className="next-btn">
                Next
              </button>
            </div>
          </div>
        </div>
          </>
        )}
      </div>
    </div>
  );
};

export default EstimationResults;