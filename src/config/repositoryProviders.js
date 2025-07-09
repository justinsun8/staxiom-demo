// Source Code Repository Provider Configuration
// This file contains all the configuration needed for repository provider integrations
// When ready to integrate, update the OAuth URLs and add API credentials

export const repositoryProviders = {
  github: {
    id: 'github',
    name: 'GitHub',
    logo: '/images/logo_github.png',
    color: '#24292e',
    oauth: {
      authUrl: 'https://github.com/login/oauth/authorize',
      tokenUrl: 'https://github.com/login/oauth/access_token',
      clientId: import.meta.env.VITE_GITHUB_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_GITHUB_REDIRECT_URI || 'http://localhost:3000/oauth/callback/github',
      scopes: ['repo', 'read:org', 'read:user']
    },
    api: {
      baseUrl: 'https://api.github.com',
      endpoints: {
        user: '/user',
        repos: '/user/repos',
        organizations: '/user/orgs',
        repoContent: '/repos/{owner}/{repo}/contents',
        commits: '/repos/{owner}/{repo}/commits',
        languages: '/repos/{owner}/{repo}/languages'
      }
    }
  },
  
  bitbucket: {
    id: 'bitbucket',
    name: 'Bitbucket',
    logo: '/images/logo_bitbucket.png',
    color: '#0052cc',
    oauth: {
      authUrl: 'https://bitbucket.org/site/oauth2/authorize',
      tokenUrl: 'https://bitbucket.org/site/oauth2/access_token',
      clientId: import.meta.env.VITE_BITBUCKET_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_BITBUCKET_REDIRECT_URI || 'http://localhost:3000/oauth/callback/bitbucket',
      scopes: ['repository', 'account']
    },
    api: {
      baseUrl: 'https://api.bitbucket.org/2.0',
      endpoints: {
        user: '/user',
        repositories: '/repositories/{username}',
        commits: '/repositories/{workspace}/{repo_slug}/commits',
        src: '/repositories/{workspace}/{repo_slug}/src'
      }
    }
  },
  
  assembla: {
    id: 'assembla',
    name: 'Assembla',
    logo: '/images/logo_assembla.png',
    color: '#1a73a7',
    oauth: {
      authUrl: 'https://api.assembla.com/authorization',
      tokenUrl: 'https://api.assembla.com/token',
      clientId: import.meta.env.VITE_ASSEMBLA_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_ASSEMBLA_REDIRECT_URI || 'http://localhost:3000/oauth/callback/assembla',
      scopes: ['read']
    },
    api: {
      baseUrl: 'https://api.assembla.com/v1',
      endpoints: {
        spaces: '/spaces',
        repositories: '/spaces/{space_id}/repositories',
        commits: '/spaces/{space_id}/repositories/{repo_id}/commits'
      }
    }
  },
  
  sourceforge: {
    id: 'sourceforge',
    name: 'Sourceforge',
    logo: '/images/logo_sourceforge.png',
    color: '#ff6600',
    oauth: {
      authUrl: 'https://sourceforge.net/auth/',
      tokenUrl: 'https://sourceforge.net/auth/oauth/token',
      clientId: import.meta.env.VITE_SOURCEFORGE_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_SOURCEFORGE_REDIRECT_URI || 'http://localhost:3000/oauth/callback/sourceforge',
      scopes: ['read']
    }
  },
  
  projectlocker: {
    id: 'projectlocker',
    name: 'ProjectLocker',
    logo: '/images/logo_projectlocker.png',
    color: '#0099cc',
    oauth: {
      authUrl: 'https://projectlocker.com/oauth/authorize',
      tokenUrl: 'https://projectlocker.com/oauth/token',
      clientId: import.meta.env.VITE_PROJECTLOCKER_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_PROJECTLOCKER_REDIRECT_URI || 'http://localhost:3000/oauth/callback/projectlocker',
      scopes: ['read']
    }
  },
  
  gitlab: {
    id: 'gitlab',
    name: 'GitLab',
    logo: '/images/logo_gitlab.png',
    color: '#fc6d26',
    oauth: {
      authUrl: 'https://gitlab.com/oauth/authorize',
      tokenUrl: 'https://gitlab.com/oauth/token',
      clientId: import.meta.env.VITE_GITLAB_CLIENT_ID || 'mock_client_id',
      redirectUri: import.meta.env.VITE_GITLAB_REDIRECT_URI || 'http://localhost:3000/oauth/callback/gitlab',
      scopes: ['read_repository', 'read_user', 'read_api']
    },
    api: {
      baseUrl: 'https://gitlab.com/api/v4',
      endpoints: {
        user: '/user',
        projects: '/projects',
        commits: '/projects/{id}/repository/commits',
        languages: '/projects/{id}/languages'
      }
    }
  }
};

export default repositoryProviders;