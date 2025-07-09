import React from 'react';

const ImageTest = () => {
  const testImages = [
    '/images/logo_gusto.png',
    '/images/logo_quickbooks.png',
    '/images/logo_adp.png',
  ];

  return (
    <div style={{ padding: '20px', background: '#f5f5f5' }}>
      <h3>Image Test</h3>
      {testImages.map((src, index) => (
        <div key={index} style={{ marginBottom: '10px' }}>
          <p>{src}</p>
          <img 
            src={src} 
            alt={`Test ${index}`}
            style={{ maxHeight: '40px', border: '1px solid #ccc' }}
            onLoad={() => console.log(`✓ Loaded: ${src}`)}
            onError={() => console.error(`✗ Failed to load: ${src}`)}
          />
        </div>
      ))}
    </div>
  );
};

export default ImageTest;