/**
 * Portfolio entry re-exports the Figma 4-screen demo.
 * Scenario state lives in figma-shell/ScenarioContext.tsx.
 */
export { FigmaRainModeDemo as RobotaxiRainModeDemo } from "../figma-shell/FigmaRainModeDemo";
export { ScenarioProvider, useScenario } from "../figma-shell/ScenarioContext";
export type { RobotaxiScenario } from "../data/scenarioTypes";
