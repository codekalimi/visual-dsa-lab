"use client";

import { useEffect, useRef } from "react";
import Editor, { type OnMount } from "@monaco-editor/react";
import type { editor } from "monaco-editor";

type Props = {
  code: string;
  /** 1-based line numbers */
  activeLines?: number[];
};

export function MonacoCodePanel({ code, activeLines = [] }: Props) {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const decoRef = useRef<string[]>([]);

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
    <div className="flex h-full min-h-[220px] flex-col overflow-hidden rounded-xl border border-border bg-[#1e1e1e] shadow-sm">
      <div className="flex items-center justify-between border-b border-white/10 px-3 py-2">
        <span className="font-mono text-xs tracking-wide text-white/70">
          algorithm.py
        </span>
        <span className="text-[10px] uppercase tracking-wider text-white/40">
          Python · read-only
        </span>
      </div>
      <div className="min-h-0 flex-1">
        <Editor
          height="100%"
          language="python"
          value={code}
          theme="vs-dark"
          onMount={handleMount}
          options={{
            readOnly: true,
            domReadOnly: true,
            contextmenu: false,
          }}
        />
      </div>
    </div>
  );
}
