import type { ParseResult } from "../types";

export type IntentParser = {
  parse: (rawGoal: string, wechatConstraint: string, seedContent: string) => ParseResult;
};

