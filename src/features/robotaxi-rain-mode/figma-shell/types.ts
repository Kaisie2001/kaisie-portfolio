/** 1 trip · 2 dispatch/search · 3 pickup zone · 4 en route · 5 drop-off search */
export type FigmaScreen = 1 | 2 | 3 | 4 | 5;

export type MapKind = "entry" | "service" | "pickup" | "enroute";

export type PickupId = "closest" | "sheltered" | "soonest";

/** Dispatch screen auto-flow: searching → assigned */
export type DispatchPhase = "searching" | "assigned";
