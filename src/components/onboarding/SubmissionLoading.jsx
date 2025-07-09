import React, { useState, useEffect } from 'react';
import './SubmissionLoading.css';

const SubmissionLoading = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  
  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          setTimeout(() => onComplete(), 500);
          return 100;
        }
        return prev + 2; // Increase by 2% every 160ms for ~8 seconds total
      });
    }, 160);

    return () => {
      clearInterval(progressInterval);
    };
  }, [onComplete]);

  return (
    <div className="submission-loading-container">
      <div className="ai-loading-animation">
        <div className="folder-animation">
          <div className="floating-items">
            <div className="floating-item money-bag">💰</div>
            <div className="floating-item megaphone">📢</div>
            <div className="floating-item cash">💵</div>
            <div className="floating-item cards">🎴</div>
          </div>
          <div className="folder-container">
            <div className="folder">
              <div className="folder-top"></div>
              <div className="folder-body">
                <div className="document receipt">📄</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="loading-text">
        <h2>Loading AI...</h2>
      </div>

      <div className="progress-container">
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ width: `${progress}%` }}
          />
        </div>
        <span className="progress-text">{progress}%</span>
      </div>
    </div>
  );
};

export default SubmissionLoading;