/**
 * Structured slide content for AeroRoute 3D case study intro.
 * Visible copy only — full editorial source: website-copy.md
 */

export type AeroRouteSlideCard = {
  title: string;
  body: string;
};

export type AeroRouteSlide = {
  id: string;
  number: string;
  label: string;
  title: string;
  body: string;
  cards?: AeroRouteSlideCard[];
  tags?: string[];
  note?: string;
  sourceNote?: string;
  layoutHint?: string;
};

export const aeroRouteSlides: AeroRouteSlide[] = [
  {
    id: "hero",
    number: "00",
    label: "00 Hero",
    title: "AeroRoute 3D",
    body: "A 3D route-readiness sandbox for dense-city drone delivery. Before a drone corridor goes live, AeroRoute 3D helps route launch teams evaluate whether it is operationally feasible under dense urban geometry, regulatory constraints, and extreme heat scenarios.",
    tags: [
      "Dense-city Drone Delivery",
      "Route Readiness",
      "3D Airspace Sandbox",
      "Extreme Heat Scenario",
    ],
    note: "Pre-operation route assessment — not a drone-control interface or live dispatch system.",
    layoutHint:
      "Large project title, concise subtitle, one short paragraph, four compact tags. Main visual: 3D sandbox with buildings, candidate landing nodes, restricted zones, and route alternatives.",
  },
  {
    id: "context",
    number: "01",
    label: "01 Context",
    title: "Drone delivery is moving from flight demos to urban operations.",
    body: "Delivery drones are no longer only experimental flying machines. They are becoming part of urban logistics systems, connecting commercial districts, communities, scenic areas, and local service nodes.",
    cards: [
      {
        title: "Urban deployment",
        body: "Drone delivery is already being tested and deployed across commercial, community, and tourism scenarios.",
      },
      {
        title: "Automated operation",
        body: "Modern drone delivery systems rely on automated route selection, fleet monitoring, and exception handling, rather than manual control of every flight.",
      },
      {
        title: "Controlled-condition limits",
        body: "Drone specifications are usually measured under controlled conditions. Real-city deployment still requires route-level assessment.",
      },
    ],
    sourceNote:
      "Source directions: Meituan urban low-altitude logistics; Wing automated delivery operations; DJI FlyCart 30 controlled-condition specifications.",
    layoutHint:
      "Three small evidence cards. Grounded tone — avoid unsupported market-size claims.",
  },
  {
    id: "problem",
    number: "02",
    label: "02 Problem",
    title: "A drone route is not just a line between two points.",
    body: "In dense cities, route feasibility is shaped by buildings, restricted zones, candidate landing nodes, weather sensitivity, and operational trade-offs. A short route on a 2D map may become risky once placed inside a 3D urban environment.",
    cards: [
      {
        title: "Building obstruction",
        body: "High-rise geometry turns a 2D path into a 3D clearance problem.",
      },
      {
        title: "Regulatory constraint",
        body: "Restricted flying zones must be checked before route launch.",
      },
      {
        title: "Weather sensitivity",
        body: "Extreme heat scenarios may activate additional route risk.",
      },
      {
        title: "Operational trade-off",
        body: "A safer route may require detour; a shorter route may carry higher risk.",
      },
    ],
    note: "A short route is not always an operable route. This project focuses on pre-operation route-readiness assessment, not replacing execution or monitoring systems.",
    layoutHint:
      "Four constraint cards, visually balanced. Optional visual: flat 2D line becoming a constrained 3D corridor.",
  },
  {
    id: "research-insight",
    number: "03",
    label: "03 Research Insight",
    title: "From urban heat exposure research to drone route risk screening.",
    body: "My previous research focused on route-level thermal exposure in Hong Kong, using long-term Landsat LST anomaly, spatial networks, and built-environment indicators. This project transfers that spatial-risk thinking into a new mobility context: drone corridor assessment.",
    cards: [
      {
        title: "From exposure surface",
        body: "Long-term thermal anomaly can be transformed into a spatial risk layer.",
      },
      {
        title: "From route analysis",
        body: "Route-level indicators can reveal risk differences between alternative corridors.",
      },
      {
        title: "From urban diagnosis",
        body: "Built environment data can explain why some corridors are more exposed or constrained.",
      },
    ],
    note: "Does not claim real-time thermal updraft detection. Historical LST anomaly is used as a thermal susceptibility proxy for scenario-based route assessment — not proof of drone crash risk.",
    layoutHint:
      "One main paragraph, three method-transfer cards, one visually distinct boundary note.",
  },
  {
    id: "target-user",
    number: "04",
    label: "04 Target User",
    title: "Designed for route launch and operations strategy teams.",
    body: "The users are not individual drone pilots. They are the teams responsible for deciding whether a candidate route should be launched, adjusted, suspended, or sent for field validation.",
    cards: [
      {
        title: "Route Launch Manager",
        body: "Decide whether a new delivery corridor is ready for pilot operation. Needs route feasibility, clearance risks, restricted-zone conflicts, and a launch recommendation.",
      },
      {
        title: "Operations Strategy PM",
        body: "Compare route strategies under different operating scenarios. Needs baseline, safety, and balanced routes with clear risk explanation.",
      },
      {
        title: "Solution Consultant",
        body: "Explain route feasibility to city partners, business teams, or internal stakeholders. Needs a 3D sandbox, route-readiness report, and visual evidence.",
      },
    ],
    note: "Supports pre-operation decision-making — does not replace flight control engineers or pilots.",
    layoutHint: "Three concise persona cards. Operational/product roles, not consumer personas.",
  },
  {
    id: "user-pain-points",
    number: "05",
    label: "05 User Pain Points",
    title: "Early route screening is fragmented.",
    body: "Teams need to check buildings, restricted zones, landing nodes, and weather-related risks across different tools. This makes early-stage route screening slow, fragmented, and difficult to explain.",
    cards: [
      {
        title: "Fragmented screening",
        body: "Buildings, restricted zones, landing nodes, and weather risks are often checked separately.",
      },
      {
        title: "2D blind spots",
        body: "A short route may fail once building clearance and altitude constraints are considered.",
      },
      {
        title: "Coarse weather decisions",
        body: "A city-level heat warning does not explain which candidate route should be adjusted or avoided.",
      },
    ],
    note: "The pain is decision fragmentation — not missing data entirely.",
    layoutHint: "Three minimal pain cards. Product discovery tone, not a literature review.",
  },
  {
    id: "product-opportunity",
    number: "06",
    label: "06 Product Opportunity",
    title: "Route readiness before route launch.",
    body: "Existing drone systems focus heavily on flight execution, automation, and fleet monitoring. Before a route reaches that stage, teams still need a structured way to compare candidate corridors, explain risks, and decide whether a route is ready for pilot operation.",
    cards: [
      {
        title: "Before execution",
        body: "Evaluate route feasibility before live operation.",
      },
      {
        title: "Before field validation",
        body: "Prioritize which candidate routes deserve on-site checking.",
      },
      {
        title: "Before operational risk",
        body: "Prepare alternate corridors for extreme heat scenarios.",
      },
      {
        title: "Before stakeholder review",
        body: "Turn spatial constraints into explainable route decisions.",
      },
    ],
    note: "Pre-operation assessment layer — not a replacement for existing flight execution or fleet monitoring tools.",
    layoutHint: 'Four "Before…" cards. Transition slide from problem to product.',
  },
  {
    id: "design-question",
    number: "07",
    label: "07 Design Question",
    title:
      "How might we help drone delivery teams evaluate route readiness before launch?",
    body: "AeroRoute 3D turns 3D urban constraints and thermal susceptibility into explainable route decisions, helping teams compare baseline, safety-first, and balanced corridors before field testing or pilot operation.",
    note: "Core question: How might we help drone delivery teams evaluate route readiness before launch, by turning 3D urban constraints and thermal susceptibility into explainable route decisions?",
    layoutHint:
      "Large typography for the design question. Spacious, clean — hinge slide before scope and data strategy.",
  },
  {
    id: "scope",
    number: "08",
    label: "08 Scope",
    title: "Pre-operation assessment, not real-time flight control.",
    body: "The MVP focuses on evaluating candidate routes within a selected Hong Kong district using 3D buildings, restricted-zone data, a synthetic candidate landing-node database, and historical thermal susceptibility layers.",
    cards: [
      {
        title: "Included in MVP",
        body: "3D route-readiness sandbox · candidate landing-node database · restricted-zone screening · thermal susceptibility scenario · baseline / safety / balanced route comparison · route readiness recommendation",
      },
      {
        title: "Excluded from MVP",
        body: "Real-time flight control · real-time thermal updraft detection · multi-drone traffic control · enterprise API dispatch · full CFD wind simulation · real commercial vertiport network",
      },
    ],
    note: "Clear scope boundaries are part of product maturity — not hidden limitations.",
    layoutHint: "Two-column Included / Excluded layout. Honest, professional tone.",
  },
  {
    id: "data-strategy",
    number: "09",
    label: "09 Data Strategy",
    title: "Real constraints. Synthetic nodes. Clear boundaries.",
    body: "The project separates real spatial constraints from simulated operating inputs. Buildings, restricted zones, and thermal susceptibility are used as spatial evidence. Candidate landing nodes are generated as a synthetic database to support route-pair evaluation where public commercial vertiport data is not yet available.",
    cards: [
      {
        title: "Real spatial constraints",
        body: "3D buildings, restricted zones, and base map layers define where routes cannot or should not pass.",
      },
      {
        title: "Thermal susceptibility proxy",
        body: "Historical LST anomaly is used to identify areas that may become more sensitive under extreme heat scenarios.",
      },
      {
        title: "Synthetic landing-node database",
        body: "A simulated database of candidate landing nodes supports route-pair generation, filtering, and readiness scoring.",
      },
      {
        title: "Transparent data boundary",
        body: "The MVP does not claim access to real commercial vertiports, real-time telemetry, or real-time thermal updrafts.",
      },
    ],
    note: "Synthetic nodes are generated for PoC route-pair evaluation — not a real commercial vertiport network.",
    layoutHint:
      "Four data cards. Optional small preview of the candidate landing-node database.",
  },
  {
    id: "evidence-cards",
    number: "10",
    label: "10 Evidence Cards",
    title: "Evidence behind the product framing.",
    body: "The product framing is based on drone delivery operations, automated fleet logic, controlled-condition device specifications, and Hong Kong’s regulatory context.",
    cards: [
      {
        title: "Industry deployment",
        body: "Drone delivery has moved into multi-scenario urban operation, including commercial districts, communities, and scenic areas.",
      },
      {
        title: "Automation model",
        body: "Drone operators increasingly monitor systems rather than manually control each flight.",
      },
      {
        title: "Device capability boundary",
        body: "Drone specifications are measured under controlled conditions; real-city deployment requires local route assessment.",
      },
      {
        title: "Regulatory layer",
        body: "Hong Kong provides an official SUA regulatory framework and eSUA Drone Map, making regulatory screening part of route preparation.",
      },
    ],
    sourceNote:
      "Meituan urban low-altitude logistics · Wing fleet operation model · DJI FlyCart 30 specifications · Hong Kong CAD SUA / eSUA Drone Map",
    layoutHint:
      "Four evidence cards — one claim each with a small source note. Concise signals, not a bibliography.",
  },
  {
    id: "product-preview",
    number: "11",
    label: "11 Product Preview",
    title: "Compare corridors before pilot operation.",
    body: "AeroRoute 3D turns spatial constraints into route-level decisions. Teams explore candidate corridors in a 3D sandbox, screen restricted zones and building clearance, apply thermal susceptibility scenarios, and compare baseline, safety-first, and balanced routes with an explainable readiness recommendation.",
    cards: [
      {
        title: "3D route-readiness sandbox",
        body: "Explore candidate corridors inside dense urban geometry before field testing.",
      },
      {
        title: "Restricted-zone screening",
        body: "Check regulatory constraints as part of route preparation.",
      },
      {
        title: "Thermal susceptibility scenario",
        body: "Activate extreme heat scenarios using a historical LST proxy — not real-time updraft detection.",
      },
      {
        title: "Route comparison",
        body: "Compare baseline, safety-first, and balanced corridors with operational trade-offs explained.",
      },
      {
        title: "Readiness recommendation",
        body: "Summarize whether a candidate corridor is ready for pilot operation, adjustment, or further validation.",
      },
    ],
    note: "Portfolio preview of the MVP — pre-operation route assessment, not real-time flight control.",
    layoutHint:
      "Product preview section after the intro story. Lead with 3D sandbox visual or screenshot placeholder; optional interactive embed later.",
  },
];
