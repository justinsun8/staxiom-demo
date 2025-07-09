// Accounting Service - Handles all accounting provider integrations
// Currently using mock data, but structured for easy integration

import { accountingProviders } from '../config/accountingProviders';

class AccountingService {
  constructor() {
    this.providers = accountingProviders;
    this.mockMode = true; // Toggle this when ready for real integrations
  }

  // OAuth Flow - Ready for real implementation
  async initiateOAuth(providerId) {
    const provider = this.providers[providerId];
    if (!provider) {
      throw new Error(`Provider ${providerId} not found`);
    }

    if (this.mockMode) {
      // Mock OAuth flow
      return this.mockOAuthFlow(providerId);
    }

    // Real OAuth flow (ready for implementation)
    const { authUrl, clientId, redirectUri, scopes } = provider.oauth;
    const state = this.generateState();
    
    // Store state in sessionStorage for CSRF protection
    sessionStorage.setItem('oauth_state_accounting', state);
    
    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      response_type: 'code',
      scope: scopes.join(' '),
      state: state
    });

    // In production, this would redirect to the OAuth URL
    window.location.href = `${authUrl}?${params.toString()}`;
  }

  // Mock OAuth flow for development
  async mockOAuthFlow(providerId) {
    return new Promise((resolve) => {
      // Simulate OAuth delay
      setTimeout(() => {
        resolve({
          success: true,
          provider: providerId,
          mockToken: `mock_token_${providerId}_${Date.now()}`,
          expiresIn: 3600,
          tokenType: 'Bearer'
        });
      }, 1000);
    });
  }

  // Handle OAuth callback
  async handleOAuthCallback(providerId, code, state) {
    if (this.mockMode) {
      return this.mockOAuthCallback(providerId);
    }

    // Verify state for CSRF protection
    const savedState = sessionStorage.getItem('oauth_state_accounting');
    if (state !== savedState) {
      throw new Error('Invalid state parameter');
    }

    const provider = this.providers[providerId];
    const { tokenUrl, clientId, redirectUri } = provider.oauth;

    // Exchange code for token
    const response = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: code,
        client_id: clientId,
        client_secret: import.meta.env[`VITE_${providerId.toUpperCase()}_CLIENT_SECRET`],
        redirect_uri: redirectUri
      })
    });

    const data = await response.json();
    return this.storeTokens(providerId, data);
  }

  // Mock OAuth callback
  async mockOAuthCallback(providerId) {
    return {
      success: true,
      provider: providerId,
      organizationInfo: this.getMockOrganizationInfo(providerId),
      connectionStatus: 'connected'
    };
  }

  // Get organization information
  async getOrganizationInfo(providerId, accessToken) {
    if (this.mockMode) {
      return this.getMockOrganizationInfo(providerId);
    }

    const provider = this.providers[providerId];
    const endpoint = provider.api.endpoints.organisation || provider.api.endpoints.company;
    
    const response = await fetch(`${provider.api.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Get chart of accounts
  async getChartOfAccounts(providerId, accessToken, companyId) {
    if (this.mockMode) {
      return this.getMockChartOfAccounts(providerId);
    }

    const provider = this.providers[providerId];
    const endpoint = provider.api.endpoints.accounts.replace('{company_id}', companyId);
    
    const response = await fetch(`${provider.api.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Mock data methods
  getMockOrganizationInfo(providerId) {
    return {
      id: 'mock_org_123',
      name: 'Test Company LLC',
      fiscalYearStart: '01-01',
      reportingPeriod: 'Monthly',
      currency: 'USD',
      countryCode: 'US',
      provider: providerId
    };
  }

  getMockChartOfAccounts(providerId) {
    return {
      accounts: [
        {
          id: 'acc_1',
          name: 'Research & Development',
          type: 'Expense',
          subtype: 'R&D',
          balance: 250000
        },
        {
          id: 'acc_2',
          name: 'Salaries - Engineering',
          type: 'Expense', 
          subtype: 'Payroll',
          balance: 1200000
        },
        {
          id: 'acc_3',
          name: 'Software & Licenses',
          type: 'Expense',
          subtype: 'Technology',
          balance: 85000
        }
      ],
      total_rd_expenses: 1535000
    };
  }

  // Helper methods
  generateState() {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  storeTokens(providerId, tokenData) {
    // In production, store securely (encrypted in backend)
    const tokens = {
      provider: providerId,
      accessToken: tokenData.access_token,
      refreshToken: tokenData.refresh_token,
      expiresAt: Date.now() + (tokenData.expires_in * 1000),
      tokenType: tokenData.token_type
    };

    // For now, store in sessionStorage (in production, send to backend)
    sessionStorage.setItem(`accounting_tokens_${providerId}`, JSON.stringify(tokens));
    return tokens;
  }

  // Check if provider is connected
  isProviderConnected(providerId) {
    const tokens = sessionStorage.getItem(`accounting_tokens_${providerId}`);
    if (!tokens) return false;

    const tokenData = JSON.parse(tokens);
    return tokenData.expiresAt > Date.now();
  }

  // Disconnect provider
  async disconnectProvider(providerId) {
    sessionStorage.removeItem(`accounting_tokens_${providerId}`);
    // In production, also revoke tokens via API
    return { success: true };
  }
}

export default new AccountingService();