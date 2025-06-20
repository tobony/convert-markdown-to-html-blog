import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
// highlight.js 최적화: 코어만 임포트하고 필요한 언어만 추가
import hljs from "highlight.js/lib/core";
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
      if (lang && hljs.getLanguage(lang)) {
        return hljs.highlight(code, { language: lang }).value;
      }
      // 언어를 지정하지 않은 경우 등록된 언어 중에서 가장 적합한 것을 선택
      // 자동 감지 기능 대신 등록된 언어만 사용
      return hljs.highlightAuto(code, hljs.listLanguages()).value;
    }
  }),
  {
    gfm: true, // GitHub Flavored Markdown 활성화
    breaks: true, // 줄바꿈 인식
    pedantic: false
    // headerIds, smartLists, smartypants, and mangle removed as they're not valid properties in MarkedExtension type
  }
);

function App() {
  const [markdown, setMarkdown] = useState("");
  const [userCss, setUserCss] = useState("");
  const [leftTab, setLeftTab] = useState<'markdown' | 'css'>("markdown");
  const [tab, setTab] = useState<'html_output' | 'html_code'>("html_output");  const [withoutStyle, setWithoutStyle] = useState(true); // 기본값을 true로 변경
  const [bloggerCodeblock, setBloggerCodeblock] = useState(true); // 기본값을 true로 변경
  const [applyUserCss, setApplyUserCss] = useState(true); // New state for applying user CSS
  const [removeCitations, setRemoveCitations] = useState(false); // New state for removing citations
  const [functionCheckbox1, setFunctionCheckbox1] = useState(false);
  const [functionCheckbox2, setFunctionCheckbox2] = useState(false);
  const [isCopied, setIsCopied] = useState(false); // 복사 완료 상태 관리
  const htmlOutputRef = useRef<HTMLDivElement>(null); // Ref for the HTML output div

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

    // 링크는 항상 파란색 유지
    linkElements.forEach((element, index) => {
      (element as HTMLElement).style.setProperty('color', '#646cff', 'important');
      if (index < 3) { // 처음 3개만 로그
        console.log(`🔗 링크 ${index + 1} 파란색 유지:`, {
          color: '#646cff',
          href: element.getAttribute('href')
        });
      }
    });

    console.log('🎨 색상 적용 완료:', {
      targetColor,
      cssVariable: targetColor,
      targetElementsCount: targetElements.length,
      excludeElementsCount: excludeElements.length,
      linkElementsCount: linkElements.length
    });

  }, [functionCheckbox1, functionCheckbox2, markdown, removeCitations, tab]);

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

  // 기본 HTML 생성 - 이 HTML은 "HTML Output" 탭에 표시됨
  const html = marked.parse(processedMarkdown);
  
  // "HTML Code" 탭용 HTML 생성 - 체크박스 상태에 따라 다른 HTML 생성
  let bloggerHtml = '';
  
  if (withoutStyle) {
    // 스타일 없이 HTML만 포함
    bloggerHtml = `<div class="blogger-html-body">\n${html}\n</div>`;
  } else {
    // 스타일 포함
    let effectiveStyles = appCss; // Start with base app CSS
    if (applyUserCss) { // Conditionally add userCss if applyUserCss is true
      effectiveStyles += `\n${userCss}`;
    }
    bloggerHtml = `\n<style>\n${effectiveStyles}\n</style>\n<div class="blogger-html-body">\n${html}\n</div>`;
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
  };  // 기능 버튼 핸들러들
  const handleFunction1 = () => {
    // 마크다운 텍스트 영역 내용 전체 삭제
    setMarkdown("");
  };  const handleFunction2 = async () => {
    try {
      if (tab === 'html_output') {
        // HTML Output 탭: 렌더링된 서식 포함 텍스트 복사
        if (htmlOutputRef.current) {
          // 최신 클립보드 API 사용 (서식 포함)
          if (navigator.clipboard && navigator.clipboard.write) {
            try {
              // HTML과 플레인 텍스트 둘 다 클립보드에 저장
              const htmlContent = htmlOutputRef.current.innerHTML;
              const textContent = htmlOutputRef.current.textContent || htmlOutputRef.current.innerText || '';
              
              const clipboardItem = new ClipboardItem({
                'text/html': new Blob([htmlContent], { type: 'text/html' }),
                'text/plain': new Blob([textContent], { type: 'text/plain' })
              });
              
              await navigator.clipboard.write([clipboardItem]);
              console.log('HTML Output 서식 포함 복사 완료 (최신 API)');
            } catch (apiError) {
              console.warn('최신 API 실패, 폴백 방법 사용:', apiError);
              // 폴백: 전체 내용 선택 후 복사
              const selection = window.getSelection();
              const range = document.createRange();
              range.selectNodeContents(htmlOutputRef.current);
              
              if (selection) {
                selection.removeAllRanges();
                selection.addRange(range);
                
                try {
                  const successful = document.execCommand('copy');
                  if (successful) {
                    console.log('HTML Output 서식 포함 복사 완료 (폴백)');
                  } else {
                    throw new Error('복사 실패');
                  }
                } finally {
                  selection.removeAllRanges();
                }
              }
            }
          } else {
            // 전체 내용을 선택 후 복사 (구형 브라우저)
            const selection = window.getSelection();
            const range = document.createRange();
            range.selectNodeContents(htmlOutputRef.current);
            
            if (selection) {
              selection.removeAllRanges();
              selection.addRange(range);
              
              try {
                const successful = document.execCommand('copy');
                if (successful) {
                  console.log('HTML Output 서식 포함 복사 완료 (구형 브라우저)');
                } else {
                  throw new Error('복사 실패');
                }
              } finally {
                selection.removeAllRanges();
              }
            }
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
  };return (
    <main className="split-container">
      <div className="function-bar">        <button 
          type="button" 
          className="function-btn"
          onClick={handleFunction1}
        >
          Delete
        </button>        <button 
          type="button" 
          className={`function-btn ${isCopied ? 'copied' : ''}`}
          onClick={handleFunction2}
        >
          {isCopied ? '복사완료' : '결과복사'}
        </button>        <label className="checkbox-label">
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
          CustomStyle1
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
          CustomStyle2
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
            
            {tab === "html_code" && (
              <div className="checkbox-container">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={withoutStyle}
                    onChange={() => setWithoutStyle(!withoutStyle)}
                  />
                  Without Style
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
              dangerouslySetInnerHTML={{ __html: html }}
              tabIndex={0} // Make the div focusable
              onKeyDown={handleHtmlOutputKeyDown} // Handle key down for Ctrl+A
            />          ) : (
            <textarea
              className="html-output html-output-textarea"
              value={bloggerHtml}
              readOnly
              aria-label="Generated HTML Code"
            />
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
