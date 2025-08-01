import { useState, useEffect } from 'react';

export interface GitHubSettings {
  enabled: boolean;
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

const DEFAULT_SETTINGS: GitHubSettings = {
  enabled: true, // 기본적으로 GitHub 연동 활성화
  token: '',
  owner: '',
  repo: '',
  branch: 'master', // 기본 브랜치 설정
};

const STORAGE_KEY = 'github-config';

export const useGitHubConfig = () => {
  const [settings, setSettings] = useState<GitHubSettings>(DEFAULT_SETTINGS);
  // localStorage에서 설정 로드
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        const mergedSettings = { ...DEFAULT_SETTINGS, ...parsed };
        console.log('GitHub 설정 로드됨:', mergedSettings);
        setSettings(mergedSettings);
      } else {
        console.log('GitHub 설정 없음, 기본값 사용:', DEFAULT_SETTINGS);
        setSettings(DEFAULT_SETTINGS);
      }
    } catch (error) {
      console.error('Failed to load GitHub config:', error);
      setSettings(DEFAULT_SETTINGS);
    }
  }, []);
  // 설정 저장
  const saveSettings = (newSettings: GitHubSettings) => {
    try {
      console.log('GitHub 설정 저장:', newSettings);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
      setSettings(newSettings);
    } catch (error) {
      console.error('Failed to save GitHub config:', error);
    }
  };

  // 설정이 완료되었는지 확인
  const isConfigured = () => {
    return settings.enabled && 
           settings.token.trim() !== '' && 
           settings.owner.trim() !== '' && 
           settings.repo.trim() !== '';
  };

  // 현재 설정 반환 (유효한 경우에만)
  const getConfig = () => {
    if (!isConfigured()) return null;
    return {
      token: settings.token,
      owner: settings.owner,
      repo: settings.repo,
      branch: settings.branch || 'master', // 기본 브랜치 설정
    };
  };

  return {
    settings,
    saveSettings,
    isConfigured,
    getConfig,
  };
};
