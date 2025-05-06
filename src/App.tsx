import { useState, useEffect } from "react";
import { marked } from "marked";
import { markedHighlight } from "marked-highlight";
import hljs from "highlight.js";
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
      return hljs.highlightAuto(code).value;
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
  const [tab, setTab] = useState<'html_output' | 'html_code'>("html_output");
  const [withoutStyle, setWithoutStyle] = useState(true); // 기본값을 true로 변경
  const [bloggerCodeblock, setBloggerCodeblock] = useState(true); // 기본값을 true로 변경

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

  // 기본 HTML 생성 - 이 HTML은 "HTML Output" 탭에 표시됨
  const html = marked.parse(markdown);
  
  // "HTML Code" 탭용 HTML 생성 - 체크박스 상태에 따라 다른 HTML 생성
  let bloggerHtml = '';
  
  if (withoutStyle) {
    // 스타일 없이 HTML만 포함
    bloggerHtml = `<div class="blogger-html-body">\n${html}\n</div>`;
  } else {
    // 기본: 사용자 CSS와 함께 style 포함
    bloggerHtml = `\n<style>\n${appCss}\n${userCss}\n</style>\n<div class="blogger-html-body">\n${html}\n</div>`;
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

  return (
    <main className="split-container">
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
          </button>
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
            className="markdown-input custom-css"
            value={userCss}
            onChange={e => setUserCss(e.target.value)}
            placeholder="여기에 CSS를 입력하세요..."
            style={{ minHeight: 200 }}
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
            className="html-output"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <textarea
            className="html-output"
            style={{ whiteSpace: "pre", minHeight: 300 }}
            value={bloggerHtml}
            readOnly
          />
        )}
      </section>
    </main>
  );
}

export default App;
