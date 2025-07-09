import React from 'react';
import './UpsellServices.css';

const UpsellServices = ({ data, onNext, onBack }) => {
  const services = [
    {
      id: 'entity-structure',
      icon: '🏢',
      title: 'Entity Structure Optimization',
      description: "Based on your company structure, we can help optimize your entity type for maximum tax efficiency and R&D credit eligibility.",
      details: 'Our experts will analyze your current structure and provide recommendations for potential savings of up to $75,000 annually.',
      cta: 'Schedule Consultation →'
    },
    {
      id: 'bookkeeping',
      icon: '📊',
      title: 'Industry-Specific Bookkeeping',
      description: 'Get connected with specialized bookkeeping partners who understand R&D credit documentation requirements.',
      details: 'Proper categorization can increase your eligible R&D expenses by 15-20% on average.',
      cta: 'Get Connected →'
    },
    {
      id: 'additional-credits',
      icon: '💰',
      title: 'Additional Tax Credits',
      description: 'Explore other tax credits you may qualify for beyond R&D, including WOTC, energy credits, and state incentives.',
      details: 'Companies typically miss 30-40% of available credits. We ensure you capture every opportunity.',
      cta: 'Explore Credits →'
    },
    {
      id: 'payroll-optimization',
      icon: '💳',
      title: 'Payroll Tax Strategy',
      description: 'Implement advanced payroll tax strategies to maximize your R&D credit utilization and cash flow.',
      details: 'Apply up to $500,000 of R&D credits against payroll taxes for immediate cash benefits.',
      cta: 'View Strategy →'
    }
  ];

  const handleServiceClick = (serviceId) => {
    console.log('Service clicked:', serviceId);
    alert(`Learn more about ${serviceId} - Feature coming soon!`);
  };

  return (
    <div className="upsell-services-container">
      <div className="upsell-header">
        <h1>Selected Services Details</h1>
        <p className="upsell-subtitle">
          Here's more information about the services you're interested in exploring
        </p>
      </div>

      <div className="services-grid">
        {services.map(service => (
          <div key={service.id} className="service-card expanded">
            <div className="service-icon">{service.icon}</div>
            <div className="service-content">
              <h3>{service.title}</h3>
              <p className="service-description">{service.description}</p>
              <p className="service-details">{service.details}</p>
              <button 
                className="service-cta"
                onClick={() => handleServiceClick(service.id)}
              >
                {service.cta}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="upsell-footer">
        <div className="trust-badges">
          <span className="badge">✓ No obligation</span>
          <span className="badge">✓ Expert guidance</span>
          <span className="badge">✓ Personalized approach</span>
        </div>
      </div>

      <div className="action-buttons">
        <button onClick={onBack} className="back-btn">
          Back
        </button>
        <button onClick={onNext} className="finish-btn">
          Complete Onboarding →
        </button>
      </div>
    </div>
  );
};

export default UpsellServices;