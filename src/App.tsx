import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
// highlight.js 최적화: 코어만 임포트하고 필요한 언어만 추가
import hljs from "highlight.js/lib/core";
// GitHub 연동 관련 import
import { useGitHubConfig } from "./hooks/use-github-config";
import { githubAPI } from "./lib/github";
import GitHubConfigDialog from "./components/GitHubConfigDialog";
// 일반적으로 많이 사용되는 언어만 임포트
import javascript from "highlight.js/lib/languages/javascript";
import typescript from "highlight.js/lib/languages/typescript";
import css from "highlight.js/lib/languages/css";
import html from "highlight.js/lib/languages/xml"; // HTML은 XML로 처리됨
import markdown from "highlight.js/lib/languages/markdown";
import json from "highlight.js/lib/languages/json";
import bash from "highlight.js/lib/languages/bash";
import python from "highlight.js/lib/languages/python";

// 필요한 언어만 등록
hljs.registerLanguage("javascript", javascript);
hljs.registerLanguage("js", javascript); // javascript 별칭
hljs.registerLanguage("typescript", typescript);
hljs.registerLanguage("ts", typescript); // typescript 별칭
hljs.registerLanguage("css", css);
hljs.registerLanguage("html", html);
hljs.registerLanguage("xml", html); // html은 xml로 등록됨
hljs.registerLanguage("markdown", markdown);
hljs.registerLanguage("md", markdown); // markdown 별칭
hljs.registerLanguage("json", json);
hljs.registerLanguage("bash", bash);
hljs.registerLanguage("sh", bash); // bash 별칭
hljs.registerLanguage("python", python);
hljs.registerLanguage("py", python); // python 별칭

import "highlight.js/styles/github.css"; // 라이트 모드용 스타일
import "./App.css";
import appCss from "./App.css?inline";

// marked 설정 초기화
marked.use(
  markedHighlight({
    highlight: (code, lang) => {
      // 코드의 앞뒤 공백을 제거하여 첫 번째 줄 공백 문제 해결
      const trimmedCode = code.trim();
      
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(trimmedCode, { language: lang }).value;
      }
      // 언어를 지정하지 않은 경우 등록된 언어 중에서 가장 적합한 것을 선택
      // 자동 감지 기능 대신 등록된 언어만 사용
      return hljs.highlightAuto(trimmedCode, hljs.listLanguages()).value;
    }
  }),
  {
    gfm: true, // GitHub Flavored Markdown 활성화
    breaks: true, // 줄바꿈 인식
    pedantic: false
    // headerIds, smartLists, smartypants, and mangle removed as they're not valid properties in MarkedExtension type
  }
);

// 모든 링크가 새 탭에서 열리도록 설정
marked.use({
  renderer: {
    link: (token) => {
      const href = token.href || '';
      const title = token.title ? ` title="${token.title}"` : '';
      const text = token.text || '';
      return `<a href="${href}"${title} target="_blank" rel="noopener noreferrer">${text}</a>`;
    }
  }
});

function App() {  const [markdown, setMarkdown] = useState("");
  const [userCss, setUserCss] = useState("");
  const [leftTab, setLeftTab] = useState<'markdown' | 'css'>("markdown");
  const [tab, setTab] = useState<'html_output' | 'html_code'>("html_output");
  const [withoutStyle, setWithoutStyle] = useState(false); // 기본값을 false로 변경 (스타일 포함)
  const [bloggerCodeblock, setBloggerCodeblock] = useState(false); // 기본값을 false로 변경 (prettyprint 미적용)
  const [applyUserCss, setApplyUserCss] = useState(true); // New state for applying user CSS
  const [removeCitations, setRemoveCitations] = useState(false); // New state for removing citations
  const [toggleFunction, setToggleFunction] = useState(true); // New toggle function state - 기본 활성화
  const [functionCheckbox1, setFunctionCheckbox1] = useState(false);
  const [functionCheckbox2, setFunctionCheckbox2] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // 복사 완료 상태 관리
  const [isCopyAllTogglesCopied, setIsCopyAllTogglesCopied] = useState(false); // Copy All Toggles 복사 완료 상태 관리
  const htmlOutputRef = useRef<HTMLDivElement>(null); // Ref for the HTML output div
  const markdownTextareaRef = useRef<HTMLTextAreaElement>(null); // Ref for the markdown textarea  // GitHub 연동 관련 상태
  const { getConfig, isConfigured, saveSettings } = useGitHubConfig();
  const [isUploading, setIsUploading] = useState(false);
  const [showGitHubConfig, setShowGitHubConfig] = useState(false);

  // 전역 설정 함수를 window 객체에 추가 (개발자 도구에서 사용 가능)
  useEffect(() => {
    (window as any).setGitHubConfig = (config: {
      token: string;
      owner: string;
      repo: string;
      branch?: string;
    }) => {
      saveSettings({
        enabled: true,
        token: config.token,
        owner: config.owner,
        repo: config.repo,
        branch: config.branch || 'main',
      });
      console.log('GitHub 설정이 저장되었습니다:', config);
    };

    (window as any).getGitHubConfig = () => {
      const config = getConfig();
      console.log('현재 GitHub 설정:', config);
      return config;
    };

    console.log(`
🚀 GitHub 연동 설정 방법:

1. GitHub Personal Access Token 생성:
   - GitHub Settings → Developer settings → Personal access tokens
   - "repo" 권한 선택하여 토큰 생성

2. 다음 명령어로 설정 (개발자 도구 콘솔에서):
   setGitHubConfig({
     token: "your_github_token",
     owner: "your_username",
     repo: "your_repository",
     branch: "main"
   });

3. 설정 확인:
   getGitHubConfig();

4. 설정 완료 후 "repo파일추가" 버튼 사용 가능
`);
  }, [saveSettings, getConfig]);

  // 자동 생성된 CSS를 제거하는 함수
  const removeAutoGeneratedCss = (cssText: string): string => {
    return cssText.replace(/\/\* AUTO-GENERATED: Text Color \*\/[\s\S]*?\/\* END AUTO-GENERATED \*\/\n?/g, '');
  };  // 색상 CSS를 업데이트하는 함수
  const updateUserCssWithColor = (color: string | null) => {
    setUserCss(prevCss => {
      let cleanedCss = removeAutoGeneratedCss(prevCss);
      
      if (color) {
        const colorCss = `/* AUTO-GENERATED: Text Color */
.blogger-html-body p,
.html-output p,
.blogger-html-body li,
.html-output li,
.blogger-html-body blockquote,
.html-output blockquote {
  color: ${color} !important;
}

/* 제목과 강조 요소들은 원래 색상 유지 */
.blogger-html-body h1,
.blogger-html-body h2,
.blogger-html-body h3,
.blogger-html-body h4,
.blogger-html-body h5,
.blogger-html-body h6,
.html-output h1,
.html-output h2,
.html-output h3,
.html-output h4,
.html-output h5,
.html-output h6 {
  color: #0f0f0f !important;
}

.blogger-html-body strong,
.blogger-html-body em,
.blogger-html-body code,
.blogger-html-body pre,
.html-output strong,
.html-output em,
.html-output code,
.html-output pre {
  color: inherit !important;
}

.blogger-html-body a,
.html-output a {
  color: #646cff !important;
}

.blogger-html-body a:hover,
.html-output a:hover {
  color: #535bf2 !important;
}

/* p, li, blockquote 내부의 강조 요소들도 명시적으로 처리 */
.blogger-html-body p strong,
.blogger-html-body p em,
.blogger-html-body p code,
.blogger-html-body li strong,
.blogger-html-body li em,
.blogger-html-body li code,
.blogger-html-body blockquote strong,
.blogger-html-body blockquote em,
.blogger-html-body blockquote code,
.html-output p strong,
.html-output p em,
.html-output p code,
.html-output li strong,
.html-output li em,
.html-output li code,
.html-output blockquote strong,
.html-output blockquote em,
.html-output blockquote code {
  color: inherit !important;
}

.blogger-html-body p a,
.blogger-html-body li a,
.blogger-html-body blockquote a,
.html-output p a,
.html-output li a,
.html-output blockquote a {
  color: #646cff !important;
}

.blogger-html-body p a:hover,
.blogger-html-body li a:hover,
.blogger-html-body blockquote a:hover,
.html-output p a:hover,
.html-output li a:hover,
.html-output blockquote a:hover {
  color: #535bf2 !important;
}
/* END AUTO-GENERATED */\n`;
        
        // 기존 CSS가 있으면 줄바꿈 추가
        if (cleanedCss.trim()) {
          cleanedCss += '\n' + colorCss;
        } else {
          cleanedCss = colorCss;
        }
      }
      
      return cleanedCss;
    });
  };  // 체크박스 상태 변화 감지 및 CSS 업데이트
  useEffect(() => {
    console.log('체크박스 상태 변화:', { functionCheckbox1, functionCheckbox2 });
    if (functionCheckbox1) {
      console.log('CustomStyle2 적용: #0f0f0f');
      updateUserCssWithColor('#0f0f0f');
    } else if (functionCheckbox2) {
      console.log('CustomStyle1 적용: #606060');
      updateUserCssWithColor('#606060');
    } else {
      console.log('스타일 해제');
      updateUserCssWithColor(null);
    }  }, [functionCheckbox1, functionCheckbox2]);  // HTML Output에 동적 스타일 적용
  useEffect(() => {
    console.log('🎯 useEffect 실행됨:', { 
      tab, 
      functionCheckbox1, 
      functionCheckbox2,
      toggleFunction,
      timestamp: new Date().toISOString()
    });

    if (tab !== 'html_output') {
      console.log('❌ HTML Output 탭이 아니므로 색상 적용하지 않음');
      return;
    }

    const outputDiv = document.querySelector('.html-output');
    if (!outputDiv) {
      console.log('❌ .html-output 요소를 찾을 수 없음');
      return;
    }

    // 색상 결정
    let targetColor = '#0f0f0f'; // 기본 색상
    if (functionCheckbox1) {
      targetColor = '#0f0f0f'; // CustomStyle2 - 어두운 색
      console.log('✅ CustomStyle2 적용: #0f0f0f (어두운 색)');
    } else if (functionCheckbox2) {
      targetColor = '#606060'; // CustomStyle1 - 회색
      console.log('✅ CustomStyle1 적용: #606060 (회색)');
    } else {
      console.log('✅ 기본 색상 적용: #0f0f0f');
    }

    // CSS 변수 업데이트 (기존 CSS가 var(--dynamic-text-color)를 사용하고 있음)
    const rootElement = document.documentElement;
    rootElement.style.setProperty('--dynamic-text-color', targetColor);
    console.log(`🎨 CSS 변수 --dynamic-text-color 업데이트: ${targetColor}`);

    // 추가적으로 인라인 스타일도 적용 (더 확실한 적용을 위해)
    // 대상 요소들 (본문 텍스트)
    const targetElements = outputDiv.querySelectorAll('p, li, blockquote');
    console.log(`🎯 대상 요소 수: ${targetElements.length}개`);

    // 제외할 요소들 (헤딩, 강조, 코드)
    const excludeElements = outputDiv.querySelectorAll('h1, h2, h3, h4, h5, h6, strong, em, code, pre');
    console.log(`🚫 제외 요소 수: ${excludeElements.length}개`);

    // 링크 요소들
    const linkElements = outputDiv.querySelectorAll('a');
    console.log(`🔗 링크 요소 수: ${linkElements.length}개`);

    // 대상 요소들에 색상 적용
    targetElements.forEach((element, index) => {
      (element as HTMLElement).style.setProperty('color', targetColor, 'important');
      if (index < 3) { // 처음 3개만 로그
        console.log(`✅ 요소 ${index + 1} 색상 적용:`, {
          tagName: element.tagName,
          color: targetColor,
          element: element
        });
      }
    });

    // 제외 요소들은 기본 색상으로 설정
    excludeElements.forEach((element, index) => {
      (element as HTMLElement).style.setProperty('color', '#0f0f0f', 'important');
      if (index < 3) { // 처음 3개만 로그
        console.log(`🚫 제외 요소 ${index + 1} 기본 색상 유지:`, {
          tagName: element.tagName,
          color: '#0f0f0f'
        });
      }
    });

    // 링크는 항상 파란색 유지 - 단, Toggle More/Less가 활성화된 경우에만 강제 적용
    if (toggleFunction) {
      linkElements.forEach((element, index) => {
        (element as HTMLElement).style.setProperty('color', '#646cff', 'important');
        if (index < 3) { // 처음 3개만 로그
          console.log(`🔗 링크 ${index + 1} 파란색 강제 적용 (Toggle 활성화):`, {
            color: '#646cff',
            href: element.getAttribute('href')
          });
        }
      });
    } else {
      // Toggle More/Less가 비활성화된 경우, 링크의 인라인 스타일 제거하여 CSS 기본값 사용
      linkElements.forEach((element, index) => {
        (element as HTMLElement).style.removeProperty('color');
        if (index < 3) { // 처음 3개만 로그
          console.log(`🔗 링크 ${index + 1} 기본 CSS 색상 사용 (Toggle 비활성화):`, {
            href: element.getAttribute('href')
          });
        }
      });
    }

    console.log('🎨 색상 적용 완료:', {
      targetColor,
      cssVariable: targetColor,
      targetElementsCount: targetElements.length,
      excludeElementsCount: excludeElements.length,
      linkElementsCount: linkElements.length,
      toggleFunction
    });

  }, [functionCheckbox1, functionCheckbox2, markdown, removeCitations, tab, toggleFunction]);

  // Toggle More/Less 기능은 인라인 onclick으로 처리되므로 별도의 React useEffect 불필요

  // Load sample.md content when the component mounts
  useEffect(() => {
    const loadSampleMarkdown = async () => {
      try {
        // Use the fetch API to get the sample.md content
        const response = await fetch('/sample.md');
        if (response.ok) {
          const content = await response.text();
          setMarkdown(content);
        } else {
          console.error('Failed to load sample.md');
        }
      } catch (error) {
        console.error('Error loading sample markdown:', error);
      }
    };

    // Only load if markdown is empty (first run)
    if (!markdown) {
      loadSampleMarkdown();
    }
  }, []);

  // Process markdown based on removeCitations state
  let processedMarkdown = markdown;
  if (removeCitations) {
    // Remove [1][2]... style citations
    processedMarkdown = processedMarkdown.replace(/(\[\d+\])+/g, ''); // Corrected regex
    // Remove "Citations:" section and everything after it
    processedMarkdown = processedMarkdown.replace(/^Citations:[\s\S]*?(\n\s*\n|$)/gm, ''); // Refined regex to be less greedy
    // Remove any leading/trailing newlines that might be left
    processedMarkdown = processedMarkdown.trim();
  }
  
  // Process markdown based on toggleFunction state
  if (toggleFunction) {
    console.log('🔄 Toggle More/Less 기능 활성화됨');
    console.log('📝 처리 전 마크다운 길이:', processedMarkdown.length);
    console.log('🔍 <!-- MORE --> 포함 여부:', processedMarkdown.includes('<!-- MORE -->'));
    
    // <!-- MORE --> 패턴의 위치 찾기 (대소문자 구분 없음)
    const matches = processedMarkdown.match(/<!--\s*more\s*-->/gi);
    if (matches) {
      console.log('🎯 발견된 <!-- MORE --> 개수:', matches.length);
    }
    
    // Convert sections marked with <!-- MORE --> to collapsible sections
    // 대소문자 구분 없이 처리하고, 앞뒤 공백과 줄바꿈을 유연하게 처리
    const beforeReplace = processedMarkdown;
    let replaceCount = 0;
    
    processedMarkdown = processedMarkdown.replace(
      /<!--\s*more\s*-->\s*([\s\S]*?)\s*<!--\s*more\s*-->/gi,
      (match, content) => {
        replaceCount++;
        console.log(`✅ ${replaceCount}번째 <!-- MORE --> 패턴 매칭됨:`, {
          matchLength: match.length,
          contentPreview: content.substring(0, 100) + (content.length > 100 ? '...' : ''),
          contentLength: content.length
        });
        
        const trimmedContent = content.trim();
        // 고유한 ID 생성 (timestamp + 카운터 사용)
        const uniqueId = `more${Date.now()}_${replaceCount}`;
        const result = `\n\n<div id="toggle${uniqueId}"><span id="${uniqueId}" style="cursor: pointer; color: #646cff; text-decoration: underline;" onclick="var content=document.getElementById('story${uniqueId}'); if(!content) return; if(content.style.display=='none' || content.style.display=='') {content.style.display='block'; this.innerText='[접기]'} else {content.style.display='none'; this.innerText='[펼치기]'}">[펼치기]</span><button onclick="navigator.clipboard.writeText(document.getElementById('toggle${uniqueId}').outerHTML).then(() => {this.textContent='복사됨!'; setTimeout(() => this.textContent='Copy', 1000);}).catch(err => {})" style="margin-left: 8px; padding: 4px 8px; background: transparent; border: none; cursor: pointer; font-size: 12px; color: #646cff; font-weight: bold;" title="HTML 코드 복사">Copy</button>\n<div id="story${uniqueId}" style="display: none">\n\n${trimmedContent}\n\n</div></div>\n\n`;
        
        console.log('🔄 변환 결과 길이:', result.length);
        return result;
      }
    );
    
    console.log('📊 변환 통계:', {
      변환전길이: beforeReplace.length,
      변환후길이: processedMarkdown.length,
      변환횟수: replaceCount,
      변환여부: beforeReplace !== processedMarkdown
    });
    
    if (beforeReplace === processedMarkdown) {
      console.log('❌ <!-- MORE --> 패턴이 매칭되지 않음');
      // 첫 번째 <!-- MORE --> 위치 찾기
      const firstIndex = processedMarkdown.toLowerCase().indexOf('<!-- more -->');
      if (firstIndex !== -1) {
        console.log('🔍 첫 번째 <!-- MORE --> 위치:', firstIndex);
        console.log('📝 주변 텍스트:', processedMarkdown.substring(Math.max(0, firstIndex - 50), firstIndex + 100));
      }
    } else {
      console.log('✅ <!-- MORE --> 패턴 변환 완료');
    }
  }

  // 기본 HTML 생성 - 이 HTML은 "HTML Output" 탭에 표시됨
  const html = marked.parse(processedMarkdown);
  
  // "HTML Code" 탭용 HTML 생성 - 체크박스 상태에 따라 다른 HTML 생성
  let bloggerHtml = '';
  
  // Toggle More/Less 기능용 CSS 및 JavaScript - 간단한 인라인 방식 사용으로 별도 assets 불필요
  const toggleMoreLessAssets = '';
  
  if (withoutStyle) {
    // 스타일 없이 HTML만 포함
    bloggerHtml = `<div class="blogger-html-body">\n${html}\n</div>${toggleMoreLessAssets}`;
  } else {
    // 스타일 포함
    let effectiveStyles = appCss; // Start with base app CSS
    if (applyUserCss) { // Conditionally add userCss if applyUserCss is true
      effectiveStyles += `\n${userCss}`;
    }
    bloggerHtml = `\n<style>\n${effectiveStyles}\n</style>\n<div class="blogger-html-body">\n${html}\n</div>${toggleMoreLessAssets}`;
  }
  
  // Blogger 코드블록 기능 적용 (HTML Code 탭에만 영향)
  if (bloggerCodeblock) {
    // <pre><code> 태그에 prettyprint 클래스 추가
    bloggerHtml = bloggerHtml
      // 언어가 지정된 코드블록
      .replace(
        /<pre><code class="language-([^"]+)">/g, 
        '<pre class="prettyprint"><code class="language-$1">'
      )
      // 언어가 지정되지 않은 일반 코드블록
      .replace(
        /<pre><code>/g, 
        '<pre class="prettyprint"><code>'
      );
  }

  const handleHtmlOutputKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if ((event.ctrlKey || event.metaKey) && event.key === 'a') {
      event.preventDefault();
      if (htmlOutputRef.current) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(htmlOutputRef.current);
        if (selection) {
          selection.removeAllRanges();
          selection.addRange(range);
        }
      }
    }
  };  // 파일명 자동 생성 함수
  const generateFileName = () => {
    // 현재 날짜를 YYMMDD 형식으로 포맷
    const now = new Date();
    const year = now.getFullYear().toString().slice(-2); // 25
    const month = (now.getMonth() + 1).toString().padStart(2, '0'); // 06
    const day = now.getDate().toString().padStart(2, '0'); // 22
    const datePrefix = `${year}${month}${day}`; // 250622
    
    // 마크다운에서 첫 번째 h1 헤더 추출
    let h1Match = markdown.match(/^#\s+(.+)$/m);
    let title = 'document';
    let headerSource = 'default';
    
    if (h1Match && h1Match[1]) {
      // H1 헤더가 있는 경우
      title = h1Match[1].trim();
      headerSource = 'h1';
    } else {
      // H1이 없으면 H2 헤더 검색
      const h2Match = markdown.match(/^##\s+(.+)$/m);
      if (h2Match && h2Match[1]) {
        title = h2Match[1].trim();
        headerSource = 'h2';
      }
    }
    
    // 제목이 기본값이 아닌 경우 파일명에 적합하게 정리
    if (title !== 'document') {
      title = title
        .slice(0, 35) // 35자까지 제한 (기존 20자에서 확장)
        .replace(/[<>:"/\\|?*]/g, '') // 파일명에 사용할 수 없는 특수문자 제거
        .replace(/\s+/g, '_') // 공백을 언더스코어로 변경
        .replace(/[^\w가-힣]/g, '') // 영문, 숫자, 한글, 언더스코어만 허용
        || 'document'; // 빈 문자열인 경우 기본값 사용
    }
    
    const fileName = `${datePrefix}_${title}.md`;
    
    // 디버깅 로그 추가
    console.log(`파일명 생성:`, {
      headerSource,
      originalTitle: h1Match?.[1] || (markdown.match(/^##\s+(.+)$/m)?.[1]) || 'none',
      processedTitle: title,
      fileName
    });
    
    return fileName;
  };

  // 기능 버튼 핸들러들
  const handleFunction1 = () => {
    // 마크다운 텍스트 영역 내용 전체 삭제
    setMarkdown("");
  };

  // MORE 주석 삽입 핸들러
  const handleInsertMore = () => {
    if (markdownTextareaRef.current) {
      const textarea = markdownTextareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const currentValue = textarea.value;
      
      // 커서 위치에 <!-- MORE --> 삽입
      const moreComment = '<!-- MORE -->';
      const newValue = currentValue.slice(0, start) + moreComment + currentValue.slice(end);
      
      setMarkdown(newValue);
      
      // 포커스를 다시 설정하고 커서를 <!-- MORE --> 뒤로 이동
      setTimeout(() => {
        textarea.focus();
        const newCursorPosition = start + moreComment.length;
        textarea.setSelectionRange(newCursorPosition, newCursorPosition);
      }, 0);
    }
  };
  const handleFunction3 = async () => {
    // GitHub 파일 업로드 기능
    if (!isConfigured()) {
      // GitHub 설정이 되어 있지 않으면 설정 다이얼로그를 바로 열기
      setShowGitHubConfig(true);
      return;
    }

    const fileName = generateFileName();
    const shouldUpload = window.confirm(
      `다음 파일명으로 GitHub에 업로드하시겠습니까?\n\n파일명: ${fileName}\n\n업로드할 내용:\n${markdown.substring(0, 100)}${markdown.length > 100 ? '...' : ''}`
    );
    
    if (!shouldUpload) return;

    setIsUploading(true);
    try {
      const config = getConfig();
      if (!config) {
        throw new Error('GitHub 설정을 불러올 수 없습니다.');
      }

      // 먼저 저장소 연결 상태 확인
      const verifyResult = await githubAPI.verifyRepository(config);
      if (!verifyResult.valid) {
        throw new Error(verifyResult.error || '저장소 연결 실패');
      }

      // 파일 존재 여부 확인
      const existingFile = await githubAPI.getFile(config, fileName);
      
      if (existingFile) {
        const shouldOverwrite = window.confirm(
          `파일 "${fileName}"이(가) 이미 존재합니다. 덮어쓰시겠습니까?`
        );
        if (!shouldOverwrite) {
          setIsUploading(false);
          return;
        }
      }

      await githubAPI.uploadFile(config, {
        path: fileName,
        content: markdown,
        message: `Add markdown file: ${fileName}`,
        sha: existingFile?.sha, // 기존 파일이 있으면 SHA 포함
      });

      alert(`업로드 완료!\n\n${fileName} 파일이 GitHub 저장소에 추가되었습니다.`);
    } catch (error) {
      console.error('GitHub upload error:', error);
      alert(`업로드 실패!\n\n${error instanceof Error ? error.message : '알 수 없는 오류가 발생했습니다.'}`);
    } finally {
      setIsUploading(false);
    }
  };  const handleFunction2 = async () => {
    try {
      if (tab === 'html_output') {
        // HTML Output 탭: Ctrl+A + Ctrl+C 방식으로 서식 포함 복사
        if (htmlOutputRef.current) {
          console.log('HTML Output 탭: Selection API를 사용한 복사 시작');
          
          // 요소를 포커스하여 복사 가능한 상태로 만들기
          htmlOutputRef.current.focus();
          
          // 전체 내용 선택 (Ctrl+A와 동일한 효과)
          const selection = window.getSelection();
          const range = document.createRange();
          range.selectNodeContents(htmlOutputRef.current);
          
          if (selection) {
            selection.removeAllRanges();
            selection.addRange(range);
            
            console.log('Selection 생성 완료:', {
              selectedText: selection.toString().substring(0, 100) + '...',
              rangeCount: selection.rangeCount
            });
            
            try {
              // document.execCommand('copy')를 사용하여 복사 (Ctrl+C와 동일한 효과)
              const successful = document.execCommand('copy');
              if (successful) {
                console.log('HTML Output 서식 포함 복사 완료 (Selection API)');
              } else {
                throw new Error('document.execCommand 복사 실패');
              }
            } catch (copyError) {
              console.error('Selection API 복사 실패:', copyError);
              // 최후 폴백: 현대 API 시도
              if (navigator.clipboard && navigator.clipboard.write) {
                try {
                  const htmlContent = htmlOutputRef.current.innerHTML;
                  const textContent = htmlOutputRef.current.textContent || htmlOutputRef.current.innerText || '';
                  
                  const clipboardItem = new ClipboardItem({
                    'text/html': new Blob([htmlContent], { type: 'text/html' }),
                    'text/plain': new Blob([textContent], { type: 'text/plain' })
                  });
                  
                  await navigator.clipboard.write([clipboardItem]);
                  console.log('HTML Output 복사 완료 (Clipboard API 폴백)');
                } catch (apiError) {
                  console.error('모든 복사 방법 실패:', apiError);
                  throw new Error('복사에 실패했습니다.');
                }
              } else {
                throw copyError;
              }
            } finally {
              // 선택 영역 해제
              selection.removeAllRanges();
            }
          } else {
            throw new Error('Selection 객체를 생성할 수 없습니다.');
          }
        }
      } else {
        // HTML Code 탭: 전체 HTML 코드 복사
        const contentToCopy = bloggerHtml;
        
        // 복사할 내용이 없으면 경고
        if (!contentToCopy.trim()) {
          console.warn('복사할 내용이 없습니다.');
          return;
        }
        
        // 클립보드 복사 시도 (최신 API)
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(contentToCopy);
        } else {
          // 폴백: 전통적인 방법 사용
          const textArea = document.createElement('textarea');
          textArea.value = contentToCopy;
          textArea.style.position = 'fixed';
          textArea.style.opacity = '0';
          document.body.appendChild(textArea);
          textArea.focus();
          textArea.select();
          
          try {
            const successful = document.execCommand('copy');
            if (!successful) {
              throw new Error('document.execCommand 복사 실패');
            }
          } finally {
            document.body.removeChild(textArea);
          }
        }
        
        console.log('HTML Code 복사 완료:', contentToCopy.substring(0, 100) + (contentToCopy.length > 100 ? '...' : ''));
      }
      
      // 복사 완료 상태로 변경
      setIsCopied(true);
      
      // 2초 후 원래 상태로 복원
      setTimeout(() => {
        setIsCopied(false);
      }, 2000);
      
    } catch (error) {
      console.error('클립보드 복사 실패:', error);
      // 에러 발생 시에도 사용자에게 피드백 제공
      setIsCopied(true);
      setTimeout(() => {
        setIsCopied(false);
      }, 1000);
    }
  };

  // 마크다운 다운로드 핸들러
  const downloadMarkdown = () => {
    if (!markdown.trim()) {
      alert('다운로드할 마크다운 내용이 없습니다.');
      return;
    }

    try {
      const fileName = generateFileName();
      
      // Blob 생성
      const blob = new Blob([markdown], { type: 'text/markdown;charset=utf-8' });
      
      // 다운로드 링크 생성
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      
      // 다운로드 실행
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // URL 메모리 해제
      URL.revokeObjectURL(url);
      
      console.log(`마크다운 다운로드 완료: ${fileName}`);
    } catch (error) {
      console.error('마크다운 다운로드 실패:', error);
      alert('다운로드 중 오류가 발생했습니다.');
    }
  };

  // 모든 펼치기 항목을 한꺼번에 복사하는 핸들러
  const handleCopyAllToggleItems = async () => {
    try {
      if (tab !== 'html_output') {
        console.warn('HTML Output 탭에서만 사용 가능합니다.');
        return;
      }

      // HTML Output 탭에서 실제 DOM의 모든 toggle 요소 찾기
      const htmlOutputElement = htmlOutputRef.current;
      if (!htmlOutputElement) {
        alert('HTML Output 영역을 찾을 수 없습니다.');
        return;
      }
      
      // 모든 toggle 컨테이너 찾기
      const toggleContainers = htmlOutputElement.querySelectorAll('[id^="toggle"]');
      
      if (toggleContainers.length === 0) {
        alert('복사할 펼치기 항목이 없습니다.');
        return;
      }

      console.log(`발견된 펼치기 항목 수: ${toggleContainers.length}`);

      // 첫 번째 toggle 항목을 기준으로 하되, 모든 내용을 합치기
      const firstToggle = toggleContainers[0] as HTMLElement;
      const firstToggleId = firstToggle.id;
      const firstSpanId = firstToggleId.replace('toggle', '');
      const firstStoryId = firstToggleId.replace('toggle', 'story');

      // 모든 toggle 항목의 story 내용 수집
      let combinedContent = '';
      toggleContainers.forEach((container, index) => {
        const storyElement = container.querySelector('[id^="story"]') as HTMLElement;
        if (storyElement && storyElement.innerHTML) {
          combinedContent += storyElement.innerHTML;
          // 마지막 항목이 아닌 경우 구분선 추가
          if (index < toggleContainers.length - 1) {
            combinedContent += '<hr>';
          }
        }
        console.log(`펼치기 항목 ${index + 1} 내용 추가됨`);
      });

      // 합쳐진 내용으로 새로운 toggle HTML 생성
      const combinedHtml = `<h3>참고자료</h3>
<div id="${firstToggleId}"><span id="${firstSpanId}" style="cursor: pointer; color: #646cff; text-decoration: underline;" onclick="var content=document.getElementById('${firstStoryId}'); if(!content) return; if(content.style.display=='none' || content.style.display=='') {content.style.display='block'; this.innerText='[접기]'} else {content.style.display='none'; this.innerText='[펼치기]'}">[펼치기]</span><button onclick="navigator.clipboard.writeText(document.getElementById('${firstToggleId}').outerHTML).then(() => {this.textContent='복사됨!'; setTimeout(() => this.textContent='Copy', 1000);}).catch(err => {})" style="margin-left: 8px; padding: 4px 8px; background: transparent; border: none; cursor: pointer; font-size: 12px; color: #646cff; font-weight: bold;" title="HTML 코드 복사">Copy</button>
<div id="${firstStoryId}" style="display: none">
${combinedContent}
</div></div>`;

      // 클립보드에 복사
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(combinedHtml);
      } else {
        // 폴백: 전통적인 방법 사용
        const textArea = document.createElement('textarea');
        textArea.value = combinedHtml;
        textArea.style.position = 'fixed';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (!successful) {
            throw new Error('document.execCommand 복사 실패');
          }
        } finally {
          document.body.removeChild(textArea);
        }
      }

      console.log('모든 펼치기 항목 통합 복사 완료:', {
        itemCount: toggleContainers.length,
        totalLength: combinedHtml.length,
        preview: combinedHtml.substring(0, 300) + '...'
      });

      // 복사 완료 상태로 변경
      setIsCopyAllTogglesCopied(true);
      
      // 2초 후 원래 상태로 복원
      setTimeout(() => {
        setIsCopyAllTogglesCopied(false);
      }, 2000);

    } catch (error) {
      console.error('펼치기 항목 복사 실패:', error);
      // 에러 발생 시에도 사용자에게 피드백 제공
      setIsCopyAllTogglesCopied(true);
      setTimeout(() => {
        setIsCopyAllTogglesCopied(false);
      }, 1000);
    }
  };return (
    <main className="split-container">      
      <div className="function-bar">        
        <button 
          type="button" 
          className="function-btn"
          onClick={handleFunction1}
        >
          Delete
        </button>
        <button 
          type="button" 
          className={`function-btn ${isCopied ? 'copied' : ''}`}
          onClick={handleFunction2}
        >
          {isCopied ? '복사완료' : '결과복사'}
        </button>

        <button 
          type="button" 
          className="function-btn"
          onClick={downloadMarkdown}
        >
          md다운로드
        </button>
        <button 
          type="button" 
          className={`function-btn ${isUploading ? 'uploading' : ''}`}
          onClick={handleFunction3}
          disabled={isUploading}
        >
          {isUploading ? '업로드중...' : 'mdRepo추가'}
        </button>


        <button 
          type="button" 
          className="function-btn"
          onClick={() => {
            const config = getConfig();
            if (config && config.owner && config.repo) {
              const repoUrl = `https://github.com/${config.owner}/${config.repo}`;
              window.open(repoUrl, '_blank');
            } else {
              alert('GitHub 저장소 설정이 필요합니다. 설정 버튼(⚙️)을 클릭하여 설정해주세요.');
            }
          }}
          title="GitHub 저장소로 이동"
        >
          <svg height="16" aria-hidden="true" viewBox="0 0 24 24" version="1.1" width="16" data-view-component="true" className="octicon octicon-mark-github v-align-middle">
            <path d="M12 1C5.923 1 1 5.923 1 12c0 4.867 3.149 8.979 7.521 10.436.55.096.756-.233.756-.522 0-.262-.013-1.128-.013-2.049-2.764.509-3.479-.674-3.699-1.292-.124-.317-.66-1.293-1.127-1.554-.385-.207-.936-.715-.014-.729.866-.014 1.485.797 1.691 1.128.99 1.663 2.571 1.196 3.204.907.096-.715.385-1.196.701-1.471-2.448-.275-5.005-1.224-5.005-5.432 0-1.196.426-2.186 1.128-2.956-.111-.275-.496-1.402.11-2.915 0 0 .921-.288 3.024 1.128a10.193 10.193 0 0 1 2.75-.371c.936 0 1.871.123 2.75.371 2.104-1.43 3.025-1.128 3.025-1.128.605 1.513.221 2.64.111 2.915.701.77 1.127 1.747 1.127 2.956 0 4.222-2.571 5.157-5.019 5.432.399.344.743 1.004.743 2.035 0 1.471-.014 2.654-.014 3.025 0 .289.206.632.756.522C19.851 20.979 23 16.854 23 12c0-6.077-4.922-11-11-11Z"></path>
          </svg>
        </button>

        <button 
          type="button" 
          className="function-btn"
          onClick={() => {
            const config = getConfig();
            if (config && config.owner && config.repo) {
              const stackEditUrl = `https://stackedit.io/app#providerId=githubWorkspace&owner=${config.owner}&repo=${config.repo}&branch=${config.branch || 'main'}`;
              window.open(stackEditUrl, '_blank');
            } else {
              alert('GitHub 저장소 설정이 필요합니다. 설정 버튼(⚙️)을 클릭하여 설정해주세요.');
            }
          }}
          title="StackEdit으로 편집"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink" xmlSpace="preserve" style={{fillRule:"evenodd", clipRule:"evenodd", strokeLinejoin:"round", strokeMiterlimit:"1.41421"}}>
            <path d="M23.997,6.002c0,-3.311 -2.688,-5.999 -5.999,-5.999l-11.999,0c-3.311,0 -5.999,2.688 -5.999,5.999l0,11.999c0,3.311 2.688,5.999 5.999,5.999l11.999,0c3.311,0 5.999,-2.688 5.999,-5.999l0,-11.999Z" style={{fill:"none"}}/>
            <clipPath id="_clip1">
              <path d="M23.997,6.002c0,-3.311 -2.688,-5.999 -5.999,-5.999l-11.999,0c-3.311,0 -5.999,2.688 -5.999,5.999l0,11.999c0,3.311 2.688,5.999 5.999,5.999l11.999,0c3.311,0 5.999,-2.688 5.999,-5.999l0,-11.999Z"/>
            </clipPath>
            <g clipPath="url(#_clip1)">
              <path d="M23.997,0.003l-24,0l12,12l12,-12Z" style={{fill:"#ffd700"}}/>
              <path d="M-0.003,0.003l0,24l12,-12l-12,-12Z" style={{fill:"#a5c700"}}/>
              <path d="M-0.003,24.003l24,0l-12,-12l-12,12Z" style={{fill:"#ff8a00"}}/>
              <path d="M23.997,24.003l0,-24l-12,12l12,12Z" style={{fill:"#66aefd"}}/>
            </g>
            <path d="M21.75,5.852c0,-2.195 -1.782,-3.977 -3.977,-3.977l-11.546,0c-2.195,0 -3.977,1.782 -3.977,3.977l0,11.546c0,2.195 1.782,3.977 3.977,3.977l11.546,0c2.195,0 3.977,-1.782 3.977,-3.977l0,-11.546Z" style={{fill:"#fff"}}/>
            <path d="M4.633,6.013l1.37,0l0,-1.828l1.399,0l0,1.828l1.696,0l0,-1.828l1.399,0l0,1.828l1.37,0l0,1.691l-1.37,0l0,1.902l1.37,0l0,1.69l-1.37,0l0,1.829l-1.399,0l0,-1.829l-1.696,0l0,1.829l-1.399,0l0,-1.829l-1.37,0l0,-1.69l1.37,0l0,-1.902l-1.37,0l0,-1.691Zm2.769,1.691l0,1.902l1.696,0l0,-1.902l-1.696,0Z" style={{fill:"#737373"}}/>
          </svg>
        </button>

        <button 
          type="button" 
          className="function-btn"
          onClick={() => setShowGitHubConfig(true)}
          title="GitHub 설정"
        >
          ⚙️
        </button>

        <button 
          type="button" 
          className="function-btn"
          onClick={handleInsertMore}
          title="MORE 주석 삽입"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 9V15M9 12H15M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button><label className="checkbox-label">
          <input
            type="checkbox"
            checked={functionCheckbox2}
            onChange={() => {
              setFunctionCheckbox2(!functionCheckbox2);
              if (!functionCheckbox2) {
                setFunctionCheckbox1(false); // CustomStyle1을 체크할 때 CustomStyle2는 해제
              }
            }}
          />
          Style1
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={functionCheckbox1}
            onChange={() => {
              setFunctionCheckbox1(!functionCheckbox1);
              if (!functionCheckbox1) {
                setFunctionCheckbox2(false); // CustomStyle2를 체크할 때 CustomStyle1은 해제
              }
            }}
          />
          Style2
        </label>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={toggleFunction}
            onChange={() => setToggleFunction(!toggleFunction)}
          />
          Toggle More
        </label>
      </div>

      <div className="split-panes">
        <section className="split-pane left-pane">
          <div className="tab-bar">
            <button
          className={"tab-btn" + (leftTab === "markdown" ? " active-tab" : "")}
          onClick={() => setLeftTab("markdown")}
          type="button"
            >
          Markdown
            </button>
            <button
          className={"tab-btn" + (leftTab === "css" ? " active-tab" : "")}
          onClick={() => setLeftTab("css")}
          type="button"
          >
          Custom-CSS
            </button>            {leftTab === "markdown" && (
          <div className="checkbox-container margin-left-auto">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={removeCitations}
                onChange={() => setRemoveCitations(!removeCitations)}
              />
              Remove citation
            </label>
          </div>
            )}
            {leftTab === "css" && (
          <div className="checkbox-container margin-left-auto">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={applyUserCss}
                onChange={() => setApplyUserCss(!applyUserCss)}
              />
              Apply Custom CSS
            </label>
          </div>
            )}
          </div>
          {leftTab === "markdown" ? (
            <textarea
              ref={markdownTextareaRef}
              className="markdown-input"
              value={markdown}
              onChange={e => setMarkdown(e.target.value)}
              placeholder="여기에 마크다운을 입력하세요..."
            />
          ) : (
            <textarea
              className="markdown-input custom-css custom-css-textarea"
              value={userCss}
              onChange={e => setUserCss(e.target.value)}
              placeholder="여기에 CSS를 입력하세요..."
            />
          )}
        </section>
        <section className="split-pane right-pane">
          <div className="tab-bar">
            <button
              className={"tab-btn" + (tab === "html_output" ? " active-tab" : "")}
              onClick={() => setTab("html_output")}
              type="button"
            >
              HTML Output
            </button>
            <button
              className={"tab-btn" + (tab === "html_code" ? " active-tab" : "")}
              onClick={() => setTab("html_code")}
              type="button"
            >
              HTML Code
            </button>
            
            {tab === "html_output" && (
              <div className="checkbox-container">
                <button 
                  type="button" 
                  className={`function-btn copy-all-toggles-btn ${isCopyAllTogglesCopied ? 'copied' : ''}`}
                  onClick={handleCopyAllToggleItems}
                  title="모든 펼치기 항목을 한꺼번에 복사"
                >
                  {isCopyAllTogglesCopied ? '복사완료' : 'Copy Toggles'}
                </button>
              </div>
            )}
            
            {tab === "html_code" && (
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={withoutStyle}
                    onChange={() => setWithoutStyle(!withoutStyle)}
                  />
                  WithoutCSS
                </label>
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={bloggerCodeblock}
                    onChange={() => setBloggerCodeblock(!bloggerCodeblock)}
                  />
                  Blogger Codeblock
                </label>
              </div>
            )}
          </div>
          {tab === "html_output" ? (
            <div
              ref={htmlOutputRef}
              className="html-output"
              dangerouslySetInnerHTML={{ __html: bloggerHtml }}
              tabIndex={0} // Make the div focusable
              onKeyDown={handleHtmlOutputKeyDown} // Handle key down for Ctrl+A
            />          ) : (
            <textarea
              className="html-output html-output-textarea"
              value={bloggerHtml}
              readOnly
              aria-label="Generated HTML Code"
            />
          )}        </section>
      </div>

      {/* GitHub 설정 다이얼로그 */}
      <GitHubConfigDialog 
        isOpen={showGitHubConfig} 
        onClose={() => setShowGitHubConfig(false)} 
      />
    </main>
  );
}

export default App;
