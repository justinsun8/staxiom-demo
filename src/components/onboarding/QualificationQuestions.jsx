import React, { useState } from 'react';
import './QualificationQuestions.css';

const QualificationQuestions = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    hasGeneratedProfit: data.hasGeneratedProfit || ''
  });

  const handleChange = (value) => {
    setFormData({ hasGeneratedProfit: value });
    onUpdate({ hasGeneratedProfit: value });
  };

  const handleNext = () => {
    if (formData.hasGeneratedProfit) {
      onNext();
    }
  };

  return (
    <div className="qualification-container">
      <h1 className="page-title">R&D Qualification Questions</h1>
      <p className="page-subtitle">
        Accurate answers to this question help us determine if you are qualified for Federal and 
        State R&D Credits.
      </p>

      <div className="question-card">
        <div className="question-content">
          <h3 className="question-title">
            Has your company generated any profit yet?
            <span className="info-icon" title="More information">ⓘ</span>
          </h3>

          <div className="radio-options">
            <label className="radio-option">
              <input
                type="radio"
                name="profit"
                value="yes"
                checked={formData.hasGeneratedProfit === 'yes'}
                onChange={() => handleChange('yes')}
              />
              <span className="radio-label">Yes</span>
            </label>

            <label className="radio-option">
              <input
                type="radio"
                name="profit"
                value="no"
                checked={formData.hasGeneratedProfit === 'no'}
                onChange={() => handleChange('no')}
              />
              <span className="radio-label">No</span>
            </label>
          </div>
        </div>
      </div>

      <div className="action-buttons">
        {onBack && (
          <button onClick={onBack} className="back-btn">
            Back to Pricing
          </button>
        )}
        <button 
          onClick={handleNext} 
          className="next-btn"
          disabled={!formData.hasGeneratedProfit}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default QualificationQuestions;