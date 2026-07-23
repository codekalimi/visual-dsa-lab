"use client";

import { useState, type ReactNode } from "react";
import {
  AlertTriangle,
  BookOpen,
  Brain,
  Building2,
  Code2,
  FileText,
  FlaskConical,
  Globe,
  GraduationCap,
  ListOrdered,
  Target,
  Zap,
} from "lucide-react";
import { TeachCard, TeachRail } from "@/components/teach/TeachRail";

function CodeBlock({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-md border border-border bg-background/80 p-2.5 font-mono text-[11px] text-ink">
      {children}
    </pre>
  );
}

function Collapsible({
  title,
  children,
  defaultOpen = false,
}: {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-border bg-panel-2/60">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2.5 text-left text-xs font-medium text-ink"
      >
        <span>{title}</span>
        <span className="text-muted">{open ? "▾" : "▸"}</span>
      </button>
      {open && (
        <div className="space-y-2.5 border-t border-border px-3 py-3 text-[13px] leading-relaxed text-muted">
          {children}
        </div>
      )}
    </div>
  );
}

export function KadaneTeachPanel() {
  return (
    <TeachRail subtitle="Kadane — durable understanding">
      <p className="px-1 pb-1 text-[12px] leading-relaxed text-muted">
        Play the lab first. Then walk this path once. Goal: recognize
        max-subarray problems and solve them without memorizing a finished
        solution.
      </p>

      <TeachCard icon={FileText} accent="blue" title="Problem it solves">
        <p>
          You are given a list of numbers. You must pick one{" "}
          <strong className="text-ink">contiguous</strong> slice (a subarray)
          whose sum is as large as possible.
        </p>
        <p>
          Checking every slice is too slow for interviews: O(n²) or O(n³).
          Kadane finds the answer in one left-to-right pass — O(n) time and O(1)
          extra space.
        </p>
      </TeachCard>

      <TeachCard icon={Globe} accent="cyan" title="Mental model">
        <p>
          Think of each day&apos;s profit (can be negative). You track a{" "}
          <em>current streak</em> and the <em>best streak so far</em>.
        </p>
        <p>
          At today: either <strong className="text-ink">continue</strong> the
          streak (add today), or <strong className="text-ink">restart</strong> a
          new streak starting today — whichever is larger.
        </p>
        <p className="font-mono text-[11px] text-cyan">
          if curSum &lt; 0: reset; then curSum += nums[R]
        </p>
        <p>
          Then update maxSum (and maxL / maxR) when the window sum beats the
          record.
        </p>
      </TeachCard>

      <TeachCard icon={BookOpen} accent="emerald" title="Quick visualization">
        <p>
          Cyan = current window. Emerald = best window so far. Orange = index{" "}
          <span className="font-mono">i</span>.
        </p>
        <p>Short hand table for a tiny prefix of the default example:</p>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[280px] border-collapse font-mono text-[10px]">
            <thead>
              <tr className="border-b border-border text-left text-muted">
                <th className="py-1.5 pr-2">i</th>
                <th className="py-1.5 pr-2">nums[i]</th>
                <th className="py-1.5 pr-2">decision</th>
                <th className="py-1.5 pr-2">curSum</th>
                <th className="py-1.5">maxSum</th>
              </tr>
            </thead>
            <tbody className="text-ink">
              <tr className="border-b border-border/50">
                <td className="py-1 pr-2">0</td>
                <td className="py-1 pr-2">-2</td>
                <td className="py-1 pr-2">seed</td>
                <td className="py-1 pr-2">-2</td>
                <td className="py-1">-2</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1 pr-2">1</td>
                <td className="py-1 pr-2">1</td>
                <td className="py-1 pr-2">restart</td>
                <td className="py-1 pr-2">1</td>
                <td className="py-1">1</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="py-1 pr-2">2</td>
                <td className="py-1 pr-2">-3</td>
                <td className="py-1 pr-2">extend…</td>
                <td className="py-1 pr-2">-2</td>
                <td className="py-1">1</td>
              </tr>
              <tr>
                <td className="py-1 pr-2">3</td>
                <td className="py-1 pr-2">4</td>
                <td className="py-1 pr-2">restart</td>
                <td className="py-1 pr-2">4</td>
                <td className="py-1">4</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Scrub until maxSum lands on{" "}
          <span className="font-mono text-emerald">[4, -1, 2, 1]</span> (sum 6).
        </p>
      </TeachCard>

      <TeachCard
        icon={Zap}
        accent="amber"
        title="Core idea from first principles"
      >
        <p>
          <strong className="text-ink">Subarray</strong> = contiguous slice.{" "}
          <strong className="text-ink">Subsequence</strong> = pick any indices
          in order (not required here).
        </p>
        <p>
          Any best subarray ending at index <span className="font-mono">i</span>{" "}
          either (1) is just <span className="font-mono">nums[i]</span>, or (2)
          is best ending at <span className="font-mono">i-1</span> plus{" "}
          <span className="font-mono">nums[i]</span>. So you only need{" "}
          <span className="font-mono">curSum</span>.
        </p>
        <p>
          Track the global maximum of those ending-best values →{" "}
          <span className="font-mono">maxSum</span>, plus window bounds{" "}
          <span className="font-mono">maxL</span> /{" "}
          <span className="font-mono">maxR</span>.
        </p>
      </TeachCard>

      <TeachCard
        icon={Target}
        accent="violet"
        title="Operations and invariants"
      >
        <p>
          <strong className="text-ink">Invariant:</strong> after index{" "}
          <span className="font-mono">i</span>,{" "}
          <span className="font-mono">curSum</span> is the sum of the current
          window <span className="font-mono">[L…R]</span>, and{" "}
          <span className="font-mono">maxSum</span> is the best window sum seen
          so far (bounds <span className="font-mono">maxL…maxR</span>).
        </p>
        <p>
          <strong className="text-ink">Time O(n):</strong> each index once.{" "}
          <strong className="text-ink">Space O(1):</strong> a few scalars.
        </p>
      </TeachCard>

      <TeachCard
        icon={FlaskConical}
        accent="teal"
        title="Trigger words and recognition cues"
      >
        <ul className="list-disc space-y-1 pl-4">
          <li>“contiguous” / “subarray” / “maximum sum”</li>
          <li>one pass expected; n up to 10⁵ → need O(n)</li>
          <li>array of integers, possibly negative</li>
        </ul>
        <p>
          <strong className="text-ink">Not Kadane when:</strong> subsequence,
          prefix sums, constrained windows, or 2D max rectangle alone.
        </p>
      </TeachCard>

      <TeachCard
        icon={Building2}
        accent="green"
        title="Real-world engineering uses"
      >
        <ul className="list-disc space-y-1.5 pl-4">
          <li>
            <strong className="text-ink">Time-series spike:</strong> densest
            contiguous load or error interval.
          </li>
          <li>
            <strong className="text-ink">Metrics / revenue:</strong> best
            contiguous campaign window.
          </li>
          <li>
            <strong className="text-ink">Anomaly burst:</strong> densest signal
            burst before noise drags the sum down.
          </li>
        </ul>
      </TeachCard>

      <TeachCard icon={ListOrdered} accent="orange" title="Worked example">
        <p>
          Array:{" "}
          <span className="font-mono text-ink">
            [-2, 1, -3, 4, -1, 2, 1, -5, 4]
          </span>
        </p>
        <p>
          After index 3, restart at <span className="font-mono">4</span>. Extend
          through <span className="font-mono">-1, 2, 1</span> → sum 6. Answer:{" "}
          <strong className="text-emerald">6</strong> on{" "}
          <span className="font-mono">[3…6]</span>.
        </p>
      </TeachCard>

      <TeachCard icon={Code2} accent="purple" title="Reusable code template">
        <p>Generic (sum only):</p>
        <p>Matches the Monaco panel (returns window bounds):</p>
        <CodeBlock>{`def slidingWindow(nums):
    maxSum = nums[0]
    curSum = 0
    maxL, maxR = 0, 0
    L = 0

    for R in range(len(nums)):
        if curSum < 0:
            curSum = 0
            L = R

        curSum += nums[R]
        if curSum > maxSum:
            maxSum = curSum
            maxL, maxR = L, R

    return [maxL, maxR]`}</CodeBlock>
      </TeachCard>

      <TeachCard icon={AlertTriangle} accent="rose" title="Failure modes">
        <ul className="list-disc space-y-1 pl-4">
          <li>
            <strong className="text-ink">All negative:</strong> largest single
            element — seed with <span className="font-mono">nums[0]</span>.
          </li>
          <li>
            <strong className="text-ink">Empty array:</strong> statement
            decides; LC 53 assumes non-empty.
          </li>
          <li>
            <strong className="text-ink">Subsequence confusion:</strong> skipping
            negatives is wrong for subarray.
          </li>
          <li>
            <strong className="text-ink">Off-by-one:</strong> windows are
            inclusive.
          </li>
        </ul>
      </TeachCard>

      <TeachCard icon={GraduationCap} accent="cyan" title="Practice ladder">
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href="https://leetcode.com/problems/maximum-subarray/"
              target="_blank"
              rel="noreferrer"
            >
              LC 53 Maximum Subarray
            </a>
          </li>
          <li>
            Return indices, or{" "}
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href="https://leetcode.com/problems/maximum-sum-circular-subarray/"
              target="_blank"
              rel="noreferrer"
            >
              LC 918
            </a>
          </li>
          <li>
            <a
              className="text-cyan underline-offset-2 hover:underline"
              href="https://leetcode.com/problems/maximum-product-subarray/"
              target="_blank"
              rel="noreferrer"
            >
              LC 152 Product Subarray
            </a>
          </li>
        </ol>
      </TeachCard>

      <TeachCard icon={Brain} accent="pink" title="Memory and recall">
        <p className="font-medium text-ink">
          Hook: “If curSum &lt; 0, restart at R; else extend. Keep maxSum.”
        </p>
        <ol className="list-decimal space-y-1 pl-4">
          <li>
            State the invariant for <span className="font-mono">curSum</span>{" "}
            and <span className="font-mono">maxSum</span>.
          </li>
          <li>
            Why restart when <span className="font-mono">nums[i]</span> alone is
            larger?
          </li>
          <li>
            Answer for <span className="font-mono">[-3, -1, -2]</span>?
          </li>
          <li>One cue toward Kadane; one cue away.</li>
        </ol>
      </TeachCard>

      <Collapsible title="Interview drill" defaultOpen={false}>
        <ol className="list-decimal space-y-1.5 pl-4">
          <li>Restate input, output, constraints.</li>
          <li>Run a tiny example (include all-negative).</li>
          <li>Name brute force and its bottleneck.</li>
          <li>Extract triggers → Kadane.</li>
          <li>
            Name the invariant (<span className="font-mono">curSum</span> is
            the sum of <span className="font-mono">[L…R]</span>).
          </li>
          <li>Write pseudocode before syntax.</li>
          <li>Test normal, boundary, adversarial cases.</li>
          <li>State O(n) / O(1) with reason.</li>
        </ol>
      </Collapsible>
    </TeachRail>
  );
}
