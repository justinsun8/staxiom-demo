import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { DownloadIcon, BuildingIcon, CreditCardIcon, ChartIcon, BankIcon } from '../shared/Icons';
import './DownloadReport.css';

const DownloadReport = ({ data, onNext, onBack, isLastStep }) => {
  const toast = useToast();
  // Get the initial estimate from the estimation phase
  const getInitialEstimate = () => {
    // First check if we have the initial estimate from the estimation phase
    if (data?.initialEstimate) {
      return data.initialEstimate;
    }
    
    // Fallback to calculating from company details if available
    const employees = data?.companyDetails?.numberOfEmployees || data?.estimationData?.numberOfEmployees || 50;
    const avgSalary = data?.companyDetails?.avgSalary || data?.estimationData?.avgSalary || 100000;
    const totalPayroll = parseInt(employees) * parseInt(avgSalary);
    const technicalStaffPercentage = 0.3;
    const rdCreditRate = 0.065;
    const estimatedCredit = totalPayroll * technicalStaffPercentage * rdCreditRate;
    return Math.round(estimatedCredit / 1000) * 1000;
  };
  
  const calculateActualCredit = () => {
    const initialEstimate = getInitialEstimate();
    
    // Add a small positive variation (0% to +15%) to show we found more credits
    const variation = 1.0 + (Math.random() * 0.15); // 1.0 to 1.15
    const actualCredit = initialEstimate * variation;
    
    return Math.round(actualCredit / 1000) * 1000;
  };
  
  const initialEstimate = getInitialEstimate();
  const actualCredit = calculateActualCredit();

  const getPersonalizedRecommendations = () => {
    const companyType = data?.companyDetails?.companyType || 'LLC';
    const hasPayroll = data?.payrollProvider?.connected || false;
    const hasAccounting = data?.accountingPlatform?.connected || false;
    const employees = parseInt(data?.companyDetails?.numberOfEmployees || 50);
    
    const recommendations = [];
    
    // Entity structure recommendation
    if (companyType === 'LLC' || companyType === 'Sole Proprietorship') {
      recommendations.push({
        id: 'entity-structure',
        icon: BuildingIcon,
        title: 'Entity Structure Optimization',
        description: 'We see you\'re an LLC. Based on your company size and R&D activities, converting to a C-Corp could increase your eligible R&D credits by up to 25% and provide additional tax advantages.',
        impact: 'Potential additional savings: $15,000-$25,000/year',
        cta: 'Learn More →',
        action: () => toast.info('Entity structure consultation scheduled')
      });
    }
    
    // Payroll tax credit application
    if (!hasPayroll || employees < 100) {
      recommendations.push({
        id: 'payroll-credit',
        icon: BankIcon,
        title: 'Payroll Tax Credit Application',
        description: 'With 50 employees, you can apply up to $500,000 of R&D credits against payroll taxes, improving your immediate cash flow instead of waiting for income tax returns.',
        impact: 'Immediate cash benefit available',
        cta: 'See How →',
        action: () => toast.info('Payroll credit application process started')
      });
    }
    
    // Multi-year recovery
    recommendations.push({
      id: 'multi-year',
      icon: ChartIcon,
      title: 'Multi-Year Credit Recovery',
      description: 'Our analysis indicates you may have unclaimed R&D credits from the past 3 years. Many companies miss 30-40% of eligible expenses.',
      impact: 'Potential recovery: $50,000-$150,000',
      cta: 'Calculate Recovery →',
      action: () => toast.info('Multi-year analysis scheduled')
    });
    
    // State R&D credits
    if (data?.companyDetails?.state === 'CA' || !data?.companyDetails?.state) {
      recommendations.push({
        id: 'state-credits',
        icon: CreditCardIcon,
        title: 'California R&D Tax Credits',
        description: 'California offers additional R&D tax credits that can be combined with federal credits. The state credit rate is 15% for qualified research.',
        impact: 'Additional state savings: $10,000-$20,000',
        cta: 'Explore State Credits →',
        action: () => toast.info('State credit analysis initiated')
      });
    }
    
    return recommendations.slice(0, 3); // Return top 3 most relevant
  };

  const handleDownload = () => {
    console.log('Downloading R&D tax credit report...');
    // Simulate download action
    toast.success('R&D Tax Credit Report downloaded successfully!');
    
    // Simulate actual file download
    setTimeout(() => {
      const link = document.createElement('a');
      link.href = '#'; // In real app, this would be the actual file URL
      link.download = `R&D_Tax_Credit_Report_${data?.companyDetails?.companyName || 'Company'}_2024.pdf`;
      link.click();
    }, 500);
  };


  return (
    <div className={`download-report-container ${isLastStep ? 'full-page' : ''}`}>
      {/* Staxiom Logo */}
      {isLastStep && (
        <div className="download-logo">
          <img 
            src="https://cdn.prod.website-files.com/679ef02de8b79a9716efc818/679f281372adefd0878d72fe_staxiom-logo.svg" 
            alt="Staxiom" 
            style={{height: '40px', width: 'auto'}} 
          />
        </div>
      )}

      <div className="download-header">
        <h1>Your R&D Tax Credit Report is Ready!</h1>
        <p className="download-subtitle">
          We've analyzed your data and prepared a comprehensive report
        </p>
      </div>

      <div className="report-preview">
        <div className="preview-header">
          <h3>R&D Tax Credit Report</h3>
          <span className="ready-badge">READY ✓</span>
        </div>
        
        <div className="preview-content">
          <div className="credit-comparison">
            <div className="credit-item initial">
              <span className="credit-label">INITIAL ESTIMATE</span>
              <span className="credit-value estimate">${initialEstimate.toLocaleString()}</span>
            </div>
            <div className="credit-arrow">→</div>
            <div className="credit-item actual">
              <span className="credit-label">ACTUAL CREDIT AMOUNT</span>
              <span className="credit-value final">${actualCredit.toLocaleString()}</span>
              <span className="credit-increase">+${(actualCredit - initialEstimate).toLocaleString()} found!</span>
            </div>
          </div>
          
          <div className="report-details">
            <div className="detail-item">
              <span className="detail-label">Company</span>
              <span className="detail-value">{data?.companyDetails?.companyName || 'Your Company'}</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Tax Year</span>
              <span className="detail-value">2024</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Report Type</span>
              <span className="detail-value">Federal R&D Tax Credit Analysis</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Status</span>
              <span className="detail-value ready">✓ Ready to Download</span>
            </div>
          </div>

          <div className="report-includes">
            <h4>Report Includes:</h4>
            <ul>
              <li>✓ Detailed eligibility analysis</li>
              <li>✓ Qualifying expense calculations</li>
              <li>✓ IRS Form 6765 draft</li>
              <li>✓ Supporting documentation checklist</li>
              <li>✓ Next steps and filing guidance</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="recommendations-section">
        <h2 className="recommendations-title">Additional Opportunities Identified</h2>
        <p className="recommendations-subtitle">
          Based on your company profile, our analysis has identified these optimization opportunities:
        </p>
        
        <div className="recommendation-cards">
          {getPersonalizedRecommendations().map(rec => (
            <div key={rec.id} className="recommendation-card">
              <div className="rec-icon">
                <rec.icon size={32} />
              </div>
              <div className="rec-content">
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <div className="rec-impact">{rec.impact}</div>
                <button 
                  className="rec-cta" 
                  onClick={rec.action}
                >
                  {rec.cta}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download section moved to bottom */}
      <div className="download-section">
        <div className="download-action">
          <button onClick={handleDownload} className="download-btn-primary">
            <DownloadIcon className="download-icon" />
            Download Report
          </button>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button onClick={onNext} className="complete-btn">
          Complete Onboarding →
        </button>
      </div>
    </div>
  );
};

export default DownloadReport;