import React, { useState } from 'react';
import './CompanyInfo.css';

const CompanyInfo = ({ onNext, onUpdateData, onLogoClick }) => {
  const [formData, setFormData] = useState({
    companyName: '',
    yearOfIncorporation: '',
    numberOfEmployees: '',
    avgSalary: '',
    state: ''
  });

  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
    'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
    'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
    'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
    'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
    'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
    'Wisconsin', 'Wyoming'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdateData(formData);
    onNext();
  };

  const isFormValid = () => {
    return formData.companyName && 
           formData.yearOfIncorporation && 
           formData.numberOfEmployees && 
           formData.avgSalary && 
           formData.state;
  };

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
          <div className="step active">
            <span className="step-icon">○</span>
            <span className="step-text">Company Information</span>
          </div>
          <div className="step">
            <span className="step-icon">○</span>
            <span className="step-text">Get R&D Tax Credit Estimate</span>
          </div>
        </div>
      </div>

      <div className="estimation-content">
        <div className="form-container">
          <h1 className="form-title">Tell us about your company</h1>
          <p className="form-subtitle">
            Accurate answers to these questions help us expedite the estimation process.
          </p>

          <form onSubmit={handleSubmit} className="company-form">
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="yearOfIncorporation">Year of Incorporation</label>
              <input
                type="number"
                id="yearOfIncorporation"
                name="yearOfIncorporation"
                value={formData.yearOfIncorporation}
                onChange={handleChange}
                placeholder="YYYY"
                min="1800"
                max={new Date().getFullYear()}
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="numberOfEmployees">Number of U.S. Full-Time Employees</label>
              <input
                type="number"
                id="numberOfEmployees"
                name="numberOfEmployees"
                value={formData.numberOfEmployees}
                onChange={handleChange}
                min="1"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="avgSalary">Estimated Avg Salary for U.S. Full-time Employee</label>
              <div className="input-with-prefix">
                <span className="input-prefix">$</span>
                <input
                  type="number"
                  id="avgSalary"
                  name="avgSalary"
                  value={formData.avgSalary}
                  onChange={handleChange}
                  min="0"
                  className="form-input with-prefix"
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="state">In What State is the Company Doing Business?</label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="form-select"
                required
              >
                <option value="">Select a state</option>
                {states.map(state => (
                  <option key={state} value={state}>{state}</option>
                ))}
              </select>
            </div>

            <button 
              type="submit" 
              className="next-btn"
              disabled={!isFormValid()}
            >
              Next
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CompanyInfo;