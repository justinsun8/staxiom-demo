// Payroll Provider Configuration
// This file contains all the configuration needed for payroll provider integrations
// When ready to integrate, update the OAuth URLs and add API credentials

export const payrollProviders = {
  gusto: {
    id: 'gusto',
    name: 'Gusto',
    logo: '/images/logo_gusto.png',
    color: '#ff6d3f',
    oauth: {
      authUrl: 'https://api.gusto.com/oauth/authorize',
      tokenUrl: 'https://api.gusto.com/oauth/token',
      clientId: import.meta.env.VITE_GUSTO_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_GUSTO_REDIRECT_URI || 'http://localhost:3000/oauth/callback/gusto',
      scopes: ['payroll:read', 'employee:read', 'company:read']
    },
    api: {
      baseUrl: 'https://api.gusto.com/v1',
      endpoints: {
        companies: '/companies',
        payrolls: '/companies/{company_id}/payrolls',
        employees: '/companies/{company_id}/employees'
      }
    },
    mockData: {
      companies: [
        { id: '1', name: 'Test Company LLC', ein: '12-3456789' }
      ]
    }
  },
  
  quickbooks: {
    id: 'quickbooks',
    name: 'Quickbooks Payroll',
    logo: '/images/logo_quickbooks.png',
    color: '#2ca01c',
    oauth: {
      authUrl: 'https://appcenter.intuit.com/connect/oauth2',
      tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      clientId: import.meta.env.VITE_QB_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_QB_REDIRECT_URI || 'http://localhost:3000/oauth/callback/quickbooks',
      scopes: ['com.intuit.quickbooks.payroll', 'com.intuit.quickbooks.payroll.benefits']
    },
    api: {
      baseUrl: 'https://api.intuit.com/v1',
      endpoints: {
        company: '/company',
        payroll: '/payroll',
        employees: '/employees'
      }
    }
  },
  
  justworks: {
    id: 'justworks',
    name: 'Justworks',
    logo: '/images/logo_justworks.png',
    color: '#4a90e2',
    oauth: {
      authUrl: 'https://api.justworks.com/oauth/authorize',
      tokenUrl: 'https://api.justworks.com/oauth/token',
      clientId: import.meta.env.VITE_JUSTWORKS_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_JUSTWORKS_REDIRECT_URI || 'http://localhost:3000/oauth/callback/justworks',
      scopes: ['payroll:read', 'company:read']
    }
  },
  
  rippling: {
    id: 'rippling',
    name: 'Rippling',
    logo: '/images/logo_rippling.png',
    color: '#ffd700',
    oauth: {
      authUrl: 'https://api.rippling.com/oauth/authorize',
      tokenUrl: 'https://api.rippling.com/oauth/token',
      clientId: import.meta.env.VITE_RIPPLING_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_RIPPLING_REDIRECT_URI || 'http://localhost:3000/oauth/callback/rippling',
      scopes: ['platform:read', 'payroll:read']
    }
  },
  
  adp: {
    id: 'adp',
    name: 'ADP',
    logo: '/images/logo_adp.png',
    color: '#ee3124',
    oauth: {
      authUrl: 'https://accounts.adp.com/auth/oauth/v2/authorize',
      tokenUrl: 'https://accounts.adp.com/auth/oauth/v2/token',
      clientId: import.meta.env.VITE_ADP_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_ADP_REDIRECT_URI || 'http://localhost:3000/oauth/callback/adp',
      scopes: ['payroll', 'profile']
    }
  },
  
  paychex: {
    id: 'paychex',
    name: 'Paychex',
    logo: '/images/logo_paychex.png',
    color: '#005cb9',
    oauth: {
      authUrl: 'https://api.paychex.com/oauth/authorize',
      tokenUrl: 'https://api.paychex.com/oauth/token',
      clientId: import.meta.env.VITE_PAYCHEX_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_PAYCHEX_REDIRECT_URI || 'http://localhost:3000/oauth/callback/paychex',
      scopes: ['payroll', 'employees']
    }
  }
};

export default payrollProviders;