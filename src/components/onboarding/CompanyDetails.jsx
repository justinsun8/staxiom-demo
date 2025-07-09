import React, { useState } from 'react';
import './CompanyDetails.css';

const CompanyDetails = ({ data, onUpdate, onNext, onBack }) => {
  const [formData, setFormData] = useState({
    companyName: data.companyName || '',
    primaryState: data.primaryState || '',
    federalEIN: data.federalEIN || '',
    companyType: data.companyType || '',
    accountingBasis: data.accountingBasis || ''
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
    const updatedData = { ...formData, [name]: value };
    setFormData(updatedData);
    onUpdate(updatedData);
  };

  const handleNext = () => {
    console.log('Form data:', formData);
    console.log('Is form valid?', isFormValid());
    if (isFormValid()) {
      onNext();
    } else {
      // Show what's missing
      const missing = [];
      if (!formData.companyName) missing.push('Company Name');
      if (!formData.primaryState) missing.push('Primary State');
      if (!formData.federalEIN) missing.push('Federal EIN');
      if (!formData.companyType) missing.push('Company Type');
      if (!formData.accountingBasis) missing.push('Accounting Basis');
      alert('Please fill in all required fields. Missing: ' + missing.join(', '));
    }
  };

  const isFormValid = () => {
    return formData.companyName && 
           formData.primaryState && 
           formData.federalEIN && 
           formData.companyType && 
           formData.accountingBasis;
  };

  return (
    <div className="company-details-container">
      <h1 className="page-title">
        Information About Your Company?
        <span className="info-icon" title="More information">ⓘ</span>
      </h1>
      <p className="page-subtitle">
        Accurate answers to these questions help us expedite the onboarding process.
      </p>

      <div className="details-form">
        <div className="form-group">
          <label htmlFor="companyName">Company Name on Tax Return</label>
          <input
            type="text"
            id="companyName"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
            placeholder="Jamo Studio, LLC"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="primaryState">
            Primary Business State
            <span className="info-icon" title="More information">ⓘ</span>
          </label>
          <select
            id="primaryState"
            name="primaryState"
            value={formData.primaryState}
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

        <div className="form-group">
          <label htmlFor="federalEIN">
            Federal Employer Identification Number
            <span className="info-icon" title="More information">ⓘ</span>
          </label>
          <input
            type="text"
            id="federalEIN"
            name="federalEIN"
            value={formData.federalEIN}
            onChange={handleChange}
            placeholder="e.g. XX-XXXXXX"
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="companyType">
            Company Type
            <span className="info-icon" title="More information">ⓘ</span>
          </label>
          <select
            id="companyType"
            name="companyType"
            value={formData.companyType}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select entity type</option>
            <option value="S-Corp">S-Corp</option>
            <option value="LLC">LLC</option>
            <option value="C-Corp">C-Corp</option>
            <option value="Sole Proprietorship">Sole Proprietorship</option>
            <option value="Partnership">Partnership</option>
          </select>
        </div>

        <div className="form-group">
          <label>
            Accounting Basis
            <span className="info-icon" title="More information">ⓘ</span>
          </label>
          <div className="radio-options">
            <label className="radio-option">
              <input
                type="radio"
                name="accountingBasis"
                value="accrual"
                checked={formData.accountingBasis === 'accrual'}
                onChange={handleChange}
              />
              <span className="radio-label">Accrual</span>
            </label>
            <label className="radio-option">
              <input
                type="radio"
                name="accountingBasis"
                value="cash"
                checked={formData.accountingBasis === 'cash'}
                onChange={handleChange}
              />
              <span className="radio-label">Cash</span>
            </label>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={onBack} className="back-btn">
            Back
          </button>
          <button 
            onClick={handleNext} 
            className="next-btn"
            disabled={!isFormValid()}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyDetails;