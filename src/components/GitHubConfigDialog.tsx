import React, { useState } from 'react';
import { useGitHubConfig } from '../hooks/use-github-config';

interface GitHubConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GitHubConfigDialog: React.FC<GitHubConfigDialogProps> = ({ isOpen, onClose }) => {
  const { settings, saveSettings } = useGitHubConfig();
  const [formData, setFormData] = useState({
    enabled: settings.enabled,
    token: settings.token,
    owner: settings.owner,
    repo: settings.repo,
    branch: settings.branch,
  });

  const handleSave = () => {
    saveSettings(formData);
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      enabled: settings.enabled,
      token: settings.token,
      owner: settings.owner,
      repo: settings.repo,
      branch: settings.branch,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="github-config-overlay">
      <div className="github-config-dialog">
        <div className="github-config-header">
          <h2>GitHub 저장소 설정</h2>
          <button className="github-config-close" onClick={handleCancel}>×</button>
        </div>
        
        <div className="github-config-content">
          <div className="github-config-field">
            <label>
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              GitHub 연동 활성화
            </label>
          </div>

          {formData.enabled && (
            <>
              <div className="github-config-field">
                <label htmlFor="token">Access Token</label>
                <input
                  id="token"
                  type="password"
                  value={formData.token}
                  onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                  placeholder="ghp_xxxxxxxxxxxx"
                />
                <small>GitHub Personal Access Token (repo 권한 필요)</small>
              </div>

              <div className="github-config-field">
                <label htmlFor="owner">Owner</label>
                <input
                  id="owner"
                  type="text"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  placeholder="your-username"
                />
                <small>GitHub 사용자명 또는 조직명</small>
              </div>

              <div className="github-config-field">
                <label htmlFor="repo">Repository</label>
                <input
                  id="repo"
                  type="text"
                  value={formData.repo}
                  onChange={(e) => setFormData({ ...formData, repo: e.target.value })}
                  placeholder="my-docs"
                />
                <small>저장소 이름</small>
              </div>

              <div className="github-config-field">
                <label htmlFor="branch">Branch</label>
                <input
                  id="branch"
                  type="text"
                  value={formData.branch}
                  onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                  placeholder="master"
                />
                <small>브랜치명 (일반적으로 main 또는 master이나 StackEdit를 사용시 master를 추천)</small>
              </div>

              <div className="github-config-guide">
                <h4>GitHub Access Token 생성 방법:</h4>
                <ol>
                  <li>GitHub Settings → Developer settings → Personal access tokens</li>
                  <li>"Generate new token" 클릭</li>
                  <li>"repo" 권한 선택</li>
                  <li>생성된 토큰을 위에 입력</li>
                </ol>
              </div>
            </>
          )}
        </div>

        <div className="github-config-footer">
          <button className="github-config-btn-cancel" onClick={handleCancel}>
            취소
          </button>
          <button className="github-config-btn-save" onClick={handleSave}>
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default GitHubConfigDialog;
