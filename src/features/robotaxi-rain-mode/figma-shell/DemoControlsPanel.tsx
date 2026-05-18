"use client";

import { useEffect, useRef, useState } from "react";
import { displayPlaceLabel } from "../data/demoPlaceNames";
import { getPickupAnchor, getUserCurrentLocation } from "../data/scenarioHelpers";
import {
  formatScenarioCoords,
  getTripSetupPickupLabel,
  useScenario,
} from "./ScenarioContext";

type Props = {
  onRandomPickup: () => void;
};

function RemoteIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden
    >
      <rect
        x="4"
        y="8"
        width="16"
        height="10"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="8" cy="13" r="1.25" fill="currentColor" />
      <circle cx="12" cy="13" r="1.25" fill="currentColor" />
      <circle cx="16" cy="13" r="1.25" fill="currentColor" />
      <path
        d="M8 8V6.5A2.5 2.5 0 0 1 10.5 4h3A2.5 2.5 0 0 1 16 6.5V8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

/** Prototype-only controls — collapsible remote in the demo corner */
export function DemoControlsPanel({ onRandomPickup }: Props) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const {
    scenario,
    routesLoading,
    randomDropoff,
    generateDemoTrip,
    resetScenario,
  } = useScenario();

  const pickupTitle =
    getTripSetupPickupLabel(scenario) ||
    displayPlaceLabel(scenario.pickupAnchorLocation.label) ||
    "—";
  const dropoffTitle =
    displayPlaceLabel(scenario.dropoffLocation.label) || "—";
  const hasDropoff = Boolean(scenario.dropoffLocation.label?.trim());
  const user = getUserCurrentLocation(scenario);
  const anchor = getPickupAnchor(scenario);
  const status =
    routesLoading
      ? "Loading routes…"
      : scenario.routesMissing && scenario.routesMessage
        ? scenario.routesMessage
        : null;

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={rootRef}
      className={`robotaxi-demo-controls${open ? " is-open" : ""}`}
    >
      <button
        type="button"
        className="robotaxi-demo-controls__toggle"
        aria-expanded={open}
        aria-controls="robotaxi-demo-controls-panel"
        aria-label={open ? "Close demo simulator" : "Open demo simulator"}
        onClick={() => setOpen((value) => !value)}
      >
        <RemoteIcon />
      </button>

      {open ? (
        <div
          id="robotaxi-demo-controls-panel"
          className="robotaxi-demo-controls__popover"
          role="dialog"
          aria-label="Internal trip simulator"
          onPointerDown={(event) => event.stopPropagation()}
        >
          <div className="robotaxi-demo-controls__glass">
            <div className="robotaxi-demo-controls__head">
              <h2 className="robotaxi-demo-controls__title">Demo</h2>
              <p className="robotaxi-demo-controls__hint">
                Internal trip simulator
              </p>
            </div>

            <div className="robotaxi-demo-controls__chips">
              <button
                type="button"
                className="robotaxi-demo-controls__chip"
                onClick={onRandomPickup}
              >
                Random pick-up
              </button>
              <button
                type="button"
                className="robotaxi-demo-controls__chip"
                onClick={randomDropoff}
              >
                Random drop-off
              </button>
            </div>

            <button
              type="button"
              className="robotaxi-demo-controls__primary"
              onClick={generateDemoTrip}
              disabled={routesLoading}
            >
              {routesLoading ? "Generating…" : "Generate trip"}
            </button>

            <div className="robotaxi-demo-controls__cards">
              <article className="robotaxi-demo-controls__card">
                <span className="robotaxi-demo-controls__card-kicker">
                  Pick-up
                </span>
                <p
                  className="robotaxi-demo-controls__card-title"
                  title={pickupTitle}
                >
                  {pickupTitle}
                </p>
                <p className="robotaxi-demo-controls__card-coords">
                  {formatScenarioCoords(anchor.lng, anchor.lat)}
                </p>
              </article>
              <article className="robotaxi-demo-controls__card">
                <span className="robotaxi-demo-controls__card-kicker">
                  Drop-off
                </span>
                <p
                  className="robotaxi-demo-controls__card-title"
                  title={hasDropoff ? dropoffTitle : undefined}
                >
                  {dropoffTitle}
                </p>
                <p className="robotaxi-demo-controls__card-coords">
                  {hasDropoff
                    ? formatScenarioCoords(
                        scenario.dropoffLocation.lng,
                        scenario.dropoffLocation.lat,
                      )
                    : "—"}
                </p>
              </article>
              <article className="robotaxi-demo-controls__card">
                <span className="robotaxi-demo-controls__card-kicker">You</span>
                <p className="robotaxi-demo-controls__card-coords">
                  {formatScenarioCoords(user.lng, user.lat)}
                </p>
              </article>
            </div>

            <footer className="robotaxi-demo-controls__foot">
              <span className="robotaxi-demo-controls__seed">
                Seed {scenario.scenarioSeed}
              </span>
              {status ? (
                <span className="robotaxi-demo-controls__status">{status}</span>
              ) : null}
              <button
                type="button"
                className="robotaxi-demo-controls__reset"
                onClick={resetScenario}
              >
                Reset
              </button>
            </footer>
          </div>
        </div>
      ) : null}
    </div>
  );
}
