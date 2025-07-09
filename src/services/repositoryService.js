// Repository Service - Handles all source code repository provider integrations
// Currently using mock data, but structured for easy integration

import { repositoryProviders } from '../config/repositoryProviders';

class RepositoryService {
  constructor() {
    this.providers = repositoryProviders;
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
    sessionStorage.setItem('oauth_state_repository', state);
    
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
    const savedState = sessionStorage.getItem('oauth_state_repository');
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
        'Accept': 'application/json'
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
      userInfo: this.getMockUserInfo(providerId),
      repositories: this.getMockRepositories(providerId),
      connectionStatus: 'connected'
    };
  }

  // Get user information
  async getUserInfo(providerId, accessToken) {
    if (this.mockMode) {
      return this.getMockUserInfo(providerId);
    }

    const provider = this.providers[providerId];
    const response = await fetch(`${provider.api.baseUrl}${provider.api.endpoints.user}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Get repositories
  async getRepositories(providerId, accessToken) {
    if (this.mockMode) {
      return this.getMockRepositories(providerId);
    }

    const provider = this.providers[providerId];
    const endpoint = provider.api.endpoints.repos || provider.api.endpoints.repositories || provider.api.endpoints.projects;
    
    const response = await fetch(`${provider.api.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Get repository languages/technologies
  async getRepositoryLanguages(providerId, accessToken, repoId) {
    if (this.mockMode) {
      return this.getMockLanguages();
    }

    const provider = this.providers[providerId];
    if (!provider.api.endpoints.languages) {
      return {}; // Not all providers support this
    }

    const endpoint = provider.api.endpoints.languages.replace('{id}', repoId);
    const response = await fetch(`${provider.api.baseUrl}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Accept': 'application/json'
      }
    });

    return response.json();
  }

  // Mock data methods
  getMockUserInfo(providerId) {
    return {
      id: 'mock_user_123',
      username: 'testuser',
      email: 'test@example.com',
      name: 'Test User',
      avatar_url: 'https://via.placeholder.com/150',
      provider: providerId
    };
  }

  getMockRepositories(providerId) {
    return [
      {
        id: 'repo_1',
        name: 'frontend-app',
        full_name: 'testuser/frontend-app',
        description: 'React frontend application',
        private: false,
        language: 'JavaScript',
        created_at: '2023-01-15T00:00:00Z',
        updated_at: '2024-01-07T00:00:00Z',
        size: 2048
      },
      {
        id: 'repo_2',
        name: 'backend-api',
        full_name: 'testuser/backend-api',
        description: 'Node.js backend API',
        private: false,
        language: 'TypeScript',
        created_at: '2023-02-20T00:00:00Z',
        updated_at: '2024-01-05T00:00:00Z',
        size: 1536
      },
      {
        id: 'repo_3',
        name: 'data-science-project',
        full_name: 'testuser/data-science-project',
        description: 'Python data analysis and ML',
        private: true,
        language: 'Python',
        created_at: '2023-06-10T00:00:00Z',
        updated_at: '2024-01-03T00:00:00Z',
        size: 3072
      }
    ];
  }

  getMockLanguages() {
    return {
      'JavaScript': 45234,
      'TypeScript': 38921,
      'Python': 28456,
      'CSS': 12890,
      'HTML': 8234,
      'SQL': 5123
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
      tokenType: tokenData.token_type || 'Bearer'
    };

    // For now, store in sessionStorage (in production, send to backend)
    sessionStorage.setItem(`repository_tokens_${providerId}`, JSON.stringify(tokens));
    return tokens;
  }

  // Check if provider is connected
  isProviderConnected(providerId) {
    const tokens = sessionStorage.getItem(`repository_tokens_${providerId}`);
    if (!tokens) return false;

    const tokenData = JSON.parse(tokens);
    return tokenData.expiresAt > Date.now();
  }

  // Disconnect provider
  async disconnectProvider(providerId) {
    sessionStorage.removeItem(`repository_tokens_${providerId}`);
    // In production, also revoke tokens via API
    return { success: true };
  }
}

export default new RepositoryService();