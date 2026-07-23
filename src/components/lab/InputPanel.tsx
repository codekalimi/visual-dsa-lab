"use client";

import { useState, type ReactNode } from "react";
import type { EngineId } from "@/lib/types";
import { parseEdgeList, parseIntList } from "@/lib/parse";

type BaseProps = {
  onRun: (input: unknown) => void;
  error: string | null;
};

const fieldClass =
  "mt-1 w-full rounded-lg border border-border bg-panel-2 px-3 py-2 font-mono text-sm text-ink outline-none focus:border-cyan/40";

export function ArrayBubbleInput({
  defaultValues,
  onRun,
  error,
}: BaseProps & { defaultValues: number[] }) {
  const [raw, setRaw] = useState(defaultValues.join(", "));
  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        Array values
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
          placeholder="5, 3, 8, 4, 2"
        />
      </label>
      <RunButton
        onClick={() => {
          const values = parseIntList(raw);
          if (values === null) return onRun({ __parseError: "Invalid integers" });
          onRun({ values });
        }}
      />
    </InputCard>
  );
}

export function ArrayTwoPointersInput({
  defaultValues,
  defaultTarget,
  onRun,
  error,
}: BaseProps & { defaultValues: number[]; defaultTarget: number }) {
  const [raw, setRaw] = useState(defaultValues.join(", "));
  const [target, setTarget] = useState(String(defaultTarget));
  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        Sorted array
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block text-xs font-medium text-muted">
        Target sum
        <input
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          className={fieldClass}
        />
      </label>
      <RunButton
        onClick={() => {
          const values = parseIntList(raw);
          const t = Number(target);
          if (values === null) return onRun({ __parseError: "Invalid integers" });
          if (!Number.isFinite(t)) return onRun({ __parseError: "Invalid target" });
          onRun({ values, target: t });
        }}
      />
    </InputCard>
  );
}

export function LinkedListValuesInput({
  defaultValues,
  onRun,
  error,
}: BaseProps & { defaultValues: number[] }) {
  const [raw, setRaw] = useState(defaultValues.join(", "));
  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        Node values
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
        />
      </label>
      <RunButton
        onClick={() => {
          const values = parseIntList(raw);
          if (values === null) return onRun({ __parseError: "Invalid integers" });
          onRun({ values });
        }}
      />
    </InputCard>
  );
}

export function LinkedListInsertInput({
  defaultValues,
  defaultValue,
  defaultIndex,
  onRun,
  error,
}: BaseProps & {
  defaultValues: number[];
  defaultValue: number;
  defaultIndex: number;
}) {
  const [raw, setRaw] = useState(defaultValues.join(", "));
  const [value, setValue] = useState(String(defaultValue));
  const [index, setIndex] = useState(String(defaultIndex));
  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        Node values
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs font-medium text-muted">
          Insert value
          <input
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          Index
          <input
            value={index}
            onChange={(e) => setIndex(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>
      <RunButton
        onClick={() => {
          const values = parseIntList(raw);
          const v = Number(value);
          const i = Number(index);
          if (values === null) return onRun({ __parseError: "Invalid integers" });
          if (!Number.isFinite(v)) return onRun({ __parseError: "Invalid value" });
          if (!Number.isInteger(i)) return onRun({ __parseError: "Invalid index" });
          onRun({ values, value: v, index: i });
        }}
      />
    </InputCard>
  );
}

export function TreeSequenceInput({
  defaultValues,
  onRun,
  error,
  label = "Insert sequence",
}: BaseProps & { defaultValues: number[]; label?: string }) {
  const [raw, setRaw] = useState(defaultValues.join(", "));
  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        {label}
        <input
          value={raw}
          onChange={(e) => setRaw(e.target.value)}
          className={fieldClass}
        />
      </label>
      <RunButton
        onClick={() => {
          const values = parseIntList(raw);
          if (values === null) return onRun({ __parseError: "Invalid integers" });
          onRun({ values });
        }}
      />
    </InputCard>
  );
}

export function GraphValidPathInput({
  defaultN,
  defaultEdges,
  defaultSource,
  defaultDestination,
  onRun,
  error,
}: BaseProps & {
  defaultN: number;
  defaultEdges: [number, number][];
  defaultSource: number;
  defaultDestination: number;
}) {
  const [n, setN] = useState(String(defaultN));
  const [rawEdges, setRawEdges] = useState(
    defaultEdges.map(([a, b]) => `${a} ${b}`).join("\n"),
  );
  const [source, setSource] = useState(String(defaultSource));
  const [destination, setDestination] = useState(String(defaultDestination));

  return (
    <InputCard error={error}>
      <label className="block text-xs font-medium text-muted">
        n (node count)
        <input
          value={n}
          onChange={(e) => setN(e.target.value)}
          className={fieldClass}
        />
      </label>
      <label className="block text-xs font-medium text-muted">
        Edges (one per line: u v)
        <textarea
          value={rawEdges}
          onChange={(e) => setRawEdges(e.target.value)}
          rows={4}
          className={fieldClass}
        />
      </label>
      <div className="grid grid-cols-2 gap-2">
        <label className="block text-xs font-medium text-muted">
          source
          <input
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className={fieldClass}
          />
        </label>
        <label className="block text-xs font-medium text-muted">
          destination
          <input
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className={fieldClass}
          />
        </label>
      </div>
      <RunButton
        onClick={() => {
          const nVal = Number(n);
          const src = Number(source);
          const dst = Number(destination);
          const parsed = parseEdgeList(rawEdges);
          if (parsed === null) {
            return onRun({ __parseError: "Invalid edge list" });
          }
          if (!Number.isInteger(nVal)) {
            return onRun({ __parseError: "n must be an integer" });
          }
          if (!Number.isInteger(src) || !Number.isInteger(dst)) {
            return onRun({ __parseError: "source/destination must be integers" });
          }
          const edges: [number, number][] = [];
          for (const e of parsed) {
            if (!/^-?\d+$/.test(e.source) || !/^-?\d+$/.test(e.target)) {
              return onRun({ __parseError: "Edges must be integer pairs" });
            }
            edges.push([Number(e.source), Number(e.target)]);
          }
          onRun({ n: nVal, edges, source: src, destination: dst });
        }}
      />
    </InputCard>
  );
}

function InputCard({
  children,
  error,
}: {
  children: ReactNode;
  error: string | null;
}) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted">
        Input
      </h3>
      {children}
      {error && (
        <p className="rounded-md border border-rose/40 bg-rose-soft px-2 py-1.5 text-xs text-rose">
          {error}
        </p>
      )}
    </div>
  );
}

function RunButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="rounded-lg bg-emerald px-4 py-2 text-sm font-semibold text-background transition hover:opacity-90"
    >
      Run
    </button>
  );
}

export function EngineInputPanel({
  engine,
  algoId,
  defaultInput,
  onRun,
  error,
}: {
  engine: EngineId;
  algoId: string;
  defaultInput: unknown;
  onRun: (input: unknown) => void;
  error: string | null;
}) {
  if (engine === "arrays" && algoId === "bubble-sort") {
    const d = defaultInput as { values: number[] };
    return (
      <ArrayBubbleInput defaultValues={d.values} onRun={onRun} error={error} />
    );
  }
  if (engine === "arrays" && algoId === "kadane") {
    const d = defaultInput as { values: number[] };
    return (
      <ArrayBubbleInput defaultValues={d.values} onRun={onRun} error={error} />
    );
  }
  if (engine === "arrays" && algoId === "two-pointers") {
    const d = defaultInput as { values: number[]; target: number };
    return (
      <ArrayTwoPointersInput
        defaultValues={d.values}
        defaultTarget={d.target}
        onRun={onRun}
        error={error}
      />
    );
  }
  if (engine === "linked-list" && algoId === "reverse-list") {
    const d = defaultInput as { values: number[] };
    return (
      <LinkedListValuesInput
        defaultValues={d.values}
        onRun={onRun}
        error={error}
      />
    );
  }
  if (engine === "linked-list" && algoId === "insert-list") {
    const d = defaultInput as {
      values: number[];
      value: number;
      index: number;
    };
    return (
      <LinkedListInsertInput
        defaultValues={d.values}
        defaultValue={d.value}
        defaultIndex={d.index}
        onRun={onRun}
        error={error}
      />
    );
  }
  if (engine === "trees") {
    const d = defaultInput as { values: number[] };
    return (
      <TreeSequenceInput
        defaultValues={d.values}
        onRun={onRun}
        error={error}
        label={algoId === "inorder" ? "BST insert sequence" : "Insert sequence"}
      />
    );
  }
  if (engine === "graphs" && algoId === "valid-path") {
    const d = defaultInput as {
      n: number;
      edges: [number, number][];
      source: number;
      destination: number;
    };
    return (
      <GraphValidPathInput
        defaultN={d.n}
        defaultEdges={d.edges}
        defaultSource={d.source}
        defaultDestination={d.destination}
        onRun={onRun}
        error={error}
      />
    );
  }
  return null;
}
