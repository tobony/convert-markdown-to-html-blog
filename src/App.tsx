import { useState } from "react";
import { marked } from "marked";
import "./App.css";
import appCss from "./App.css?inline";

function App() {
  const [markdown, setMarkdown] = useState("");
  const [userCss, setUserCss] = useState("");
  const [leftTab, setLeftTab] = useState<'markdown' | 'css'>("markdown");
  const [tab, setTab] = useState<'result' | 'code'>("result");

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
            본문내용 입력
          </button>
          <button
            className={"tab-btn" + (leftTab === "css" ? " active-tab" : "")}
            onClick={() => setLeftTab("css")}
            type="button"
          >
            사용자 추가 CSS 입력
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
            className="markdown-input"
            value={userCss}
            onChange={e => setUserCss(e.target.value)}
            placeholder="여기에 CSS를 입력하세요..."
            style={{ fontFamily: "monospace", minHeight: 200 }}
          />
        )}
      </section>
      <section className="split-pane right-pane">
        <div className="tab-bar">
          <button
            className={"tab-btn" + (tab === "result" ? " active-tab" : "")}
            onClick={() => setTab("result")}
            type="button"
          >
            HTML 결과
          </button>
          <button
            className={"tab-btn" + (tab === "code" ? " active-tab" : "")}
            onClick={() => setTab("code")}
            type="button"
          >
            HTML 코드
          </button>
        </div>
        {tab === "result" ? (
          <div
            className="html-output"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <textarea
            className="html-output"
            style={{ fontFamily: "monospace", whiteSpace: "pre", minHeight: 300 }}
            value={bloggerHtml}
            readOnly
          />
        )}
      </section>
    </main>
  );
}

export default App;
