/**
 * Converts PM2.5 concentration (µg/m³) to the equivalent number of cigarettes smoked per day.
 * Based on the rough estimate: 22 µg/m³ ≈ smoking 1 cigarette/day
 * @param pm25 - PM2.5 concentration in µg/m³
 * @returns Estimated number of cigarettes
 */

export function pm25ToCigarettes(pm25: number): number {
  const cigaretteEquivalent = 22; // µg/m³ per cigarette per day
  return +(pm25 / cigaretteEquivalent).toFixed(2); // limit to 2 decimal places
}
