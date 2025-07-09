// Accounting Provider Configuration
// This file contains all the configuration needed for accounting provider integrations
// When ready to integrate, update the OAuth URLs and add API credentials

export const accountingProviders = {
  quickbooksOnline: {
    id: 'quickbooksOnline',
    name: 'Quickbooks Online',
    logo: '/images/logo_qb_online.png',
    color: '#2ca01c',
    oauth: {
      authUrl: 'https://appcenter.intuit.com/connect/oauth2',
      tokenUrl: 'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
      clientId: import.meta.env.VITE_QB_ONLINE_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_QB_ONLINE_REDIRECT_URI || 'http://localhost:3000/oauth/callback/quickbooks-online',
      scopes: ['com.intuit.quickbooks.accounting']
    },
    api: {
      baseUrl: 'https://api.intuit.com/v3',
      endpoints: {
        company: '/company/{company_id}/companyinfo/{company_id}',
        accounts: '/company/{company_id}/query?query=select * from Account',
        transactions: '/company/{company_id}/query?query=select * from Transaction'
      }
    }
  },
  
  quickbooksDesktop: {
    id: 'quickbooksDesktop',
    name: 'Quickbooks Desktop',
    logo: '/images/logo_qb_desktop.png',
    color: '#2ca01c',
    connectionType: 'desktop', // Different connection method
    requirements: [
      'QuickBooks Desktop must be installed',
      'Web Connector must be configured',
      'Company file must be open'
    ]
  },
  
  xero: {
    id: 'xero',
    name: 'Xero',
    logo: '/images/logo_xero.png',
    color: '#13b5ea',
    oauth: {
      authUrl: 'https://login.xero.com/identity/connect/authorize',
      tokenUrl: 'https://identity.xero.com/connect/token',
      clientId: import.meta.env.VITE_XERO_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_XERO_REDIRECT_URI || 'http://localhost:3000/oauth/callback/xero',
      scopes: ['accounting.transactions.read', 'accounting.reports.read', 'accounting.settings.read']
    },
    api: {
      baseUrl: 'https://api.xero.com/api.xro/2.0',
      endpoints: {
        organisation: '/organisation',
        accounts: '/accounts',
        invoices: '/invoices'
      }
    }
  },
  
  sage: {
    id: 'sage',
    name: 'Sage',
    logo: '/images/logo_sage.png',
    color: '#00dc06',
    oauth: {
      authUrl: 'https://oauth.accounting.sage.com/authorize',
      tokenUrl: 'https://oauth.accounting.sage.com/token',
      clientId: import.meta.env.VITE_SAGE_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_SAGE_REDIRECT_URI || 'http://localhost:3000/oauth/callback/sage',
      scopes: ['full_access']
    }
  },
  
  freshbooks: {
    id: 'freshbooks',
    name: 'FreshBooks',
    logo: '/images/logo_freshbooks.png',
    color: '#0075dd',
    oauth: {
      authUrl: 'https://auth.freshbooks.com/oauth/authorize',
      tokenUrl: 'https://api.freshbooks.com/auth/oauth/token',
      clientId: import.meta.env.VITE_FRESHBOOKS_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_FRESHBOOKS_REDIRECT_URI || 'http://localhost:3000/oauth/callback/freshbooks',
      scopes: ['user:profile:read', 'user:expenses:read', 'user:invoices:read']
    }
  },
  
  wave: {
    id: 'wave',
    name: 'Wave',
    logo: '/images/logo_wave.png',
    color: '#1f4788',
    oauth: {
      authUrl: 'https://api.waveapps.com/oauth2/authorize',
      tokenUrl: 'https://api.waveapps.com/oauth2/token',
      clientId: import.meta.env.VITE_WAVE_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_WAVE_REDIRECT_URI || 'http://localhost:3000/oauth/callback/wave',
      scopes: ['account:read', 'transaction:read']
    }
  }
};

export default accountingProviders;