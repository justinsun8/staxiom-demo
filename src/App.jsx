import React, { useState } from 'react';
import SignIn from './components/auth/SignIn';
import EstimationFlow from './components/estimation/EstimationFlow';
import { ToastProvider } from './contexts/ToastContext';
import './App.css';

const App = () => {
  const [currentPage, setCurrentPage] = useState('signin');

  console.log('App rendered, currentPage:', currentPage);

  const handleSignIn = () => {
    console.log('handleSignIn called');
    setCurrentPage('estimation');
  };

  const handleLogoClick = () => {
    console.log('Logo clicked, returning to signin');
    setCurrentPage('signin');
  };

  return (
    <ToastProvider>
      <div className="app">
        {currentPage === 'signin' && (
          <SignIn onSignIn={handleSignIn} />
        )}
        
        {currentPage === 'estimation' && (
          <EstimationFlow onLogoClick={handleLogoClick} />
        )}
      </div>
    </ToastProvider>
  );
};

export default App;