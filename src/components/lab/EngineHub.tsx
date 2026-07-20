import Link from "next/link";
import { listAlgorithms } from "@/lib/catalog";
import type { EngineId } from "@/lib/types";
import { ENGINE_META } from "@/lib/types";

type Props = {
  engine: EngineId;
};

export function EngineHub({ engine }: Props) {
  const meta = ENGINE_META[engine];
  const algos = listAlgorithms(engine);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:px-8">
      <nav className="mb-6 text-xs text-muted">
        <Link href="/" className="hover:text-cyan">
          Lab
        </Link>
        <span className="mx-2">/</span>
        <span className="text-ink">{meta.label}</span>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight text-ink">{meta.label}</h1>
      <p className="mt-2 text-muted">{meta.blurb}</p>
      <ul className="mt-8 flex flex-col gap-3">
        {algos.map((algo) => (
          <li key={algo.id}>
            <Link
              href={`${meta.href}/${algo.id}`}
              className="block rounded-xl border border-border bg-panel px-5 py-4 transition hover:border-cyan/40 hover:bg-panel-2"
            >
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-ink">{algo.title}</h2>
                  <p className="mt-1 text-sm text-muted">{algo.description}</p>
                </div>
                <span className="shrink-0 font-mono text-xs text-cyan">
                  {algo.complexity.time}
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
