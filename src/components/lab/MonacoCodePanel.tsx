"use client";

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";
import { useTheme } from "@/lib/theme/ThemeProvider";

type Props = {
  code: string;
  /** 1-based line numbers */
  activeLines?: number[];
  /** Stretch to fill parent height (code rail) */
  fill?: boolean;
};

export function MonacoCodePanel({
  code,
  activeLines = [],
  fill = false,
}: Props) {
  const { theme } = useTheme();
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decoRef = useRef<string[]>([]);
  const monacoTheme = theme === "light" ? "light" : "vs-dark";

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
    ed.updateOptions({
      readOnly: true,
      domReadOnly: true,
      readOnlyMessage: {
        value: "Python reference only — editing and running are disabled.",
      },
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      fontFamily: "var(--font-jetbrains), ui-monospace, monospace",
      fontSize: 13,
      fontLigatures: true,
      lineNumbers: "on",
      glyphMargin: false,
      folding: false,
      renderLineHighlight: "none",
      padding: { top: 12, bottom: 12 },
      contextmenu: false,
      quickSuggestions: false,
      suggestOnTriggerCharacters: false,
      acceptSuggestionOnEnter: "off",
      tabCompletion: "off",
      wordBasedSuggestions: "off",
      automaticLayout: true,
    });
  };

  useEffect(() => {
    const ed = editorRef.current;
    if (!ed) return;

    const model = ed.getModel();
    if (!model) return;

    decoRef.current = ed.deltaDecorations(
      decoRef.current,
      activeLines.map((line) => ({
        range: {
          startLineNumber: line,
          startColumn: 1,
          endLineNumber: line,
          endColumn: 1,
        },
        options: {
          isWholeLine: true,
          className: "monaco-current-line",
          linesDecorationsClassName: "monaco-current-line",
        },
      })),
    );

    if (activeLines.length > 0) {
      ed.revealLineInCenter(activeLines[0]);
    }
  }, [activeLines, code]);

  return (
    <div
      className={`flex flex-col overflow-hidden rounded-xl border border-border bg-panel-2 shadow-sm ${
        fill ? "h-full min-h-0" : "h-full min-h-[220px]"
      }`}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border px-3 py-2">
        <span className="font-mono text-xs tracking-wide text-muted">
          algorithm.py
        </span>
        <span className="text-[10px] uppercase tracking-wider text-muted/70">
          Python · read-only
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language="python"
          value={code}
          theme={monacoTheme}
          onMount={handleMount}
          options={{
            readOnly: true,
            domReadOnly: true,
            contextmenu: false,
            automaticLayout: true,
          }}
        />
      </div>
    </div>
  );
}
