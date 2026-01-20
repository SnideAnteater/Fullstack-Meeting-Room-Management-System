/**
 * Format IC Number to Malaysian format: YYMMDD-PB-###G
 * @param ic - 12 digit IC number
 * @returns Formatted IC string
 */
export function formatIC(ic: string): string {
  if (!ic || ic.length !== 12) return ic;
  return `${ic.slice(0, 6)}-${ic.slice(6, 8)}-${ic.slice(8, 12)}`;
}

/**
 * Remove formatting from IC Number
 * @param ic - Formatted or unformatted IC
 * @returns Clean 12 digit IC
 */
export function cleanIC(ic: string): string {
  return ic.replace(/-/g, "");
}
