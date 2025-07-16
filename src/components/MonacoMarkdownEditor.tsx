import React, { useEffect, useRef, useState } from 'react';

interface MonacoMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  isDarkMode?: boolean;
  placeholder?: string;
  className?: string;
  onScroll?: (scrollTop: number, scrollHeight: number, clientHeight: number) => void;
  onEditorReady?: (editor: any) => void;
}

// Monaco Editor 타입 정의
declare global {
  interface Window {
    monaco: any;
    require: any;
  }
}

const MonacoMarkdownEditor: React.FC<MonacoMarkdownEditorProps> = ({
  value,
  onChange,
  isDarkMode = false,
  className = "monaco-editor-container",
  onScroll,
  onEditorReady
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const editorRef = useRef<any>(null);
  const scrollListenerRef = useRef<any>(null); // 스크롤 이벤트 리스너 참조
  const [isMonacoLoaded, setIsMonacoLoaded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Monaco Editor 로드
  useEffect(() => {
    if (window.monaco) {
      setIsMonacoLoaded(true);
      return;
    }

    // Monaco Editor CDN 로드
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/monaco-editor@0.45.0/min/vs/loader.js';
    script.async = true;
    script.onload = () => {
      window.require.config({ 
        paths: { 
          vs: 'https://unpkg.com/monaco-editor@0.45.0/min/vs' 
        } 
      });
      
      window.require(['vs/editor/editor.main'], () => {
        setIsMonacoLoaded(true);
      });
    };
    
    document.head.appendChild(script);

    return () => {
      if (script.parentNode) {
        script.parentNode.removeChild(script);
      }
    };
  }, []);

  // 에디터 초기화
  useEffect(() => {
    if (!isMonacoLoaded || !containerRef.current || isInitialized) return;

    const editor = window.monaco.editor.create(containerRef.current, {
      value: value,
      language: 'markdown',
      theme: isDarkMode ? 'vs-dark' : 'vs',
      minimap: { enabled: false },
      wordWrap: 'on',
      scrollBeyondLastLine: false,
      automaticLayout: true,
      fontSize: 16,
      lineHeight: 1.5,
      padding: { top: 16, bottom: 16 },
      folding: true,
      foldingStrategy: 'indentation',
      showFoldingControls: 'always',
      renderLineHighlight: 'gutter',
      selectOnLineNumbers: true,
      roundedSelection: false,
      cursorStyle: 'line',
      cursorWidth: 2,
      scrollbar: {
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      }
    });

    // 폰트 사이즈 확인을 위한 디버깅 로그
    console.log('Monaco Editor 생성됨:', {
      fontSize: editor.getOptions().get(window.monaco.editor.EditorOption.fontSize),
      lineHeight: editor.getOptions().get(window.monaco.editor.EditorOption.lineHeight),
      fontFamily: editor.getOptions().get(window.monaco.editor.EditorOption.fontFamily),
    });

    // 스크롤 이벤트 리스너 추가
    if (onScroll) {
      const scrollListener = editor.onDidScrollChange((e: any) => {
        // App.tsx에서 syncScroll 상태를 체크하므로 여기서는 단순히 이벤트만 전달
        onScroll(e.scrollTop, e.scrollHeight, editor.getLayoutInfo().height);
      });
      scrollListenerRef.current = scrollListener;
    }

    // 에디터 준비 콜백 호출
    if (onEditorReady) {
      onEditorReady(editor);
    }

    // 값 변경 이벤트 리스너
    editor.onDidChangeModelContent(() => {
      const newValue = editor.getValue();
      onChange(newValue);
    });

    editorRef.current = editor;
    setIsInitialized(true);

    return () => {
      if (scrollListenerRef.current) {
        scrollListenerRef.current.dispose();
      }
      if (editor) {
        editor.dispose();
      }
    };
  }, [isMonacoLoaded, onChange]);

  // 값 업데이트
  useEffect(() => {
    if (editorRef.current && value !== editorRef.current.getValue()) {
      editorRef.current.setValue(value);
    }
  }, [value]);

  // 테마 변경
  useEffect(() => {
    if (editorRef.current) {
      window.monaco.editor.setTheme(isDarkMode ? 'vs-dark' : 'vs');
    }
  }, [isDarkMode]);

  // 로딩 상태 표시
  if (!isMonacoLoaded) {
    return (
      <div className={`${className} monaco-loading`}>
        <div className="monaco-loading-content">
          <div className="monaco-loading-spinner"></div>
          <p>Monaco Editor 로딩 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div 
        ref={containerRef} 
        style={{ 
          height: '100%', 
          width: '100%',
          minHeight: '300px'
        }} 
      />
    </div>
  );
};

export default MonacoMarkdownEditor;
