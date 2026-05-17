"use client";

import { useState } from "react";
import type { PickupZoneId } from "../data/mapModes";
import type { RainModeScreen } from "../data/types";
import { PhoneFrame } from "./PhoneFrame";
import { ChoosePickupScreen } from "./screens/ChoosePickupScreen";
import { OnTheWayScreen } from "./screens/OnTheWayScreen";
import { RainModeEntryScreen } from "./screens/RainModeEntryScreen";
import { ServiceStatusScreen } from "./screens/ServiceStatusScreen";

/** Figma 00robotaxi — 4-screen static UI shell (map placeholders only) */
export function RobotaxiRainModeDemo() {
  const [screen, setScreen] = useState<RainModeScreen>("rainModeEntry");
  const [selected, setSelected] = useState<PickupZoneId>("sheltered");
  const [toast, setToast] = useState<string | null>(null);

  return (
    <div className="relative">
      <PhoneFrame>
        {screen === "rainModeEntry" ? (
          <RainModeEntryScreen
            mode="confirmDestination"
            onContinue={() => setScreen("serviceStatus")}
          />
        ) : null}

        {screen === "serviceStatus" ? (
          <ServiceStatusScreen onContinue={() => setScreen("choosePickup")} />
        ) : null}

        {screen === "choosePickup" ? (
          <ChoosePickupScreen
            selected={selected}
            onSelect={setSelected}
            onConfirm={() => setScreen("onTheWay")}
          />
        ) : null}

        {screen === "onTheWay" ? (
          <OnTheWayScreen
            onStartWalking={() => {
              setToast("Navigation started.");
              window.setTimeout(() => setToast(null), 2800);
            }}
            onChangePickup={() => setScreen("choosePickup")}
          />
        ) : null}
      </PhoneFrame>

      {toast ? (
        <div
          className="pointer-events-none absolute bottom-2 left-1/2 z-50 -translate-x-1/2 rounded-full bg-stone-900 px-4 py-2 text-[13px] font-medium text-white shadow-lg"
          role="status"
        >
          {toast}
        </div>
      ) : null}
    </div>
  );
}
