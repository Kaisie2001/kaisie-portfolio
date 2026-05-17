"use client";

import { useState } from "react";
import type { FigmaScreen, PickupId } from "./types";
import { PhoneFrame } from "./PhoneFrame";
import { Screen1Destination } from "./screens/Screen1Destination";
import { Screen2ServiceStatus } from "./screens/Screen2ServiceStatus";
import { Screen3ChoosePickup } from "./screens/Screen3ChoosePickup";
import { Screen4OnTheWay } from "./screens/Screen4OnTheWay";

/**
 * Figma 00robotaxi — 4-screen product flow (screenshots only).
 * 1 Destination → 2 Service → 3 Choose pickup → 4 On the way
 */
export function FigmaRainModeDemo() {
  const [screen, setScreen] = useState<FigmaScreen>(1);
  const [pickup, setPickup] = useState<PickupId>("sheltered");
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div style={{ position: "relative" }}>
      <PhoneFrame>
        {screen === 1 ? (
          <Screen1Destination onContinue={() => setScreen(2)} />
        ) : null}
        {screen === 2 ? (
          <Screen2ServiceStatus
            onBack={() => setScreen(1)}
            onContinue={() => setScreen(3)}
          />
        ) : null}
        {screen === 3 ? (
          <Screen3ChoosePickup
            selected={pickup}
            onSelect={setPickup}
            onBack={() => setScreen(2)}
            onRequest={() => setScreen(4)}
          />
        ) : null}
        {screen === 4 ? (
          <Screen4OnTheWay
            onBack={() => setScreen(3)}
            onStartWalking={() => {
              setToast("Navigation started.");
              window.setTimeout(() => setToast(null), 2500);
            }}
          />
        ) : null}
      </PhoneFrame>
      {toast ? (
        <div
          role="status"
          style={{
            position: "absolute",
            bottom: 8,
            left: "50%",
            transform: "translateX(-50%)",
            padding: "8px 16px",
            borderRadius: 999,
            background: "#1c1c1e",
            color: "#fff",
            fontSize: 13,
            fontWeight: 500,
            whiteSpace: "nowrap",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {toast}
        </motion>
      ) : null}
    </motion>
  );
}
