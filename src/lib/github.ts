// GitHub API 클라이언트
export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch?: string;
}

export interface GitHubFile {
  path: string;
  content: string;
  message: string;
  sha?: string;
}

export interface GitHubUploadResponse {
  content: {
    sha: string;
    path: string;
    html_url: string;
  };
  commit: {
    sha: string;
    message: string;
  };
}

export interface GitHubVerifyResponse {
  valid: boolean;
  error?: string;
  repoInfo?: {
    name: string;
    full_name: string;
    private: boolean;
    default_branch: string;
  };
}

class GitHubAPI {
  private baseUrl = 'https://api.github.com';

  async verifyRepository(config: GitHubConfig): Promise<GitHubVerifyResponse> {
    const { token, owner, repo } = config;
    
    try {
      const url = `${this.baseUrl}/repos/${owner}/${repo}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (!response.ok) {
        if (response.status === 404) {
          return {
            valid: false,
            error: `저장소를 찾을 수 없습니다: ${owner}/${repo}`
          };
        } else if (response.status === 401) {
          return {
            valid: false,
            error: '인증 실패. GitHub Access Token을 확인해주세요.'
          };
        } else {
          return {
            valid: false,
            error: `저장소 접근 실패 (${response.status})`
          };
        }
      }

      const repoData = await response.json();
      return {
        valid: true,
        repoInfo: {
          name: repoData.name,
          full_name: repoData.full_name,
          private: repoData.private,
          default_branch: repoData.default_branch,
        }
      };
    } catch (error) {
      return {
        valid: false,
        error: error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'
      };
    }
  }

  async uploadFile(config: GitHubConfig, file: GitHubFile): Promise<GitHubUploadResponse> {
    const { token, owner, repo, branch = 'master' } = config;
    
    try {
      // Base64 encode the content
      const content = btoa(unescape(encodeURIComponent(file.content)));
      
      const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${file.path}`;
      console.log('GitHub API Request:', { url, owner, repo, path: file.path, branch });
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: file.message,
          content,
          branch,
          ...(file.sha && { sha: file.sha })
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        console.error('GitHub API Error:', {
          status: response.status,
          statusText: response.statusText,
          url,
          errorData
        });
        
        let errorMessage = `GitHub API error (${response.status}): `;
        
        if (response.status === 404) {
          errorMessage += `저장소를 찾을 수 없습니다. 다음을 확인해주세요:
          - Owner: ${owner}
          - Repository: ${repo}
          - 저장소가 존재하는지 확인
          - 토큰에 해당 저장소 접근 권한이 있는지 확인`;
        } else if (response.status === 401) {
          errorMessage += '인증 실패. GitHub Access Token을 확인해주세요.';
        } else if (response.status === 403) {
          errorMessage += '권한 없음. 토큰에 repo 권한이 있는지 확인해주세요.';
        } else if (response.status === 422) {
          errorMessage += '요청 데이터 오류. 브랜치명이나 파일 경로를 확인해주세요.';
        } else {
          errorMessage += errorData.message || response.statusText;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Error uploading to GitHub:', error);
      throw error;
    }
  }

  async getFile(config: GitHubConfig, path: string): Promise<{ sha: string; content: string } | null> {
    const { token, owner, repo, branch = 'main' } = config;
    
    try {
      const url = `${this.baseUrl}/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
      const response = await fetch(url, {
        headers: {
          'Authorization': `token ${token}`,
          'Accept': 'application/vnd.github.v3+json',
        },
      });

      if (response.status === 404) {
        return null; // 파일이 존재하지 않음
      }

      if (!response.ok) {
        throw new Error(`Failed to get file: ${response.statusText}`);
      }

      const data = await response.json();
      return {
        sha: data.sha,
        content: atob(data.content.replace(/\s/g, '')) // Base64 디코딩
      };
    } catch (error) {
      console.error('Error getting file from GitHub:', error);
      return null;
    }
  }
}

export const githubAPI = new GitHubAPI();
