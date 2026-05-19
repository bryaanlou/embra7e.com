/**
 * Standard 9-color tier palette: cool/low -> warm/high.
 * Used uniformly across all benchmarks by default; we distribute the
 * palette across however many tiers a difficulty band has so the same
 * "tier achievement level" reads consistently regardless of which
 * benchmark you're looking at.
 *
 * For per-tier-name overrides (e.g., matching evxl's canonical hexes
 * for a specific benchmark), add entries to TIER_NAME_OVERRIDES below.
 * Those take precedence over the standard palette.
 */
const TIER_PALETTE = [
  "#5A6E91", // 0 - cool slate
  "#5B8FB9", // 1 - cool blue
  "#5DA8BC", // 2 - teal
  "#67C2A6", // 3 - sea green
  "#A4C46A", // 4 - yellow-green
  "#E4C547", // 5 - gold
  "#E59A41", // 6 - amber
  "#C95A4E", // 7 - warm red
  "#9B3A5E", // 8 - deep magenta
];

/**
 * Per-tier-name color overrides. When a tier name appears here, it
 * wins over the standard palette. Useful for benchmarks where the
 * tier name is itself a color (e.g., Viscose's Cinnabar/Cerulean/etc.)
 * or where the community has an established canonical hex per tier.
 */
const TIER_NAME_OVERRIDES: Record<string, string> = {
  // populate with canonical hexes when known
};

function paletteColor(rank: number, total: number): string | undefined {
  if (rank < 1 || total < 1) return undefined;
  const i = rank - 1;
  if (total === 1) return TIER_PALETTE[Math.floor(TIER_PALETTE.length / 2)];
  const paletteIdx = Math.round(
    (i / (total - 1)) * (TIER_PALETTE.length - 1),
  );
  return TIER_PALETTE[paletteIdx];
}

/**
 * Returns the color for a given tier within a difficulty band.
 *
 * @param rank 1-based rank index (matches API's scenario_rank semantics);
 *             0 means unranked.
 * @param total total number of tiers in this band.
 * @param name optional tier name; if present and in TIER_NAME_OVERRIDES,
 *             that hex wins.
 */
export function tierColor(
  rank: number,
  total: number,
  name?: string,
): string | undefined {
  if (name && TIER_NAME_OVERRIDES[name]) return TIER_NAME_OVERRIDES[name];
  return paletteColor(rank, total);
}

/**
 * Color for a position in a list of tier names (e.g., when iterating
 * to render tier column headers).
 */
export function tierColorAtIndex(
  index: number,
  total: number,
  name?: string,
): string | undefined {
  if (name && TIER_NAME_OVERRIDES[name]) return TIER_NAME_OVERRIDES[name];
  return paletteColor(index + 1, total);
}
