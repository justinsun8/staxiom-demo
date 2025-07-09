import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import './ConfirmReview.css';

const ConfirmReview = ({ data, onBack, onSubmit }) => {
  const toast = useToast();
  const {
    companyDetails = {},
    payrollProvider = {},
    accountingPlatform = {},
    sourceCode = {},
    documents = {}
  } = data;

  const handleSubmit = () => {
    // Here you would normally send all the data to your backend
    console.log('Submitting application with data:', data);
    toast.success('Processing your R&D tax credit report...');
    // onSubmit would handle the actual submission
    if (onSubmit) {
      onSubmit(data);
    }
  };

  const getConnectedStatus = (provider) => {
    return provider.connected ? 'Connected' : 'Not Connected';
  };

  const getDocumentCount = () => {
    if (!documents.uploadedFiles) return 0;
    return Object.values(documents.uploadedFiles).reduce((count, files) => count + files.length, 0);
  };

  return (
    <div className="confirm-review-container">
      <h1 className="page-title">One Last Step Before Submission</h1>
      <p className="page-subtitle">
        Please look for any typos or fill in the missing information below to expedite the R&D credit process.
      </p>

      {/* Company Information */}
      <div className="review-section">
        <div className="section-header">
          <h2>Company Information</h2>
          <button className="edit-btn" onClick={() => onBack('company')}>Edit ✏️</button>
        </div>
        <div className="review-content">
          <div className="info-grid">
            <div className="info-item">
              <label>Name</label>
              <p>{companyDetails.companyName || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Company Type</label>
              <p>{companyDetails.companyType || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>FEIN</label>
              <p>{companyDetails.fein || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Year of Incorporation</label>
              <p>{companyDetails.yearOfIncorporation || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Accounting Basis</label>
              <p>{companyDetails.accountingBasis || 'Not provided'}</p>
            </div>
            <div className="info-item">
              <label>Primary Business State</label>
              <p>{companyDetails.primaryBusinessState || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Payroll Provider */}
      <div className="review-section">
        <div className="section-header">
          <h2>Payroll Provider</h2>
          <button className="edit-btn" onClick={() => onBack('payroll')}>Edit ✏️</button>
        </div>
        <div className="review-content">
          <div className="provider-box">
            {payrollProvider.provider ? (
              <>
                <img 
                  src={`/images/${payrollProvider.provider.toLowerCase()}.png`} 
                  alt={payrollProvider.provider}
                  className="provider-logo"
                  onError={(e) => {e.target.style.display = 'none'}}
                />
                <span className="provider-name">{payrollProvider.provider}</span>
                <span className={`status-badge ${payrollProvider.connected ? 'connected' : 'not-connected'}`}>
                  {getConnectedStatus(payrollProvider)}
                </span>
              </>
            ) : (
              <span className="not-provided">No payroll provider connected</span>
            )}
          </div>
        </div>
      </div>

      {/* Accounting Platform */}
      <div className="review-section">
        <div className="section-header">
          <h2>Accounting Platform</h2>
          <button className="edit-btn" onClick={() => onBack('accounting')}>Edit ✏️</button>
        </div>
        <div className="review-content">
          <div className="provider-box">
            {accountingPlatform.provider ? (
              <>
                <img 
                  src={`/images/${accountingPlatform.provider.toLowerCase().replace(/\s+/g, '')}.png`} 
                  alt={accountingPlatform.provider}
                  className="provider-logo"
                  onError={(e) => {e.target.style.display = 'none'}}
                />
                <span className="provider-name">{accountingPlatform.provider}</span>
                <span className={`status-badge ${accountingPlatform.connected ? 'connected' : 'not-connected'}`}>
                  {getConnectedStatus(accountingPlatform)}
                </span>
              </>
            ) : (
              <span className="not-provided">No accounting platform connected</span>
            )}
          </div>
        </div>
      </div>

      {/* Source Code Repository */}
      <div className="review-section">
        <div className="section-header">
          <h2>Source Code Repository</h2>
          <button className="edit-btn" onClick={() => onBack('source')}>Edit ✏️</button>
        </div>
        <div className="review-content">
          <div className="provider-box">
            {sourceCode.provider ? (
              <>
                <img 
                  src={`/images/${sourceCode.provider.toLowerCase()}.png`} 
                  alt={sourceCode.provider}
                  className="provider-logo"
                  onError={(e) => {e.target.style.display = 'none'}}
                />
                <span className="provider-name">{sourceCode.provider}</span>
                <span className={`status-badge ${sourceCode.connected ? 'connected' : 'not-connected'}`}>
                  {getConnectedStatus(sourceCode)}
                </span>
              </>
            ) : (
              <span className="not-provided">No repository connected</span>
            )}
          </div>
        </div>
      </div>

      {/* R&D Documents */}
      <div className="review-section">
        <div className="section-header">
          <h2>R&D Documents</h2>
          <button className="edit-btn" onClick={() => onBack('documents')}>Edit ✏️</button>
        </div>
        <div className="review-content">
          <div className="documents-summary">
            {documents.uploadedFiles && Object.keys(documents.uploadedFiles).length > 0 ? (
              Object.entries(documents.uploadedFiles).map(([docType, files]) => (
                <div key={docType} className="document-group">
                  {files.map((file, index) => (
                    <p key={index} className="document-name">{file.name}</p>
                  ))}
                </div>
              ))
            ) : (
              <p className="not-provided">No documents uploaded</p>
            )}
            {getDocumentCount() > 0 && (
              <p className="document-count">Total: {getDocumentCount()} documents</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="action-buttons">
        <button onClick={() => onBack()} className="back-btn">
          Back
        </button>
        <button onClick={handleSubmit} className="submit-btn">
          Generate Report
        </button>
      </div>
    </div>
  );
};

export default ConfirmReview;