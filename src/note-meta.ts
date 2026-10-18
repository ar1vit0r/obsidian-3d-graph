export interface NoteMeta {
  status?: string;
  area?: string;
  priority?: number;
  effort?: number;
  return?: number;
  friction?: number;
  score?: number;
}

const toNum = (v: unknown): number | undefined => {
  const n = typeof v === "number" ? v : typeof v === "string" ? Number.parseFloat(v) : Number.NaN;
  return Number.isFinite(n) ? n : undefined;
};

const toStr = (v: unknown): string | undefined =>
  typeof v === "string" && v.trim() !== "" ? v.trim() : undefined;

/** Priority 1 (urgent) to 4 (someday); effort and return 1 to 5. Needs all three. */
export function computeScore(m: NoteMeta): number | undefined {
  if (m.priority === undefined || m.return === undefined) return undefined;
  if (m.effort === undefined || m.effort <= 0) return undefined;
  // Clamped: an out-of-range priority (6+) would give a negative score and a negative node size.
  return Math.max(0, (m.return * (6 - m.priority)) / m.effort);
}

/** Returns undefined when the note has none of the classification fields. */
export function readNoteMeta(fm: Record<string, unknown> | undefined): NoteMeta | undefined {
  if (!fm) return undefined;
  const meta: NoteMeta = {
    status: toStr(fm.status),
    area: toStr(fm.area),
    priority: toNum(fm.priority),
    effort: toNum(fm.effort),
    return: toNum(fm.return),
    friction: toNum(fm.friction),
  };
  meta.score = computeScore(meta);
  return Object.values(meta).some((v) => v !== undefined) ? meta : undefined;
}
