"use client";

import { motion } from "motion/react";

/** Hub illustration: Arrays + Linked List + Tree in AlgoMaster node language. */
export function DsaCollage() {
  return (
    <div className="stage-grid overflow-hidden rounded-xl border border-border bg-panel">
      <svg
        viewBox="0 0 720 340"
        className="h-auto w-full"
        role="img"
        aria-label="Arrays, linked lists, and trees illustration"
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="8"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M0 0 L10 5 L0 10 z" fill="#8b98a8" />
          </marker>
        </defs>

        <text x="40" y="36" fill="#8b98a8" fontSize="12" fontFamily="monospace">
          Arrays
        </text>
        {[3, 1, 9, 4, 6].map((v, i) => {
          const x = 40 + i * 58;
          const hi = i === 1 || i === 3;
          return (
            <motion.g
              key={`a${i}`}
              animate={{ opacity: [0.82, 1, 0.82] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: i * 0.12,
                ease: "easeInOut",
              }}
            >
              <text
                x={x + 24}
                y="58"
                textAnchor="middle"
                fill="#8b98a8"
                fontSize="10"
                fontFamily="monospace"
              >
                {i}
              </text>
              <rect
                x={x}
                y="68"
                width="48"
                height="40"
                rx="8"
                fill={hi ? "rgba(52,211,153,0.2)" : "rgba(34,211,238,0.12)"}
                stroke={hi ? "#34d399" : "#2a313c"}
                strokeWidth="2"
              />
              <text
                x={x + 24}
                y="94"
                textAnchor="middle"
                fill="#e8eef4"
                fontSize="14"
                fontFamily="monospace"
                fontWeight="700"
              >
                {v}
              </text>
              {i === 1 && (
                <text
                  x={x + 24}
                  y="128"
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  L
                </text>
              )}
              {i === 3 && (
                <text
                  x={x + 24}
                  y="128"
                  textAnchor="middle"
                  fill="#34d399"
                  fontSize="11"
                  fontFamily="monospace"
                  fontWeight="700"
                >
                  R
                </text>
              )}
            </motion.g>
          );
        })}

        <text
          x="40"
          y="168"
          fill="#8b98a8"
          fontSize="12"
          fontFamily="monospace"
        >
          Linked Lists
        </text>
        {[10, 20, 30, 40, 50].map((v, i) => {
          const x = 56 + i * 72;
          const y = 210;
          const isHead = i === 0;
          const isTail = i === 4;
          return (
            <motion.g
              key={`l${i}`}
              animate={{ opacity: [0.82, 1, 0.82] }}
              transition={{
                duration: 2.4,
                repeat: Infinity,
                delay: 0.3 + i * 0.1,
                ease: "easeInOut",
              }}
            >
              <circle
                cx={x}
                cy={y}
                r="22"
                fill={
                  isHead
                    ? "rgba(34,211,238,0.2)"
                    : isTail
                      ? "rgba(251,113,133,0.2)"
                      : "rgba(232,238,244,0.06)"
                }
                stroke={isHead ? "#22d3ee" : isTail ? "#fb7185" : "#2a313c"}
                strokeWidth="2"
              />
              <text
                x={x}
                y={y + 5}
                textAnchor="middle"
                fill="#e8eef4"
                fontSize="12"
                fontFamily="monospace"
                fontWeight="700"
              >
                {v}
              </text>
              {i < 4 && (
                <line
                  x1={x + 24}
                  y1={y}
                  x2={x + 48}
                  y2={y}
                  stroke="#8b98a8"
                  strokeWidth="2"
                  markerEnd="url(#arrow)"
                />
              )}
              {isHead && (
                <text
                  x={x}
                  y={y - 32}
                  textAnchor="middle"
                  fill="#22d3ee"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  head
                </text>
              )}
              {isTail && (
                <text
                  x={x}
                  y={y - 32}
                  textAnchor="middle"
                  fill="#fb7185"
                  fontSize="10"
                  fontFamily="monospace"
                >
                  tail
                </text>
              )}
            </motion.g>
          );
        })}
        <text
          x="420"
          y="214"
          fill="#8b98a8"
          fontSize="11"
          fontFamily="monospace"
        >
          null
        </text>

        <text
          x="480"
          y="36"
          fill="#8b98a8"
          fontSize="12"
          fontFamily="monospace"
        >
          Trees
        </text>
        {(
          [
            [600, 70, 10, true],
            [540, 140, 5, false],
            [660, 140, 15, false],
            [510, 210, 3, false],
            [570, 210, 7, false],
            [630, 210, 12, false],
            [690, 210, 20, false],
          ] as const
        ).map(([cx, cy, val, isRoot], i) => (
          <motion.g
            key={`t${i}`}
            animate={{ opacity: [0.82, 1, 0.82] }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              delay: 0.5 + i * 0.08,
              ease: "easeInOut",
            }}
          >
            <circle
              cx={cx}
              cy={cy}
              r="18"
              fill={
                isRoot ? "rgba(52,211,153,0.22)" : "rgba(34,211,238,0.12)"
              }
              stroke={isRoot ? "#34d399" : "#2a313c"}
              strokeWidth="2"
            />
            <text
              x={cx}
              y={cy + 4}
              textAnchor="middle"
              fill="#e8eef4"
              fontSize="11"
              fontFamily="monospace"
              fontWeight="700"
            >
              {val}
            </text>
            {isRoot && (
              <text
                x={cx}
                y={cy - 28}
                textAnchor="middle"
                fill="#34d399"
                fontSize="10"
                fontFamily="monospace"
              >
                root
              </text>
            )}
          </motion.g>
        ))}
        <g stroke="#8b98a8" strokeWidth="1.5" fill="none">
          <line x1="600" y1="88" x2="540" y2="122" />
          <line x1="600" y1="88" x2="660" y2="122" />
          <line x1="540" y1="158" x2="510" y2="192" />
          <line x1="540" y1="158" x2="570" y2="192" />
          <line x1="660" y1="158" x2="630" y2="192" />
          <line x1="660" y1="158" x2="690" y2="192" />
        </g>
      </svg>
    </div>
  );
}
