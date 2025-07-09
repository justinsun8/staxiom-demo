import React, { useState } from 'react';
import QualificationQuestions from './QualificationQuestions';
import CompanyDetails from './CompanyDetails';
import PayrollProvider from './PayrollProvider';
import AccountingProvider from './AccountingProvider';
import SourceCodeRepository from './SourceCodeRepository';
import UploadDocuments from './UploadDocuments';
import ConfirmReview from './ConfirmReview';
import DownloadReport from './DownloadReport';
import { MoneyBagIcon, ChartIcon, DollarIcon, TrendingUpIcon } from '../shared/Icons';
import './OnboardingFlow.css';

const OnboardingFlow = ({ selectedPlan, initialEstimate, estimationData, onSubmit, onLogoClick, onBackToEstimation }) => {
  const [currentStep, setCurrentStep] = useState('qualification');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('Gathering your data...');
  const [showDownload, setShowDownload] = useState(false);
  const [onboardingData, setOnboardingData] = useState({
    plan: selectedPlan,
    initialEstimate: initialEstimate,
    estimationData: estimationData,
    qualification: {},
    companyDetails: {},
    payrollProvider: {},
    accountingPlatform: {},
    sourceCode: {},
    documents: { uploadedFiles: {} }
  });

  const steps = [
    { id: 'qualification', name: 'Answer Qualifying Questions', completed: false },
    { id: 'company', name: 'About your Company', completed: false },
    { id: 'payroll', name: 'Connect Payroll Provider', completed: false },
    { id: 'accounting', name: 'Connect Accounting Platform', completed: false },
    { id: 'source', name: 'Connect Source Code Repository', completed: false },
    { id: 'documents', name: 'Upload Documents', completed: false },
    { id: 'confirm', name: 'Confirm', completed: false },
    { id: 'download', name: 'Download R&D Report', completed: false }
  ];

  const updateData = (stepId, data) => {
    setOnboardingData(prev => ({
      ...prev,
      [stepId]: data
    }));
  };

  const handleNext = () => {
    const stepOrder = ['qualification', 'company', 'payroll', 'accounting', 'source', 'documents', 'confirm'];
    const currentIndex = stepOrder.indexOf(currentStep);
    if (currentIndex < stepOrder.length - 1) {
      setCurrentStep(stepOrder[currentIndex + 1]);
    }
  };

  const handleBack = (targetStep) => {
    const stepOrder = ['qualification', 'company', 'payroll', 'accounting', 'source', 'documents', 'confirm'];
    
    if (targetStep) {
      // Jump directly to the specified step
      setCurrentStep(targetStep);
    } else {
      // Go to previous step
      const currentIndex = stepOrder.indexOf(currentStep);
      if (currentIndex > 0) {
        setCurrentStep(stepOrder[currentIndex - 1]);
      }
    }
  };

  const getStepStatus = (stepId) => {
    const stepOrder = ['qualification', 'company', 'payroll', 'accounting', 'source', 'documents', 'confirm', 'download'];
    const currentIndex = stepOrder.indexOf(currentStep);
    const stepIndex = stepOrder.indexOf(stepId);
    
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  const hideNavigation = currentStep === 'download' && showDownload;

  return (
    <div className={`onboarding-container ${hideNavigation ? 'no-sidebar' : ''}`}>
      {!hideNavigation && (
        <div className="onboarding-sidebar">
          <div className="logo" onClick={onLogoClick} style={{cursor: 'pointer'}}>
            <img src="https://cdn.prod.website-files.com/679ef02de8b79a9716efc818/679f281372adefd0878d72fe_staxiom-logo.svg" alt="Staxiom" style={{height: '32px', width: 'auto'}} />
          </div>
          
          <div className="onboarding-header">
            <h2 className="sidebar-title">On-Boarding ({selectedPlan === 'pro' ? 'Pro Plan' : 'Base Plan'})</h2>
          </div>

          <div className="onboarding-steps">
            {steps.map(step => {
              const status = getStepStatus(step.id);
              const isClickable = status === 'completed' || status === 'active';
              return (
                <div 
                  key={step.id} 
                  className={`step ${status} ${isClickable ? 'clickable' : ''}`}
                  onClick={() => {
                    if (isClickable && step.id !== 'download') {
                      setCurrentStep(step.id);
                    }
                  }}
                  style={{ cursor: isClickable ? 'pointer' : 'default' }}
                >
                  <span className="step-icon">
                    {status === 'completed' ? '✓' : '○'}
                  </span>
                  <span className="step-text">{step.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className={`onboarding-content ${hideNavigation ? 'full-width' : ''}`}>
        {currentStep === 'qualification' && (
          <QualificationQuestions
            data={onboardingData.qualification}
            onUpdate={(data) => updateData('qualification', data)}
            onNext={handleNext}
            onBack={onBackToEstimation}
          />
        )}

        {currentStep === 'company' && (
          <CompanyDetails
            data={onboardingData.companyDetails}
            onUpdate={(data) => updateData('companyDetails', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'payroll' && (
          <PayrollProvider
            data={onboardingData.payrollProvider}
            onUpdate={(data) => updateData('payrollProvider', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'accounting' && (
          <AccountingProvider
            data={onboardingData.accountingPlatform}
            onUpdate={(data) => updateData('accountingPlatform', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'source' && (
          <SourceCodeRepository
            data={onboardingData.sourceCode}
            onUpdate={(data) => updateData('sourceCode', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'documents' && (
          <UploadDocuments
            data={onboardingData.documents}
            onUpdate={(data) => updateData('documents', data)}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {currentStep === 'confirm' && !isLoading && !showDownload && (
          <ConfirmReview
            data={onboardingData}
            onBack={handleBack}
            onSubmit={(data) => {
              console.log('Generating report with data:', data);
              // Start loading animation
              setIsLoading(true);
              setCurrentStep('download'); // Move to download step in sidebar
              
              // Rotating loading messages
              const messages = [
                'Gathering your data...',
                'Analyzing your documents...',
                'Processing R&D activities...',
                'Calculating tax credits...',
                'Optimizing deductions...',
                'Generating your report...',
                'Finalizing calculations...'
              ];
              
              let messageIndex = 0;
              const messageInterval = setInterval(() => {
                messageIndex = (messageIndex + 1) % messages.length;
                setLoadingMessage(messages[messageIndex]);
              }, 1000); // Change message every second
              
              // Simulate loading progress (7 seconds total)
              const progressInterval = setInterval(() => {
                setLoadingProgress(prev => {
                  if (prev >= 100) {
                    clearInterval(progressInterval);
                    clearInterval(messageInterval);
                    setTimeout(() => {
                      setIsLoading(false);
                      setShowDownload(true);
                    }, 500);
                    return 100;
                  }
                  return prev + 2; // ~7 seconds (2% every 140ms)
                });
              }, 140);
            }}
          />
        )}

        {currentStep === 'download' && isLoading && (
          <div className="loading-container">
            <div className="ai-loading-state">
              <div className="stacking-animation">
                <div className="stack-folder">
                  <div className="folder-back"></div>
                  <div className="folder-front">
                    <div className="folder-tab"></div>
                  </div>
                </div>
                <div className="stacking-items">
                  <div className="stack-item item-1">
                    <MoneyBagIcon size={36} />
                  </div>
                  <div className="stack-item item-2">
                    <ChartIcon size={36} />
                  </div>
                  <div className="stack-item item-3">
                    <DollarIcon size={36} />
                  </div>
                  <div className="stack-item item-4">
                    <TrendingUpIcon size={36} />
                  </div>
                </div>
              </div>
              <h2 className="loading-title">{loadingMessage}</h2>
              <div className="progress-container">
                <div className="progress-bar">
                  <div className="progress-fill" style={{width: `${loadingProgress}%`}}></div>
                </div>
                <span className="progress-text">{loadingProgress}%</span>
              </div>
            </div>
          </div>
        )}

        {currentStep === 'download' && showDownload && (
          <DownloadReport
            data={onboardingData}
            isLastStep={true}
            onNext={() => {
              // Complete onboarding and return to login
              console.log('Onboarding completed!');
              if (onLogoClick) {
                onLogoClick(); // Return to login screen
              }
            }}
            onBack={() => {
              setShowDownload(false);
              setCurrentStep('confirm');
            }}
          />
        )}

      </div>
    </div>
  );
};

export default OnboardingFlow;