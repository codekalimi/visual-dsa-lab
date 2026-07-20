/** Parse "1, 2 3" / "1 2 3" style integer lists. */
export function parseIntList(raw: string): number[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const parts = trimmed.split(/[\s,]+/).filter(Boolean);
  const values: number[] = [];
  for (const part of parts) {
    if (!/^-?\d+$/.test(part)) return null;
    values.push(Number(part));
  }
  return values;
}

export function parseEdgeList(raw: string): { source: string; target: string }[] | null {
  const trimmed = raw.trim();
  if (!trimmed) return [];
  const lines = trimmed.split(/\n|;/).map((l) => l.trim()).filter(Boolean);
  const edges: { source: string; target: string }[] = [];
  for (const line of lines) {
    const parts = line.split(/[\s,->]+/).filter(Boolean);
    if (parts.length !== 2) return null;
    edges.push({ source: parts[0], target: parts[1] });
  }
  return edges;
}
