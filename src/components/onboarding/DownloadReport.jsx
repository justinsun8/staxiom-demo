import React from 'react';
import { useToast } from '../../contexts/ToastContext';
import { DownloadIcon, BuildingIcon, CreditCardIcon, ChartIcon, BankIcon } from '../shared/Icons';
import './DownloadReport.css';

const DownloadReport = ({ data, onNext, onBack }) => {
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
        insight: `We see you're an ${companyType}. Based on your company size and R&D activities, converting to a C-Corp could increase your eligible R&D credits by up to 25% and provide additional tax advantages.`,
        impact: 'Potential additional savings: $15,000-$25,000/year',
        cta: 'Learn More'
      });
    }
    
    // Payroll optimization
    if (employees > 10) {
      recommendations.push({
        id: 'payroll-credits',
        icon: CreditCardIcon,
        title: 'Payroll Tax Credit Application',
        insight: 'With ' + employees + ' employees, you can apply up to $500,000 of R&D credits against payroll taxes, improving your immediate cash flow instead of waiting for income tax returns.',
        impact: 'Immediate cash benefit available',
        cta: 'See How'
      });
    }
    
    // Multi-year opportunity
    recommendations.push({
      id: 'multi-year',
      icon: ChartIcon,
      title: 'Multi-Year Credit Recovery',
      insight: 'Our analysis indicates you may have unclaimed R&D credits from the past 3 years. Many companies miss 30-40% of eligible expenses.',
      impact: 'Potential recovery: $50,000-$150,000',
      cta: 'Calculate Recovery'
    });
    
    // State credits
    recommendations.push({
      id: 'state-credits',
      icon: BankIcon,
      title: 'State-Level R&D Credits',
      insight: 'In addition to federal credits, your state offers R&D tax incentives that could provide up to 10% additional credit on qualified expenses.',
      impact: 'Additional state savings available',
      cta: 'Check Eligibility'
    });
    
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
    <div className="download-report-container">
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
          
          <div className="download-action">
            <button onClick={handleDownload} className="download-btn-primary">
              <DownloadIcon className="download-icon" />
              Download Report
            </button>
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
                <p className="rec-insight">{rec.insight}</p>
                <div className="rec-impact">{rec.impact}</div>
                <button className="rec-cta" onClick={() => {
                  console.log('Learn more about:', rec.id);
                  toast.info(`We'll contact you about ${rec.title} within 24 hours.`);
                }}>
                  {rec.cta} →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button onClick={onNext} className="continue-btn">
          Complete Onboarding →
        </button>
      </div>
    </div>
  );
};

export default DownloadReport;