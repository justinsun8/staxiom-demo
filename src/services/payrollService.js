// Payroll Service - Handles all payroll provider integrations
// Currently using mock data, but structured for easy integration

import { payrollProviders } from '../config/payrollProviders';

class PayrollService {
  constructor() {
    this.providers = payrollProviders;
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
    sessionStorage.setItem('oauth_state', state);
    
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
    const savedState = sessionStorage.getItem('oauth_state');
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
      companyInfo: this.getMockCompanyInfo(providerId),
      connectionStatus: 'connected'
    };
  }

  // Get company information
  async getCompanyInfo(providerId, accessToken) {
    if (this.mockMode) {
      return this.getMockCompanyInfo(providerId);
    }

    const provider = this.providers[providerId];
    const response = await fetch(`${provider.api.baseUrl}${provider.api.endpoints.company}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Get payroll data
  async getPayrollData(providerId, accessToken, companyId, startDate, endDate) {
    if (this.mockMode) {
      return this.getMockPayrollData(providerId, startDate, endDate);
    }

    const provider = this.providers[providerId];
    const endpoint = provider.api.endpoints.payrolls.replace('{company_id}', companyId);
    
    const response = await fetch(`${provider.api.baseUrl}${endpoint}?start_date=${startDate}&end_date=${endDate}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Mock data methods
  getMockCompanyInfo(providerId) {
    return {
      id: 'mock_company_123',
      name: 'Test Company LLC',
      ein: '12-3456789',
      address: {
        line1: '123 Main St',
        city: 'San Francisco',
        state: 'CA',
        zip: '94105'
      },
      provider: providerId
    };
  }

  getMockPayrollData(providerId, startDate, endDate) {
    // providerId can be used for provider-specific mock data in the future
    return {
      payrolls: [
        {
          id: 'payroll_1',
          pay_period: {
            start_date: startDate,
            end_date: endDate
          },
          total_wages: 150000,
          total_employees: 10,
          status: 'processed'
        }
      ],
      summary: {
        total_wages: 1800000,
        total_taxes: 450000,
        total_benefits: 200000
      }
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
    sessionStorage.setItem(`payroll_tokens_${providerId}`, JSON.stringify(tokens));
    return tokens;
  }

  // Check if provider is connected
  isProviderConnected(providerId) {
    const tokens = sessionStorage.getItem(`payroll_tokens_${providerId}`);
    if (!tokens) return false;

    const tokenData = JSON.parse(tokens);
    return tokenData.expiresAt > Date.now();
  }

  // Disconnect provider
  async disconnectProvider(providerId) {
    sessionStorage.removeItem(`payroll_tokens_${providerId}`);
    // In production, also revoke tokens via API
    return { success: true };
  }
}

export default new PayrollService();