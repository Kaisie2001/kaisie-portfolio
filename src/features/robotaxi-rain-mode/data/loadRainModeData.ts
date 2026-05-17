import { normalizeDemoBundle } from "./demoDataAdapter";
import type { RainModeDemoBundle, RawRainModeBundle } from "./types";
import rawBundle from "./rain_mode_demo_bundle.json";

/**
 * Loads and normalizes the Rain Mode demo bundle.
 * Today: local JSON copy of Robotaxi_Portfolio/data/demo/robotaxi_demo_data_pack/rain_mode_demo_bundle.json
 * Future: swap implementation to fetch from API / production adapter without changing UI.
 */
export async function loadRainModeData(): Promise<RainModeDemoBundle> {
  return normalizeDemoBundle(rawBundle as RawRainModeBundle);
}
