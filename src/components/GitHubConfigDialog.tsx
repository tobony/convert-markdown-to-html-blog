import React, { useState, useRef, useEffect } from 'react';
import { useGitHubConfig } from '../hooks/use-github-config';

interface GitHubConfigDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

const GitHubConfigDialog: React.FC<GitHubConfigDialogProps> = ({ isOpen, onClose }) => {
  const { settings, saveSettings } = useGitHubConfig();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    enabled: settings.enabled,
    token: settings.token,
    owner: settings.owner,
    repo: settings.repo,
    branch: settings.branch,
  });

  // 다이얼로그가 열릴 때마다 최신 설정으로 formData 동기화
  useEffect(() => {
    if (isOpen) {
      setFormData({
        enabled: settings.enabled,
        token: settings.token,
        owner: settings.owner,
        repo: settings.repo,
        branch: settings.branch,
      });
    }
  }, [isOpen, settings]);

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

  // 설정 내보내기 (백업)
  const handleExportSettings = () => {
    const now = new Date();
    const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
    const filename = `github-config-backup-${timestamp}.json`;
    
    const configData = {
      version: '1.0',
      exportDate: now.toISOString(),
      settings: {
        enabled: formData.enabled,
        token: formData.token,
        owner: formData.owner,
        repo: formData.repo,
        branch: formData.branch,
      }
    };

    const blob = new Blob([JSON.stringify(configData, null, 2)], { 
      type: 'application/json' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    alert(`설정이 ${filename} 파일로 내보내졌습니다.`);
  };

  // 설정 가져오기 (복원)
  const handleImportSettings = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const configData = JSON.parse(content);
        
        // 파일 검증
        if (!configData.settings || !configData.version) {
          throw new Error('유효하지 않은 설정 파일 형식입니다.');
        }

        const { settings: importedSettings } = configData;
        
        // 필수 필드 검증
        if (typeof importedSettings.enabled !== 'boolean' ||
            typeof importedSettings.token !== 'string' ||
            typeof importedSettings.owner !== 'string' ||
            typeof importedSettings.repo !== 'string' ||
            typeof importedSettings.branch !== 'string') {
          throw new Error('설정 파일의 데이터 형식이 올바르지 않습니다.');
        }

        // 설정 적용
        setFormData({
          enabled: importedSettings.enabled,
          token: importedSettings.token,
          owner: importedSettings.owner,
          repo: importedSettings.repo,
          branch: importedSettings.branch,
        });

        alert('설정이 성공적으로 가져와졌습니다.');
      } catch (error) {
        console.error('설정 가져오기 실패:', error);
        alert(`설정 가져오기 실패: ${error instanceof Error ? error.message : '알 수 없는 오류'}`);
      }
    };
    
    reader.readAsText(file);
    // 같은 파일을 다시 선택할 수 있도록 value 초기화
    event.target.value = '';
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
          <div className="github-config-field github-config-header-row">
            <label className="github-config-enable-label">
              <input
                type="checkbox"
                checked={formData.enabled}
                onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
              />
              GitHub 연동 활성화
            </label>
            <div className="github-config-header-buttons">
              <button className="github-config-btn-cancel" onClick={handleCancel}>
                취소
              </button>
              <button className="github-config-btn-save" onClick={handleSave}>
                저장
              </button>
            </div>
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
          )}        </div>
        
        <div className="github-config-footer">
          <div className="github-config-backup-actions">
            <button 
              className="github-config-btn-backup" 
              onClick={handleExportSettings}
              type="button"
            >
              📁 설정 내보내기
            </button>
            <button 
              className="github-config-btn-restore" 
              onClick={handleImportSettings}
              type="button"
            >
              📂 설정 가져오기
            </button>
          </div>
        </div>
          {/* 숨겨진 파일 입력 요소 */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".json"
          onChange={handleFileImport}
          className="github-config-file-input"
          aria-label="설정 파일 선택"
        />
      </div>
    </div>
  );
};

export default GitHubConfigDialog;
