import Link from "next/link";
import { DsaCollage } from "@/components/illustrations/DsaCollage";
import { ENGINE_META, ENGINE_ORDER } from "@/lib/types";
import { listAlgorithms } from "@/lib/catalog";

export default function HomePage() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-8 md:py-12">
      <DsaCollage />

      <div className="mt-8 max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-cyan">
          Visual DSA Lab
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-ink md:text-4xl">
          Data Structures and Algorithms
        </h1>
        <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">
          This lab covers the fundamental concepts, problem-solving patterns,
          and interview walkthroughs you need — with every step animated so you
          can see what happens behind the scenes.
        </p>
      </div>

      <div className="mt-10 grid gap-3 sm:grid-cols-3">
        {ENGINE_ORDER.map((engine) => {
          const meta = ENGINE_META[engine];
          const count = listAlgorithms(engine).length;
          return (
            <Link
              key={engine}
              href={meta.href}
              className="rounded-xl border border-border bg-panel p-4 transition hover:border-cyan/40 hover:bg-panel-2"
            >
              <h2 className="font-semibold text-ink">{meta.label}</h2>
              <p className="mt-1 text-xs text-muted">{meta.blurb}</p>
              <p className="mt-3 font-mono text-[11px] text-cyan">
                {count} labs →
              </p>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
