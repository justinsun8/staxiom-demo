import React, { useState } from 'react';
import CompanyInfo from './CompanyInfo';
import EstimationResults from './EstimationResults';
import PricingPlans from '../shared/PricingPlans';
import OnboardingFlow from '../onboarding/OnboardingFlow';
import SubmissionLoading from '../onboarding/SubmissionLoading';
import SubmissionSuccess from '../onboarding/SubmissionSuccess';

const EstimationFlow = ({ onLogoClick }) => {
  const [currentStep, setCurrentStep] = useState('companyInfo');
  const [formData, setFormData] = useState({});
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [estimatedCredit, setEstimatedCredit] = useState(125000); // Store the estimated credit amount

  const handleUpdateData = (data) => {
    setFormData(data);
  };

  const handleNext = () => {
    if (currentStep === 'companyInfo') {
      setCurrentStep('results');
    } else if (currentStep === 'results') {
      setCurrentStep('pricing');
    }
    // Add more steps as needed
  };

  const handleBack = () => {
    if (currentStep === 'results') {
      setCurrentStep('companyInfo');
    } else if (currentStep === 'pricing') {
      setCurrentStep('results');
    } else if (currentStep === 'onboarding') {
      setCurrentStep('pricing');
    }
  };

  const handleAssignToAccount = () => {
    // Handle assign to accountant logic
    console.log('Assigning to accountant...');
  };

  const handleSelectPlan = (plan) => {
    console.log('Selected plan:', plan);
    setSelectedPlan(plan);
    setCurrentStep('onboarding');
  };

  return (
    <div>
      {currentStep === 'companyInfo' && (
        <CompanyInfo 
          onNext={handleNext}
          onUpdateData={handleUpdateData}
          onLogoClick={onLogoClick}
        />
      )}
      
      {currentStep === 'results' && (
        <EstimationResults 
          formData={formData}
          onAssignToAccount={handleAssignToAccount}
          onLogoClick={onLogoClick}
          onBack={handleBack}
          onNext={() => {
            // Calculate credit amount based on form data
            const { numberOfEmployees, avgSalary } = formData;
            const totalPayroll = parseInt(numberOfEmployees) * parseInt(avgSalary);
            const technicalStaffPercentage = 0.3;
            const rdCreditRate = 0.065;
            const calculatedCredit = Math.round((totalPayroll * technicalStaffPercentage * rdCreditRate) / 1000) * 1000;
            setEstimatedCredit(calculatedCredit || 125000);
            handleNext();
          }}
        />
      )}
      
      {currentStep === 'pricing' && (
        <PricingPlans 
          onSelectPlan={handleSelectPlan}
          onLogoClick={onLogoClick}
          onBack={handleBack}
        />
      )}
      
      {currentStep === 'onboarding' && (
        <OnboardingFlow 
          selectedPlan={selectedPlan}
          initialEstimate={estimatedCredit}
          estimationData={formData}
          onSubmit={(data) => {
            // Onboarding is now complete, data processing happens within OnboardingFlow
            console.log('Onboarding completed with data:', data);
          }}
          onLogoClick={onLogoClick}
          onBackToEstimation={handleBack}
        />
      )}
    </div>
  );
};

export default EstimationFlow;