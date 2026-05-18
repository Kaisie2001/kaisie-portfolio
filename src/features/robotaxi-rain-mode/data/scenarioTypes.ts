import type { FeatureCollection, LineString, Polygon } from "geojson";
import type { PickupZoneType } from "./pickupZoneTypes";

export type PickupZoneId = "closest" | "sheltered" | "soonest";

export type { PickupZoneType };

export type PudoZoneValidity = "assumed_valid_for_demo";

export type ScenarioLocation = {
  lng: number;
  lat: number;
  label: string;
};

/**
 * Valid roadside Robotaxi boarding zone (curbside segment).
 * Shelter-adjacent options also include a nearby shelteredWaitingPoint for on-foot waiting.
 */
export type PudoZoneState = {
  id: PickupZoneId;
  /** Product semantics — sheltered UI id uses shelter_adjacent */
  type: PickupZoneType;
  label: string;
  /** Curb-side pickup area polygon (visible on map) */
  geometry: Polygon;
  /** @alias geometry */
  zoneGeometry?: Polygon;
  /** Road centerline through the boarding zone */
  centerline: LineString;
  /** Robotaxi stop point on the roadside segment */
  representativePoint: { lng: number; lat: number };
  /** @deprecated use representativePoint — kept for route APIs */
  lng: number;
  lat: number;
  /** Nearby sheltered waiting area (mall entrance, canopy, etc.) — not a vehicle stop */
  shelteredWaitingPoint?: ScenarioLocation;
  distanceToShelterM?: number;
  anchorDistanceM: number;
  walkM: number;
  exposureM: number;
  coveredM: number;
  vehicleEtaMin: number;
  /** Roadside zone geometry is simulated for demo */
  isSimulated: boolean;
  /** Sheltered waiting point is simulated when no shelter GIS is available */
  isSimulatedShelter: boolean;
  validity: PudoZoneValidity;
};

/** @deprecated use PudoZoneState */
export type PickupZoneState = PudoZoneState;

export type WalkingRouteSegmentType = "covered" | "exposed";

export type WalkingRouteSegment = {
  segmentId: string;
  segmentType: WalkingRouteSegmentType;
  geometry: LineString;
  distanceM: number;
  /** Simulated when shelter geometry is unavailable */
  isSimulated?: boolean;
};

export type WalkingRouteToPickup = {
  segments: WalkingRouteSegment[];
  isSimulatedExposure: boolean;
  totalWalkM?: number;
  totalCoveredM?: number;
  totalExposedM?: number;
};

export type RequestStatus = "idle" | "searching" | "assigned" | "onTheWay";

export type RobotaxiScenario = {
  scenarioSeed: number;
  /** Blue dot — passenger GPS; not necessarily the boarding point */
  userCurrentLocation: ScenarioLocation;
  /** Where the user wants to start from (search / POI / current location) */
  pickupAnchorLocation: ScenarioLocation;
  pickupAnchorName?: string;
  pickupZoneCandidates: PudoZoneState[];
  selectedZoneId: PickupZoneId;
  selectedPickupZone?: PudoZoneState | null;
  pickupPlaceLabel?: string;
  pickupZoneConfirmed?: boolean;

  dropoffAnchorLocation: ScenarioLocation;
  dropoffAnchorName?: string;
  dropoffZoneCandidates: PudoZoneState[];
  selectedDropoffZone?: PudoZoneState | null;
  /** Display label — mirrors dropoffAnchorName */
  dropoffLocation: ScenarioLocation;

  requestStatus?: RequestStatus;
  vehicleLocation?: ScenarioLocation;

  tripRoute?: FeatureCollection<LineString>;
  /** @deprecated use tripRoute */
  tripOverviewRoute?: FeatureCollection<LineString>;

  walkingRoutes?: Partial<Record<PickupZoneId, WalkingRouteToPickup>>;
  walkingRouteToPickup?: WalkingRouteToPickup;
  /** @deprecated use walkingRouteToPickup */
  walkingRouteToSelectedPickup?: WalkingRouteToPickup;

  vehicleRouteToPickup?: FeatureCollection<LineString>;
  /** @deprecated use vehicleRouteToPickup */
  vehicleRoute?: FeatureCollection<LineString>;
  vehicleRouteToSelectedPickup?: FeatureCollection<LineString>;

  pudoRoadDataMissing?: boolean;
  pudoMessage?: string;
  routesMissing?: boolean;
  routesMessage?: string;
};

export type RouteFeatureCollection = FeatureCollection<LineString>;
