import React from 'react';
import './Recommendations.css';

const Recommendations = ({ onNext, onComplete }) => {
  const recommendations = [
    {
      id: 'audit-defense',
      title: 'IRS Audit Defense',
      description: 'Based on your R&D activities, we recommend our audit defense service to protect your claim',
      savings: 'Peace of mind',
      icon: '🛡️',
      highlight: true,
      tag: 'Most Popular'
    },
    {
      id: 'state-credits',
      title: 'State R&D Tax Credits',
      description: 'Your business may qualify for additional state-level R&D credits in your jurisdiction',
      savings: 'Up to $50,000',
      icon: '🏛️'
    },
    {
      id: 'payroll-optimization',
      title: 'Payroll Tax Optimization',
      description: 'Maximize your R&D credit by applying it against payroll taxes',
      savings: 'Immediate cash flow',
      icon: '💰'
    },
    {
      id: 'multi-year',
      title: 'Multi-Year Analysis',
      description: 'We detected potential credits from previous years that you can still claim',
      savings: 'Up to 3 years back',
      icon: '📊'
    },
    {
      id: 'continuous-monitoring',
      title: 'Continuous R&D Monitoring',
      description: 'Automatically track and maximize your R&D activities throughout the year',
      savings: '20% more credits',
      icon: '🔄'
    },
    {
      id: 'expert-consultation',
      title: 'Expert Tax Strategy Session',
      description: 'Get personalized advice from our R&D tax experts based on your unique situation',
      savings: 'Custom strategies',
      icon: '👥'
    }
  ];

  return (
    <div className="recommendations-container">
      <div className="recommendations-header">
        <h2 className="recommendations-title">Personalized Recommendations</h2>
        <p className="recommendations-subtitle">
          Based on your company profile and R&D activities, we've identified additional opportunities to maximize your tax benefits
        </p>
      </div>

      <div className="insight-banner">
        <div className="insight-icon">💡</div>
        <div className="insight-content">
          <h3>Key Insight from Your Data</h3>
          <p>Companies in your industry typically leave 30-40% of eligible credits unclaimed. Our recommendations can help you capture the full value.</p>
        </div>
      </div>

      <div className="recommendations-grid">
        {recommendations.map(rec => (
          <div key={rec.id} className={`recommendation-card ${rec.highlight ? 'highlighted' : ''}`}>
            {rec.tag && <div className="recommendation-tag">{rec.tag}</div>}
            <div className="recommendation-icon">{rec.icon}</div>
            <h3 className="recommendation-title">{rec.title}</h3>
            <p className="recommendation-description">{rec.description}</p>
            <div className="recommendation-savings">
              <span className="savings-label">Potential value:</span>
              <span className="savings-amount">{rec.savings}</span>
            </div>
            <button className="recommendation-select">
              Learn More
            </button>
          </div>
        ))}
      </div>

      <div className="recommendations-footer">
        <button onClick={onComplete} className="skip-btn">
          Skip for Now
        </button>
        <button onClick={onNext} className="explore-btn">
          Explore Selected Options
        </button>
      </div>
    </div>
  );
};

export default Recommendations;