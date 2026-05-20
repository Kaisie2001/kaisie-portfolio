# AeroRoute 3D Research Notes

## 1. Research Purpose

This file summarizes the desk research behind AeroRoute 3D.

The goal is not to create a literature review, but to clarify why the product problem is valid, what evidence supports the project framing, and where the current MVP should avoid overclaiming.

AeroRoute 3D focuses on pre-operation route assessment for dense-city drone delivery. It does not claim to be a real-time flight-control system or a live drone dispatch platform.

---

## 2. Core Research Questions

### Q1. Why does dense-city drone delivery need route-readiness assessment before launch?

Dense urban environments introduce route-level constraints that are not visible in a simple 2D shortest path. Buildings, restricted zones, landing-node feasibility, weather sensitivity, and operational trade-offs jointly determine whether a drone corridor is actually usable.

### Q2. Why is 3D assessment necessary?

In high-density cities, route feasibility depends on vertical space, building clearance, altitude bands, and airspace restrictions. A route that appears direct on a 2D map may become risky or infeasible once placed inside a 3D urban environment.

### Q3. Why include extreme heat or thermal susceptibility?

Extreme heat should not be treated as a claim of real-time thermal updraft detection. In this MVP, historical LST anomaly is used as a thermal susceptibility proxy to support scenario-based route screening.

### Q4. Why use synthetic candidate landing nodes?

Public commercial drone landing-node or vertiport data is not yet available for the selected Hong Kong context. Synthetic candidate landing nodes are generated for PoC route-pair evaluation, while real spatial constraints such as buildings, restricted zones, and thermal susceptibility layers are used where available.

---

## 3. Source Inventory

### 3.1 Industry and Operations

Potential source directions:
- Meituan drone delivery and urban low-altitude logistics materials
- Wing drone delivery operation model
- DJI FlyCart 30 product specifications and user manual
- Low-altitude economy white papers and industry reports

Use in project:
- Support the claim that drone delivery is moving from flight demos to urban operations.
- Support the idea that modern drone delivery relies on automated systems, fleet monitoring, and operational decision layers.
- Support the need for route-level assessment before pilot operation.

### 3.2 Regulation and Restricted Zones

Potential source directions:
- Hong Kong CAD Small Unmanned Aircraft framework
- eSUA Drone Map
- Hong Kong restricted flying zones and SUA operation requirements

Use in project:
- Support the inclusion of restricted-zone screening.
- Support the idea that route planning must consider regulatory constraints before operation.
- Justify why no-fly or restricted areas should become hard constraints in the product logic.

### 3.3 Device Capability Boundaries

Potential source directions:
- DJI FlyCart 30 specifications and manual
- Drone operation manuals and technical constraints

Use in project:
- Support the idea that device capability is conditional.
- Specs such as range, flight time, wind resistance, and working temperature are often measured under controlled conditions.
- Real-city deployment still requires local route assessment.

### 3.4 Urban 3D Constraints

Potential source directions:
- Urban air mobility and built environment research
- Urban canyon / building interaction studies
- 3D path planning and obstacle avoidance literature

Use in project:
- Support the idea that dense cities create complex airspace constraints.
- Support 3D building geometry as a necessary input for route-readiness screening.
- Justify the shift from 2D path planning to 3D corridor assessment.

### 3.5 Thermal Susceptibility

Potential source directions:
- Urban heat island research
- LST anomaly methods
- UAM / UAV literature on thermal effects and urban microclimate
- User’s previous Hong Kong route-level thermal exposure research

Use in project:
- Support the creation of a thermal susceptibility layer.
- The layer should be framed as a proxy, not a real-time thermal updraft detection system.
- The project transfers spatial-risk thinking from urban heat exposure research into drone corridor assessment.

---

## 4. Key Research Findings

### Finding 1 — Drone delivery is becoming an urban operations problem

Drone delivery is no longer only about whether a drone can fly. As services move into commercial districts, communities, scenic areas, and local delivery networks, the key question becomes whether a route can operate safely, repeatedly, and explainably in real urban conditions.

Product implication:
AeroRoute 3D should be positioned as a route-readiness assessment tool, not a flight demo.

---

### Finding 2 — A drone route is not just a shortest path

In dense cities, route feasibility is shaped by 3D buildings, restricted zones, candidate landing nodes, weather sensitivity, and operational trade-offs. A short route may be efficient but operationally risky.

Product implication:
The product should compare multiple route strategies: baseline, safety-first, and balanced routes.

---

### Finding 3 — Existing operational systems focus on execution, monitoring, and automation

Drone delivery systems often emphasize automated routing, fleet monitoring, and exception handling. Before route execution, teams still need a structured way to compare candidate corridors and decide whether a route is ready for pilot operation.

Product implication:
AeroRoute 3D should focus on the earlier stage: route readiness before route launch.

---

### Finding 4 — Device specifications do not equal real-city route readiness

Drone specifications are often measured under controlled conditions. Real deployment conditions may include dense urban geometry, weather variation, restricted zones, and uncertain landing-node conditions.

Product implication:
The product should help translate device and route constraints into local operational decisions.

---

### Finding 5 — Thermal data must be framed carefully

Historical LST anomaly can support thermal susceptibility screening, but it should not be described as real-time thermal updraft detection.

Product implication:
Use careful wording:
- thermal susceptibility proxy
- scenario-based heat risk activation
- route-level risk screening

Avoid:
- real-time heat plume detection
- crash prediction
- guaranteed safety improvement

---

## 5. Product Implications

### 5.1 Product Positioning

AeroRoute 3D should be positioned as:

A 3D route-readiness sandbox for dense-city drone delivery.

It supports route launch and operations strategy teams before a route enters pilot operation.

### 5.2 Target Users

Primary users:
- Route launch manager
- Operations strategy PM
- Solution consultant / industry solution team

The product is not designed for:
- Individual drone pilots
- Real-time remote controllers
- Flight-control engineers operating live aircraft

### 5.3 Core Business Action

The core business action is:

Evaluate whether a candidate drone corridor is ready for launch.

The output should support decisions such as:
- approve
- reroute
- suspend under heat scenario
- adjust candidate landing node
- request field validation
- export route-readiness report

### 5.4 MVP Data Logic

Use real or evidence-based spatial constraints where possible:
- 3D building geometry
- restricted flying zones
- historical thermal susceptibility layers
- base map layers

Use synthetic data only where public operational data is unavailable:
- candidate landing-node database
- landing suitability score
- example route pairs
- readiness level

---

## 6. Claims We Can Use

These claims are suitable for the portfolio page:

- Drone delivery is moving from flight demos to urban operations.
- A drone route is not just a line between two points.
- Dense-city route feasibility depends on 3D geometry, restricted zones, landing nodes, and operational trade-offs.
- AeroRoute 3D focuses on route readiness before route launch.
- Historical LST anomaly is used as a thermal susceptibility proxy.
- Synthetic candidate landing nodes are used for PoC route-pair evaluation.
- The MVP does not claim real-time flight control or real-time thermal updraft detection.

---

## 7. Claims to Avoid

Avoid these claims unless verified with strong evidence:

- The system prevents drone crashes.
- The system reduces battery consumption by a specific percentage.
- The system detects real-time thermal updrafts.
- The system controls live drones.
- The dataset represents real commercial vertiport locations.
- The system is ready for enterprise deployment.
- The model accurately simulates urban CFD wind fields.
- The platform guarantees safe routes.

---

## 8. Open Questions

These questions should remain open for later validation:

1. What real operational data would a drone delivery company use for route launch assessment?
2. How do companies internally score route risk before launching a new corridor?
3. What regulatory approval workflow would be required for dense-city drone delivery in Hong Kong?
4. How can synthetic landing nodes be replaced by verified logistics hubs, rooftops, drone stations, or approved landing zones?
5. What weather variables should be prioritized after extreme heat: wind, rain, visibility, or thunderstorm risk?
6. How can route-readiness scores be validated with real flight logs or telemetry data?
7. How should the product balance explainability with technical accuracy?

---

## 9. Research-to-Product Mapping

| Research Finding | Product Decision |
|---|---|
| Dense cities create 3D route constraints | Build a 3D route-readiness sandbox |
| Restricted zones affect operational feasibility | Add restricted-zone screening |
| Device specs are measured under controlled conditions | Add route-level local assessment |
| Weather warnings are too coarse for corridor decisions | Add scenario-based thermal susceptibility layer |
| Public landing-node data is unavailable | Use synthetic candidate landing-node database |
| Teams need explainable decisions | Add route comparison and recommendation panel |

---

## 10. Notes for Portfolio Writing

The portfolio page should not read like a market report or academic paper.

Use concise product language:
- route readiness
- pre-operation assessment
- candidate corridor
- 3D spatial constraints
- synthetic landing-node database
- thermal susceptibility proxy
- explainable route decision

Avoid over-explaining technical details in the intro section. Save algorithms, scoring logic, and data processing for the technical implementation section.