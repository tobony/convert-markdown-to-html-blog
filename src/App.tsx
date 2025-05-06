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

  const html = marked.parse(markdown);
  // 사용자 CSS도 함께 style에 포함
  const bloggerHtml = `\n<style>\n${appCss}\n${userCss}\n</style>\n<div class="blogger-html-body">\n${html}\n</div>`;

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
