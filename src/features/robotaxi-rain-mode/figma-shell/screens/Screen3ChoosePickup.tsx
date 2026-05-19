"use client";

import { useMemo, useState } from "react";
import {
  formatDistanceAway,
  pickupNearHeaderTitle,
  searchStartingPlaces,
  type StartingPlaceResult,
} from "../../data/pickupAnchorSearch";
import { isPickupAnchorDifferentFromCurrentLocation } from "../../data/scenarioHelpers";
import { useScenario } from "../ScenarioContext";
import type { PickupId } from "../types";
import { PICKUP_OPTIONS } from "../pickup-data";
import { IconPin, IconPinTeal, IconSearch } from "../icons";
import { ScreenShell } from "../ScreenShell";
import { SheetHeader } from "../SheetHeader";
import { rainModeDemoData } from "../../data/rainModeDemoData";
import { selectPickupOptions } from "../../engine/selectPickupOptions";

type Props = {
  selected: PickupId;
  onSelect: (id: PickupId) => void;
  onBack: () => void;
  onConfirm: () => void;
  onSelectStartingPlace: (place: StartingPlaceResult) => void;
};

export function Screen3ChoosePickup({
  selected,
  onSelect,
  onBack,
  onConfirm,
  onSelectStartingPlace,
}: Props) {
  const { scenario, userCurrentLocation, useCurrentLocationAsPickupAnchor } =
    useScenario();
  const [query, setQuery] = useState("");

  const anchorDiffersFromUser = isPickupAnchorDifferentFromCurrentLocation(scenario);
  const headerTitle = pickupNearHeaderTitle();
  const showSearchResults = query.trim().length > 0;

  const searchResults = useMemo(
    () => searchStartingPlaces(query, userCurrentLocation),
    [query, userCurrentLocation],
  );
  const selection = useMemo(
    () =>
      selectPickupOptions(
        rainModeDemoData.pudoCandidates,
        rainModeDemoData.walkingRoutes,
        rainModeDemoData.thresholds,
        rainModeDemoData.weights,
      ),
    [],
  );

  return (
    <ScreenShell>
      <SheetHeader onBack={onBack} title={headerTitle} />
      <label className="figma-pickup-search-wrap">
        <IconSearch size={14} />
        <span className="sr-only">Enter a location</span>
        <input
          type="search"
          className="figma-pickup-search"
          placeholder="Enter a location"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </label>

      {showSearchResults ? (
        <div className="figma-search-options">
          {searchResults.length === 0 ? (
            <p className="figma-pickup-search-empty">No places found</p>
          ) : (
            searchResults.map((place) => (
              <button
                key={place.name}
                type="button"
                className="figma-address figma-address--input"
                onClick={() => {
                  onSelectStartingPlace(place);
                  setQuery("");
                }}
              >
                <div className="figma-address-text">
                  <p className="figma-address-value">
                    {place.name} · {formatDistanceAway(place.distanceM)}
                  </p>
                  {place.hint ? (
                    <p className="figma-address-label">{place.hint}</p>
                  ) : null}
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {anchorDiffersFromUser ? (
            <button
              type="button"
              className="figma-address figma-address--input figma-pickup-use-current"
              onClick={useCurrentLocationAsPickupAnchor}
            >
              <IconPinTeal />
              <div className="figma-address-text">
                <p className="figma-address-value">Use current location</p>
              </div>
            </button>
          ) : null}
          <div className="figma-pickup-grid">
            {PICKUP_OPTIONS.map((o) => {
              const isSelected = selected === o.id;
              const zone = scenario.pickupZoneCandidates.find((z) => z.id === o.id);
              const walkLabel = zone ? `${zone.walkM} m` : o.walk;
              const exposureLabel = zone ? `${zone.exposureM} m` : o.exposureVal;
              const etaLabel = selection.etaByPudo[o.id]
                ? `${selection.etaByPudo[o.id].vehicle_eta_min} min`
                : o.etaVal;
              return (
                <button
                  key={o.id}
                  type="button"
                  className={`figma-pickup-row${isSelected ? ` is-selected ${o.selectedClass}` : ""}`}
                  onClick={() => onSelect(o.id)}
                  onPointerDown={(e) => e.stopPropagation()}
                >
                  <div className="figma-pickup-col figma-pickup-col--label">
                    <div className="pin" aria-hidden>
                      <IconPin color={o.color} size={20} />
                    </div>
                    <p className="name" style={{ color: o.color }}>
                      {o.name}
                    </p>
                    {isSelected ? (
                      <p className="sub" style={{ color: o.color }}>
                        {o.selectedSub}
                      </p>
                    ) : null}
                  </div>
                  <div className="figma-pickup-col figma-pickup-col--stat">
                    <p className="lbl">Walk</p>
                    <p className={`val${isSelected ? " bold" : ""}`}>{walkLabel}</p>
                  </div>
                  <div className="figma-pickup-col figma-pickup-col--stat">
                    <p
                      className="lbl"
                      style={{ color: isSelected ? o.exposureColor : undefined }}
                    >
                      Exposure
                    </p>
                    <p
                      className={`val${isSelected ? " bold" : ""}`}
                      style={{ color: isSelected ? o.exposureColor : undefined }}
                    >
                      {exposureLabel}
                    </p>
                  </div>
                  <div className="figma-pickup-col figma-pickup-col--stat">
                    <p
                      className="lbl"
                      style={{ color: isSelected ? o.etaLabelColor : undefined }}
                    >
                      ETA
                    </p>
                    <p
                      className={`val${isSelected ? " bold" : ""}`}
                      style={{ color: isSelected ? o.etaLabelColor : undefined }}
                    >
                      {etaLabel}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </>
      )}

      {!showSearchResults ? (
        <button type="button" className="figma-btn" onClick={onConfirm}>
          Confirm
        </button>
      ) : null}
    </ScreenShell>
  );
}
