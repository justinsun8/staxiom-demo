import React from 'react';

const ProviderLogo = ({ name, color = '#4db8a8', className = '' }) => {
  // Get initials or short name for the logo
  const getLogoText = (name) => {
    const lowerName = name.toLowerCase();
    
    // Special cases for known providers
    const specialCases = {
      'quickbooks online': 'QB',
      'quickbooks desktop': 'QBD',
      'quickbooks': 'QB',
      'gusto': 'G',
      'adp': 'ADP',
      'paychex': 'P',
      'rippling': 'R',
      'justworks': 'JW',
      'xero': 'X',
      'freshbooks': 'FB',
      'wave': 'W',
      'sage': 'S',
      'github': 'GH',
      'gitlab': 'GL',
      'bitbucket': 'BB',
      'assembla': 'A',
      'sourceforge': 'SF',
      'projectlocker': 'PL'
    };
    
    return specialCases[lowerName] || name.charAt(0).toUpperCase();
  };
  
  const logoText = getLogoText(name);
  
  return (
    <div 
      className={`provider-logo ${className}`}
      style={{
        width: '48px',
        height: '48px',
        backgroundColor: color,
        borderRadius: '8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontWeight: 'bold',
        fontSize: logoText.length > 2 ? '16px' : '20px',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        ...((className.includes('small') || className.includes('mini')) && {
          width: '32px',
          height: '32px',
          fontSize: logoText.length > 2 ? '12px' : '16px',
        })
      }}
    >
      {logoText}
    </div>
  );
};

export default ProviderLogo;